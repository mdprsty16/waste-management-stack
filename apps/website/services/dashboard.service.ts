// ============================================================
// Dashboard Service — Frontend HTTP layer untuk data dashboard
// ============================================================

import { apiClient } from './api.client';
import type {
  DailyTrendData,
  KategoriStatItem,
  DashboardResponse,
} from '@/types/dashboard.types';

/** GET /api/daily — Tren mingguan + prediksi ML + alert */
export const getDailyTrendService = () =>
  apiClient.get<DailyTrendData>('/api/daily');

/** GET /api/dashboard/kategori-stats — Statistik sampah per kategori */
export const getKategoriStatsService = () =>
  apiClient.get<KategoriStatItem[]>('/api/dashboard/kategori-stats');

/** GET /api/dashboard — Aggregator: semua data dashboard dalam 1 panggilan */
export const getDashboardService = () =>
  apiClient.get<DashboardResponse>('/api/dashboard');
