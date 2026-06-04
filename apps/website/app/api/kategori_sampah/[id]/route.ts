import { getKategoriByIdController, updateKategoriController, deleteKategoriController } from '../kategori-sampah.controller';

type Props = { params: Promise<{ id: string }> };

export async function GET(req: Request, props: Props) { 
  const { id } = await props.params;
  return getKategoriByIdController(req, id); 
}
export async function PUT(req: Request, props: Props) { 
  const { id } = await props.params;
  return updateKategoriController(req, id); 
}
export async function DELETE(req: Request, props: Props) { 
  const { id } = await props.params;
  return deleteKategoriController(req, id); 
}