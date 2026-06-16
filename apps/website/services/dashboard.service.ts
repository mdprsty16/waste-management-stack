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

/** GET /api/dashboard — Aggregator: semua data dashboard dalam 1 panggilan */
export const getDashboardService = () =>
  apiClient.get<DashboardResponse>('/api/dashboard');

// ─── Type untuk response aggregator ───
export interface DashboardResponse {
  ringkasan: {
    total_nasabah: number;
    total_sampah_kg: number;
    total_saldo_rupiah: number;
    total_transaksi: number;
  };
  transaksi_terbaru: Array<{
    id: string;
    nasabah: string;
    berat_kg: number;
    total_harga: number;
    kategori: string;
    tanggal: string;
  }>;
  kapasitas: {
    current_volume_m3: number;
    max_volume_m3: number;
    persentase: number;
    threshold_persen: number;
    estimated_days_remaining: number | string;
    recommendation?: string;
    forecast_simulation_steps?: Array<{
      hari: string;
      tanggal: string;
      prediksi_masuk_m3: number;
      akumulasi_total_m3: number;
    }>;
  };
  grafik_kategori: KategoriStatItem[];
  grafik_mingguan: {
    aktual: { label: string; total_kg: number }[];
    prediksi: { label: string; total_kg: number };
  };
  alert_sistem: {
    is_alert: boolean;
    pesan: string;
  };
}
