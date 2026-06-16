"use client";
import { KapasitasData } from "@/hooks/useKapasitas";

interface Props {
  data: KapasitasData | null;
  isLoading: boolean;
  onOpenSettings: () => void;
  onOpenPengangkutan: () => void;
}

export default function KapasitasCard({ data, isLoading, onOpenSettings, onOpenPengangkutan }: Props) {
  if (isLoading || !data) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-3xl w-full"></div>;
  }

  const { current_volume_m3, max_volume_m3, threshold_persen, percentage, estimated_days_remaining } = data;

  const isOverThreshold = percentage >= threshold_persen;
  const barColor = isOverThreshold ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-full w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kapasitas Gudang Sampah</h3>
          <p className="text-sm text-gray-500 mt-1">Status volume terpakai saat ini</p>
        </div>
        <button onClick={onOpenSettings} className="p-2.5 text-gray-500 hover:text-gray-800 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-4xl font-black text-gray-900">{percentage}%</span>
          <span className="text-base font-semibold text-gray-500">{current_volume_m3} / {max_volume_m3} m³</span>
        </div>
        <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden shadow-inner">
          <div className={`h-full ${barColor} transition-all duration-700 ease-out`} style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>

      {/* Tampilan visual langkah-langkah prediksi ML */}
      {data.forecast_simulation_steps && data.forecast_simulation_steps.length > 0 && (
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h4 className="text-sm font-bold text-gray-800">Simulasi Prediksi (Max 7 Hari Kedepan)</h4>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {data.forecast_simulation_steps.slice(0, 7).map((step, idx) => {
              const isPenuh = step.akumulasi_total_m3 >= max_volume_m3;
              return (
                <div key={idx} className={`flex-shrink-0 border rounded-xl p-3 w-32 flex flex-col justify-center items-center shadow-sm transition-transform hover:scale-105 ${isPenuh ? 'bg-red-50 border-red-200' : 'bg-gradient-to-b from-blue-50 to-white border-blue-100'}`}>
                  <span className={`text-xs font-black ${isPenuh ? 'text-red-700' : 'text-blue-800'}`}>{step.hari}</span>
                  <span className="text-[10px] font-medium text-gray-500 mb-1.5">{step.tanggal.slice(5)}</span>
                  <span className={`text-sm font-black ${isPenuh ? 'text-red-600' : 'text-gray-900'}`}>{step.akumulasi_total_m3} m³</span>
                  <span className={`text-[10px] font-bold ${isPenuh ? 'text-red-500' : 'text-emerald-600'}`}>+{step.prediksi_masuk_m3} m³</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl flex-1 border border-blue-100 w-full">
          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="text-sm font-medium">
            <span className="font-extrabold text-blue-900 block mb-0.5">Prediksi AI (Kapasitas Gudang)</span> 
            {data.recommendation ? data.recommendation : (typeof estimated_days_remaining === "number" ? `Diperkirakan penuh dalam ${estimated_days_remaining} hari` : estimated_days_remaining)}
          </div>
        </div>
        <button
          onClick={onOpenPengangkutan}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-lg shadow-emerald-200 hover:-translate-y-0.5 w-full sm:w-auto cursor-pointer"
        >
          Catat Pengangkutan
        </button>
      </div>
    </div>
  );
}
