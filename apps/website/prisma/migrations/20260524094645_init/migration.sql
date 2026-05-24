-- CreateTable
CREATE TABLE `nasabah` (
    `id_nasabah` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `rt` VARCHAR(10) NULL,
    `rw` VARCHAR(10) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_nasabah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_sampah` (
    `id_jenis_sampah` VARCHAR(191) NOT NULL,
    `nama_jenis` VARCHAR(100) NOT NULL,
    `densitas_kg_per_m3` FLOAT NOT NULL,
    `harga_per_kg` FLOAT NOT NULL,
    `kategori` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_jenis_sampah`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `id_transaksi` VARCHAR(191) NOT NULL,
    `id_nasabah` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `total_berat_kg` FLOAT NOT NULL,
    `total_volume_m3` FLOAT NOT NULL,
    `total_harga` FLOAT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `transaksi_id_nasabah_idx`(`id_nasabah`),
    PRIMARY KEY (`id_transaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_transaksi` (
    `id_detail` VARCHAR(191) NOT NULL,
    `id_transaksi` VARCHAR(191) NOT NULL,
    `id_jenis_sampah` VARCHAR(191) NOT NULL,
    `berat_kg` FLOAT NOT NULL,
    `volume_m3` FLOAT NOT NULL,
    `subtotal_harga` FLOAT NOT NULL,

    INDEX `detail_transaksi_id_transaksi_idx`(`id_transaksi`),
    INDEX `detail_transaksi_id_jenis_sampah_idx`(`id_jenis_sampah`),
    PRIMARY KEY (`id_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_aggregate` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `volume` FLOAT NOT NULL,
    `is_open` TINYINT NOT NULL,
    `is_collection_day` TINYINT NOT NULL,
    `day_of_week` TINYINT NOT NULL,
    `is_weekend` TINYINT NOT NULL,
    `week_of_month` TINYINT NOT NULL,
    `month` TINYINT NOT NULL,
    `is_holiday` TINYINT NOT NULL,
    `days_since_collection` INTEGER NOT NULL,
    `overload_risk` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `daily_aggregate_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_nasabah_fkey` FOREIGN KEY (`id_nasabah`) REFERENCES `nasabah`(`id_nasabah`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi`(`id_transaksi`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_id_jenis_sampah_fkey` FOREIGN KEY (`id_jenis_sampah`) REFERENCES `jenis_sampah`(`id_jenis_sampah`) ON DELETE RESTRICT ON UPDATE CASCADE;
