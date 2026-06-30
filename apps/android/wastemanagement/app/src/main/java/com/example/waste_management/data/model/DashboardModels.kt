package com.example.waste_management.data.model

import com.google.gson.annotations.SerializedName

// ============================================================
// Dashboard Models — Sesuai dengan types di website
// nasabah.types.ts, transaksi.types.ts, dashboard.types.ts
// ============================================================

// --- Nasabah (nasabah.types.ts) ---

data class Nasabah(
    @SerializedName("id_nasabah") val idNasabah: String,
    @SerializedName("kode_nasabah") val kodeNasabah: String?,
    @SerializedName("nama") val nama: String,
    @SerializedName("nomor_hp") val nomorHp: String?,
    @SerializedName("rt") val rt: String?,
    @SerializedName("rw") val rw: String?,
    @SerializedName("saldo") val saldo: Double,
    @SerializedName("total_berat_sampah") val totalBeratSampah: Double,
    @SerializedName("is_active") val isActive: Boolean,
    @SerializedName("created_at") val createdAt: String
)

// --- Transaksi (transaksi.types.ts) ---

data class NasabahBrief(
    @SerializedName("nama") val nama: String,
    @SerializedName("kode_nasabah") val kodeNasabah: String?
)

data class AdminBrief(
    @SerializedName("nama_admin") val namaAdmin: String,
    @SerializedName("username") val username: String
)

data class KategoriSampah(
    @SerializedName("nama_kategori") val namaKategori: String
)

data class JenisSampah(
    @SerializedName("kategori") val kategori: KategoriSampah?
)

data class DetailTransaksi(
    @SerializedName("id_detail") val idDetail: String,
    @SerializedName("id_transaksi") val idTransaksi: String,
    @SerializedName("id_jenis_sampah") val idJenisSampah: String,
    @SerializedName("berat_kg") val beratKg: Double,
    @SerializedName("volume_m3") val volumeM3: Double,
    @SerializedName("subtotal_harga") val subtotalHarga: Double,
    @SerializedName("jenis_sampah") val jenisSampah: JenisSampah?
)

data class Transaksi(
    @SerializedName("id_transaksi") val idTransaksi: String,
    @SerializedName("id_nasabah") val idNasabah: String,
    @SerializedName("id_admin") val idAdmin: String?,
    @SerializedName("tanggal") val tanggal: String,
    @SerializedName("total_berat_kg") val totalBeratKg: Double,
    @SerializedName("total_volume_m3") val totalVolumeM3: Double,
    @SerializedName("total_harga") val totalHarga: Double,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("nasabah") val nasabah: NasabahBrief?,
    @SerializedName("admin") val admin: AdminBrief?,
    @SerializedName("detail_transaksi") val detailTransaksi: List<DetailTransaksi>?
)

// --- Dashboard (dashboard.types.ts) ---

data class WeeklyAktual(
    @SerializedName("label") val label: String,
    @SerializedName("total_kg") val totalKg: Double
)

data class PrediksiMingguDepan(
    @SerializedName("label") val label: String,
    @SerializedName("total_kg") val totalKg: Double
)

data class GrafikMingguan(
    @SerializedName("aktual") val aktual: List<WeeklyAktual>,
    @SerializedName("prediksi") val prediksiMingguDepan: PrediksiMingguDepan
)

data class AlertSistem(
    @SerializedName("is_alert") val isAlert: Boolean,
    @SerializedName("pesan") val pesan: String
)

data class DailyTrendData(
    @SerializedName("grafik_mingguan") val grafikMingguan: GrafikMingguan,
    @SerializedName("alert_sistem") val alertSistem: AlertSistem
)

data class KategoriStatItem(
    @SerializedName("kategori") val kategori: String,
    @SerializedName("total_kg") val totalKg: Double
)

data class KategoriPrediksiItem(
    @SerializedName("kategori") val kategori: String,
    @SerializedName("prediksi_kg") val prediksiKg: Double
)

data class AkurasiPrediksi(
    @SerializedName("rata_rata_error_persen") val rataRataErrorPersen: Double?,
    @SerializedName("jumlah_data_prediksi") val jumlahDataPrediksi: Int,
    @SerializedName("label_akurasi") val labelAkurasi: String
)

data class ForecastStep(
    @SerializedName("hari") val hari: String,
    @SerializedName("tanggal") val tanggal: String,
    @SerializedName("prediksi_masuk_m3") val prediksiMasukM3: Double,
    @SerializedName("akumulasi_total_m3") val akumulasiTotalM3: Double
)

data class DashboardKapasitas(
    @SerializedName("current_volume_m3") val currentVolumeM3: Double,
    @SerializedName("max_volume_m3") val maxVolumeM3: Double,
    @SerializedName("persentase") val persentase: Double,
    @SerializedName("threshold_persen") val thresholdPersen: Double,
    @SerializedName("estimated_days_remaining") val estimatedDaysRemaining: Any?, // String or Double
    @SerializedName("recommendation") val recommendation: String?,
    @SerializedName("forecast_simulation_steps") val forecastSimulationSteps: List<ForecastStep>?
)

data class DashboardRingkasan(
    @SerializedName("total_nasabah") val totalNasabah: Int,
    @SerializedName("total_sampah_kg") val totalSampahKg: Double,
    @SerializedName("total_saldo_rupiah") val totalSaldoRupiah: Double,
    @SerializedName("total_transaksi") val totalTransaksi: Int
)

data class TransaksiBrief(
    @SerializedName("id") val id: String,
    @SerializedName("nasabah") val nasabah: String,
    @SerializedName("berat_kg") val beratKg: Double,
    @SerializedName("total_harga") val totalHarga: Double,
    @SerializedName("kategori") val kategori: String,
    @SerializedName("tanggal") val tanggal: String
)

data class DashboardResponse(
    @SerializedName("ringkasan") val ringkasan: DashboardRingkasan,
    @SerializedName("transaksi_terbaru") val transaksiTerbaru: List<TransaksiBrief>,
    @SerializedName("kapasitas") val kapasitas: DashboardKapasitas,
    @SerializedName("grafik_kategori") val grafikKategori: List<KategoriStatItem>,
    @SerializedName("grafik_kategori_prediksi") val grafikKategoriPrediksi: List<KategoriPrediksiItem>?,
    @SerializedName("grafik_mingguan") val grafikMingguan: GrafikMingguan,
    @SerializedName("alert_sistem") val alertSistem: AlertSistem,
    @SerializedName("akurasi") val akurasi: AkurasiPrediksi
)

data class SummaryResponseData(
    @SerializedName("totalNasabah") val totalNasabah: Int,
    @SerializedName("totalSampahKg") val totalSampahKg: Double,
    @SerializedName("totalSampahTerolah") val totalSampahTerolah: Int,
    @SerializedName("totalHematRupiah") val totalHematRupiah: Double
)
