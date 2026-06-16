import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as transaksiService from './transaksi.service';
import { validate, createTransaksiSchema } from '../../lib/validation';

export async function getTransaksiController(req: Request) {
  try {
    const result = await transaksiService.getAllTransaksiService();
    return successResponse(result.data, 'Berhasil mengambil semua data transaksi');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil semua data transaksi');
  }
}

export async function getTransaksiByIdController(req: Request, id: string) {
  try {
    const result = await transaksiService.getTransaksiByIdService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(result.data, 'Berhasil mengambil detail transaksi');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil detail transaksi');
  }
}

export async function createTransaksiController(req: Request) {
  try {
    const body = await req.json();

    const parsed = validate(createTransaksiSchema, body);
    if (!parsed.ok) return parsed.response;

    const { id_nasabah, tanggal, items } = parsed.data;
    const id_admin = req.headers.get('x-admin-id') || null;

    const result = await transaksiService.createTransaksiService(id_nasabah, id_admin, tanggal, items);
    
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }

    return successResponse(result.data, 'Transaksi berhasil dicatat', 201);
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mencatat transaksi');
  }
}