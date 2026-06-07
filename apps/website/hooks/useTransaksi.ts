import { useState, useEffect, useCallback } from 'react';

export function useTransaksi() {
  const [transaksiData, setTransaksiData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaksi = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/transaksi');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memuat data transaksi');
      }
      setTransaksiData(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransaksi();
  }, [fetchTransaksi]);

  return { transaksiData, isLoading, error, refetch: fetchTransaksi };
}