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
  nama: string;
  nomor_hp?: string;
  rt?: string;
  rw?: string;
}) {
  // Auto-generate kode_nasabah: SLB-001, SLB-002, ...
  const lastKode = await nasabahRepo.findLastKodeNasabah();

  let nextNumber = 1;
  if (lastKode) {
    // Ambil angka dari "SLB-003" → 3, lalu tambah 1
    const match = lastKode.match(/SLB-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  // Format: SLB-001, SLB-012, SLB-999
  const kodeNasabah = `SLB-${String(nextNumber).padStart(3, '0')}`;

  const data = await nasabahRepo.createNasabah({
    ...body,
    kode_nasabah: kodeNasabah,
  });
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