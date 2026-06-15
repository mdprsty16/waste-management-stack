import { useState, useEffect } from 'react';

export interface KapasitasData {
  current_volume_m3: number;
  max_volume_m3: number;
  threshold_persen: number;
  percentage: number;
  estimated_days_remaining: number | string;
}

export function useKapasitas() {
  const [data, setData] = useState<KapasitasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKapasitas = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/dashboard/kapasitas');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data kapasitas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKapasitas();
  }, []);

  return { data, isLoading, refetch: fetchKapasitas };
}
