"use client";

import { useState } from "react";
import { useJenisSampah } from "@/hooks/useJenisSampah";
import { useKategoriSampah } from "@/hooks/useKategoriSampah";
import Table, { type TableColumn } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import SelectAutocomplete from "@/components/ui/SelectAutocomplete";
import type { JenisSampah } from "@/types/jenis-sampah.types";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function JenisSampahPage() {
  const { data: jenisList, isLoading, create, update, remove } = useJenisSampah();
  const { data: kategoriList } = useKategoriSampah();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<JenisSampah | null>(null);
  const [saving, setSaving] = useState(false);

  // State for ConfirmModal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "danger" | "warning" | "success" | "info";
    onConfirm?: () => void | Promise<void>;
    confirmText?: string;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
    isLoading: false,
  });

  const showAlert = (title: string, message: string, variant: "danger" | "warning" | "success" | "info" = "info") => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      variant,
      onConfirm: undefined,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    variant: "danger" | "warning" | "success" | "info" = "danger",
    confirmText?: string
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      variant,
      onConfirm,
      confirmText,
      isLoading: false,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.onConfirm) return;
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      await confirmModal.onConfirm();
    } finally {
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  // State form
  const [selectedKategori, setSelectedKategori] = useState("");
  const [namaJenis, setNamaJenis] = useState("");
  const [hargaPerKg, setHargaPerKg] = useState("");
  const [densitas, setDensitas] = useState("");
  const [satuan, setSatuan] = useState<'kg' | 'pcs'>('kg');
  const [beratPerPcs, setBeratPerPcs] = useState("");

  // Ubah kategoriList jadi format SelectAutocomplete (hanya yang aktif)
  const kategoriOptions = kategoriList
    .filter(k => k.is_active)
    .map(k => ({
      value: k.id_kategori,
      label: k.nama_kategori,
    }));

  // Buka modal untuk tambah
  const handleAdd = () => {
    setEditing(null);
    setSelectedKategori("");
    setNamaJenis("");
    setHargaPerKg("");
    setDensitas("");
    setSatuan('kg');
    setBeratPerPcs("");
    setShowModal(true);
  };

  // Buka modal untuk edit (pre-fill data)
  const handleEdit = (row: JenisSampah) => {
    setEditing(row);
    setSelectedKategori(row.id_kategori);
    setNamaJenis(row.nama_jenis);
    setHargaPerKg(String(row.harga_per_kg));
    setDensitas(String(row.densitas_kg_per_m3));
    setSatuan((row.satuan as 'kg' | 'pcs') || 'kg');
    setBeratPerPcs(row.berat_per_pcs != null ? String(Math.round(row.berat_per_pcs * 1000)) : "");  // Konversi kg → gram (dibulatkan)
    setShowModal(true);
  };

  // Submit form (tambah atau edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id_kategori: selectedKategori,
        nama_jenis: namaJenis,
        harga_per_kg: Number(hargaPerKg),
        densitas_kg_per_m3: Number(densitas),
        satuan,
        berat_per_pcs: satuan === 'pcs' && beratPerPcs ? Number(beratPerPcs) / 1000 : null,  // Konversi gram → kg
      };

      if (editing) {
        await update(editing.id_jenis_sampah, {
          ...payload,
          is_active: editing.is_active,
        });
      } else {
        await create(payload);
      }
      setShowModal(false);
    } catch (err) {
      showAlert("Gagal Menyimpan", err instanceof Error ? err.message : "Gagal menyimpan jenis sampah", "danger");
    } finally {
      setSaving(false);
    }
  };

  // Hapus
  const handleDelete = (id: string) => {
    showConfirm(
      "Hapus Jenis Sampah",
      "Apakah Anda yakin ingin menghapus jenis sampah ini?",
      async () => {
        try {
          await remove(id);
          closeConfirmModal();
        } catch (err) {
          closeConfirmModal();
          setTimeout(() => {
            showAlert("Gagal Menghapus", err instanceof Error ? err.message : "Gagal menghapus jenis sampah", "danger");
          }, 300);
        }
      },
      "danger",
      "Ya, Hapus"
    );
  };

  // Stats calculation
  const totalJenis = jenisList.length;
  const maxHarga = jenisList.length ? Math.max(...jenisList.map(j => j.harga_per_kg), 0) : 0;
  const avgHarga = jenisList.length 
    ? Math.round(jenisList.reduce((sum, curr) => sum + curr.harga_per_kg, 0) / jenisList.length) 
    : 0;

  // Helper to get category-based styles
  const getCategoryStyles = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("b3")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (lowerName.includes("anorganik") || lowerName.includes("anorganic") || lowerName.includes("non-organik") || lowerName.includes("non organik")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (lowerName.includes("organik") || lowerName.includes("organic")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-teal-50 text-teal-700 border-teal-200",
      "bg-blue-50 text-blue-700 border-blue-200",
      "bg-indigo-50 text-indigo-700 border-indigo-200",
      "bg-purple-50 text-purple-700 border-purple-200",
    ];
    return colors[hash % colors.length];
  };

  // Definisi kolom tabel
  const columns: TableColumn<JenisSampah>[] = [
    { 
      key: "nama_jenis", 
      header: "Nama Jenis",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600 font-extrabold shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-gray-900 block">{row.nama_jenis}</span>
            <span className="text-xs text-gray-400">ID: {row.id_jenis_sampah.substring(0, 8)}...</span>
          </div>
        </div>
      )
    },
    { 
      key: "kategori", 
      header: "Kategori",
      render: (row) => {
        const catName = row.kategori?.nama_kategori || "-";
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryStyles(catName)}`}>
            {catName}
          </span>
        );
      }
    },
    { 
      key: "harga_per_kg", 
      header: "Harga / Kg",
      render: (row) => (
        <span className="text-base font-black text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100">
          Rp {row.harga_per_kg.toLocaleString("id-ID")}
        </span>
      )
    },
    { 
      key: "densitas_kg_per_m3", 
      header: "Densitas",
      render: (row) => (
        <span className="text-gray-700 font-semibold text-sm">
          {row.densitas_kg_per_m3.toLocaleString("id-ID")} <span className="text-gray-400 font-normal">Kg/m³</span>
        </span>
      )
    },
    {
      key: "satuan",
      header: "Satuan",
      render: (row) => (
        <div className="space-y-1">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
            row.satuan === 'pcs' 
              ? 'bg-violet-50 text-violet-700 border-violet-200' 
              : 'bg-sky-50 text-sky-700 border-sky-200'
          }`}>
            {row.satuan === 'pcs' ? 'Per Buah (pcs)' : 'Per Kilogram (Kg)'}
          </span>
          {row.satuan === 'pcs' && row.berat_per_pcs != null && (
            <p className="text-xs text-gray-500">
              <span className="font-semibold">{(row.berat_per_pcs * 1000).toFixed(0)}g</span> / pcs
            </p>
          )}
        </div>
      )
    },
    { 
      key: "is_active", 
      header: "Status",
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 ${
          row.is_active 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-50" 
            : "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-50"
        }`}>
          <span className={`w-2 h-2 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    { 
      key: "aksi", 
      header: "Pilihan Tindakan",
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="hover:border-green-500 hover:text-green-600 transition-all duration-200"
            onClick={() => handleEdit(row)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            className="hover:bg-red-700 transition-all duration-200"
            onClick={() => handleDelete(row.id_jenis_sampah)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-700 p-8 rounded-3xl shadow-xl shadow-green-100 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Jenis Sampah</h1>
          <p className="text-green-50 font-medium font-semibold">Tentukan harga per Kg, berat jenis/densitas, dan pemetaan kategorinya.</p>
        </div>
        <Button 
          onClick={handleAdd} 
          variant="secondary" 
          className="relative z-10 bg-white text-green-700 border-none hover:bg-green-50 hover:scale-[1.03] transition-all duration-200 shadow-lg"
          size="lg"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Tambah Jenis Sampah
        </Button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Jenis Sampah</span>
            <span className="text-2xl font-black text-gray-900">{totalJenis}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Harga Tertinggi</span>
            <span className="text-2xl font-black text-emerald-600">Rp {maxHarga.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Rata-rata Harga / Kg</span>
            <span className="text-2xl font-black text-amber-600">Rp {avgHarga.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        padding={false}
        className="overflow-hidden border-none shadow-xl shadow-gray-100/50"
      >
        <Table columns={columns} data={jenisList} isLoading={isLoading} rowKey="id_jenis_sampah" />
      </Card>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? "Edit Jenis Sampah" : "Tambah Jenis Sampah Baru"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectAutocomplete
            label="Kategori Sampah"
            options={kategoriOptions}
            value={selectedKategori}
            onChange={setSelectedKategori}
            placeholder="Pilih kategori..."
          />
          <Input label="Nama Jenis" value={namaJenis} required
            onChange={(e) => setNamaJenis(e.target.value)}
            placeholder="Contoh: Botol PET, Kardus, Besi" 
            className="focus:border-green-500 focus:ring-green-500 rounded-xl"
          />
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Satuan Perhitungan</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setSatuan('kg')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                  satuan === 'kg' 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                Per Kilogram (Kg)
              </button>
              <button type="button" onClick={() => setSatuan('pcs')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                  satuan === 'pcs' 
                    ? 'bg-green-50 border-green-500 text-green-700' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                Per Buah (pcs)
              </button>
            </div>
          </div>
          <Input label={satuan === 'pcs' ? 'Harga per Buah (Rp)' : 'Harga per Kg (Rp)'} value={hargaPerKg} type="number" required
            onChange={(e) => setHargaPerKg(e.target.value)}
            placeholder="Contoh: 5000" 
            className="focus:border-green-500 focus:ring-green-500 rounded-xl"
            min="0"
          />
          <Input label="Densitas (Kg/m³)" value={densitas} type="number" required
            onChange={(e) => setDensitas(e.target.value)}
            placeholder="Contoh: 30" 
            className="focus:border-green-500 focus:ring-green-500 rounded-xl"
            min="0"
          />
          {satuan === 'pcs' && (
            <>
              <Input label="Berat per 1 Buah (gram)" value={beratPerPcs} type="number" required
                onChange={(e) => setBeratPerPcs(e.target.value)}
                placeholder="Contoh: 50 (untuk botol aqua), 200 (untuk beling)" 
                className="focus:border-green-500 focus:ring-green-500 rounded-xl"
                min="1"
                step="1"
              />
              {beratPerPcs && Number(beratPerPcs) > 0 && (
                <div className="bg-violet-50 border border-violet-200 p-3 rounded-xl text-sm text-violet-700">
                  <span className="font-bold">Preview:</span> 1 pcs = {Math.round(Number(beratPerPcs))}g = {(Math.round(Number(beratPerPcs)) / 1000).toFixed(4)} Kg
                  <span className="ml-2 text-violet-500">| 10 pcs = {(Math.round(Number(beratPerPcs)) * 10 / 1000).toFixed(2)} Kg</span>
                </div>
              )}
            </>
          )}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={saving} className="rounded-xl shadow-md">
              {editing ? "Simpan Perubahan" : "Tambah Jenis"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm ? handleConfirmAction : undefined}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
}