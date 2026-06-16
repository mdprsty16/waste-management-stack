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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-16 relative overflow-hidden">
      {/* Background organic floating blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] bg-green-200/35 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[130px] pointer-events-none animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid pattern background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(22,163,74,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Navigasi kembali ke landing page — Kiri atas */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200/80 shadow-sm text-gray-600 hover:text-green-700 hover:border-green-300 hover:shadow-md font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center animate-fade-in-up">
        {/* Logo & Brand Identity */}
        <div className="flex flex-col items-center mb-8 text-center group">
          <div className="relative w-20 h-20 bg-white rounded-2xl shadow-xl shadow-green-900/5 border border-green-100/50 flex items-center justify-center p-2 mb-4 group-hover:scale-105 transition-transform duration-500 animate-bounce-soft">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-2xl -z-10" />
            <Image 
              src="/logo2.avif" 
              alt="Logo BSSB" 
              width={64} 
              height={64} 
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            BSSB <span className="text-green-600">IKMP</span>
          </h2>
          <p className="text-sm font-bold text-green-700/80 tracking-wide uppercase mt-1">
            Bank Sampah Sampul Berkasih
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white/95 rounded-[32px] shadow-2xl shadow-gray-200/80 border border-gray-100 p-8 sm:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-gray-300/60">
          {/* Subtle top indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600" />

          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Masuk ke Akun Admin
            </h3>
            <p className="text-gray-500 text-sm font-medium">
              Silakan masuk menggunakan akun admin Anda
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200/80 p-4 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-900 font-bold text-sm">Login Gagal</p>
                <p className="text-red-600 text-xs font-medium mt-0.5 leading-relaxed">{error}</p>
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
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors p-1"
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
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Lupa password? Silakan hubungi admin pusat BSSB
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-xs font-semibold mt-8 text-center tracking-wide">
          &copy; {new Date().getFullYear()}  BANK SAMPAH SAMPUL BERKASIH &bull; IKMP KUNINGAN
        </p>
      </div>
    </div>
  );
}
