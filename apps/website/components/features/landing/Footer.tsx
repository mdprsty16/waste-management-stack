"use client";
import Image from "next/image";

const YEAR = new Date().getFullYear();

/* ── SVG Icons ── */
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
    <path d="m14 16-3 3 3 3"/>
    <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Fitur Layanan", href: "#fitur" },
  { label: "Kategori Sampah", href: "#kategori" },
  { label: "Masuk Dashboard", href: "/dashboard" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #052e16 0%, #0a3d1e 50%, #052e16 100%)" }}>
      {/* ── Decorative top accent ── */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, #22c55e 0%, #4ade80 35%, #22c55e 65%, #16a34a 100%)",
        }}
      />

      {/* ── Decorative background leaves ── */}
      <LeafIcon className="absolute top-12 right-12 text-green-800/20 rotate-45 w-32 h-32 hidden lg:block" />
      <LeafIcon className="absolute bottom-24 left-8 text-green-800/15 -rotate-12 w-20 h-20 hidden lg:block" />

      {/* ── Subtle dot pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Ambient glow ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ═══════════════ MAIN FOOTER CONTENT ═══════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── Column 1: Brand ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/10 blur-sm" />
                <Image
                  src="/logo2.png"
                  alt="Logo BSSB"
                  width={52}
                  height={52}
                  className="relative rounded-xl shadow-lg shadow-black/20"
                />
              </div>
              <div>
                <span className="font-black text-xl text-white block leading-tight">
                  BSSB
                </span>
                <span className="text-xs font-bold text-green-400 tracking-wide uppercase">
                  IKMP Kuningan
                </span>
              </div>
            </div>

            <p className="text-green-200/90 text-sm leading-relaxed mb-6 max-w-xs">
              Bank Sampah Sampul Berkasih — wadah pengelolaan sampah yang bertanggung jawab untuk membangun lingkungan bersih dan ekonomi masyarakat.
            </p>

            {/* Motto badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-700/50 bg-green-900/40">
              <span className="text-green-400"><RecycleIcon /></span>
              <span className="text-xs font-semibold text-green-300">
                Kelola Sampah, Bangun Harapan
              </span>
            </div>
          </div>

          {/* ── Column 2: Navigation ── */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-green-500 rounded-full" />
              Navigasi
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-green-100/80 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    <span className="text-green-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                      <ChevronRightIcon />
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Contact ── */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-green-500 rounded-full" />
              Kontak
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-green-400 shrink-0"><MapPinIcon /></span>
                <span className="text-green-100/80 text-sm leading-relaxed">
                  Kuningan, Jawa Barat<br />
                  Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 shrink-0"><PhoneIcon /></span>
                <span className="text-green-100/80 text-sm">+62 812-XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 shrink-0"><MailIcon /></span>
                <span className="text-green-100/80 text-sm">bssb.ikmp@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* ── Column 4: Operating Hours ── */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-green-500 rounded-full" />
              Jam Operasional
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-green-400 shrink-0"><ClockIcon /></span>
                <div>
                  <p className="text-green-100 text-sm font-semibold">Senin — Jumat</p>
                  <p className="text-green-300/70 text-xs">08:00 — 16:00 WIB</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-400 shrink-0"><ClockIcon /></span>
                <div>
                  <p className="text-green-100 text-sm font-semibold">Sabtu</p>
                  <p className="text-green-300/70 text-xs">08:00 — 12:00 WIB</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-700 shrink-0"><ClockIcon /></span>
                <div>
                  <p className="text-green-300/60 text-sm font-semibold">Minggu & Libur</p>
                  <p className="text-green-300/50 text-xs">Tutup</p>
                </div>
              </li>
            </ul>

            {/* Quick CTA */}
            <a
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-green-950 text-sm font-bold rounded-lg shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Masuk Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════ BOTTOM BAR ═══════════════ */}
      <div className="relative z-10 border-t border-green-800/50">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-green-200/70 font-medium flex items-center gap-1.5">
              &copy; {YEAR} BSSB IKMP — Dibuat dengan
              <span className="text-red-400"><HeartIcon /></span>
              di Kuningan
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-green-200/60 hover:text-green-300 transition-colors font-medium">
                Kebijakan Privasi
              </a>
              <span className="text-green-800">|</span>
              <a href="#" className="text-xs text-green-200/40 hover:text-green-300 transition-colors font-medium">
                Syarat & Ketentuan
              </a>
              <span className="text-green-800">|</span>
              <a href="#" className="text-xs text-green-200/40 hover:text-green-300 transition-colors font-medium">
                Bantuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
