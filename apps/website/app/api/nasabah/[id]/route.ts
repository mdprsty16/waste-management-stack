import { 
  getNasabahByIdController, 
  updateNasabahController, 
  deleteNasabahController 
} from '../nasabah.controller';

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, props: Props) {
  const { id } = await props.params;
  return getNasabahByIdController(req, id);
}

export async function PUT(req: Request, props: Props) {
  const { id } = await props.params;
  return updateNasabahController(req, id);
}

export async function DELETE(req: Request, props: Props) {
  const { id } = await props.params;
  return deleteNasabahController(req, id);
}