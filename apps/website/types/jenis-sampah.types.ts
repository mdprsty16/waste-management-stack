// types/jenis-sampah.types.ts

import type { KategoriSampah } from './kategori-sampah.types';

export interface JenisSampah {
  id_jenis_sampah: string;
  id_kategori: string;
  nama_jenis: string;
  densitas_kg_per_m3: number;
  harga_per_kg: number;
  satuan: 'kg' | 'pcs';  // kg = per kilogram, pcs = per buah/unit
  is_active: boolean;
  created_at: string;
  kategori?: KategoriSampah;  // Relasi (dari include di backend)
}

export interface CreateJenisSampahRequest {
  id_kategori: string;
  nama_jenis: string;
  densitas_kg_per_m3: number;
  harga_per_kg: number;
  satuan?: 'kg' | 'pcs';  // Default: 'kg'
}

export interface UpdateJenisSampahRequest {
  id_kategori: string;
  nama_jenis: string;
  densitas_kg_per_m3: number;
  harga_per_kg: number;
  satuan?: 'kg' | 'pcs';
  is_active: boolean;
}