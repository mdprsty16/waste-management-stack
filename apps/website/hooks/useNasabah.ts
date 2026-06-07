import { useState, useEffect, useCallback } from 'react';

export function useNasabah() {
  const [nasabahData, setNasabahData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNasabah = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/nasabah');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memuat data nasabah');
      }
      setNasabahData(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNasabah();
  }, [fetchNasabah]);

  return { nasabahData, isLoading, error, refetch: fetchNasabah };
}