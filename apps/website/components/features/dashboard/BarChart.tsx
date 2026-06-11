"use client";

// ============================================================
// BarChart — Komponen bar chart SVG untuk distribusi kategori
// Mendukung data dinamis dari API (tidak hardcoded)
// Digunakan di: app/dashboard/page.tsx
// ============================================================

export interface BarChartData {
  label: string;
  value: number;
  color: string;
}

export interface BarChartProps {
  data: BarChartData[];
  title: string;
  isLoading?: boolean;
}

// Palet warna dinamis — digunakan jika data dari API tanpa warna
const DYNAMIC_COLORS = [
  "#16a34a", "#2563eb", "#dc2626", "#7c3aed",
  "#d97706", "#0891b2", "#e11d48", "#4f46e5",
  "#059669", "#ca8a04", "#9333ea", "#64748b",
];

export function getColorForIndex(index: number): string {
  return DYNAMIC_COLORS[index % DYNAMIC_COLORS.length];
}

export default function BarChart({ data, title, isLoading = false }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6">{title}</h3>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium">Memuat data...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400 font-medium">
          Belum ada data kategori
        </div>
      ) : (
        <div className="flex items-end justify-between gap-3 h-48">
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
              <span className="text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.value > 0 ? `${d.value} Kg` : "—"}
              </span>
              <div
                className="w-full rounded-t-xl transition-all duration-700 ease-out min-h-[4px] hover:opacity-80"
                style={{
                  height: `${Math.max((d.value / maxVal) * 100, 3)}%`,
                  backgroundColor: d.color,
                  opacity: d.value > 0 ? 1 : 0.2,
                }}
              />
              <span className="text-xs font-bold text-gray-500 text-center leading-tight truncate w-full">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
