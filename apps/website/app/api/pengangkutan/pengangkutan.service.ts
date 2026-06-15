import * as pengangkutanRepository from './pengangkutan.repository';

export async function createPengangkutanService(data: { volume_m3_diangkut: number, keterangan?: string }) {
  const result = await pengangkutanRepository.createPengangkutan(data);
  return { success: true, data: result };
}

export async function getRiwayatPengangkutanService() {
  const data = await pengangkutanRepository.getRiwayatPengangkutan();
  return { success: true, data };
}
