import * as kategoriRepo from './kategori-sampah.repository';

export async function getAllKategoriService(isActiveQuery?: string) {
  let isActive: boolean | undefined = undefined;
  if (isActiveQuery === 'true') isActive = true;
  if (isActiveQuery === 'false') isActive = false;

  const data = await kategoriRepo.findManyKategori(isActive);
  return { success: true, data, status: 200 };
}

export async function getKategoriByIdService(id: string) {
  const data = await kategoriRepo.findKategoriById(id);
  if (!data) {
    return { success: false, message: 'Kategori sampah tidak ditemukan', status: 404 };
  }
  return { success: true, data, status: 200 };
}

export async function createKategoriService(body: { nama_kategori: string; deskripsi?: string }) {
  const data = await kategoriRepo.createKategori(body);
  return { success: true, data, status: 201 };
}

export async function updateKategoriService(
  id: string,
  body: { nama_kategori: string; deskripsi?: string; is_active: boolean }
) {
  const existing = await kategoriRepo.findKategoriById(id);
  if (!existing) {
    return { success: false, message: 'Kategori sampah tidak ditemukan', status: 404 };
  }

  const data = await kategoriRepo.updateKategori(id, body);
  return { success: true, data, status: 200 };
}

export async function deleteKategoriService(id: string) {
  const existing = await kategoriRepo.findKategoriById(id);
  if (!existing) {
    return { success: false, message: 'Kategori sampah tidak ditemukan', status: 404 };
  }

  await kategoriRepo.deleteKategori(id);
  return { success: true, message: 'Kategori sampah berhasil dihapus', status: 200 };
}