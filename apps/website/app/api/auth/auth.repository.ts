import { prisma } from '../../lib/prisma';

export async function findAdminByUsername(username: string) {
  return await prisma.admin.findUnique({
    where: { username },
  });
}

export async function findAdminById(id_admin: string) {
  return await prisma.admin.findUnique({
    where: { id_admin },
    select: {
      id_admin: true,
      username: true,
      nama_admin: true,
      created_at: true
    }
  });
}