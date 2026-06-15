"use client";

import { useState } from "react";
import { useKategoriSampah } from "@/hooks/useKategoriSampah";
import Table, { type TableColumn } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import type { KategoriSampah } from "@/types/kategori-sampah.types";

export default function KategoriSampahPage() {
  const { data, isLoading, create, update, remove } = useKategoriSampah();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<KategoriSampah | null>(null);
  const [saving, setSaving] = useState(false);

  // State form
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  // Buka modal untuk tambah
  const handleAdd = () => {
    setEditing(null);
    setNamaKategori("");
    setDeskripsi("");
    setShowModal(true);
  };

  // Buka modal untuk edit (pre-fill data)
  const handleEdit = (row: KategoriSampah) => {
    setEditing(row);
    setNamaKategori(row.nama_kategori);
    setDeskripsi(row.deskripsi || "");
    setShowModal(true);
  };

  // Submit form (tambah atau edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await update(editing.id_kategori, {
          nama_kategori: namaKategori,
          deskripsi,
          is_active: editing.is_active,
        });
      } else {
        await create({ nama_kategori: namaKategori, deskripsi });
      }
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  // Hapus
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await remove(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  // Stats calculation
  const totalKategori = data.length;
  const aktifKategori = data.filter((k) => k.is_active).length;
  const nonaktifKategori = totalKategori - aktifKategori;

  // Helper to get category-based styles for logo/badge
  const getCategoryStyles = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("b3")) {
      return "bg-red-50 border-red-100 text-red-600";
    }
    if (lowerName.includes("anorganik") || lowerName.includes("anorganic") || lowerName.includes("non-organik") || lowerName.includes("non organik")) {
      return "bg-amber-50 border-amber-100 text-amber-600";
    }
    if (lowerName.includes("organik") || lowerName.includes("organic")) {
      return "bg-green-50 border-green-100 text-green-600";
    }
    return "bg-gray-50 border-gray-100 text-gray-600";
  };

  // Definisi kolom tabel
  const columns: TableColumn<KategoriSampah>[] = [
    { 
      key: "nama_kategori", 
      header: "Nama Kategori",
      render: (row) => {
        const logoStyles = getCategoryStyles(row.nama_kategori);
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold shadow-sm border ${logoStyles}`}>
              {row.nama_kategori.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-bold text-gray-900 block">{row.nama_kategori}</span>
              <span className="text-xs text-gray-400">ID: {row.id_kategori.substring(0, 8)}...</span>
            </div>
          </div>
        );
      }
    },
    { 
      key: "deskripsi", 
      header: "Deskripsi",
      render: (row) => (
        <p className="text-gray-600 max-w-xs truncate font-medium">
          {row.deskripsi || <span className="text-gray-300 italic">Tidak ada deskripsi</span>}
        </p>
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
            onClick={() => handleDelete(row.id_kategori)}
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
          <h1 className="text-3xl font-extrabold tracking-tight">Kategori Sampah</h1>
          <p className="text-green-50 font-medium">Kelola kategori sampah utama untuk alur klasifikasi timbangan.</p>
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
          Tambah Kategori
        </Button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Kategori</span>
            <span className="text-2xl font-black text-gray-900">{totalKategori}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Kategori Aktif</span>
            <span className="text-2xl font-black text-emerald-600">{aktifKategori}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Kategori Nonaktif</span>
            <span className="text-2xl font-black text-rose-500">{nonaktifKategori}</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        padding={false}
        className="overflow-hidden border-none shadow-xl shadow-gray-100/50"
      >
        <Table columns={columns} data={data} isLoading={isLoading} rowKey="id_kategori" />
      </Card>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? "Edit Kategori" : "Tambah Kategori Baru"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Nama Kategori" value={namaKategori} required
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Contoh: Plastik, Kertas, Logam" 
            className="focus:border-green-500 focus:ring-green-500 rounded-xl border-gray-300"
          />
          <Input label="Deskripsi (Opsional)" value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Keterangan singkat tentang kategori" 
            className="focus:border-green-500 focus:ring-green-500 rounded-xl border-gray-300"
          />
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={saving} className="rounded-xl shadow-md">
              {editing ? "Simpan Perubahan" : "Tambah Kategori"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
