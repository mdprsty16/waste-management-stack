// hooks/useJenisSampah.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import * as jenisSampahService from '@/services/jenis-sampah.service';
import type { JenisSampah, CreateJenisSampahRequest, UpdateJenisSampahRequest } from '@/types/jenis-sampah.types';

export function useJenisSampah(idKategori?: string) {
  const [data, setData] = useState<JenisSampah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const idKategoriRef = useRef(idKategori);

  // Sync ref inside effect (not during render)
  useEffect(() => {
    idKategoriRef.current = idKategori;
  }, [idKategori]);

  useEffect(() => {
    isMounted.current = true;
    let active = true;
    const load = async () => {
      try {
        const res = await jenisSampahService.getJenisSampah(idKategori);
        if (active) setData(res.data);
      } catch (err: unknown) {
        if (active) setError(err instanceof Error ? err.message : 'Gagal memuat data');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; isMounted.current = false; };
  }, [idKategori]); // ← Otomatis refetch saat idKategori berubah!

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await jenisSampahService.getJenisSampah(idKategoriRef.current);
      if (isMounted.current) setData(res.data);
    } catch (err: unknown) {
      if (isMounted.current) setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  const create = async (payload: CreateJenisSampahRequest) => {
    await jenisSampahService.createJenisSampah(payload);
    await refetch();
  };

  const update = async (id: string, payload: UpdateJenisSampahRequest) => {
    await jenisSampahService.updateJenisSampah(id, payload);
    await refetch();
  };

  const remove = async (id: string) => {
    await jenisSampahService.deleteJenisSampah(id);
    await refetch();
  };

  return { data, isLoading, error, refetch, create, update, remove };
}