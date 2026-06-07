import * as transaksiRepo from './transaksi.repository';
import { prisma } from '../../lib/prisma';

export async function getAllTransaksiService() {
  const data = await transaksiRepo.findManyTransaksi();
  return { success: true, data, status: 200 };
}

export async function getTransaksiByIdService(id: string) {
  const data = await transaksiRepo.findTransaksiById(id);
  if (!data) {
    return { success: false, message: 'Transaksi tidak ditemukan', status: 404 };
  }
  return { success: true, data, status: 200 };
}

interface ItemInput {
  id_jenis_sampah: string;
  berat_kg: number;
}

export async function createTransaksiService(
  id_nasabah: string,
  id_admin: string | null,
  tanggalInput: string | undefined,
  items: ItemInput[]
) {
  // 1. Validasi nasabah terlebih dahulu
  const nasabah = await prisma.nasabah.findUnique({ where: { id_nasabah } });
  if (!nasabah) {
    return { success: false, message: 'Nasabah tidak ditemukan', status: 404 };
  }
  if (!nasabah.is_active) {
    return { success: false, message: 'Nasabah sudah tidak aktif', status: 400 };
  }

  let total_berat_kg = 0;
  let total_volume_m3 = 0;
  let total_harga = 0;
  const detailsPayload = [];

  // 2. Iterasi items untuk menghitung volume dan subtotal secara dinamis dari DB
  for (const item of items) {
    const jenis = await prisma.jenisSampah.findUnique({ where: { id_jenis_sampah: item.id_jenis_sampah } });
    if (!jenis) {
      return { success: false, message: `Jenis sampah dengan ID ${item.id_jenis_sampah} tidak ditemukan`, status: 404 };
    }
    if (!jenis.is_active) {
      return { success: false, message: `Jenis sampah ${jenis.nama_jenis} sedang dinonaktifkan`, status: 400 };
    }

    const subtotal_harga = item.berat_kg * jenis.harga_per_kg;
    const volume_m3 = item.berat_kg / jenis.densitas_kg_per_m3;

    total_berat_kg += item.berat_kg;
    total_volume_m3 += volume_m3;
    total_harga += subtotal_harga;

    detailsPayload.push({
      id_jenis_sampah: item.id_jenis_sampah,
      berat_kg: item.berat_kg,
      volume_m3: volume_m3,
      subtotal_harga: subtotal_harga,
    });
  }

  const tanggal = tanggalInput ? new Date(tanggalInput) : new Date();

  // 3. Kirim data yang sudah matang kalkulasinya ke repository
  const data = await transaksiRepo.createTransaksiData({
    id_nasabah,
    id_admin,
    tanggal,
    total_berat_kg,
    total_volume_m3,
    total_harga,
    details: detailsPayload,
  });

  return { success: true, data, status: 201 };
}