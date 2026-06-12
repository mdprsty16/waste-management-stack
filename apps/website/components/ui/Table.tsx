"use client";

import { type ReactNode } from "react";

// ============================================================
// Table — Komponen tabel generik dengan kolom dinamis
// Digunakan oleh Adhim (nasabah, kategori, jenis sampah)
// dan Aban (tabel transaksi)
// ============================================================

export interface TableColumn<T> {
  /** Kunci unik kolom, bisa berupa keyof T atau string custom */
  key: string;
  /** Teks header kolom */
  header: string;
  /** Custom render function untuk sel (opsional) */
  render?: (row: T, index: number) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  /** Key unik untuk setiap baris (default: "id") */
  rowKey?: keyof T | ((row: T, index: number) => string);
}

/** Skeleton row untuk loading state */
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Table<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Belum ada data.",
  rowKey = "id" as keyof T,
}: TableProps<T>) {
  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === "function") return rowKey(row, index);
    return String(row[rowKey] ?? index);
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-sm font-extrabold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Loading State */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={`skel-${i}`} cols={columns.length} />
              ))}

            {/* Empty State */}
            {!isLoading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 font-medium text-lg">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!isLoading &&
              data.map((row, rowIdx) => (
                <tr
                  key={getRowKey(row, rowIdx)}
                  className="hover:bg-green-50/50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-base text-gray-700 whitespace-nowrap"
                    >
                      {col.render
                        ? col.render(row, rowIdx)
                        : (String(row[col.key] ?? "-"))}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}