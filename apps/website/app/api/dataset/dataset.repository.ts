// apps/website/app/api/dataset/dataset.repository.ts
import { prisma } from '../../lib/prisma'; 

export async function getDatasetForModeling() {
  return await prisma.detailTransaksi.findMany({
    select: {
      berat_kg: true,
      transaksi: {
        select: {
          tanggal: true,
        },
      },
      jenis_sampah: {
        select: {
          densitas_kg_per_m3: true,
          satuan: true,
          berat_per_pcs: true,
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