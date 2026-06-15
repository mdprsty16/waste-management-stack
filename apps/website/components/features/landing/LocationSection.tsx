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

/* ── SVG Icons ── */
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const NavigationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5!2d108.485!3d-6.976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f1f9e7b8c0001%3A0x1234567890abcdef!2sJl.%20Mawar%202%20No.135b%2C%20Ciporang%2C%20Kec.%20Kuningan%2C%20Kabupaten%20Kuningan%2C%20Jawa%20Barat%2045514!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/Jl.+Mawar+2+No.135b,+Ciporang,+Kec.+Kuningan,+Kabupaten+Kuningan,+Jawa+Barat+45514";

export default function LocationSection() {
  const ref = useReveal();

  return (
    <section id="lokasi" className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 particle-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="reveal w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm px-4 py-2 rounded-full mb-4">
            <MapPinIcon />
            LOKASI KAMI
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Temukan Kami
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto font-medium">
            Kunjungi Bank Sampah Sampul Berkasih dan mulai kontribusimu untuk lingkungan yang lebih bersih.
          </p>
        </div>

        {/* Content grid: Map + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* ── Map embed ── */}
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50 border border-gray-100 group min-h-[400px]">
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi BSSB IKMP Kuningan"
              className="absolute inset-0 w-full h-full"
            />
            {/* Subtle overlay on top for brand feel */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-green-600/30">
                  <MapPinIcon />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">BSSB IKMP</p>
                  <p className="text-[10px] text-gray-500 font-medium">Kuningan, Jawa Barat</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Info cards ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Address card */}
            <div className="bg-white p-7 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl transition-shadow duration-500 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/30">
                  <MapPinIcon />
                </div>
                <h3 className="text-lg font-black text-gray-900">Alamat</h3>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed text-[15px]">
                Jl. Mawar 2 No.135b, Ciporang,<br />
                Kec. Kuningan, Kabupaten Kuningan,<br />
                Jawa Barat 45514
              </p>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-600/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <NavigationIcon />
                Buka di Google Maps
              </a>
            </div>

            {/* Operating hours mini card */}
            {/* <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-7 rounded-3xl border-2 border-green-200 hover:-translate-y-1 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-600/30">
                  <ClockIcon />
                </div>
                <h3 className="text-lg font-black text-green-900">Jam Operasional</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-800">Senin — Jumat</span>
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">08:00 — 16:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-800">Sabtu</span>
                  <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">08:00 — 12:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-green-600/60">Minggu & Libur</span>
                  <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Tutup</span>
                </div>
              </div>
            </div> */}

            {/* Contact mini card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow duration-300">
              <div className="w-11 h-11 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30 shrink-0">
                <PhoneIcon />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">Hubungi Kami</p>
                <p className="text-sm text-gray-500 font-medium">+62 812-XXXX-XXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
