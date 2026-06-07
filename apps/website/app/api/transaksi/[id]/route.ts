import { getTransaksiByIdController } from '../transaksi.controller';

type Props = { params: Promise<{ id: string }> };

export async function GET(req: Request, props: Props) {
  const { id } = await props.params;
  return getTransaksiByIdController(req, id);
}