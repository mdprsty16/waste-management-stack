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

  // Definisi kolom tabel
  const columns: TableColumn<KategoriSampah>[] = [
    { key: "nama_kategori", header: "Nama Kategori" },
    { key: "deskripsi", header: "Deskripsi",
      render: (row) => row.deskripsi || "-" },
    { key: "is_active", header: "Status",
      render: (row) => (
        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
          row.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    { key: "aksi", header: "Aksi",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id_kategori)}>Hapus</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Kategori Sampah"
        subtitle={`Total: ${data.length} kategori`}
        action={<Button onClick={handleAdd}>+ Tambah Kategori</Button>}
        padding={false}
      >
        <Table columns={columns} data={data} isLoading={isLoading} rowKey="id_kategori" />
      </Card>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? "Edit Kategori" : "Tambah Kategori Baru"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Kategori" value={namaKategori} required
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Contoh: Plastik, Kertas, Logam" />
          <Input label="Deskripsi (Opsional)" value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Keterangan singkat tentang kategori" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit" isLoading={saving}>
              {editing ? "Simpan Perubahan" : "Tambah Kategori"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
