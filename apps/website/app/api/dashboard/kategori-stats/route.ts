import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Sesuaikan dengan path prisma.ts milikmu
import { successResponse } from '../../../lib/response';
import { handleControllerError } from '../../../lib/errorHandler';

export async function GET() {
    try {
        // 1. Tarik data kategori beserta semua anak relasinya sampai ke detail transaksi
        const kategoriDenganTransaksi = await prisma.kategoriSampah.findMany({
            where: {
                is_active: true,
            },
            include: {
                jenis_sampah: {
                    include: {
                        detail_transaksi: {
                            select: {
                                berat_kg: true,
                            },
                        },
                    },
                },
            },
        });

        // 2. Lakukan mapping dan akumulasi (sum) berat_kg di level aplikasi
        const dataGrafik = kategoriDenganTransaksi.map((kategori) => {
            let totalBerat = 0;

            // Iterasi setiap jenis sampah di dalam kategori ini
            kategori.jenis_sampah.forEach((jenis) => {
                // Jumlahkan semua berat dari detail transaksi yang terjadi
                jenis.detail_transaksi.forEach((detail) => {
                    totalBerat += detail.berat_kg;
                });
            });

            return {
                kategori: kategori.nama_kategori,
                total_kg: Number(totalBerat.toFixed(2)), // Batasi 2 angka di belakang koma biar rapi
            };
        });

        // 3. Kembalikan response sukses ke frontend
        return successResponse(dataGrafik, 'Berhasil mengambil statistik sampah per kategori');
    } catch (error) {
        return handleControllerError(error, 'Gagal mengambil data statistik kategori');
    }
}