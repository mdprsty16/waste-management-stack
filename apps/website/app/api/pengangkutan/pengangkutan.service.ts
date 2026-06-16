import * as pengangkutanRepository from './pengangkutan.repository';

export async function createPengangkutanService(data: { volume_m3_diangkut: number, keterangan?: string }) {
  const result = await pengangkutanRepository.createPengangkutan(data);
  return { success: true, data: result };
}

export async function getRiwayatPengangkutanService() {
  const data = await pengangkutanRepository.getRiwayatPengangkutan();
  // Bulatkan volume_m3_diangkut ke 2 desimal — hindari float artifact MySQL
  const rounded = data.map((item) => ({
    ...item,
    volume_m3_diangkut: Math.round(item.volume_m3_diangkut * 100) / 100,
  }));
  return { success: true, data: rounded };
}
