import { successResponse } from '../../../lib/response';
import { handleControllerError } from '../../../lib/errorHandler';
import { prisma } from '../../../lib/prisma';

// GET /api/nasabah/search?q=xxx — Pencarian nasabah berdasarkan nama/kode
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return successResponse([], 'Masukkan kata kunci pencarian');
    }

    const data = await prisma.nasabah.findMany({
      where: {
        OR: [
          { nama: { contains: query } },
          { kode_nasabah: { contains: query } },
        ],
        is_active: true,
      },
      select: {
        id_nasabah: true,
        kode_nasabah: true,
        nama: true,
        nomor_hp: true,
      },
      take: 10,
      orderBy: { nama: 'asc' },
    });

    return successResponse(data, 'Hasil pencarian nasabah');
  } catch (error) {
    return handleControllerError(error, 'Gagal mencari nasabah');
  }
}
