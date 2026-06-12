// services/nasabah.service.ts

import { apiClient } from './api.client';
import type { Nasabah, CreateNasabahRequest, UpdateNasabahRequest } from '@/types/nasabah.types';

/** GET /api/nasabah (bisa filter: ?is_active=true&search=xxx) */
export const getNasabah = (params?: { is_active?: string; search?: string }) => {
  const query = new URLSearchParams();
  if (params?.is_active) query.set('is_active', params.is_active);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return apiClient.get<Nasabah[]>(`/api/nasabah${qs ? `?${qs}` : ''}`);
};

/** GET /api/nasabah/[id] */
export const getNasabahById = (id: string) =>
  apiClient.get<Nasabah>(`/api/nasabah/${id}`);

/** POST /api/nasabah */
export const createNasabah = (data: CreateNasabahRequest) =>
  apiClient.post<Nasabah>('/api/nasabah', data);

/** PUT /api/nasabah/[id] */
export const updateNasabah = (id: string, data: UpdateNasabahRequest) =>
  apiClient.put<Nasabah>(`/api/nasabah/${id}`, data);

/** DELETE /api/nasabah/[id] — Soft delete (set is_active = false) */
export const deleteNasabah = (id: string) =>
  apiClient.delete<null>(`/api/nasabah/${id}`);