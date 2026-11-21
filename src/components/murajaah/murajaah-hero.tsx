"use client";

import { BookOpen, Sparkles, Flame, Target, ArrowRight } from "lucide-react";
import type { MurajaahStats } from "@/lib/murajaah-types";

interface MurajaahHeroProps {
  stats: MurajaahStats;
  onStartClick: () => void;
  onViewHistoryClick: () => void;
}

export default function MurajaahHero({
  stats,
  onStartClick,
  onViewHistoryClick,
}: MurajaahHeroProps) {
  const dailyPercent = Math.min(
    100,
    Math.round((stats.todayVersesTested / (stats.dailyTarget || 10)) * 100)
  );

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary p-6 sm:p-8 lg:p-9 text-white border border-secondary/25 mb-6">
      {/* Ornamen Geometris Islami Halus */}
      <div
        className="absolute inset-0 pattern-star opacity-8 pattern-fade pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Kolom Kiri: Teks & Tombol */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-secondary border border-white/15">
            <Sparkles size={13} className="text-secondary" />
            <span>Tartel • Murajaah Hafalan Al-Qur&apos;an</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            Jaga Hafalan, Dekat dengan Al-Qur&apos;an
          </h1>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl">
            Pilih surat yang ingin dimurajaah, baca ayat demi ayat dengan tenang,
            dan pantau perkembangan murajaahmu secara teratur setiap hari.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onStartClick}
              className="inline-flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-light text-text rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              <BookOpen size={17} />
              <span>Mulai Murajaah</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={onViewHistoryClick}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              <span>Riwayat &amp; Statistik</span>
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Target Harian */}
        <div className="lg:col-span-5 bg-white/10 border border-white/15 rounded-xl p-4 sm:p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-white/90">
                <Target size={15} className="text-secondary" />
                Target Harian
              </span>
              <span className="text-secondary font-bold">
                {stats.todayVersesTested} / {stats.dailyTarget || 10} Ayat
              </span>
            </div>
            <div className="w-full bg-black/25 h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${dailyPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-white/70 mt-1.5">
              {dailyPercent >= 100
                ? "Alhamdulillah, target murajaah hari ini telah tercapai."
                : `Kurang ${Math.max(
                    0,
                    (stats.dailyTarget || 10) - stats.todayVersesTested
                  )} ayat lagi untuk memenuhi target hari ini.`}
            </p>
          </div>

          <div className="border-t border-white/10 pt-3.5 grid grid-cols-3 gap-2.5 text-center">
            <div className="p-2 rounded-lg bg-black/15">
              <div className="text-base sm:text-lg font-bold text-white">
                {stats.totalSessions}
              </div>
              <div className="text-[11px] text-white/70">Total Sesi</div>
            </div>

            <div className="p-2 rounded-lg bg-black/15">
              <div className="text-base sm:text-lg font-bold text-secondary">
                {stats.totalVersesTested}
              </div>
              <div className="text-[11px] text-white/70">Ayat Dibaca</div>
            </div>

            <div className="p-2 rounded-lg bg-black/15">
              <div className="text-base sm:text-lg font-bold text-white flex items-center justify-center gap-1">
                <Flame size={14} className="text-secondary" />
                <span>{stats.streakDays}</span>
              </div>
              <div className="text-[11px] text-white/70">Hari Aktif</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
