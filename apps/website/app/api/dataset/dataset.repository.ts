// apps/website/app/api/dataset/dataset.repository.ts
import { prisma } from '../../lib/prisma'; 

export async function getDatasetForModeling() {
  return await prisma.detailTransaksi.findMany({
    include: {
      transaksi: {
        include: {
          nasabah: true,
        },
      },
      jenis_sampah: {
        include: {
          kategori: true,
        },
      },
    },
    orderBy: {
      transaksi: {
        tanggal: 'asc',
      },
    },
  });
}