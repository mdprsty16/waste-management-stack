import { meController } from '../auth.controller';

export async function GET(request: Request) {
  return meController(request);
}