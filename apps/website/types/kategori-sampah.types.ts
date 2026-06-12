// types/kategori-sampah.types.ts

export interface KategoriSampah {
  id_kategori: string;
  nama_kategori: string;
  deskripsi: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateKategoriRequest {
  nama_kategori: string;
  deskripsi?: string;
}

export interface UpdateKategoriRequest {
  nama_kategori: string;
  deskripsi?: string;
  is_active: boolean;
}
