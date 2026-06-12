// hooks/useKategoriSampah.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import * as kategoriService from '@/services/kategori-sampah.service';
import type { KategoriSampah, CreateKategoriRequest, UpdateKategoriRequest } from '@/types/kategori-sampah.types';

export function useKategoriSampah() {
  const [data, setData] = useState<KategoriSampah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let active = true;
    const load = async () => {
      try {
        const res = await kategoriService.getKategoriSampah();
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
      const res = await kategoriService.getKategoriSampah();
      if (isMounted.current) setData(res.data);
    } catch (err: unknown) {
      if (isMounted.current) setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const create = async (payload: CreateKategoriRequest) => {
    await kategoriService.createKategoriSampah(payload);
    await refetch();
  };

  const update = async (id: string, payload: UpdateKategoriRequest) => {
    await kategoriService.updateKategoriSampah(id, payload);
    await refetch();
  };

  const remove = async (id: string) => {
    await kategoriService.deleteKategoriSampah(id);
    await refetch();
  };

  return { data, isLoading, error, refetch, create, update, remove };
}
