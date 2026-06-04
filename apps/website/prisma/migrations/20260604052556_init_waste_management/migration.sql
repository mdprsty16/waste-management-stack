/*
  Warnings:

  - You are about to drop the `daily_aggregate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nama_jenis]` on the table `jenis_sampah` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kode_nasabah]` on the table `nasabah` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nomor_hp]` on the table `nasabah` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `jenis_sampah` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `nasabah` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `kode_nasabah` VARCHAR(20) NULL,
    ADD COLUMN `nomor_hp` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `id_admin` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `daily_aggregate`;

-- CreateTable
CREATE TABLE `admin` (
    `id_admin` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nama_admin` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `admin_username_key`(`username`),
    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `jenis_sampah_nama_jenis_key` ON `jenis_sampah`(`nama_jenis`);

-- CreateIndex
CREATE INDEX `jenis_sampah_nama_jenis_idx` ON `jenis_sampah`(`nama_jenis`);

-- CreateIndex
CREATE UNIQUE INDEX `nasabah_kode_nasabah_key` ON `nasabah`(`kode_nasabah`);

-- CreateIndex
CREATE UNIQUE INDEX `nasabah_nomor_hp_key` ON `nasabah`(`nomor_hp`);

-- CreateIndex
CREATE INDEX `nasabah_nama_idx` ON `nasabah`(`nama`);

-- CreateIndex
CREATE INDEX `transaksi_id_admin_idx` ON `transaksi`(`id_admin`);

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `admin`(`id_admin`) ON DELETE SET NULL ON UPDATE CASCADE;
