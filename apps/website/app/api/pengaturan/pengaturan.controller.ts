import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as pengaturanService from './pengaturan.service';
import { validate, updatePengaturanSchema } from '../../lib/validation';

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
    const parsed = validate(updatePengaturanSchema, body);
    if (!parsed.ok) return parsed.response;

    const result = await pengaturanService.updatePengaturanService(parsed.data);
    return successResponse(result.data, 'Pengaturan sistem berhasil diperbarui');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat memperbarui pengaturan');
  }
}
