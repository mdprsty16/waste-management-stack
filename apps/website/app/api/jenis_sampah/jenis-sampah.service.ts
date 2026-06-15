import * as jenisSampahRepo from './jenis-sampah.repository';

export async function getAllJenisSampahService(isActiveQuery?: string, idKategori?: string) {
  let isActive: boolean | undefined = undefined;
  if (isActiveQuery === 'true') isActive = true;
  if (isActiveQuery === 'false') isActive = false;

  const data = await jenisSampahRepo.findManyJenisSampah({ isActive, id_kategori: idKategori });
  return { success: true, data, status: 200 };
}

export async function getJenisSampahByIdService(id: string) {
  const data = await jenisSampahRepo.findJenisSampahById(id);
  if (!data) {
    return { success: false, message: 'Jenis sampah tidak ditemukan', status: 404 };
  }
  return { success: true, data, status: 200 };
}

export async function createJenisSampahService(body: {
  id_kategori: string;
  nama_jenis: string;
  densitas_kg_per_m3: number;
  harga_per_kg: number;
  satuan?: string;
  berat_per_pcs?: number | null;
}) {
  const data = await jenisSampahRepo.createJenisSampah(body);
  return { success: true, data, status: 201 };
}

export async function updateJenisSampahService(
  id: string,
  body: {
    id_kategori: string;
    nama_jenis: string;
    densitas_kg_per_m3: number;
    harga_per_kg: number;
    satuan?: string;
    berat_per_pcs?: number | null;
    is_active: boolean;
  }
) {
  const existing = await jenisSampahRepo.findJenisSampahById(id);
  if (!existing) {
    return { success: false, message: 'Jenis sampah tidak ditemukan', status: 404 };
  }

  const data = await jenisSampahRepo.updateJenisSampah(id, body);
  return { success: true, data, status: 200 };
}

export async function deleteJenisSampahService(id: string) {
  const existing = await jenisSampahRepo.findJenisSampahById(id);
  if (!existing) {
    return { success: false, message: 'Jenis sampah tidak ditemukan', status: 404 };
  }

  await jenisSampahRepo.deleteJenisSampah(id);
  return { success: true, message: 'Jenis sampah berhasil dihapus', status: 200 };
}