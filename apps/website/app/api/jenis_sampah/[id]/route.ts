import { getJenisSampahByIdController, updateJenisSampahController, deleteJenisSampahController } from '../jenis-sampah.controller';

type Props = { params: Promise<{ id: string }> };

export async function GET(req: Request, props: Props) { 
  const { id } = await props.params;
  return getJenisSampahByIdController(req, id); 
}
export async function PUT(req: Request, props: Props) { 
  const { id } = await props.params;
  return updateJenisSampahController(req, id); 
}
export async function DELETE(req: Request, props: Props) { 
  const { id } = await props.params;
  return deleteJenisSampahController(req, id); 
}