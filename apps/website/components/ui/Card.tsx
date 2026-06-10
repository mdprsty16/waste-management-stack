"use client";

import { type ReactNode } from "react";

// ============================================================
// Card — Komponen kartu pembungkus konten
// Digunakan untuk: statistik dashboard, section wrapper
// ============================================================

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  /** Tombol/aksi di pojok kanan header card */
  action?: ReactNode;
  /** Apakah konten children diberi padding (default: true) */
  padding?: boolean;
  className?: string;
}

export default function Card({
  children,
  title,
  subtitle,
  action,
  padding = true,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        bg-white border-2 border-gray-100 rounded-2xl shadow-lg
        hover:shadow-xl transition-shadow duration-300
        ${className}
      `}
    >
      {/* Header (opsional) */}
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            {title && (
              <h3 className="text-xl font-extrabold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      {/* Body */}
      <div className={padding ? "px-6 py-5" : ""}>{children}</div>
    </div>
  );
}
