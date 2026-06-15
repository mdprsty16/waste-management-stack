import { prisma } from '../../lib/prisma';

export async function getPengaturan() {
  let pengaturan = await prisma.pengaturan.findFirst();
  if (!pengaturan) {
    pengaturan = await prisma.pengaturan.create({
      data: {
        kapasitas_maksimal_m3: 0,
        threshold_persen: 80,
      }
    });
  }
  return pengaturan;
}

export async function updatePengaturan(data: { kapasitas_maksimal_m3: number, threshold_persen: number }) {
  const pengaturan = await getPengaturan();
  return prisma.pengaturan.update({
    where: { id_pengaturan: pengaturan.id_pengaturan },
    data,
  });
}
