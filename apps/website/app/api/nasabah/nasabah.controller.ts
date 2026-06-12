import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as nasabahService from './nasabah.service';

export async function getNasabahController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isActiveQuery = searchParams.get('is_active') || undefined;
    const searchQuery = searchParams.get('search') || undefined;

    const result = await nasabahService.getAllNasabahService(isActiveQuery, searchQuery);
    return successResponse(result.data, 'Berhasil mengambil data nasabah');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil data nasabah');
  }
}

export async function getNasabahByIdController(req: Request, id: string) {
  try {
    const result = await nasabahService.getNasabahByIdService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(result.data, 'Berhasil mengambil detail nasabah');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil detail nasabah');
  }
}

export async function createNasabahController(req: Request) {
  try {
    const body = await req.json();
    const { kode_nasabah, nama, nomor_hp, rt, rw } = body;

    if (!nama) {
      return errorResponse('Field nama wajib diisi', 400);
    }

    const result = await nasabahService.createNasabahService({
      kode_nasabah,
      nama,
      nomor_hp,
      rt,
      rw,
    });

    return successResponse(result.data, 'Nasabah baru berhasil ditambahkan', 201);
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat menambahkan nasabah baru');
  }
}

export async function updateNasabahController(req: Request, id: string) {
  try {
    const body = await req.json();
    const { kode_nasabah, nama, nomor_hp, rt, rw, is_active } = body;

    if (!nama) {
      return errorResponse('Field nama wajib diisi', 400);
    }

    const result = await nasabahService.updateNasabahService(id, {
      kode_nasabah,
      nama,
      nomor_hp,
      rt,
      rw,
      is_active: is_active !== undefined ? Boolean(is_active) : undefined,
    });

    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }

    return successResponse(result.data, 'Data nasabah berhasil diperbarui');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat memperbarui data nasabah');
  }
}

export async function deleteNasabahController(req: Request, id: string) {
  try {
    const result = await nasabahService.deleteNasabahService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(null, result.message || 'Berhasil dihapus');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat menghapus data nasabah');
  }
}