"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { logoutService, getMeService } from "@/services/auth.service";
import type { Admin } from "@/types/auth.types";

// ============================================================
// AdminLayout — Gabungan Sidebar + Header + proteksi sesi
// Dipakai di app/dashboard/layout.tsx sebagai wrapper
// ============================================================

export interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Cek sesi admin saat pertama kali load
  const checkSession = useCallback(async () => {
    try {
      const res = await getMeService();
      setAdmin(res.data);
    } catch {
      // Sesi tidak valid → redirect ke login
      router.replace("/login");
    } finally {
      setIsCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutService();
    } catch {
      // Tetap redirect walau API error
    }
    router.replace("/login");
  };

  // Loading screen saat cek sesi
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-gray-600 font-bold text-lg">
            Memverifikasi sesi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Area konten utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          adminName={admin?.nama_admin || "Admin"}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        {/* Konten halaman */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}