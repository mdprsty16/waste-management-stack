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

  const round2 = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? 0 : Number(num.toFixed(2));
  };

  // Proses flattening data — untuk publik (tanpa data identitas nasabah)
  const flattenedData = rawData.map(item => {
    // Konversi PCS ke berat riil (kg) jika satuan = 'pcs'
    const isPcs = item.jenis_sampah?.satuan === 'pcs';
    const beratKg = isPcs
      ? item.berat_kg * (item.jenis_sampah?.berat_per_pcs || 0)
      : item.berat_kg;

    return {
      tanggal: item.transaksi.tanggal ? new Date(item.transaksi.tanggal).toISOString().split('T')[0] : '',
      jenis_sampah: item.jenis_sampah?.nama_jenis || '',
      berat_kg: round2(beratKg),
      densitas_kg_m3: round2(item.jenis_sampah?.densitas_kg_per_m3),
    };
  });

  if (format === 'csv') {
    const csvString = convertToCSV(flattenedData);
    return { success: true, type: 'csv', data: csvString };
  }

  return { success: true, type: 'json', data: flattenedData };
}