"use client";

import type { GrafikMingguan } from "@/types/dashboard.types";

// ============================================================
// WeeklyTrendChart — Line chart tren mingguan + garis prediksi
// Menampilkan garis solid (aktual DB) dan garis putus-putus (prediksi ML)
// Digunakan di: app/dashboard/page.tsx
// ============================================================

export interface WeeklyTrendChartProps {
  data: GrafikMingguan;
  title?: string;
}

export default function WeeklyTrendChart({
  data,
  title = "📈 Tren Sampah Mingguan",
}: WeeklyTrendChartProps) {
  // Gabungkan aktual + prediksi untuk skala chart
  const allPoints = [
    ...data.aktual.map((d) => d.total_kg),
    data.prediksi_minggu_depan.total_kg,
  ];
  const maxVal = Math.max(...allPoints, 1);

  const width = 520;
  const height = 200;
  const padX = 50;
  const padY = 30;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const totalPoints = data.aktual.length + 1; // +1 untuk prediksi

  // Hitung koordinat untuk semua titik
  const aktualCoords = data.aktual.map((d, i) => ({
    x: padX + (i / Math.max(totalPoints - 1, 1)) * chartW,
    y: padY + chartH - (d.total_kg / maxVal) * chartH,
    label: d.label,
    value: d.total_kg,
  }));

  const prediksiCoord = {
    x: padX + ((totalPoints - 1) / Math.max(totalPoints - 1, 1)) * chartW,
    y: padY + chartH - (data.prediksi_minggu_depan.total_kg / maxVal) * chartH,
    label: data.prediksi_minggu_depan.label,
    value: data.prediksi_minggu_depan.total_kg,
  };

  // Path garis aktual (solid)
  const aktualPath = aktualCoords
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area fill untuk aktual
  const aktualArea = aktualCoords.length > 0
    ? `${aktualPath} L ${aktualCoords[aktualCoords.length - 1].x} ${padY + chartH} L ${padX} ${padY + chartH} Z`
    : "";

  // Garis dari titik terakhir aktual ke prediksi (putus-putus)
  const lastAktual = aktualCoords[aktualCoords.length - 1];
  const prediksiPath = lastAktual
    ? `M ${lastAktual.x} ${lastAktual.y} L ${prediksiCoord.x} ${prediksiCoord.y}`
    : "";

  return (
    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-green-600 rounded" />
            <span className="text-gray-500">Aktual DB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 rounded" />
            <span className="text-gray-500">Prediksi ML</span>
          </div>
        </div>
      </div>

      {allPoints.length <= 1 ? (
        <div className="h-48 flex items-center justify-center text-gray-400 font-medium">
          Data belum tersedia
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <g key={i}>
              <line
                x1={padX}
                x2={width - padX}
                y1={padY + chartH * (1 - pct)}
                y2={padY + chartH * (1 - pct)}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <text
                x={padX - 8}
                y={padY + chartH * (1 - pct) + 4}
                textAnchor="end"
                className="text-[9px]"
                fill="#94a3b8"
                fontWeight="600"
              >
                {Math.round(maxVal * pct)}
              </text>
            </g>
          ))}

          {/* Area fill — aktual (hijau transparan) */}
          {aktualArea && (
            <path d={aktualArea} fill="#16a34a" opacity="0.08" />
          )}

          {/* Garis aktual (solid hijau) */}
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

          {/* Garis prediksi (putus-putus amber) */}
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
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="white"
                stroke="#16a34a"
                strokeWidth="2.5"
              />
              {/* Label value */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className="text-[10px]"
                fill="#16a34a"
                fontWeight="700"
              >
                {p.value} Kg
              </text>
              {/* Label minggu */}
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
            {/* Glow effect */}
            <circle
              cx={prediksiCoord.x}
              cy={prediksiCoord.y}
              r="10"
              fill="#d97706"
              opacity="0.15"
            />
            <circle
              cx={prediksiCoord.x}
              cy={prediksiCoord.y}
              r="5"
              fill="white"
              stroke="#d97706"
              strokeWidth="2.5"
            />
            {/* Label value */}
            <text
              x={prediksiCoord.x}
              y={prediksiCoord.y - 10}
              textAnchor="middle"
              className="text-[10px]"
              fill="#d97706"
              fontWeight="700"
            >
              {prediksiCoord.value} Kg
            </text>
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
