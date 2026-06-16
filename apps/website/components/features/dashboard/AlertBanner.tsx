"use client";

import type { AlertSistem } from "@/types/dashboard.types";
import Button from "@/components/ui/Button";

// ============================================================
// AlertBanner — Banner notifikasi prediktif ML
// Hanya muncul jika is_alert === true (conditional rendering)
// Digunakan di: app/dashboard/page.tsx
// ============================================================

export interface AlertBannerProps {
  alert: AlertSistem;
  onDismiss?: () => void;
  onAction?: () => void;
}

export default function AlertBanner({ alert, onDismiss, onAction }: AlertBannerProps) {
  if (!alert.is_alert) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg shadow-amber-100/50 relative overflow-hidden animate-fade-in-up">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 via-orange-500 to-red-500 rounded-l-2xl" />

      <div className="flex items-start gap-4 pl-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-black text-amber-900">
              🚨 Alert Prediksi ML
            </h4>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
              URGENT
            </span>
          </div>
          <p className="text-base text-amber-800 font-medium leading-relaxed">
            {alert.pesan}
          </p>

          {/* Actionable buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={onAction}
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
            >
              Kirim Notifikasi Penjemputan ke Mitra
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              Tutup
            </Button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0 p-1 cursor-pointer"
          aria-label="Tutup alert"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
