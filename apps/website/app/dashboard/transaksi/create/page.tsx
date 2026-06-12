"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNasabah } from "@/hooks/useNasabah";
import { useKategoriSampah } from "@/hooks/useKategoriSampah";
import { useJenisSampah } from "@/hooks/useJenisSampah";
import { useTransaksi } from "@/hooks/useTransaksi";
import SelectAutocomplete from "@/components/ui/SelectAutocomplete";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// === State untuk satu item ===
interface ItemState {
  id: number;  // ID lokal (untuk key React)
  id_kategori: string;
  id_jenis_sampah: string;
  berat_kg: string;  // String karena dari input
}

// === Komponen satu baris item ===
// INI HARUS KOMPONEN TERPISAH agar bisa panggil useJenisSampah per-item
function TransaksiItemRow({
  item,
  index,
  kategoriOptions,
  onChange,
  onRemove,
}: {
  item: ItemState;
  index: number;
  kategoriOptions: { value: string; label: string }[];
  onChange: (field: keyof ItemState, value: string) => void;
  onRemove: () => void;
}) {
  // ⚡ Hook ini otomatis refetch saat item.id_kategori berubah!
  const { data: jenisList } = useJenisSampah(item.id_kategori || undefined);

  const jenisOptions = jenisList.map(j => ({
    value: j.id_jenis_sampah,
    label: `${j.nama_jenis} (Rp ${j.harga_per_kg.toLocaleString("id-ID")}/Kg)`,
  }));

  // Cari data jenis yang dipilih untuk preview kalkulasi
  const selectedJenis = jenisList.find(j => j.id_jenis_sampah === item.id_jenis_sampah);
  const berat = parseFloat(item.berat_kg) || 0;
  const subtotal = selectedJenis ? berat * selectedJenis.harga_per_kg : 0;

  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl space-y-3 relative">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-700">Item #{index + 1}</h4>
        <Button size="sm" variant="danger" onClick={onRemove}>Hapus</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectAutocomplete
          label="Kategori"
          options={kategoriOptions}
          value={item.id_kategori}
          onChange={(val) => {
            onChange("id_kategori", val);
            onChange("id_jenis_sampah", ""); // Reset jenis saat kategori berubah!
          }}
        />
        <SelectAutocomplete
          label="Jenis Sampah"
          options={jenisOptions}
          value={item.id_jenis_sampah}
          onChange={(val) => onChange("id_jenis_sampah", val)}
          disabled={!item.id_kategori}  // Disable jika kategori belum dipilih
        />
        <Input
          label="Berat (Kg)"
          type="number"
          value={item.berat_kg}
          onChange={(e) => onChange("berat_kg", e.target.value)}
          placeholder="0.0"
        />
      </div>
      {/* Preview kalkulasi */}
      {selectedJenis && berat > 0 && (
        <div className="bg-green-50 p-3 rounded-lg text-sm font-medium text-green-800">
          Harga/Kg: Rp {selectedJenis.harga_per_kg.toLocaleString("id-ID")} →
          Subtotal: <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
        </div>
      )}
    </div>
  );
}

// === Halaman utama ===
export default function CreateTransaksiPage() {
  const router = useRouter();
  const { data: nasabahList } = useNasabah({ is_active: "true" });
  const { data: kategoriList } = useKategoriSampah();
  const { create } = useTransaksi();

  const [idNasabah, setIdNasabah] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<ItemState[]>([
    { id: 1, id_kategori: "", id_jenis_sampah: "", berat_kg: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [nextId, setNextId] = useState(2);

  const nasabahOptions = nasabahList.map(n => ({
    value: n.id_nasabah,
    label: `${n.nama}${n.kode_nasabah ? ` (${n.kode_nasabah})` : ""}`,
  }));

  const kategoriOptions = kategoriList
    .filter(k => k.is_active)
    .map(k => ({ value: k.id_kategori, label: k.nama_kategori }));

  // Tambah item baru
  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: nextId, id_kategori: "", id_jenis_sampah: "", berat_kg: "" },
    ]);
    setNextId(prev => prev + 1);
  };

  // Update field di item tertentu
  const updateItem = (id: number, field: keyof ItemState, value: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Hapus item
  const removeItem = (id: number) => {
    if (items.length <= 1) return; // Minimal 1 item
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNasabah || items.some(i => !i.id_jenis_sampah || !i.berat_kg)) {
      alert("Lengkapi semua field!");
      return;
    }
    setSaving(true);
    try {
      await create({
        id_nasabah: idNasabah,
        tanggal,
        items: items.map(i => ({
          id_jenis_sampah: i.id_jenis_sampah,
          berat_kg: parseFloat(i.berat_kg),
        })),
      });
      router.push("/dashboard/transaksi");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan transaksi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card title="Tambah Transaksi Baru">
        <div className="space-y-4">
          <SelectAutocomplete label="Nasabah" options={nasabahOptions}
            value={idNasabah} onChange={setIdNasabah}
            placeholder="Pilih nasabah..." />
          <Input label="Tanggal" type="date" value={tanggal}
            onChange={(e) => setTanggal(e.target.value)} />
        </div>
      </Card>

      <Card title="Item Sampah" action={
        <Button type="button" variant="secondary" onClick={addItem}>
          + Tambah Item
        </Button>
      }>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <TransaksiItemRow
              key={item.id}
              item={item}
              index={idx}
              kategoriOptions={kategoriOptions}
              onChange={(field, val) => updateItem(item.id, field, val)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary"
          onClick={() => router.back()}>Batal</Button>
        <Button type="submit" size="lg" isLoading={saving}>
          Simpan Transaksi
        </Button>
      </div>
    </form>
  );
}