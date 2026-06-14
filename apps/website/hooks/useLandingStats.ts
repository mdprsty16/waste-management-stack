"use client";
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/services/api.client";

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
      // Panggil endpoint dedicated yang menghitung di server (1 call, efisien)
      const res = await apiClient.get<LandingStats>('/api/dashboard/summary');
      setStats(res.data);
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
