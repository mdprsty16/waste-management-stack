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

function formatKilos(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}t`;
  return val % 1 === 0 ? `${val}` : val.toFixed(1);
}

export default function BarChart({ data, title, isLoading = false }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const totalVal = data.reduce((s, d) => s + d.value, 0);

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
        <div className="relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col-reverse mb-8">
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <div
                key={pct}
                className="border-t border-gray-100"
                style={{ height: "25%" }}
              />
            ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col-reverse mb-8 pointer-events-none">
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
              <div
                key={pct}
                className="flex items-center text-[10px] font-semibold text-gray-400 pr-2"
                style={{ height: "25%" }}
              >
                {formatKilos(maxVal * pct)}
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-around gap-2 sm:gap-4 h-64 pl-10">
            {data.map((d, i) => {
              const pct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
              const share = totalVal > 0 ? (d.value / totalVal) * 100 : 0;
              const dataKey = `${d.label}-${d.value}`;

              return (
                <div key={dataKey} className="flex flex-col items-center flex-1 gap-2 group min-w-0">
                  {/* Value label */}
                  <span className="text-xs font-bold text-gray-700 tabular-nums">
                    {d.value > 0 ? `${formatKilos(d.value)}` : "—"}
                  </span>

                  {/* Bar wrapper for tooltip */}
                  <div className="w-full relative flex flex-col items-center">
                    <div
                      className="w-full rounded-t-lg transition-all duration-1000 ease-out min-h-[4px] hover:opacity-80 relative overflow-hidden"
                      style={{
                        height: `${Math.max(pct, 2)}%`,
                        backgroundColor: d.color,
                        opacity: d.value > 0 ? 1 : 0.2,
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />

                      {/* Animate grow-up using keyframe */}
                      <style>{`
                        @keyframes barGrow-${i} {
                          from { transform: scaleY(0); }
                          to { transform: scaleY(1); }
                        }
                      `}</style>
                      <div
                        className="absolute inset-0 origin-bottom"
                        style={{
                          animation: `barGrow-${i} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                          backgroundColor: d.color,
                          opacity: 0.15,
                        }}
                      />
                    </div>
                  </div>

                  {/* Label and percentage */}
                  <div className="text-center w-full">
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
