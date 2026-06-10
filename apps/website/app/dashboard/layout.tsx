"use client";

import AdminLayout from "@/components/layouts/AdminLayout";

// ============================================================
// Dashboard Layout — Menggunakan AdminLayout shared component
// Semua logika sidebar, header, dan proteksi sesi ada di AdminLayout
// ============================================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}