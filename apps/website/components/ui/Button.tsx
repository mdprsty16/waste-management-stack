"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// ============================================================
// Button — Komponen tombol reusable
// Variant: primary (hijau), secondary (putih/border), danger (merah), ghost (transparan)
// Size: sm, md, lg
// ============================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg shadow-green-200/50 border border-transparent",
  secondary:
    "bg-white text-gray-800 hover:bg-gray-50 focus:ring-green-500 border-2 border-gray-300 shadow-sm",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-200/50 border border-transparent",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-green-500 border border-transparent",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-5 py-3 text-base rounded-xl gap-2",
  lg: "px-6 py-4 text-lg rounded-xl gap-2.5",
};

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      icon,
      children,
      disabled,
      className = "",
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-bold
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...rest}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Memproses...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
