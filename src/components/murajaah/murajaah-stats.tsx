"use client";

import { useState } from "react";
import {
  Trophy,
  Flame,
  Target,
  Calendar,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
} from "lucide-react";
import type {
  MurajaahSessionRecord,
  MurajaahStats,
  VerseEvaluationResult,
} from "@/lib/murajaah-types";

interface MurajaahStatsViewProps {
  stats: MurajaahStats;
  history: MurajaahSessionRecord[];
  onStartNewSession: () => void;
}

export default function MurajaahStatsView({
  stats,
  history,
  onStartNewSession,
}: MurajaahStatsViewProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} dtk`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} mnt ${secs > 0 ? `${secs} dtk` : ""}`;
  };

  const dailyPercent = Math.min(
    100,
    Math.round((stats.todayVersesTested / (stats.dailyTarget || 10)) * 100)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Ringkasan Kartu Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card !p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted">Total Sesi</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {stats.totalSessions}
            </div>
            <span className="text-xs text-muted mt-0.5 block">Sesi murajaah</span>
          </div>
        </div>

        <div className="card !p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted">Ayat Dimurajaah</span>
            <div className="w-8 h-8 rounded-lg bg-[#D6B878]/20 text-[#8F7432] flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {stats.totalVersesTested}
            </div>
            <span className="text-xs text-muted mt-0.5 block">Total ayat dibaca</span>
          </div>
        </div>

        <div className="card !p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted">Rata-rata Selesai</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Trophy size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 tracking-tight">
              {stats.averageScore > 0 ? `${stats.averageScore}%` : "—"}
            </div>
            <span className="text-xs text-muted mt-0.5 block">Ketuntasan sesi</span>
          </div>
        </div>

        <div className="card !p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted">Istiqamah</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Flame size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {stats.streakDays} <span className="text-sm font-semibold text-muted">Hari</span>
            </div>
            <span className="text-xs text-muted mt-0.5 block">Streak aktif</span>
          </div>
        </div>
      </div>

      {/* 2. Kartu Target Harian */}
      <div className="card !p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target size={20} />
            </span>
            <div>
              <h3 className="font-bold text-base text-text">Progres Target Hari Ini</h3>
              <p className="text-xs text-muted">
                Target harian membantu menjaga hafalan secara konsisten.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-primary">
              {stats.todayVersesTested} / {stats.dailyTarget || 10} Ayat
            </span>
            <span className="block text-xs text-muted">({dailyPercent}% selesai)</span>
          </div>
        </div>

        <div className="progress-bar h-2">
          <div
            className="progress-bar-fill transition-all duration-500"
            style={{ width: `${dailyPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Daftar Riwayat Sesi Murajaah */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-text">Riwayat Sesi Terakhir</h3>
          <p className="text-xs text-muted">
            Daftar sesi murajaah Al-Qur&apos;an yang telah kamu selesaikan.
          </p>
        </div>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((session) => {
              const isExpanded = expandedSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className="card !p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge badge-primary !py-0.5 !px-2 !text-[11px] font-semibold">
                          Sesi Murajaah
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDateTime(session.completedAt)}
                        </span>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock size={12} />
                          {formatDuration(session.durationSeconds)}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-text">
                        {session.range.surahName} (Ayat {session.range.startVerse}–{session.range.endVerse})
                      </h4>

                      <p className="text-xs text-muted">
                        {session.versesPassedCount} dari {session.totalVersesTested} ayat selesai
                        {session.itemsToRepeat.length > 0
                          ? ` • ${session.itemsToRepeat.length} ayat perlu diperiksa`
                          : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right px-3 py-1.5 rounded-xl border bg-background border-border">
                        <div className="text-sm font-bold text-primary">
                          {session.versesPassedCount}/{session.totalVersesTested} Ayat
                        </div>
                        <div className="text-[10px] font-medium text-muted">
                          {session.averageScore}% Selesai
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSessionId(isExpanded ? null : session.id)
                        }
                        className="p-2 text-muted hover:text-text rounded-lg hover:bg-primary/[0.04] transition-colors cursor-pointer"
                        title="Lihat detail status per ayat"
                        aria-label="Lihat detail status per ayat"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Detail Status Per Ayat jika Expanded */}
                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-border space-y-3 animate-fade-in">
                      <h5 className="text-xs font-bold text-primary uppercase tracking-wider">
                        Status Per Ayat:
                      </h5>

                      <div className="space-y-2.5">
                        {session.results.map((res: VerseEvaluationResult) => {
                          const statusLabel =
                            res.murajaahStatus === "selesai" || res.accuracyPercentage >= 80
                              ? "Selesai"
                              : res.murajaahStatus === "perlu_diperiksa" || res.needsRepeat
                              ? "Perlu diperiksa"
                              : "Belum dibaca";

                          const badgeClass =
                            statusLabel === "Selesai"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : statusLabel === "Perlu diperiksa"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-surface text-muted border-border";

                          return (
                            <div
                              key={res.verseKey}
                              className="p-3.5 rounded-xl bg-background border border-border space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-text">
                                  Ayat {res.verseNumber}
                                </span>
                                <span
                                  className={`font-semibold px-2.5 py-0.5 rounded-full border text-[11px] ${badgeClass}`}
                                >
                                  {statusLabel}
                                </span>
                              </div>

                              <p
                                className="quran-arabic quran-arabic--sm text-text"
                                lang="ar"
                                dir="rtl"
                              >
                                {res.targetArabic}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card !p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <RotateCcw size={22} />
            </div>
            <h4 className="font-bold text-base text-text">Belum Ada Riwayat Murajaah</h4>
            <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">
              Mulailah sesi murajaah pertamamu hari ini untuk melatih dan menjaga hafalan Al-Qur&apos;an secara teratur.
            </p>
            <button
              type="button"
              onClick={onStartNewSession}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Mulai Sesi Murajaah
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
