import Link from "next/link";
import Logo from "@/components/logo";

/**
 * Ornamen Bintang 8 Islami (Rub el Hizb / Khatim Sulayman)
 */
function EightPointStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L14.3 6.9L19.4 4.6L17.1 9.7L22 12L17.1 14.3L19.4 19.4L14.3 17.1L12 22L9.7 17.1L4.6 19.4L6.9 14.3L2 12L6.9 9.7L4.6 4.6L9.7 6.9Z" />
    </svg>
  );
}

/**
 * Rosette Medali Islami (Shamsa) dengan aksen emas bergradasi
 */
function IslamicRosette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(80, 80)">
        {/* Lingkaran orbit berbintik luar */}
        <circle cx="0" cy="0" r="70" stroke="#D6B878" strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="3 4" />
        <circle cx="0" cy="0" r="62" stroke="#D6B878" strokeOpacity="0.12" strokeWidth="0.6" />

        {/* Bintang 8 luar */}
        <rect x="-34" y="-34" width="68" height="68" stroke="#D6B878" strokeOpacity="0.22" strokeWidth="0.9" rx="1" />
        <rect x="-34" y="-34" width="68" height="68" stroke="#D6B878" strokeOpacity="0.22" strokeWidth="0.9" rx="1" transform="rotate(45)" />

        {/* Bintang 8 menengah */}
        <rect x="-24" y="-24" width="48" height="48" stroke="#D6B878" strokeOpacity="0.28" strokeWidth="0.9" rx="0.5" />
        <rect x="-24" y="-24" width="48" height="48" stroke="#D6B878" strokeOpacity="0.28" strokeWidth="0.9" rx="0.5" transform="rotate(45)" />

        {/* Bintang 8 dalam */}
        <rect x="-14" y="-14" width="28" height="28" stroke="#D6B878" strokeOpacity="0.32" strokeWidth="0.8" />
        <rect x="-14" y="-14" width="28" height="28" stroke="#D6B878" strokeOpacity="0.32" strokeWidth="0.8" transform="rotate(45)" />

        {/* 16 jarum sinar radial */}
        {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <line x1="0" y1="-50" x2="0" y2="-62" stroke="#D6B878" strokeOpacity="0.22" strokeWidth="0.8" />
            <circle cx="0" cy="-62" r="1.2" fill="#D6B878" fillOpacity="0.28" />
          </g>
        ))}

        {/* Inti emas */}
        <circle cx="0" cy="0" r="5" stroke="#D6B878" strokeOpacity="0.35" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="2" fill="#D6B878" fillOpacity="0.45" />
      </g>
    </svg>
  );
}

/**
 * Lengkungan Mihrab Arsitektur Masjid dengan kubah berusuk dan pelita gantung
 */
function MihrabArch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sudut Arabesque Spandrel */}
      <g stroke="#D6B878" strokeOpacity="0.18" strokeWidth="0.8" fill="none">
        <path d="M 20,20 C 45,20 60,35 60,60 C 60,35 75,20 100,20" />
        <path d="M 20,45 C 35,45 45,55 45,70" />
        <circle cx="60" cy="40" r="1.5" fill="#D6B878" fillOpacity="0.25" />
        <path d="M 12,90 C 25,75 35,55 35,35" />
      </g>

      {/* Profil Lengkungan Luar Bertingkat */}
      <path
        d="M 24,480 L 24,240 C 24,130 80,60 180,24 C 280,60 336,130 336,240 L 336,480"
        stroke="#D6B878"
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />

      {/* Kontur Lengkungan Kedua */}
      <path
        d="M 40,480 L 40,246 C 40,150 90,85 180,52 C 270,85 320,150 320,246 L 320,480"
        stroke="#D6B878"
        strokeOpacity="0.18"
        strokeWidth="0.85"
      />

      {/* Kontur Lengkungan Ketiga */}
      <path
        d="M 54,480 L 54,252 C 54,168 98,105 180,74 C 262,105 306,168 306,252 L 306,480"
        stroke="#D6B878"
        strokeOpacity="0.22"
        strokeWidth="1"
      />

      {/* Lengkungan Polilobus / Scalloped Cusps khas Moorish & Andalusia */}
      <path
        d="M 68,300
           C 68,272 82,258 84,236
           C 86,212 102,198 108,178
           C 114,156 134,142 144,124
           C 154,106 172,96 180,88
           C 188,96 206,106 216,124
           C 226,142 246,156 252,178
           C 258,198 274,212 276,236
           C 278,258 292,272 292,300
           L 292,480 L 68,480 Z"
        stroke="#D6B878"
        strokeOpacity="0.22"
        strokeWidth="0.9"
        fill="none"
      />

      {/* Rusuk Kubah Mihrab Radial */}
      <g stroke="#D6B878" strokeOpacity="0.15" strokeWidth="0.75">
        <line x1="180" y1="88" x2="84" y2="236" />
        <line x1="180" y1="88" x2="108" y2="178" />
        <line x1="180" y1="88" x2="144" y2="124" />
        <line x1="180" y1="88" x2="180" y2="40" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="180" y1="88" x2="216" y2="124" />
        <line x1="180" y1="88" x2="252" y2="178" />
        <line x1="180" y1="88" x2="276" y2="236" />
      </g>

      {/* Pelita Gantung / Bintang Siraj dari Puncak Lengkungan */}
      <g>
        <line
          x1="180"
          y1="88"
          x2="180"
          y2="136"
          stroke="#D6B878"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <circle cx="180" cy="139" r="2.5" fill="none" stroke="#D6B878" strokeOpacity="0.4" strokeWidth="0.8" />
        <g transform="translate(180, 156)">
          <rect
            x="-9"
            y="-9"
            width="18"
            height="18"
            fill="none"
            stroke="#D6B878"
            strokeOpacity="0.4"
            strokeWidth="0.9"
            rx="0.5"
          />
          <rect
            x="-9"
            y="-9"
            width="18"
            height="18"
            fill="none"
            stroke="#D6B878"
            strokeOpacity="0.4"
            strokeWidth="0.9"
            rx="0.5"
            transform="rotate(45)"
          />
          <circle cx="0" cy="0" r="2" fill="#D6B878" fillOpacity="0.55" />
          <path
            d="M 0,11 C 2,16 0,20 0,20 C 0,20 -2,16 0,11 Z"
            fill="#D6B878"
            fillOpacity="0.3"
            stroke="#D6B878"
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        </g>
      </g>

      {/* Garis Aksen Pilar Penopang */}
      <g stroke="#D6B878" strokeOpacity="0.22" strokeWidth="1">
        <line x1="16" y1="240" x2="32" y2="240" />
        <line x1="18" y1="246" x2="30" y2="246" />
        <line x1="328" y1="240" x2="344" y2="240" />
        <line x1="330" y1="246" x2="342" y2="246" />
      </g>
    </svg>
  );
}

/**
 * Ornamen Mahkota Puncak Lengkungan Bagian Atas
 */
function TopCrest() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none select-none z-20">
      <svg width="240" height="24" viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="top-crest-fade-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D6B878" stopOpacity="0" />
            <stop offset="100%" stopColor="#D6B878" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="top-crest-fade-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D6B878" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D6B878" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Garis batas pudar kiri */}
        <line x1="0" y1="0.5" x2="80" y2="0.5" stroke="url(#top-crest-fade-left)" strokeWidth="1" />
        {/* Lengkungan mihrab mini */}
        <path d="M 80,0.5 C 96,0.5 106,4 112,12" stroke="#D6B878" strokeOpacity="0.45" strokeWidth="1" />
        <path d="M 160,0.5 C 144,0.5 134,4 128,12" stroke="#D6B878" strokeOpacity="0.45" strokeWidth="1" />
        {/* Garis batas pudar kanan */}
        <line x1="160" y1="0.5" x2="240" y2="0.5" stroke="url(#top-crest-fade-right)" strokeWidth="1" />

        {/* Puncak kurva mihrab tengah */}
        <path
          d="M 112,12 C 115,16 118,20 120,22 C 122,20 125,16 128,12"
          stroke="#D6B878"
          strokeOpacity="0.5"
          strokeWidth="1"
          fill="#133D30"
          fillOpacity="0.8"
        />

        {/* Bintang 8 permata di titik tengah */}
        <g transform="translate(120, 11)">
          <rect x="-4.5" y="-4.5" width="9" height="9" fill="#D6B878" fillOpacity="0.75" />
          <rect x="-4.5" y="-4.5" width="9" height="9" fill="#D6B878" fillOpacity="0.75" transform="rotate(45)" />
          <circle cx="0" cy="0" r="1.2" fill="#133D30" />
        </g>
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#174A3A] text-white/80 overflow-hidden isolate">
      {/* 1. Latar Belakang Gradasi Hijau Hutan Gelap dengan Kedalaman Visual */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          background: [
            // Kilau emas halus di bagian atas tengah
            "radial-gradient(ellipse 70% 140px at 50% 0%, rgba(214, 184, 120, 0.12) 0%, transparent 75%)",
            // Pencahayaan halus sudut kiri dan kanan
            "radial-gradient(circle 420px at 0% 15%, rgba(214, 184, 120, 0.08) 0%, transparent 70%)",
            "radial-gradient(circle 420px at 100% 15%, rgba(214, 184, 120, 0.08) 0%, transparent 70%)",
            // Zona bersih di tengah agar teks tetap tajam dan nyaman dibaca
            "radial-gradient(ellipse 65% 85% at 50% 50%, rgba(23, 74, 58, 0.96) 0%, rgba(19, 61, 48, 0.8) 60%, transparent 100%)",
            // Gradasi vertikal hijau hutan elegan khas SIRAJ
            "linear-gradient(180deg, #133D30 0%, #174A3A 30%, #123C2F 72%, #0A251C 100%)",
          ].join(", "),
        }}
      />

      {/* 2. Definisi Pattern Geometri Islami (Girih 8-Fold Star & Interlocking Strapwork) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-[1]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="siraj-footer-girih"
            width="72"
            height="72"
            patternUnits="userSpaceOnUse"
          >
            <g stroke="#D6B878" strokeWidth="0.8" fill="none">
              {/* Bintang 8 Utama (Tengah) */}
              <rect x="23" y="23" width="26" height="26" rx="0.5" />
              <rect x="23" y="23" width="26" height="26" rx="0.5" transform="rotate(45 36 36)" />
              <rect x="28" y="28" width="16" height="16" strokeWidth="0.6" />
              <rect x="28" y="28" width="16" height="16" strokeWidth="0.6" transform="rotate(45 36 36)" />
              <circle cx="36" cy="36" r="1.5" fill="#D6B878" fillOpacity="0.6" />

              {/* Bintang 8 di 4 Sudut Tile (Membentuk Pola Bersambung) */}
              <g transform="translate(0, 0)">
                <rect x="-13" y="-13" width="26" height="26" />
                <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                <circle cx="0" cy="0" r="1.5" fill="#D6B878" fillOpacity="0.6" />
              </g>
              <g transform="translate(72, 0)">
                <rect x="-13" y="-13" width="26" height="26" />
                <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                <circle cx="0" cy="0" r="1.5" fill="#D6B878" fillOpacity="0.6" />
              </g>
              <g transform="translate(0, 72)">
                <rect x="-13" y="-13" width="26" height="26" />
                <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                <circle cx="0" cy="0" r="1.5" fill="#D6B878" fillOpacity="0.6" />
              </g>
              <g transform="translate(72, 72)">
                <rect x="-13" y="-13" width="26" height="26" />
                <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                <circle cx="0" cy="0" r="1.5" fill="#D6B878" fillOpacity="0.6" />
              </g>

              {/* Garis Diagonal Pengait Girih */}
              <line x1="36" y1="10" x2="10" y2="36" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity="0.5" />
              <line x1="36" y1="10" x2="62" y2="36" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity="0.5" />
              <line x1="10" y1="36" x2="36" y2="62" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity="0.5" />
              <line x1="62" y1="36" x2="36" y2="62" strokeWidth="0.6" strokeDasharray="2 2" strokeOpacity="0.5" />

              {/* Belah Ketupat Aksen Antar-Sambungan */}
              <polygon points="36,0 40,4 36,8 32,4" strokeWidth="0.7" />
              <polygon points="72,36 76,40 72,44 68,40" strokeWidth="0.7" />
              <polygon points="36,72 40,76 36,80 32,76" strokeWidth="0.7" />
              <polygon points="0,36 4,40 0,44 -4,40" strokeWidth="0.7" />
            </g>
          </pattern>
        </defs>

        {/* Tekstur geometris sangat tipis di background utama agar tidak terlihat kosong */}
        <rect width="100%" height="100%" fill="url(#siraj-footer-girih)" opacity="0.035" />
      </svg>

      {/* 3. Panel Pola Geometris Berulang di Sisi Kiri (Responsif: Fading Mask ke Tengah) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[180px] sm:w-[260px] md:w-[360px] lg:w-[440px] pointer-events-none select-none z-[2] opacity-40 sm:opacity-75 md:opacity-100"
        style={{
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#siraj-footer-girih)" opacity="0.14" />
        </svg>
      </div>

      {/* 4. Panel Pola Geometris Berulang di Sisi Kanan (Responsif: Fading Mask ke Tengah) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[180px] sm:w-[260px] md:w-[360px] lg:w-[440px] pointer-events-none select-none z-[2] opacity-40 sm:opacity-75 md:opacity-100"
        style={{
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#siraj-footer-girih)" opacity="0.14" />
        </svg>
      </div>

      {/* 5. Lengkungan Besar Arsitektur Mihrab di Tepi Kiri (Responsif: halus di mobile/tablet, megah di desktop) */}
      <div className="absolute left-[-50px] sm:left-[-30px] md:left-[-15px] lg:left-0 top-0 bottom-0 w-[220px] sm:w-[280px] md:w-[320px] lg:w-[380px] pointer-events-none select-none z-[3] opacity-25 sm:opacity-50 md:opacity-80 lg:opacity-100 flex items-start">
        <MihrabArch className="w-full h-[360px] sm:h-[420px] md:h-[460px]" />
      </div>

      {/* 6. Lengkungan Besar Arsitektur Mihrab di Tepi Kanan (Dicerminkan) */}
      <div className="absolute right-[-50px] sm:right-[-30px] md:right-[-15px] lg:right-0 top-0 bottom-0 w-[220px] sm:w-[280px] md:w-[320px] lg:w-[380px] pointer-events-none select-none z-[3] opacity-25 sm:opacity-50 md:opacity-80 lg:opacity-100 flex items-start scale-x-[-1]">
        <MihrabArch className="w-full h-[360px] sm:h-[420px] md:h-[460px]" />
      </div>

      {/* 7. Ornamen Rosette Medali Islami di Titik Kiri dan Kanan (Tampak di Layar Tablet & Desktop) */}
      <div className="hidden sm:block absolute left-8 md:left-24 top-6 sm:top-10 pointer-events-none select-none z-[3] opacity-10 md:opacity-15">
        <IslamicRosette className="w-32 h-32 md:w-40 md:h-40" />
      </div>
      <div className="hidden sm:block absolute right-8 md:right-24 top-6 sm:top-10 pointer-events-none select-none z-[3] opacity-10 md:opacity-15">
        <IslamicRosette className="w-32 h-32 md:w-40 md:h-40" />
      </div>

      {/* 8. Garis Batas Atas Emas Halus & Mahkota Puncak Lengkungan */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D6B878]/35 to-transparent z-20 pointer-events-none" />
      <TopCrest />

      {/* 9. Konten Footer Asli (Struktur, Tautan, dan Teks Terjaga Utuh) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight mb-3">
              <Logo size={32} variant="light" />
              SIRAJ
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Belajar. Mengamalkan. Berbagi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Jelajahi</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/quran" className="text-sm text-white/60 hover:text-white transition-colors">Al-Qur&apos;an</Link>
              <Link href="/belajar" className="text-sm text-white/60 hover:text-white transition-colors">Belajar</Link>
              <Link href="/doa" className="text-sm text-white/60 hover:text-white transition-colors">Doa & Dzikir</Link>
              <Link href="/hadits" className="text-sm text-white/60 hover:text-white transition-colors">Hadits</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tentang</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-white/60">Tentang SIRAJ</span>
              <span className="text-sm text-white/60">Kebijakan Privasi</span>
              <span className="text-sm text-white/60">Syarat & Ketentuan</span>
            </div>
          </div>
        </div>

        {/* Garis Pemisah dengan Aksen Bintang 8 Halus & Teks Hak Cipta */}
        <div className="relative mt-10 pt-6">
          <div className="flex items-center justify-center my-2">
            <div className="flex-1 h-px bg-white/10" />
            <div className="px-3 flex items-center gap-2 text-[#D6B878]/60">
              <div className="w-5 h-px bg-gradient-to-r from-transparent to-[#D6B878]/40" />
              <EightPointStarIcon className="w-3.5 h-3.5 text-[#D6B878]/70" />
              <div className="w-5 h-px bg-gradient-to-l from-transparent to-[#D6B878]/40" />
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <p className="text-white/40 text-xs text-center mt-3">
            © 2024 SIRAJ. Platform pembelajaran Islam.
          </p>
        </div>
      </div>
    </footer>
  );
}
