import { successResponse } from '../../../lib/response';
import { handleControllerError } from '../../../lib/errorHandler';
import * as kapasitasService from './kapasitas.service';

export async function getKapasitasController(req: Request) {
  try {
    const result = await kapasitasService.getKapasitasDashboardService();
    return successResponse(result.data, 'Berhasil mengambil data kapasitas bank sampah');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil data kapasitas');
  }
}
