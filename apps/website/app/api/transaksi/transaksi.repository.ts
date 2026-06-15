import { prisma } from '../../lib/prisma';

export async function findManyTransaksi() {
  return await prisma.transaksi.findMany({
    include: {
      nasabah: {
        select: { nama: true, kode_nasabah: true }
      },
      detail_transaksi: {
        include: {
          jenis_sampah: {
            include: {
              kategori: true
            }
          }
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
}

export async function findTransaksiById(id_transaksi: string) {
  return await prisma.transaksi.findUnique({
    where: { id_transaksi },
    include: {
      nasabah: true,
      admin: {
        select: { nama_admin: true, username: true }
      },
      detail_transaksi: {
        include: {
          jenis_sampah: true
        }
      }
    }
  });
}

interface CreateTransaksiInput {
  id_nasabah: string;
  id_admin: string | null;
  tanggal: Date;
  total_berat_kg: number;
  total_volume_m3: number;
  total_harga: number;
  details: {
    id_jenis_sampah: string;
    berat_kg: number;
    volume_m3: number;
    subtotal_harga: number;
  }[];
}

export async function createTransaksiData(input: CreateTransaksiInput) {
  // Menggunakan $transaction untuk menjamin atomisitas data
  return await prisma.$transaction(async (tx) => {
    // 1. Buat data induk Transaksi beserta DetailTransaksi sekaligus
    const transaksi = await tx.transaksi.create({
      data: {
        id_nasabah: input.id_nasabah,
        id_admin: input.id_admin,
        tanggal: input.tanggal,
        total_berat_kg: input.total_berat_kg,
        total_volume_m3: input.total_volume_m3,
        total_harga: input.total_harga,
        detail_transaksi: {
          createMany: {
            data: input.details.map((d) => ({
              id_jenis_sampah: d.id_jenis_sampah,
              berat_kg: d.berat_kg,
              volume_m3: d.volume_m3,
              subtotal_harga: d.subtotal_harga,
            })),
          },
        },
      },
      include: {
        detail_transaksi: true,
      },
    });

    // 2. Akumulasikan nilai saldo dan berat sampah ke profil Nasabah
    await tx.nasabah.update({
      where: { id_nasabah: input.id_nasabah },
      data: {
        saldo: {
          increment: input.total_harga,
        },
        total_berat_sampah: {
          increment: input.total_berat_kg,
        },
      },
    });

    return transaksi;
  });
}