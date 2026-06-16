import { successResponse, errorResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as jenisSampahService from './jenis-sampah.service';
import { validate, createJenisSchema, updateJenisSchema } from '../../lib/validation';

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

    const parsed = validate(createJenisSchema, body);
    if (!parsed.ok) return parsed.response;

    const result = await jenisSampahService.createJenisSampahService(parsed.data);
    return successResponse(result.data, 'Jenis sampah berhasil ditambahkan', 201);
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat menambahkan jenis sampah');
  }
}

export async function updateJenisSampahController(req: Request, id: string) {
  try {
    const body = await req.json();

    const parsed = validate(updateJenisSchema, body);
    if (!parsed.ok) return parsed.response;

    const result = await jenisSampahService.updateJenisSampahService(id, parsed.data);
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