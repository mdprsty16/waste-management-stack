"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransaksi } from "@/hooks/useTransaksi";
import Table, { type TableColumn } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import type { Transaksi } from "@/types/transaksi.types";
import * as transaksiService from "@/services/transaksi.service";

export default function TransaksiPage() {
  const router = useRouter();
  const { data, isLoading } = useTransaksi();
  const [detail, setDetail] = useState<Transaksi | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleViewDetail = async (id: string) => {
    const res = await transaksiService.getTransaksiById(id);
    setDetail(res.data);
    setShowDetail(true);
  };

  const columns: TableColumn<Transaksi>[] = [
    {
      key: "id_transaksi", header: "Kode",
      render: (row) => `TRX-${row.id_transaksi.substring(0, 5).toUpperCase()}`
    },
    {
      key: "nasabah", header: "Nasabah",
      render: (row) => row.nasabah?.nama || "-"
    },
    {
      key: "tanggal", header: "Tanggal",
      render: (row) => new Date(row.tanggal).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
      })
    },
    {
      key: "total_berat_kg", header: "Berat",
      render: (row) => `${row.total_berat_kg} Kg`
    },
    {
      key: "total_harga", header: "Total Harga",
      render: (row) => `Rp ${row.total_harga.toLocaleString("id-ID")}`
    },
    {
      key: "aksi", header: "Aksi",
      render: (row) => (
        <Button size="sm" variant="secondary"
          onClick={() => handleViewDetail(row.id_transaksi)}>
          Detail
        </Button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Riwayat Transaksi"
        subtitle={`Total: ${data.length} transaksi`}
        action={
          <Button onClick={() => router.push("/dashboard/transaksi/create")}>
            + Tambah Transaksi
          </Button>
        }
        padding={false}
      >
        <Table columns={columns} data={data} isLoading={isLoading} rowKey="id_transaksi" />
      </Card>

      {/* Modal Detail Transaksi */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)}
        title="Detail Transaksi" size="lg">
        {detail && (
          <div className="space-y-4">
            <p><strong>Nasabah:</strong> {detail.nasabah?.nama}</p>
            <p><strong>Admin:</strong> {detail.admin?.nama_admin || "-"}</p>
            <p><strong>Tanggal:</strong> {new Date(detail.tanggal).toLocaleDateString("id-ID")}</p>
            {/* Tabel detail item */}
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-100">
                <th className="p-3 text-left">Jenis Sampah</th>
                <th className="p-3 text-right">Berat (Kg)</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr></thead>
              <tbody>
                {detail.detail_transaksi?.map((d) => (
                  <tr key={d.id_detail} className="border-t">
                    <td className="p-3">{d.jenis_sampah?.nama_jenis || d.id_jenis_sampah}</td>
                    <td className="p-3 text-right">{d.berat_kg}</td>
                    <td className="p-3 text-right">Rp {d.subtotal_harga.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-2 border-t font-bold text-lg">
              Total: Rp {detail.total_harga.toLocaleString("id-ID")}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}