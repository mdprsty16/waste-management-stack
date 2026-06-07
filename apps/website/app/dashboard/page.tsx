"use client";

import { useNasabah } from "@/hooks/useNasabah";
import { useTransaksi } from "@/hooks/useTransaksi";

export default function DashboardOverviewPage() {
    const { nasabahData, isLoading: loadingNasabah } = useNasabah();
    const { transaksiData, isLoading: loadingTransaksi } = useTransaksi();

    const isLoading = loadingNasabah || loadingTransaksi;

    const totalNasabah = nasabahData.length;
    
    let sampahTerkumpul = 0;
    let saldoTerdistribusi = 0;
    
    transaksiData.forEach(trx => {
        sampahTerkumpul += (trx.total_berat_kg || 0);
        saldoTerdistribusi += (trx.total_harga || 0);
    });

    const totalTransaksi = transaksiData.length;

    // Ambil 5 transaksi terbaru
    const recentTransactionsRaw = transaksiData.slice(0, 5);

    const recentTransactions = recentTransactionsRaw.map((trx) => {
        const categoryName = trx.detail_transaksi && trx.detail_transaksi[0] 
            ? trx.detail_transaksi[0].jenis_sampah?.kategori?.nama_kategori || 'Campuran'
            : 'Campuran';

        return {
            id: "TRX-" + (trx.id_transaksi || "XXXXX").substring(0, 5).toUpperCase(),
            name: trx.nasabah?.nama || "Unknown",
            type: categoryName,
            weight: `${trx.total_berat_kg || 0} Kg`,
            amount: `Rp ${(trx.total_harga || 0).toLocaleString('id-ID')}`,
            date: new Date(trx.created_at || new Date()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            status: "Selesai"
        };
    });

    if (isLoading) {
       return <div className="p-10 text-center text-xl font-bold text-green-700 animate-pulse">Memuat Data Dashboard...</div>;
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header Overview */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Ringkasan Hari Ini</h2>
                    <p className="text-lg text-gray-600 font-medium">Data di bawah ini ditarik langsung dari Database!</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl hover:bg-gray-100 font-bold text-lg transition-colors shadow-sm">
                        Unduh Laporan
                    </button>
                    <button className="px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-lg transition-colors shadow-lg shadow-green-200">
                        + Tambah Transaksi Baru
                    </button>
                </div>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-8">

                {/* Card 1: Nasabah */}
                <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <span className="inline-flex items-center text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">Realtime</span>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-600 mb-2">Total Nasabah</p>
                        {/* Menampilkan Variabel Asli */}
                        <h3 className="text-5xl font-black text-gray-900">{totalNasabah.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                {/* Card 2: Sampah Terkumpul */}
                <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-green-700">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-600 mb-2">Sampah (Bulan ini)</p>
                        {/* Menampilkan Variabel Asli */}
                        <h3 className="text-5xl font-black text-gray-900">{sampahTerkumpul} <span className="text-2xl text-gray-500 font-bold">Kg</span></h3>
                    </div>
                </div>

                {/* Card 3: Saldo */}
                <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-600 mb-2">Total Uang Diberikan</p>
                        {/* Menampilkan Variabel Asli */}
                        <h3 className="text-5xl font-black text-gray-900">Rp {saldoTerdistribusi.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                {/* Card 4: Total Transaksi */}
                <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-600 mb-2">Total Transaksi</p>
                        {/* Menampilkan Variabel Asli */}
                        <h3 className="text-5xl font-black text-gray-900">{totalTransaksi.toLocaleString('id-ID')}</h3>
                    </div>
                </div>
            </div>

            {/* Tabel Transaksi */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg overflow-hidden">
                <div className="px-8 py-6 border-b-2 border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-2xl font-extrabold text-gray-900">Riwayat Transaksi Terbaru</h3>
                    <a href="/dashboard/transaksi" className="text-lg font-bold text-green-700 hover:text-green-900 transition-colors bg-green-100 px-4 py-2 rounded-lg">
                        Lihat Semua Riwayat →
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-extrabold tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Kode</th>
                                <th className="px-8 py-5">Nama Nasabah</th>
                                <th className="px-8 py-5">Kategori</th>
                                <th className="px-8 py-5">Berat</th>
                                <th className="px-8 py-5">Total Harga</th>
                                <th className="px-8 py-5">Waktu</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-100">

                            {/* Jika Tidak Ada Data */}
                            {recentTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-10 text-center text-gray-500 font-medium text-lg">
                                        Belum ada transaksi di database.
                                    </td>
                                </tr>
                            )}

                            {/* Loop Data Asli dari Database */}
                            {recentTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-green-50 transition-colors">
                                    <td className="px-8 py-6 text-lg font-bold text-gray-900">{trx.id}</td>
                                    <td className="px-8 py-6 text-lg font-semibold text-gray-800">{trx.name}</td>
                                    <td className="px-8 py-6">
                                        <span className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold border border-gray-300">
                                            {trx.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-lg font-bold text-gray-700">{trx.weight}</td>
                                    <td className="px-8 py-6 text-xl font-black text-green-700">{trx.amount}</td>
                                    <td className="px-8 py-6 text-lg font-medium text-gray-600">{trx.date}</td>
                                    <td className="px-8 py-6">
                                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-bold border-2 border-green-300">
                                            {trx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}