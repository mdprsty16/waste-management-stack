"use client";
import { useRef, useEffect } from "react";

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

const UsersIcon = ({ c = "w-10 h-10" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DataIcon = ({ c = "w-10 h-10" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ChartIcon = ({ c = "w-10 h-10" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const LeafIcon = ({ c = "w-4 h-4" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
    <path d="M20.59 4.41C21 5 21 7 20 9c-1 2-3.23 3.59-5.5 4.35C12.23 14.11 10 14 8 13s-3.59-3.23-4.35-5.5C2.89 5.23 3 3 4 1" />
  </svg>
);

const fitur = [
  {
    icon: <UsersIcon c="w-10 h-10 text-green-700" />,
    title: "Data Warga",
    desc: "Menambah, mencari, dan mengelola data warga anggota penyetor sampah dengan cepat dan mudah.",
    bg: "bg-green-100",
    rotate: "rotate-3",
  },
  {
    icon: <DataIcon c="w-10 h-10 text-teal-700" />,
    title: "Catat Transaksi",
    desc: "Pilih warga, pilih jenis sampah, masukkan berat. Sistem menghitung total harga otomatis!",
    bg: "bg-teal-100",
    rotate: "-rotate-3",
  },
  {
    icon: <ChartIcon c="w-10 h-10 text-amber-700" />,
    title: "Laporan & Grafik",
    desc: "Pantau total sampah terkumpul dan uang keluar setiap bulan lewat grafik yang jelas.",
    bg: "bg-amber-100",
    rotate: "rotate-2",
  },
];

export default function FeaturesSection() {
  const revealRef = useReveal();

  return (
    <section id="fitur" className="py-20 sm:py-28">
      <div ref={revealRef} className="reveal max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
            <LeafIcon c="w-4 h-4" /> FITUR UTAMA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Kemudahan Untuk Pengelola
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Tampilan besar, jelas, dan mudah digunakan oleh semua kalangan umur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fitur.map((f, i) => (
            <div
              key={i}
              className={`bg-white p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 ${
                i === 1 ? "md:-mt-6" : ""
              }`}
            >
              <div
                className={`w-20 h-20 ${f.bg} rounded-3xl flex items-center justify-center mb-6 ${f.rotate} shadow-inner`}
              >
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">{f.title}</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
