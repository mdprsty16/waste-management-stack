"use client";
import { useState, useEffect, useCallback } from "react";
import { getDailyTrendService } from "@/services/dashboard.service";
import type { DailyTrendData } from "@/types/dashboard.types";

// ============================================================
// useDailyTrend — Hook untuk mengambil data tren mingguan + prediksi ML
// Sumber: GET /api/daily
// ============================================================

const INITIAL_DATA: DailyTrendData = {
  grafik_mingguan: {
    aktual: [],
    prediksi_minggu_depan: { label: "Prediksi", total_kg: 0 },
  },
  alert_sistem: {
    is_alert: false,
    pesan: "",
  },
};

export function useDailyTrend() {
  const [data, setData] = useState<DailyTrendData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getDailyTrendService();
      setData(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat data tren";
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
