"use client";

import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  fetchBasmalah,
  fetchChapters,
  fetchJuzs,
  fetchJuzVerses,
  fetchTranslationEdition,
  isValidJuzNumber,
  revelationLabel,
  toArabicDigits,
  QURAN_RECITERS,
  readReciterId,
  saveReciterId,
  readJuzProgressMap,
  markVerseAsLastRead,
  type ChapterMeta,
  type JuzMeta,
  type QuranVerse,
  type TranslationEdition,
  type JuzProgressEntry,
} from "@/lib/quran-api";
import EmptyState from "@/components/empty-state";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Languages,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Volume2,
  SkipForward,
  SkipBack,
  Square,
  Compass,
  ExternalLink,
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

const KEY_TRANSLATION = "siraj-quran-show-translation";
const KEY_SCALE = "siraj-quran-arabic-scale";

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

function JuzSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="card mb-6 text-center py-8">
        <div className="skeleton h-5 w-28 mx-auto" />
        <div className="skeleton h-10 w-48 mx-auto mt-4" />
        <div className="skeleton h-5 w-64 mx-auto mt-3" />
        <div className="skeleton h-4 w-52 mx-auto mt-3" />
      </div>
      <div className="flex justify-center mb-6">
        <div className="skeleton h-12 w-full max-w-2xl rounded-xl" />
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

export default function JuzDetailPage() {
  const params = useParams<{ number: string }>();
  const router = useRouter();
  const juzNumber = Number(params.number);
  const isValid = isValidJuzNumber(juzNumber);
  const { isBookmarked, toggle } = useBookmarks();

  const [status, setStatus] = useState<LoadStatus>("loading");
  const [chaptersMap, setChaptersMap] = useState<Map<number, ChapterMeta>>(
    () => new Map()
  );
  const [juzMeta, setJuzMeta] = useState<JuzMeta | null>(null);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [edition, setEdition] = useState<TranslationEdition | null>(null);
  const [basmalah, setBasmalah] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [reciterId, setReciterId] = useState<number>(() => readReciterId());
  const [isSwitchingQari, setIsSwitchingQari] = useState(false);

  const [showTranslation, setShowTranslation] = useState<boolean>(() =>
    readShowTranslation()
  );
  const [scale, setScale] = useState<ScaleKey>(() => readScale());
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [juzProgress, setJuzProgress] = useState<JuzProgressEntry | null>(null);
  const [jumpSurah, setJumpSurah] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const versesRef = useRef<QuranVerse[]>([]);
  const initialHashScrolledRef = useRef<boolean>(false);

  // Sinkronkan daftar ayat terkini untuk pemutar audio berurutan lintas surah
  useEffect(() => {
    versesRef.current = verses;
  }, [verses]);

  // Muat progres bacaan Juz dari localStorage
  useEffect(() => {
    if (!isValid) return;
    const map = readJuzProgressMap();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- inisialisasi progres tersimpan dari localStorage
    setJuzProgress(map[juzNumber] ?? null);
  }, [juzNumber, isValid]);

  // Satu elemen audio tunggal untuk seluruh Juz (mendukung perpindahan otomatis lintas surah)
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
        setIsPaused(false);
        void audio.play().catch(() => {
          setPlayingKey(null);
          setIsPaused(false);
          setNotice("Gagal memuat audio ayat berikutnya.");
        });
      } else {
        setPlayingKey(null);
        setIsPaused(false);
      }
    };

    const handleError = () => {
      setPlayingKey(null);
      setIsPaused(false);
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

  // Muat metadata + seluruh ayat Juz ketika nomor Juz berubah
  useEffect(() => {
    if (!isValid) return;
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state saat berganti nomor Juz
    setStatus("loading");
    setPlayingKey(null);
    setIsPaused(false);
    initialHashScrolledRef.current = false;
    audioRef.current?.pause();

    (async () => {
      try {
        const currentQari = readReciterId();
        const [chapterList, juzList, verseList, editionInfo, basmalahText] =
          await Promise.all([
            fetchChapters(),
            fetchJuzs(),
            fetchJuzVerses(juzNumber, currentQari),
            fetchTranslationEdition(),
            fetchBasmalah().catch(() => null),
          ]);

        if (cancelled) return;

        const cMap = new Map<number, ChapterMeta>();
        for (const ch of chapterList) {
          cMap.set(ch.id, ch);
        }

        const currentJuzMeta = juzList.find((j) => j.juzNumber === juzNumber);
        if (!currentJuzMeta) throw new Error("Juz tidak ditemukan.");

        setChaptersMap(cMap);
        setJuzMeta(currentJuzMeta);
        setVerses(verseList);
        setEdition(editionInfo);
        setBasmalah(basmalahText);
        setJumpSurah(String(currentJuzMeta.startSurahNumber));
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat Juz ini."
        );
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [juzNumber, isValid, reloadKey]);

  // Gulir otomatis ke ayat pada hash URL (mis. #ayat-2-45) setelah ayat selesai dimuat
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

  // Notifikasi sementara
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!isValid) notFound();

  const currentReciter =
    QURAN_RECITERS.find((r) => r.id === reciterId) ?? QURAN_RECITERS[0];

  const activePlayingVerse = useMemo(
    () => verses.find((v) => v.key === playingKey) ?? null,
    [verses, playingKey]
  );

  const prevJuzNumber = juzNumber > 1 ? juzNumber - 1 : null;
  const nextJuzNumber = juzNumber < 30 ? juzNumber + 1 : null;

  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlayingKey(null);
    setIsPaused(false);
  };

  const playVerseAudio = (verse: QuranVerse) => {
    if (!verse.audioUrl) {
      setNotice("Audio untuk ayat ini tidak tersedia.");
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;

    if (playingKey === verse.key) {
      if (isPaused) {
        setIsPaused(false);
        audio.play().catch(() => {
          setPlayingKey(null);
          setIsPaused(false);
        });
      } else {
        audio.pause();
        setIsPaused(true);
      }
      return;
    }

    audio.pause();
    audio.src = verse.audioUrl;
    audio.dataset.verseKey = verse.key;
    setPlayingKey(verse.key);
    setIsPaused(false);
    audio.play().catch(() => {
      setPlayingKey(null);
      setIsPaused(false);
      setNotice("Audio tidak dapat diputar. Coba lagi atau ganti Qari.");
    });
  };

  const playAdjacentVerse = (direction: -1 | 1) => {
    if (!playingKey) return;
    const idx = verses.findIndex((v) => v.key === playingKey);
    if (idx === -1) return;
    const target = verses[idx + direction];
    if (target?.audioUrl) {
      playVerseAudio(target);
      const el = document.getElementById(`ayat-${target.chapterId}-${target.number}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleJuzAudio = () => {
    if (playingKey) {
      stopAudio();
      return;
    }
    // Jika ada ayat terakhir dibaca di Juz ini, tawarkan mulai dari awal atau lanjutkan
    const first = verses.find((verse) => verse.audioUrl);
    if (first) {
      playVerseAudio(first);
    } else {
      setNotice("Audio untuk Juz ini tidak tersedia.");
    }
  };

  const handleReciterChange = async (nextReciterId: number) => {
    if (nextReciterId === reciterId) return;
    const wasPlayingKey = playingKey && !isPaused ? playingKey : null;
    stopAudio();
    setReciterId(nextReciterId);
    saveReciterId(nextReciterId);
    setIsSwitchingQari(true);

    try {
      const updatedVerses = await fetchJuzVerses(juzNumber, nextReciterId);
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
          setIsPaused(false);
          void audioRef.current.play().catch(() => {
            setPlayingKey(null);
          });
        }
      }
    } catch {
      setNotice("Gagal memuat audio Qari yang dipilih. Coba lagi.");
    } finally {
      setIsSwitchingQari(false);
    }
  };

  const handleMarkLastRead = (verse: QuranVerse) => {
    const surahMeta = chaptersMap.get(verse.chapterId);
    const surahName = surahMeta?.name_simple ?? `Surah ${verse.chapterId}`;
    const { juzProgress: updatedProgress } = markVerseAsLastRead({
      mode: "juz",
      juzNumber,
      surahNumber: verse.chapterId,
      surahName,
      verseNumber: verse.number,
    });
    setJuzProgress(updatedProgress);
    setNotice(
      `Ditandai terakhir dibaca: QS. ${surahName} Ayat ${verse.number} (${updatedProgress.percentage}% Juz ${juzNumber}).`
    );
  };

  const handleJumpToSurah = (surahNumStr: string) => {
    setJumpSurah(surahNumStr);
    const el = document.getElementById(`surah-section-${surahNumStr}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToLastReadInJuz = () => {
    if (!juzProgress) return;
    const el = document.getElementById(
      `ayat-${juzProgress.lastSurahNumber}-${juzProgress.lastVerseNumber}`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleTranslation = () => {
    const next = !showTranslation;
    setShowTranslation(next);
    try {
      localStorage.setItem(KEY_TRANSLATION, next ? "1" : "0");
    } catch {
      // abaikan
    }
  };

  const changeScale = (next: ScaleKey) => {
    setScale(next);
    try {
      localStorage.setItem(KEY_SCALE, String(next));
    } catch {
      // abaikan
    }
  };

  const handleShare = async (verse: QuranVerse) => {
    const surahName =
      chaptersMap.get(verse.chapterId)?.name_simple ?? `Surah ${verse.chapterId}`;
    const title = `QS. ${surahName}: ${verse.number} (Juz ${juzNumber})`;
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Baris Navigasi Atas: Kembali ke Daftar Juz & Lompat Antar-Juz */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          href="/quran?mode=juz"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar 30 Juz
        </Link>

        <div className="flex items-center gap-2">
          <label htmlFor="juz-quick-select" className="text-xs text-muted">
            Pilih Juz:
          </label>
          <select
            id="juz-quick-select"
            value={juzNumber}
            onChange={(e) => router.push(`/quran/juz/${e.target.value}`)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs sm:text-sm font-semibold text-text focus:outline-none focus:border-primary"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Juz {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifikasi */}
      {notice && (
        <div
          role="status"
          className="mb-6 px-4 py-3 bg-primary/[0.06] border border-primary/15 rounded-xl text-sm text-primary animate-fade-in"
        >
          {notice}
        </div>
      )}

      {status === "loading" && <JuzSkeleton />}

      {status === "error" && (
        <EmptyState
          icon={AlertCircle}
          title={`Juz ${juzNumber} gagal dimuat`}
          description={errorMessage}
        >
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-primary text-sm !py-2.5"
          >
            <RotateCcw size={15} />
            Coba lagi
          </button>
        </EmptyState>
      )}

      {status === "ready" && juzMeta && (
        <>
          {/* Header Utama Juz */}
          <header className="card relative overflow-hidden mb-6 text-center border-[#D6B878]/45">
            <div
              className="absolute inset-0 pattern-star pattern-fade opacity-[0.05] pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center text-xs font-semibold text-primary bg-primary/[0.08] border border-primary/15 rounded-full px-3.5 py-1">
                  Juz {padNumber(juzMeta.juzNumber)} dari 30
                </span>
                <span className="inline-flex items-center text-xs font-medium text-secondary-dark bg-secondary/15 border border-secondary/35 rounded-full px-3.5 py-1">
                  {verses.length} Ayat • {juzMeta.segments.length} Surah
                </span>
              </div>

              <div className="mt-5">
                {juzMeta.nameArabic && (
                  <div className="relative inline-flex items-center justify-center gap-4 px-7 py-2.5 border border-secondary/45 bg-[#F8F7F2]/60 rounded-xl">
                    <span
                      className="w-1.5 h-1.5 rotate-45 bg-secondary/80 shrink-0"
                      aria-hidden="true"
                    />
                    <p
                      className="arabic-text text-3xl sm:text-4xl leading-[1.9] text-primary"
                      lang="ar"
                    >
                      {juzMeta.nameArabic}
                    </p>
                    <span
                      className="w-1.5 h-1.5 rotate-45 bg-secondary/80 shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <h1 className="text-2xl lg:text-3xl font-bold text-text tracking-tight mt-4">
                  Juz {juzMeta.juzNumber} — {juzMeta.nameLatin}
                </h1>
                <p className="text-sm text-muted mt-1.5">
                  Mulai <strong className="text-text">QS. {juzMeta.startSurahName}: {juzMeta.startVerse}</strong>{" "}
                  sampai <strong className="text-text">QS. {juzMeta.endSurahName}: {juzMeta.endVerse}</strong>
                </p>

                {/* Ringkasan Surah di dalam Juz */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                  {juzMeta.segments.map((seg) => (
                    <button
                      key={seg.surahNumber}
                      type="button"
                      onClick={() => handleJumpToSurah(String(seg.surahNumber))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8F7F2] hover:bg-primary/[0.08] text-text hover:text-primary border border-border transition-colors cursor-pointer"
                      title={`Lompat ke QS. ${seg.surahNameLatin} ayat ${seg.startVerse}–${seg.endVerse}`}
                    >
                      <span>{seg.surahNameLatin}</span>
                      <span className="text-muted text-[11px]">
                        ({seg.startVerse}–{seg.endVerse})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Progres Membaca Juz & Tombol Lanjutkan */}
                {juzProgress && (
                  <div className="max-w-md mx-auto mt-5 pt-4 border-t border-border/70">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted">
                        Terakhir dibaca:{" "}
                        <strong className="text-text">
                          QS. {juzProgress.lastSurahName}: {juzProgress.lastVerseNumber}
                        </strong>
                      </span>
                      <span className="font-bold text-primary">
                        Progres {juzProgress.percentage}%
                      </span>
                    </div>
                    <div className="progress-bar h-2 mb-3">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${juzProgress.percentage}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={scrollToLastReadInJuz}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Lompat ke ayat terakhir dibaca</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Sticky Toolbar: Terjemahan, Ukuran Huruf, Pilihan Multi-Qari, Lompat Surah, & Putar Audio */}
          <div className="sticky top-14 lg:top-4 z-20 mb-6 p-2.5 bg-surface/90 backdrop-blur-md border border-border/80 rounded-2xl shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Kontrol Tampilan Bacaan */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleTranslation}
                  aria-pressed={showTranslation}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    showTranslation
                      ? "bg-primary text-white"
                      : "text-muted hover:text-text hover:bg-primary/[0.05]"
                  }`}
                  title={
                    showTranslation
                      ? "Sembunyikan terjemahan"
                      : "Tampilkan terjemahan"
                  }
                >
                  <Languages size={15} />
                  <span>Terjemahan</span>
                </button>

                <span className="w-px h-5 bg-border mx-1" aria-hidden="true" />

                <button
                  type="button"
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
                  type="button"
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
              </div>

              {/* Pilihan Qari & Putar Audio Juz */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Navigasi Cepat ke Surah dalam Juz (bila > 1 surah) */}
                {juzMeta.segments.length > 1 && (
                  <div className="inline-flex items-center gap-1.5 bg-[#F8F7F2] border border-border rounded-lg px-2.5 py-1">
                    <Compass size={13} className="text-primary shrink-0" />
                    <label htmlFor="jump-surah-select" className="sr-only">
                      Lompat ke surah dalam Juz ini
                    </label>
                    <select
                      id="jump-surah-select"
                      value={jumpSurah}
                      onChange={(e) => handleJumpToSurah(e.target.value)}
                      className="bg-transparent text-xs font-medium text-text focus:outline-none max-w-[140px]"
                    >
                      {juzMeta.segments.map((seg) => (
                        <option key={seg.surahNumber} value={seg.surahNumber}>
                          QS. {seg.surahNameLatin} ({seg.startVerse}–{seg.endVerse})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Selector Multi-Qari */}
                <div className="inline-flex items-center gap-1.5 bg-[#F8F7F2] border border-border rounded-lg px-2.5 py-1">
                  <Volume2 size={14} className="text-primary shrink-0" />
                  <label htmlFor="juz-reciter-select" className="sr-only">
                    Pilih Qari Murottal
                  </label>
                  <select
                    id="juz-reciter-select"
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

                {/* Tombol Putar / Hentikan Murottal Juz */}
                <button
                  type="button"
                  onClick={toggleJuzAudio}
                  disabled={isSwitchingQari}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-primary bg-primary/[0.08] hover:bg-primary/[0.14] transition-colors cursor-pointer disabled:opacity-50"
                  title={
                    playingKey ? "Hentikan murottal" : "Putar murottal Juz ini"
                  }
                >
                  {playingKey && !isPaused ? <Pause size={15} /> : <Play size={15} />}
                  <span>
                    {isSwitchingQari
                      ? "Memuat Qari..."
                      : playingKey
                      ? "Hentikan"
                      : "Putar Juz"}
                  </span>
                </button>
              </div>
            </div>

            {/* Panel Status Audio Aktif (Now Playing Bar) */}
            {activePlayingVerse && (
              <div className="mt-2 pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                  <span className="font-semibold text-primary truncate">
                    {isPaused ? "Dijeda:" : "Memutar:"} QS.{" "}
                    {chaptersMap.get(activePlayingVerse.chapterId)?.name_simple ??
                      `Surah ${activePlayingVerse.chapterId}`}{" "}
                    Ayat {activePlayingVerse.number}
                  </span>
                  <span className="text-muted hidden sm:inline">
                    • {currentReciter.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => playAdjacentVerse(-1)}
                    className="p-1.5 rounded-md hover:bg-primary/10 text-muted hover:text-primary transition-colors cursor-pointer"
                    title="Ayat sebelumnya"
                    aria-label="Putar ayat sebelumnya"
                  >
                    <SkipBack size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => playVerseAudio(activePlayingVerse)}
                    className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    title={isPaused ? "Lanjutkan" : "Jeda"}
                    aria-label={isPaused ? "Lanjutkan pemutaran" : "Jeda pemutaran"}
                  >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => playAdjacentVerse(1)}
                    className="p-1.5 rounded-md hover:bg-primary/10 text-muted hover:text-primary transition-colors cursor-pointer"
                    title="Ayat berikutnya"
                    aria-label="Putar ayat berikutnya"
                  >
                    <SkipForward size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={stopAudio}
                    className="p-1.5 rounded-md hover:bg-error/10 text-muted hover:text-error transition-colors cursor-pointer"
                    title="Berhenti"
                    aria-label="Hentikan pemutaran"
                  >
                    <Square size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Daftar Bacaan Ayat dalam Juz (Dikelompokkan dengan Pemisah Surah yang Akurat) */}
          <section className="card px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
            <div className="flex flex-col">
              {verses.map((verse, index) => {
                const isFirstOfSurahInJuz =
                  index === 0 || verse.chapterId !== verses[index - 1].chapterId;
                const surahMeta = chaptersMap.get(verse.chapterId);
                const surahName =
                  surahMeta?.name_simple ?? `Surah ${verse.chapterId}`;
                const segmentInfo = juzMeta.segments.find(
                  (s) => s.surahNumber === verse.chapterId
                );

                // Tampilkan Basmalah hanya jika surah dalam Juz ini dimulai dari Ayat 1
                // dan surah tersebut memang memiliki bismillah_pre (selain Al-Fatihah & At-Taubah)
                const showSurahBasmalah =
                  isFirstOfSurahInJuz &&
                  verse.number === 1 &&
                  Boolean(surahMeta?.bismillah_pre) &&
                  Boolean(basmalah);

                const bookmarkId = `ayat-${verse.chapterId}-${verse.number}`;
                const saved = isBookmarked(bookmarkId);
                const isPlaying = playingKey === verse.key;
                const isLastReadVerse =
                  juzProgress?.lastVerseKey === verse.key;

                return (
                  <div key={verse.key}>
                    {/* Pemisah / Banner Pergantian Surah di dalam Juz */}
                    {isFirstOfSurahInJuz && (
                      <div
                        id={`surah-section-${verse.chapterId}`}
                        className={`scroll-mt-32 rounded-2xl border border-[#D6B878]/50 bg-gradient-to-r from-[#FBF9F3] via-[#F5EFE2] to-[#E9F1ED] p-4 sm:p-5 ${
                          index > 0 ? "mt-8 mb-4" : "mb-4"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {padNumber(verse.chapterId)}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="font-bold text-base sm:text-lg text-text">
                                  Surah {surahName}
                                </h2>
                                {surahMeta && (
                                  <span className="text-xs text-muted">
                                    ({surahMeta.translated_name.name})
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted mt-0.5">
                                {verse.number > 1 ? (
                                  <>
                                    Lanjutan Surah {surahName} • Ayat{" "}
                                    {segmentInfo?.startVerse ?? verse.number} –{" "}
                                    {segmentInfo?.endVerse ?? ""} dalam Juz{" "}
                                    {juzNumber}
                                  </>
                                ) : (
                                  <>
                                    Ayat {segmentInfo?.startVerse ?? 1} –{" "}
                                    {segmentInfo?.endVerse ??
                                      surahMeta?.verses_count ??
                                      ""}{" "}
                                    dalam Juz {juzNumber}
                                    {surahMeta
                                      ? ` • ${revelationLabel(
                                          surahMeta.revelation_place
                                        )}`
                                      : ""}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {surahMeta?.name_arabic && (
                              <p
                                className="arabic-text text-2xl text-primary"
                                lang="ar"
                                dir="rtl"
                              >
                                {surahMeta.name_arabic}
                              </p>
                            )}
                            <Link
                              href={`/quran/${verse.chapterId}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/80 hover:bg-white text-xs font-medium text-primary border border-border transition-colors"
                              title={`Buka Surah ${surahName} penuh`}
                            >
                              <span>Surah Penuh</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>

                        {showSurahBasmalah && basmalah && (
                          <div className="text-center pt-4 mt-4 border-t border-[#D6B878]/35">
                            <p
                              className={`quran-arabic ${SCALE_CLASS[scale]} text-center`}
                              lang="ar"
                              dir="rtl"
                            >
                              {basmalah}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Artikel Ayat */}
                    <article
                      id={`ayat-${verse.chapterId}-${verse.number}`}
                      className={`py-6 scroll-mt-36 transition-colors rounded-xl px-2 sm:px-3 ${
                        isPlaying
                          ? "bg-primary/[0.04] ring-1 ring-primary/20"
                          : isLastReadVerse
                          ? "bg-[#D6B878]/[0.08] ring-1 ring-[#D6B878]/50"
                          : ""
                      } ${
                        index < verses.length - 1
                          ? "border-b border-border/60"
                          : ""
                      }`}
                    >
                      {/* Baris Info Referensi Surah & Nomor Ayat */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/[0.07] text-primary">
                          QS. {surahName}: Ayat {verse.number}
                        </span>

                        {isLastReadVerse && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D6B878]/25 text-[#174A3A]">
                            <CheckCircle2 size={12} />
                            Terakhir Dibaca
                          </span>
                        )}
                      </div>

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
                          <span className="sr-only">
                            QS. {surahName} Ayat {verse.number}
                          </span>
                        </span>
                      </p>

                      {/* Terjemahan Bahasa Indonesia */}
                      {showTranslation && (
                        <div className="mt-5">
                          <div
                            className="flex items-center gap-3 mb-3"
                            aria-hidden="true"
                          >
                            <span className="h-px flex-1 bg-border/80" />
                            <span className="w-1.5 h-1.5 rotate-45 bg-secondary/70" />
                            <span className="h-px flex-1 bg-border/80" />
                          </div>
                          <p className="text-[0.97rem] sm:text-base leading-relaxed text-text/85">
                            {verse.translation}
                          </p>
                        </div>
                      )}

                      {/* Tombol Aksi Ayat: Tandai Terakhir Dibaca, Bookmark, Putar Audio, Bagikan */}
                      <div className="flex flex-wrap items-center justify-end gap-1 mt-4">
                        <button
                          type="button"
                          onClick={() => handleMarkLastRead(verse)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                          type="button"
                          onClick={() =>
                            toggle({
                              id: bookmarkId,
                              type: "ayat",
                              title: `QS. ${surahName}: ${verse.number} (Juz ${juzNumber})`,
                              description: verse.translation,
                              href: `/quran/juz/${juzNumber}#ayat-${verse.chapterId}-${verse.number}`,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            saved
                              ? "text-primary bg-primary/[0.08]"
                              : "text-muted hover:text-primary hover:bg-primary/[0.05]"
                          }`}
                          aria-label={
                            saved
                              ? "Hapus bookmark ayat"
                              : "Simpan ayat ke bookmark"
                          }
                          title={saved ? "Tersimpan di Bookmark" : "Simpan Bookmark"}
                        >
                          <Bookmark
                            size={16}
                            fill={saved ? "currentColor" : "none"}
                            strokeWidth={1.8}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => playVerseAudio(verse)}
                          disabled={!verse.audioUrl || isSwitchingQari}
                          className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            isPlaying
                              ? "text-primary bg-primary/[0.08]"
                              : "text-muted hover:text-primary hover:bg-primary/[0.05]"
                          }`}
                          aria-label={
                            isPlaying && !isPaused
                              ? "Jeda audio ayat"
                              : "Putar audio ayat"
                          }
                          title={
                            verse.audioUrl
                              ? `Putar audio (${currentReciter.name})`
                              : "Audio tidak tersedia"
                          }
                        >
                          {isPlaying && !isPaused ? (
                            <Pause size={16} strokeWidth={1.8} />
                          ) : (
                            <Play size={16} strokeWidth={1.8} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShare(verse)}
                          className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/[0.05] transition-colors cursor-pointer"
                          aria-label="Bagikan ayat"
                          title="Bagikan ayat"
                        >
                          <Share2 size={16} strokeWidth={1.8} />
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Info Sumber Data & Qari */}
          {edition && (
            <p className="text-xs text-muted text-center mt-6 leading-relaxed">
              Terjemahan Bahasa Indonesia — {edition.name}
              <br />
              Teks Arab: Mushaf Utsmani • Qari: {currentReciter.name} • Data &amp;
              Audio: Quran.com API v4
            </p>
          )}

          {/* Navigasi Juz Sebelumnya & Berikutnya */}
          <nav
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-8"
            aria-label="Navigasi antar-juz"
          >
            {prevJuzNumber ? (
              <Link
                href={`/quran/juz/${prevJuzNumber}`}
                className="btn-secondary text-sm !py-2.5 justify-start min-w-0 max-w-full"
              >
                <ChevronLeft size={16} className="shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-normal text-muted">
                    Juz sebelumnya
                  </span>
                  <span className="block font-medium truncate">
                    Juz {prevJuzNumber}
                  </span>
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            <Link href="/quran?mode=juz" className="btn-ghost text-sm shrink-0">
              Daftar 30 Juz
            </Link>

            {nextJuzNumber ? (
              <Link
                href={`/quran/juz/${nextJuzNumber}`}
                className="btn-secondary text-sm !py-2.5 flex-row-reverse justify-start min-w-0 max-w-full justify-self-end"
              >
                <ChevronRight size={16} className="shrink-0" />
                <span className="min-w-0 text-right">
                  <span className="block text-[11px] font-normal text-muted">
                    Juz berikutnya
                  </span>
                  <span className="block font-medium truncate">
                    Juz {nextJuzNumber}
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

