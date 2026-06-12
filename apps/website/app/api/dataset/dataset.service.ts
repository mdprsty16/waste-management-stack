// apps/website/app/api/dataset/dataset.service.ts
import * as datasetRepository from './dataset.repository';

// Fungsi untuk mengubah JSON Array menjadi String CSV secara manual tanpa lib eksternal
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  // Ambil header dari key object pertama
  const headers = Object.keys(data[0]).join(',');
  
  const rows = data.map(row =>
    Object.values(row)
      .map(val => {
        let text = String(val ?? '');
        // Bersihkan teks dari baris baru atau tanda koma agar tidak merusak format CSV
        if (text.includes(',') || text.includes('"') || text.includes('\n') || text.includes('\r')) {
          text = `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      })
      .join(',')
  );

  return [headers, ...rows].join('\n');
}

export async function getDatasetService(format?: string) {
  const rawData = await datasetRepository.getDatasetForModeling();

  // Proses flattening data agar siap dipakai untuk Modelling ML (Pandas/Python friendly)
  const flattenedData = rawData.map(item => ({
    id_detail: item.id_detail,
    id_transaksi: item.id_transaksi,
    tanggal: item.transaksi.tanggal ? new Date(item.transaksi.tanggal).toISOString().split('T')[0] : '',
    id_nasabah: item.transaksi.id_nasabah,
    nama_nasabah: item.transaksi.nasabah?.nama || '',
    rt: item.transaksi.nasabah?.rt || '',
    rw: item.transaksi.nasabah?.rw || '',
    id_jenis_sampah: item.id_jenis_sampah,
    nama_jenis: item.jenis_sampah?.nama_jenis || '',
    id_kategori: item.jenis_sampah?.id_kategori || '',
    nama_kategori: item.jenis_sampah?.kategori?.nama_kategori || '',
    // DI SINI PERBAIKANNYA: Tambahkan 'S' di ujung properti prisma-nya
    densitas_kg_per_m3: item.jenis_sampah?.densitas_kg_per_m3S || 0, 
    harga_per_kg: item.jenis_sampah?.harga_per_kg || 0,
    berat_kg: item.berat_kg,
    volume_m3: item.volume_m3,
    subtotal_harga: item.subtotal_harga,
    total_berat_transaksi: item.transaksi?.total_berat_kg || 0,
    total_volume_transaksi: item.transaksi?.total_volume_m3 || 0,
    total_harga_transaksi: item.transaksi?.total_harga || 0,
  }));

  if (format === 'csv') {
    const csvString = convertToCSV(flattenedData);
    return { success: true, type: 'csv', data: csvString };
  }

  return { success: true, type: 'json', data: flattenedData };
}