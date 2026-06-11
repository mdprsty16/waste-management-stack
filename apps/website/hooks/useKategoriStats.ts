"use client";
import { useState, useEffect, useCallback } from "react";
import { getKategoriStatsService } from "@/services/dashboard.service";
import type { KategoriStatItem } from "@/types/dashboard.types";

// ============================================================
// useKategoriStats — Hook untuk mengambil statistik sampah per kategori
// Sumber: GET /api/dashboard/kategori-stats
// Data dinamis dari database — tidak di-hardcode
// ============================================================

export function useKategoriStats() {
  const [data, setData] = useState<KategoriStatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getKategoriStatsService();
      setData(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat data kategori";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
