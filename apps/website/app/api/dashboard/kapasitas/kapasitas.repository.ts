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
