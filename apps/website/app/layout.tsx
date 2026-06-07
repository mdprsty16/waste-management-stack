import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bank Sampah Sampul Berkasih (BSSB) IKMP - Kuningan, Jawa Barat",
  description:
    "Bank Sampah Sampul Berkasih (BSSB) IKMP di Kuningan, Jawa Barat. Menjaga lingkungan, membangun ekonomi masyarakat melalui pengelolaan sampah yang bertanggung jawab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
