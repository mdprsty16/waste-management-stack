import { prisma } from '../../lib/prisma';

export async function findManyKategori(isActive?: boolean) {
  return await prisma.kategoriSampah.findMany({
    where: isActive !== undefined ? { is_active: isActive } : {},
  });
}

export async function findKategoriById(id_kategori: string) {
  return await prisma.kategoriSampah.findUnique({
    where: { id_kategori },
    include: {
      jenis_sampah: true, // Otomatis narik daftar jenis sampah yang masuk kategori ini
    },
  });
}

export async function createKategori(data: { nama_kategori: string; deskripsi?: string }) {
  return await prisma.kategoriSampah.create({
    data,
  });
}

export async function updateKategori(
  id_kategori: string,
  data: { nama_kategori?: string; deskripsi?: string; is_active?: boolean }
) {
  return await prisma.kategoriSampah.update({
    where: { id_kategori },
    data,
  });
}

export async function deleteKategori(id_kategori: string) {
  return await prisma.kategoriSampah.delete({
    where: { id_kategori },
  });
}