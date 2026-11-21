"use client";

import { useEffect, useState, useRef } from "react";
import {
  fetchChapters,
  fetchJuzs,
  fetchSurahVerses,
  fetchJuzVerses,
  type ChapterMeta,
  type JuzMeta,
  type QuranVerse,
} from "@/lib/quran-api";
import {
  readMurajaahHistory,
  readMurajaahStats,
  saveMurajaahSession,
} from "@/lib/murajaah-storage";
import type {
  MurajaahMode,
  MurajaahRangeSelection,
  MurajaahSessionRecord,
  MurajaahStats,
  VerseEvaluationResult,
} from "@/lib/murajaah-types";

import MurajaahHero from "@/components/murajaah/murajaah-hero";
import MurajaahSetup from "@/components/murajaah/murajaah-setup";
import MurajaahSession from "@/components/murajaah/murajaah-session";
import MurajaahResult from "@/components/murajaah/murajaah-result";
import MurajaahStatsView from "@/components/murajaah/murajaah-stats";

type MurajaahView = "home" | "session" | "result" | "stats";

export default function MurajaahPage() {
  const [view, setView] = useState<MurajaahView>("home");
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [juzs, setJuzs] = useState<JuzMeta[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  // Data Statistik & Riwayat
  const [stats, setStats] = useState<MurajaahStats>(() => readMurajaahStats());
  const [history, setHistory] = useState<MurajaahSessionRecord[]>(() => readMurajaahHistory());

  // Sesi Aktif & Sesi Awal (untuk tombol "Ulangi Murajaah")
  const [activeRange, setActiveRange] = useState<MurajaahRangeSelection | null>(null);
  const [initialSessionRange, setInitialSessionRange] = useState<MurajaahRangeSelection | null>(null);
  const [activeMode, setActiveMode] = useState<MurajaahMode>("bantuan");
  const [activeVerses, setActiveVerses] = useState<QuranVerse[]>([]);
  const [initialSessionVerses, setInitialSessionVerses] = useState<QuranVerse[]>([]);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Data Hasil Sesi yang Baru Diselesaikan
  const [completedSession, setCompletedSession] = useState<MurajaahSessionRecord | null>(null);

  // Setup ref untuk scrolling
  const setupRef = useRef<HTMLDivElement | null>(null);

  // Muat data awal metadata Al-Qur'an
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [chData, jData] = await Promise.all([
          fetchChapters().catch(() => []),
          fetchJuzs().catch(() => []),
        ]);

        if (isMounted) {
          setChapters(chData);
          setJuzs(jData);
          setIsLoadingMeta(false);
        }
      } catch {
        if (isMounted) setIsLoadingMeta(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler Mulai Sesi Baru
  const handleStartSession = async (config: {
    range: MurajaahRangeSelection;
    mode: MurajaahMode;
    showTranslation: boolean;
  }) => {
    setIsLoadingVerses(true);
    setActiveRange(config.range);
    setInitialSessionRange(config.range);
    setActiveMode(config.mode);
    setShowTranslation(config.showTranslation);
    setCompletedSession(null);

    try {
      let loadedVerses: QuranVerse[] = [];

      if (config.range.type === "surah") {
        const allVerses = await fetchSurahVerses(config.range.surahNumber);
        loadedVerses = allVerses.filter(
          (v) =>
            v.number >= config.range.startVerse &&
            v.number <= config.range.endVerse
        );
      } else if (config.range.juzNumber) {
        const allJuzVerses = await fetchJuzVerses(config.range.juzNumber);
        loadedVerses = allJuzVerses;
      }

      if (loadedVerses.length === 0) {
        throw new Error("Ayat tidak dapat dimuat.");
      }

      setActiveVerses(loadedVerses);
      setInitialSessionVerses(loadedVerses);
      setSessionStartTime(Date.now());
      setView("session");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("Gagal memuat ayat Al-Qur'an. Periksa koneksi internetmu.");
    } finally {
      setIsLoadingVerses(false);
    }
  };

  // Handler Selesai Sesi Murajaah -> Arahkan ke Halaman Hasil Murajaah
  const handleFinishSession = (results: VerseEvaluationResult[]) => {
    if (!activeRange) return;

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - sessionStartTime) / 1000)
    );

    const totalTested = results.length;
    const completedCount = results.filter(
      (r) =>
        r.murajaahStatus === "selesai" ||
        (!r.murajaahStatus && r.accuracyPercentage >= 80)
    ).length;
    const needsReviewCount = results.filter(
      (r) =>
        r.murajaahStatus === "perlu_diperiksa" ||
        (!r.murajaahStatus && r.needsRepeat)
    ).length;
    const unreadCount = Math.max(
      0,
      totalTested - completedCount - needsReviewCount
    );
    const completionRatio =
      totalTested > 0 ? Math.round((completedCount / totalTested) * 100) : 0;

    const itemsToRepeat = results
      .filter((r) => r.murajaahStatus === "perlu_diperiksa" || r.needsRepeat)
      .map((r) => ({
        verseKey: r.verseKey,
        verseNumber: r.verseNumber,
        reason:
          r.repeatSuggestion || "Ditandai perlu diperiksa saat sesi murajaah",
      }));

    const newRecord: MurajaahSessionRecord = {
      id: `murajaah-${Date.now()}`,
      startedAt: new Date(sessionStartTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds,
      mode: activeMode,
      range: activeRange,
      totalVersesTested: totalTested,
      versesPassedCount: completedCount,
      versesCompletedCount: completedCount,
      versesNeedsReviewCount: needsReviewCount,
      versesUnreadCount: unreadCount,
      averageScore: completionRatio,
      results,
      itemsToRepeat,
    };

    const updatedHistory = saveMurajaahSession(newRecord);
    setHistory(updatedHistory);
    setStats(readMurajaahStats());
    setCompletedSession(newRecord);
    setView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToSetup = () => {
    setCompletedSession(null);
    setView("home");
    setTimeout(() => {
      setupRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handler Ulangi Murajaah (seluruh surat/rentang awal sesi)
  const handleRepeatFullSession = () => {
    const versesToUse =
      initialSessionVerses.length > 0 ? initialSessionVerses : activeVerses;
    const rangeToUse = initialSessionRange ?? completedSession?.range ?? activeRange;

    if (!rangeToUse || versesToUse.length === 0) {
      setView("home");
      return;
    }

    setActiveVerses(versesToUse);
    setActiveRange(rangeToUse);
    setCompletedSession(null);
    setSessionStartTime(Date.now());
    setView("session");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler Ulangi Ayat yang Ditandai Perlu Diperiksa
  const handleRepeatWrongVerses = () => {
    if (!completedSession || completedSession.itemsToRepeat.length === 0) return;

    const wrongVerseNumbers = new Set(
      completedSession.itemsToRepeat.map((item) => item.verseNumber)
    );

    const wrongVerses = activeVerses.filter((v) =>
      wrongVerseNumbers.has(v.number)
    );

    if (wrongVerses.length === 0) return;

    const newRange: MurajaahRangeSelection = {
      ...completedSession.range,
      surahName: `${completedSession.range.surahName} (Perlu Diperiksa)`,
      totalVersesInRange: wrongVerses.length,
      startVerse: wrongVerses[0].number,
      endVerse: wrongVerses[wrongVerses.length - 1].number,
    };

    setActiveVerses(wrongVerses);
    setActiveRange(newRange);
    setCompletedSession(null);
    setSessionStartTime(Date.now());
    setView("session");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
      {/* Tab Navigasi Halaman Utama vs Statistik */}
      {view !== "session" && view !== "result" && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-xl">
            <button
              type="button"
              onClick={() => setView("home")}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                view === "home"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              Murajaah Hafalan
            </button>
            <button
              type="button"
              onClick={() => setView("stats")}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                view === "stats"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              Riwayat &amp; Statistik
            </button>
          </div>
        </div>
      )}

      {/* Tampilan 1: Sesi Murajaah Tartel */}
      {view === "session" && activeRange && activeVerses.length > 0 ? (
        <MurajaahSession
          key={`${activeRange.surahNumber}-${activeRange.startVerse}-${activeRange.endVerse}-${sessionStartTime}`}
          verses={activeVerses}
          range={activeRange}
          mode={activeMode}
          showTranslationDefault={showTranslation}
          onFinishSession={handleFinishSession}
          onExitSession={() => setView("home")}
        />
      ) : view === "result" && completedSession ? (
        /* Tampilan 2: Halaman Hasil Murajaah */
        <MurajaahResult
          session={completedSession}
          onRepeatSession={handleRepeatFullSession}
          onRepeatReviewVerses={handleRepeatWrongVerses}
          onBackToTartel={() => {
            setCompletedSession(null);
            setView("home");
          }}
          onViewHistory={() => {
            setCompletedSession(null);
            setView("stats");
          }}
        />
      ) : view === "stats" ? (
        /* Tampilan 3: Halaman Riwayat & Statistik */
        <MurajaahStatsView
          stats={stats}
          history={history}
          onStartNewSession={handleScrollToSetup}
        />
      ) : (
        /* Tampilan 4: Halaman Utama (Hero + Pilih Surat) */
        <div className="space-y-6">
          <MurajaahHero
            stats={stats}
            onStartClick={handleScrollToSetup}
            onViewHistoryClick={() => setView("stats")}
          />

          <div ref={setupRef}>
            {isLoadingMeta || isLoadingVerses ? (
              <div className="bg-surface rounded-2xl border border-border p-12 text-center space-y-3">
                <div className="w-9 h-9 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-text">
                  {isLoadingVerses
                    ? "Memuat seluruh ayat surat yang dipilih..."
                    : "Memuat daftar Surat & Juz Al-Qur'an..."}
                </p>
              </div>
            ) : (
              <MurajaahSetup
                chapters={chapters}
                juzs={juzs}
                defaultMode="bantuan"
                onStartSession={handleStartSession}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
