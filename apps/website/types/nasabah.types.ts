// ============================================================
// Nasabah Types — Interface untuk data nasabah
// Digunakan oleh: services/nasabah.service.ts, hooks/useLandingStats.ts
// ============================================================

/** Data Nasabah dari GET /api/nasabah */
export interface Nasabah {
  id_nasabah: string;
  kode_nasabah: string | null;
  nama: string;
  nomor_hp: string | null;
  rt: string | null;
  rw: string | null;
  saldo: number;
  total_berat_sampah: number;
  is_active: boolean;
  created_at: string;
}