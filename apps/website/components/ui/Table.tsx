"use client";

import { useState, useMemo, type ReactNode } from "react";

// ============================================================
// Table — Komponen tabel generik dengan kolom dinamis + Pagination
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
  /** Jumlah item per halaman. Set 0 untuk menonaktifkan pagination. Default: 15 */
  pageSize?: number;
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
  pageSize = 15,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === "function") return rowKey(row, index);
    return String(row[rowKey] ?? index);
  };

  // Pagination logic
  const isPaginated = pageSize > 0 && data.length > pageSize;
  const totalPages = isPaginated ? Math.ceil(data.length / pageSize) : 1;

  // Reset ke halaman 1 jika data berubah dan currentPage jadi out of bounds
  const safePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedData = useMemo(() => {
    if (!isPaginated) return data;
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize, isPaginated]);

  const startItem = isPaginated ? (safePage - 1) * pageSize + 1 : 1;
  const endItem = isPaginated ? Math.min(safePage * pageSize, data.length) : data.length;

  // Hitung range halaman yang ditampilkan (max 5 tombol)
  const getPageNumbers = (): number[] => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);
    
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
              Array.from({ length: Math.min(pageSize || 5, 5) }).map((_, i) => (
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

            {/* Data Rows (paginated) */}
            {!isLoading &&
              paginatedData.map((row, rowIdx) => {
                // Hitung index global untuk render function
                const globalIdx = isPaginated ? (safePage - 1) * pageSize + rowIdx : rowIdx;
                return (
                  <tr
                    key={getRowKey(row, globalIdx)}
                    className="hover:bg-green-50/50 transition-colors duration-150"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-4 text-base text-gray-700 whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row, globalIdx)
                          : (String(row[col.key] ?? "-"))}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {isPaginated && !isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-gray-50/80 border-t-2 border-gray-200">
          {/* Info jumlah item */}
          <p className="text-sm text-gray-500 font-medium">
            Menampilkan{" "}
            <span className="font-bold text-gray-700">{startItem}</span>
            {" – "}
            <span className="font-bold text-gray-700">{endItem}</span>
            {" dari "}
            <span className="font-bold text-gray-700">{data.length}</span>
            {" data"}
          </p>

          {/* Tombol navigasi */}
          <div className="flex items-center gap-1.5">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all duration-200 shadow-sm"
              aria-label="Halaman sebelumnya"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                  pageNum === safePage
                    ? "bg-emerald-600 text-white border-2 border-emerald-600 shadow-md shadow-emerald-100"
                    : "border-2 border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all duration-200 shadow-sm"
              aria-label="Halaman berikutnya"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}