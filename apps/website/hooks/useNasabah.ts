// hooks/useNasabah.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import * as nasabahService from '@/services/nasabah.service';
import type { Nasabah, CreateNasabahRequest, UpdateNasabahRequest } from '@/types/nasabah.types';

export function useNasabah(params?: { is_active?: string; search?: string }) {
  const [data, setData] = useState<Nasabah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const paramsRef = useRef(params);

  const isActive = params?.is_active;
  const search = params?.search;

  // Sync ref inside effect (not during render)
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    isMounted.current = true;
    let active = true;
    const load = async () => {
      try {
        const res = await nasabahService.getNasabah({ is_active: isActive, search });
        if (active) setData(res.data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat data');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; isMounted.current = false; };
  }, [isActive, search]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await nasabahService.getNasabah(paramsRef.current);
      if (isMounted.current) setData(res.data);
    } catch (err: unknown) {
      if (isMounted.current) setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const create = async (payload: CreateNasabahRequest) => {
    await nasabahService.createNasabah(payload);
    await refetch();
  };

  const update = async (id: string, payload: UpdateNasabahRequest) => {
    await nasabahService.updateNasabah(id, payload);
    await refetch();
  };

  const remove = async (id: string) => {
    await nasabahService.deleteNasabah(id);
    await refetch();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    // Backward compatibility (dashboard overview page pakai ini):
    nasabahData: data,
  };
}