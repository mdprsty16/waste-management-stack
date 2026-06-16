// types/pengangkutan.types.ts

export interface Pengangkutan {
  id_pengangkutan: string;
  tanggal: string;
  volume_m3_diangkut: number;
  keterangan: string | null;
  created_at: string;
}

export interface CreatePengangkutanRequest {
  volume_m3_diangkut: number;
  keterangan?: string;
}
