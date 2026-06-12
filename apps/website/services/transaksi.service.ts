// ============================================================
// Transaksi Service — Frontend HTTP layer untuk data transaksi
// Mengambil data dari /api/transaksi
// Digunakan oleh: hooks/useLandingStats.ts, hooks/useTransaksi.ts
// ============================================================

import { apiClient } from './api.client';
import type { Transaksi } from '@/types/transaksi.types';

/** GET /api/transaksi — Ambil semua data transaksi */
export const getAllTransaksiService = () =>
  apiClient.get<Transaksi[]>('/api/transaksi');