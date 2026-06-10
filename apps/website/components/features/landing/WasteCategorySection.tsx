"use client";
import { useState, useRef, useEffect } from "react";

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

/* ── Category data ── */
interface WasteCategory {
  id: string;
  nama: string;
  icon: React.ReactNode;
  ringkasan: string;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  penjelasan: string;
  contoh: string[];
  tips: string;
}

const CATEGORIES: WasteCategory[] = [
  {
    id: "organik",
    nama: "Organik",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
        <path d="M20.59 4.41C21 5 21 7 20 9c-1 2-3.23 3.59-5.5 4.35C12.23 14.11 10 14 8 13s-3.59-3.23-4.35-5.5C2.89 5.23 3 3 4 1" />
      </svg>
    ),
    ringkasan: "Sisa makanan, daun, dan bahan alami",
    bgGradient: "from-green-50 via-emerald-50 to-green-100",
    borderColor: "border-green-300",
    iconBg: "bg-green-600",
    iconColor: "text-white",
    penjelasan:
      "Sampah organik adalah sampah yang berasal dari makhluk hidup dan dapat terurai secara alami oleh mikroorganisme. Sampah ini dapat diolah menjadi kompos yang bermanfaat untuk tanaman dan pertanian.",
    contoh: [
      "Sisa makanan & sayuran",
      "Kulit buah & biji-bijian",
      "Daun kering & ranting",
      "Ampas kopi & teh",
      "Cangkang telur",
      "Nasi basi & roti",
    ],
    tips: "Pisahkan sampah organik dari kemasan plastik sebelum dibuang. Bisa diolah menjadi kompos di rumah!",
  },
  {
    id: "nonorganik",
    nama: "Non-Organik",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 7.5L12 2.5l4.5 5M12 2.5v12" />
        <path d="M4.5 16.5l-2 3.5h19l-2-3.5" />
        <path d="M8 22l-3.5-6M16 22l3.5-6" />
      </svg>
    ),
    ringkasan: "Plastik, kertas, logam, dan kaca",
    bgGradient: "from-blue-50 via-sky-50 to-blue-100",
    borderColor: "border-blue-300",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    penjelasan:
      "Sampah non-organik adalah sampah yang tidak mudah terurai secara alami. Sebagian besar sampah non-organik dapat didaur ulang dan memiliki nilai ekonomi. Ini adalah jenis sampah utama yang diterima di Bank Sampah.",
    contoh: [
      "Botol & gelas plastik",
      "Kertas, koran & kardus",
      "Kaleng & aluminium",
      "Botol kaca & gelas kaca",
      "Kantong plastik & styrofoam",
      "Kabel & besi bekas",
    ],
    tips: "Bersihkan dan keringkan sampah non-organik sebelum disetor ke bank sampah untuk mendapat harga terbaik.",
  },
  {
    id: "b3",
    nama: "B3 (Berbahaya & Beracun)",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
    ringkasan: "Baterai, lampu, limbah kimia berbahaya",
    bgGradient: "from-red-50 via-rose-50 to-red-100",
    borderColor: "border-red-300",
    iconBg: "bg-red-600",
    iconColor: "text-white",
    penjelasan:
      "Sampah B3 (Bahan Berbahaya dan Beracun) adalah sampah yang mengandung zat berbahaya bagi kesehatan manusia dan lingkungan. Sampah ini memerlukan penanganan khusus dan TIDAK boleh dicampur dengan sampah lainnya.",
    contoh: [
      "Baterai & aki bekas",
      "Lampu neon & bohlam",
      "Cat & pelarut (thinner)",
      "Pestisida & insektisida",
      "Obat kadaluarsa",
      "Limbah elektronik (e-waste)",
    ],
    tips: "⚠️ JANGAN buang ke tempat sampah biasa! Kumpulkan terpisah dan serahkan ke bank sampah atau pengelola limbah B3 resmi.",
  },
];

export default function WasteCategorySection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const revealRef = useReveal();

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="kategori" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 particle-bg" />

      <div ref={revealRef} className="reveal max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 7.5L12 2.5l4.5 5M12 2.5v12" /><path d="M4.5 16.5l-2 3.5h19l-2-3.5" />
            </svg>
            JENIS SAMPAH
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Kategori Sampah
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Klik kategori untuk melihat penjelasan lengkap & contoh sampah
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const isOpen = expandedId === cat.id;
            return (
              <div
                key={cat.id}
                className={`category-card bg-gradient-to-br ${cat.bgGradient} border-2 ${cat.borderColor} rounded-3xl overflow-hidden transition-all duration-500 ${
                  isOpen ? "md:col-span-3 shadow-2xl" : "shadow-lg"
                }`}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => toggle(cat.id)}
                  className="w-full p-8 flex items-center gap-6 text-left group"
                >
                  <div
                    className={`w-20 h-20 ${cat.iconBg} ${cat.iconColor} rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{cat.nama}</h3>
                    <p className="text-base text-gray-600 font-medium">{cat.ringkasan}</p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0 shadow transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-8 border-t-2 border-white/50">
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Penjelasan */}
                      <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50">
                        <h4 className="font-black text-gray-900 text-lg mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                          </svg>
                          Penjelasan
                        </h4>
                        <p className="text-base text-gray-700 font-medium leading-relaxed">
                          {cat.penjelasan}
                        </p>
                      </div>

                      {/* Contoh */}
                      <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50">
                        <h4 className="font-black text-gray-900 text-lg mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                          </svg>
                          Contoh Sampah
                        </h4>
                        <ul className="space-y-2">
                          {cat.contoh.map((c, i) => (
                            <li key={i} className="flex items-center gap-2 text-base text-gray-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50">
                        <h4 className="font-black text-gray-900 text-lg mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                          </svg>
                          Tips
                        </h4>
                        <p className="text-base text-gray-700 font-medium leading-relaxed">
                          {cat.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
