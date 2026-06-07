import { getTransaksiController, createTransaksiController } from './transaksi.controller';

export async function GET(req: Request) { return getTransaksiController(req); }
export async function POST(req: Request) { return createTransaksiController(req); }