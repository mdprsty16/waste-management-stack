// services/pengangkutan.service.ts

import { apiClient } from './api.client';
import type { Pengangkutan, CreatePengangkutanRequest } from '@/types/pengangkutan.types';

/** GET /api/pengangkutan — ambil riwayat pengangkutan */
export const getPengangkutan = () => {
  return apiClient.get<Pengangkutan[]>('/api/pengangkutan');
};

/** POST /api/pengangkutan — catat pengangkutan baru */
export const createPengangkutan = (payload: CreatePengangkutanRequest) => {
  return apiClient.post<Pengangkutan>('/api/pengangkutan', payload);
};
