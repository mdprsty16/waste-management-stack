"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ──────────────── SVG Icon Components (simple & clean) ──────────────── */

function RecycleIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 7.5L12 2.5l4.5 5M12 2.5v12" />
      <path d="M4.5 16.5l-2 3.5h19l-2-3.5" />
      <path d="M8 22l-3.5-6M16 22l3.5-6" />
    </svg>
  );
}

function LeafIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82L7 21l1.37-.44" />
      <path d="M20.59 4.41C21 5 21 7 20 9c-1 2-3.23 3.59-5.5 4.35C12.23 14.11 10 14 8 13s-3.59-3.23-4.35-5.5C2.89 5.23 3 3 4 1c.58-1.16 2.98-.84 5.41.41 2.43 1.25 4.91 3.54 6.18 6" />
    </svg>
  );
}

function UsersIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CoinsIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h2v4" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  );
}

function MenuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

/* ──────────────── Counter Hook ──────────────── */

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

/* ──────────────── Stat Card Component ──────────────── */

function StatCard({ icon, value, label, suffix = "" }: { icon: React.ReactNode; value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center p-6">
      <div className="flex justify-center mb-3 text-green-600">{icon}</div>
      <div className="text-3xl sm:text-4xl font-bold text-green-800">
        {count.toLocaleString("id-ID")}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

/* ──────────────── Kategori Sampah Data ──────────────── */

const kategoriSampah = [
  { nama: "Plastik", emoji: "♻️", deskripsi: "Botol, gelas, kantong plastik, dan kemasan plastik lainnya", warna: "bg-blue-50 border-blue-200" },
  { nama: "Kertas", emoji: "📄", deskripsi: "Koran, majalah, kardus, dan kertas bekas lainnya", warna: "bg-amber-50 border-amber-200" },
  { nama: "Logam", emoji: "🔩", deskripsi: "Kaleng, besi, aluminium, dan logam bekas lainnya", warna: "bg-gray-50 border-gray-200" },
  { nama: "Kaca", emoji: "🫙", deskripsi: "Botol kaca, gelas kaca, dan pecahan kaca lainnya", warna: "bg-cyan-50 border-cyan-200" },
  { nama: "Elektronik", emoji: "🔌", deskripsi: "Kabel, charger, komponen elektronik bekas", warna: "bg-purple-50 border-purple-200" },
  { nama: "Minyak Jelantah", emoji: "🛢️", deskripsi: "Minyak goreng bekas yang sudah tidak terpakai", warna: "bg-yellow-50 border-yellow-200" },
];

/* ──────────────── Main Page Component ──────────────── */

const CURRENT_YEAR = 2026;

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const navLinks = [
    { href: "#beranda", label: "Beranda" },
    { href: "#tentang", label: "Tentang" },
    { href: "#layanan", label: "Layanan" },
    { href: "#kategori", label: "Kategori Sampah" },
    { href: "#lokasi", label: "Lokasi" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ════════════ SPLASH SCREEN ════════════ */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-500"
          style={{ opacity: showSplash ? 1 : 0 }}
        >
          <div className="animate-fade-in-up">
            <Image
              src="/logo2.png"
              alt="Logo BSSB IKMP"
              width={180}
              height={180}
              priority
              className="mx-auto"
            />
          </div>
          <div className="mt-6 animate-fade-in-up delay-300">
            <p className="text-green-800 font-semibold text-lg">Bank Sampah Sampul Berkasih</p>
            <p className="text-gray-400 text-sm text-center">IKMP • Go Green</p>
          </div>
          <div className="mt-8 animate-fade-in-up delay-400">
            <div className="w-8 h-8 border-3 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* ════════════ NAVBAR ════════════ */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#beranda" className="flex items-center gap-2">
              <Image
                src="/logo2.png"
                alt="Logo BSSB"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <span className="font-bold text-green-800 text-sm leading-none block">BSSB</span>
                <span className="text-[10px] text-gray-500 leading-none">IKMP</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-green-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Login Admin
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                className="block px-3 py-2 text-sm text-green-700 font-medium hover:bg-green-50 rounded-lg transition-colors"
              >
                Login Admin →
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ════════════ HERO SECTION ════════════ */}
      <section id="beranda" className="pt-16">
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <Image
            src="/bgherosection.png"
            alt="Kegiatan Bank Sampah"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Green Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/85 via-green-800/80 to-green-700/75"></div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05)_0%,transparent_60%)]"></div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-white">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-sm px-3 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                Bank Sampah Aktif
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
                Bank Sampah
                <br />
                Sampul Berkasih
              </h1>

              <p className="text-green-100 text-base sm:text-lg leading-relaxed mb-8 max-w-lg drop-shadow-sm">
                Menjaga lingkungan, membangun ekonomi masyarakat Kuningan melalui
                pengelolaan sampah yang bertanggung jawab.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#layanan"
                  id="cta-setor-sampah"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors text-sm shadow-lg"
                >
                  Mulai Setor Sampah
                  <ArrowRightIcon />
                </a>
                <a
                  href="#tentang"
                  id="cta-pelajari"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-colors text-sm"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 flex justify-center">
              <a href="#tentang" className="animate-bounce text-white/50">
                <ChevronDownIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ TENTANG KAMI ════════════ */}
      <section id="tentang" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Tentang BSSB IKMP
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Bank Sampah Sampul Berkasih (BSSB) IKMP hadir untuk membantu masyarakat Kuningan
              dalam mengelola sampah secara bertanggung jawab sekaligus memberikan nilai ekonomi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <LeafIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Jaga Lingkungan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Mengurangi volume sampah yang berakhir di TPA dengan mendaur ulang dan
                memilah sampah dari sumbernya.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <UsersIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Berdayakan Masyarakat</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Meningkatkan kesadaran dan partisipasi masyarakat dalam pengelolaan
                sampah yang baik dan benar.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CoinsIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nilai Ekonomi</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sampah yang dipilah memiliki nilai jual. Nasabah mendapat penghasilan
                tambahan dari setiap setoran sampah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ CARA KERJA / LAYANAN ════════════ */}
      <section id="layanan" className="py-16 sm:py-20 bg-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Cara Kerja
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tiga langkah mudah untuk mulai menabung sampah di BSSB IKMP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Pilah Sampah</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Pisahkan sampah rumah tangga Anda berdasarkan jenisnya: plastik, kertas, logam, kaca, dan lainnya.
              </p>
            </div>

            {/* Arrow connector (hidden on mobile) */}
            <div className="hidden md:flex items-start justify-center pt-8">
              <div className="flex items-center gap-1 text-green-300">
                <div className="w-16 h-0.5 bg-green-300"></div>
                <ArrowRightIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Setor ke Bank Sampah</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Bawa sampah yang sudah dipilah ke lokasi BSSB IKMP. Tim kami akan menimbang dan mencatat setoran Anda.
              </p>
            </div>
          </div>

          {/* Step 3 - centered below */}
          <div className="mt-8 max-w-sm mx-auto text-center">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Dapatkan Uang</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Saldo tabungan Anda bertambah sesuai berat dan jenis sampah yang disetor. Bisa ditarik kapan saja!
            </p>
          </div>
        </div>
      </section>

      {/* ════════════ KATEGORI SAMPAH ════════════ */}
      <section id="kategori" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Kategori Sampah
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Jenis-jenis sampah yang kami terima di Bank Sampah Sampul Berkasih
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kategoriSampah.map((item) => (
              <div
                key={item.nama}
                className={`p-5 rounded-xl border ${item.warna} hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.nama}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.deskripsi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ STATISTIK ════════════ */}
      <section className="py-16 sm:py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              BSSB dalam Angka
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<UsersIcon className="w-7 h-7" />}
              value={150}
              label="Nasabah Aktif"
              suffix="+"
            />
            <StatCard
              icon={<RecycleIcon className="w-7 h-7" />}
              value={5000}
              label="Kg Sampah Terkelola"
              suffix="+"
            />
            <StatCard
              icon={<LeafIcon className="w-7 h-7" />}
              value={6}
              label="Kategori Sampah"
            />
            <StatCard
              icon={<CoinsIcon className="w-7 h-7" />}
              value={1200}
              label="Transaksi Selesai"
              suffix="+"
            />
          </div>
        </div>
      </section>

      {/* ════════════ LOKASI & KONTAK ════════════ */}
      <section id="lokasi" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Lokasi & Kontak
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Kunjungi kami atau hubungi untuk informasi lebih lanjut
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Jl. Mawar 2 No.135b, Ciporang, Kec. Kuningan,
                    <br />
                    Kabupaten Kuningan, Jawa Barat 45514
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Senin - Sabtu: 08.00 - 16.00 WIB
                    <br />
                    Minggu &amp; Hari Libur: Tutup
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Kontak</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Hubungi kami untuk informasi lebih lanjut
                    <br />
                    mengenai setoran dan keanggotaan.
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-gray-200 h-[300px] lg:h-auto">
              <iframe
                title="Lokasi BSSB IKMP"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.8!2d108.484!3d-6.976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTgnMzMuNiJTIDEwOMKwMjknMi40IkU!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/logo2.png"
                  alt="Logo BSSB"
                  width={44}
                  height={44}
                  className="rounded-lg"
                />
                <div>
                  <span className="font-bold text-sm block leading-none">BSSB IKMP</span>
                  <span className="text-[10px] text-green-300 leading-none">Bank Sampah Sampul Berkasih</span>
                </div>
              </div>
              <p className="text-sm text-green-200 leading-relaxed">
                Menjaga lingkungan, membangun ekonomi masyarakat melalui pengelolaan sampah yang bertanggung jawab.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Navigasi</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-green-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Alamat</h4>
              <p className="text-sm text-green-200 leading-relaxed">
                Jl. Mawar 2 No.135b, Ciporang,
                <br />
                Kec. Kuningan, Kabupaten Kuningan,
                <br />
                Jawa Barat 45514
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-green-800 mt-8 pt-6 text-center">
            <p className="text-sm text-green-300">
              © {CURRENT_YEAR} Bank Sampah Sampul Berkasih (BSSB) IKMP. Hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
