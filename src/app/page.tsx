"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { dailyVerse } from "@/data/quran";
import {
  BookOpen,
  Heart,
  Users,
  Clock,
  Star,
  Sun,
  ArrowRight,
  BookMarked,
  ChevronRight,
  Sparkles,
  Share2,
} from "lucide-react";

const learningTopics = [
  { icon: BookOpen, title: "Al-Qur'an", desc: "Temukan dan baca ayat-ayat Al-Qur'an.", href: "/quran" },
  { icon: Heart, title: "Aqidah", desc: "Pelajari dasar-dasar keimanan.", href: "/belajar" },
  { icon: BookMarked, title: "Fiqih", desc: "Kenali tuntunan ibadah dalam kehidupan sehari-hari.", href: "/belajar" },
  { icon: Users, title: "Akhlak", desc: "Belajar membangun akhlak yang baik.", href: "/belajar" },
  { icon: Clock, title: "Sirah", desc: "Kenali perjalanan Rasulullah ﷺ dan generasi terdahulu.", href: "/belajar" },
  { icon: Star, title: "Adab", desc: "Pelajari adab dalam kehidupan sehari-hari.", href: "/belajar" },
];

const steps = [
  {
    num: "01",
    title: "Belajar sedikit demi sedikit",
    desc: "Mulai dengan membaca satu ayat, satu hadits, atau satu materi setiap hari. Konsistensi lebih baik daripada kuantitas.",
    icon: BookOpen,
  },
  {
    num: "02",
    title: "Amalkan ilmu yang dipelajari",
    desc: "Ilmu yang diamalkan akan menjadi cahaya. Terapkan apa yang kamu pelajari dalam kehidupan sehari-hari.",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "Bagikan kebaikan kepada sesama",
    desc: "Berbagi ilmu adalah salah satu amal yang pahalanya tidak terputus. Sampaikan walau satu ayat.",
    icon: Share2,
  },
];

/**
 * Ornamen Bintang 8 Islami (Rub el Hizb)
 */
function EightPointStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L14.3 6.9L19.4 4.6L17.1 9.7L22 12L17.1 14.3L19.4 19.4L14.3 17.1L12 22L9.7 17.1L4.6 19.4L6.9 14.3L2 12L6.9 9.7L4.6 4.6L9.7 6.9Z" />
    </svg>
  );
}

/**
 * Lengkungan Mihrab Arsitektur Samar untuk Background Section
 */
function SubtleMihrabOutline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Garis lengkungan luar utama */}
      <path
        d="M 20,540 L 20,260 C 20,140 75,65 160,20 C 245,65 300,140 300,260 L 300,540"
        stroke="#174A3A"
        strokeOpacity="0.08"
        strokeWidth="1.2"
      />
      {/* Garis lengkungan bertingkat emas halus */}
      <path
        d="M 38,540 L 38,266 C 38,160 85,90 160,50 C 235,90 282,160 282,266 L 282,540"
        stroke="#D6B878"
        strokeOpacity="0.18"
        strokeWidth="0.9"
      />
      {/* Lekukan polilobus / Moorish cusps */}
      <path
        d="M 54,320
           C 54,290 68,274 72,250
           C 76,224 92,208 100,186
           C 108,162 126,146 136,126
           C 146,106 156,92 160,84
           C 164,92 174,106 184,126
           C 194,146 212,162 220,186
           C 228,208 244,224 248,250
           C 252,274 266,290 266,320
           L 266,540 L 54,540 Z"
        stroke="#D6B878"
        strokeOpacity="0.14"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Garis rusuk radial kubah */}
      <g stroke="#174A3A" strokeOpacity="0.05" strokeWidth="0.75">
        <line x1="160" y1="84" x2="72" y2="250" />
        <line x1="160" y1="84" x2="100" y2="186" />
        <line x1="160" y1="84" x2="136" y2="126" />
        <line x1="160" y1="84" x2="184" y2="126" />
        <line x1="160" y1="84" x2="220" y2="186" />
        <line x1="160" y1="84" x2="248" y2="250" />
      </g>
    </svg>
  );
}

/**
 * Lingkaran Geometris Abstrak Bersusun dengan Aksen Emas & Hijau Lembut
 */
function SubtleGeometricRings({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(200, 200)">
        {/* Lingkaran orbit putus-putus */}
        <circle cx="0" cy="0" r="180" stroke="#D6B878" strokeOpacity="0.15" strokeWidth="0.9" strokeDasharray="4 6" />
        {/* Lingkaran tengah */}
        <circle cx="0" cy="0" r="145" stroke="#174A3A" strokeOpacity="0.06" strokeWidth="1" />
        <circle cx="0" cy="0" r="110" stroke="#D6B878" strokeOpacity="0.12" strokeWidth="0.8" strokeDasharray="2 4" />
        {/* Bintang 8 konsentris */}
        <rect x="-45" y="-45" width="90" height="90" stroke="#D6B878" strokeOpacity="0.15" strokeWidth="0.85" rx="1" />
        <rect x="-45" y="-45" width="90" height="90" stroke="#D6B878" strokeOpacity="0.15" strokeWidth="0.85" rx="1" transform="rotate(45)" />
        {/* Inti geometris */}
        <circle cx="0" cy="0" r="28" stroke="#174A3A" strokeOpacity="0.06" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="3" fill="#D6B878" fillOpacity="0.25" />
        {/* Titik-titik penanda sudut */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <line x1="0" y1="-145" x2="0" y2="-180" stroke="#D6B878" strokeOpacity="0.12" strokeWidth="0.75" />
            <circle cx="0" cy="-180" r="2" fill="#D6B878" fillOpacity="0.2" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * Ornamen Sudut Kartu Geometris Islami Bernuansa Emas
 */
function IslamicCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Garis sudut luar */}
      <path
        d="M 6 42 L 6 12 C 6 8.69 8.69 6 12 6 L 42 6"
        stroke="#D6B878"
        strokeWidth="1.25"
        strokeOpacity="0.45"
      />
      {/* Garis sudut dalam */}
      <path
        d="M 14 34 L 14 16 C 14 14.9 14.9 14 16 14 L 34 14"
        stroke="#D6B878"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />
      {/* Miniatur Bintang 8 di pertemuan siku */}
      <g transform="translate(14, 14) scale(0.42)">
        <rect x="-10" y="-10" width="20" height="20" stroke="#D6B878" strokeWidth="1.2" strokeOpacity="0.6" rx="0.5" />
        <rect x="-10" y="-10" width="20" height="20" stroke="#D6B878" strokeWidth="1.2" strokeOpacity="0.6" rx="0.5" transform="rotate(45)" />
        <circle cx="0" cy="0" r="2.5" fill="#D6B878" fillOpacity="0.75" />
      </g>
      {/* Titik aksen di ujung garis */}
      <circle cx="42" cy="6" r="1.5" fill="#D6B878" fillOpacity="0.55" />
      <circle cx="6" cy="42" r="1.5" fill="#D6B878" fillOpacity="0.55" />
    </svg>
  );
}

/**
 * Watermark Shamsa (Roset Bintang Geometris Islami) untuk Latar Belakang Kartu Ayat
 */
function ShamsaWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(160, 160)">
        {/* Lingkaran orbit terluar putus-putus */}
        <circle cx="0" cy="0" r="145" stroke="#D6B878" strokeWidth="0.8" strokeDasharray="3 4" strokeOpacity="0.6" />
        <circle cx="0" cy="0" r="128" stroke="#174A3A" strokeWidth="0.6" strokeOpacity="0.4" />
        <circle cx="0" cy="0" r="108" stroke="#D6B878" strokeWidth="0.9" strokeOpacity="0.7" />
        <circle cx="0" cy="0" r="88" stroke="#174A3A" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.4" />

        {/* 16-point interlocking star poligon */}
        {[0, 22.5, 45, 67.5].map((deg) => (
          <rect
            key={deg}
            x="-68"
            y="-68"
            width="136"
            height="136"
            stroke="#D6B878"
            strokeWidth="0.75"
            strokeOpacity="0.65"
            rx="1"
            transform={`rotate(${deg})`}
          />
        ))}

        {/* Bintang 8 kedua di lapisan dalam */}
        <rect x="-42" y="-42" width="84" height="84" stroke="#174A3A" strokeWidth="0.75" strokeOpacity="0.35" rx="0.5" />
        <rect x="-42" y="-42" width="84" height="84" stroke="#174A3A" strokeWidth="0.75" strokeOpacity="0.35" rx="0.5" transform="rotate(45)" />

        {/* Inti konsentris */}
        <circle cx="0" cy="0" r="28" stroke="#D6B878" strokeWidth="0.9" strokeOpacity="0.8" />
        <circle cx="0" cy="0" r="16" stroke="#174A3A" strokeWidth="0.6" strokeOpacity="0.4" />
        <circle cx="0" cy="0" r="4" fill="#D6B878" fillOpacity="0.5" />

        {/* Sinar radial penanda arah */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="0"
            y1="-108"
            x2="0"
            y2="-128"
            stroke="#D6B878"
            strokeWidth="0.75"
            strokeOpacity="0.5"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 pattern-star opacity-[0.05] pattern-fade pointer-events-none"
          aria-hidden="true"
        />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 border border-primary/10 rounded-full" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
              <Sun size={14} />
              Temukan ilmu, satu langkah setiap hari.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight tracking-tight text-balance">
              Belajar Islam,
              <br />
              <span className="text-primary">dengan langkah yang bermakna.</span>
            </h1>

            <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              Temukan Al-Qur&apos;an, ilmu Islam, doa, hadits, dan pembelajaran yang membantu kita terus bertumbuh dalam kebaikan.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                Mulai Belajar
                <ArrowRight size={18} />
              </Link>
              <Link href="/quran" className="btn-secondary text-base px-8 py-3">
                Jelajahi Al-Qur&apos;an
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Apa yang ingin kamu pelajari?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.title}
                  href={topic.href}
                  className="card group flex items-start gap-4 hover:border-primary/20 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/[0.07] flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{topic.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ayat Hari Ini (Diperindah) */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-[#F8F7F2] isolate">
        {/* 1. Latar Belakang Gradasi Krem Lembut & Kedalaman Visual */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            background: [
              // Kilau radial emas hangat lembut di tengah tepat di belakang kartu
              "radial-gradient(ellipse 750px 420px at 50% 50%, rgba(214, 184, 120, 0.12) 0%, transparent 70%)",
              // Aksen hijau lembut di sudut kiri atas & kanan bawah
              "radial-gradient(circle 520px at 0% 10%, rgba(23, 74, 58, 0.045) 0%, transparent 65%)",
              "radial-gradient(circle 520px at 100% 90%, rgba(23, 74, 58, 0.045) 0%, transparent 65%)",
              // Gradasi vertikal krem lembut berkarakter
              "linear-gradient(180deg, #FBFBF8 0%, #F8F7F2 45%, #F4F3ED 100%)",
            ].join(", "),
          }}
        />

        {/* 2. Definisi Pattern Geometri Islami Tipis untuk Background Section */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="ayat-bg-girih"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="#D6B878" strokeWidth="0.75" strokeOpacity="0.22" fill="none">
                <rect x="23" y="23" width="26" height="26" rx="0.5" />
                <rect x="23" y="23" width="26" height="26" rx="0.5" transform="rotate(45 36 36)" />
                <circle cx="36" cy="36" r="1.5" fill="#D6B878" fillOpacity="0.35" />
                <g transform="translate(0, 0)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <g transform="translate(72, 0)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <g transform="translate(0, 72)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <g transform="translate(72, 72)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <line x1="36" y1="10" x2="10" y2="36" strokeDasharray="2 2" strokeOpacity="0.18" />
                <line x1="36" y1="10" x2="62" y2="36" strokeDasharray="2 2" strokeOpacity="0.18" />
                <line x1="10" y1="36" x2="36" y2="62" strokeDasharray="2 2" strokeOpacity="0.18" />
                <line x1="62" y1="36" x2="36" y2="62" strokeDasharray="2 2" strokeOpacity="0.18" />
              </g>
            </pattern>
          </defs>

          {/* Tekstur geometris transparan halus di seluruh background section */}
          <rect width="100%" height="100%" fill="url(#ayat-bg-girih)" opacity="0.2" />
        </svg>

        {/* 3. Lengkungan Mihrab Arsitektur Samar di Sudut & Sisi Section */}
        <div className="absolute left-[-60px] sm:left-[-30px] md:left-[-10px] lg:left-4 top-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] md:w-[320px] pointer-events-none select-none z-0 opacity-35 md:opacity-50">
          <SubtleMihrabOutline className="w-full h-auto" />
        </div>
        <div className="absolute right-[-60px] sm:right-[-30px] md:right-[-10px] lg:right-4 top-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] md:w-[320px] pointer-events-none select-none z-0 opacity-35 md:opacity-50 scale-x-[-1]">
          <SubtleMihrabOutline className="w-full h-auto" />
        </div>

        {/* 4. Ornamen Geometris Abstrak Bersusun di Sudut Tepi */}
        <div className="absolute right-[-60px] md:right-[-20px] top-[-40px] md:top-[-20px] w-72 md:w-84 pointer-events-none select-none z-0 opacity-40 md:opacity-60">
          <SubtleGeometricRings className="w-full h-auto" />
        </div>
        <div className="hidden sm:block absolute left-[-60px] md:left-[-20px] bottom-[-40px] md:bottom-[-20px] w-72 md:w-84 pointer-events-none select-none z-0 opacity-35 md:opacity-55">
          <SubtleGeometricRings className="w-full h-auto" />
        </div>

        {/* Konten Utama Section */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Judul “Ayat Hari Ini” */}
          <div className="text-center mb-10 sm:mb-12">
            <div
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D6B878]/15 border border-[#D6B878]/35 text-[#D6B878] mb-3.5 shadow-2xs select-none"
              aria-hidden="true"
            >
              <EightPointStarIcon className="w-4 h-4 text-[#D6B878]" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text tracking-tight">
              Ayat Hari Ini
            </h2>

            {/* Garis dekoratif tipis berwarna emas di bawah judul */}
            <div className="flex items-center justify-center gap-2.5 mt-3.5 select-none" aria-hidden="true">
              <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#D6B878]/70" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#D6B878] bg-[#D6B878]/30" />
              <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#D6B878]/70" />
            </div>
          </div>

          {/* Kartu Ayat Premium */}
          <div className="group relative rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xs border border-[#D6B878]/35 p-7 sm:p-10 lg:p-12 text-center shadow-[0_16px_45px_-12px_rgba(23,74,58,0.07),0_2px_12px_rgba(214,184,120,0.08)] hover:shadow-[0_22px_55px_-10px_rgba(23,74,58,0.12),0_4px_20px_rgba(214,184,120,0.15)] hover:border-[#D6B878]/60 transition-all duration-300 hover:-translate-y-1">
            {/* Aksen garis emas lembut di bagian atas kartu */}
            <div
              className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#D6B878] to-transparent opacity-80"
              aria-hidden="true"
            />

            {/* Aksen ornamen mihrab kecil di tengah atas kartu */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rotate-45 border border-[#D6B878]/40 bg-white shadow-2xs flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <div className="w-2 h-2 rounded-full bg-[#D6B878]/65" />
            </div>

            {/* Ornamen geometris Islami di ke-4 sudut kartu */}
            <IslamicCornerOrnament className="absolute top-2.5 left-2.5 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none select-none text-[#D6B878]" />
            <IslamicCornerOrnament className="absolute top-2.5 right-2.5 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none select-none text-[#D6B878] scale-x-[-1]" />
            <IslamicCornerOrnament className="absolute bottom-2.5 left-2.5 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none select-none text-[#D6B878] scale-y-[-1]" />
            <IslamicCornerOrnament className="absolute bottom-2.5 right-2.5 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none select-none text-[#D6B878] scale-[-1]" />

            {/* Roset / Watermark Shamsa lembut di tengah kartu di belakang teks */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[340px] pointer-events-none select-none z-0 opacity-[0.05] sm:opacity-[0.07]"
              aria-hidden="true"
            >
              <ShamsaWatermark className="w-full h-auto text-[#D6B878]" />
            </div>

            {/* Konten Ayat (Z-Index di atas ornamen agar keterbacaan sempurna) */}
            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Teks Ayat Bahasa Arab */}
              <p
                className="arabic-text !text-center text-3xl sm:text-4xl lg:text-[2.65rem] text-[#17211D] leading-[2.2] sm:leading-[2.4] mb-6 font-normal tracking-normal select-text"
                lang="ar"
                dir="rtl"
              >
                {dailyVerse.arabic}
              </p>

              {/* Referensi Surah & Nomor Ayat dengan Badge Halus */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.05] border border-[#D6B878]/40 text-xs sm:text-sm font-semibold text-primary tracking-wide mb-5 select-none shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B878]" />
                <span>QS. {dailyVerse.surahName}: {dailyVerse.ayatNumber}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B878]" />
              </div>

              {/* Terjemahan Bahasa Indonesia */}
              <p className="text-base sm:text-lg text-text/85 leading-relaxed max-w-xl mx-auto italic font-normal">
                &ldquo;{dailyVerse.translation}&rdquo;
              </p>

              {/* Tautan Baca Selengkapnya */}
              <div className="mt-7">
                <Link
                  href={`/quran/${dailyVerse.surahNumber}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-all duration-200 group/link px-4 py-2 rounded-lg hover:bg-primary/[0.06] border border-transparent hover:border-[#D6B878]/30"
                >
                  <span>Baca selengkapnya</span>
                  <ChevronRight size={16} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section “Mulai dari hal sederhana” & Ajakan Belajar (Diperindah) */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-[#F8F7F2] isolate">
        {/* 1. Latar Belakang Gradasi Krem Halus dengan Nuansa Kedalaman */}
        <div
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            background: [
              // Kilau emas hangat sangat lembut di tengah atas
              "radial-gradient(ellipse 700px 350px at 50% 5%, rgba(214, 184, 120, 0.09) 0%, transparent 70%)",
              // Aksen hijau lembut di sudut kiri atas dan kanan bawah
              "radial-gradient(circle 500px at 5% 15%, rgba(23, 74, 58, 0.04) 0%, transparent 65%)",
              "radial-gradient(circle 500px at 95% 85%, rgba(23, 74, 58, 0.04) 0%, transparent 65%)",
              // Gradasi vertikal krem lembut berkarakter
              "linear-gradient(180deg, #FBFBF8 0%, #F8F7F2 40%, #F4F3ED 100%)",
            ].join(", "),
          }}
        />

        {/* 2. Definisi Pattern Geometri Islami Tipis untuk Background Section & Card */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="steps-bg-girih"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="#D6B878" strokeWidth="0.75" strokeOpacity="0.25" fill="none">
                <rect x="23" y="23" width="26" height="26" rx="0.5" />
                <rect x="23" y="23" width="26" height="26" rx="0.5" transform="rotate(45 36 36)" />
                <circle cx="36" cy="36" r="1.5" fill="#D6B878" fillOpacity="0.3" />
                <g transform="translate(0, 0)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <g transform="translate(72, 0)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <g transform="translate(0, 72)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <g transform="translate(72, 72)">
                  <rect x="-13" y="-13" width="26" height="26" />
                  <rect x="-13" y="-13" width="26" height="26" transform="rotate(45 0 0)" />
                </g>
                <line x1="36" y1="10" x2="10" y2="36" strokeDasharray="2 2" strokeOpacity="0.2" />
                <line x1="36" y1="10" x2="62" y2="36" strokeDasharray="2 2" strokeOpacity="0.2" />
                <line x1="10" y1="36" x2="36" y2="62" strokeDasharray="2 2" strokeOpacity="0.2" />
                <line x1="62" y1="36" x2="36" y2="62" strokeDasharray="2 2" strokeOpacity="0.2" />
              </g>
            </pattern>
          </defs>

          {/* Tekstur geometris transparan halus di seluruh background section */}
          <rect width="100%" height="100%" fill="url(#steps-bg-girih)" opacity="0.18" />
        </svg>

        {/* 3. Lengkungan Mihrab Samar di Tepi Kiri & Kanan Section */}
        <div className="absolute left-[-60px] sm:left-[-30px] md:left-[-10px] lg:left-4 top-8 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] pointer-events-none select-none z-0 opacity-40 md:opacity-60">
          <SubtleMihrabOutline className="w-full h-auto" />
        </div>
        <div className="absolute right-[-60px] sm:right-[-30px] md:right-[-10px] lg:right-4 top-8 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] pointer-events-none select-none z-0 opacity-40 md:opacity-60 scale-x-[-1]">
          <SubtleMihrabOutline className="w-full h-auto" />
        </div>

        {/* 4. Lingkaran Geometris Abstrak Bersusun di Sudut Background */}
        <div className="absolute right-[-80px] md:right-[-40px] top-[-60px] md:top-[-30px] w-80 md:w-96 pointer-events-none select-none z-0 opacity-50 md:opacity-75">
          <SubtleGeometricRings className="w-full h-auto" />
        </div>
        <div className="hidden sm:block absolute left-[-80px] md:left-[-40px] bottom-10 w-72 md:w-88 pointer-events-none select-none z-0 opacity-40 md:opacity-60">
          <SubtleGeometricRings className="w-full h-auto" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/[0.05] border border-[#D6B878]/35 text-xs font-medium text-primary mb-3 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B878]" />
              <span>Langkah Awal Penuntut Ilmu</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B878]" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text tracking-tight">
              Mulai dari hal sederhana
            </h2>

            {/* Garis dekoratif di bawah judul */}
            <div className="flex items-center justify-center gap-2 mt-3.5 select-none" aria-hidden="true">
              <div className="w-10 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#D6B878]/70" />
              <div className="w-2 h-2 rotate-45 border border-[#D6B878] bg-[#D6B878]/30" />
              <div className="w-10 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#D6B878]/70" />
            </div>
          </div>

          {/* 3 Kolom Langkah Sederhana (Ringan, Elegan, dengan Aksen Halus) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className="group relative p-6 sm:p-8 rounded-2xl bg-white/60 hover:bg-white/95 border border-[#174A3A]/[0.07] hover:border-[#D6B878]/40 hover:shadow-xl hover:shadow-[#174A3A]/[0.04] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Baris Atas: Ikon Berkarakter & Nomor Elegan */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl bg-primary/[0.06] border border-[#D6B878]/30 group-hover:bg-primary group-hover:border-primary text-primary group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0 shadow-xs">
                        <StepIcon size={20} className="transition-colors duration-300" />
                      </div>
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#174A3A]/25 group-hover:text-[#D6B878] transition-colors duration-300 tracking-tight select-none">
                        {step.num}
                      </span>
                    </div>

                    {/* Judul Kolom */}
                    <h3 className="text-lg sm:text-xl font-bold text-text group-hover:text-primary transition-colors duration-200 mb-2.5">
                      {step.title}
                    </h3>

                    {/* Garis dekoratif pendek di bawah judul */}
                    <div className="w-8 h-0.5 bg-gradient-to-r from-[#D6B878] to-transparent rounded-full mb-3.5 group-hover:w-16 transition-all duration-300" />

                    {/* Isi Teks Utama */}
                    <p className="text-sm text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Watermark ornamen bintang 8 di sudut kartu */}
                  <div className="absolute bottom-3 right-3 text-[#D6B878]/25 group-hover:text-[#D6B878]/45 transition-colors duration-300 pointer-events-none select-none">
                    <EightPointStarIcon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kartu Ajakan Belajar (Diperindah dengan Aksen Emas & Pola Geometris) */}
          <div className="relative mt-14 sm:mt-16 lg:mt-20 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[#174A3A]/15 border border-[#D6B878]/35 isolate">
            {/* Latar Belakang Gradasi Hijau Gelap Kaya & Bercahaya */}
            <div
              className="absolute inset-0 pointer-events-none select-none z-0"
              style={{
                background: [
                  // Kilau lembut bagian atas tengah kartu
                  "radial-gradient(ellipse 600px 180px at 50% 0%, rgba(214, 184, 120, 0.18) 0%, transparent 75%)",
                  // Pencahayaan sudut kiri dan kanan
                  "radial-gradient(circle 350px at 0% 50%, rgba(214, 184, 120, 0.08) 0%, transparent 70%)",
                  "radial-gradient(circle 350px at 100% 50%, rgba(214, 184, 120, 0.08) 0%, transparent 70%)",
                  // Gradasi hijau hutan khas SIRAJ
                  "linear-gradient(135deg, #1A5442 0%, #174A3A 50%, #10382C 100%)",
                ].join(", "),
              }}
            />

            {/* Pola Geometris Islami Transparan pada Sisi Kiri Kartu */}
            <div
              className="absolute left-0 top-0 bottom-0 w-44 sm:w-60 md:w-72 pointer-events-none select-none z-[1] opacity-15"
              style={{
                maskImage: "linear-gradient(to right, black 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
              }}
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="url(#steps-bg-girih)" />
              </svg>
            </div>

            {/* Pola Geometris Islami Transparan pada Sisi Kanan Kartu */}
            <div
              className="absolute right-0 top-0 bottom-0 w-44 sm:w-60 md:w-72 pointer-events-none select-none z-[1] opacity-15"
              style={{
                maskImage: "linear-gradient(to left, black 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to left, black 0%, rgba(0,0,0,0.6) 40%, transparent 100%)",
              }}
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="url(#steps-bg-girih)" />
              </svg>
            </div>

            {/* Aksen Garis Emas Tipis pada Keempat Sudut Kartu */}
            <div className="absolute top-3.5 left-3.5 w-6 h-6 border-t border-l border-[#D6B878]/40 rounded-tl-sm pointer-events-none select-none z-10" />
            <div className="absolute top-3.5 right-3.5 w-6 h-6 border-t border-r border-[#D6B878]/40 rounded-tr-sm pointer-events-none select-none z-10" />
            <div className="absolute bottom-3.5 left-3.5 w-6 h-6 border-b border-l border-[#D6B878]/40 rounded-bl-sm pointer-events-none select-none z-10" />
            <div className="absolute bottom-3.5 right-3.5 w-6 h-6 border-b border-r border-[#D6B878]/40 rounded-br-sm pointer-events-none select-none z-10" />

            {/* Mahkota Puncak Bintang 8 Halus di Atas Kartu */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center pointer-events-none select-none z-10">
              <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#D6B878]/40" />
              <div className="w-5 h-5 rounded-full bg-[#1A5442] border border-[#D6B878]/40 flex items-center justify-center -translate-y-1/2 shadow-xs">
                <EightPointStarIcon className="w-2.5 h-2.5 text-[#D6B878]" />
              </div>
              <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#D6B878]/40" />
            </div>

            {/* Konten Utama Kartu Ajakan Belajar */}
            <div className="relative z-10 p-9 sm:p-12 lg:p-14 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                Ilmu adalah perjalanan.
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Mulai satu langkah hari ini.
              </p>
              <Link
                href="/dashboard"
                className="group/btn inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-primary rounded-xl font-semibold shadow-lg shadow-black/10 hover:bg-[#F8F7F2] hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
              >
                <span>Mulai Belajar</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-200 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
