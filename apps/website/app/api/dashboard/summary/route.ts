import { prisma } from '../../../lib/prisma';
import { successResponse } from '../../../lib/response';
import { handleControllerError } from '../../../lib/errorHandler';

export async function GET() {
  try {
    // Hitung total nasabah aktif
    const totalNasabah = await prisma.nasabah.count({
      where: { is_active: true },
    });

    // Hitung total berat sampah & total harga dari semua transaksi (aggregation)
    const aggregation = await prisma.transaksi.aggregate({
      _sum: {
        total_berat_kg: true,
        total_harga: true,
      },
      _count: {
        id_transaksi: true,
      },
    });

    const data = {
      totalNasabah,
      totalSampahKg: Math.round(aggregation._sum.total_berat_kg || 0),
      totalSampahTerolah: aggregation._count.id_transaksi || 0,
      totalHematRupiah: Math.round(aggregation._sum.total_harga || 0),
    };

    return successResponse(data, 'Berhasil mengambil ringkasan dashboard');
  } catch (error) {
    return handleControllerError(error, 'Gagal mengambil ringkasan dashboard');
  }
}