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
    <div className="p-5 border-2 border-gray-200 hover:border-emerald-300 rounded-2xl space-y-4 relative transition-all duration-300 bg-white shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 text-sm font-black border border-emerald-200">
            {index + 1}
          </span>
          <h4 className="font-bold text-gray-800">Item Sampah</h4>
        </div>
        <Button 
          size="sm" 
          variant="danger" 
          onClick={onRemove}
          className="hover:bg-red-700 transition-all duration-200"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        >
          Hapus
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          className="focus:border-green-500 focus:ring-green-500 rounded-xl"
        />
      </div>
      {/* Preview kalkulasi */}
      {selectedJenis && berat > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl text-sm font-semibold text-green-800 flex items-center justify-between">
          <span>
            <span className="text-gray-500 font-normal">Harga/Kg:</span> Rp {selectedJenis.harga_per_kg.toLocaleString("id-ID")}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Subtotal: <strong className="text-emerald-700 text-base">Rp {subtotal.toLocaleString("id-ID")}</strong>
          </span>
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 p-8 rounded-3xl shadow-xl shadow-green-100 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Tambah Transaksi Baru</h1>
          <p className="text-green-50 font-medium font-semibold">Catat penjualan sampah nasabah dengan perhitungan otomatis.</p>
        </div>
      </div>

      {/* Nasabah & Tanggal Card */}
      <Card className="border-none shadow-xl shadow-gray-100/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800">Informasi Nasabah</h3>
          </div>
          <SelectAutocomplete label="Pilih Nasabah" options={nasabahOptions}
            value={idNasabah} onChange={setIdNasabah}
            placeholder="Cari dan pilih nasabah..." />
          <Input label="Tanggal Transaksi" type="date" value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="focus:border-green-500 focus:ring-green-500 rounded-xl" />
        </div>
      </Card>

      {/* Item Sampah Section */}
      <Card 
        title={`Item Sampah (${items.length})`} 
        action={
          <Button 
            type="button" 
            variant="secondary" 
            onClick={addItem}
            className="hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Tambah Item
          </Button>
        }
        className="border-none shadow-xl shadow-gray-100/50"
      >
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

      {/* Submit Section */}
      <div className="flex gap-3 justify-end items-center">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => router.back()}
          className="rounded-xl"
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          isLoading={saving}
          className="rounded-xl shadow-lg shadow-green-200/50 hover:scale-[1.02] transition-all duration-200"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          }
        >
          Simpan Transaksi
        </Button>
      </div>
    </form>
  );
}