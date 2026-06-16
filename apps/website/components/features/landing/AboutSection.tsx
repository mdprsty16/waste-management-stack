"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) e.target.classList.add("visible"); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function AboutSection() {
  const ref = useReveal();

  return (
    <section id="tentang" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 particle-bg" />
      {/* Decorative blob */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-green-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-amber-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="reveal w-full px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            TENTANG KAMI
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Bank Sampah Sampul Berkasih
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto font-medium">
            Organisasi pengelolaan sampah berbasis masyarakat di bawah naungan IKMP Kuningan, Jawa Barat.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 max-w-[1400px] mx-auto">
          {/* Left — text */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Bank Sampah Sampul Berkasih (BSSB) didirikan dengan semangat memberdayakan masyarakat melalui pengelolaan sampah yang bertanggung jawab.
                Kami percaya bahwa setiap sampah memiliki nilai — dan melalui kerja sama komunitas, kita bisa menciptakan lingkungan yang lebih bersih
                sekaligus memberikan manfaat ekonomi bagi warga sekitar.
              </p>
            </div>

            {/* Visi */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-2 border-green-200 relative overflow-hidden hover:-translate-y-1 transition-transform duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/30">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-green-900">Visi</h3>
                </div>
                <p className="text-lg text-green-800 font-medium leading-relaxed">
                  Menjadi bank sampah percontohan yang unggul dalam pengelolaan sampah berkelanjutan dan berdaya guna bagi masyarakat Kuningan.
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-8 rounded-3xl border-2 border-amber-200 relative overflow-hidden hover:-translate-y-1 transition-transform duration-500">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl translate-y-8 -translate-x-8" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-amber-900">Misi</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Mengedukasi masyarakat tentang pentingnya pemilahan dan pengelolaan sampah",
                    "Meningkatkan pendapatan warga melalui sistem tabungan sampah",
                    "Mengurangi volume sampah yang masuk ke Tempat Pembuangan Akhir (TPA)",
                    "Membangun jaringan kerja sama dengan berbagai pihak untuk pengelolaan sampah",
                  ].map((m, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-amber-200 rounded-full flex-shrink-0 flex items-center justify-center text-amber-800 font-black text-xs mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-base text-amber-800 font-medium">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right — visual */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50 aspect-[4/3] group">
              <Image
                src="/hero6.avif"
                alt="Kegiatan Bank Sampah"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white font-bold text-xl">Kegiatan Bank Sampah</p>
                <p className="text-white/70 font-medium">Bersama warga memilah dan menabung sampah</p>
              </div>
            </div>

            {/* Mini stat cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-black text-green-700 mb-1">2026</div>
                <div className="text-sm font-bold text-gray-500">Tahun Berdiri</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-black text-green-700 mb-1">Kuningan</div>
                <div className="text-sm font-bold text-gray-500">Jawa Barat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
