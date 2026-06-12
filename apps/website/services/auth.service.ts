// ============================================================
// Auth Service — Frontend HTTP layer untuk autentikasi
// Hanya di sini URL /api/auth/... ditulis
// Digunakan oleh: hooks/useAuth.ts
// ============================================================

import { apiClient } from './api.client';
import type { LoginRequest, LoginResponseData, Admin } from '@/types/auth.types';

/** POST /api/auth/login */
export const loginService = (credentials: LoginRequest) =>
  apiClient.post<LoginResponseData>('/api/auth/login', credentials);

/** POST /api/auth/logout */
export const logoutService = () =>
  apiClient.post<null>('/api/auth/logout');

/** GET /api/auth/me — Mengecek sesi admin yang sedang login */
export const getMeService = () =>
  apiClient.get<Admin>('/api/auth/me');