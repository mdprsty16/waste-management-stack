import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client"; 
import bcrypt from "bcrypt"; // Tambahkan import bcrypt

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Mulai proses seeding...');

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    // Hash passwordnya sebelum disimpan
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword, // Masukkan password yang sudah di-hash
        nama_admin: 'Admin Pusat Bank Sampah',
      },
    });
    console.log('Seeding berhasil! Data admin dibuat:', admin);
  } else {
    console.log('Data admin sudah ada di database, seeding dilewati.');
  }
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