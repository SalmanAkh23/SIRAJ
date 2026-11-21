"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  fetchBasmalah,
  fetchChapters,
  fetchSurahVerses,
  fetchTranslationEdition,
  isValidSurahNumber,
  revelationLabel,
  toArabicDigits,
  QURAN_RECITERS,
  readReciterId,
  saveReciterId,
  readLastRead,
  markVerseAsLastRead,
  type ChapterMeta,
  type QuranVerse,
  type TranslationEdition,
  type QuranLastRead,
} from "@/lib/quran-api";
import EmptyState from "@/components/empty-state";
import ThemeToggle from "@/components/theme-toggle";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Languages,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Volume2,
} from "lucide-react";

function padNumber(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

type ScaleKey = 1 | 2 | 3;
type LoadStatus = "loading" | "ready" | "error";

const SCALE_CLASS: Record<ScaleKey, string> = {
  1: "quran-arabic--sm",
  2: "quran-arabic--md",
  3: "quran-arabic--lg",
};
const TRANSLATION_SCALE: Record<ScaleKey, string> = {
  1: "1rem",
  2: "1.125rem",
  3: "1.25rem",
};

const KEY_TRANSLATION = "siraj-quran-show-translation";
const KEY_SCALE = "siraj-quran-arabic-scale";

/** Baca pengaturan tersimpan (aman saat SSR: kembali ke default). */
function readShowTranslation(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const value = localStorage.getItem(KEY_TRANSLATION);
    if (value !== null) return value === "1";
  } catch {
    // localStorage tidak tersedia
  }
  return true;
}

function readScale(): ScaleKey {
  if (typeof window === "undefined") return 2;
  try {
    const value = localStorage.getItem(KEY_SCALE);
    if (value === "1" || value === "2" || value === "3") {
      return Number(value) as ScaleKey;
    }
  } catch {
    // localStorage tidak tersedia
  }
  return 2;
}

function SurahSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="card mb-6 text-center py-8">
        <div className="skeleton h-5 w-28 mx-auto" />
        <div className="skeleton h-12 w-52 mx-auto mt-5" />
        <div className="skeleton h-5 w-40 mx-auto mt-4" />
        <div className="skeleton h-4 w-56 mx-auto mt-3" />
      </div>
      <div className="flex justify-center mb-6">
        <div className="skeleton h-10 w-72" />
      </div>
      <div className="card py-8 px-5 sm:px-8 space-y-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton h-6 w-full" />
            <div className="skeleton h-6 w-11/12" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SurahDetailPage() {
  const params = useParams<{ number: string }>();
  const surahNumber = Number(params.number);
  const isValid = isValidSurahNumber(surahNumber);
  const { isBookmarked, toggle } = useBookmarks();

  const [status, setStatus] = useState<LoadStatus>("loading");
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [chapter, setChapter] = useState<ChapterMeta | null>(null);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [edition, setEdition] = useState<TranslationEdition | null>(null);
  const [basmalah, setBasmalah] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [reciterId, setReciterId] = useState<number>(() => readReciterId());
  const [isSwitchingQari, setIsSwitchingQari] = useState(false);
  const [lastRead, setLastRead] = useState<QuranLastRead | null>(null);

  const [showTranslation, setShowTranslation] = useState<boolean>(() =>
    readShowTranslation()
  );
  const [scale, setScale] = useState<ScaleKey>(() => readScale());
  const [translationScale, setTranslationScale] = useState<ScaleKey>(2);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const versesRef = useRef<QuranVerse[]>([]);
  const initialHashScrolledRef = useRef<boolean>(false);

  // Sinkronkan ayat terkini untuk pemutar audio (sequential playback)
  useEffect(() => {
    versesRef.current = verses;
  }, [verses]);

  // Muat penanda bacaan terakhir dari localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi penanda terakhir dibaca saat mount
    setLastRead(readLastRead());
  }, [surahNumber]);

  // Satu elemen audio dipakai ulang untuk seluruh surah
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const handleEnded = () => {
      const currentKey = audio.dataset.verseKey ?? "";
      const list = versesRef.current;
      const index = list.findIndex((verse) => verse.key === currentKey);
      const next = list.slice(index + 1).find((verse) => verse.audioUrl);
      if (next?.audioUrl) {
        audio.src = next.audioUrl;
        audio.dataset.verseKey = next.key;
        setPlayingKey(next.key);
        void audio.play().catch(() => setPlayingKey(null));
      } else {
        setPlayingKey(null);
      }
    };

    const handleError = () => {
      setPlayingKey(null);
      setNotice("File audio dari Qari ini tidak dapat dimuat. Coba Qari lain.");
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Muat metadata + seluruh ayat surah dari Quran.com API
  useEffect(() => {
    if (!isValid) return;
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state memuat saat berpindah surah / percobaan ulang
    setStatus("loading");
    setPlayingKey(null);
    initialHashScrolledRef.current = false;
    audioRef.current?.pause();

    (async () => {
      try {
        const currentQari = readReciterId();
        const [chapterList, verseList, editionInfo] = await Promise.all([
          fetchChapters(),
          fetchSurahVerses(surahNumber, currentQari),
          fetchTranslationEdition(),
        ]);
        const meta = chapterList.find((item) => item.id === surahNumber);
        if (!meta) throw new Error("Surah tidak ditemukan.");

        const basmalahText = meta.bismillah_pre
          ? await fetchBasmalah().catch(() => null)
          : null;

        if (cancelled) return;
        setChapters(chapterList);
        setChapter(meta);
        setVerses(verseList);
        setEdition(editionInfo);
        setBasmalah(basmalahText);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat surah ini."
        );
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [surahNumber, isValid, reloadKey]);

  // Gulir otomatis ke ayat pada hash URL (mis. #ayat-6)
  useEffect(() => {
    if (status !== "ready" || verses.length === 0 || initialHashScrolledRef.current) {
      return;
    }
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    const targetId = hash.replace(/^#/, "");
    const el = document.getElementById(targetId);
    if (el) {
      initialHashScrolledRef.current = true;
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [status, verses]);

  // Notifikasi sementara (bagikan / audio)
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!isValid) notFound();

  const currentIndex = chapters.findIndex((item) => item.id === surahNumber);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;

  const chapterName = chapter?.name_simple ?? "";
  const currentReciter =
    QURAN_RECITERS.find((r) => r.id === reciterId) ?? QURAN_RECITERS[0];

  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlayingKey(null);
  };

  const playVerseAudio = (verse: QuranVerse) => {
    if (!verse.audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (playingKey === verse.key) {
      stopAudio();
      return;
    }
    audio.pause();
    audio.src = verse.audioUrl;
    audio.dataset.verseKey = verse.key;
    setPlayingKey(verse.key);
    audio.play().catch(() => {
      setPlayingKey(null);
      setNotice("Audio tidak dapat diputar. Coba lagi nanti.");
    });
  };

  const toggleSurahAudio = () => {
    if (playingKey) {
      stopAudio();
      return;
    }
    const first = verses.find((verse) => verse.audioUrl);
    if (first) {
      playVerseAudio(first);
    } else {
      setNotice("Audio untuk surah ini tidak tersedia.");
    }
  };

  const handleReciterChange = async (nextReciterId: number) => {
    if (nextReciterId === reciterId) return;
    const wasPlayingKey = playingKey;
    stopAudio();
    setReciterId(nextReciterId);
    saveReciterId(nextReciterId);
    setIsSwitchingQari(true);

    try {
      const updatedVerses = await fetchSurahVerses(surahNumber, nextReciterId);
      setVerses(updatedVerses);
      const qariName =
        QURAN_RECITERS.find((r) => r.id === nextReciterId)?.name ?? "Qari baru";
      setNotice(`Qari diubah ke ${qariName}.`);

      if (wasPlayingKey) {
        const resumeVerse = updatedVerses.find((v) => v.key === wasPlayingKey);
        if (resumeVerse?.audioUrl && audioRef.current) {
          audioRef.current.src = resumeVerse.audioUrl;
          audioRef.current.dataset.verseKey = resumeVerse.key;
          setPlayingKey(resumeVerse.key);
          void audioRef.current.play().catch(() => setPlayingKey(null));
        }
      }
    } catch {
      setNotice("Gagal memuat audio Qari yang dipilih.");
    } finally {
      setIsSwitchingQari(false);
    }
  };

  const handleMarkLastRead = (verse: QuranVerse) => {
    const { lastRead: updated } = markVerseAsLastRead({
      mode: "surah",
      surahNumber,
      surahName: chapterName || `Surah ${surahNumber}`,
      verseNumber: verse.number,
    });
    setLastRead(updated);
    setNotice(
      `Ditandai terakhir dibaca: QS. ${chapterName} Ayat ${verse.number} (Juz ${updated.juzNumber}).`
    );
  };

  const toggleTranslation = () => {
    const next = !showTranslation;
    setShowTranslation(next);
    try {
      localStorage.setItem(KEY_TRANSLATION, next ? "1" : "0");
    } catch {
      // Storage tidak tersedia — pengaturan tetap berlaku di sesi ini
    }
  };

  const changeScale = (next: ScaleKey) => {
    setScale(next);
    try {
      localStorage.setItem(KEY_SCALE, String(next));
    } catch {
      // Storage tidak tersedia — pengaturan tetap berlaku di sesi ini
    }
  };

  const toggleReadingMode = () => {
    if (!isReadingMode && !showTranslation) {
      toggleTranslation();
    }
    setIsReadingMode((active) => !active);
  };

  const handleShare = async (verse: QuranVerse) => {
    const title = `QS. ${chapterName}: ${verse.number}`;
    const text = `${title}\n\n"${verse.translation}"\n\n— SIRAJ`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotice("Ayat disalin ke clipboard.");
    } catch {
      setNotice("Ayat tidak dapat dibagikan saat ini.");
    }
  };

  return (
    <div
      className="quran-reader max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10"
      data-reading-mode={isReadingMode ? "true" : "false"}
    >
      {/* Kembali */}
      <Link
        href="/quran"
        data-reading-hide
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Kembali ke daftar surah
      </Link>

      {/* Notifikasi */}
      {notice && (
        <div
          role="status"
          className="mb-6 px-4 py-3 bg-primary/[0.06] border border-primary/15 rounded-xl text-sm text-primary animate-fade-in"
        >
          {notice}
        </div>
      )}

      {status === "loading" && <SurahSkeleton />}

      {status === "error" && (
        <EmptyState
          icon={AlertCircle}
          title="Surah gagal dimuat"
          description={errorMessage}
        >
          <button
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-primary text-sm !py-2.5"
          >
            <RotateCcw size={15} />
            Coba lagi
          </button>
        </EmptyState>
      )}

      {status === "ready" && chapter && (
        <>
          {/* Header surah */}
          <header data-reading-hide className="card relative overflow-hidden mb-6 text-center">
            <div
              className="absolute inset-0 pattern-star pattern-fade opacity-[0.05] pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center text-xs font-medium text-primary bg-primary/[0.07] border border-primary/10 rounded-full px-3 py-1">
                  Surah {padNumber(chapter.id)}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-medium rounded-full px-3 py-1 border ${
                    revelationLabel(chapter.revelation_place) === "Makkiyah"
                      ? "bg-primary/[0.07] border-primary/10 text-primary"
                      : "bg-secondary/15 border-secondary/30 text-secondary-dark"
                  }`}
                >
                  {revelationLabel(chapter.revelation_place)}
                </span>
              </div>

              <div className="mt-5">
                <div className="relative inline-flex items-center justify-center gap-4 px-7 py-2.5 border border-secondary/45">
                  <span
                    className="w-1.5 h-1.5 rotate-45 bg-secondary/80 shrink-0"
                    aria-hidden="true"
                  />
                  <p
                    className="arabic-text text-3xl sm:text-4xl leading-[1.9]"
                    lang="ar"
                  >
                    {chapter.name_arabic}
                  </p>
                  <span
                    className="w-1.5 h-1.5 rotate-45 bg-secondary/80 shrink-0"
                    aria-hidden="true"
                  />
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-text tracking-tight mt-4">
                  {chapter.name_simple}
                </h1>
                <p className="text-sm text-muted mt-1">
                  {chapter.translated_name.name}
                </p>
                <p className="text-xs text-muted mt-3">
                  {chapter.verses_count} Ayat • Turun di{" "}
                  {revelationLabel(chapter.revelation_place) === "Makkiyah"
                    ? "Makkah"
                    : "Madinah"}
                </p>
              </div>
            </div>
          </header>

          {/* Toolbar bacaan & Multi-Qari */}
          <div
            className={`z-20 mb-6 px-2.5 py-2 bg-surface/90 backdrop-blur-md border border-border/70 rounded-xl shadow-xs ${
              isReadingMode ? "" : "sticky top-14 lg:top-4"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={toggleTranslation}
                  aria-pressed={showTranslation || isReadingMode}
                  disabled={isReadingMode}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    showTranslation || isReadingMode
                      ? "bg-primary text-white"
                      : "text-muted hover:text-text hover:bg-primary/[0.05]"
                  }`}
                  title={
                    isReadingMode
                      ? "Terjemahan selalu ditampilkan dalam Mode Baca"
                      : showTranslation
                      ? "Sembunyikan terjemahan"
                      : "Tampilkan terjemahan"
                  }
                >
                  <Languages size={15} />
                  Terjemahan
                </button>

                <span
                  className="w-px h-5 bg-border mx-1.5"
                  aria-hidden="true"
                />

                <button
                  onClick={() =>
                    changeScale(Math.max(1, scale - 1) as ScaleKey)
                  }
                  disabled={scale === 1}
                  aria-label="Perkecil teks Arab"
                  title="Perkecil teks Arab"
                  className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-muted hover:text-text hover:bg-primary/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  A−
                </button>
                <button
                  onClick={() =>
                    changeScale(Math.min(3, scale + 1) as ScaleKey)
                  }
                  disabled={scale === 3}
                  aria-label="Perbesar teks Arab"
                  title="Perbesar teks Arab"
                  className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-muted hover:text-text hover:bg-primary/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  A+
                </button>
                {isReadingMode && (
                  <>
                    <span className="w-px h-5 bg-border mx-1.5" aria-hidden="true" />
                    <span className="text-xs text-muted hidden sm:inline">Terjemahan</span>
                    <button
                      onClick={() =>
                        setTranslationScale(
                          Math.max(1, translationScale - 1) as ScaleKey
                        )
                      }
                      disabled={translationScale === 1}
                      aria-label="Perkecil teks terjemahan"
                      title="Perkecil teks terjemahan"
                      className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-muted hover:text-text hover:bg-primary/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      A−
                    </button>
                    <button
                      onClick={() =>
                        setTranslationScale(
                          Math.min(3, translationScale + 1) as ScaleKey
                        )
                      }
                      disabled={translationScale === 3}
                      aria-label="Perbesar teks terjemahan"
                      title="Perbesar teks terjemahan"
                      className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-muted hover:text-text hover:bg-primary/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      A+
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Pilihan Qari */}
                <div className="inline-flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1">
                  <Volume2 size={14} className="text-primary shrink-0" />
                  <label htmlFor="surah-reciter-select" className="sr-only">
                    Pilih Qari Murottal
                  </label>
                  <select
                    id="surah-reciter-select"
                    value={reciterId}
                    disabled={isSwitchingQari}
                    onChange={(e) => handleReciterChange(Number(e.target.value))}
                    className="bg-transparent text-xs font-medium text-text focus:outline-none max-w-[165px] sm:max-w-[200px]"
                  >
                    {QURAN_RECITERS.map((qari) => (
                      <option key={qari.id} value={qari.id}>
                        {qari.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={toggleSurahAudio}
                  disabled={isSwitchingQari}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-primary bg-primary/[0.06] hover:bg-primary/[0.12] transition-colors cursor-pointer disabled:opacity-50"
                  title={
                    playingKey ? "Hentikan murottal" : "Putar murottal surah"
                  }
                >
                  {playingKey ? <Pause size={15} /> : <Play size={15} />}
                  {isSwitchingQari
                    ? "Memuat Qari..."
                    : playingKey
                    ? "Hentikan"
                    : "Putar surah"}
                </button>
                <button
                  type="button"
                  onClick={toggleReadingMode}
                  aria-pressed={isReadingMode}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs sm:text-sm font-medium text-primary transition-colors hover:bg-primary/[0.06]"
                >
                  <BookOpen size={15} />
                  {isReadingMode ? "Keluar Mode Baca" : "Mode Baca"}
                </button>
                <ThemeToggle compact />
              </div>
            </div>
          </div>

          {/* Bacaan mushaf */}
          <section className="card quran-reading-content px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
            {basmalah && (
              <div className="text-center pb-5 mb-2 border-b border-border/70">
                <p
                  className={`quran-arabic ${SCALE_CLASS[scale]} text-center`}
                  lang="ar"
                  dir="rtl"
                >
                  {basmalah}
                </p>
              </div>
            )}

            <div className="flex flex-col">
              {verses.map((verse, index) => {
                const bookmarkId = `ayat-${surahNumber}-${verse.number}`;
                const saved = isBookmarked(bookmarkId);
                const isPlaying = playingKey === verse.key;
                const isLastReadVerse = lastRead?.verseKey === verse.key;

                return (
                  <article
                    key={verse.key}
                    id={`ayat-${verse.number}`}
                    aria-current={isPlaying || isLastReadVerse ? "location" : undefined}
                    className={`py-6 scroll-mt-32 rounded-xl px-2 sm:px-3 transition-colors duration-200 ${
                      isPlaying
                        ? "bg-primary/[0.04] ring-1 ring-primary/20 border-s-2 border-primary ps-3"
                        : isLastReadVerse
                        ? "bg-[#D6B878]/[0.08] ring-1 ring-[#D6B878]/50"
                        : ""
                    } ${
                      index < verses.length - 1
                        ? "border-b border-border/60"
                        : ""
                    }`}
                  >
                    {/* Teks Arab Uthmani */}
                    <p
                      className={`quran-arabic ${SCALE_CLASS[scale]}`}
                      lang="ar"
                      dir="rtl"
                    >
                      {verse.arabic}
                      <span className="ayah-marker">
                        <span aria-hidden="true">
                          {toArabicDigits(verse.number)}
                        </span>
                        <span className="sr-only">Ayat {verse.number}</span>
                      </span>
                    </p>

                    {/* Terjemahan */}
                    {(showTranslation || isReadingMode) && (
                      <div className="mt-5">
                        <div
                          className="flex items-center gap-3 mb-3"
                          aria-hidden="true"
                        >
                          <span className="h-px flex-1 bg-border/80" />
                          <span className="w-1.5 h-1.5 rotate-45 bg-secondary/70" />
                          <span className="h-px flex-1 bg-border/80" />
                        </div>
                        <p
                          className="text-[0.97rem] sm:text-base leading-relaxed text-text/85"
                          style={{
                            fontSize: isReadingMode
                              ? TRANSLATION_SCALE[translationScale]
                              : undefined,
                          }}
                        >
                          {verse.translation}
                        </p>
                      </div>
                    )}

                    {/* Aksi ayat */}
                    <div className="flex flex-wrap items-center justify-end gap-1 mt-3">
                      <button
                        type="button"
                        onClick={() => handleMarkLastRead(verse)}
                        data-reading-hide
                        className={`reading-secondary-action inline-flex min-h-11 items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 cursor-pointer ${
                          isLastReadVerse
                            ? "bg-primary text-white"
                            : "text-muted hover:text-primary hover:bg-primary/[0.05]"
                        }`}
                        title="Tandai sebagai ayat terakhir dibaca"
                      >
                        <CheckCircle2 size={14} />
                        <span>
                          {isLastReadVerse ? "Terakhir Dibaca" : "Tandai Dibaca"}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          toggle({
                            id: bookmarkId,
                            type: "ayat",
                            title: `${chapterName}: ${verse.number}`,
                            description: verse.translation,
                            href: `/quran/${surahNumber}#ayat-${verse.number}`,
                          })
                        }
                        className={`min-h-11 min-w-11 p-2.5 rounded-xl transition-colors duration-200 cursor-pointer ${
                          saved
                            ? "text-primary bg-primary/[0.08]"
                            : "text-muted hover:text-primary hover:bg-primary/[0.05]"
                        }`}
                        aria-label={
                          saved ? "Hapus bookmark ayat" : "Simpan ayat ke bookmark"
                        }
                        title={saved ? "Tersimpan" : "Bookmark"}
                      >
                        <Bookmark
                          size={16}
                          fill={saved ? "currentColor" : "none"}
                          strokeWidth={1.8}
                        />
                      </button>

                      <button
                        onClick={() => playVerseAudio(verse)}
                        disabled={!verse.audioUrl || isSwitchingQari}
                        className={`min-h-11 min-w-11 p-2.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isPlaying
                            ? "text-primary bg-primary/[0.08]"
                            : "text-muted hover:text-primary hover:bg-primary/[0.05]"
                        }`}
                        aria-label={
                          isPlaying ? "Hentikan audio ayat" : "Putar audio ayat"
                        }
                        title={
                          verse.audioUrl
                            ? `Putar audio (${currentReciter.name})`
                            : "Audio tidak tersedia"
                        }
                      >
                        {isPlaying ? (
                          <Pause size={16} strokeWidth={1.8} />
                        ) : (
                          <Play size={16} strokeWidth={1.8} />
                        )}
                      </button>

                      <button
                        onClick={() => handleShare(verse)}
                        data-reading-hide
                        className="reading-secondary-action min-h-11 min-w-11 p-2.5 rounded-xl text-muted hover:text-primary hover:bg-primary/[0.05] transition-colors duration-200 cursor-pointer"
                        aria-label="Bagikan ayat"
                        title="Bagikan"
                      >
                        <Share2 size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Sumber terjemahan & data */}
          {edition && (
            <p data-reading-hide className="text-xs text-muted text-center mt-6 leading-relaxed">
              Terjemahan Bahasa Indonesia — {edition.name}
              <br />
              Teks Arab: Mushaf Utsmani • Qari: {currentReciter.name} • Data dan
              audio: Quran.com API v4
            </p>
          )}

          {/* Navigasi surah */}
          <nav
            data-reading-hide
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-8"
            aria-label="Navigasi surah"
          >
            {prevChapter ? (
              <Link
                href={`/quran/${prevChapter.id}`}
                className="btn-secondary text-sm !py-2.5 justify-start min-w-0 max-w-full"
              >
                <ChevronLeft size={16} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-normal text-muted">
                    Surah sebelumnya
                  </span>
                  <span className="block font-medium truncate">
                    {prevChapter.name_simple}
                  </span>
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            <Link href="/quran" className="btn-ghost text-sm shrink-0">
              Daftar surah
            </Link>

            {nextChapter ? (
              <Link
                href={`/quran/${nextChapter.id}`}
                className="btn-secondary text-sm !py-2.5 flex-row-reverse justify-start min-w-0 max-w-full justify-self-end"
              >
                <ChevronRight size={16} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-normal text-muted">
                    Surah berikutnya
                  </span>
                  <span className="block font-medium truncate">
                    {nextChapter.name_simple}
                  </span>
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </nav>
        </>
      )}
    </div>
  );
}
