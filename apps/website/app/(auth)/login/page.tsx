"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ============================================================
// Login Page — Menggunakan komponen UI dari @/components/ui
// Split-screen layout dengan navigasi ke landing page
// ============================================================

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Navigasi kembali ke landing page — floating button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg text-gray-700 hover:text-green-700 hover:border-green-300 font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Kembali ke Beranda
      </Link>

      {/* Left side — decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <Image src="/hero1.png" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/85 to-emerald-950/90" />

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-white/5 rounded-full" />
        <div className="absolute top-20 -right-10 w-48 h-48 border border-white/5 rounded-full" />
        <div className="absolute top-1/3 left-10 w-24 h-24 bg-green-400/5 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Image src="/logo2.png" alt="Logo BSSB" width={56} height={56} className="rounded-2xl shadow-lg" />
            <div>
              <h2 className="text-white font-black text-2xl tracking-tight">BSSB</h2>
              <p className="text-green-300 text-sm font-bold tracking-wider">IKMP KUNINGAN</p>
            </div>
          </div>

          {/* Center text */}
          <div className="max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
              Kelola Bank Sampah
              <br />
              <span className="text-green-400">Lebih Efisien</span>
            </h1>
            <p className="text-green-200/80 text-lg font-medium leading-relaxed">
              Sistem manajemen bank sampah terpadu untuk mencatat setoran,
              mengelola data nasabah, dan memantau laporan keuangan secara real-time.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Pencatatan transaksi otomatis",
                "Laporan keuangan real-time",
                "Manajemen data nasabah",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-green-100 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-green-500/60 text-sm font-medium">
            &copy; {new Date().getFullYear()} Bank Sampah Sampul Berkasih — IKMP Kuningan
          </p>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center bg-gray-50 px-6 py-12 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <Image src="/logo2.png" alt="Logo BSSB" width={72} height={72} className="rounded-2xl shadow-lg mb-4" />
            <h2 className="text-2xl font-black text-gray-900">BSSB IKMP</h2>
            <p className="text-sm text-gray-500 font-medium">Bank Sampah Sampul Berkasih</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
            <div className="mb-8">
              <div className="hidden lg:flex w-14 h-14 bg-green-100 rounded-2xl items-center justify-center text-green-700 mb-5">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                Masuk ke Akun Admin
              </h2>
              <p className="text-gray-500 font-medium">
                Silakan masuk menggunakan akun admin Anda
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-bold text-sm">Login Gagal</p>
                  <p className="text-red-600 text-sm font-medium mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk Aplikasi"}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 font-medium">
                Lupa password? Hubungi admin pusat BSSB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
