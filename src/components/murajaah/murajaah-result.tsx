"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  RotateCcw,
  ArrowLeft,
  BarChart3,
  Clock,
  Info,
} from "lucide-react";
import { toArabicDigits } from "@/lib/quran-api";
import type {
  MurajaahSessionRecord,
  VerseEvaluationResult,
  VerseMurajaahStatus,
} from "@/lib/murajaah-types";

interface MurajaahResultProps {
  session: MurajaahSessionRecord;
  onRepeatSession: () => void;
  onRepeatReviewVerses: () => void;
  onBackToTartel: () => void;
  onViewHistory: () => void;
}

type ResultFilter = "semua" | "selesai" | "perlu_diperiksa" | "belum_dibaca";

function resolveVerseStatus(res: VerseEvaluationResult): Exclude<VerseMurajaahStatus, "sedang_dibaca"> {
  if (res.murajaahStatus === "selesai") return "selesai";
  if (res.murajaahStatus === "perlu_diperiksa") return "perlu_diperiksa";
  if (res.murajaahStatus === "belum_dibaca") return "belum_dibaca";
  // Fallback kompatibilitas jika record berasal dari sesi terdahulu
  if (res.needsRepeat) return "perlu_diperiksa";
  if (res.accuracyPercentage >= 80) return "selesai";
  return "belum_dibaca";
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} detik`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins} menit ${secs} detik` : `${mins} menit`;
}

export default function MurajaahResult({
  session,
  onRepeatSession,
  onRepeatReviewVerses,
  onBackToTartel,
  onViewHistory,
}: MurajaahResultProps) {
  const [filter, setFilter] = useState<ResultFilter>("semua");

  // Kalkulasi statistik hasil murni dari data sesi aktual
  const summary = useMemo(() => {
    const results = session.results ?? [];
    const totalVerses = results.length > 0 ? results.length : session.totalVersesTested;

    let completedCount = 0;
    let needsReviewCount = 0;
    let unreadCount = 0;

    if (results.length > 0) {
      for (const r of results) {
        const status = resolveVerseStatus(r);
        if (status === "selesai") completedCount += 1;
        else if (status === "perlu_diperiksa") needsReviewCount += 1;
        else unreadCount += 1;
      }
    } else {
      completedCount = session.versesCompletedCount ?? session.versesPassedCount ?? 0;
      needsReviewCount = session.versesNeedsReviewCount ?? session.itemsToRepeat.length ?? 0;
      unreadCount =
        session.versesUnreadCount ??
        Math.max(0, totalVerses - completedCount - needsReviewCount);
    }

    const progressPercentage =
      totalVerses > 0 ? Math.round((completedCount / totalVerses) * 100) : 0;

    return {
      totalVerses,
      completedCount,
      needsReviewCount,
      unreadCount,
      progressPercentage,
    };
  }, [session]);

  const filteredResults = useMemo(() => {
    const list = session.results ?? [];
    if (filter === "semua") return list;
    return list.filter((r) => resolveVerseStatus(r) === filter);
  }, [session.results, filter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* ====================================================================
          1. KARTU RINGKASAN HASIL MURAJAAH
      ==================================================================== */}
      <section
        aria-labelledby="hasil-murajaah-title"
        className="bg-surface border border-border rounded-2xl overflow-hidden"
      >
        {/* Header Hijau Islami SIRAJ */}
        <div className="relative overflow-hidden bg-primary text-white px-5 py-6 sm:px-8 sm:py-7 border-b border-secondary/25">
          <div
            className="absolute inset-0 pattern-star opacity-8 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-secondary">
                <CheckCircle2 size={13} />
                <span>Murajaah Selesai</span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
                <h1
                  id="hasil-murajaah-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
                >
                  {session.range.surahName}
                </h1>
                {session.range.surahArabic && (
                  <span
                    className="arabic-text text-xl sm:text-2xl text-secondary font-normal leading-none"
                    lang="ar"
                  >
                    {session.range.surahArabic}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-white/80">
                <span>
                  Ayat {session.range.startVerse}–{session.range.endVerse}
                </span>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} className="text-secondary" />
                  <span>Durasi {formatDuration(session.durationSeconds)}</span>
                </span>
              </div>
            </div>

            {/* Angka Capaian Utama */}
            <div className="sm:text-right bg-black/15 border border-white/15 rounded-xl px-4 py-3 shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-secondary">
                {summary.completedCount} dari {summary.totalVerses} ayat
              </div>
              <div className="text-xs font-semibold text-white/90 mt-0.5">
                {summary.progressPercentage}% selesai
              </div>
            </div>
          </div>
        </div>

        {/* Body Ringkasan: Progress Bar Dinamis, Statistik 4 Kolom & Tombol Aksi */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Progress Bar Dinamis */}
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="font-semibold text-text">
                Progress Penyelesaian Sesi
              </span>
              <span className="font-bold text-primary">
                {summary.progressPercentage}% ({summary.completedCount}/{summary.totalVerses} ayat)
              </span>
            </div>
            <div
              className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={summary.completedCount}
              aria-valuemin={0}
              aria-valuemax={summary.totalVerses}
              aria-label={`Progress hasil murajaah ${summary.completedCount} dari ${summary.totalVerses} ayat`}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${summary.progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              {summary.completedCount === summary.totalVerses && summary.totalVerses > 0
                ? "Alhamdulillah, seluruh ayat pada sesi ini telah ditandai selesai."
                : summary.needsReviewCount > 0
                ? `Terdapat ${summary.needsReviewCount} ayat yang ditandai perlu diperiksa dan ${summary.unreadCount} ayat belum dibaca.`
                : `Masih terdapat ${summary.unreadCount} ayat yang belum dibaca pada sesi ini.`}
            </p>
          </div>

          {/* 2. Statistik Hasil (4 Kartu Sederhana) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
              <span className="text-xs font-medium text-emerald-900 block">
                Ayat Selesai
              </span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {summary.completedCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <span className="text-xs font-medium text-amber-900 block">
                Perlu Diperiksa
              </span>
              <div className="text-2xl font-bold text-amber-700 mt-1">
                {summary.needsReviewCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border">
              <span className="text-xs font-medium text-muted block">
                Belum Dibaca
              </span>
              <div className="text-2xl font-bold text-text mt-1">
                {summary.unreadCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/[0.05] border border-primary/20">
              <span className="text-xs font-medium text-primary block">
                Total Ayat
              </span>
              <div className="text-2xl font-bold text-primary mt-1">
                {summary.totalVerses}
              </div>
            </div>
          </div>

          {/* 3. Tombol Aksi */}
          <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onRepeatSession}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Ulangi Murajaah</span>
            </button>

            {summary.needsReviewCount > 0 && (
              <button
                type="button"
                onClick={onRepeatReviewVerses}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <AlertCircle size={15} />
                <span>Ulangi Perlu Diperiksa ({summary.needsReviewCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onBackToTartel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface hover:bg-primary/[0.04] text-text border border-border rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Kembali ke Tartel</span>
            </button>

            <button
              type="button"
              onClick={onViewHistory}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-background hover:bg-primary/[0.04] text-primary border border-border rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer sm:ml-auto"
            >
              <BarChart3 size={15} />
              <span>Riwayat &amp; Statistik</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. RINCIAN STATUS HASIL BACAAN PER AYAT
      ==================================================================== */}
      <section className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text flex items-center gap-2">
              <BookOpen size={17} className="text-primary" />
              <span>Rincian Status Bacaan per Ayat</span>
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Status dicatat berdasarkan penandaan bacaan selama sesi murajaah.
            </p>
          </div>

          {/* Filter Tab Sederhana */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { key: "semua", label: `Semua (${summary.totalVerses})` },
                { key: "selesai", label: `Selesai (${summary.completedCount})` },
                { key: "perlu_diperiksa", label: `Perlu Diperiksa (${summary.needsReviewCount})` },
                { key: "belum_dibaca", label: `Belum Dibaca (${summary.unreadCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter === tab.key
                    ? "bg-primary text-white"
                    : "bg-background text-muted hover:text-text border border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catatan Status Bacaan & Persiapan Integrasi Suara AI */}
        <div className="px-5 py-3 sm:px-7 bg-[#F8F7F2]/70 border-b border-border/70 flex items-start gap-2.5 text-xs text-muted">
          <Info size={15} className="text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Hasil di atas merupakan rekap status bacaan dari sesi Tartel yang baru saja kamu selesaikan.
            Koreksi bacaan berbasis suara AI belum aktif pada tahap ini dan akan dihubungkan pada pembaruan berikutnya.
          </p>
        </div>

        {/* Daftar Ayat */}
        {filteredResults.length > 0 ? (
          <div className="divide-y divide-border/70">
            {filteredResults.map((res) => {
              const status = resolveVerseStatus(res);

              return (
                <div
                  key={res.verseKey}
                  className="px-5 py-5 sm:px-7 sm:py-6 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8F7F2] border border-border text-xs font-bold text-text">
                      <span>Ayat {res.verseNumber}</span>
                      <span className="text-[11px] font-normal text-muted">
                        ({toArabicDigits(res.verseNumber)})
                      </span>
                    </span>

                    {status === "selesai" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>Selesai</span>
                      </span>
                    )}

                    {status === "perlu_diperiksa" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle size={13} className="text-amber-600" />
                        <span>Perlu diperiksa</span>
                      </span>
                    )}

                    {status === "belum_dibaca" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-background text-muted border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
                        <span>Belum dibaca</span>
                      </span>
                    )}
                  </div>

                  <p
                    className="quran-arabic quran-arabic--sm text-text"
                    lang="ar"
                    dir="rtl"
                  >
                    {res.targetArabic}
                    <span className="ayah-marker">
                      <span aria-hidden="true">{toArabicDigits(res.verseNumber)}</span>
                      <span className="sr-only">Ayat {res.verseNumber}</span>
                    </span>
                  </p>

                  {res.targetTranslation && (
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {res.targetTranslation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-xs sm:text-sm text-muted">
            Tidak ada ayat dengan status yang dipilih pada sesi ini.
          </div>
        )}
      </section>
    </div>
  );
}

