"use client";

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

const DYNAMIC_COLORS = [
  "#16a34a", "#2563eb", "#dc2626", "#7c3aed",
  "#d97706", "#0891b2", "#e11d48", "#4f46e5",
  "#059669", "#ca8a04", "#9333ea", "#64748b",
];

export function getColorForIndex(index: number): string {
  return DYNAMIC_COLORS[index % DYNAMIC_COLORS.length];
}

const CHART_HEIGHT = 256;

export default function BarChart({ data, title, isLoading = false }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const totalVal = data.reduce((s, d) => s + d.value, 0);

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((pct) => maxVal * pct);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
        {totalVal > 0 && (
          <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            Total: {totalVal.toFixed(1)} Kg
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium">Memuat data...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">Belum ada data kategori</span>
          <span className="text-sm">Data akan muncul setelah transaksi pertama</span>
        </div>
      ) : (
        <div className="relative" style={{ height: CHART_HEIGHT }}>
          {/* Grid lines */}
          {gridValues.map((val, i) => {
            const y = (i / 4) * CHART_HEIGHT;
            return (
              <div key={i} className="absolute left-0 right-0 flex items-center pointer-events-none" style={{ top: y, height: 0 }}>
                <div className="border-t border-gray-100 w-full" />
                <span className="text-[10px] font-semibold text-gray-400 pl-2 -mt-3 w-10 text-right">
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}t` : val % 1 === 0 ? `${val}` : val.toFixed(1)}
                </span>
              </div>
            );
          })}

          {/* Y-axis unit */}
          <span className="absolute text-[9px] font-semibold text-gray-400" style={{ top: 4, left: 0 }}>
            Kg
          </span>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-around gap-2 sm:gap-4 px-10 pb-6">
            {data.map((d, i) => {
              const barH = maxVal > 0 ? (d.value / maxVal) * (CHART_HEIGHT - 24) : 2;
              const share = totalVal > 0 ? (d.value / totalVal) * 100 : 0;
              const dataKey = `${d.label}-${d.value}`;

              return (
                <div key={dataKey} className="flex flex-col items-center flex-1 min-w-0 self-stretch justify-end">
                  {/* Value label */}
                  <span className="text-xs font-bold text-gray-700 tabular-nums mb-1">
                    {d.value > 0 ? `${d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}t` : d.value % 1 === 0 ? `${d.value}` : d.value.toFixed(1)}` : "—"}
                  </span>

                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{
                      height: `${Math.max(barH, 2)}px`,
                      backgroundColor: d.color,
                      opacity: d.value > 0 ? 1 : 0.2,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                  </div>

                  {/* Label + percentage */}
                  <div className="text-center w-full mt-1.5">
                    <span className="text-[11px] font-bold text-gray-500 block leading-tight truncate px-1">
                      {d.label}
                    </span>
                    {share > 0 && (
                      <span className="text-[10px] font-semibold text-gray-400">
                        {share.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
