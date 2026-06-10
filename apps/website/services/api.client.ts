// ============================================================
// API Client — Base helper untuk semua HTTP request
// Digunakan oleh: semua file di services/
// Adhim & Aban tinggal import { apiClient } dari sini
// ============================================================

import type { ApiResponse } from '@/types/auth.types';

const BASE_URL = ''; // Relative — Next.js API routes di origin yang sama

/**
 * Helper fetch wrapper dengan error handling standar.
 * Otomatis parse JSON dan throw error jika response tidak ok.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || `Request gagal dengan status ${res.status}`);
  }

  return json;
}

export const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};