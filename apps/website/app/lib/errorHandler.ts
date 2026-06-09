import { Prisma } from '../../generated/prisma/client';
import { errorResponse } from './response';

/**
 * Mengolah semua jenis error secara aman dan mengembalikan errorResponse yang bersih ke frontend.
 */
export function handleControllerError(error: unknown, defaultMessage: string = 'Terjadi kesalahan pada server') {
  // 1. Tetap log error lengkap di terminal backend untuk kebutuhan debugging kamu
  console.error("====== UTILITY LOG ERROR ======\n", error, "\n===============================");

  // 2. Ekstrak pesan error dasar untuk fallback
  const rawMessage = error instanceof Error ? error.message : String(error);

  // 3. Cek jika error berasal dari Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const fields = (error.meta?.target as string[])?.join(', ') || 'data';
        return errorResponse(
          `Gagal memproses data, terdapat duplikasi pada (${fields})`, 
          400, 
          `Unique constraint failed on fields: ${fields}` // Teks ringkas untuk frontend
        );
      }
      case 'P2003': {
        const fieldName = (error.meta?.field_name as string) || 'id_kategori';
        return errorResponse(
          'Gagal memproses data, data relasi tidak ditemukan atau masih terikat dengan data lain', 
          400, 
          `Foreign key constraint violated on field: ${fieldName}` // Teks ringkas tanpa stack trace Turbopack
        );
      }
      case 'P2025':
        return errorResponse(
          'Data yang ingin diakses atau diubah tidak ditemukan di server', 
          404, 
          error.meta?.cause as string || 'Record not found'
        );
      default:
        return errorResponse(
          `Database error dengan kode: ${error.code}`, 
          400, 
          `Prisma error code ${error.code}`
        );
    }
  }

  // 4. Jika error umum (bukan Prisma)
  return errorResponse(defaultMessage, 500, rawMessage);
}