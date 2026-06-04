import { getKategoriController, createKategoriController } from './kategori-sampah.controller';

export async function GET(req: Request) { return getKategoriController(req); }
export async function POST(req: Request) { return createKategoriController(req); }