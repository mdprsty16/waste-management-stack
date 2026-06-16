// hooks/usePengangkutan.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import * as pengangkutanService from '@/services/pengangkutan.service';
import type { Pengangkutan, CreatePengangkutanRequest } from '@/types/pengangkutan.types';

export function usePengangkutan() {
  const [data, setData] = useState<Pengangkutan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let active = true;
    const load = async () => {
      try {
        const res = await pengangkutanService.getPengangkutan();
        if (active) setData(res.data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat data');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; isMounted.current = false; };
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pengangkutanService.getPengangkutan();
      if (isMounted.current) setData(res.data);
    } catch (err: unknown) {
      if (isMounted.current) setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const create = async (payload: CreatePengangkutanRequest) => {
    await pengangkutanService.createPengangkutan(payload);
    await refetch();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    create,
  };
}
