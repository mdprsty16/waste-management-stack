import { prisma } from '../../../lib/prisma';
import { getPengaturan } from '../../pengaturan/pengaturan.repository';

export async function getKapasitasData() {
  const pengaturan = await getPengaturan();

  const transaksiAggr = await prisma.transaksi.aggregate({
    _sum: {
      total_volume_m3: true
    }
  });

  const pengangkutanAggr = await prisma.pengangkutan.aggregate({
    _sum: {
      volume_m3_diangkut: true
    }
  });

  const totalMasuk = transaksiAggr._sum.total_volume_m3 || 0;
  const totalKeluar = pengangkutanAggr._sum.volume_m3_diangkut || 0;
  
  const currentVolume = Math.max(0, totalMasuk - totalKeluar);

  return {
    pengaturan,
    currentVolume
  };
}

export async function getRecentTransactionsForML(days: number = 30) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);

  const details = await prisma.detailTransaksi.findMany({
    where: {
      transaksi: {
        tanggal: {
          gte: dateThreshold
        }
      }
    },
    include: {
      transaksi: {
        select: { tanggal: true }
      },
      jenis_sampah: {
        select: { densitas_kg_per_m3: true }
      }
    },
    orderBy: {
      transaksi: {
        tanggal: 'asc'
      }
    }
  });

  return details.map(d => ({
    tanggal: d.transaksi.tanggal.toISOString().split('T')[0],
    berat_kg: d.berat_kg,
    densitas_kg_m3: d.jenis_sampah.densitas_kg_per_m3,
    volume_m3: d.volume_m3
  }));
}
