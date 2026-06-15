import * as kapasitasRepository from './kapasitas.repository';

export async function getKapasitasDashboardService() {
  const data = await kapasitasRepository.getKapasitasData();
  const { pengaturan, currentVolume } = data;
  const maxVolume = pengaturan.kapasitas_maksimal_m3;
  
  let percentage = 0;
  if (maxVolume > 0) {
    percentage = (currentVolume / maxVolume) * 100;
  }
  
  // PLACEHOLDER UNTUK MODEL ML
  // Nanti akan diganti dengan hasil prediksi dari Model Machine Learning
  const estimated_days_remaining: number | string = "Menunggu data ML";

  return {
    success: true,
    data: {
      current_volume_m3: Number(currentVolume.toFixed(2)),
      max_volume_m3: maxVolume,
      threshold_persen: pengaturan.threshold_persen,
      percentage: Number(percentage.toFixed(2)),
      estimated_days_remaining
    }
  };
}
