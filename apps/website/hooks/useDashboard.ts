"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardService } from "@/services/dashboard.service";

/**
 * useDashboard — React Query hook untuk aggregator /api/dashboard
 * Menggantikan 5 hook terpisah di halaman overview.
 */
export function useDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardService().then((res) => res.data),
    staleTime: 15 * 1000, // 15 detik
  });

  return {
    data: data ?? null,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Gagal memuat dashboard") : null,
    refetch,
  };
}
