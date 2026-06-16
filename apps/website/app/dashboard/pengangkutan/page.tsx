"use client";

import { useState, useMemo } from "react";
import { usePengangkutan } from "@/hooks/usePengangkutan";
import Table, { type TableColumn } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import type { Pengangkutan } from "@/types/pengangkutan.types";

export default function PengangkutanPage() {
  const { data, isLoading, create } = usePengangkutan();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State form
  const [volume, setVolume] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // Filter data berdasarkan kata kunci pencarian
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      const keteranganMatch = item.keterangan?.toLowerCase().includes(query) ?? false;
      const volumeMatch = String(item.volume_m3_diangkut).includes(query);
      const tanggalMatch = new Date(item.tanggal).toLocaleDateString("id-ID").includes(query);
      return keteranganMatch || volumeMatch || tanggalMatch;
    });
  }, [data, searchQuery]);

  // Stats
  const totalPickup = data.reduce((sum, p) => sum + p.volume_m3_diangkut, 0);
  const avgPickup = data.length > 0 ? (totalPickup / data.length) : 0;
  const lastPickup = data.length > 0 ? data[0] : null;

  // Buka modal
  const handleAdd = () => {
    setVolume("");
    setKeterangan("");
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create({
        volume_m3_diangkut: Number(volume),
        keterangan: keterangan || undefined,
      });
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan pengangkutan");
    } finally {
      setSaving(false);
    }
  };

  // Kolom tabel
  const columns: TableColumn<Pengangkutan>[] = [
    {
      key: "tanggal",
      header: "Tanggal",
      render: (row) => (
        <span className="font-semibold text-gray-900">
          {new Date(row.tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "volume_m3_diangkut",
      header: "Volume Diangkut",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          {row.volume_m3_diangkut} m³
        </span>
      ),
    },
    {
      key: "keterangan",
      header: "Keterangan",
      render: (row) => row.keterangan ? (
        <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          {row.keterangan}
        </span>
      ) : (
        <span className="text-gray-300 italic text-sm">-</span>
      ),
    },
    {
      key: "created_at",
      header: "Dicatat Pada",
      render: (row) => (
        <span className="text-sm text-gray-500">
          {new Date(row.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-3xl shadow-xl shadow-emerald-100 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Riwayat Pengangkutan</h1>
          <p className="text-emerald-50 font-medium">Catat dan pantau volume sampah yang diangkut dari gudang.</p>
        </div>
        <Button
          onClick={handleAdd}
          variant="secondary"
          className="relative z-10 bg-white text-emerald-700 border-none hover:bg-emerald-50 hover:scale-[1.03] transition-all duration-200 shadow-lg"
          size="lg"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Catat Pengangkutan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Pengangkutan</span>
            <span className="text-2xl font-black text-gray-900">{data.length} Kali</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Volume Diangkut</span>
            <span className="text-2xl font-black text-emerald-600">{totalPickup.toFixed(2)} m³</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Rata-rata per Pickup</span>
            <span className="text-2xl font-black text-amber-600">{avgPickup.toFixed(2)} m³</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tanggal, volume, atau keterangan..."
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="text-xs font-bold text-gray-400">
          Menampilkan {filteredData.length} dari {data.length} pengangkutan
        </div>
      </div>

      {/* Table */}
      <Card padding={false} className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
        <Table columns={columns} data={filteredData} isLoading={isLoading} rowKey="id_pengangkutan" />
      </Card>

      {/* Modal Catat Pengangkutan */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Catat Pengangkutan Baru">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold text-blue-800">
              Setelah mencatat pengangkutan, volume terpakai di gudang akan otomatis berkurang dan dashboard akan diperbarui.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Volume Diangkut (m³)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
              placeholder="Contoh: 1.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Keterangan <span className="text-gray-400 font-normal">(opsional)</span></label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Diangkut truk DLH"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)} className="rounded-xl">
              Batal
            </Button>
            <Button type="submit" isLoading={saving} className="rounded-xl shadow-md">
              Simpan Pengangkutan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
