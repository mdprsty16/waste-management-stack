import { getKapasitasController } from './kapasitas.controller';

export async function GET(req: Request) { return getKapasitasController(req); }
