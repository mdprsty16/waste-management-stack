// types/nasabah.types.ts

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

export interface CreateNasabahRequest {
  nama: string;
  nomor_hp?: string;
  rt?: string;
  rw?: string;
}

export interface UpdateNasabahRequest {
  kode_nasabah?: string;
  nama: string;
  nomor_hp?: string;
  rt?: string;
  rw?: string;
  is_active?: boolean;
}