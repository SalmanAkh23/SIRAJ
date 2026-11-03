"use client";

import React from "react";

export type BookVariant = "doa" | "dzikir";

interface IslamicBookCoverProps {
  variant: BookVariant;
  onClick?: () => void;
  className?: string;
  size?: "md" | "lg";
  isInteractive?: boolean;
}

/**
 * Komponen Buku Islami Digital SIRAJ.
 * Menampilkan buku 3D realistis dengan tekstur sampul, punggung buku (spine),
 * halaman kertas bertumpuk, pita pembatas sutra, ornamen geometris Islami,
 * dan aksen garis emas tipis murni menggunakan CSS dan SVG vektor.
 */
export default function IslamicBookCover({
  variant,
  onClick,
  className = "",
  size = "lg",
  isInteractive = true,
}: IslamicBookCoverProps) {
  const isDoa = variant === "doa";

  // Palette warna sesuai spesifikasi
  // Doa: Dominan hijau (#174A3A) dan krem (#F8F7F2) dengan aksen emas (#D6B878)
  // Dzikir: Dominan hijau gelap (#0E2820 / #103830) dengan aksen emas berkilau (#D6B878)
  const colors = isDoa
    ? {
        spineBg: "linear-gradient(180deg, #103429 0%, #174A3A 50%, #0d2c22 100%)",
        coverBg: "linear-gradient(145deg, #174A3A 0%, #1d5846 45%, #154234 100%)",
        centerPanelBg: "linear-gradient(180deg, #FAF8F2 0%, #F5F1E6 100%)",
        goldPrimary: "#D6B878",
        goldLight: "#F2E4BE",
        goldDark: "#A88846",
        goldBorder: "rgba(214, 184, 120, 0.75)",
        goldHairline: "rgba(214, 184, 120, 0.45)",
        ribbonColor: "#D6B878",
        ribbonDark: "#B8964E",
        title: "Kumpulan Doa",
        subtitle: "Doa sehari-hari dari Al-Qur’an dan Sunnah",
        arabicTitle: "كِتَابُ الدُّعَاءِ",
        arabicCalligraphySub: "أَدْعِيَةٌ مِنَ الْكِتَابِ وَالسُّنَّةِ",
        badge: "Pustaka Doa",
        glowColor: "rgba(23, 74, 58, 0.35)",
      }
    : {
        spineBg: "linear-gradient(180deg, #091c16 0%, #0d2822 50%, #081712 100%)",
        coverBg: "linear-gradient(145deg, #0d2822 0%, #12362e 40%, #0a1f1a 100%)",
        centerPanelBg: "linear-gradient(180deg, #103830 0%, #0c2b24 100%)",
        goldPrimary: "#DFCA8E",
        goldLight: "#FAF0D4",
        goldDark: "#B89445",
        goldBorder: "rgba(223, 202, 142, 0.85)",
        goldHairline: "rgba(223, 202, 142, 0.5)",
        ribbonColor: "#174A3A",
        ribbonDark: "#0d2822",
        title: "Kumpulan Dzikir",
        subtitle: "Dzikir harian dan setelah salat",
        arabicTitle: "كِتَابُ الذِّكْرِ",
        arabicCalligraphySub: "أَذْكَارُ الصَّبَاحِ وَالْمَسَاءِ وَالصَّلَاةِ",
        badge: "Pustaka Dzikir",
        glowColor: "rgba(214, 184, 120, 0.28)",
      };

  return (
    <div
      className={`group relative select-none ${isInteractive ? "cursor-pointer" : ""} ${className}`}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive && onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={`Buku ${colors.title}`}
      style={{ perspective: "1400px" }}
    >
      {/* Container 3D Buku dengan Efek Hover Smooth */}
      <div
        className={`relative transition-all duration-500 ease-out transform-gpu ${
          isInteractive
            ? "group-hover:-translate-y-3 group-hover:rotate-x-2 group-hover:-rotate-y-6 group-hover:scale-[1.02]"
            : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layer 1: Bayangan Lembut di Bawah Buku (Ambient Occlusion & Soft Drop Shadow) */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-75 blur-xl transition-all duration-500 pointer-events-none group-hover:opacity-100 group-hover:blur-2xl"
          style={{
            background: `radial-gradient(ellipse at 50% 85%, ${colors.glowColor} 0%, rgba(0,0,0,0.35) 60%, transparent 80%)`,
            transform: "translateZ(-30px)",
          }}
        />

        {/* Layer 2: Efek Halaman Kertas Bertumpuk di Sisi Kanan (Book Page Deckle Edge) */}
        <div
          className="absolute top-2.5 bottom-3.5 right-[-10px] w-4 rounded-r-sm pointer-events-none transition-transform duration-500"
          style={{
            background:
              "repeating-linear-gradient(to bottom, #f5f2e9, #f5f2e9 1px, #e7e2d3 2px, #f5f2e9 3px)",
            boxShadow:
              "inset -1px 0 2px rgba(0,0,0,0.15), 2px 3px 5px rgba(0,0,0,0.22)",
            transform: "rotateY(45deg) translateZ(-4px)",
          }}
        />

        {/* Layer 3: Pita Pembatas Sutra (Ribbon Bookmark) */}
        <div
          className="absolute -bottom-4 right-10 w-4 h-9 pointer-events-none z-20 transition-transform duration-500 group-hover:translate-y-1"
          style={{
            background: `linear-gradient(180deg, ${colors.ribbonColor} 0%, ${colors.ribbonDark} 100%)`,
            boxShadow: "0 3px 6px rgba(0,0,0,0.35)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)",
          }}
        />

        {/* Layer 4: Badan Utama Buku (Hardcover) */}
        <div
          className="relative rounded-r-xl rounded-l-[4px] overflow-hidden flex flex-row shadow-2xl border border-black/20"
          style={{
            background: colors.coverBg,
            boxShadow:
              "-6px 14px 28px -4px rgba(0, 0, 0, 0.45), 0 10px 20px -5px rgba(23, 74, 58, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Sisi Kiri: Punggung Buku (Spine) dengan Efek Tekukan 3D & Emboss Garis Emas */}
          <div
            className="w-6 sm:w-7 shrink-0 relative flex flex-col justify-between py-6 items-center z-10"
            style={{
              background: colors.spineBg,
              boxShadow:
                "inset -2px 0 4px rgba(0,0,0,0.6), inset 2px 0 3px rgba(255,255,255,0.12), 3px 0 6px rgba(0,0,0,0.35)",
            }}
          >
            {/* Alur Tekukan Buku (Groove Hinge) */}
            <div
              className="absolute top-0 bottom-0 right-0 w-[2px]"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.5), rgba(255,255,255,0.15))",
              }}
            />

            {/* Pita/Pita Tulang Punggung Atas (Spine Rib Band) */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D6B878] to-transparent opacity-75 shadow-sm" />

            {/* Inisial Vertikal / Simbol SIRAJ */}
            <div className="rotate-90 text-[10px] tracking-widest font-semibold text-[#D6B878]/80 whitespace-nowrap uppercase">
              SIRAJ
            </div>

            {/* Pita Tulang Punggung Bawah */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D6B878] to-transparent opacity-75 shadow-sm" />
          </div>

          {/* Sisi Tengah & Depan: Sampul Muka Buku (Front Cover Face) */}
          <div
            className={`flex-1 relative flex flex-col justify-between p-5 sm:p-7 ${
              size === "lg" ? "min-h-[420px] sm:min-h-[460px]" : "min-h-[360px]"
            }`}
          >
            {/* Background Texture & Motif Geometris Halus (SVG Tessellation Overlay) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23D6B878' fill-opacity='0.6' d='M24 0l6 18h18l-15 10 6 18-15-11-15 11 6-18-15-10h18z'/%3E%3C/svg%3E")`,
                backgroundSize: "36px 36px",
              }}
            />

            {/* Kilauan Cahaya Diagonal (Cover Sheen Effect saat Hover) */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-20 group-hover:opacity-40"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 30%, transparent 50%, rgba(214,184,120,0.18) 75%, transparent 100%)",
              }}
            />

            {/* Bingkai Luar Emas (Gold Foil Framing with Corner Accents) */}
            <div
              className="absolute inset-3 sm:inset-4 rounded-lg pointer-events-none"
              style={{
                border: `1.5px solid ${colors.goldBorder}`,
                boxShadow: `inset 0 0 0 1px ${colors.goldHairline}, 0 0 8px rgba(214, 184, 120, 0.2)`,
              }}
            >
              {/* Sudut Hiasan Islami 8 Bintang (Corner Stars) */}
              <div
                className="absolute -top-1 -left-1 w-2.5 h-2.5 rotate-45"
                style={{ backgroundColor: colors.goldPrimary }}
              />
              <div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rotate-45"
                style={{ backgroundColor: colors.goldPrimary }}
              />
              <div
                className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rotate-45"
                style={{ backgroundColor: colors.goldPrimary }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rotate-45"
                style={{ backgroundColor: colors.goldPrimary }}
              />
            </div>

            {/* Bagian Atas Sampul: Header Ornamen & Kaligrafi Arab */}
            <div className="relative z-10 text-center pt-2 sm:pt-3">
              {/* Ornamen Mihrab / Lengkungan Islami Atas */}
              <div className="flex justify-center mb-2">
                <svg
                  width="130"
                  height="26"
                  viewBox="0 0 130 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-90"
                >
                  <path
                    d="M5 21C25 7 40 4 65 4C90 4 105 7 125 21"
                    stroke={colors.goldPrimary}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 24C30 13 45 9 65 9C85 9 100 13 115 24"
                    stroke={colors.goldLight}
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                  />
                  <polygon
                    points="65,0 67,4 71,6 67,8 65,12 63,8 59,6 63,4"
                    fill={colors.goldLight}
                  />
                  <circle cx="28" cy="18" r="1.5" fill={colors.goldPrimary} />
                  <circle cx="102" cy="18" r="1.5" fill={colors.goldPrimary} />
                </svg>
              </div>

              {/* Teks Arab Kaligrafi Judul Kitab */}
              <div
                className="font-arabic text-2xl sm:text-3xl leading-snug tracking-normal drop-shadow-sm"
                style={{
                  color: isDoa ? "#F8F7F2" : colors.goldLight,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
                dir="rtl"
              >
                {colors.arabicTitle}
              </div>

              {/* Garis Pembatas Halus Emas */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div
                  className="h-[1px] w-12"
                  style={{
                    background: `linear-gradient(to right, transparent, ${colors.goldPrimary})`,
                  }}
                />
                <div
                  className="w-1.5 h-1.5 rotate-45"
                  style={{ backgroundColor: colors.goldLight }}
                />
                <div
                  className="h-[1px] w-12"
                  style={{
                    background: `linear-gradient(to left, transparent, ${colors.goldPrimary})`,
                  }}
                />
              </div>
            </div>

            {/* Bagian Tengah Sampul: Medallion Islami / Shamsah (Ornamen Utama) */}
            <div className="relative z-10 flex flex-col items-center justify-center my-3 sm:my-4">
              {isDoa ? (
                /* Medallion Buku Doa: Perpaduan Krem & Emas dengan Kubah Mihrab Arabesque */
                <div className="relative flex items-center justify-center">
                  {/* Lingkaran Luar dengan Bayangan Halus */}
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 flex items-center justify-center shadow-lg"
                    style={{
                      background: colors.centerPanelBg,
                      border: `2px solid ${colors.goldPrimary}`,
                      boxShadow:
                        "0 6px 16px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.7)",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Bintang 8 Sudut (Khatim) */}
                      <rect
                        x="22"
                        y="22"
                        width="56"
                        height="56"
                        stroke={colors.goldDark}
                        strokeWidth="1.2"
                        fill="rgba(23, 74, 58, 0.05)"
                      />
                      <rect
                        x="22"
                        y="22"
                        width="56"
                        height="56"
                        stroke={colors.goldDark}
                        strokeWidth="1.2"
                        transform="rotate(45 50 50)"
                        fill="rgba(23, 74, 58, 0.05)"
                      />
                      {/* Lingkaran Pusat & Motif Daun Palmet Arabesque */}
                      <circle
                        cx="50"
                        cy="50"
                        r="20"
                        stroke={colors.goldPrimary}
                        strokeWidth="1.5"
                        fill="#174A3A"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="16"
                        stroke={colors.goldLight}
                        strokeWidth="0.8"
                        strokeDasharray="2 2"
                      />
                      {/* Simbol Pelita / Doa Bersinar di Pusat */}
                      <path
                        d="M50 38C46 43 45 47 45 50C45 53 47 55 50 55C53 55 55 53 55 50C55 47 54 43 50 38Z"
                        fill={colors.goldLight}
                      />
                      <circle cx="50" cy="50" r="2" fill="#FAF0D4" />
                    </svg>
                  </div>
                </div>
              ) : (
                /* Medallion Buku Dzikir: Geometri Islam Murni 8-Bintang Emas Bersinar (Rub el Hizb) */
                <div className="relative flex items-center justify-center">
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 flex items-center justify-center shadow-xl"
                    style={{
                      background: colors.centerPanelBg,
                      border: `2px solid ${colors.goldPrimary}`,
                      boxShadow:
                        "0 8px 20px rgba(0,0,0,0.45), inset 0 0 14px rgba(223, 202, 142, 0.25)",
                    }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Bintang Geometris Luar */}
                      <rect
                        x="20"
                        y="20"
                        width="60"
                        height="60"
                        stroke={colors.goldPrimary}
                        strokeWidth="1.5"
                        fill="rgba(223, 202, 142, 0.08)"
                      />
                      <rect
                        x="20"
                        y="20"
                        width="60"
                        height="60"
                        stroke={colors.goldPrimary}
                        strokeWidth="1.5"
                        transform="rotate(45 50 50)"
                        fill="rgba(223, 202, 142, 0.08)"
                      />
                      {/* Bintang Geometris Dalam */}
                      <rect
                        x="28"
                        y="28"
                        width="44"
                        height="44"
                        stroke={colors.goldLight}
                        strokeWidth="1"
                      />
                      <rect
                        x="28"
                        y="28"
                        width="44"
                        height="44"
                        stroke={colors.goldLight}
                        strokeWidth="1"
                        transform="rotate(45 50 50)"
                      />
                      {/* Lingkaran Mahkota Tasbih */}
                      <circle
                        cx="50"
                        cy="50"
                        r="14"
                        stroke={colors.goldPrimary}
                        strokeWidth="1.5"
                        fill="#0A1F1A"
                      />
                      {/* Butir-butir Tasbih Kecil di Sekeliling Pusat */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const cx = 50 + 10 * Math.cos(rad);
                        const cy = 50 + 10 * Math.sin(rad);
                        return (
                          <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r="1.2"
                            fill={colors.goldLight}
                          />
                        );
                      })}
                      <circle cx="50" cy="50" r="3" fill={colors.goldLight} />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Bagian Bawah Sampul: Judul Jelas, Subjudul & Identitas SIRAJ */}
            <div className="relative z-10 text-center pb-2">
              {/* Judul Utama Sampul (Sesuai Permintaan Spesifikasi) */}
              <h3
                className="text-lg sm:text-xl font-bold tracking-wide uppercase drop-shadow-sm font-sans"
                style={{
                  color: isDoa ? "#FFFFFF" : colors.goldLight,
                  textShadow: "0 2px 5px rgba(0,0,0,0.6)",
                }}
              >
                {colors.title}
              </h3>

              {/* Subjudul Jelas (Sesuai Permintaan Spesifikasi) */}
              <p
                className="text-xs sm:text-[13px] font-medium leading-relaxed mt-1 max-w-[220px] mx-auto opacity-90"
                style={{
                  color: isDoa ? "#F8F7F2" : "#E2DCB8",
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {colors.subtitle}
              </p>

              {/* Label Penerbit & Identitas SIRAJ */}
              <div className="mt-4 pt-3 border-t border-[#D6B878]/25 flex items-center justify-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#D6B878]/80 uppercase">
                <span>SIRAJ</span>
                <span>•</span>
                <span>KITAB DIGITAL</span>
              </div>
            </div>

            {/* Tombol Interaktif Melayang saat Hover */}
            {isInteractive && (
              <div className="absolute inset-x-6 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-white/95 text-primary text-xs font-semibold py-2 px-4 rounded-full text-center shadow-lg border border-[#D6B878]/50 flex items-center justify-center gap-1.5 backdrop-blur-sm">
                  <span>Buka {colors.title}</span>
                  <span className="text-[#D6B878] font-bold">→</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
