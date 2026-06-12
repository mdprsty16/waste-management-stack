// services/jenis-sampah.service.ts

import { apiClient } from './api.client';
import type { JenisSampah, CreateJenisSampahRequest, UpdateJenisSampahRequest } from '@/types/jenis-sampah.types';

/** GET /api/jenis_sampah (bisa filter: ?id_kategori=xxx) */
export const getJenisSampah = (idKategori?: string) => {
  const query = idKategori ? `?id_kategori=${idKategori}` : '';
  return apiClient.get<JenisSampah[]>(`/api/jenis_sampah${query}`);
};

/** POST /api/jenis_sampah */
export const createJenisSampah = (data: CreateJenisSampahRequest) =>
  apiClient.post<JenisSampah>('/api/jenis_sampah', data);

/** PUT /api/jenis_sampah/[id] */
export const updateJenisSampah = (id: string, data: UpdateJenisSampahRequest) =>
  apiClient.put<JenisSampah>(`/api/jenis_sampah/${id}`, data);

/** DELETE /api/jenis_sampah/[id] */
export const deleteJenisSampah = (id: string) =>
  apiClient.delete<null>(`/api/jenis_sampah/${id}`);