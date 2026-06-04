import * as nasabahRepo from './nasabah.repository';

export async function getAllNasabahService(isActiveQuery?: string, searchQuery?: string) {
  let isActive: boolean | undefined = undefined;
  if (isActiveQuery === 'true') isActive = true;
  if (isActiveQuery === 'false') isActive = false;

  const data = await nasabahRepo.findManyNasabah({ isActive, search: searchQuery || undefined });
  return { success: true, data, status: 200 };
}

export async function getNasabahByIdService(id: string) {
  const data = await nasabahRepo.findNasabahById(id);
  if (!data) {
    return { success: false, message: 'Data nasabah tidak ditemukan', status: 404 };
  }
  return { success: true, data, status: 200 };
}

export async function createNasabahService(body: {
  kode_nasabah?: string;
  nama: string;
  nomor_hp?: string;
  rt?: string;
  rw?: string;
}) {
  const data = await nasabahRepo.createNasabah(body);
  return { success: true, data, status: 201 };
}

export async function updateNasabahService(
  id: string,
  body: {
    kode_nasabah?: string;
    nama?: string;
    nomor_hp?: string;
    rt?: string;
    rw?: string;
    is_active?: boolean;
  }
) {
  const existing = await nasabahRepo.findNasabahById(id);
  if (!existing) {
    return { success: false, message: 'Data nasabah tidak ditemukan', status: 404 };
  }

  const data = await nasabahRepo.updateNasabah(id, body);
  return { success: true, data, status: 200 };
}

export async function deleteNasabahService(id: string) {
  const existing = await nasabahRepo.findNasabahById(id);
  if (!existing) {
    return { success: false, message: 'Data nasabah tidak ditemukan', status: 404 };
  }

  await nasabahRepo.deleteNasabah(id);
  return { success: true, message: 'Nasabah berhasil dinonaktifkan (Soft Delete)', status: 200 };
}