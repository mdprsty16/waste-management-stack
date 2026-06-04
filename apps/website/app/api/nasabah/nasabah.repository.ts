import { prisma } from '../../lib/prisma';

export async function findManyNasabah(filters: { isActive?: boolean; search?: string }) {
  return await prisma.nasabah.findMany({
    where: {
      ...(filters.isActive !== undefined && { is_active: filters.isActive }),
      ...(filters.search && {
        nama: {
          contains: filters.search,
        },
      }),
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function findNasabahById(id_nasabah: string) {
  return await prisma.nasabah.findUnique({
    where: { id_nasabah },
    include: {
      transaksi: true, // Sekaligus melihat riwayat transaksi jika dibutuhkan
    },
  });
}

export async function createNasabah(data: {
  kode_nasabah?: string;
  nama: string;
  nomor_hp?: string;
  rt?: string;
  rw?: string;
}) {
  return await prisma.nasabah.create({
    data,
  });
}

export async function updateNasabah(
  id_nasabah: string,
  data: {
    kode_nasabah?: string;
    nama?: string;
    nomor_hp?: string;
    rt?: string;
    rw?: string;
    is_active?: boolean;
  }
) {
  return await prisma.nasabah.update({
    where: { id_nasabah },
    data,
  });
}

export async function deleteNasabah(id_nasabah: string) {
  // Menggunakan soft delete karena data nasabah terikat dengan histori transaksi
  return await prisma.nasabah.update({
    where: { id_nasabah },
    data: { is_active: false },
  });
}