/*
  Warnings:

  - You are about to drop the column `kategori` on the `jenis_sampah` table. All the data in the column will be lost.
  - Added the required column `id_kategori` to the `jenis_sampah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jenis_sampah` DROP COLUMN `kategori`,
    ADD COLUMN `id_kategori` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `nasabah` ADD COLUMN `saldo` FLOAT NOT NULL DEFAULT 0,
    ADD COLUMN `total_berat_sampah` FLOAT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `kategori_sampah` (
    `id_kategori` VARCHAR(191) NOT NULL,
    `nama_kategori` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `kategori_sampah_nama_kategori_key`(`nama_kategori`),
    PRIMARY KEY (`id_kategori`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `jenis_sampah_id_kategori_idx` ON `jenis_sampah`(`id_kategori`);

-- AddForeignKey
ALTER TABLE `jenis_sampah` ADD CONSTRAINT `jenis_sampah_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_sampah`(`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;
