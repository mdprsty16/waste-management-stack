-- Migrasi: Tambah kolom `satuan` ke tabel `jenis_sampah`
-- Jalankan SQL ini di MySQL VPS sebelum deploy
-- Default 'kg' untuk semua jenis sampah yang sudah ada

ALTER TABLE `jenis_sampah` ADD COLUMN `satuan` VARCHAR(10) NOT NULL DEFAULT 'kg' AFTER `harga_per_kg`;

-- Verifikasi:
-- SELECT id_jenis_sampah, nama_jenis, satuan FROM jenis_sampah;
