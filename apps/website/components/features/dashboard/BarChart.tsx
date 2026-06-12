"use client";

// ============================================================
// BarChart — Komponen bar chart SVG sederhana
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
}

export default function BarChart({ data, title }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6">{title}</h3>
      <div className="flex items-end justify-between gap-3 h-48">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-2">
            <span className="text-xs font-bold text-gray-600">
              {d.value > 0 ? d.value : "—"}
            </span>
            <div
              className="w-full rounded-t-xl transition-all duration-700 ease-out min-h-[4px]"
              style={{
                height: `${Math.max((d.value / maxVal) * 100, 3)}%`,
                backgroundColor: d.color,
                opacity: d.value > 0 ? 1 : 0.2,
              }}
            />
            <span className="text-xs font-bold text-gray-500 text-center leading-tight">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
