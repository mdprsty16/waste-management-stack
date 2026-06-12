// ============================================================
// Nasabah Service — Frontend HTTP layer untuk data nasabah
// Mengambil data dari /api/nasabah
// Digunakan oleh: hooks/useLandingStats.ts, hooks/useNasabah.ts
// ============================================================

import { apiClient } from './api.client';
import type { Nasabah } from '@/types/nasabah.types';

/** GET /api/nasabah — Ambil semua data nasabah */
export const getAllNasabahService = () =>
  apiClient.get<Nasabah[]>('/api/nasabah');