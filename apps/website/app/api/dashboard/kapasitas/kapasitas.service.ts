import * as kapasitasRepository from './kapasitas.repository';

export async function getKapasitasDashboardService() {
  const data = await kapasitasRepository.getKapasitasData();
  const { pengaturan, currentVolume } = data;
  const maxVolume = pengaturan.kapasitas_maksimal_m3;
  
  let percentage = 0;
  if (maxVolume > 0) {
    percentage = (currentVolume / maxVolume) * 100;
  }

  // Ambil transaksi historis untuk ML
  const raw_transactions = await kapasitasRepository.getRecentTransactionsForML(30);

  let estimated_days_remaining: number | string = "Menunggu data ML";
  let recommendation = "Menunggu rekomendasi...";
  let forecast_simulation_steps = [];

  // Panggil API Python ML (FastAPI)
  if (maxVolume > 0 && currentVolume > 0 && raw_transactions.length > 0) {
    try {
      const mlResponse = await fetch(`${process.env.ML_SERVER_URL || "http://127.0.0.1:8000"}/api/v1/predict/threshold-dss`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          threshold_m3: maxVolume,
          current_fill_m3: currentVolume,
          raw_transactions: raw_transactions
        })
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        estimated_days_remaining = mlData.days_until_threshold;
        recommendation = mlData.recommendation;
        forecast_simulation_steps = mlData.forecast_simulation_steps || [];
      } else {
        console.error("ML Service Error:", await mlResponse.text());
        estimated_days_remaining = "Error dari ML Server";
      }
    } catch (error) {
      console.error("Gagal memanggil ML Service:", error);
      estimated_days_remaining = "Server ML Tidak Aktif";
    }
  } else if (maxVolume <= 0) {
    estimated_days_remaining = "Harap setel kapasitas maksimal";
    recommendation = "Kapasitas maksimal belum diatur.";
  } else if (currentVolume <= 0) {
    estimated_days_remaining = "Gudang masih kosong";
    recommendation = "Kapasitas masih penuh.";
  } else {
    estimated_days_remaining = "Data historis tidak cukup";
    recommendation = "Membutuhkan data transaksi untuk memulai prediksi.";
  }

  return {
    success: true,
    data: {
      current_volume_m3: Number(currentVolume.toFixed(2)),
      max_volume_m3: Number(maxVolume.toFixed(2)),
      threshold_persen: pengaturan.threshold_persen,
      percentage: Number(percentage.toFixed(2)),
      estimated_days_remaining,
      recommendation,
      forecast_simulation_steps
    }
  };
}
