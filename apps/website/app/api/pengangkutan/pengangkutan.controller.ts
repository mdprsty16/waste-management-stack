import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as pengangkutanService from './pengangkutan.service';

export async function createPengangkutanController(req: Request) {
  try {
    const body = await req.json();
    const { volume_m3_diangkut, keterangan } = body;

    if (!volume_m3_diangkut || isNaN(Number(volume_m3_diangkut))) {
      return errorResponse('Field volume_m3_diangkut wajib diisi dengan angka valid', 400);
    }

    const result = await pengangkutanService.createPengangkutanService({
      volume_m3_diangkut: Number(volume_m3_diangkut),
      keterangan
    });

    return successResponse(result.data, 'Berhasil mencatat pengangkutan', 201);
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mencatat pengangkutan');
  }
}

export async function getPengangkutanController(req: Request) {
  try {
    const result = await pengangkutanService.getRiwayatPengangkutanService();
    return successResponse(result.data, 'Berhasil mengambil riwayat pengangkutan');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil riwayat pengangkutan');
  }
}
