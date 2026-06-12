"use client";
import { useState, useEffect, useRef } from "react";
import { useLandingStats } from "@/hooks/useLandingStats";

/* Counter hook */
function useCountUp(end: number, dur = 2000) {
  const [count, setCount] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !go) setGo(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [go]);

  useEffect(() => {
    if (!go) return;
    let s = 0;
    const inc = end / (dur / 16);
    const t = setInterval(() => {
      s += inc;
      if (s >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [go, end, dur]);

  return { count, ref };
}

/* Reveal hook */
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

/* Stat card */
function StatCard({
  icon,
  value,
  label,
  suffix = "",
  prefix = "",
  color = "green",
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: string;
}) {
  const { count, ref } = useCountUp(value);

  const colorMap: Record<string, { bg: string; icon: string; text: string; glow: string }> = {
    green: { bg: "bg-green-100", icon: "text-green-700", text: "text-green-900", glow: "shadow-green-200/50" },
    blue: { bg: "bg-blue-100", icon: "text-blue-700", text: "text-blue-900", glow: "shadow-blue-200/50" },
    amber: { bg: "bg-amber-100", icon: "text-amber-700", text: "text-amber-900", glow: "shadow-amber-200/50" },
    purple: { bg: "bg-purple-100", icon: "text-purple-700", text: "text-purple-900", glow: "shadow-purple-200/50" },
    rose: { bg: "bg-rose-100", icon: "text-rose-700", text: "text-rose-900", glow: "shadow-rose-200/50" },
  };

  const c = colorMap[color] || colorMap.green;

  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl border border-gray-100 p-8 text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500 shadow-lg ${c.glow} group`}
    >
      <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center mb-5 ${c.icon} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className={`text-4xl sm:text-5xl font-black ${c.text} tracking-tight stat-number`}>
        {prefix}{count.toLocaleString("id-ID")}{suffix}
      </div>
      <div className="text-base text-gray-500 mt-3 font-bold">{label}</div>
    </div>
  );
}

/* ── Icons ── */
const UsersIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);



const RecycleIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.5 7.5L12 2.5l4.5 5M12 2.5v12" /><path d="M4.5 16.5l-2 3.5h19l-2-3.5" /><path d="M8 22l-3.5-6M16 22l3.5-6" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function StatsSection() {
  const revealRef = useReveal();
  const { stats, isLoading } = useLandingStats();

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-green-50/60 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div ref={revealRef} className="reveal w-full px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            DATA REALTIME
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            BSSB dalam Angka
          </h2>
          <p className="text-lg text-gray-500 mt-3 font-medium max-w-xl mx-auto">
            Data langsung dari sistem — terus diperbarui secara otomatis
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-lg font-bold text-green-700 animate-pulse py-10">
            Memuat data...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={<UsersIcon />}
              value={stats.totalNasabah}
              label="Nasabah Aktif"
              suffix="+"
              color="blue"
            />

            <StatCard
              icon={<RecycleIcon />}
              value={stats.totalSampahKg}
              label="Kg Sampah Terkumpul"
              suffix="+"
              color="green"
            />
            <StatCard
              icon={<CheckIcon />}
              value={stats.totalSampahTerolah}
              label="Sampah Terolah"
              suffix="+"
              color="amber"
            />
            <StatCard
              icon={<MoneyIcon />}
              value={stats.totalHematRupiah}
              label="Rupiah Dihemat"
              prefix="Rp "
              color="rose"
            />
          </div>
        )}
      </div>
    </section>
  );
}
