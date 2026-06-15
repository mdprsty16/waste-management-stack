"use client";

import { useState, useCallback } from "react";
import SplashScreen from "@/components/features/landing/SplashScreen";
import Navbar from "@/components/features/landing/Navbar";
import HeroSection from "@/components/features/landing/HeroSection";
import AboutSection from "@/components/features/landing/AboutSection";
import StatsSection from "@/components/features/landing/StatsSection";
import FeaturesSection from "@/components/features/landing/FeaturesSection";
import WasteCategorySection from "@/components/features/landing/WasteCategorySection";

import Footer from "@/components/features/landing/Footer";

export default function Home() {
  const [splash, setSplash] = useState(true);

  const handleSplashFinish = useCallback(() => setSplash(false), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white selection:bg-green-200">
      {/* ═══ SPLASH ═══ */}
      {splash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* ═══ NAVBAR ═══ */}
      <Navbar />

      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ TENTANG / VISI MISI ═══ */}
      <div className="section-divider" />
      <AboutSection />

      {/* ═══ STATISTIK (API-DRIVEN) ═══ */}
      <div className="section-divider" />
      <StatsSection />

      {/* ═══ FITUR ═══ */}
      <div className="section-divider" />
      <FeaturesSection />

      {/* ═══ KATEGORI SAMPAH ═══ */}
      <div className="section-divider" />
      <WasteCategorySection />





      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
}
