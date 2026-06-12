// services/kategori-sampah.service.ts

import { apiClient } from './api.client';
import type { KategoriSampah, CreateKategoriRequest, UpdateKategoriRequest } from '@/types/kategori-sampah.types';

/** GET /api/kategori_sampah */
export const getKategoriSampah = () =>
  apiClient.get<KategoriSampah[]>('/api/kategori_sampah');

/** POST /api/kategori_sampah */
export const createKategoriSampah = (data: CreateKategoriRequest) =>
  apiClient.post<KategoriSampah>('/api/kategori_sampah', data);

/** PUT /api/kategori_sampah/[id] */
export const updateKategoriSampah = (id: string, data: UpdateKategoriRequest) =>
  apiClient.put<KategoriSampah>(`/api/kategori_sampah/${id}`, data);

/** DELETE /api/kategori_sampah/[id] */
export const deleteKategoriSampah = (id: string) =>
  apiClient.delete<null>(`/api/kategori_sampah/${id}`);
