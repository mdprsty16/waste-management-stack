// ============================================================
// Dashboard Service — Frontend HTTP layer untuk data dashboard
// Mengambil data dari /api/daily dan /api/dashboard/kategori-stats
// Digunakan oleh: hooks/useDailyTrend.ts, hooks/useKategoriStats.ts
// ============================================================

import { apiClient } from './api.client';
import type { DailyTrendData, KategoriStatItem } from '@/types/dashboard.types';

/** GET /api/daily — Tren mingguan + prediksi ML + alert */
export const getDailyTrendService = () =>
  apiClient.get<DailyTrendData>('/api/daily');

/** GET /api/dashboard/kategori-stats — Statistik sampah per kategori */
export const getKategoriStatsService = () =>
  apiClient.get<KategoriStatItem[]>('/api/dashboard/kategori-stats');
