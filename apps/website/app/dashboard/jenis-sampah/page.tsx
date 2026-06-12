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

export default function JenisSampahPage() {
  const { data: jenisList, isLoading, create, update, remove } = useJenisSampah();
  const { data: kategoriList } = useKategoriSampah();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<JenisSampah | null>(null);
  const [saving, setSaving] = useState(false);

  // State form
  const [selectedKategori, setSelectedKategori] = useState("");
  const [namaJenis, setNamaJenis] = useState("");
  const [hargaPerKg, setHargaPerKg] = useState("");
  const [densitas, setDensitas] = useState("");

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
    setShowModal(true);
  };

  // Buka modal untuk edit (pre-fill data)
  const handleEdit = (row: JenisSampah) => {
    setEditing(row);
    setSelectedKategori(row.id_kategori);
    setNamaJenis(row.nama_jenis);
    setHargaPerKg(String(row.harga_per_kg));
    setDensitas(String(row.densitas_kg_per_m3));
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
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  // Hapus
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jenis sampah ini?")) return;
    try {
      await remove(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  // Definisi kolom tabel
  const columns: TableColumn<JenisSampah>[] = [
    { key: "nama_jenis", header: "Nama Jenis" },
    { key: "kategori", header: "Kategori",
      render: (row) => row.kategori?.nama_kategori || "-" },
    { key: "harga_per_kg", header: "Harga/Kg",
      render: (row) => `Rp ${row.harga_per_kg.toLocaleString("id-ID")}` },
    { key: "densitas_kg_per_m3", header: "Densitas (Kg/m³)",
      render: (row) => row.densitas_kg_per_m3.toLocaleString("id-ID") },
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
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id_jenis_sampah)}>Hapus</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Jenis Sampah"
        subtitle={`Total: ${jenisList.length} jenis`}
        action={<Button onClick={handleAdd}>+ Tambah Jenis Sampah</Button>}
        padding={false}
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
            placeholder="Contoh: Botol PET, Kardus, Besi" />
          <Input label="Harga per Kg (Rp)" value={hargaPerKg} type="number" required
            onChange={(e) => setHargaPerKg(e.target.value)}
            placeholder="Contoh: 5000" />
          <Input label="Densitas (Kg/m³)" value={densitas} type="number" required
            onChange={(e) => setDensitas(e.target.value)}
            placeholder="Contoh: 30" />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit" isLoading={saving}>
              {editing ? "Simpan Perubahan" : "Tambah Jenis Sampah"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}