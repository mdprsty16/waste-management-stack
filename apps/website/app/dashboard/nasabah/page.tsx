"use client";

import { useState } from "react";
import { useNasabah } from "@/hooks/useNasabah";
import Table, { type TableColumn } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import type { Nasabah } from "@/types/nasabah.types";

export default function NasabahPage() {
  const { data, isLoading, create, update, remove } = useNasabah();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Nasabah | null>(null);
  const [saving, setSaving] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          kode_nasabah: kodeNasabah || undefined,
          nama,
          nomor_hp: nomorHp || undefined,
          rt: rt || undefined,
          rw: rw || undefined,
        });
      }
      setShowModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  // Hapus/Nonaktifkan
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menonaktifkan nasabah ini?")) return;
    try {
      await remove(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menonaktifkan nasabah");
    }
  };

  // Definisi kolom tabel
  const columns: TableColumn<Nasabah>[] = [
    {
      key: "kode_nasabah",
      header: "Kode",
      render: (row) => row.kode_nasabah || "-",
    },
    { key: "nama", header: "Nama Nasabah" },
    { key: "nomor_hp", header: "No. HP", render: (row) => row.nomor_hp || "-" },
    {
      key: "alamat",
      header: "RT/RW",
      render: (row) => (row.rt || row.rw ? `RT ${row.rt || "-"}/RW ${row.rw || "-"}` : "-"),
    },
    {
      key: "saldo",
      header: "Saldo",
      render: (row) => `Rp ${row.saldo.toLocaleString("id-ID")}`,
    },
    {
      key: "total_berat_sampah",
      header: "Total Sampah",
      render: (row) => `${row.total_berat_sampah} Kg`,
    },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
          row.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
          {row.is_active && (
            <Button size="sm" variant="danger" onClick={() => handleDelete(row.id_nasabah)}>
              Nonaktifkan
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Daftar Nasabah"
        subtitle={`Total: ${data.length} nasabah`}
        action={<Button onClick={handleAdd}>+ Tambah Nasabah</Button>}
        padding={false}
      >
        <Table columns={columns} data={data} isLoading={isLoading} rowKey="id_nasabah" />
      </Card>

      {/* Modal Form Tambah/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editing ? "Edit Nasabah" : "Tambah Nasabah Baru"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kode Nasabah (Opsional)"
            value={kodeNasabah}
            onChange={(e) => setKodeNasabah(e.target.value)}
            placeholder="Contoh: NSB-001"
          />
          <Input
            label="Nama Nasabah"
            value={nama}
            required
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama lengkap nasabah"
          />
          <Input
            label="Nomor Handphone"
            value={nomorHp}
            type="tel"
            onChange={(e) => setNomorHp(e.target.value)}
            placeholder="Contoh: 08123456789"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="RT"
              value={rt}
              onChange={(e) => setRt(e.target.value)}
              placeholder="Contoh: 001"
            />
            <Input
              label="RW"
              value={rw}
              onChange={(e) => setRw(e.target.value)}
              placeholder="Contoh: 002"
            />
          </div>
          {editing && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active_checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="is_active_checkbox" className="text-sm font-bold text-gray-700">
                Status Aktif
              </label>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button type="submit" isLoading={saving}>
              {editing ? "Simpan Perubahan" : "Tambah Nasabah"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}