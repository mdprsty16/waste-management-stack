import { successResponse, errorResponse } from '../../lib/response';
import * as kategoriService from './kategori-sampah.service';

export async function getKategoriController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isActiveQuery = searchParams.get('is_active') || undefined;

    const result = await kategoriService.getAllKategoriService(isActiveQuery);
    return successResponse(result.data, 'Berhasil mengambil data kategori sampah');
  } catch (error) {
    console.error('Error di getKategoriController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function getKategoriByIdController(req: Request, id: string) {
  try {
    const result = await kategoriService.getKategoriByIdService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(result.data, 'Berhasil mengambil detail kategori sampah');
  } catch (error) {
    console.error('Error di getKategoriByIdController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function createKategoriController(req: Request) {
  try {
    const body = await req.json();
    const { nama_kategori, deskripsi } = body;

    if (!nama_kategori) {
      return errorResponse('Field nama_kategori wajib diisi', 400);
    }

    const result = await kategoriService.createKategoriService({ nama_kategori, deskripsi });
    return successResponse(result.data, 'Kategori sampah berhasil ditambahkan', 201);
  } catch (error) {
    console.error('Error di createKategoriController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function updateKategoriController(req: Request, id: string) {
  try {
    const body = await req.json();
    const { nama_kategori, deskripsi, is_active } = body;

    if (!nama_kategori || is_active === undefined) {
      return errorResponse('Field nama_kategori dan is_active wajib diisi', 400);
    }

    const result = await kategoriService.updateKategoriService(id, {
      nama_kategori,
      deskripsi,
      is_active: Boolean(is_active),
    });

    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }

    return successResponse(result.data, 'Kategori sampah berhasil diperbarui');
  } catch (error) {
    console.error('Error di updateKategoriController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function deleteKategoriController(req: Request, id: string) {
  try {
    const result = await kategoriService.deleteKategoriService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(null, result.message || 'Berhasil dihapus');
  } catch (error) {
    console.error('Error di deleteKategoriController:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}