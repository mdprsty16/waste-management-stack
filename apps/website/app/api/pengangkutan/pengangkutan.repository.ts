import { prisma } from '../../lib/prisma';

export async function createPengangkutan(data: { volume_m3_diangkut: number, keterangan?: string }) {
  return prisma.pengangkutan.create({
    data
  });
}

export async function getRiwayatPengangkutan() {
  return prisma.pengangkutan.findMany({
    orderBy: { created_at: 'desc' },
    take: 50
  });
}
