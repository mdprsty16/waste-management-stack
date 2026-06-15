"use client";

import { useEffect, useState, type ReactNode } from "react";
import Modal from "./Modal";
import Button from "./Button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>; // Jika undefined, modal bertindak sebagai Alert (hanya satu tombol OK)
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Lanjutkan",
  cancelText = "Batal",
  variant = "info",
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Icon & color styling configurations based on variant
  const config = {
    danger: {
      bgIcon: "bg-red-50 text-red-600 border-red-100",
      buttonColor: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    warning: {
      bgIcon: "bg-amber-50 text-amber-600 border-amber-100",
      buttonColor: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    success: {
      bgIcon: "bg-emerald-50 text-emerald-600 border-emerald-100",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      bgIcon: "bg-blue-50 text-blue-600 border-blue-100",
      buttonColor: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-2 text-center">
        {/* Dynamic Icon Header */}
        <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-2xl border-2 mb-6 ${config.bgIcon}`}>
          {config.icon}
        </div>

        {/* Modal Text Content */}
        <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
          {title}
        </h3>
        <div className="text-sm font-medium text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed whitespace-pre-line">
          {message}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          {onConfirm ? (
            <>
              {/* Confirm Dialog (Yes/No style) */}
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:flex-1 py-3 font-extrabold text-gray-700 hover:bg-gray-50 border-2 border-gray-200 rounded-xl"
              >
                {cancelText}
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await onConfirm();
                  } catch (e) {
                    console.error("Error during confirm callback:", e);
                  }
                }}
                isLoading={isLoading}
                className={`w-full sm:flex-1 py-3 font-extrabold rounded-xl shadow-lg border-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${config.buttonColor}`}
              >
                {confirmText}
              </Button>
            </>
          ) : (
            /* Alert Dialog (Single OK button style) */
            <Button
              onClick={onClose}
              className={`w-full max-w-[200px] mx-auto py-3 font-extrabold rounded-xl shadow-lg border-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${config.buttonColor}`}
            >
              Tutup
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
