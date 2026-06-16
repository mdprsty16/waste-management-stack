import { z } from "zod";
import { errorResponse } from "./response";

/**
 * Validasi request body dengan Zod schema.
 * Otomatis return 400 jika validasi gagal.
 * Return parsed body jika sukses.
 */
export function validate<T>(schema: z.ZodSchema<T>, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const messages = result.error.issues.map((i) => i.message).join(", ");
    return { ok: false as const, response: errorResponse(messages, 400) };
  }
  return { ok: true as const, data: result.data };
}

// ─── KATEGORI ───
export const createKategoriSchema = z.object({
  nama_kategori: z.string().min(1, "Nama kategori wajib diisi"),
  deskripsi: z.string().optional(),
});
export const updateKategoriSchema = createKategoriSchema.extend({
  is_active: z.boolean(),
});

// ─── JENIS SAMPAH ───
const jenisBase = {
  id_kategori: z.string().uuid("ID kategori tidak valid"),
  nama_jenis: z.string().min(1, "Nama jenis wajib diisi"),
  densitas_kg_per_m3: z.number().positive("Densitas harus lebih dari 0"),
  harga_per_kg: z.number().positive("Harga harus lebih dari 0"),
  satuan: z.enum(["kg", "pcs"]).optional().default("kg"),
  berat_per_pcs: z.number().positive().nullable().optional(),
};
export const createJenisSchema = z.object(jenisBase);
export const updateJenisSchema = z.object({ ...jenisBase, is_active: z.boolean() });

// ─── NASABAH ───
export const createNasabahSchema = z.object({
  nama: z.string().min(1, "Nama nasabah wajib diisi"),
  nomor_hp: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
});
export const updateNasabahSchema = createNasabahSchema.extend({
  kode_nasabah: z.string().optional(),
  is_active: z.boolean().optional(),
});

// ─── TRANSAKSI ───
export const transaksiItemSchema = z.object({
  id_jenis_sampah: z.string().uuid("ID jenis sampah tidak valid"),
  berat_kg: z.number().positive("Berat harus lebih dari 0"),
});
export const createTransaksiSchema = z.object({
  id_nasabah: z.string().uuid("ID nasabah tidak valid"),
  tanggal: z.string().optional(),
  items: z.array(transaksiItemSchema).min(1, "Minimal 1 item sampah"),
});

// ─── PENGATURAN ───
export const updatePengaturanSchema = z.object({
  kapasitas_maksimal_m3: z.number().nonnegative(),
  threshold_persen: z.number().min(0).max(100),
});

// ─── PENGANGKUTAN ───
export const createPengangkutanSchema = z.object({
  volume_m3_diangkut: z.number().positive("Volume harus lebih dari 0"),
  keterangan: z.string().optional(),
});

// ─── AUTH ───
export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});
