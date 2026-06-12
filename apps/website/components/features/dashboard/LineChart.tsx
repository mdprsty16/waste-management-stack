"use client";

// ============================================================
// LineChart — Komponen line chart SVG sederhana
// Digunakan di: app/dashboard/page.tsx
// ============================================================

export interface LineChartData {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LineChartData[];
  title: string;
  color?: string;
}

export default function LineChart({ data, title, color = "#16a34a" }: LineChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const width = 500;
  const height = 180;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padY + chartH - (d.value / maxVal) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || padX} ${padY + chartH} L ${padX} ${padY + chartH} Z`;

  return (
    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-extrabold text-gray-900 mb-6">{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1={padX}
            x2={width - padX}
            y1={padY + chartH * (1 - pct)}
            y2={padY + chartH * (1 - pct)}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={color} opacity="0.08" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
            <text x={p.x} y={padY + chartH + 14} textAnchor="middle" className="text-[10px]" fill="#94a3b8" fontWeight="600">
              {data[i].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
