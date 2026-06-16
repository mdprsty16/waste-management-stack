import { NextResponse } from 'next/server';
import { loginService, meService, logoutService } from './auth.service';
import { successResponse, errorResponse } from '../../lib/response';
import { validate, loginSchema } from '../../lib/validation';

export async function loginController(req: Request) {
  try {
    const body = await req.json();
    const parsed = validate(loginSchema, body);
    if (!parsed.ok) return parsed.response;

    const { username, password } = parsed.data;
    const result = await loginService(username, password);

    if (!result.success) {
      return errorResponse(result.message, result.status);
    }

    // Ambil token dari hasil service untuk dipasang di cookie
    const token = result.data?.token;

    // Buat response dasar menggunakan successResponse bawaan
    const response = successResponse(result.data, 'Login berhasil');

    // Jika token ada, set cookie HttpOnly (Sisi web otomatis pakai ini, sisi Android tinggal abaikan)
    if (token) {
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // Contoh masa berlaku 1 hari (sesuaikan dengan exp JWT)
      });
    }

    return response;
  } catch (error) {
    console.error("Error di loginController:", error); 
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function meController(req: Request) {
  try {
    // Karena di middleware sudah lolos, di controller kita fleksibel mengambil token dari mana saja
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];

    if (!token) {
      // Cari alternatif di cookie jika header kosong
      // Menggunakan casting ke any karena Request standar global tidak memiliki properti cookies langsung seperti NextRequest
      token = (req as any).cookies?.get('token')?.value;
    }

    // Fallback ekstra jika parsing cookie manual diperlukan (tergantung arsitektur routing yang memanggil controller)
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      token = cookieHeader?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    }

    if (!token) {
      return errorResponse('Token tidak ditemukan', 401);
    }

    const result = await meService(token);

    if (!result.success) {
      return errorResponse(result.message, result.status);
    }

    return successResponse(result.data, 'Data admin berhasil diambil');
  } catch (error) {
    console.error("Error di meController:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}

export async function logoutController() {
  try {
    const result = await logoutService();
    
    // Buat objek response logout
    const response = successResponse(null, result.message);

    // Hapus cookie 'token' dengan mengaturnya kedaluwarsa seketika (untuk sisi Web)
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    console.error("Error di logoutController:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorResponse('Terjadi kesalahan pada server', 500, errorMessage);
  }
}