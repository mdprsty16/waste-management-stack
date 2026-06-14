import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as jenisSampahService from './jenis-sampah.service';

export async function getJenisSampahController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isActiveQuery = searchParams.get('is_active') || undefined;
    const idKategori = searchParams.get('id_kategori') || undefined;

    const result = await jenisSampahService.getAllJenisSampahService(isActiveQuery, idKategori);
    return successResponse(result.data, 'Berhasil mengambil data jenis sampah');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil data jenis sampah');
  }
}

export async function getJenisSampahByIdController(req: Request, id: string) {
  try {
    const result = await jenisSampahService.getJenisSampahByIdService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(result.data, 'Berhasil mengambil detail jenis sampah');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengambil detail jenis sampah');
  }
}

export async function createJenisSampahController(req: Request) {
  try {
    const body = await req.json();
    const { id_kategori, nama_jenis, densitas_kg_per_m3, harga_per_kg, satuan } = body;

    if (!id_kategori || !nama_jenis || densitas_kg_per_m3 === undefined || harga_per_kg === undefined) {
      return errorResponse('Field id_kategori, nama_jenis, densitas_kg_per_m3, dan harga_per_kg wajib diisi', 400);
    }

    const result = await jenisSampahService.createJenisSampahService({
      id_kategori,
      nama_jenis,
      densitas_kg_per_m3: Number(densitas_kg_per_m3),
      harga_per_kg: Number(harga_per_kg),
      satuan: satuan || 'kg',
    });

    return successResponse(result.data, 'Jenis sampah berhasil ditambahkan', 201);
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat menambahkan jenis sampah');
  }
}

export async function updateJenisSampahController(req: Request, id: string) {
  try {
    const body = await req.json();
    const { id_kategori, nama_jenis, densitas_kg_per_m3, harga_per_kg, is_active, satuan } = body;

    if (!id_kategori || !nama_jenis || densitas_kg_per_m3 === undefined || harga_per_kg === undefined || is_active === undefined) {
      return errorResponse('Semua field termasuk id_kategori dan is_active wajib diisi', 400);
    }

    const result = await jenisSampahService.updateJenisSampahService(id, {
      id_kategori,
      nama_jenis,
      densitas_kg_per_m3: Number(densitas_kg_per_m3),
      harga_per_kg: Number(harga_per_kg),
      satuan: satuan || 'kg',
      is_active: Boolean(is_active),
    });

    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }

    return successResponse(result.data, 'Jenis sampah berhasil diperbarui');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat memperbarui jenis sampah');
  }
}

export async function deleteJenisSampahController(req: Request, id: string) {
  try {
    const result = await jenisSampahService.deleteJenisSampahService(id);
    if (!result.success) {
      return errorResponse(result.message || 'Error', result.status);
    }
    return successResponse(null, result.message || 'Berhasil dihapus');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat menghapus jenis sampah');
  }
}