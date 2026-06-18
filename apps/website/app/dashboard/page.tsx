"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDashboard } from "@/hooks/useDashboard";
import Card from "@/components/ui/Card";
import StatCard from "@/components/features/dashboard/StatCard";
import Button from "@/components/ui/Button";
import KapasitasCard from "@/components/features/dashboard/KapasitasCard";
import ConfirmModal from "@/components/ui/ConfirmModal";

// Lazy load — komponen berat / di bawah fold / jarang dipake
const BarChart = dynamic(() => import("@/components/features/dashboard/BarChart"), { ssr: false });
const WeeklyTrendChart = dynamic(() => import("@/components/features/dashboard/WeeklyTrendChart"), { ssr: false });
const AlertBanner = dynamic(() => import("@/components/features/dashboard/AlertBanner"), { ssr: false });
const KapasitasModal = dynamic(() => import("@/components/features/dashboard/KapasitasModal"), { ssr: false });
const PengangkutanModal = dynamic(() => import("@/components/features/dashboard/PengangkutanModal"), { ssr: false });

// Duplikasi kecil agar tidak perlu import BarChart cuma buat getColorForIndex
const DYNAMIC_COLORS = [
  "#16a34a", "#2563eb", "#dc2626", "#7c3aed",
  "#d97706", "#0891b2", "#e11d48", "#4f46e5",
  "#059669", "#ca8a04", "#9333ea", "#64748b",
];
function getColorForIndex(index: number): string {
  return DYNAMIC_COLORS[index % DYNAMIC_COLORS.length];
}

// ============================================================
// Dashboard Overview — 1 API call via useDashboard()
// Data dari GET /api/dashboard (aggregator)
// ============================================================

export default function DashboardOverviewPage() {
  const { data, isLoading, refetch } = useDashboard();

  const [alertDismissed, setAlertDismissed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPengangkutanOpen, setIsPengangkutanOpen] = useState(false);
  const [loginTime, setLoginTime] = useState<string>("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "danger" | "warning" | "success" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
  });

  const showAlert = (title: string, message: string, variant: "danger" | "warning" | "success" | "info" = "info") => {
    setConfirmModal({ isOpen: true, title, message, variant });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    setLoginTime(
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-green-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin" />
        </div>
        <p className="text-xl font-bold text-gray-700">Memuat Data Dashboard...</p>
        <p className="text-sm text-gray-400 mt-1">Mengambil data realtime dan prediksi ML</p>
      </div>
    );
  }

  const {
    ringkasan,
    transaksi_terbaru,
    kapasitas,
    grafik_kategori,
    grafik_kategori_prediksi,
    grafik_mingguan,
    alert_sistem,
    akurasi,
  } = data;

  // Data untuk BarChart
  const barChartData = grafik_kategori.map((item, i) => ({
    label: item.kategori,
    value: Number(item.total_kg.toFixed(1)),
    color: getColorForIndex(i),
  }));

  // Data untuk tabel
  const recentTransactions = transaksi_terbaru.map((trx) => ({
    id: "TRX-" + trx.id.substring(0, 5).toUpperCase(),
    name: trx.nasabah,
    type: trx.kategori,
    weight: `${Number(trx.berat_kg).toFixed(2)} Kg`,
    amount: `Rp ${(trx.total_harga || 0).toLocaleString("id-ID")}`,
    date: new Date(trx.tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "Selesai",
  }));

  // Handler
  const handleSendPickupNotification = () => {
    showAlert(
      "Notifikasi Terkirim",
      `Notifikasi penjemputan telah dikirim ke mitra logistik!\n\nPrediksi volume: ${grafik_mingguan.prediksi.total_kg} Kg\nStatus: Menunggu konfirmasi mitra...`,
      "success"
    );
  };

  const handleDownloadReport = () => {
    const now = new Date();
    const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    const tgl = now.toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    const SEP = "=".repeat(68);
    const DASH = "-".repeat(48);

    const baris = (...cols: unknown[]) => cols.map(String).join(",") + "\n";

    // ─── Helper: hitung perubahan week-over-week ───
    const aktual = grafik_mingguan.aktual;
    const perubahanMingguan = aktual.map((a, i) => {
      if (i === 0) return { ...a, perubahan: null, pct: null };
      const prev = aktual[i - 1].total_kg;
      const diff = a.total_kg - prev;
      const pct = prev > 0 ? ((diff / prev) * 100) : 0;
      return { ...a, perubahan: diff, pct };
    });

    const totalAktual = aktual.reduce((s, a) => s + a.total_kg, 0);
    const rataAktual = aktual.length > 0 ? totalAktual / aktual.length : 0;
    const maxAktual = aktual.length > 0 ? Math.max(...aktual.map((a) => a.total_kg)) : 0;
    const minAktual = aktual.length > 0 ? Math.min(...aktual.map((a) => a.total_kg)) : 0;
    const labelMax = aktual.find((a) => a.total_kg === maxAktual)?.label || "-";
    const labelMin = aktual.find((a) => a.total_kg === minAktual)?.label || "-";

    // Tren keseluruhan (bandingkan first vs last)
    const firstVal = aktual.length > 0 ? aktual[0].total_kg : 0;
    const lastVal = aktual.length > 1 ? aktual[aktual.length - 1].total_kg : 0;
    const trenArah = lastVal > firstVal ? "Meningkat" : lastVal < firstVal ? "Menurun" : "Stabil";
    const trenPct = firstVal > 0 ? (((lastVal - firstVal) / firstVal) * 100).toFixed(1) : "0";

    const prediksi = grafik_mingguan.prediksi;

    // Distribusi kategori (urutkan menurun)
    const kategoriSorted = [...grafik_kategori].sort((a, b) => b.total_kg - a.total_kg);
    const totalKategori = kategoriSorted.reduce((s, k) => s + k.total_kg, 0);

    // ─── BUAT CSV ───
    let csv = "";
    csv += "LAPORAN BULANAN BANK SAMPAH SAMPUL BERKASIH (BSSB)\n";
    csv += "IKMP - Kuningan, Jawa Barat\n";
    csv += SEP + "\n\n";

    // ═══════════════ HEADER ═══════════════
    csv += "PERIODE LAPORAN\n";
    csv += DASH + "\n";
    csv += baris("Bulan", monthName);
    csv += baris("Tanggal Cetak", tgl);
    csv += "\n";

    // ═══════════════ A. RINGKASAN ═══════════════
    csv += "A. RINGKASAN STATISTIK\n";
    csv += DASH + "\n";
    csv += baris("Indikator", "Nilai");
    csv += baris("Total Nasabah Aktif", ringkasan.total_nasabah.toLocaleString("id-ID"));
    csv += baris("Total Sampah Terkumpul (Kg)", ringkasan.total_sampah_kg.toLocaleString("id-ID"));
    csv += baris("Total Saldo Warga (Rp)", ringkasan.total_saldo_rupiah.toLocaleString("id-ID"));
    csv += baris("Total Transaksi", ringkasan.total_transaksi.toLocaleString("id-ID"));
    const rataPerTrx = ringkasan.total_transaksi > 0 ? ringkasan.total_sampah_kg / ringkasan.total_transaksi : 0;
    csv += baris("Rata-rata Sampah per Transaksi (Kg)", `${rataPerTrx.toFixed(2)}`);
    csv += baris("Rata-rata Transaksi per Hari", `${(ringkasan.total_transaksi / 30).toFixed(1)}`);
    csv += "\n";

    // ═══════════════ B. KAPASITAS GUDANG ═══════════════
    const statusKapasitas = kapasitas.persentase >= 90 ? "KRITIS - Segera Angkut" :
      kapasitas.persentase >= kapasitas.threshold_persen ? "PERHATIAN - Mendekati Penuh" :
      "AMAN";
    const sisaKapasitas = kapasitas.max_volume_m3 - kapasitas.current_volume_m3;

    csv += "B. KAPASITAS GUDANG\n";
    csv += DASH + "\n";
    csv += baris("Indikator", "Nilai");
    csv += baris("Volume Terpakai (m3)", `${kapasitas.current_volume_m3.toFixed(2)}`);
    csv += baris("Kapasitas Maksimal (m3)", `${kapasitas.max_volume_m3.toFixed(2)}`);
    csv += baris("Sisa Kapasitas (m3)", `${sisaKapasitas.toFixed(2)}`);
    csv += baris("Persentase Terpakai (%)", `${kapasitas.persentase.toFixed(1)}`);
    csv += baris("Ambang Batas (%)", `${kapasitas.threshold_persen}%`);
    csv += baris("Status", statusKapasitas);
    csv += baris("Estimasi Hari Penuh", kapasitas.estimated_days_remaining);
    csv += baris("Rekomendasi AI", kapasitas.recommendation || "-");
    csv += "\n";

    // ═══════════════ C. DISTRIBUSI KATEGORI ═══════════════
    csv += "C. DISTRIBUSI SAMPAH PER KATEGORI\n";
    csv += DASH + "\n";
    csv += baris("Peringkat", "Kategori", "Total (Kg)", "Persentase (%)");
    kategoriSorted.forEach((k, i) => {
      const pct = totalKategori > 0 ? ((k.total_kg / totalKategori) * 100).toFixed(1) : "0";
      csv += baris(`#${i + 1}`, k.kategori, k.total_kg.toFixed(1), pct);
    });
    csv += baris("", "TOTAL", totalKategori.toFixed(1), "100.0");
    csv += "\n";

    // ═══════════════ D. TREN MINGGUAN ═══════════════
    csv += "D. TREN SAMPAH MINGGUAN + ANALISIS PERUBAHAN\n";
    csv += DASH + "\n";
    csv += baris("Minggu", "Total (Kg)", "Perubahan (Kg)", "Perubahan (%)", "Sumber");
    perubahanMingguan.forEach((a) => {
      const perubahanStr = a.perubahan !== null
        ? `${a.perubahan >= 0 ? "+" : ""}${a.perubahan.toFixed(1)}`
        : "-";
      const pctStr = a.pct !== null
        ? `${a.pct >= 0 ? "+" : ""}${a.pct.toFixed(1)}%`
        : "-";
      csv += baris(a.label, a.total_kg.toFixed(1), perubahanStr, pctStr, "Aktual");
    });
    // Baris prediksi dengan perbandingan terhadap minggu terakhir aktual
    const lastAktual = aktual.length > 0 ? aktual[aktual.length - 1].total_kg : 0;
    const predDiff = prediksi.total_kg - lastAktual;
    const predPct = lastAktual > 0 ? ((predDiff / lastAktual) * 100).toFixed(1) : "0";
    csv += baris(
      prediksi.label,
      prediksi.total_kg.toFixed(1),
      `${predDiff >= 0 ? "+" : ""}${predDiff.toFixed(1)}`,
      `${predDiff >= 0 ? "+" : ""}${predPct}%`,
      "Prediksi ML"
    );
    csv += DASH + "\n";
    csv += baris("Total " + aktual.length + " Minggu", totalAktual.toFixed(1), "", "", "");
    csv += baris("Rata-rata per Minggu", rataAktual.toFixed(1), "", "", "");
    csv += baris("Nilai Tertinggi", `${maxAktual.toFixed(1)} (${labelMax})`, "", "", "");
    csv += baris("Nilai Terendah", `${minAktual.toFixed(1)} (${labelMin})`, "", "", "");
    csv += baris("Tren Keseluruhan", `${trenArah} (${trenPct}%)`, "", "", "");
    csv += "\n";

    // ═══════════════ E. PERBANDINGAN AKTUAL VS PREDIKSI ═══════════════
    const selisihPrediksi = prediksi.total_kg - rataAktual;
    const pctVsRata = rataAktual > 0 ? ((selisihPrediksi / rataAktual) * 100).toFixed(1) : "0";
    const estimasiArmada = Math.ceil(prediksi.total_kg / 500);

    csv += "E. PERBANDINGAN AKTUAL VS PREDIKSI\n";
    csv += DASH + "\n";
    csv += baris("Indikator", "Nilai");
    csv += baris("Total Aktual (" + aktual.length + " Minggu)", `${totalAktual.toFixed(1)} Kg`);
    csv += baris("Rata-rata Aktual per Minggu", `${rataAktual.toFixed(1)} Kg`);
    csv += baris("Nilai Tertinggi Aktual", `${maxAktual.toFixed(1)} Kg (${labelMax})`);
    csv += baris("Nilai Terendah Aktual", `${minAktual.toFixed(1)} Kg (${labelMin})`);
    csv += baris("Prediksi Minggu Depan", `${prediksi.total_kg.toFixed(1)} Kg`);
    csv += baris("Selisih (Prediksi vs Rata-rata)", `${selisihPrediksi >= 0 ? "+" : ""}${selisihPrediksi.toFixed(1)} Kg (${pctVsRata}%)`);
    csv += baris("Perbandingan vs Minggu Terakhir", `${predDiff >= 0 ? "+" : ""}${predDiff.toFixed(1)} Kg (${predPct}%)`);
    csv += baris("Estimasi Armada Dibutuhkan", `${estimasiArmada} unit`);
    csv += baris("Tren Keseluruhan", `${trenArah} (${trenPct}%)`);
    csv += "\n";

    // ═══════════════ F. SIMULASI PREDIKSI KAPASITAS ═══════════════
    if (kapasitas.forecast_simulation_steps && kapasitas.forecast_simulation_steps.length > 0) {
      csv += "F. SIMULASI PREDIKSI KAPASITAS HARIAN (7 Hari ke Depan)\n";
      csv += DASH + "\n";
      csv += baris("Hari", "Tanggal", "Prediksi Masuk (m3)", "Akumulasi (m3)", "Sisa (m3)");
      kapasitas.forecast_simulation_steps.slice(0, 7).forEach((s) => {
        const sisa = Math.max(0, kapasitas.max_volume_m3 - s.akumulasi_total_m3);
        csv += baris(s.hari, s.tanggal, s.prediksi_masuk_m3.toFixed(2), s.akumulasi_total_m3.toFixed(2), sisa.toFixed(2));
      });
      csv += "\n";
    }

    // ═══════════════ G. WAWASAN & ANALISIS ═══════════════
    csv += "G. WAWASAN & ANALISIS DATA\n";
    csv += DASH + "\n";

    // Kategori dominan
    const topKategori = kategoriSorted[0];
    const topKategoriPct = totalKategori > 0 && topKategori
      ? ((topKategori.total_kg / totalKategori) * 100).toFixed(1) : "0";
    csv += baris("Kategori Dominan", topKategori
      ? `${topKategori.kategori} (${topKategoriPct}% dari total)` : "-");

    // Minggu dengan volume tertinggi
    csv += baris("Minggu Tersibuk", `${labelMax} (${maxAktual.toFixed(1)} Kg)`);

    // Minggu dengan volume terendah
    csv += baris("Minggu Sepi", `${labelMin} (${minAktual.toFixed(1)} Kg)`);

    // Analisis perubahan
    if (perubahanMingguan.length >= 2) {
      const lastChange = perubahanMingguan[perubahanMingguan.length - 1];
      if (lastChange.pct !== null) {
        const arah = lastChange.pct > 0 ? "kenaikan" : "penurunan";
        csv += baris("Perubahan Terakhir", `${arah} ${Math.abs(lastChange.pct).toFixed(1)}% dari minggu sebelumnya`);
      }
    }

    // Kategori dengan pertumbuhan potensial
    const kateKecil = kategoriSorted.length >= 2 ? kategoriSorted[kategoriSorted.length - 1] : null;
    if (kateKecil && topKategori) {
      const rasio = kateKecil.total_kg > 0 && topKategori.total_kg > 0
        ? (topKategori.total_kg / kateKecil.total_kg).toFixed(1) : "0";
      csv += baris("Potensi Pengembangan", `${kateKecil.kategori} masih rendah (${kateKecil.total_kg.toFixed(1)} Kg), ${rasio}x dari ${topKategori.kategori}`);
    }
    csv += "\n";

    // ═══════════════ H. REKOMENDASI OPERASIONAL ═══════════════
    csv += "H. REKOMENDASI OPERASIONAL\n";
    csv += DASH + "\n";
    csv += baris("Indikator", "Keterangan");
    const statusLabel = alert_sistem.is_alert ? "PERLU TINDAKAN" :
      kapasitas.persentase >= kapasitas.threshold_persen ? "WASPADA" : "AMAN";
    csv += baris("Status", statusLabel);
    csv += baris("Estimasi Volume Depan (Kg)", prediksi.total_kg.toFixed(1));
    csv += baris("Estimasi Armada Dibutuhkan", `${estimasiArmada} unit`);
    csv += baris("Sisa Kapasitas Gudang (m3)", `${sisaKapasitas.toFixed(2)}`);
    csv += baris("Catatan AI", `"${alert_sistem.pesan}"`);
    csv += baris("Rekomendasi Gudang", kapasitas.recommendation || "-");

    // Rekomendasi dinamis
    let rekomendasiTambah = "";
    if (kapasitas.persentase >= 90) {
      rekomendasiTambah = "SEGERA lakukan pengangkutan. Kapasitas gudang hampir penuh.";
    } else if (kapasitas.persentase >= kapasitas.threshold_persen) {
      rekomendasiTambah = "Jadwalkan pengangkutan dalam 3-4 hari ke depan.";
    } else if (prediksi.total_kg > rataAktual * 1.3) {
      rekomendasiTambah = "Waspada potensi lonjakan. Persiapkan armada tambahan.";
    } else {
      rekomendasiTambah = "Operasional berjalan normal. Pantau perkembangan mingguan.";
    }
    csv += baris("Rekomendasi Sistem", rekomendasiTambah);
    csv += "\n";

    // ═══════════════ FOOTER ═══════════════
    csv += SEP + "\n";
    csv += "Dicetak otomatis melalui Sistem BSSB\n";
    csv += `Copyright © ${now.getFullYear()} BSSB IKMP Kuningan\n`;
    csv += "Laporan ini mencakup data aktual transaksi dan prediksi ML.\n";
    csv += `Prediksi menggunakan model ML Random Forest.\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_BSSB_${monthName.replace(/ /g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="space-y-8 animate-fade-in-up">
      {/* ALERT BANNER */}
      {!alertDismissed && (
        <AlertBanner
          alert={alert_sistem}
          onDismiss={() => setAlertDismissed(true)}
          onAction={handleSendPickupNotification}
        />
      )}

      {/* PREMIUM GRADIENT HEADER */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 p-8 rounded-3xl shadow-xl shadow-green-100 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
        <div className="absolute left-1/2 bottom-0 w-40 h-40 bg-white/5 rounded-full blur-2xl transform -translate-y-5" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ringkasan Hari Ini</h2>
            <p className="text-green-100 text-lg font-medium flex items-center gap-2">
              Data per Hari Ini
              {loginTime && (
                <span className="text-sm bg-green-800/50 px-2 py-0.5 rounded-full border border-green-400/30">
                  Waktu Login: {loginTime}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" size="lg" onClick={handleDownloadReport}
              className="bg-white/15 text-white border-white/30 hover:bg-white/25 backdrop-blur-sm"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
            >Unduh Laporan</Button>
          </div>
        </div>
      </div>

      {/* KAPASITAS GUDANG */}
      <KapasitasCard
        data={{
          current_volume_m3: kapasitas.current_volume_m3,
          max_volume_m3: kapasitas.max_volume_m3,
          threshold_persen: kapasitas.threshold_persen,
          percentage: kapasitas.persentase,
          estimated_days_remaining: kapasitas.estimated_days_remaining,
          recommendation: kapasitas.recommendation,
          forecast_simulation_steps: kapasitas.forecast_simulation_steps,
        }}
        isLoading={false}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPengangkutan={() => setIsPengangkutanOpen(true)}
      />

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        <StatCard icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        } label="Total Nasabah" value={ringkasan.total_nasabah.toLocaleString("id-ID")}
          badge="Realtime" iconBg="bg-blue-100" iconColor="text-blue-700" />
        <StatCard icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        } label="Sampah Terkumpul" value={`${Number(ringkasan.total_sampah_kg).toFixed(2)} Kg`}
          iconBg="bg-green-100" iconColor="text-green-700" />
        <StatCard icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        } label="Total Saldo Warga" value={`Rp ${ringkasan.total_saldo_rupiah.toLocaleString("id-ID")}`}
          iconBg="bg-amber-100" iconColor="text-amber-700" />
        <StatCard icon={
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        } label="Total Transaksi" value={ringkasan.total_transaksi.toLocaleString("id-ID")}
          iconBg="bg-purple-100" iconColor="text-purple-700" />
      </div>

      {/* AKURASI PREDIKSI */}
      {akurasi.rata_rata_error_persen !== null && (
        <div className="flex items-center gap-3 px-2">
          <div className={`w-3 h-3 rounded-full ${akurasi.rata_rata_error_persen <= 10 ? 'bg-green-500' : akurasi.rata_rata_error_persen <= 25 ? 'bg-amber-500' : 'bg-red-500'}`} />
          <span className="text-sm font-semibold text-gray-600">
            Akurasi Prediksi: <span className="text-gray-900">{akurasi.label_akurasi}</span>
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Error {akurasi.rata_rata_error_persen}%
          </span>
          <span className="text-xs text-gray-400">
            ({akurasi.jumlah_data_prediksi} data terakhir)
          </span>
        </div>
      )}

      {/* 2 GRAFIK UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart
          data={barChartData}
          prediksiData={grafik_kategori_prediksi}
          title="Distribusi Sampah per Kategori (Kg)"
          isLoading={false}
        />
        <WeeklyTrendChart
          data={{
            aktual: grafik_mingguan.aktual,
            prediksi: grafik_mingguan.prediksi,
          }}
          title="Tren Sampah Mingguan + Prediksi ML"
        />
      </div>

      {/* TABEL TRANSAKSI TERBARU */}
      <Card title="Riwayat Transaksi Terbaru"
        action={
          <a href="/dashboard/transaksi"
            className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-900 transition-all bg-green-50 hover:bg-green-100 px-5 py-2.5 rounded-xl border border-green-200"
          >
            Lihat Semua Riwayat
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        }
        padding={false} className="border-none shadow-xl shadow-gray-100/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nama Nasabah</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Berat</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Harga</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500 font-medium text-lg">Belum ada transaksi di database.</p>
                    </div>
                  </td>
                </tr>
              )}
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-green-50/50 transition-colors duration-150">
                  <td className="px-6 py-4"><span className="font-bold text-gray-900">{trx.name}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-800 text-sm bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      {trx.weight}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className="text-base font-black text-emerald-600">{trx.amount}</span></td>
                  <td className="px-6 py-4"><span className="text-sm font-medium text-gray-500">{trx.date}</span></td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border-2 border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    {/* MODALS */}
    <KapasitasModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSuccess={refetch} />
    <PengangkutanModal isOpen={isPengangkutanOpen} onClose={() => setIsPengangkutanOpen(false)} onSuccess={refetch} />

    <ConfirmModal isOpen={confirmModal.isOpen} onClose={closeConfirmModal}
      title={confirmModal.title} message={confirmModal.message} variant={confirmModal.variant} />
    </>
  );
}
