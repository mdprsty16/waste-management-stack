"use client";
import Image from "next/image";

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={52}
              height={52}
              className="rounded-xl bg-white/10 p-1 shadow-lg"
            />
            <div>
              <span className="font-black text-xl block">BSSB IKMP</span>
              <span className="text-sm font-semibold text-green-400">
                Bank Sampah Sampul Berkasih
              </span>
            </div>
          </div>
          <p className="text-green-300/80 font-medium text-center md:text-right">
            Sistem internal pengelola bank sampah.
            <br />
            Kuningan, Jawa Barat.
          </p>
        </div>
        <div className="border-t border-green-900 mt-10 pt-8 text-center">
          <p className="text-sm text-green-600 font-medium">
            &copy; {YEAR} BSSB IKMP. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
