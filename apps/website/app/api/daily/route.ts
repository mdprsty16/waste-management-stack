import { prisma } from '../../lib/prisma';
import { successResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';

// ============================================================
// GET /api/daily — Weekly Trend + Predictive Alerting
//
// 1. Ambil data aktual transaksi per minggu di bulan berjalan (Prisma)
// 2. Kirim tren ke server ML Python untuk prediksi minggu depan
// 3. Return gabungan data aktual + prediksi + alert status
//
// ML_SERVER_URL dikonfigurasi via environment variable.
// Jika ML server belum tersedia, gunakan fallback prediksi sederhana.
// ============================================================

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:5000';

/**
 * Hitung rentang tanggal per minggu di bulan berjalan.
 * Menghasilkan array of { start, end, label } untuk Minggu 1..N.
 */
function getWeekRangesForCurrentMonth(): { start: Date; end: Date; label: string }[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Awal dan akhir bulan
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // Hari terakhir bulan ini

  const ranges: { start: Date; end: Date; label: string }[] = [];
  let weekStart = new Date(firstDay);
  let weekNum = 1;

  while (weekStart <= lastDay) {
    // Akhir minggu = 6 hari setelah start, atau akhir bulan
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const effectiveEnd = weekEnd > lastDay ? lastDay : weekEnd;

    ranges.push({
      start: new Date(weekStart),
      end: new Date(effectiveEnd),
      label: `Minggu ${weekNum}`,
    });

    // Lanjut ke minggu berikutnya
    weekStart = new Date(effectiveEnd);
    weekStart.setDate(effectiveEnd.getDate() + 1);
    weekNum++;
  }

  return ranges;
}

/**
 * Fetch prediksi dari server ML Python.
 * Jika server belum tersedia → gunakan fallback heuristic sederhana.
 */
async function fetchMLPrediction(
  aktualData: { label: string; total_kg: number }[]
): Promise<{ predicted_kg: number; is_alert: boolean; pesan: string }> {
  try {
    const response = await fetch(`${ML_SERVER_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tren_mingguan: aktualData.map((d) => d.total_kg),
      }),
      signal: AbortSignal.timeout(5000), // Timeout 5 detik
    });

    if (!response.ok) {
      throw new Error(`ML server responded with status ${response.status}`);
    }

    const result = await response.json();

    return {
      predicted_kg: Number(result.predicted_kg) || 0,
      is_alert: Boolean(result.is_alert),
      pesan: result.pesan || '',
    };
  } catch (error) {
    // ════════════════════════════════════════════════════════════
    // FALLBACK: Prediksi heuristik sederhana (rata-rata + 20%)
    // Digunakan ketika ML server belum aktif / belum di-deploy
    // Ganti blok ini setelah model ML siap
    // ════════════════════════════════════════════════════════════
    console.warn('[/api/daily] ML server tidak tersedia, menggunakan fallback prediksi:', error instanceof Error ? error.message : error);

    const values = aktualData.map((d) => d.total_kg);
    const avgKg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    // Prediksi = rata-rata + kenaikan 20%
    const predicted = Number((avgKg * 1.2).toFixed(2));

    // Alert jika prediksi > 150% dari rata-rata
    const isAlert = predicted > avgKg * 1.5;

    return {
      predicted_kg: predicted,
      is_alert: isAlert,
      pesan: isAlert
        ? `Peringatan: Berdasarkan tren data, volume sampah minggu depan diperkirakan mencapai ${predicted} Kg. Segera jadwalkan penjemputan armada.`
        : `Prediksi volume sampah minggu depan: ${predicted} Kg. Kapasitas masih aman.`,
    };
  }
}

export async function GET() {
  try {
    // ─── 1. Hitung rentang minggu bulan berjalan ───
    const weekRanges = getWeekRangesForCurrentMonth();

    // ─── 2. Tarik data aktual dari Prisma per minggu ───
    const aktualData: { label: string; total_kg: number }[] = [];

    for (const range of weekRanges) {
      // Set waktu start ke 00:00:00 dan end ke 23:59:59
      const startDate = new Date(range.start);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(range.end);
      endDate.setHours(23, 59, 59, 999);

      const aggregate = await prisma.transaksi.aggregate({
        _sum: {
          total_berat_kg: true,
        },
        where: {
          tanggal: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      aktualData.push({
        label: range.label,
        total_kg: Number((aggregate._sum.total_berat_kg || 0).toFixed(2)),
      });
    }

    // ─── 3. Ambil prediksi dari ML server (atau fallback) ───
    const mlResult = await fetchMLPrediction(aktualData);

    // ─── 4. Tentukan nomor minggu prediksi ───
    const nextWeekNum = aktualData.length + 1;

    // ─── 5. Bentuk payload response ───
    const responseData = {
      grafik_mingguan: {
        aktual: aktualData,
        prediksi_minggu_depan: {
          label: `Minggu ${nextWeekNum} (Prediksi ML)`,
          total_kg: mlResult.predicted_kg,
        },
      },
      alert_sistem: {
        is_alert: mlResult.is_alert,
        pesan: mlResult.pesan,
      },
    };

    return successResponse(
      responseData,
      'Data prediksi harian dan tren mingguan berhasil dimuat'
    );
  } catch (error) {
    return handleControllerError(error, 'Gagal memuat data tren mingguan dan prediksi');
  }
}
