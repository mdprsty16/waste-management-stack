import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as pengaturanService from './pengaturan.service';

export async function getPengaturanController(req: Request) {
  try {
    const result = await pengaturanService.getPengaturanService();
    return successResponse(result.data, 'Berhasil mengambil pengaturan sistem');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil pengaturan');
  }
}

export async function updatePengaturanController(req: Request) {
  try {
    const body = await req.json();
    const { kapasitas_maksimal_m3, threshold_persen } = body;

    if (kapasitas_maksimal_m3 === undefined || threshold_persen === undefined) {
      return errorResponse('Field kapasitas_maksimal_m3 dan threshold_persen wajib diisi', 400);
    }

    const result = await pengaturanService.updatePengaturanService({
      kapasitas_maksimal_m3: Number(kapasitas_maksimal_m3),
      threshold_persen: Number(threshold_persen),
    });
    
    return successResponse(result.data, 'Pengaturan sistem berhasil diperbarui');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat memperbarui pengaturan');
  }
}
