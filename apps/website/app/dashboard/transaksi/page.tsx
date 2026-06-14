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
      key: "id_transaksi", header: "Kode Transaksi",
      render: (row) => (
        <code className="text-xs font-mono font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200">
          TRX-{row.id_transaksi.substring(0, 5).toUpperCase()}
        </code>
      )
    },
    {
      key: "nasabah", header: "Nasabah",
      render: (row) => (
        <span className="font-bold text-gray-900">{row.nasabah?.nama || "-"}</span>
      )
    },
    {
      key: "tanggal", header: "Tanggal",
      render: (row) => (
        <span className="text-sm font-medium text-gray-600">
          {new Date(row.tanggal).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
          })}
        </span>
      )
    },
    {
      key: "total_berat_kg", header: "Berat",
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-semibold text-gray-800 text-sm bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          {Number(row.total_berat_kg).toFixed(2)} Kg
        </span>
      )
    },
    {
      key: "total_harga", header: "Total Harga",
      render: (row) => (
        <span className="text-base font-black text-emerald-600">
          Rp {row.total_harga.toLocaleString("id-ID")}
        </span>
      )
    },
    {
      key: "aksi", header: "Detail",
      render: (row) => (
        <Button 
          size="sm" 
          variant="secondary"
          className="hover:border-green-500 hover:text-green-600 transition-all duration-200"
          onClick={() => handleViewDetail(row.id_transaksi)}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        >
          Lihat
        </Button>
      )
    },
  ];

  // Stats calculations
  const totalPenjualan = data.reduce((sum, t) => sum + t.total_harga, 0);
  const totalBerat = data.reduce((sum, t) => sum + t.total_berat_kg, 0);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-teal-600 to-emerald-700 p-8 rounded-3xl shadow-xl shadow-green-100 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Riwayat Transaksi</h1>
          <p className="text-green-50 font-medium font-semibold">Pantau semua transaksi penjualan sampah nasabah.</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/transaksi/create")} 
          variant="secondary" 
          className="relative z-10 bg-white text-teal-700 border-none hover:bg-green-50 hover:scale-[1.03] transition-all duration-200 shadow-lg"
          size="lg"
          icon={
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Tambah Transaksi
        </Button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Transaksi</span>
            <span className="text-2xl font-black text-gray-900">{data.length}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Total Penjualan</span>
            <span className="text-2xl font-black text-emerald-600">Rp {totalPenjualan.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-green-200 transition-all duration-300 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-500 block">Berat Total</span>
            <span className="text-2xl font-black text-amber-600">{Number(totalBerat).toFixed(2)} Kg</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card
        padding={false}
        className="overflow-hidden border-none shadow-xl shadow-gray-100/50"
      >
        <Table columns={columns} data={data} isLoading={isLoading} rowKey="id_transaksi" />
      </Card>

      {/* Modal Detail Transaksi — Invoice style */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)}
        title="Detail Transaksi" size="lg">
        {detail && (
          <div className="space-y-5">
            {/* Header info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nasabah</p>
                  <p className="text-lg font-extrabold text-gray-900 mt-0.5">{detail.nasabah?.nama}</p>
                </div>
                <code className="text-xs font-mono font-bold bg-white text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  TRX-{detail.id_transaksi.substring(0, 5).toUpperCase()}
                </code>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-green-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{detail.admin?.nama_admin || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{new Date(detail.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </div>
            
            {/* Item table */}
            <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-4 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Jenis Sampah</th>
                  <th className="p-4 text-right text-xs font-extrabold text-gray-500 uppercase tracking-wider">Berat / Jumlah</th>
                  <th className="p-4 text-right text-xs font-extrabold text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {detail.detail_transaksi?.map((d) => (
                    <tr key={d.id_detail} className="hover:bg-green-50/30 transition-colors">
                      <td className="p-4 font-semibold text-gray-800">{d.jenis_sampah?.nama_jenis || d.id_jenis_sampah}</td>
                      <td className="p-4 text-right font-semibold text-gray-700">
                        {Number(d.berat_kg).toFixed(2)} {d.jenis_sampah?.satuan === 'pcs' ? 'pcs' : 'Kg'}
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-600">Rp {d.subtotal_harga.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total summary */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-xl flex justify-between items-center">
              <span className="font-bold text-emerald-100">Total Pembayaran</span>
              <span className="text-2xl font-black">Rp {detail.total_harga.toLocaleString("id-ID")}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}