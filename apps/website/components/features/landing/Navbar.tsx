"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const MenuIcon = ({ c = "w-7 h-7" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ c = "w-7 h-7" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowIcon = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
  </svg>
);

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#fitur", label: "Fitur" },
  { href: "#kategori", label: "Kategori" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg shadow-green-900/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <a href="#beranda" className="flex items-center gap-3 group">
            {/* ✅ LOGO OPTIMAL — menggunakan WEBP dengan ukuran tepat */}
            <div className="relative flex-shrink-0 w-11 h-[62px]">
              <Image
                src="/logo2.avif"  // ✅ Pakai WEBP
                alt="Logo BSSB"
                fill
                className="rounded-xl shadow-md group-hover:shadow-lg transition-shadow object-contain"
                sizes="44px"  // ✅ Beri tahu ukuran tepat
                quality={75}  // ✅ Kompresi agresif
                priority     // ✅ Logo di atas fold, pakai priority
              />
            </div>
            <div>
              <span className={`font-black text-lg block leading-tight tracking-tight transition-colors duration-500 ${scrolled ? "text-green-900" : "text-green-600"}`}>
                BSSB
              </span>
              <span className={`text-xs font-bold tracking-widest transition-colors duration-500 ${scrolled ? "text-green-600" : "text-green-600"}`}>
                IKMP KUNINGAN
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-base font-bold link-underline transition-colors duration-500 ${scrolled ? "text-gray-600 hover:text-green-700" : "text-white hover:text-green-300"}`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="/login"
              className="font-bold bg-green-700 text-white px-7 py-3 rounded-xl shadow-lg shadow-green-800/20 hover:bg-green-800 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base"
            >
              Masuk Dashboard
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-green-900 p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 glass rounded-2xl shadow-2xl overflow-hidden border border-green-100 divide-y divide-green-50">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-4 text-lg font-bold text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="p-4">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-green-700 text-white font-bold text-lg px-4 py-4 rounded-xl hover:bg-green-800 transition-colors"
              >
                Masuk Dashboard <ArrowIcon c="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}