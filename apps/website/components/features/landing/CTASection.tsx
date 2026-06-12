"use client";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 rounded-[2rem] p-12 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-green-900/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(74,222,128,0.15)_0%,transparent_60%)]" />
        {/* Animated circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 border border-white/5 rounded-full animate-rotate-slow" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 border border-white/5 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-green-400/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Siap Mengelola Bank Sampah?
          </h2>
          <p className="text-lg text-green-200 font-medium mb-8 max-w-lg mx-auto">
            Masuk ke dashboard untuk mulai mencatat setoran dan memantau laporan.
          </p>
          <a
            href="/login"
            className="hover-pulse inline-flex items-center gap-3 bg-white text-green-800 font-black text-xl px-10 py-5 rounded-2xl shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] transition-all duration-300"
          >
            MASUK DASHBOARD
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
