"use client";

import { usePathname } from "next/navigation";

// ============================================================
// Header — Top bar dashboard
// Di-extract dari app/dashboard/layout.tsx agar modular
// ============================================================

const MenuIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/** Mapping pathname ke judul halaman */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/kategori": "Kategori Sampah",
  "/dashboard/jenis-sampah": "Jenis Sampah",
  "/dashboard/nasabah": "Data Nasabah",
  "/dashboard/pengangkutan": "Pengangkutan",
  "/dashboard/transaksi": "Transaksi",
};

export interface HeaderProps {
  adminName: string;
  onMenuToggle: () => void;
}

export default function Header({ adminName, onMenuToggle }: HeaderProps) {
  const pathname = usePathname();

  // Cari judul halaman berdasarkan pathname (exact match dulu, lalu prefix)
  const pageTitle =
    PAGE_TITLES[pathname] ||
    Object.entries(PAGE_TITLES).find(
      ([path]) => path !== "/dashboard" && pathname.startsWith(path)
    )?.[1] ||
    "Dashboard";

  // Ambil inisial nama admin
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900 hidden sm:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-base font-bold text-gray-900 leading-none">
            {adminName}
          </p>
          <p className="text-sm font-semibold text-green-700 mt-1 flex items-center justify-end gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
            Online
          </p>
        </div>
        <div className="w-11 h-11 rounded-full bg-green-100 border-3 border-green-500 flex items-center justify-center text-green-800 text-base font-black">
          {initials}
        </div>
      </div>
    </header>
  );
}