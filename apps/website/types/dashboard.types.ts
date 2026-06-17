// ============================================================
// Dashboard Types — Interface untuk data dashboard & laporan
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
  prediksi: PrediksiMingguDepan;
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

/** Data prediksi per kategori */
export interface KategoriPrediksiItem {
  kategori: string;
  prediksi_kg: number;
}

/** Ringkasan akurasi prediksi */
export interface AkurasiPrediksi {
  rata_rata_error_persen: number | null;
  jumlah_data_prediksi: number;
  label_akurasi: string;
}

/** Response agregator dari GET /api/dashboard */
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
  grafik_kategori_prediksi: KategoriPrediksiItem[];
  grafik_mingguan: GrafikMingguan;
  alert_sistem: AlertSistem;
  akurasi: AkurasiPrediksi;
}
