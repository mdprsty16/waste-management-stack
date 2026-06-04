import { logoutController } from '../auth.controller';

export async function POST() {
  return logoutController();
}