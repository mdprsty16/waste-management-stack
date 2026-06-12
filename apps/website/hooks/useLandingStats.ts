"use client";
import { useState, useEffect, useCallback } from "react";

export interface LandingStats {
  totalNasabah: number;
  totalKerjaSama: number;
  totalSampahKg: number;
  totalSampahTerolah: number;
  totalHematRupiah: number;
}

export function useLandingStats() {
  const [stats, setStats] = useState<LandingStats>({
    totalNasabah: 0,
    totalKerjaSama: 12, // Dummy — API belum ada
    totalSampahKg: 0,
    totalSampahTerolah: 0,
    totalHematRupiah: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch nasabah
      const nasabahRes = await fetch("/api/nasabah");
      const nasabahJson = await nasabahRes.json();
      const nasabahCount = nasabahJson.success
        ? (nasabahJson.data || []).length
        : 0;

      // Fetch transaksi
      const transaksiRes = await fetch("/api/transaksi");
      const transaksiJson = await transaksiRes.json();
      const transaksiData = transaksiJson.success
        ? (transaksiJson.data || [])
        : [];

      let totalSampahKg = 0;
      let totalHematRupiah = 0;
      transaksiData.forEach((trx: any) => {
        totalSampahKg += trx.total_berat_kg || 0;
        totalHematRupiah += trx.total_harga || 0;
      });

      // totalSampahTerolah = transaksi yang sudah selesai (semua dianggap selesai)
      const totalSampahTerolah = transaksiData.length;

      setStats({
        totalNasabah: nasabahCount,
        totalKerjaSama: 12, // Dummy
        totalSampahKg: Math.round(totalSampahKg),
        totalSampahTerolah,
        totalHematRupiah: Math.round(totalHematRupiah),
      });
    } catch (err: any) {
      setError(err.message);
      // If API fails, show zeros (or fallback dummy)
      setStats({
        totalNasabah: 0,
        totalKerjaSama: 12,
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
