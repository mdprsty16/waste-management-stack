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
    // Validasi: berat/jumlah tidak boleh negatif atau nol
    if (!item.berat_kg || item.berat_kg <= 0) {
      return { success: false, message: 'Berat/jumlah harus lebih dari 0', status: 400 };
    }

    const jenis = await prisma.jenisSampah.findUnique({ where: { id_jenis_sampah: item.id_jenis_sampah } });
    if (!jenis) {
      return { success: false, message: `Jenis sampah dengan ID ${item.id_jenis_sampah} tidak ditemukan`, status: 404 };
    }
    if (!jenis.is_active) {
      return { success: false, message: `Jenis sampah ${jenis.nama_jenis} sedang dinonaktifkan`, status: 400 };
    }

    const isPcs = jenis.satuan === 'pcs';

    // Untuk satuan 'pcs': item.berat_kg menyimpan jumlah unit, bukan berat
    const jumlah = item.berat_kg;

    // Hitung subtotal harga (jumlah × harga per satuan)
    const subtotal_harga = jumlah * jenis.harga_per_kg;

    // Konversi ke berat riil (kg)
    // Untuk PCS: berat_real = jumlah_pcs × berat_per_pcs (kg per unit)
    // Untuk KG: berat_real = jumlah (sudah dalam kg)
    const berat_real_kg = isPcs
      ? jumlah * (jenis.berat_per_pcs || 0)
      : jumlah;

    // Hitung volume dari berat riil
    const volume_m3 = jenis.densitas_kg_per_m3 > 0
      ? berat_real_kg / jenis.densitas_kg_per_m3
      : 0;

    // Semua item (termasuk PCS) berkontribusi ke total berat & volume
    total_berat_kg += berat_real_kg;
    total_volume_m3 += volume_m3;
    total_harga += subtotal_harga;

    detailsPayload.push({
      id_jenis_sampah: item.id_jenis_sampah,
      berat_kg: berat_real_kg,  // Simpan berat riil (kg), bukan jumlah PCS
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

  // 4. Backfill nilai aktual ke prediksi_log (non-blocking)
  try {
    const year = tanggal.getFullYear();
    const month = tanggal.getMonth();
    const dayOfMonth = tanggal.getDate();
    const weekNum = Math.ceil(dayOfMonth / 7);
    const periodeLabel = `Minggu ${weekNum}`;

    // Hitung total aktual untuk minggu ini
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const weekStart = new Date(firstDayOfMonth);
    weekStart.setDate(Math.max(1, (weekNum - 1) * 7 + 1));
    const weekEnd = new Date(year, month, Math.min((weekNum) * 7, lastDayOfMonth.getDate()));
    weekEnd.setHours(23, 59, 59, 999);
    weekStart.setHours(0, 0, 0, 0);

    const agg = await prisma.transaksi.aggregate({
      _sum: { total_berat_kg: true },
      where: { tanggal: { gte: weekStart, lte: weekEnd } },
    });
    const totalAktual = agg._sum.total_berat_kg || 0;

    const existing = await prisma.prediksiLog.findFirst({
      where: { tipe: 'mingguan', key: 'total', periode_label: periodeLabel },
      orderBy: { created_at: 'desc' },
    });

    if (existing && existing.nilai_aktual === null) {
      const selisih = existing.nilai_prediksi > 0
        ? Number((((totalAktual - existing.nilai_prediksi) / existing.nilai_prediksi) * 100).toFixed(1))
        : 0;

      await prisma.prediksiLog.update({
        where: { id: existing.id },
        data: { nilai_aktual: Number(totalAktual.toFixed(2)), selisih_persen: selisih },
      });
    }
  } catch {
    // Gagal update akurasi — tidak mengganggu response utama
  }

  return { success: true, data, status: 201 };
}