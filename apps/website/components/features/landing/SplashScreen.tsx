"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting">("entering");
  const fullText = "Selamat Datang di BSSB";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    // Typing effect
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("visible"), 400);
      }
    }, 55);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (phase === "visible") {
      const exitTimer = setTimeout(() => setPhase("exiting"), 800);
      return () => clearTimeout(exitTimer);
    }
    if (phase === "exiting") {
      const doneTimer = setTimeout(onFinish, 700);
      return () => clearTimeout(doneTimer);
    }
  }, [phase, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === "exiting" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "#ffffff",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(22,163,74,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Small label */}
        <p className="animate-fade-in text-sm font-medium tracking-[0.3em] uppercase mb-6"
          style={{ color: "#16a34a" }}
        >
          Bank Sampah Sampul Berkasih
        </p>

        {/* Typed text */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
          style={{ color: "#166534" }}
        >
          {displayed}
          <span className="typing-cursor typing-cursor--light" />
        </h1>

        {/* Subtitle */}
        <p
          className={`mt-6 text-lg font-medium transition-all duration-500 ${
            phase === "entering" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ color: "#4b5563" }}
        >
          IKMP • Kuningan, Jawa Barat
        </p>

        {/* Loading bar */}
        <div className="mt-10 mx-auto w-48 h-0.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#e5e7eb" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(to right, #22c55e, #16a34a)",
              animation: "width-expand 2s ease-out forwards",
            }}
          />
        </div>
      </div>
    </div>
  );
}
