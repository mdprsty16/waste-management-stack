// apps/website/app/api/dataset/dataset.controller.ts
import { successResponse } from '../../lib/response';
import { handleControllerError } from '../../lib/errorHandler';
import * as datasetService from './dataset.service';

export async function getDatasetController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json'; // default json jika tidak diisi

    const result = await datasetService.getDatasetService(format);

    // Jika user meminta format CSV, kembalikan langsung sebagai file download download stream/text
    if (result.type === 'csv') {
      return new Response(result.data as string, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="dataset_modelling_waste.csv"',
        },
      });
    }

    // Jika format biasa (JSON)
    return successResponse(result.data, 'Berhasil mengambil dataset untuk modelling');
  } catch (error) {
    return handleControllerError(error, 'Terjadi kesalahan saat mengekspor dataset');
  }
}