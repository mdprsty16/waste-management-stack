import { prisma } from "../../lib/prisma";
import { successResponse } from "../../lib/response";
import { handleControllerError } from "../../lib/errorHandler";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard — Aggregator endpoint (1 call untuk semua data dashboard)
 *
 * Menggantikan 5 panggilan terpisah:
 *  - /api/nasabah        → cukup count
 *  - /api/transaksi      → cukup total + 5 terbaru
 *  - /api/daily          → weekly trend + prediksi ML
 *  - /api/dashboard/kategori-stats
 *  - /api/dashboard/kapasitas
 */
export async function GET() {
  try {
    // ─── 1. Ringkasan Utama ───
    const totalNasabah = await prisma.nasabah.count({
      where: { is_active: true },
    });

    const ringkasanTransaksi = await prisma.transaksi.aggregate({
      _sum: { total_berat_kg: true, total_harga: true },
      _count: { id_transaksi: true },
    });

    // ─── 2. 5 Transaksi Terbaru ───
    const transaksiTerbaru = await prisma.transaksi.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        nasabah: { select: { nama: true } },
        detail_transaksi: {
          take: 1,
          include: {
            jenis_sampah: { include: { kategori: { select: { nama_kategori: true } } } },
          },
        },
      },
    });

    // ─── 3. Statistik per Kategori ───
    const kategoriData = await prisma.kategoriSampah.findMany({
      where: { is_active: true },
      include: {
        jenis_sampah: {
          include: {
            detail_transaksi: { select: { berat_kg: true } },
          },
        },
      },
    });

    const kategoriStats = kategoriData.map((k) => {
      const totalKg = k.jenis_sampah.reduce(
        (sum, j) => sum + j.detail_transaksi.reduce((s, d) => s + d.berat_kg, 0),
        0
      );
      return { kategori: k.nama_kategori, total_kg: Number(totalKg.toFixed(2)) };
    });

    // ─── 4. Kapasitas Gudang ───
    const pengaturan = await prisma.pengaturan.findFirst();
    const maxVolume = pengaturan?.kapasitas_maksimal_m3 || 0;
    const thresholdPersen = pengaturan?.threshold_persen || 80;

    // Hitung volume dari total berat dengan estimasi densitas rata-rata (~150 kg/m³)
    // Pendekatan robust: hindari volume negatif akibat data pengangkutan tidak akurat
    const allDetails = await prisma.detailTransaksi.findMany({
      include: {
        jenis_sampah: { select: { densitas_kg_per_m3: true } },
      },
    });
    const totalBeratKg = allDetails.reduce((sum, d) => sum + d.berat_kg, 0);
    const AVG_DENSITY = 150; // kg/m³ — rata-rata densitas sampah campuran
    const estimatedVolume = totalBeratKg / AVG_DENSITY;

    // Kurangi volume yang sudah diangkut (pengangkutan) — dengan cap aman
    const volKeluarAgg = await prisma.pengangkutan.aggregate({
      _sum: { volume_m3_diangkut: true },
    });
    const totalPickup = volKeluarAgg._sum.volume_m3_diangkut || 0;
    // Cegah pengangkutan melebihi total volume yang pernah masuk
    const reasonablePickup = Math.min(totalPickup, estimatedVolume);
    const currentVolume = Math.min(Math.max(0, estimatedVolume - reasonablePickup), maxVolume);
    const kapasitasPersen = maxVolume > 0 ? (currentVolume / maxVolume) * 100 : 0;

    // ─── 5. ML — Panggil server ML untuk threshold ───
    const mlUrl = process.env.ML_SERVER_URL || "http://127.0.0.1:8000";
    let kapasitasMl: Record<string, unknown> = {
      estimated_days_remaining: "Server ML Tidak Aktif",
      recommendation: "Menunggu rekomendasi...",
      forecast_simulation_steps: [],
    };

    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 30);

      const details = await prisma.detailTransaksi.findMany({
        where: { transaksi: { tanggal: { gte: dateThreshold } } },
        include: {
          transaksi: { select: { tanggal: true } },
          jenis_sampah: { select: { densitas_kg_per_m3: true } },
        },
        orderBy: { transaksi: { tanggal: "asc" as const } },
      });

      if (maxVolume > 0 && details.length > 0) {
        const rawTx = details.map((d) => ({
          tanggal: d.transaksi.tanggal.toISOString().split("T")[0],
          berat_kg: d.berat_kg,
          densitas_kg_m3: d.jenis_sampah.densitas_kg_per_m3,
          volume_m3: d.volume_m3,
        }));

        // Kirim volume yang sudah di-cap ke ML agar prediksi konsisten dengan display
        const mlRes = await fetch(`${mlUrl}/api/v1/predict/threshold-dss`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threshold_m3: maxVolume,
            current_fill_m3: currentVolume,
            raw_transactions: rawTx,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (mlRes.ok) {
          const mlData = await mlRes.json();
          kapasitasMl = {
            estimated_days_remaining: mlData.days_until_threshold,
            recommendation: mlData.recommendation,
            forecast_simulation_steps: mlData.forecast_simulation_steps || [],
          };
        }
      }
    } catch {
      // ML server unavailable — gunakan default
    }

    // ─── 6. Weekly Trend + Prediksi ───
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weekRanges: { start: Date; end: Date; label: string }[] = [];
    let weekStart = new Date(firstDay);
    let weekNum = 1;

    while (weekStart <= lastDay) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const effectiveEnd = weekEnd > lastDay ? lastDay : weekEnd;

      weekRanges.push({
        start: new Date(weekStart),
        end: new Date(effectiveEnd),
        label: `Minggu ${weekNum}`,
      });

      weekStart = new Date(effectiveEnd);
      weekStart.setDate(effectiveEnd.getDate() + 1);
      weekNum++;
    }

    const aktualMingguan: { label: string; total_kg: number }[] = [];
    for (const range of weekRanges) {
      const start = new Date(range.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(range.end);
      end.setHours(23, 59, 59, 999);

      const agg = await prisma.transaksi.aggregate({
        _sum: { total_berat_kg: true },
        where: { tanggal: { gte: start, lte: end } },
      });
      aktualMingguan.push({
        label: range.label,
        total_kg: Number((agg._sum.total_berat_kg || 0).toFixed(2)),
      });
    }

    // Prediksi weekly dari ML server
    let prediksiKg = 0;
    let isAlert = false;
    let alertPesan = "";

    try {
      const weeklyRes = await fetch(`${mlUrl}/api/v1/predict/weekly`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tren_mingguan: aktualMingguan.map((d) => d.total_kg),
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (weeklyRes.ok) {
        const wk = await weeklyRes.json();
        prediksiKg = Number(wk.predicted_kg) || 0;
        isAlert = Boolean(wk.is_alert);
        alertPesan = wk.pesan || "";
      }
    } catch {
      // Fallback heuristic
      const values = aktualMingguan.map((d) => d.total_kg);
      const avgKg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      prediksiKg = Number((avgKg * 1.2).toFixed(2));
      isAlert = prediksiKg > avgKg * 1.5;
      alertPesan = isAlert
        ? `Peringatan: Volume sampah minggu depan diperkirakan ${prediksiKg} Kg. Segera jadwalkan penjemputan.`
        : `Prediksi: ${prediksiKg} Kg. Kapasitas aman.`;
    }

    // ─── Response ───
    const responseData = {
      ringkasan: {
        total_nasabah: totalNasabah,
        total_sampah_kg: Math.round(ringkasanTransaksi._sum.total_berat_kg || 0),
        total_saldo_rupiah: Math.round(ringkasanTransaksi._sum.total_harga || 0),
        total_transaksi: ringkasanTransaksi._count.id_transaksi || 0,
      },
      transaksi_terbaru: transaksiTerbaru.map((trx) => ({
        id: trx.id_transaksi,
        nasabah: trx.nasabah?.nama || "-",
        berat_kg: trx.total_berat_kg,
        total_harga: trx.total_harga,
        kategori: trx.detail_transaksi?.[0]?.jenis_sampah?.kategori?.nama_kategori || "Campuran",
        tanggal: trx.created_at.toISOString(),
      })),
      kapasitas: {
        current_volume_m3: Number(currentVolume.toFixed(2)),
        max_volume_m3: Number(maxVolume.toFixed(2)),
        persentase: Number(kapasitasPersen.toFixed(2)),
        threshold_persen: thresholdPersen,
        ...kapasitasMl,
      },
      grafik_kategori: kategoriStats,
      grafik_mingguan: {
        aktual: aktualMingguan,
        prediksi: {
          label: `Minggu ${aktualMingguan.length + 1} (Prediksi)`,
          total_kg: prediksiKg,
        },
      },
      alert_sistem: {
        is_alert: isAlert,
        pesan: alertPesan,
      },
    };

    return successResponse(responseData, "Berhasil mengambil data dashboard");
  } catch (error) {
    return handleControllerError(error, "Gagal memuat data dashboard");
  }
}
