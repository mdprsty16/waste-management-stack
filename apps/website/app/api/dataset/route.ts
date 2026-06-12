// apps/website/app/api/dataset/route.ts
import { NextRequest } from 'next/server';
import { getDatasetController } from './dataset.controller';

export async function GET(req: NextRequest) {
  return getDatasetController(req);
}