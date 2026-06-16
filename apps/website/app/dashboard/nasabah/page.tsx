"use client";

import { useState, useMemo } from "react";
import { useNasabah } from "@/hooks/useNasabah";
import Table, { type TableColumn } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import type { Nasabah } from "@/types/nasabah.types";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function NasabahPage() {
  const { data, isLoading, create, update, remove } = useNasabah();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Nasabah | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data berdasarkan kata kunci pencarian
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      
      const nameMatch = item.nama.toLowerCase().includes(query);
      const codeMatch = item.kode_nasabah ? item.kode_nasabah.toLowerCase().includes(query) : false;
      const phoneMatch = item.nomor_hp ? item.nomor_hp.toLowerCase().includes(query) : false;
      const rtMatch = item.rt ? item.rt.toLowerCase().includes(query) : false;
      const rwMatch = item.rw ? item.rw.toLowerCase().includes(query) : false;
      const addressMatch = `${item.rt || ""}/${item.rw || ""}`.includes(query) || `rt ${item.rt || ""}`.includes(query) || `rw ${item.rw || ""}`.includes(query);
      
      return nameMatch || codeMatch || phoneMatch || rtMatch || rwMatch || addressMatch;
    });
  }, [data, searchQuery]);

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
  const [kodeNasabah, setKodeNasabah] = useState("");
  const [nama, setNama] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Buka modal untuk tambah
  const handleAdd = () => {
    setEditing(null);
    setKodeNasabah("");
    setNama("");
    setNomorHp("");
    setRt("");
    setRw("");
    setIsActive(true);
    setShowModal(true);
  };

  // Buka modal untuk edit (pre-fill data)
  const handleEdit = (row: Nasabah) => {
    setEditing(row);
    setKodeNasabah(row.kode_nasabah || "");
    setNama(row.nama);
    setNomorHp(row.nomor_hp || "");
    setRt(row.rt || "");
    setRw(row.rw || "");
    setIsActive(row.is_active);
    setShowModal(true);
  };

  // Submit form (tambah atau edit)
  const processSubmit = async () => {
    setSaving(true);
    try {
      if (editing) {
        await update(editing.id_nasabah, {
          kode_nasabah: kodeNasabah || undefined,
          nama,
          nomor_hp: nomorHp || undefined,
          rt: rt || undefined,
          rw: rw || undefined,
          is_active: isActive,
        });
      } else {
        await create({
          nama,
          nomor_hp: nomorHp || undefined,
          rt: rt || undefined,
          rw: rw || undefined,
        });
      }
      setShowModal(false);
    } catch (err) {
      showAlert("Gagal Menyimpan", err instanceof Error ? err.message : "Gagal menyimpan data nasabah", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actionText = editing ? "mengubah" : "menambahkan";
    const dataPreview = `Nama: ${nama}\nNo. HP: ${nomorHp || '-'}\nRT/RW: ${rt || '-'}/${rw || '-'}`;
    
    showConfirm(
      "Konfirmasi Data",
      `Apakah Anda yakin ingin ${actionText} data nasabah berikut?\n\n${dataPreview}`,
      async () => {
        await processSubmit();
        closeConfirmModal();
      },
      "success",
      "Ya, Simpan"
    );
  };

  const handleCancel = () => {
    // Cek apakah ada isian
    if (nama || nomorHp || rt || rw || kodeNasabah) {
      showConfirm(
        "Batal Mengisi",
        "Persetujuan: data yang sudah Anda tuliskan tidak akan disimpan. Yakin ingin membatalkan?",
        () => {
          setShowModal(false);
          closeConfirmModal();
        },
        "warning",
        "Ya, Batal"
      );
    } else {
      setShowModal(false);
    }
  };

  // Hapus/Nonaktifkan
  const handleDelete = (id: string) => {
    showConfirm(
      "Nonaktifkan Nasabah",
      "Apakah Anda yakin ingin menonaktifkan nasabah ini? Nasabah yang dinonaktifkan tidak akan dapat melakukan transaksi baru.",
      async () => {
        try {
          await remove(id);
          closeConfirmModal();
        } catch (err) {
          closeConfirmModal();
          setTimeout(() => {
            showAlert("Gagal Menonaktifkan", err instanceof Error ? err.message : "Gagal menonaktifkan nasabah", "danger");
          }, 300);
        }
      },
      "danger",
      "Ya, Nonaktifkan"
    );
  };

  // Stats calculation
  const totalNasabah = data.length;
  const totalSaldo = data.reduce((sum, curr) => sum + curr.saldo, 0);
  const totalBerat = data.reduce((sum, curr) => sum + curr.total_berat_sampah, 0);

  // Definisi kolom tabel
  const columns: TableColumn<Nasabah>[] = [
    {
      key: "kode_nasabah",
      header: "Kode",
      render: (row) => (
        <code className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200">
          {row.kode_nasabah || "TIDAK ADA"}
        </code>
      ),
    },
    { 
      key: "nama", 
      header: "Nama Nasabah",
      render: (row) => {
        // Generate consistent background color based on name
        const colors = ["bg-emerald-50 text-emerald-700 border-emerald-100", "bg-teal-50 text-teal-700 border-teal-100", "bg-blue-50 text-blue-700 border-blue-100", "bg-indigo-50 text-indigo-700 border-indigo-100", "bg-purple-50 text-purple-700 border-purple-100"];
        const charCodeSum = row.nama.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const avatarStyle = colors[charCodeSum % colors.length];

        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm border shadow-sm ${avatarStyle}`}>
              {row.nama.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <span className="font-bold text-gray-900 block">{row.nama}</span>
              <span className="text-xs text-gray-400">Terdaftar: {new Date(row.created_at).toLocaleDateString("id-ID")}</span>
            </div>
          </div>
        );
      }
    },
    { 
      key: "nomor_hp", 
      header: "Nomor HP", 
      render: (row) => row.nomor_hp ? (
        <a 
          href={`https://wa.me/${row.nomor_hp.replace(/^0/, "62")}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.023 14.068.993 11.458.993c-5.462 0-9.902 4.385-9.906 9.814-.001 1.748.47 3.456 1.364 4.966L1.897 20.35l4.75-1.196zm12.39-4.31c-.327-.162-1.928-.94-2.224-1.047-.297-.108-.512-.162-.726.162-.215.324-.833 1.046-1.02 1.262-.188.216-.376.243-.703.082-.327-.162-1.38-.504-2.628-1.608-.971-.857-1.627-1.917-1.817-2.242-.19-.324-.02-.5-.184-.66-.147-.145-.327-.379-.49-.569-.164-.19-.219-.324-.328-.54-.109-.217-.055-.405-.027-.567.027-.162.215-.513.323-.756.108-.243.162-.405.243-.567.08-.162.04-.324-.014-.486-.054-.162-.513-1.216-.703-1.649-.185-.42-.37-.365-.512-.373-.13-.006-.282-.007-.432-.007-.15 0-.395.055-.601.27-.207.216-.79.756-.79 1.84 0 1.08.795 2.124.904 2.27.109.15 1.562 2.352 3.785 3.305.529.227.942.362 1.264.463.532.167 1.017.143 1.4.087.427-.062 1.928-.777 2.197-1.527.269-.75.269-1.392.19-1.527-.08-.135-.297-.216-.624-.379z"/>
          </svg>
          {row.nomor_hp}
        </a>
      ) : <span className="text-gray-300 italic text-sm">Tidak ada</span>,
    },
    {
      key: "alamat",
      header: "Alamat (RT/RW)",
      render: (row) => (row.rt || row.rw) ? (
        <span className="font-semibold text-gray-700 text-sm">
          RT {row.rt || "00"}/RW {row.rw || "00"}
        </span>
      ) : <span className="text-gray-300 italic text-sm">Tidak ada</span>,
    },
    {
      key: "saldo",
      header: "Saldo Bank",
      render: (row) => (
        <span className="text-base font-black text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-lg border border-emerald-100">
          Rp {row.saldo.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      key: "total_berat_sampah",
      header: "Total Sampah",
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-semibold text-gray-800 text-sm bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg shadow-sm">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          {Number(row.total_berat_sampah).toFixed(2)} Kg
        </span>
      ),
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
          {row.is_active && (
            <Button 
              size="sm" 
              variant="danger" 
              className="hover:bg-red-700 transition-all duration-200"
              onClick={() => handleDelete(row.id_nasabah)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
            >
              Nonaktifkan
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-green-600 to-teal-700 p-8 rounded-3xl shadow-xl shadow-green-100 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Daftar Nasabah</h1>
          <p className="text-green-50 font-medium font-semibold">Pantau saldo tabungan nasabah, total berat sampah terkumpul, dan profil alamatnya.</p>
        </div>
        <Button 
          onClick={handleAdd} 
          variant="secondary" 
          className="relative z-10 bg-white text-green-700 border-none hover:bg-green-50 hover:scale-[1.03] transition-all duration-200 shadow-lg"
          size="lg"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        >
          Tambah Nasabah
        </Button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Nasabah</span>
            <span className="text-2xl font-black text-gray-900">{totalNasabah}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Saldo Warga</span>
            <span className="text-2xl font-black text-emerald-600">Rp {totalSaldo.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Sampah Nasabah</span>
            <span className="text-2xl font-black text-amber-600">{Number(totalBerat).toFixed(2)} Kg</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
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
            placeholder="Cari nama, kode, RT/RW, atau nomor HP..."
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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
          Menampilkan {filteredData.length} dari {totalNasabah} nasabah
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        padding={false}
        className="overflow-hidden border-none shadow-xl shadow-gray-100/50"
      >
        <Table columns={columns} data={filteredData} isLoading={isLoading} rowKey="id_nasabah" />
      </Card>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={showModal} onClose={handleCancel}
        title={editing ? "Edit Profil Nasabah" : "Tambah Nasabah Baru"}>
        <form onSubmit={handlePreviewSubmit} className="space-y-4">
          {editing ? (
            <Input
              label="Kode Nasabah"
              value={kodeNasabah}
              onChange={(e) => setKodeNasabah(e.target.value)}
              placeholder="Contoh: SLB-001"
              className="focus:border-green-500 focus:ring-green-500 rounded-xl"
            />
          ) : (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-green-800">
                Kode nasabah <code className="bg-green-100 px-1.5 py-0.5 rounded font-mono text-green-900">SLB-xxx</code> akan digenerate otomatis oleh sistem.
              </p>
            </div>
          )}
          <Input
            label="Nama Nasabah"
            value={nama}
            required
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap nasabah"
            className="focus:border-green-500 focus:ring-green-500 rounded-xl"
          />
          <Input
            label="Nomor Handphone"
            value={nomorHp}
            type="tel"
            onChange={(e) => setNomorHp(e.target.value)}
            placeholder="Contoh: 08123456789"
            className="focus:border-green-500 focus:ring-green-500 rounded-xl"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="RT"
              value={rt}
              onChange={(e) => setRt(e.target.value)}
              placeholder="Contoh: 001"
              className="focus:border-green-500 focus:ring-green-500 rounded-xl"
            />
            <Input
              label="RW"
              value={rw}
              onChange={(e) => setRw(e.target.value)}
              placeholder="Contoh: 002"
              className="focus:border-green-500 focus:ring-green-500 rounded-xl"
            />
          </div>
          {editing && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-150">
              <input
                type="checkbox"
                id="is_active_checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="is_active_checkbox" className="text-sm font-bold text-gray-700 select-none">
                Status Aktif
              </label>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleCancel} className="rounded-xl">Batal</Button>
            <Button type="submit" isLoading={saving} className="rounded-xl shadow-md">
              {editing ? "Simpan Perubahan" : "Tambah Nasabah"}
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