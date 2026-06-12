"use client";
import { useState, useEffect, useCallback } from "react";
import { getNasabah } from "@/services/nasabah.service";
import { getTransaksi } from "@/services/transaksi.service";

export interface LandingStats {
  totalNasabah: number;
  totalSampahKg: number;
  totalSampahTerolah: number;
  totalHematRupiah: number;
}

export function useLandingStats() {
  const [stats, setStats] = useState<LandingStats>({
    totalNasabah: 0,
    totalSampahKg: 0,
    totalSampahTerolah: 0,
    totalHematRupiah: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch nasabah melalui service layer
      const nasabahResponse = await getNasabah();
      const nasabahCount = (nasabahResponse.data || []).length;

      // Fetch transaksi melalui service layer
      const transaksiResponse = await getTransaksi();
      const transaksiData = transaksiResponse.data || [];

      let totalSampahKg = 0;
      let totalHematRupiah = 0;
      transaksiData.forEach((trx) => {
        totalSampahKg += trx.total_berat_kg || 0;
        totalHematRupiah += trx.total_harga || 0;
      });

      // totalSampahTerolah = jumlah transaksi yang sudah selesai (semua dianggap selesai)
      const totalSampahTerolah = transaksiData.length;

      setStats({
        totalNasabah: nasabahCount,
        totalSampahKg: Math.round(totalSampahKg),
        totalSampahTerolah,
        totalHematRupiah: Math.round(totalHematRupiah),
      });
    } catch (err: any) {
      setError(err.message);
      // Jika API gagal, tampilkan nol
      setStats({
        totalNasabah: 0,
        totalSampahKg: 0,
        totalSampahTerolah: 0,
        totalHematRupiah: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
