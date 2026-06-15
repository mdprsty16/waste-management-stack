import { getPengaturanController, updatePengaturanController } from './pengaturan.controller';

export async function GET(req: Request) { return getPengaturanController(req); }
export async function PUT(req: Request) { return updatePengaturanController(req); }
