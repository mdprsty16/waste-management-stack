// ============================================================
// Dashboard Types — Interface untuk data dashboard
// Digunakan oleh: hooks/useDailyTrend.ts, hooks/useKategoriStats.ts
// ============================================================

/** Data tren mingguan aktual dari DB */
export interface WeeklyAktual {
  label: string;
  total_kg: number;
}

/** Data prediksi minggu depan dari ML */
export interface PrediksiMingguDepan {
  label: string;
  total_kg: number;
}

/** Grafik mingguan gabungan aktual + prediksi */
export interface GrafikMingguan {
  aktual: WeeklyAktual[];
  prediksi_minggu_depan: PrediksiMingguDepan;
}

/** Status alert sistem */
export interface AlertSistem {
  is_alert: boolean;
  pesan: string;
}

/** Response lengkap dari GET /api/daily */
export interface DailyTrendData {
  grafik_mingguan: GrafikMingguan;
  alert_sistem: AlertSistem;
}

/** Data statistik kategori dari GET /api/dashboard/kategori-stats */
export interface KategoriStatItem {
  kategori: string;
  total_kg: number;
}
