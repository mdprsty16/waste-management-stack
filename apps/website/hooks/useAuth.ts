import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginService, logoutService, getMeService } from '@/services/auth.service';
import type { Admin, LoginRequest } from '@/types/auth.types';

// ============================================================
// useAuth — React Hook untuk autentikasi
// Memanggil services/auth.service.ts (bukan fetch langsung)
// ============================================================

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const router = useRouter();

  /** POST /api/auth/login via service */
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const credentials: LoginRequest = { username, password };
      const res = await loginService(credentials);
      setAdmin({
        id_admin: res.data.admin.id,
        username: username,
        nama_admin: res.data.admin.nama,
        created_at: '',
      });
      // Pindah ke dashboard jika sukses
      router.push('/dashboard');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /** POST /api/auth/logout via service */
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutService();
    } catch {
      // Tetap redirect walau API error
    } finally {
      setIsLoading(false);
      setAdmin(null);
      router.replace('/login');
    }
  };

  /** GET /api/auth/me — mengecek sesi yang aktif */
  const checkSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getMeService();
      setAdmin(res.data);
      return true;
    } catch {
      setAdmin(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    checkSession,
    admin,
    isLoading,
    error,
    isAuthenticated: admin !== null,
  };
}