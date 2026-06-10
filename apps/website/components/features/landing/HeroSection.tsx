"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ArrowIcon = ({ c = "w-6 h-6" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
  </svg>
);

const DownIcon = ({ c = "w-6 h-6" }: { c?: string }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const HERO_IMAGES = ["/hero1.png", "/hero2.png", "/hero3.png", "/hero4.png"];

export default function HeroSection() {
  const [currentImg, setCurrentImg] = useState(0);
  const [prevImg, setPrevImg] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    setTransitioning(true);
    setPrevImg(currentImg);
    setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    setTimeout(() => setTransitioning(false), 1200);
  }, [currentImg]);

  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section
      id="beranda"
      className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-6 overflow-hidden"
    >
      {/* Floating decorations */}
      <div className="absolute top-32 left-[10%] w-20 h-20 bg-green-200/40 rounded-full blur-2xl animate-float pointer-events-none" />
      <div className="absolute top-60 right-[15%] w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl animate-float delay-300 pointer-events-none" />
      <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-green-300/20 rounded-full blur-xl animate-leaf-drift pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative shadow-2xl shadow-green-900/10 border border-white/80">
          {/* BG Images — stacked for crossfade */}
          <div className="absolute inset-0 z-0">
            {/* Previous image (fading out) */}
            {transitioning && (
              <Image
                src={HERO_IMAGES[prevImg]}
                alt=""
                fill
                className="object-cover object-center"
                style={{ opacity: 1, transition: "opacity 1.2s ease-in-out" }}
                priority
              />
            )}
            {/* Current image */}
            <Image
              key={currentImg}
              src={HERO_IMAGES[currentImg]}
              alt=""
              fill
              priority
              className="object-cover object-center animate-kenburns"
              style={{
                opacity: transitioning ? 0 : 1,
                animation: transitioning
                  ? "hero-crossfade-in 1.2s ease-in-out forwards, kenburns 20s ease-out forwards"
                  : "kenburns 20s ease-out forwards",
              }}
            />
            {/* Dark transparent overlay */}
            <div className="absolute inset-0 bg-black/55" />
            {/* Radial accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(74,222,128,0.1)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-24 lg:px-24 lg:py-32 flex flex-col items-center text-center">
            <div className="animate-fade-in-down inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-green-100 font-bold px-5 py-2.5 rounded-full mb-8 text-sm shadow-lg">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              PORTAL ADMIN — SISTEM AKTIF
            </div>

            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mb-6 drop-shadow-lg">
              Kelola Bank Sampah
              <br />
              <span className="shimmer-text">Lebih Mudah & Modern</span>
            </h1>

            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-white/80 max-w-2xl mb-10 font-medium leading-relaxed">
              Catat setoran, kelola data warga, dan pantau laporan keuangan bank
              sampah dalam satu aplikasi yang simpel.
            </p>

            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="/login"
                className="hover-pulse flex items-center justify-center gap-3 bg-white text-green-800 font-black text-lg sm:text-xl px-10 py-5 rounded-2xl shadow-2xl hover:bg-green-50 hover:-translate-y-1 transition-all"
              >
                MASUK SEKARANG <ArrowIcon c="w-6 h-6" />
              </a>
              <a
                href="#tentang"
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg sm:text-xl px-10 py-5 rounded-2xl hover:bg-white/20 transition-all"
              >
                TENTANG KAMI <DownIcon c="w-5 h-5" />
              </a>
            </div>

            {/* Image indicators */}
            <div className="mt-10 flex gap-2">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrevImg(currentImg);
                    setCurrentImg(idx);
                    setTransitioning(true);
                    setTimeout(() => setTransitioning(false), 1200);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImg
                      ? "w-8 bg-white"
                      : "w-4 bg-white/30 hover:bg-white/50"
                    }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
