// ============================================================
// Transaksi Types — Interface untuk data transaksi
// Digunakan oleh: services/transaksi.service.ts, hooks/useLandingStats.ts
// ============================================================

/** Data Transaksi dari GET /api/transaksi */
export interface Transaksi {
  id_transaksi: string;
  id_nasabah: string;
  id_admin: string | null;
  tanggal: string;
  total_berat_kg: number;
  total_volume_m3: number;
  total_harga: number;
  created_at: string;
  nasabah?: {
    nama: string;
    kode_nasabah: string | null;
  };
}