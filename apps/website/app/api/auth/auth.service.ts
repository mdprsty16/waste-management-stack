import * as authRepo from './auth.repository';
import { signToken, verifyToken } from '../../lib/jwt';
import bcrypt from 'bcrypt'; // Tambahkan import bcrypt

export async function loginService(username: string, passwordInput: string) {
  const admin = await authRepo.findAdminByUsername(username);

  if (!admin) {
    return { success: false, message: 'Username tidak ditemukan', status: 404 };
  }

  // Gunakan bcrypt.compare untuk mencocokkan input dengan hash di database
  const isValidPassword = await bcrypt.compare(passwordInput, admin.password);

  if (!isValidPassword) {
    return { success: false, message: 'Password salah', status: 401 };
  }

  const token = await signToken({
    id_admin: admin.id_admin,
    username: admin.username,
    nama: admin.nama_admin
  });

  return {
    success: true,
    data: {
      token,
      admin: {
        id: admin.id_admin,
        nama: admin.nama_admin
      }
    },
    status: 200
  };
}

export async function meService(token: string) {
  const payload = await verifyToken(token);
  
  if (!payload || !payload.id_admin) {
    return { success: false, message: 'Token tidak valid atau sudah kedaluwarsa', status: 401 };
  }

  // Mengambil data terbaru dari database
  const admin = await authRepo.findAdminById(payload.id_admin as string);

  if (!admin) {
    return { success: false, message: 'Data admin tidak ditemukan', status: 404 };
  }

  return {
    success: true,
    data: admin,
    status: 200
  };
}

export async function logoutService() {
  return {
    success: true,
    message: 'Logout berhasil, token pada cookie dihapus',
    status: 200
  };
}