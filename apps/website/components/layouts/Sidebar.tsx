"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
// Sidebar — Navigasi kiri dashboard
// Di-extract dari app/dashboard/layout.tsx agar modular
// ============================================================

// --- Ikon SVG ---
const Icons = {
  Overview: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Kategori: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  JenisSampah: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Transaction: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const MENU_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: Icons.Overview },
  { name: "Kategori Sampah", href: "/dashboard/kategori", icon: Icons.Kategori },
  { name: "Jenis Sampah", href: "/dashboard/jenis-sampah", icon: Icons.JenisSampah },
  { name: "Data Nasabah", href: "/dashboard/nasabah", icon: Icons.Users },
  { name: "Transaksi", href: "/dashboard/transaksi", icon: Icons.Transaction },
];

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay gelap untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
          <Image
            src="/logo2.png"
            alt="Logo BSSB"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="ml-3 font-bold text-green-800 text-xl tracking-tight">
            BSSB Admin
          </span>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Menu Utama
          </p>
          {MENU_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 text-[15px]
                  ${
                    isActive
                      ? "bg-green-100 text-green-800 font-bold shadow-sm"
                      : "text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
                onClick={onClose}
              >
                <span className={isActive ? "text-green-700" : "text-gray-400"}>
                  <item.icon />
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onLogout}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-red-600 hover:bg-red-50 transition-colors
              font-bold text-[15px]
            "
          >
            <Icons.Logout />
            Keluar Aplikasi
          </button>
        </div>
      </aside>
    </>
  );
}