// services/transaksi.service.ts

import { apiClient } from './api.client';
import type { Transaksi, CreateTransaksiRequest } from '@/types/transaksi.types';

/** GET /api/transaksi — Semua transaksi */
export const getTransaksi = () =>
  apiClient.get<Transaksi[]>('/api/transaksi');

/** GET /api/transaksi/[id] — Detail satu transaksi */
export const getTransaksiById = (id: string) =>
  apiClient.get<Transaksi>(`/api/transaksi/${id}`);

/** POST /api/transaksi — Buat transaksi baru */
export const createTransaksi = (data: CreateTransaksiRequest) =>
  apiClient.post<Transaksi>('/api/transaksi', data);