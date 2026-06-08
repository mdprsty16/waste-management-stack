"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/* ──── Icon Components ──── */

function UsersIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TransactionIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function RecycleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 7.5L12 2.5l4.5 5M12 2.5v12" />
      <path d="M4.5 16.5l-2 3.5h19l-2-3.5" />
      <path d="M8 22l-3.5-6M16 22l3.5-6" />
    </svg>
  );
}

function ChartIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

/* ──── Feature Data ──── */

const features = [
  {
    icon: <UsersIcon />,
    title: "Kelola Nasabah",
    desc: "Tambah dan pantau data nasabah bank sampah",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    icon: <TransactionIcon />,
    title: "Catat Transaksi",
    desc: "Pencatatan setor & tarik saldo secara real-time",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: <RecycleIcon />,
    title: "Jenis Sampah",
    desc: "Atur kategori dan harga per-kg sampah",
    iconBg: "bg-teal-100 text-teal-600",
  },
  {
    icon: <ChartIcon />,
    title: "Laporan",
    desc: "Statistik dan ringkasan operasional harian",
    iconBg: "bg-cyan-100 text-cyan-600",
  },
];

/* ──── Main Component ──── */

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ════════ SPLASH ════════ */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
          <div className="animate-fade-in-up">
            <Image src="/logo2.png" alt="Logo BSSB" width={130} height={130} priority className="mx-auto" />
          </div>
          <div className="mt-5 animate-fade-in-up delay-300 text-center">
            <p className="text-green-800 font-bold text-lg">Bank Sampah Sampul Berkasih</p>
            <p className="text-gray-400 text-sm mt-1">IKMP Kuningan</p>
          </div>
          <div className="mt-6">
            <div className="w-7 h-7 border-3 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* ════════ HERO with bgherosection.png ════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/bgherosection.png"
          alt="Kegiatan Bank Sampah"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Green overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/75 to-green-900/85" />
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="relative text-center max-w-2xl mx-auto px-4 py-20">
          {/* Logo */}
          <Image src="/logo2.png" alt="Logo BSSB IKMP" width={100} height={100} priority className="mx-auto mb-6 drop-shadow-xl" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
            Sistem Pengelolaan Bank Sampah
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
            Bank Sampah
            <br />
            Sampul Berkasih
          </h1>

          <p className="text-green-100 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed drop-shadow-sm">
            Panel admin untuk mengelola nasabah, transaksi, dan operasional bank sampah IKMP Kuningan.
          </p>

          {/* CTA */}
          <Link
            href="/login"
            id="cta-login"
            className="inline-flex items-center gap-2.5 bg-white text-green-700 hover:bg-green-50 font-bold text-base px-10 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Masuk ke Dashboard
            <ArrowRightIcon className="w-5 h-5" />
          </Link>

          <p className="mt-5 text-sm text-green-200/70">Khusus pengelola / admin bank sampah</p>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Fitur Utama</h2>
          <p className="text-center text-gray-500 mb-12 max-w-md mx-auto">
            Semua yang dibutuhkan untuk mengelola bank sampah
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-4 border border-gray-100 rounded-2xl p-5 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image src="/logo2.png" alt="Logo" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-sm text-green-800">BSSB IKMP</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Bank Sampah Sampul Berkasih, Kuningan</p>
        </div>
      </footer>
    </div>
  );
}
