import * as pengaturanRepository from './pengaturan.repository';

export async function getPengaturanService() {
  const data = await pengaturanRepository.getPengaturan();
  return { success: true, data };
}

export async function updatePengaturanService(data: { kapasitas_maksimal_m3: number, threshold_persen: number }) {
  const updated = await pengaturanRepository.updatePengaturan(data);
  return { success: true, data: updated };
}
