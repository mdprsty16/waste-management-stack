// ============================================================
// Auth Types — Interface untuk data autentikasi
// Digunakan oleh: services/auth.service.ts, hooks/useAuth.ts
// ============================================================

/** Data Admin yang dikembalikan oleh GET /api/auth/me */
export interface Admin {
  id_admin: string;
  username: string;
  nama_admin: string;
  created_at: string;
}

/** Body request untuk POST /api/auth/login */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Data yang dikembalikan setelah login berhasil */
export interface LoginResponseData {
  token: string;
  admin: {
    id: string;
    nama: string;
  };
}

/** Format standar response dari semua API endpoint */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}