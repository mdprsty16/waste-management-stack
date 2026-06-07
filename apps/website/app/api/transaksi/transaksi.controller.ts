import { successResponse, errorResponse } from '../../lib/response';
import * as transaksiService from './transaksi.service';

export async function getTransaksiController(req: Request) {
  try {
    const result = await transaksiService.getAllTransaksiService();
    return successResponse(result.data, 'Berhasil mengambil semua data transaksi');
  } catch (error) {
    console.error('Error di getTransaksiController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
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
    console.error('Error di getTransaksiByIdController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function createTransaksiController(req: Request) {
  try {
    const body = await req.json();
    const { id_nasabah, tanggal, items } = body;

    // Ambil id_admin dari header (asumsi disuntik oleh middleware auth kamu)
    const id_admin = req.headers.get('x-admin-id') || null;

    if (!id_nasabah || !items || !Array.isArray(items) || items.length === 0) {
      return errorResponse('Field id_nasabah dan daftar items sampah wajib diisi', 400);
    }

    const result = await transaksiService.createTransaksiService(id_nasabah, id_admin, tanggal, items);
    
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }

    return successResponse(result.data, 'Transaksi berhasil dicatat', 201);
  } catch (error) {
    console.error('Error di createTransaksiController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}