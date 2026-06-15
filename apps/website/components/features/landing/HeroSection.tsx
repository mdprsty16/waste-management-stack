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

const HERO_IMAGES = [
  "/hero1.avif",
  "/hero2.avif",
  "/hero3.avif",
  "/hero4.avif",
];

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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Full-screen BG Images */}
      <div className="absolute inset-0 z-0">
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
        <Image
          key={currentImg}
          src={HERO_IMAGES[currentImg]}
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{
            opacity: transitioning ? 0 : 1,
            animation: transitioning
              ? "hero-crossfade-in 1.2s ease-in-out forwards, kenburns 20s ease-out forwards"
              : "kenburns 20s ease-out forwards",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(74,222,128,0.08)_0%,transparent_60%)]" />
      </div>

      {/* Floating particles */}
      <div className="absolute top-20 left-[8%] w-3 h-3 bg-green-400/40 rounded-full animate-float pointer-events-none" />
      <div className="absolute top-40 right-[12%] w-2 h-2 bg-white/20 rounded-full animate-float delay-200 pointer-events-none" />
      <div className="absolute bottom-40 left-[15%] w-4 h-4 bg-emerald-400/20 rounded-full animate-leaf-drift pointer-events-none" />
      <div className="absolute top-60 left-[45%] w-2 h-2 bg-white/15 rounded-full animate-bounce-soft pointer-events-none" />
      <div className="absolute bottom-60 right-[20%] w-3 h-3 bg-green-300/25 rounded-full animate-float delay-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-32">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">

          <h1 className="animate-fade-in-up text-4xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] mb-6 drop-shadow-lg">
            Kelola Bank Sampah
            <br />
            <span className="shimmer-text">Lebih Mudah & Modern</span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-lg sm:text-xl lg:text-2xl text-white/80 max-w-3xl mb-12 font-medium leading-relaxed">
            Catat setoran, kelola data warga, dan pantau laporan keuangan bank
            sampah dalam satu aplikasi yang simpel.
          </p>



          {/* Image indicators */}
          <div className="mt-14 flex gap-2">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrevImg(currentImg);
                  setCurrentImg(idx);
                  setTransitioning(true);
                  setTimeout(() => setTransitioning(false), 1200);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentImg
                    ? "w-10 bg-white"
                    : "w-4 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-soft">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-fade-in" />
        </div>
      </div>
    </section>
  );
}
