"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// --- Kumpulan Ikon SVG (Ukurannya dibesarkan jadi w-7 h-7) ---
const Icons = {
  Overview: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Users: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Transaction: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

const MENU_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: Icons.Overview },
  { name: "Data Nasabah", href: "/dashboard/nasabah", icon: Icons.Users },
  { name: "Jenis Sampah", href: "/dashboard/jenis-sampah", icon: Icons.Trash },
  { name: "Transaksi", href: "/dashboard/transaksi", icon: Icons.Transaction },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. SIDEBAR (Diperlebar jadi w-80) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-24 flex items-center px-8 border-b border-gray-200">
          <Image src="/logo2.png" alt="Logo" width={48} height={48} className="rounded-xl" />
          <span className="ml-4 font-bold text-green-800 text-2xl tracking-tight">BSSB Admin</span>
        </div>

        {/* Sidebar Navigasi (Teks & Padding dibesarkan) */}
        <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-lg ${isActive
                    ? "bg-green-100 text-green-800 font-bold border-l-4 border-green-600"
                    : "text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-900"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-6 border-t border-gray-200">
          <Link
            href="/login"
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors font-bold text-lg"
          >
            <Icons.Logout />
            Keluar Aplikasi
          </Link>
        </div>
      </aside>

      {/* OVERLAY GELAP UNTUK MOBILE */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Atas (Tinggi jadi h-24, teks membesar) */}
        <header className="h-24 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              <Icons.Menu />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 hidden sm:block">
              {MENU_ITEMS.find(m => m.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:block text-right">
              <p className="text-xl font-bold text-gray-900 leading-none">Admin Utama</p>
              <p className="text-base font-semibold text-green-700 mt-1">● Sedang Online</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center text-green-800 text-2xl font-black">
              A
            </div>
          </div>
        </header>

        {/* 3. TEMPAT HALAMAN BERADA */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}