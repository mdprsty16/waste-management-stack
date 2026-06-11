import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT), 
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  ssl: { rejectUnauthorized: false } // Aiven membutuhkan enkripsi SSL aktif
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Mulai proses seeding...');

  // ==========================================
  // 1. SEED DATA ADMIN (1 Saja Cukup)
  // ==========================================
  let adminId = '';
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        nama_admin: 'Admin Pusat Bank Sampah',
      },
    });
    adminId = admin.id_admin;
    console.log('✅ Data admin berhasil dibuat.');
  } else {
    adminId = existingAdmin.id_admin;
    console.log('ℹ️ Data admin sudah ada, seeding admin dilewati.');
  }

  // ==========================================
  // 2. SEED KATEGORI SAMPAH (3 Kategori)
  // ==========================================
  const kategoriDaftar = [
    { nama: 'Organik', deskripsi: 'Sampah alami yang mudah membusuk (sisa makanan, daun, dll).' },
    { nama: 'Anorganik', deskripsi: 'Sampah padat kering yang sulit terurai secara alami (plastik, kertas, logam).' },
    { nama: 'B3', deskripsi: 'Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus (baterai, lampu, elektronik).' }
  ];

  const kategoriMap: Record<string, string> = {};

  for (const kat of kategoriDaftar) {
    const existingKat = await prisma.kategoriSampah.findUnique({
      where: { nama_kategori: kat.nama }
    });

    if (!existingKat) {
      const newKat = await prisma.kategoriSampah.create({
        data: {
          nama_kategori: kat.nama,
          deskripsi: kat.deskripsi,
        }
      });
      kategoriMap[kat.nama] = newKat.id_kategori;
    } else {
      kategoriMap[kat.nama] = existingKat.id_kategori;
    }
  }
  console.log('✅ Data kategori sampah berhasil disinkronisasi.');

  // ==========================================
  // 3. SEED JENIS SAMPAH (Minimal 1 per Kategori)
  // ==========================================
  const jenisDaftar = [
    { nama: 'Sisa Makanan Domestik', kategori: 'Organik', densitas: 250, harga: 500 },
    { nama: 'Botol Plastik PET', kategori: 'Anorganik', densitas: 100, harga: 2000 },
    { nama: 'Aki Kendaraan Bekas', kategori: 'B3', densitas: 500, harga: 5000 }
  ];

  const jenisMap: Record<string, string> = {};

  for (const jen of jenisDaftar) {
    const existingJen = await prisma.jenisSampah.findUnique({
      where: { nama_jenis: jen.nama }
    });

    if (!existingJen) {
      const newJen = await prisma.jenisSampah.create({
        data: {
          nama_jenis: jen.nama,
          id_kategori: kategoriMap[jen.kategori],
          densitas_kg_per_m3: jen.densitas,
          harga_per_kg: jen.harga
        }
      });
      jenisMap[jen.nama] = newJen.id_jenis_sampah;
    } else {
      jenisMap[jen.nama] = existingJen.id_jenis_sampah;
    }
  }
  console.log('✅ Data jenis sampah berhasil disinkronisasi.');

  // ==========================================
  // 4. SEED DATA NASABAH (Minimal 1 Data)
  // ==========================================
  let nasabahId = '';
  const existingNasabah = await prisma.nasabah.findUnique({
    where: { kode_nasabah: 'NSB-001' }
  });

  if (!existingNasabah) {
    const nasabah = await prisma.nasabah.create({
      data: {
        kode_nasabah: 'NSB-001',
        nama: 'Dika Ramadani',
        nomor_hp: '081234567890',
        rt: '03',
        rw: '01',
        saldo: 20000,             // Sesuai dengan kalkulasi transaksi awal di bawah
        total_berat_sampah: 10,   // Sesuai dengan kalkulasi transaksi awal di bawah
      }
    });
    nasabahId = nasabah.id_nasabah;
    console.log('✅ Data nasabah awal berhasil dibuat.');
  } else {
    nasabahId = existingNasabah.id_nasabah;
    console.log('ℹ️ Data nasabah sudah ada, seeding nasabah dilewati.');
  }

  // ==========================================
  // 5. SEED DATA TRANSAKSI & DETAIL (Minimal 1 Data)
  // ==========================================
  const existingTransaksi = await prisma.transaksi.findFirst({
    where: { id_nasabah: nasabahId }
  });

  if (!existingTransaksi) {
    // Simulasi setoran awal: Nasabah menyetor 10 Kg Botol Plastik PET
    const beratSetoran = 10;
    const hargaPerKg = 2000; // Harga Botol Plastik PET
    const densitasPlastik = 100;

    const subtotal = beratSetoran * hargaPerKg; // Rp 20.000
    const volumeM3 = beratSetoran / densitasPlastik; // 0.1 m3

    await prisma.transaksi.create({
      data: {
        id_nasabah: nasabahId,
        id_admin: adminId,
        tanggal: new Date(),
        total_berat_kg: beratSetoran,
        total_volume_m3: volumeM3,
        total_harga: subtotal,
        detail_transaksi: {
          create: {
            id_jenis_sampah: jenisMap['Botol Plastik PET'],
            berat_kg: beratSetoran,
            volume_m3: volumeM3,
            subtotal_harga: subtotal
          }
        }
      }
    });
    console.log('✅ Data transaksi log awal berhasil dibuat.');
  } else {
    console.log('ℹ️ Data log transaksi sudah terisi, seeding transaksi dilewati.');
  }

  console.log('Proses seeding selesai dengan sukses!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });