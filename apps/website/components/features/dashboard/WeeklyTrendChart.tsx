"use client";

import type { GrafikMingguan } from "@/types/dashboard.types";

export interface WeeklyTrendChartProps {
  data: GrafikMingguan;
  title?: string;
}

function formatKilos(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}t`;
  return val % 1 === 0 ? `${val}` : val.toFixed(1);
}

export default function WeeklyTrendChart({
  data,
  title = "Tren Sampah Mingguan",
}: WeeklyTrendChartProps) {
  const allPoints = [
    ...data.aktual.map((d) => d.total_kg),
    data.prediksi.total_kg,
  ];
  const maxVal = Math.max(...allPoints, 1);

  // Chart dimensions
  const width = 560;
  const height = 220;
  const padX = 48;
  const padY = 24;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const totalPoints = data.aktual.length + 1;

  const aktualCoords = data.aktual.map((d, i) => ({
    x: padX + (i / Math.max(totalPoints - 1, 1)) * chartW,
    y: padY + chartH - (d.total_kg / maxVal) * chartH,
    label: d.label,
    value: d.total_kg,
  }));

  const prediksiCoord = {
    x: padX + ((totalPoints - 1) / Math.max(totalPoints - 1, 1)) * chartW,
    y: padY + chartH - (data.prediksi.total_kg / maxVal) * chartH,
    label: data.prediksi.label,
    value: data.prediksi.total_kg,
  };

  const aktualPath = aktualCoords
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const aktualArea = aktualCoords.length > 0
    ? `${aktualPath} L ${aktualCoords[aktualCoords.length - 1].x} ${padY + chartH} L ${padX} ${padY + chartH} Z`
    : "";

  const lastAktual = aktualCoords[aktualCoords.length - 1];
  const prediksiPath = lastAktual
    ? `M ${lastAktual.x} ${lastAktual.y} L ${prediksiCoord.x} ${prediksiCoord.y}`
    : "";

  // Grid lines values
  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const gridValues = gridLines.map((pct) => Math.round(maxVal * pct));

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-green-600 rounded" />
            <span className="text-gray-500">Aktual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 rounded" />
            <span className="text-gray-500">Prediksi</span>
          </div>
        </div>
      </div>

      {allPoints.length <= 1 ? (
        <div className="h-56 flex flex-col items-center justify-center text-gray-400 gap-3">
          <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span className="font-medium">Data belum tersedia</span>
          <span className="text-sm">Data akan muncul setelah ada transaksi mingguan</span>
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines + Y-axis labels */}
          {gridLines.map((pct, i) => {
            const y = padY + chartH * (1 - pct);
            return (
              <g key={i}>
                <line
                  x1={padX}
                  x2={width - padX}
                  y1={y}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={padX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[9px]"
                  fill="#94a3b8"
                  fontWeight="600"
                >
                  {formatKilos(gridValues[i])}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={12}
            y={padY + chartH / 2}
            textAnchor="middle"
            transform={`rotate(-90, 12, ${padY + chartH / 2})`}
            className="text-[9px]"
            fill="#94a3b8"
            fontWeight="600"
          >
            Kg
          </text>

          {/* Gradient area — aktual */}
          {aktualArea && (
            <path d={aktualArea} fill="url(#areaGrad)" />
          )}

          {/* Gradient area — prediksi (triangle from last actual to prediction) */}
          {lastAktual && (
            <path
              d={`M ${lastAktual.x} ${lastAktual.y} L ${prediksiCoord.x} ${prediksiCoord.y} L ${prediksiCoord.x} ${padY + chartH} L ${lastAktual.x} ${padY + chartH} Z`}
              fill="url(#predGrad)"
            />
          )}

          {/* Garis aktual */}
          {aktualPath && (
            <path
              d={aktualPath}
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Garis prediksi */}
          {prediksiPath && (
            <path
              d={prediksiPath}
              fill="none"
              stroke="#d97706"
              strokeWidth="2.5"
              strokeDasharray="8 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Titik data aktual */}
          {aktualCoords.map((p, i) => (
            <g key={`aktual-${i}`}>
              {/* Value label */}
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="text-[10px]"
                fill="#16a34a"
                fontWeight="700"
              >
                {formatKilos(p.value)} Kg
              </text>
              {/* Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="white"
                stroke="#16a34a"
                strokeWidth="2.5"
              />
              {/* Month label */}
              <text
                x={p.x}
                y={padY + chartH + 16}
                textAnchor="middle"
                className="text-[10px]"
                fill="#64748b"
                fontWeight="600"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Titik prediksi */}
          <g>
            {/* Value label */}
            <text
              x={prediksiCoord.x}
              y={prediksiCoord.y - 12}
              textAnchor="middle"
              className="text-[10px]"
              fill="#d97706"
              fontWeight="700"
            >
              {formatKilos(prediksiCoord.value)} Kg
            </text>
            {/* Glow */}
            <circle
              cx={prediksiCoord.x}
              cy={prediksiCoord.y}
              r="12"
              fill="#d97706"
              opacity="0.12"
              filter="url(#glow)"
            />
            {/* Outer ring */}
            <circle
              cx={prediksiCoord.x}
              cy={prediksiCoord.y}
              r="7"
              fill="white"
              stroke="#d97706"
              strokeWidth="2.5"
            />
            {/* Inner dot */}
            <circle
              cx={prediksiCoord.x}
              cy={prediksiCoord.y}
              r="3"
              fill="#d97706"
            />
            {/* Label */}
            <text
              x={prediksiCoord.x}
              y={padY + chartH + 16}
              textAnchor="middle"
              className="text-[9px]"
              fill="#d97706"
              fontWeight="700"
            >
              Prediksi
            </text>
          </g>
        </svg>
      )}
    </div>
  );
}
