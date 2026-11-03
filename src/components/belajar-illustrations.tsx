"use client";

import React from "react";

interface MateriThumbnailProps {
  materiId: string;
  category?: string;
  className?: string;
}

/**
 * Ilustrasi Utama Hero Halaman Belajar Islam:
 * Menampilkan lengkungan mihrab elegan, siluet kubah masjid & menara
 * dengan suasana pagi yang tenang, lentera gantung, dan geometri Islami.
 */
export function BelajarHeroIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 460 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          {/* Langit pagi yang hangat dan tenang */}
          <linearGradient id="heroSkyGrad" x1="230" y1="10" x2="230" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9F4E8" />
            <stop offset="45%" stopColor="#F2E4C6" />
            <stop offset="80%" stopColor="#DCE8E1" />
            <stop offset="100%" stopColor="#C4DBD1" />
          </linearGradient>

          {/* Cahaya matahari pagi */}
          <radialGradient id="morningSunGlow" cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#F4DFA8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#D6B878" stopOpacity="0" />
          </radialGradient>

          {/* Gradasi hijau masjid utama */}
          <linearGradient id="mosquePrimaryGrad" x1="230" y1="90" x2="230" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#245C52" />
            <stop offset="55%" stopColor="#174A3A" />
            <stop offset="100%" stopColor="#103830" />
          </linearGradient>

          {/* Gradasi siluet masjid belakang */}
          <linearGradient id="mosqueBackGrad" x1="230" y1="120" x2="230" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#729B8E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3B6E62" stopOpacity="0.65" />
          </linearGradient>

          {/* Gradasi emas */}
          <linearGradient id="goldAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECD59E" />
            <stop offset="50%" stopColor="#D6B878" />
            <stop offset="100%" stopColor="#B6934C" />
          </linearGradient>

          {/* Clip Path Mihrab Arch */}
          <clipPath id="mihrabArchClip">
            <path d="M56 300V148C56 76 135 28 230 14C325 28 404 76 404 148V300H56Z" />
          </clipPath>
        </defs>

        {/* Ornamen Geometri Sudut Luar (Opacity Rendah) */}
        <g opacity="0.28" stroke="#D6B878" strokeWidth="1">
          <circle cx="70" cy="54" r="26" strokeDasharray="3 3" />
          <rect x="52" y="36" width="36" height="36" transform="rotate(45 70 54)" />
          <circle cx="390" cy="54" r="26" strokeDasharray="3 3" />
          <rect x="372" y="36" width="36" height="36" transform="rotate(45 390 54)" />
        </g>

        {/* Grup Dalam Lengkungan Mihrab */}
        <g clipPath="url(#mihrabArchClip)">
          {/* Latar Langit Pagi */}
          <rect x="40" y="10" width="380" height="295" fill="url(#heroSkyGrad)" />

          {/* Pendaran Matahari Pagi */}
          <circle cx="230" cy="135" r="135" fill="url(#morningSunGlow)" />
          <circle cx="230" cy="135" r="46" fill="#FFFDF6" fillOpacity="0.85" />

          {/* Awan Pagi Lembut */}
          <g fill="#FFFFFF" fillOpacity="0.55">
            <path d="M85 118C85 111 91 106 98 106C101 99 109 95 117 97C124 91 135 94 139 102C146 103 151 108 151 115C151 120 146 124 140 124H93C88 124 85 121 85 118Z" />
            <path d="M318 98C318 92 323 88 329 88C332 82 339 79 346 81C352 76 361 78 364 85C370 86 374 90 374 96C374 100 370 104 365 104H325C321 104 318 101 318 98Z" />
          </g>

          {/* Bukit & Siluet Kota Jauh */}
          <path
            d="M40 245C105 220 165 218 230 228C295 238 355 215 420 232V300H40V245Z"
            fill="#A6C4B9"
            fillOpacity="0.55"
          />

          {/* Siluet Kubah & Bangunan Latar Belakang */}
          <g fill="url(#mosqueBackGrad)">
            <path d="M92 250V195H136V250H92Z" />
            <path d="M94 195C94 176 114 164 114 156C114 164 134 176 134 195H94Z" />
            <path d="M324 250V192H368V250H324Z" />
            <path d="M326 192C326 173 346 161 346 153C346 161 366 173 366 192H326Z" />
            {/* Menara Jauh Kiri & Kanan */}
            <rect x="74" y="152" width="10" height="98" />
            <path d="M73 152L79 135L85 152H73Z" />
            <rect x="376" y="152" width="10" height="98" />
            <path d="M375 152L381 135L387 152H375Z" />
          </g>

          {/* Kompleks Masjid Utama */}
          <g>
            {/* Menara Utama Kiri */}
            <rect x="128" y="118" width="16" height="145" fill="#1D5344" />
            <rect x="125" y="142" width="22" height="5" rx="2" fill="#D6B878" />
            <rect x="126" y="182" width="20" height="4" rx="1.5" fill="#D6B878" fillOpacity="0.7" />
            <path d="M128 118C128 104 136 94 136 86C136 94 144 104 144 118H128Z" fill="#245C52" />
            <line x1="136" y1="86" x2="136" y2="75" stroke="#D6B878" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="136" cy="79" r="2" fill="#D6B878" />

            {/* Menara Utama Kanan */}
            <rect x="316" y="118" width="16" height="145" fill="#1D5344" />
            <rect x="313" y="142" width="22" height="5" rx="2" fill="#D6B878" />
            <rect x="314" y="182" width="20" height="4" rx="1.5" fill="#D6B878" fillOpacity="0.7" />
            <path d="M316 118C316 104 324 94 324 86C324 94 332 104 332 118H316Z" fill="#245C52" />
            <line x1="324" y1="86" x2="324" y2="75" stroke="#D6B878" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="324" cy="79" r="2" fill="#D6B878" />

            {/* Kubah Samping Kiri */}
            <path d="M150 205C150 181 174 167 174 155C174 167 198 181 198 205H150Z" fill="#245C52" />
            <line x1="174" y1="155" x2="174" y2="146" stroke="#D6B878" strokeWidth="1.5" />

            {/* Kubah Samping Kanan */}
            <path d="M262 205C262 181 286 167 286 155C286 167 310 181 310 205H262Z" fill="#245C52" />
            <line x1="286" y1="155" x2="286" y2="146" stroke="#D6B878" strokeWidth="1.5" />

            {/* Kubah Utama Tengah */}
            <path
              d="M180 202C180 156 230 132 230 106C230 132 280 156 280 202H180Z"
              fill="url(#mosquePrimaryGrad)"
            />
            {/* Garis Rusuk Kubah Emas Halus */}
            <path
              d="M230 108C212 138 202 166 202 202M230 108C248 138 258 166 258 202M230 108V202"
              stroke="#D6B878"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            {/* Bulan Sabit Finial Kubah Utama */}
            <line x1="230" y1="106" x2="230" y2="88" stroke="#D6B878" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="230" cy="96" r="2.8" fill="#D6B878" />
            <path
              d="M234 83C231.5 85 227.5 84.5 226 81.5C224.5 78.5 226 74.5 229 73C226.5 75.5 227 79 229.5 81C231.5 82.5 233 82.5 234 83Z"
              fill="#D6B878"
            />

            {/* Badan Bangunan Masjid & Arkade Mihrab */}
            <rect x="138" y="200" width="184" height="72" fill="#174A3A" />
            <rect x="138" y="200" width="184" height="4" fill="#D6B878" fillOpacity="0.8" />

            {/* Jendela-jendela Lengkung Bercahaya Hangat */}
            {[156, 180, 266, 290].map((x) => (
              <path
                key={x}
                d={`M${x} 246V222C${x} 216 ${x + 7} 212 ${x + 7} 210C${x + 7} 212 ${x + 14} 216 ${x + 14} 222V246H${x}Z`}
                fill="#F5E1B2"
                fillOpacity="0.85"
              />
            ))}

            {/* Pintu Gerbang Mihrab Tengah */}
            <path
              d="M212 268V225C212 213 230 206 230 202C230 206 248 213 248 225V268H212Z"
              fill="#D6B878"
            />
            <path
              d="M216 268V227C216 217 230 211 230 207C230 211 244 217 244 227V268H216Z"
              fill="#FFF6DE"
            />
          </g>

          {/* Pepohonan Cypress & Kurma di Pelataran */}
          <g fill="#103830">
            <path d="M40 272C95 256 165 254 230 258C295 262 365 254 420 268V305H40V272Z" />
            {/* Siluet Pohon Cypress Kiri & Kanan */}
            <path d="M106 264C106 234 113 212 113 212C113 212 120 234 120 264H106Z" fill="#143F32" />
            <path d="M88 268C88 244 94 226 94 226C94 226 100 244 100 268H88Z" fill="#174A3A" />
            <path d="M342 264C342 234 349 212 349 212C349 212 356 234 356 264H342Z" fill="#143F32" />
            <path d="M362 268C362 244 368 226 368 226C368 226 374 244 374 268H362Z" fill="#174A3A" />
          </g>

          {/* Halaman & Tangga Pelataran */}
          <path d="M196 260L178 300H282L264 260H196Z" fill="#D6B878" fillOpacity="0.35" />
          <line x1="40" y1="282" x2="420" y2="282" stroke="#D6B878" strokeWidth="1" strokeOpacity="0.4" />

          {/* Lentera Gantung Islami Kiri & Kanan */}
          <g>
            {/* Lentera Kiri */}
            <line x1="115" y1="32" x2="115" y2="68" stroke="#B6934C" strokeWidth="1.2" />
            <path d="M108 74L115 66L122 74V88L115 95L108 88V74Z" fill="#174A3A" stroke="#D6B878" strokeWidth="1.3" />
            <circle cx="115" cy="81" r="4" fill="#FFF3C4" />
            {/* Lentera Kanan */}
            <line x1="345" y1="32" x2="345" y2="64" stroke="#B6934C" strokeWidth="1.2" />
            <path d="M338 70L345 62L352 70V84L345 91L338 84V70Z" fill="#174A3A" stroke="#D6B878" strokeWidth="1.3" />
            <circle cx="345" cy="77" r="4" fill="#FFF3C4" />
          </g>

          {/* Burung Terbang di Pagi Hari */}
          <g stroke="#245C52" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            <path d="M168 88C171 84 175 84 178 88C181 84 185 84 188 88" />
            <path d="M188 76C190 73 193 73 195 76C197 73 200 73 202 76" />
            <path d="M276 82C279 79 282 79 285 82C288 79 291 79 294 82" />
          </g>
        </g>

        {/* Bingkai Lengkungan Mihrab Emas Ganda */}
        <path
          d="M56 300V148C56 76 135 28 230 14C325 28 404 76 404 148V300H56Z"
          stroke="url(#goldAccentGrad)"
          strokeWidth="2.5"
        />
        <path
          d="M64 294V150C64 82 139 36 230 22C321 36 396 82 396 150V294H64Z"
          stroke="#D6B878"
          strokeWidth="1"
          strokeOpacity="0.55"
          strokeDasharray="4 4"
        />

        {/* Ornamen Puncak Mihrab */}
        <circle cx="230" cy="14" r="5" fill="#D6B878" />
        <circle cx="230" cy="14" r="2" fill="#FFFDF7" />
      </svg>
    </div>
  );
}

/**
 * Ilustrasi Kartu Materi Populer berdasarkan ID materi:
 * - rukun-iman: Al-Qur'an / Kitab di atas rehal kayu dengan cahaya lentera
 * - thaharah: Teko wudhu emas, air pancuran suci, dan teratai
 * - akhlak-rasulullah: Kubah hijau Masjid Nabawi, mihrab, dan merpati
 * - sejarah-nabi: Lanskap gurun pasir keemasan, pohon kurma, dan perjalanan menuju kota suci
 * - adab-makan: Hidangan kurma, teko air/teh, dan buah di atas nampan
 * - tafsir-al-fatihah: Mushaf Al-Qur'an terbuka bercahaya dengan ornamen emas
 */
export function MateriThumbnail({ materiId, className = "" }: MateriThumbnailProps) {
  switch (materiId) {
    case "rukun-iman":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#174A3A] via-[#1E5646] to-[#245C52] ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Pola Bintang Latar */}
            <g opacity="0.12" stroke="#D6B878" strokeWidth="1">
              <circle cx="110" cy="76" r="64" />
              <rect x="66" y="32" width="88" height="88" />
              <rect x="66" y="32" width="88" height="88" transform="rotate(45 110 76)" />
            </g>
            {/* Lengkungan Mihrab Dalam */}
            <path
              d="M32 180V82C32 42 68 18 110 10C152 18 188 42 188 82V180"
              stroke="#D6B878"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              fill="#F8F7F2"
              fillOpacity="0.06"
            />
            {/* Cahaya Ilmu */}
            <circle cx="110" cy="82" r="48" fill="#D6B878" fillOpacity="0.18" />
            <circle cx="110" cy="82" r="28" fill="#FFF6DC" fillOpacity="0.22" />

            {/* Lentera Gantung */}
            <line x1="110" y1="10" x2="110" y2="34" stroke="#D6B878" strokeWidth="1.5" />
            <path d="M102 40L110 32L118 40V54L110 61L102 54V40Z" fill="#D6B878" fillOpacity="0.9" />
            <circle cx="110" cy="47" r="4.5" fill="#FFFDF7" />

            {/* Rehal (Penyangga Kayu) */}
            <path d="M68 148L110 120L152 148L145 156L110 131L75 156L68 148Z" fill="#A67B44" />
            <path d="M74 124L110 136L146 124V131L110 144L74 131V124Z" fill="#8C6230" />

            {/* Kitab / Mushaf Terbuka */}
            <path
              d="M56 96C76 92 96 98 110 108C124 98 144 92 164 96V128C144 124 124 130 110 140C96 130 76 124 56 128V96Z"
              fill="#F8F7F2"
              stroke="#D6B878"
              strokeWidth="2"
            />
            {/* Garis Halaman & Ornamen Mushaf */}
            <line x1="110" y1="108" x2="110" y2="140" stroke="#D6B878" strokeWidth="1.5" />
            <circle cx="84" cy="112" r="8" stroke="#174A3A" strokeWidth="1.2" fill="#D6B878" fillOpacity="0.25" />
            <circle cx="136" cy="112" r="8" stroke="#174A3A" strokeWidth="1.2" fill="#D6B878" fillOpacity="0.25" />
            <line x1="68" y1="122" x2="98" y2="125" stroke="#245C52" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="122" y1="125" x2="152" y2="122" stroke="#245C52" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      );

    case "thaharah":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#E7F1EC] via-[#D4E6DF] to-[#B8D4CA] ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Bingkai Lengkung Mihrab */}
            <path
              d="M28 180V78C28 40 66 16 110 10C154 16 192 40 192 78V180"
              fill="#F8F7F2"
              fillOpacity="0.65"
              stroke="#245C52"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            {/* Lingkaran Cahaya */}
            <circle cx="115" cy="78" r="46" fill="#FFFFFF" fillOpacity="0.7" />

            {/* Teko Wudhu Tradisional (Ibrik Emas) */}
            <g>
              {/* Badan Teko */}
              <path
                d="M72 86C72 70 84 60 96 60C108 60 120 70 120 86C120 100 108 108 96 108C84 108 72 100 72 86Z"
                fill="#D6B878"
                stroke="#174A3A"
                strokeWidth="1.6"
              />
              {/* Leher & Tutup Teko */}
              <path d="M88 60L91 44H101L104 60H88Z" fill="#C5A35E" stroke="#174A3A" strokeWidth="1.5" />
              <path d="M90 44C90 38 96 34 96 34C96 34 102 38 102 44H90Z" fill="#174A3A" />
              {/* Gagang Teko */}
              <path
                d="M74 72C62 72 58 84 66 94C70 98 74 98 76 96"
                stroke="#174A3A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Corong Teko (Spout) */}
              <path
                d="M118 78C130 74 136 64 144 62"
                stroke="#174A3A"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* Aliran Air Suci & Tetesan Air */}
            <path
              d="M145 64C152 78 152 98 146 118"
              stroke="#245C52"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1 0"
            />
            <path
              d="M149 72C155 86 155 102 150 118"
              stroke="#5FA898"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Tetesan Air */}
            <path d="M162 84C162 84 157 91 157 94C157 97 159 99 162 99C165 99 167 97 167 94C167 91 162 84 162 84Z" fill="#245C52" fillOpacity="0.7" />
            <path d="M134 96C134 96 130 102 130 104C130 106 132 108 134 108C136 108 138 106 138 104C138 102 134 96 134 96Z" fill="#5FA898" />

            {/* Kolam / Bejana Air Bawah */}
            <ellipse cx="116" cy="134" rx="56" ry="14" fill="#245C52" />
            <ellipse cx="116" cy="132" rx="50" ry="11" fill="#7BC0B1" />
            {/* Riak Air */}
            <ellipse cx="144" cy="132" rx="16" ry="4" stroke="#FFFFFF" strokeWidth="1.4" />
            <ellipse cx="144" cy="132" rx="8" ry="2" stroke="#FFFFFF" strokeWidth="1.2" />

            {/* Daun Hijau & Bunga Melati */}
            <path d="M46 126C56 116 68 118 74 128C62 132 52 132 46 126Z" fill="#174A3A" />
            <circle cx="66" cy="122" r="5" fill="#FFFFFF" stroke="#D6B878" strokeWidth="1.2" />
          </svg>
        </div>
      );

    case "akhlak-rasulullah":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#F6EFE0] via-[#EDE1C7] to-[#DFCFAF] ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Matahari Hangat */}
            <circle cx="110" cy="74" r="52" fill="#FFFDF7" fillOpacity="0.75" />
            <circle cx="110" cy="74" r="36" fill="#F5DFAC" fillOpacity="0.6" />

            {/* Lengkungan Mihrab */}
            <path
              d="M28 180V74C28 38 66 16 110 8C154 16 192 38 192 74V180"
              stroke="#D6B878"
              strokeWidth="2"
            />

            {/* Kubah Hijau Masjid Nabawi */}
            <path
              d="M68 132C68 96 110 76 110 54C110 76 152 96 152 132H68Z"
              fill="#174A3A"
            />
            <path
              d="M110 56C96 80 88 104 88 132M110 56C124 80 132 104 132 132"
              stroke="#245C52"
              strokeWidth="1.5"
            />
            {/* Finial Emas Kubah */}
            <line x1="110" y1="54" x2="110" y2="38" stroke="#B6934C" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="110" cy="45" r="2.8" fill="#D6B878" />

            {/* Menara Samping */}
            <rect x="48" y="76" width="12" height="64" fill="#245C52" />
            <path d="M48 76L54 60L60 76H48Z" fill="#174A3A" />
            <rect x="46" y="92" width="16" height="4" rx="1.5" fill="#D6B878" />

            <rect x="160" y="76" width="12" height="64" fill="#245C52" />
            <path d="M160 76L166 60L172 76H160Z" fill="#174A3A" />
            <rect x="158" y="92" width="16" height="4" rx="1.5" fill="#D6B878" />

            {/* Dinding & Pelataran Masjid */}
            <rect x="42" y="130" width="136" height="50" fill="#245C52" />
            <rect x="42" y="130" width="136" height="4" fill="#D6B878" />

            {/* Pintu Lengkung Deret */}
            {[60, 86, 112, 138].map((x) => (
              <path
                key={x}
                d={`M${x} 168V146C${x} 140 ${x + 10} 136 ${x + 10} 136C${x + 10} 136 ${x + 20} 140 ${x + 20} 146V168H${x}Z`}
                fill="#F8F7F2"
                fillOpacity="0.9"
              />
            ))}

            {/* Burung Merpati Putih */}
            <path d="M74 48C77 44 81 44 84 48C87 44 91 44 94 48" stroke="#174A3A" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M134 42C137 39 140 39 143 42C146 39 149 39 152 42" stroke="#174A3A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "sejarah-nabi":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-b from-[#F5E6C8] via-[#E8CFA1] to-[#D4B075] ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Matahari Gurun & Bintang */}
            <circle cx="154" cy="52" r="24" fill="#FFF9E6" fillOpacity="0.9" />
            <circle cx="154" cy="52" r="36" fill="#FFF9E6" fillOpacity="0.3" />

            {/* Siluet Kota Bercahaya di Kejauhan */}
            <g fill="#245C52" opacity="0.75">
              <rect x="64" y="88" width="44" height="24" />
              <path d="M72 88C72 76 86 68 86 62C86 68 100 76 100 88H72Z" />
              <rect x="54" y="70" width="6" height="42" />
            </g>

            {/* Bukit Pasir Berlapis (Sand Dunes) */}
            <path
              d="M0 122C48 102 92 104 140 118C174 128 198 122 220 114V180H0V122Z"
              fill="#C79E5C"
            />
            <path
              d="M0 142C62 128 118 112 220 132V180H0V142Z"
              fill="#174A3A"
            />

            {/* Jejak Perjalanan Cahaya Emas */}
            <path
              d="M90 112C112 124 82 142 118 178"
              stroke="#F8F7F2"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Pohon Kurma di Bukit */}
            <g>
              <path d="M168 136C166 112 170 92 174 78" stroke="#103830" strokeWidth="4" strokeLinecap="round" />
              <path d="M174 78C160 72 148 76 142 84" stroke="#174A3A" strokeWidth="3" strokeLinecap="round" />
              <path d="M174 78C164 64 152 62 144 66" stroke="#174A3A" strokeWidth="3" strokeLinecap="round" />
              <path d="M174 78C186 66 198 68 204 76" stroke="#174A3A" strokeWidth="3" strokeLinecap="round" />
              <path d="M174 78C188 76 198 82 202 92" stroke="#174A3A" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      );

    case "adab-makan":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#F7F2E7] via-[#EFE5D0] to-[#E2D2B5] ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Lengkungan Mihrab Latar */}
            <path
              d="M30 180V74C30 38 66 16 110 10C154 16 190 38 190 74V180"
              fill="#174A3A"
              fillOpacity="0.06"
              stroke="#D6B878"
              strokeWidth="1.5"
            />

            {/* Nampan Hidangan Emas (Brass Tray) */}
            <ellipse cx="110" cy="138" rx="68" ry="16" fill="#B8944E" />
            <ellipse cx="110" cy="135" rx="64" ry="14" fill="#DFC488" stroke="#174A3A" strokeWidth="1.5" />

            {/* Teko Dallah / Air Zamzam di Kiri */}
            <g>
              <path
                d="M66 130L72 90H94L100 130H66Z"
                fill="#174A3A"
                stroke="#D6B878"
                strokeWidth="1.5"
              />
              <path d="M74 90C74 78 83 72 83 66C83 72 92 78 92 90H74Z" fill="#245C52" />
              <circle cx="83" cy="64" r="3" fill="#D6B878" />
              {/* Corong & Gagang Dallah */}
              <path d="M96 100C106 96 110 88 114 82" stroke="#D6B878" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M70 96C60 96 58 110 68 118" stroke="#D6B878" strokeWidth="2.4" strokeLinecap="round" />
            </g>

            {/* Mangkuk Kurma di Tengah-Kanan */}
            <g>
              {/* Buah Kurma */}
              <ellipse cx="126" cy="112" rx="7" ry="4.5" fill="#6E3B1E" />
              <ellipse cx="138" cy="110" rx="7" ry="4.5" fill="#854826" />
              <ellipse cx="148" cy="113" rx="7" ry="4.5" fill="#6E3B1E" />
              <ellipse cx="133" cy="106" rx="7" ry="4.5" fill="#592E16" />
              <ellipse cx="143" cy="107" rx="6.5" ry="4.5" fill="#854826" />
              {/* Mangkuk Keramik */}
              <path
                d="M114 114H160C158 128 148 134 137 134C126 134 116 128 114 114Z"
                fill="#245C52"
                stroke="#D6B878"
                strokeWidth="1.5"
              />
              <line x1="116" y1="120" x2="158" y2="120" stroke="#D6B878" strokeWidth="1.2" />
            </g>

            {/* Cangkir Minum */}
            <path d="M98 122H114L112 136H100L98 122Z" fill="#F8F7F2" stroke="#174A3A" strokeWidth="1.4" />
            {/* Uap Hangat */}
            <path d="M104 114C102 110 106 106 104 102" stroke="#245C52" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
            <path d="M109 116C107 112 111 108 109 104" stroke="#245C52" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      );

    case "tafsir-al-fatihah":
    default:
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[#103830] via-[#174A3A] to-[#245C52] ${className}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Sinar Cahaya Mushaf */}
            <circle cx="110" cy="92" r="62" fill="#D6B878" fillOpacity="0.14" />
            <circle cx="110" cy="92" r="42" fill="#D6B878" fillOpacity="0.22" />

            {/* Bingkai Ornamen Mihrab Emas */}
            <rect
              x="20"
              y="16"
              width="180"
              height="148"
              rx="12"
              stroke="#D6B878"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />

            {/* Rosette Bintang 8 Sudut di Atas Mushaf */}
            <g transform="translate(110, 44)">
              <rect x="-14" y="-14" width="28" height="28" stroke="#D6B878" strokeWidth="1.3" fill="#174A3A" />
              <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" stroke="#D6B878" strokeWidth="1.3" fill="#174A3A" />
              <circle cx="0" cy="0" r="6" fill="#D6B878" />
            </g>

            {/* Mushaf Al-Qur'an Terbuka Lebar */}
            <path
              d="M46 78C68 72 92 78 110 88C128 78 152 72 174 78V134C152 128 128 134 110 144C92 134 68 128 46 134V78Z"
              fill="#FAF7F0"
              stroke="#D6B878"
              strokeWidth="2.2"
            />
            {/* Bingkai Dalam Halaman Al-Fatihah */}
            <path
              d="M54 85C72 81 90 85 105 93V133C90 125 72 121 54 125V85Z"
              stroke="#D6B878"
              strokeWidth="1"
              fill="#D6B878"
              fillOpacity="0.08"
            />
            <path
              d="M166 85C148 81 130 85 115 93V133C130 125 148 121 166 125V85Z"
              stroke="#D6B878"
              strokeWidth="1"
              fill="#D6B878"
              fillOpacity="0.08"
            />
            <line x1="110" y1="88" x2="110" y2="144" stroke="#B8944E" strokeWidth="1.6" />

            {/* Baris-baris Ayat & Medali Emas */}
            {[95, 104, 113].map((y, idx) => (
              <g key={idx}>
                <line x1="62" y1={y} x2="98" y2={y + 3} stroke="#174A3A" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
                <line x1="122" y1={y + 3} x2="158" y2={y} stroke="#174A3A" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              </g>
            ))}
            <circle cx="50" cy="106" r="3" fill="#D6B878" />
            <circle cx="170" cy="106" r="3" fill="#D6B878" />
          </svg>
        </div>
      );
  }
}

/**
 * Ornamen Pembatas Siluet Kubah & Geometri Islami di Bagian Bawah Halaman
 */
export function IslamicFooterOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`relative select-none pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-12 sm:h-16"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="60" x2="1200" y2="60" stroke="#D6B878" strokeOpacity="0.4" strokeWidth="1" />
        <path
          d="M520 60C540 60 555 42 565 30C575 42 582 52 590 60H610C618 52 625 42 635 30C645 42 660 60 680 60"
          stroke="#D6B878"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <path
          d="M575 60C575 36 600 22 600 10C600 22 625 36 625 60H575Z"
          fill="#174A3A"
          fillOpacity="0.08"
          stroke="#D6B878"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <circle cx="600" cy="8" r="2.5" fill="#D6B878" />
        <circle cx="480" cy="60" r="3" fill="#D6B878" fillOpacity="0.6" />
        <circle cx="720" cy="60" r="3" fill="#D6B878" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

