// types/transaksi.types.ts

import type { Nasabah } from './nasabah.types';
import type { JenisSampah } from './jenis-sampah.types';

/** Detail per-item dalam satu transaksi */
export interface DetailTransaksi {
  id_detail: string;
  id_transaksi: string;
  id_jenis_sampah: string;
  berat_kg: number;
  volume_m3: number;
  subtotal_harga: number;
  jenis_sampah?: JenisSampah;    // Relasi (dari include)
}

/** Data transaksi (dikembalikan oleh GET /api/transaksi) */
export interface Transaksi {
  id_transaksi: string;
  id_nasabah: string;
  id_admin: string | null;
  tanggal: string;
  total_berat_kg: number;
  total_volume_m3: number;
  total_harga: number;
  created_at: string;
  nasabah?: Pick<Nasabah, 'nama' | 'kode_nasabah'>;  // Hanya nama & kode
  admin?: { nama_admin: string; username: string };
  detail_transaksi?: DetailTransaksi[];
}

/** Satu item sampah dalam body POST /api/transaksi */
export interface TransaksiItemInput {
  id_jenis_sampah: string;
  berat_kg: number;
}

/** Body request untuk POST /api/transaksi */
export interface CreateTransaksiRequest {
  id_nasabah: string;
  tanggal?: string;               // ISO date string (opsional, default hari ini)
  items: TransaksiItemInput[];    // Array items — MINIMAL 1
}