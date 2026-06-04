import { getNasabahController, createNasabahController } from './nasabah.controller';

export async function GET(req: Request) { return getNasabahController(req); }
export async function POST(req: Request) { return createNasabahController(req); }