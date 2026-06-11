"use client";

import { type ReactNode } from "react";

// ============================================================
// StatCard — Kartu statistik untuk dashboard overview
// Digunakan di: app/dashboard/page.tsx
// ============================================================

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  badge?: string;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  badge,
  iconBg = "bg-green-100",
  iconColor = "text-green-700",
}: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        {badge && (
          <span className="inline-flex items-center text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-lg font-bold text-gray-500 mb-2">{label}</p>
        <h3 className="text-4xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );
}