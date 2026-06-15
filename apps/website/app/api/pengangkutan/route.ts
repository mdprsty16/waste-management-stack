import { createPengangkutanController, getPengangkutanController } from './pengangkutan.controller';

export async function POST(req: Request) { return createPengangkutanController(req); }
export async function GET(req: Request) { return getPengangkutanController(req); }
