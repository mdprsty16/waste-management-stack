import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/lib/jwt';

const publicPaths = ['/api/auth/login', '/api/dataset']; // Tambahkan jalur publik lainnya jika diperlukan

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bebaskan jalur publik (seperti login)
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    // 2. Ambil token dari header Authorization (Thunder Client/Android)
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.split(' ')[1];

    // 3. Jika tidak ada di header, ambil dari Cookie (Web/Next.js)
    if (!token) {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      // Menggunakan Response.json sesuai dokumentasi terbaru
      return Response.json(
        { success: false, message: 'Unauthorized: Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // 4. Verifikasi token
    const payload = await verifyToken(token);

    if (!payload) {
      return Response.json(
        { success: false, message: 'Unauthorized: Token tidak valid atau kedaluwarsa' },
        { status: 401 }
      );
    }

    // 5. Kloning header dan sisipkan ID admin dari payload JWT
    // (Pastikan properti payload.id_admin sesuai dengan isi token yang kamu buat di fitur login)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-id', payload.id_admin as string);

    // 6. Lanjutkan request dengan header baru yang sudah disisipkan ID admin
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};