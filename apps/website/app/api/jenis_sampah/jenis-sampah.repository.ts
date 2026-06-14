import { prisma } from '../../lib/prisma';

export async function findManyJenisSampah(filters: { isActive?: boolean; id_kategori?: string }) {
  return await prisma.jenisSampah.findMany({
    where: {
      ...(filters.isActive !== undefined && { is_active: filters.isActive }),
      ...(filters.id_kategori && { id_kategori: filters.id_kategori }),
    },
    include: {
      kategori: true, // Membawa data objek KategoriSampah terkait
    },
  });
}

export async function findJenisSampahById(id_jenis_sampah: string) {
  return await prisma.jenisSampah.findUnique({
    where: { id_jenis_sampah },
    include: {
      kategori: true,
    },
  });
}

export async function createJenisSampah(data: {
  id_kategori: string;
  nama_jenis: string;
  densitas_kg_per_m3: number;
  harga_per_kg: number;
  satuan?: string;
}) {
  return await prisma.jenisSampah.create({
    data,
  });
}

export async function updateJenisSampah(
  id_jenis_sampah: string,
  data: {
    id_kategori?: string;
    nama_jenis?: string;
    densitas_kg_per_m3?: number;
    harga_per_kg?: number;
    satuan?: string;
    is_active?: boolean;
  }
) {
  return await prisma.jenisSampah.update({
    where: { id_jenis_sampah },
    data,
  });
}

export async function deleteJenisSampah(id_jenis_sampah: string) {
  return await prisma.jenisSampah.delete({
    where: { id_jenis_sampah },
  });
}