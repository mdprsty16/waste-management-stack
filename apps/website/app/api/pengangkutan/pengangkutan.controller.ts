import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as pengangkutanService from './pengangkutan.service';
import { validate, createPengangkutanSchema } from '../../lib/validation';

export async function createPengangkutanController(req: Request) {
  try {
    const body = await req.json();
    const parsed = validate(createPengangkutanSchema, body);
    if (!parsed.ok) return parsed.response;

    const result = await pengangkutanService.createPengangkutanService(parsed.data);
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
