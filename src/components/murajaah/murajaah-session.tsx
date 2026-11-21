"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Volume2,
  Check,
  CheckCircle2,
  AlertCircle,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Languages,
  Mic,
  Eye,
  EyeOff,
} from "lucide-react";
import { toArabicDigits, type QuranVerse } from "@/lib/quran-api";
import type {
  MurajaahMode,
  MurajaahRangeSelection,
  VerseEvaluationResult,
  VerseMurajaahStatus,
  VerseSessionItemState,
  VoiceCorrectionSessionState,
} from "@/lib/murajaah-types";

interface MurajaahSessionProps {
  verses: QuranVerse[];
  range: MurajaahRangeSelection;
  mode: MurajaahMode;
  showTranslationDefault: boolean;
  onFinishSession: (results: VerseEvaluationResult[]) => void;
  onExitSession: () => void;
}

type ScaleKey = 1 | 2 | 3;

const SCALE_CLASS: Record<ScaleKey, string> = {
  1: "quran-arabic--sm",
  2: "quran-arabic--md",
  3: "quran-arabic--lg",
};

const BASMALAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

export default function MurajaahSession({
  verses,
  range,
  mode: _mode,
  showTranslationDefault,
  onFinishSession,
  onExitSession,
}: MurajaahSessionProps) {
  // Index ayat yang sedang aktif dibaca pengguna (0 s/d verses.length - 1)
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const activeVerse = verses[activeVerseIndex] ?? verses[0];

  // State per ayat (menyimpan status: belum_dibaca | sedang_dibaca | selesai | perlu_diperiksa)
  // Disiapkan terstruktur agar mudah dihubungkan dengan Speech Recognition / AI Voice Correction
  const [verseStates, setVerseStates] = useState<Record<number, VerseSessionItemState>>(() => {
    const initial: Record<number, VerseSessionItemState> = {};
    verses.forEach((v, idx) => {
      initial[v.number] = {
        verseKey: v.key,
        verseNumber: v.number,
        chapterId: v.chapterId,
        status: idx === 0 ? "sedang_dibaca" : "belum_dibaca",
        voiceTranscriptDraft: "",
        reviewNote: "",
      };
    });
    return initial;
  });

  // State Persiapan Integrasi AI Voice Correction (Requirement 8)
  const [voiceSessionState, setVoiceSessionState] = useState<VoiceCorrectionSessionState>({
    integrationStatus: "ready_for_integration",
    isMicEnabled: false,
    activeVerseKey: verses[0]?.key ?? null,
    transcriptBuffer: "",
    lastError: null,
  });
  const [showVoicePrepInfo, setShowVoicePrepInfo] = useState<boolean>(false);

  // Tampilan & Preferensi Kenyamanan Bacaan
  const [showTranslation, setShowTranslation] = useState<boolean>(showTranslationDefault);
  const [scale, setScale] = useState<ScaleKey>(2);
  const [hideVerseText, setHideVerseText] = useState<boolean>(false);

  // Audio Referensi Qari Resmi per Ayat
  const [playingAudioVerseNumber, setPlayingAudioVerseNumber] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bersihkan pemutar audio saat keluar dari sesi
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Helper untuk menentukan status efektif setiap ayat
  const getEffectiveVerseStatus = useCallback(
    (verseNumber: number, index: number): VerseMurajaahStatus => {
      const savedStatus = verseStates[verseNumber]?.status ?? "belum_dibaca";
      if (index === activeVerseIndex) {
        // Jika ayat sedang dipilih/aktif dan belum selesai/perlu_diperiksa, tampilkan sedang_dibaca
        if (savedStatus === "belum_dibaca" || savedStatus === "sedang_dibaca") {
          return "sedang_dibaca";
        }
      } else if (savedStatus === "sedang_dibaca") {
        return "belum_dibaca";
      }
      return savedStatus;
    },
    [verseStates, activeVerseIndex]
  );

  // Kalkulasi Progress Sesi secara Realtime berdasarkan ayat yang berstatus "selesai"
  const progressStats = useMemo(() => {
    let completedCount = 0;
    let needsReviewCount = 0;

    for (const v of verses) {
      const st = verseStates[v.number]?.status;
      if (st === "selesai") completedCount += 1;
      else if (st === "perlu_diperiksa") needsReviewCount += 1;
    }

    const totalCount = verses.length;
    const unreadCount = Math.max(0, totalCount - completedCount - needsReviewCount);
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      completedCount,
      needsReviewCount,
      unreadCount,
      totalCount,
      percentage,
    };
  }, [verses, verseStates]);

  // Auto-scroll halus ke baris ayat tertentu
  const scrollToVerse = useCallback((verseNumber: number) => {
    setTimeout(() => {
      const el = document.getElementById(`tartel-verse-${verseNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);
  }, []);

  // Pindah fokus ke ayat pada index tertentu
  const focusVerseAtIndex = useCallback(
    (nextIndex: number, shouldScroll = true) => {
      if (nextIndex < 0 || nextIndex >= verses.length) return;
      const targetVerse = verses[nextIndex];
      if (!targetVerse) return;

      setActiveVerseIndex(nextIndex);
      setVoiceSessionState((prev) => ({
        ...prev,
        activeVerseKey: targetVerse.key,
        transcriptBuffer: "",
      }));

      setVerseStates((prev) => {
        const next = { ...prev };
        // Pastikan ayat yang baru difokuskan berstatus sedang_dibaca jika sebelumnya belum_dibaca
        const currentTargetState = next[targetVerse.number];
        if (!currentTargetState || currentTargetState.status === "belum_dibaca") {
          next[targetVerse.number] = {
            ...(currentTargetState ?? {
              verseKey: targetVerse.key,
              verseNumber: targetVerse.number,
              chapterId: targetVerse.chapterId,
            }),
            status: "sedang_dibaca",
            updatedAt: new Date().toISOString(),
          };
        }
        return next;
      });

      if (shouldScroll) {
        scrollToVerse(targetVerse.number);
      }
    },
    [verses, scrollToVerse]
  );

  // Ubah status ayat tertentu & opsional lanjut ke ayat berikutnya
  const updateVerseStatus = useCallback(
    (
      verseNumber: number,
      newStatus: VerseMurajaahStatus,
      advanceToNext = false
    ) => {
      const currentIdx = verses.findIndex((v) => v.number === verseNumber);
      const targetVerse = verses[currentIdx];
      if (!targetVerse) return;

      setVerseStates((prev) => {
        const next = { ...prev };
        next[verseNumber] = {
          ...(next[verseNumber] ?? {
            verseKey: targetVerse.key,
            verseNumber: targetVerse.number,
            chapterId: targetVerse.chapterId,
          }),
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
        return next;
      });

      if (advanceToNext && currentIdx < verses.length - 1) {
        const nextIdx = currentIdx + 1;
        const nextVerse = verses[nextIdx];
        setActiveVerseIndex(nextIdx);
        if (nextVerse) {
          setVoiceSessionState((prev) => ({
            ...prev,
            activeVerseKey: nextVerse.key,
            transcriptBuffer: "",
          }));
          setVerseStates((prev) => {
            const next = { ...prev };
            const existing = next[nextVerse.number];
            if (!existing || existing.status === "belum_dibaca") {
              next[nextVerse.number] = {
                ...(existing ?? {
                  verseKey: nextVerse.key,
                  verseNumber: nextVerse.number,
                  chapterId: nextVerse.chapterId,
                }),
                status: "sedang_dibaca",
                updatedAt: new Date().toISOString(),
              };
            }
            return next;
          });
          scrollToVerse(nextVerse.number);
        }
      }
    },
    [verses, scrollToVerse]
  );

  // Reset seluruh progress sesi kembali ke ayat pertama
  const handleResetSession = () => {
    const resetMap: Record<number, VerseSessionItemState> = {};
    verses.forEach((v, idx) => {
      resetMap[v.number] = {
        verseKey: v.key,
        verseNumber: v.number,
        chapterId: v.chapterId,
        status: idx === 0 ? "sedang_dibaca" : "belum_dibaca",
        voiceTranscriptDraft: "",
        reviewNote: "",
      };
    });
    setVerseStates(resetMap);
    setActiveVerseIndex(0);
    if (verses[0]) {
      scrollToVerse(verses[0].number);
    }
  };

  // Putar Murottal Qari untuk ayat tertentu
  const togglePlayVerseAudio = (verse: QuranVerse) => {
    if (!verse.audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setPlayingAudioVerseNumber(null);
      audioRef.current.onerror = () => setPlayingAudioVerseNumber(null);
    }

    if (playingAudioVerseNumber === verse.number) {
      audioRef.current.pause();
      setPlayingAudioVerseNumber(null);
    } else {
      audioRef.current.src = verse.audioUrl;
      audioRef.current
        .play()
        .then(() => setPlayingAudioVerseNumber(verse.number))
        .catch(() => setPlayingAudioVerseNumber(null));
    }
  };

  // Handler Selesai Sesi Murajaah & Simpan Riwayat
  const handleCompleteSession = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const nowIso = new Date().toISOString();
    const results: VerseEvaluationResult[] = verses.map((v) => {
      const itemState = verseStates[v.number];
      const rawStatus: VerseMurajaahStatus = itemState?.status ?? "belum_dibaca";
      const finalStatus: VerseMurajaahStatus =
        rawStatus === "selesai" || rawStatus === "perlu_diperiksa"
          ? rawStatus
          : "belum_dibaca";
      const isCompleted = finalStatus === "selesai";
      const isNeedsReview = finalStatus === "perlu_diperiksa";

      const words = v.arabic
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w, idx) => ({
          index: idx,
          word: w,
          normalizedTarget: w,
          status: isCompleted ? ("correct" as const) : ("uncertain" as const),
          similarity: isCompleted ? 1 : 0,
        }));

      return {
        verseKey: v.key,
        verseNumber: v.number,
        chapterId: v.chapterId,
        targetArabic: v.arabic,
        targetTranslation: v.translation,
        spokenArabic: itemState?.voiceTranscriptDraft || "",
        score: isCompleted ? 100 : isNeedsReview ? 60 : 0,
        accuracyPercentage: isCompleted ? 100 : isNeedsReview ? 60 : 0,
        grade: isCompleted
          ? "mumtaz"
          : isNeedsReview
          ? "perlu_latihan"
          : "perlu_latihan",
        gradeLabel: isCompleted
          ? "Selesai"
          : isNeedsReview
          ? "Perlu diperiksa"
          : "Belum dibaca",
        words,
        correctWordsCount: isCompleted ? words.length : 0,
        uncertainWordsCount: isNeedsReview ? words.length : 0,
        missingWordsCount: !isCompleted && !isNeedsReview ? words.length : 0,
        differentWordsCount: 0,
        totalWords: words.length,
        extraWords: [],
        feedbackNotes: isNeedsReview
          ? ["Ditandai perlu diperiksa untuk pemantapan hafalan."]
          : isCompleted
          ? ["Telah selesai dibaca dengan baik."]
          : ["Ayat belum ditandai selesai pada sesi ini."],
        needsRepeat: isNeedsReview,
        repeatSuggestion: isNeedsReview
          ? "Ulangi bacaan ayat ini hingga lancar."
          : undefined,
        evaluatedAt: nowIso,
        murajaahStatus: finalStatus,
      };
    });

    onFinishSession(results);
  };

  // Handler toggle persiapan mikrofon (tanpa mengklaim koreksi AI palsu)
  const handleToggleVoicePrep = () => {
    setShowVoicePrepInfo((prev) => !prev);
    setVoiceSessionState((prev) => ({
      ...prev,
      isMicEnabled: !prev.isMicEnabled,
    }));
  };

  // Tampilkan Basmalah di awal surat (kecuali Al-Fatihah karena sudah ayat 1, dan At-Taubah surat 9)
  const showBasmalah =
    range.type === "surah" &&
    range.surahNumber !== 1 &&
    range.surahNumber !== 9 &&
    range.startVerse === 1;

  return (
    <div className="max-w-4xl mx-auto pb-28 animate-fade-in">
      {/* ====================================================================
          1. STICKY HEADER: NAVIGASI, PROGRESS SESI REALTIME & PENGATURAN BACA
      ==================================================================== */}
      <header className="sticky top-14 lg:top-3 z-30 bg-surface/95 backdrop-blur-md border border-border rounded-2xl px-4 py-3.5 sm:px-6 sm:py-4 mb-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Kiri: Tombol Kembali & Info Surat */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onExitSession}
              className="p-2 -ml-1 rounded-xl text-muted hover:text-text hover:bg-primary/[0.05] transition-colors cursor-pointer shrink-0"
              title="Kembali ke pemilihan surat"
              aria-label="Kembali ke pemilihan surat"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-text truncate">
                  {range.surahName}
                </h1>
                {range.surahArabic && (
                  <span
                    className="arabic-text text-base sm:text-lg text-primary font-normal leading-none"
                    lang="ar"
                  >
                    {range.surahArabic}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-0.5">
                Ayat {range.startVerse}–{range.endVerse} • Fokus saat ini:{" "}
                <strong className="text-primary font-semibold">
                  Ayat {activeVerse?.number ?? range.startVerse}
                </strong>
              </p>
            </div>
          </div>

          {/* Kanan: Kontrol Tampilan & Tombol Selesai Sesi */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            {/* Ukuran Huruf Arab (A- / A+) */}
            <div className="inline-flex items-center bg-background border border-border rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(1, s - 1) as ScaleKey)}
                disabled={scale === 1}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-muted hover:text-text disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                title="Perkecil ukuran teks Arab"
                aria-label="Perkecil ukuran teks Arab"
              >
                A−
              </button>
              <span className="w-px h-4 bg-border" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, s + 1) as ScaleKey)}
                disabled={scale === 3}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-muted hover:text-text disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                title="Perbesar ukuran teks Arab"
                aria-label="Perbesar ukuran teks Arab"
              >
                A+
              </button>
            </div>

            {/* Toggle Terjemahan */}
            <button
              type="button"
              onClick={() => setShowTranslation((prev) => !prev)}
              aria-pressed={showTranslation}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                showTranslation
                  ? "bg-primary/[0.08] text-primary border-primary/25"
                  : "bg-background text-muted border-border hover:text-text"
              }`}
              title="Tampilkan atau sembunyikan terjemahan"
            >
              <Languages size={14} />
              <span className="hidden sm:inline">Terjemahan</span>
            </button>

            {/* Opsional: Samarkan teks untuk uji hafalan mandiri */}
            <button
              type="button"
              onClick={() => setHideVerseText((prev) => !prev)}
              aria-pressed={hideVerseText}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                hideVerseText
                  ? "bg-primary/[0.08] text-primary border-primary/25"
                  : "bg-background text-muted border-border hover:text-text"
              }`}
              title={
                hideVerseText
                  ? "Tampilkan kembali teks ayat"
                  : "Samarkan teks ayat untuk menguji ingatan"
              }
            >
              {hideVerseText ? <Eye size={14} /> : <EyeOff size={14} />}
              <span className="hidden md:inline">
                {hideVerseText ? "Tampilkan Ayat" : "Uji Ingatan"}
              </span>
            </button>

            {/* Tombol Selesai Sesi */}
            <button
              type="button"
              onClick={handleCompleteSession}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              Selesai Sesi
            </button>
          </div>
        </div>

        {/* BAR PROGRESS MURAJAAH REALTIME (Requirement 3) */}
        <div className="mt-3.5 pt-3 border-t border-border/80">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text">Progress Murajaah:</span>
              <span className="font-bold text-primary">
                {progressStats.completedCount} dari {progressStats.totalCount} ayat
              </span>
              <span className="text-muted">({progressStats.percentage}%)</span>
            </div>

            {/* Ringkasan Status Ayat */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Selesai: {progressStats.completedCount}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Perlu diperiksa: {progressStats.needsReviewCount}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-border" />
                <span>Belum dibaca: {progressStats.unreadCount}</span>
              </span>
            </div>
          </div>

          <div
            className="w-full h-2 bg-background border border-border/70 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressStats.completedCount}
            aria-valuemin={0}
            aria-valuemax={progressStats.totalCount}
            aria-label={`Progress murajaah ${progressStats.completedCount} dari ${progressStats.totalCount} ayat`}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressStats.percentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. LEMBAR MUSHAF MURAJAAH: SELURUH AYAT DITAMPILKAN UTUH & JELAS
      ==================================================================== */}
      <section
        aria-label={`Daftar ayat ${range.surahName}`}
        className="bg-surface border border-border rounded-2xl overflow-hidden"
      >
        {/* Header Basmalah untuk awal surat (selain Al-Fatihah & At-Taubah) */}
        {showBasmalah && (
          <div className="py-6 px-4 sm:px-8 text-center border-b border-border/70 bg-[#F8F7F2]/50">
            <p
              className={`quran-arabic ${SCALE_CLASS[scale]} text-center text-text`}
              lang="ar"
              dir="rtl"
            >
              {BASMALAH_TEXT}
            </p>
          </div>
        )}

        {/* Daftar Seluruh Ayat Surat */}
        <div className="divide-y divide-border/70">
          {verses.map((verse, index) => {
            const isActive = index === activeVerseIndex;
            const effectiveStatus = getEffectiveVerseStatus(verse.number, index);
            const savedStatus = verseStates[verse.number]?.status ?? "belum_dibaca";
            const isPlayingAudio = playingAudioVerseNumber === verse.number;

            return (
              <article
                key={verse.key}
                id={`tartel-verse-${verse.number}`}
                onClick={() => focusVerseAtIndex(index, false)}
                className={`px-4 sm:px-8 lg:px-10 py-7 sm:py-9 transition-colors cursor-pointer scroll-mt-40 ${
                  isActive
                    ? "bg-[#174A3A]/[0.035] border-r-4 border-r-primary"
                    : savedStatus === "selesai"
                    ? "bg-emerald-50/20 hover:bg-primary/[0.015]"
                    : savedStatus === "perlu_diperiksa"
                    ? "bg-amber-50/25 hover:bg-primary/[0.015]"
                    : "hover:bg-primary/[0.015]"
                }`}
              >
                {/* Baris Atas Ayat: Nomor Ayat, Status Ayat & Tombol Audio Qari */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Nomor Ayat yang Jelas */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-[#F8F7F2] text-text border-border"
                      }`}
                    >
                      <span>Ayat {verse.number}</span>
                      <span className="text-[11px] opacity-75 font-normal">
                        ({toArabicDigits(verse.number)})
                      </span>
                    </span>

                    {/* Status Ayat yang Jelas & Sederhana (Requirement 4) */}
                    {effectiveStatus === "sedang_dibaca" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span>Sedang dibaca</span>
                      </span>
                    )}

                    {effectiveStatus === "selesai" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Selesai</span>
                      </span>
                    )}

                    {effectiveStatus === "perlu_diperiksa" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle size={13} className="text-amber-600 shrink-0" />
                        <span>Perlu diperiksa</span>
                      </span>
                    )}

                    {effectiveStatus === "belum_dibaca" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-background text-muted border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted/50" />
                        <span>Belum dibaca</span>
                      </span>
                    )}

                    {/* Jika ayat sedang dipilih ulang padahal sudah punya status selesai/perlu_diperiksa */}
                    {isActive &&
                      (savedStatus === "selesai" || savedStatus === "perlu_diperiksa") && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">
                          Sedang fokus
                        </span>
                      )}
                  </div>

                  {/* Aksi Cepat Baris Atas: Putar Audio & Ubah Status */}
                  <div
                    className="flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {verse.audioUrl && (
                      <button
                        type="button"
                        onClick={() => togglePlayVerseAudio(verse)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isPlayingAudio
                            ? "bg-primary text-white border-primary"
                            : "bg-background text-muted hover:text-primary border-border"
                        }`}
                        title="Putar audio murottal ayat ini"
                      >
                        {isPlayingAudio ? <Pause size={13} /> : <Volume2 size={13} />}
                        <span className="hidden sm:inline">
                          {isPlayingAudio ? "Berhenti" : "Dengarkan"}
                        </span>
                      </button>
                    )}

                    {/* Tombol cepat tandai selesai untuk ayat mana pun */}
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() =>
                          updateVerseStatus(
                            verse.number,
                            savedStatus === "selesai" ? "belum_dibaca" : "selesai",
                            false
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          savedStatus === "selesai"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-background text-muted hover:text-text border-border"
                        }`}
                        title={
                          savedStatus === "selesai"
                            ? "Batalkan status selesai"
                            : "Tandai ayat ini selesai"
                        }
                      >
                        <Check size={13} />
                        <span className="hidden sm:inline">
                          {savedStatus === "selesai" ? "Selesai" : "Tandai Selesai"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Teks Arab Ayat Utuh & Mengalir Alami (Requirement 2 & 6) */}
                <div className="py-1">
                  <p
                    className={`quran-arabic ${SCALE_CLASS[scale]} select-text transition-opacity ${
                      hideVerseText && !isActive
                        ? "opacity-15 hover:opacity-100 focus:opacity-100"
                        : "text-text"
                    }`}
                    lang="ar"
                    dir="rtl"
                  >
                    {verse.arabic}
                    <span className="ayah-marker">
                      <span aria-hidden="true">{toArabicDigits(verse.number)}</span>
                      <span className="sr-only">Ayat {verse.number}</span>
                    </span>
                  </p>
                </div>

                {/* Terjemahan Bahasa Indonesia */}
                {showTranslation && (
                  <p className="text-sm sm:text-[15px] text-muted mt-4 pt-3 border-t border-border/50 leading-relaxed">
                    {verse.translation}
                  </p>
                )}

                {/* Panel Kontrol Fokus pada Ayat yang Sedang Dibaca (Requirement 4 & 5) */}
                {isActive && (
                  <div
                    className="mt-5 pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-xs text-muted">
                      Bacalah ayat ini dengan tartil, lalu tandai status bacaanmu:
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Tombol Tandai Perlu Diperiksa */}
                      <button
                        type="button"
                        onClick={() =>
                          updateVerseStatus(verse.number, "perlu_diperiksa", true)
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          savedStatus === "perlu_diperiksa"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-surface hover:bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <AlertCircle size={14} />
                        <span>Perlu Diperiksa</span>
                      </button>

                      {/* Reset ke Belum Dibaca jika sudah pernah ditandai */}
                      {(savedStatus === "selesai" ||
                        savedStatus === "perlu_diperiksa") && (
                        <button
                          type="button"
                          onClick={() =>
                            updateVerseStatus(verse.number, "sedang_dibaca", false)
                          }
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-background hover:bg-border/40 text-muted border border-border transition-colors cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>Reset Status</span>
                        </button>
                      )}

                      {/* Tombol Utama: Tandai Selesai & Lanjut Ayat Berikutnya */}
                      <button
                        type="button"
                        onClick={() => updateVerseStatus(verse.number, "selesai", true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-light text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 size={15} />
                        <span>
                          {index < verses.length - 1
                            ? "Selesai & Lanjut Ayat Berikutnya"
                            : "Tandai Selesai Ayat Terakhir"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Penutup Lembar Mushaf: Tombol Akhiri Sesi & Lihat Hasil */}
        <div className="px-4 sm:px-8 py-6 bg-[#F8F7F2]/60 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-text">
              Selesaikan Sesi Murajaah {range.surahName}
            </p>
            <p className="text-xs text-muted">
              Progress saat ini: {progressStats.completedCount} dari{" "}
              {progressStats.totalCount} ayat selesai ({progressStats.percentage}%).
            </p>
          </div>
          <button
            type="button"
            onClick={handleCompleteSession}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
          >
            <CheckCircle2 size={16} />
            <span>Selesai &amp; Lihat Hasil Murajaah</span>
          </button>
        </div>
      </section>

      {/* ====================================================================
          3. CATATAN PERSIAPAN INTEGRASI AI VOICE CORRECTION (Requirement 8)
      ==================================================================== */}
      {showVoicePrepInfo && (
        <div className="mt-4 p-4 rounded-2xl bg-surface border border-border text-xs text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-semibold text-text flex items-center gap-2">
              <Mic size={14} className="text-primary" />
              <span>Persiapan Koreksi Suara AI (Tahap Berikutnya)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                Status: {voiceSessionState.integrationStatus}
              </span>
            </div>
            <p className="leading-relaxed">
              Struktur state sesi dan ayat (`VerseSessionItemState` &amp; `VoiceCorrectionSessionState`)
              telah disiapkan untuk diintegrasikan dengan layanan Speech-to-Text dan AI koreksi bacaan.
              Saat ini evaluasi bacaan dilakukan secara mandiri per ayat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowVoicePrepInfo(false)}
            className="text-xs font-semibold text-primary hover:underline shrink-0 self-end sm:self-center cursor-pointer"
          >
            Tutup info
          </button>
        </div>
      )}

      {/* ====================================================================
          4. BOTTOM NAVIGATION BAR: KONTROL CEPAT ANTAR AYAT (NYAMAN DI HP)
      ==================================================================== */}
      <div className="fixed bottom-16 lg:bottom-4 inset-x-0 z-30 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto bg-surface/95 backdrop-blur-md border border-border rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center justify-between gap-2 pointer-events-auto">
          {/* Navigasi Ayat Sebelumnya */}
          <button
            type="button"
            onClick={() => focusVerseAtIndex(activeVerseIndex - 1, true)}
            disabled={activeVerseIndex <= 0}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:bg-primary/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Indikator Tengah & Tombol Cepat Tandai Selesai */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-medium text-muted hidden md:inline">
              Ayat <strong className="text-text">{activeVerse?.number}</strong> (
              {activeVerseIndex + 1}/{verses.length})
            </span>

            {activeVerse && (
              <button
                type="button"
                onClick={() => updateVerseStatus(activeVerse.number, "selesai", true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-light text-white transition-colors cursor-pointer"
              >
                <Check size={14} />
                <span>Selesai Ayat {activeVerse.number}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleVoicePrep}
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                voiceSessionState.isMicEnabled
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-background text-muted hover:text-text border-border"
              }`}
              title="Info kesiapan integrasi koreksi suara AI"
              aria-label="Info kesiapan integrasi koreksi suara AI"
            >
              <Mic size={15} />
            </button>

            <button
              type="button"
              onClick={handleResetSession}
              className="p-2 rounded-xl bg-background hover:bg-border/40 text-muted hover:text-text border border-border transition-colors cursor-pointer"
              title="Ulangi sesi dari ayat pertama"
              aria-label="Ulangi sesi dari ayat pertama"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Navigasi Ayat Berikutnya */}
          <button
            type="button"
            onClick={() => focusVerseAtIndex(activeVerseIndex + 1, true)}
            disabled={activeVerseIndex >= verses.length - 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:bg-primary/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
