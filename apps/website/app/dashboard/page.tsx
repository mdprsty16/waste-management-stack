"use client";

import { useNasabah } from "@/hooks/useNasabah";
import { useTransaksi } from "@/hooks/useTransaksi";
import Card from "@/components/ui/Card";
import StatCard from "@/components/features/dashboard/StatCard";
import BarChart from "@/components/features/dashboard/BarChart";
import LineChart from "@/components/features/dashboard/LineChart";
import Button from "@/components/ui/Button";

// ============================================================
// Dashboard Overview — Menggunakan komponen dari:
// - components/ui/Card, Button
// - components/features/dashboard/StatCard, BarChart, LineChart
// - hooks/useNasabah, hooks/useTransaksi
// ============================================================

/* ── Dummy chart data (nanti dari API) ── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

const barChartData = [
  { label: "Organik", value: 320, color: "#16a34a" },
  { label: "Non-Organik", value: 580, color: "#2563eb" },
  { label: "B3", value: 45, color: "#dc2626" },
  { label: "Plastik", value: 420, color: "#7c3aed" },
  { label: "Kertas", value: 280, color: "#d97706" },
  { label: "Logam", value: 150, color: "#64748b" },
];

const lineChartData = MONTHS.map((m, i) => ({
  label: m,
  value: [12, 18, 25, 22, 35, 42][i],
}));

const weightTrendData = MONTHS.map((m, i) => ({
  label: m,
  value: [120, 210, 340, 290, 450, 520][i],
}));

export default function DashboardOverviewPage() {
  const { nasabahData, isLoading: loadingNasabah } = useNasabah();
  const { transaksiData, isLoading: loadingTransaksi } = useTransaksi();

  const isLoading = loadingNasabah || loadingTransaksi;
  const totalNasabah = nasabahData.length;

  let sampahTerkumpul = 0;
  let saldoTerdistribusi = 0;
  transaksiData.forEach((trx) => {
    sampahTerkumpul += trx.total_berat_kg || 0;
    saldoTerdistribusi += trx.total_harga || 0;
  });

  const totalTransaksi = transaksiData.length;

  const recentTransactions = transaksiData.slice(0, 5).map((trx) => {
    const categoryName =
      trx.detail_transaksi?.[0]?.jenis_sampah?.kategori?.nama_kategori || "Campuran";

    return {
      id: "TRX-" + (trx.id_transaksi || "XXXXX").substring(0, 5).toUpperCase(),
      name: trx.nasabah?.nama || "Unknown",
      type: categoryName,
      weight: `${trx.total_berat_kg || 0} Kg`,
      amount: `Rp ${(trx.total_harga || 0).toLocaleString("id-ID")}`,
      date: new Date(trx.created_at || new Date()).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Selesai",
    };
  });

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl font-bold text-green-700">Memuat Data Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Ringkasan Hari Ini
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Data di bawah ini ditarik langsung dari Database!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" size="lg">
            Unduh Laporan
          </Button>
          <Button variant="primary" size="lg">
            + Tambah Transaksi Baru
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">
        <StatCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          label="Total Nasabah"
          value={totalNasabah.toLocaleString("id-ID")}
          badge="Realtime"
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />
        <StatCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
          label="Sampah (Bulan ini)"
          value={`${sampahTerkumpul} Kg`}
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />
        <StatCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Total Uang Diberikan"
          value={`Rp ${saldoTerdistribusi.toLocaleString("id-ID")}`}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />
        <StatCard
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          label="Total Transaksi"
          value={totalTransaksi.toLocaleString("id-ID")}
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart data={barChartData} title="📊 Sampah per Kategori (Kg)" />
        <LineChart data={lineChartData} title="📈 Tren Transaksi Bulanan" color="#16a34a" />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <LineChart data={weightTrendData} title="📉 Tren Sampah Terkumpul (Kg/Bulan)" color="#2563eb" />
      </div>

      {/* Transaction Table */}
      <Card
        title="Riwayat Transaksi Terbaru"
        action={
          <a
            href="/dashboard/transaksi"
            className="text-base font-bold text-green-700 hover:text-green-900 transition-colors bg-green-100 px-4 py-2 rounded-lg"
          >
            Lihat Semua Riwayat →
          </a>
        }
        padding={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-sm font-extrabold tracking-wider">
              <tr>
                <th className="px-8 py-5">Kode</th>
                <th className="px-8 py-5">Nama Nasabah</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5">Berat</th>
                <th className="px-8 py-5">Total Harga</th>
                <th className="px-8 py-5">Waktu</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-100">
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center text-gray-500 font-medium text-lg">
                    Belum ada transaksi di database.
                  </td>
                </tr>
              )}
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-green-50 transition-colors">
                  <td className="px-8 py-6 text-lg font-bold text-gray-900">{trx.id}</td>
                  <td className="px-8 py-6 text-lg font-semibold text-gray-800">{trx.name}</td>
                  <td className="px-8 py-6">
                    <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold border border-gray-300">
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-lg font-bold text-gray-700">{trx.weight}</td>
                  <td className="px-8 py-6 text-xl font-black text-green-700">{trx.amount}</td>
                  <td className="px-8 py-6 text-lg font-medium text-gray-600">{trx.date}</td>
                  <td className="px-8 py-6">
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-bold border-2 border-green-300">
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
  );
}