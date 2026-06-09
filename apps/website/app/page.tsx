"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ── Icons ── */
const I = {
  Recycle: ({ c = "w-8 h-8" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 7.5L12 2.5l4.5 5M12 2.5v12"/><path d="M4.5 16.5l-2 3.5h19l-2-3.5"/><path d="M8 22l-3.5-6M16 22l3.5-6"/></svg>,
  Shield: ({ c = "w-8 h-8" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Users: ({ c = "w-8 h-8" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Data: ({ c = "w-8 h-8" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Chart: ({ c = "w-8 h-8" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Menu: ({ c = "w-7 h-7" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: ({ c = "w-7 h-7" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Arrow: ({ c = "w-5 h-5" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  Leaf: ({ c = "w-8 h-8" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82"/><path d="M20.59 4.41C21 5 21 7 20 9c-1 2-3.23 3.59-5.5 4.35C12.23 14.11 10 14 8 13s-3.59-3.23-4.35-5.5C2.89 5.23 3 3 4 1"/></svg>,
  Down: ({ c = "w-6 h-6" }: { c?: string }) => <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>,
};

/* ── Counter Hook ── */
function useCountUp(end: number, dur = 2000) {
  const [count, setCount] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !go) setGo(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [go]);
  useEffect(() => {
    if (!go) return;
    let s = 0; const inc = end / (dur / 16);
    const t = setInterval(() => { s += inc; if (s >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [go, end, dur]);
  return { count, ref };
}

/* ── Scroll Reveal Hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) e.target.classList.add("visible"); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Stat Card ── */
function StatCard({ icon, value, label, suffix = "" }: { icon: React.ReactNode; value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="glass rounded-2xl border border-green-100 p-8 text-center flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 text-green-700">{icon}</div>
      <div className="text-4xl sm:text-5xl font-black text-green-900 tracking-tight">{count.toLocaleString("id-ID")}{suffix}</div>
      <div className="text-base text-gray-600 mt-2 font-semibold">{label}</div>
    </div>
  );
}

/* ── Data ── */
const kategori = [
  { nama: "Plastik", emoji: "♻️", desk: "Botol, gelas, kantong plastik", bg: "from-green-50 to-emerald-50 border-green-200" },
  { nama: "Kertas", emoji: "📄", desk: "Koran, majalah, kardus", bg: "from-amber-50 to-yellow-50 border-amber-200" },
  { nama: "Logam", emoji: "🔩", desk: "Kaleng, besi, aluminium", bg: "from-slate-50 to-gray-50 border-slate-200" },
  { nama: "Kaca", emoji: "🫙", desk: "Botol kaca, gelas kaca", bg: "from-cyan-50 to-sky-50 border-cyan-200" },
  { nama: "Elektronik", emoji: "🔌", desk: "Kabel, komponen elektronik", bg: "from-purple-50 to-violet-50 border-purple-200" },
  { nama: "Minyak Jelantah", emoji: "🛢️", desk: "Minyak goreng bekas", bg: "from-orange-50 to-yellow-50 border-orange-200" },
];

const fitur = [
  { icon: <I.Users c="w-10 h-10 text-green-700" />, title: "Data Warga", desc: "Menambah, mencari, dan mengelola data warga anggota penyetor sampah dengan cepat dan mudah.", bg: "bg-green-100", rotate: "rotate-3" },
  { icon: <I.Data c="w-10 h-10 text-teal-700" />, title: "Catat Transaksi", desc: "Pilih warga, pilih jenis sampah, masukkan berat. Sistem menghitung total harga otomatis!", bg: "bg-teal-100", rotate: "-rotate-3" },
  { icon: <I.Chart c="w-10 h-10 text-amber-700" />, title: "Laporan & Grafik", desc: "Pantau total sampah terkumpul dan uang keluar setiap bulan lewat grafik yang jelas.", bg: "bg-amber-100", rotate: "rotate-2" },
];

const YEAR = 2026;

/* ── Page ── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [splash, setSplash] = useState(true);
  const revealFitur = useReveal();
  const revealKategori = useReveal();
  const revealStat = useReveal();

  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { const t = setTimeout(() => setSplash(false), 2200); return () => clearTimeout(t); }, []);

  const nav = [
    { href: "#beranda", label: "Beranda" },
    { href: "#fitur", label: "Fitur" },
    { href: "#kategori", label: "Kategori" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white selection:bg-green-200">

      {/* ═══ SPLASH ═══ */}
      {splash && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex flex-col items-center justify-center">
          <div className="animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
              <Image src="/logo2.png" alt="Logo BSSB" width={160} height={160} priority className="mx-auto relative drop-shadow-2xl" />
            </div>
          </div>
          <div className="mt-8 animate-fade-in-up delay-300 text-center">
            <h1 className="text-white font-black text-2xl tracking-wider">BANK SAMPAH</h1>
            <p className="text-green-300 font-semibold text-lg mt-1">Sampul Berkasih • IKMP</p>
          </div>
          <div className="mt-10 animate-fade-in delay-500">
            <div className="w-10 h-10 border-4 border-green-600/30 border-t-green-300 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-lg shadow-green-900/5 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between">
            <a href="#beranda" className="flex items-center gap-3 group">
              <Image src="/logo2.png" alt="Logo" width={44} height={44} className="rounded-xl shadow-md group-hover:shadow-lg transition-shadow" />
              <div>
                <span className="font-black text-green-900 text-lg block leading-tight tracking-tight">BSSB</span>
                <span className="text-xs font-bold text-green-600 tracking-widest">IKMP KUNINGAN</span>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-10">
              {nav.map(l => <a key={l.href} href={l.href} className="text-base font-bold text-gray-600 hover:text-green-700 link-underline transition-colors">{l.label}</a>)}
              <a href="/login" className="font-bold bg-green-700 text-white px-7 py-3 rounded-xl shadow-lg shadow-green-800/20 hover:bg-green-800 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base">
                Masuk Dashboard
              </a>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-green-900 p-2 rounded-xl bg-green-50 hover:bg-green-100 transition-colors" aria-label="Menu">
              {menuOpen ? <I.Close /> : <I.Menu />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden mt-4 glass rounded-2xl shadow-2xl overflow-hidden border border-green-100 divide-y divide-green-50">
              {nav.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block px-6 py-4 text-lg font-bold text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors">{l.label}</a>)}
              <div className="p-4">
                <a href="/login" className="flex items-center justify-center gap-2 w-full bg-green-700 text-white font-bold text-lg px-4 py-4 rounded-xl hover:bg-green-800 transition-colors">
                  Masuk Dashboard <I.Arrow c="w-5 h-5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="beranda" className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Floating decorations */}
        <div className="absolute top-32 left-[10%] w-20 h-20 bg-green-200/40 rounded-full blur-2xl animate-float pointer-events-none"></div>
        <div className="absolute top-60 right-[15%] w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl animate-float delay-300 pointer-events-none"></div>
        <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-green-300/20 rounded-full blur-xl animate-leaf-drift pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl shadow-green-900/10 border border-white/80">
            {/* BG Image */}
            <div className="absolute inset-0 z-0">
              <Image src="/bgherosection.png" alt="" fill priority className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/75 to-emerald-900/80"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(74,222,128,0.15)_0%,transparent_60%)]"></div>
            </div>

            <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 lg:px-24 lg:py-32 flex flex-col items-center text-center">
              <div className="animate-fade-in-down inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-green-100 font-bold px-5 py-2.5 rounded-full mb-8 text-sm shadow-lg">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                PORTAL ADMIN — SISTEM AKTIF
              </div>

              <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mb-6 drop-shadow-lg">
                Kelola Bank Sampah
                <br />
                <span className="shimmer-text">Lebih Mudah & Modern</span>
              </h1>

              <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-green-100/90 max-w-2xl mb-10 font-medium leading-relaxed">
                Catat setoran, kelola data warga, dan pantau laporan keuangan bank sampah dalam satu aplikasi yang simpel.
              </p>

              <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a href="/login" className="hover-pulse flex items-center justify-center gap-3 bg-white text-green-800 font-black text-lg sm:text-xl px-10 py-5 rounded-2xl shadow-2xl hover:bg-green-50 hover:-translate-y-1 transition-all">
                  MASUK SEKARANG <I.Arrow c="w-6 h-6" />
                </a>
                <a href="#fitur" className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg sm:text-xl px-10 py-5 rounded-2xl hover:bg-white/20 transition-all">
                  LIHAT FITUR <I.Down c="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FITUR ═══ */}
      <section id="fitur" className="py-20 sm:py-28">
        <div ref={revealFitur} className="reveal max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
              <I.Leaf c="w-4 h-4" /> FITUR UTAMA
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Kemudahan Untuk Pengelola</h2>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium">Tampilan besar, jelas, dan mudah digunakan oleh semua kalangan umur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fitur.map((f, i) => (
              <div key={i} className={`bg-white p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 ${i === 1 ? "md:-mt-6" : ""}`}>
                <div className={`w-20 h-20 ${f.bg} rounded-3xl flex items-center justify-center mb-6 ${f.rotate} shadow-inner`}>{f.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">{f.title}</h3>
                <p className="text-lg text-gray-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KATEGORI ═══ */}
      <section id="kategori" className="py-20 sm:py-28 bg-gradient-to-b from-green-50/60 to-white">
        <div ref={revealKategori} className="reveal max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
              <I.Recycle c="w-4 h-4" /> JENIS SAMPAH
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Kategori Sampah</h2>
            <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto font-medium">Panduan jenis sampah yang diterima dalam sistem</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kategori.map(k => (
              <div key={k.nama} className={`p-6 sm:p-7 rounded-2xl border-2 bg-gradient-to-br ${k.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5`}>
                <div className="text-5xl bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm flex-shrink-0">{k.emoji}</div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-0.5">{k.nama}</h3>
                  <p className="text-base text-gray-600 font-medium">{k.desk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATISTIK ═══ */}
      <section className="py-20 sm:py-28">
        <div ref={revealStat} className="reveal max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">BSSB dalam Angka</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={<I.Users c="w-7 h-7" />} value={150} label="Warga Aktif" suffix="+" />
            <StatCard icon={<I.Recycle c="w-7 h-7" />} value={5000} label="Kg Sampah Masuk" suffix="+" />
            <StatCard icon={<I.Data c="w-7 h-7" />} value={1200} label="Pencatatan" suffix="+" />
            <StatCard icon={<I.Chart c="w-7 h-7" />} value={6} label="Kategori Aktif" />
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 rounded-[2rem] p-12 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-green-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(74,222,128,0.15)_0%,transparent_60%)]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">Siap Mengelola Bank Sampah?</h2>
            <p className="text-lg text-green-200 font-medium mb-8 max-w-lg mx-auto">Masuk ke dashboard untuk mulai mencatat setoran dan memantau laporan.</p>
            <a href="/login" className="hover-pulse inline-flex items-center gap-3 bg-white text-green-800 font-black text-xl px-10 py-5 rounded-2xl shadow-2xl hover:-translate-y-1 transition-all">
              MASUK DASHBOARD <I.Arrow c="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Image src="/logo2.png" alt="Logo" width={52} height={52} className="rounded-xl bg-white/10 p-1 shadow-lg" />
              <div>
                <span className="font-black text-xl block">BSSB IKMP</span>
                <span className="text-sm font-semibold text-green-400">Bank Sampah Sampul Berkasih</span>
              </div>
            </div>
            <p className="text-green-300/80 font-medium text-center md:text-right">Sistem internal pengelola bank sampah.<br/>Kuningan, Jawa Barat.</p>
          </div>
          <div className="border-t border-green-900 mt-10 pt-8 text-center">
            <p className="text-sm text-green-600 font-medium">&copy; {YEAR} BSSB IKMP. Hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
