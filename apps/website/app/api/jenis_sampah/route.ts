import { getJenisSampahController, createJenisSampahController } from './jenis-sampah.controller';

export async function GET(req: Request) { return getJenisSampahController(req); }
export async function POST(req: Request) { return createJenisSampahController(req); }