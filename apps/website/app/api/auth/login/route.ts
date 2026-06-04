import { loginController } from '../auth.controller';

export async function POST(request: Request) {
  return loginController(request);
}