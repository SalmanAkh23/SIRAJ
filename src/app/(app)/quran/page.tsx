"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import {
  fetchChapters,
  fetchJuzs,
  revelationLabel,
  readLastRead,
  readJuzProgressMap,
  type ChapterMeta,
  type JuzMeta,
  type QuranLastRead,
  type JuzProgressEntry,
} from "@/lib/quran-api";
import {
  Search,
  BookOpen,
  AlertCircle,
  X,
  BookMarked,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const filters = ["Semua", "Makkiyah", "Madaniyah"] as const;
type Filter = (typeof filters)[number];
type ReadingMode = "surah" | "juz";

/** Bentuk kartu daftar surah — identik dengan desain sebelumnya. */
interface SurahCard {
  number: number;
  nameLatin: string;
  meaning: string;
  nameArabic: string;
  totalAyat: number;
  type: "Makkiyah" | "Madaniyah";
}

function toSurahCard(chapter: ChapterMeta): SurahCard {
  return {
    number: chapter.id,
    nameLatin: chapter.name_simple,
    meaning: chapter.translated_name.name,
    nameArabic: chapter.name_arabic,
    totalAyat: chapter.verses_count,
    type: revelationLabel(chapter.revelation_place),
  };
}

function padNumber(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/** Normalisasi pencarian: abaikan spasi, tanda hubung, dan kutip (mis. "Ya-Sin" → "yasin"). */
function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function QuranPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialModeParam = searchParams.get("mode");

  const [mode, setMode] = useState<ReadingMode>(
    initialModeParam === "juz" ? "juz" : "surah"
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [chapters, setChapters] = useState<SurahCard[]>([]);
  const [juzList, setJuzList] = useState<JuzMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [lastRead, setLastRead] = useState<QuranLastRead | null>(null);
  const [juzProgressMap, setJuzProgressMap] = useState<
    Record<number, JuzProgressEntry>
  >({});

  // Sinkronkan mode dengan query parameter bila berubah
  useEffect(() => {
    const paramMode = searchParams.get("mode");
    if (paramMode === "juz" || paramMode === "surah") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi tab dari query URL
      setMode(paramMode);
    }
  }, [searchParams]);

  // Muat penanda bacaan terakhir & progres Juz dari localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- muat state tersimpan dari localStorage setelah mount
    setLastRead(readLastRead());
    setJuzProgressMap(readJuzProgressMap());
  }, []);

  const handleModeChange = (nextMode: ReadingMode) => {
    setMode(nextMode);
    const url = nextMode === "juz" ? "/quran?mode=juz" : "/quran";
    router.replace(url, { scroll: false });
  };

  const retryLoad = () => {
    setLoading(true);
    setErrorMessage("");
    setReloadKey((key) => key + 1);
  };

  // Muat daftar 114 surah dan 30 juz dari Quran.com API v4
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [chapterList, juzMetaList] = await Promise.all([
          fetchChapters(),
          fetchJuzs(),
        ]);
        if (cancelled) return;
        setChapters(chapterList.map(toSurahCard));
        setJuzList(juzMetaList);
        setErrorMessage("");
        setLoading(false);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memuat data Al-Qur'an. Coba lagi nanti."
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const surahResults = useMemo(() => {
    const q = query.trim();
    const nq = normalizeSearch(q);
    return chapters.filter((surah) => {
      const matchFilter = filter === "Semua" || surah.type === filter;
      const matchQuery =
        !nq ||
        normalizeSearch(surah.nameLatin).includes(nq) ||
        normalizeSearch(surah.meaning).includes(nq) ||
        surah.nameArabic.includes(q) ||
        String(surah.number) === q;
      return matchFilter && matchQuery;
    });
  }, [chapters, query, filter]);

  const juzResults = useMemo(() => {
    const q = query.trim();
    const nq = normalizeSearch(q);
    if (!nq) return juzList;

    return juzList.filter((juz) => {
      const matchNumber =
        String(juz.juzNumber) === q ||
        normalizeSearch(`juz ${juz.juzNumber}`).includes(nq);
      const matchName =
        normalizeSearch(juz.nameLatin).includes(nq) ||
        juz.nameArabic.includes(q);
      const matchSurah = juz.segments.some(
        (seg) =>
          normalizeSearch(seg.surahNameLatin).includes(nq) ||
          seg.surahNameArabic.includes(q) ||
          String(seg.surahNumber) === q
      );
      return matchNumber || matchName || matchSurah;
    });
  }, [juzList, query]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <PageHeader
        title="Al-Qur'an"
        subtitle="Baca, renungkan, dan pahami berdasarkan 114 Surah atau 30 Juz."
      />

      {/* Banner Lanjutkan Membaca (Jika ada riwayat bacaan terakhir) */}
      {lastRead && (
        <section
          aria-label="Terakhir dibaca"
          className="relative overflow-hidden rounded-2xl border border-[#D6B878]/50 bg-gradient-to-r from-[#174A3A] via-[#1C5443] to-[#245C52] text-white p-5 sm:p-6 mb-7 shadow-[0_8px_28px_-8px_rgba(23,74,58,0.28)]"
        >
          <div
            className="absolute inset-0 pattern-star opacity-[0.07] pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D6B878]/40 text-[#D6B878] text-xs font-semibold">
                <Sparkles size={13} />
                <span>Terakhir Dibaca</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                QS. {lastRead.surahName}: Ayat {lastRead.verseNumber}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/85">
                <span>Juz {lastRead.juzNumber}</span>
                <span className="w-1 h-1 rounded-full bg-[#D6B878]" />
                <span>Progres Juz {lastRead.juzNumber}: {lastRead.percentageInJuz}%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href={`/quran/juz/${lastRead.juzNumber}#ayat-${lastRead.surahNumber}-${lastRead.verseNumber}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6B878] hover:bg-[#e0c68c] text-[#17211D] font-semibold text-xs sm:text-sm transition-all shadow-xs"
              >
                <span>Lanjutkan di Juz {lastRead.juzNumber}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href={`/quran/${lastRead.surahNumber}#ayat-${lastRead.verseNumber}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm transition-colors"
              >
                <span>Buka Surah {lastRead.surahName}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Segmented Control Mode Baca: Mode Surah (114) vs Mode Juz (30) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div
          role="tablist"
          aria-label="Pilih mode membaca Al-Qur'an"
          className="inline-grid grid-cols-2 p-1.5 rounded-2xl bg-surface border border-border shadow-2xs w-full sm:w-auto"
        >
          <button
            role="tab"
            type="button"
            aria-selected={mode === "surah"}
            onClick={() => handleModeChange("surah")}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              mode === "surah"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-text hover:bg-primary/[0.04]"
            }`}
          >
            <BookOpen size={16} />
            <span>Mode Surah</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                mode === "surah"
                  ? "bg-white/20 text-[#D6B878]"
                  : "bg-primary/[0.08] text-primary"
              }`}
            >
              114
            </span>
          </button>

          <button
            role="tab"
            type="button"
            aria-selected={mode === "juz"}
            onClick={() => handleModeChange("juz")}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              mode === "juz"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-text hover:bg-primary/[0.04]"
            }`}
          >
            <Layers size={16} />
            <span>Mode Juz</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                mode === "juz"
                  ? "bg-white/20 text-[#D6B878]"
                  : "bg-primary/[0.08] text-primary"
              }`}
            >
              30
            </span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted">
          {mode === "surah"
            ? "Menampilkan daftar 114 surah dalam Mushaf Utsmani."
            : "Menampilkan daftar 30 juz beserta rentang surah dan ayat awal hingga akhir."}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "surah"
                ? "Cari nama surah, arti, atau nomor surah..."
                : "Cari nomor juz (1-30), nama juz, atau surah di dalamnya..."
            }
            className="input pl-10 pr-10"
            aria-label={mode === "surah" ? "Cari surah" : "Cari juz"}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              aria-label="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {mode === "surah" && (
          <div className="flex items-center gap-1 bg-surface border border-border rounded-[10px] p-1 self-start">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-primary text-white"
                    : "text-muted hover:text-text hover:bg-primary/[0.04]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* State Loading / Error / Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card !p-5 flex items-center gap-4">
              <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-2/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <EmptyState
          icon={AlertCircle}
          title="Data Al-Qur'an gagal dimuat"
          description={errorMessage}
        >
          <button
            type="button"
            onClick={retryLoad}
            className="btn-primary text-sm !py-2.5"
          >
            Coba lagi
          </button>
        </EmptyState>
      ) : mode === "surah" ? (
        /* ==============================================================
           TAMPILAN MODE SURAH (114 SURAH)
        ============================================================== */
        surahResults.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Surah tidak ditemukan"
            description={`Tidak ada surah yang cocok dengan pencarian "${query}" atau filter ${filter}. Coba kata kunci lain.`}
          >
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("Semua");
              }}
              className="btn-secondary text-sm !py-2"
            >
              Reset pencarian
            </button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {surahResults.map((surah) => (
              <Link
                key={surah.number}
                href={`/quran/${surah.number}`}
                className="card group flex items-center gap-4 hover:border-primary/25 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="text-sm font-semibold text-primary group-hover:text-white">
                    {padNumber(surah.number)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-text group-hover:text-primary transition-colors truncate">
                        {surah.nameLatin}
                      </h2>
                      <p className="text-sm text-muted truncate">{surah.meaning}</p>
                    </div>
                    <p
                      className="arabic-text text-xl shrink-0"
                      aria-label={`Nama surah ${surah.nameLatin}`}
                    >
                      {surah.nameArabic}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5 text-xs text-muted">
                    <span>{surah.totalAyat} Ayat</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        surah.type === "Makkiyah"
                          ? "bg-primary/[0.07] text-primary"
                          : "bg-secondary/15 text-secondary-dark"
                      }`}
                    >
                      {surah.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        /* ==============================================================
           TAMPILAN MODE JUZ (30 JUZ)
        ============================================================== */
        juzResults.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Juz tidak ditemukan"
            description={`Tidak ada juz yang cocok dengan pencarian "${query}". Coba cari nomor juz (1–30) atau nama surah.`}
          >
            <button
              type="button"
              onClick={() => setQuery("")}
              className="btn-secondary text-sm !py-2"
            >
              Reset pencarian
            </button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {juzResults.map((juz) => {
              const progress = juzProgressMap[juz.juzNumber];
              const surahCount = juz.segments.length;

              return (
                <article
                  key={juz.juzNumber}
                  className="card group relative overflow-hidden flex flex-col justify-between !p-5 border-border hover:border-[#D6B878] transition-all"
                >
                  {/* Ornamen Geometri Sudut Halus */}
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 pattern-star opacity-[0.04] pointer-events-none"
                    aria-hidden="true"
                  />

                  <div>
                    {/* Header Kartu Juz: Nomor Juz, Nama/Label Juz, Kaligrafi Arab */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Badge Nomor Juz Geometri Islami */}
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#174A3A] to-[#245C52] text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-[#D6B878]/40">
                          <span className="text-[10px] uppercase tracking-wider text-[#D6B878] leading-none">
                            Juz
                          </span>
                          <span className="text-base font-bold leading-tight mt-0.5">
                            {padNumber(juz.juzNumber)}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-base sm:text-lg text-text group-hover:text-primary transition-colors truncate">
                              Juz {juz.juzNumber}
                            </h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/[0.07] text-primary">
                              {juz.versesCount} Ayat
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted truncate mt-0.5">
                            {juz.nameLatin} • {surahCount} Surah
                          </p>
                        </div>
                      </div>

                      {juz.nameArabic && (
                        <p
                          className="arabic-text text-xl sm:text-2xl text-primary shrink-0"
                          lang="ar"
                          dir="rtl"
                        >
                          {juz.nameArabic}
                        </p>
                      )}
                    </div>

                    {/* Kotak Informasi Surah & Ayat Awal s.d. Akhir */}
                    <div className="rounded-xl bg-[#F8F7F2] border border-border/80 p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                          Mulai (Awal Juz)
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-text mt-0.5 truncate">
                          QS. {juz.startSurahName}: Ayat {juz.startVerse}
                        </p>
                      </div>

                      <div className="min-w-0 sm:border-l sm:border-border/80 sm:pl-3">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                          Berakhir (Akhir Juz)
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-text mt-0.5 truncate">
                          QS. {juz.endSurahName}: Ayat {juz.endVerse}
                        </p>
                      </div>
                    </div>

                    {/* Progres Membaca Juz (jika pengguna pernah menandai bacaan di Juz ini) */}
                    {progress && (
                      <div className="mt-3.5 pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="inline-flex items-center gap-1.5 text-primary font-medium">
                            <CheckCircle2 size={13} className="text-primary" />
                            Terakhir: QS. {progress.lastSurahName}: {progress.lastVerseNumber}
                          </span>
                          <span className="font-bold text-primary">
                            {progress.percentage}%
                          </span>
                        </div>
                        <div className="progress-bar h-1.5">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progress.percentage}%` }}
                            role="progressbar"
                            aria-valuenow={progress.percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Progres membaca Juz ${juz.juzNumber}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Kartu: Ringkasan Surah & Tombol Mulai Membaca */}
                  <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted min-w-0 truncate">
                      <BookMarked size={13} className="text-[#B89246] shrink-0" />
                      <span className="truncate">
                        {juz.segments.map((s) => s.surahNameLatin).join(", ")}
                      </span>
                    </div>

                    <Link
                      href={
                        progress
                          ? `/quran/juz/${juz.juzNumber}#ayat-${progress.lastSurahNumber}-${progress.lastVerseNumber}`
                          : `/quran/juz/${juz.juzNumber}`
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-light text-white text-xs font-semibold shrink-0 transition-all shadow-2xs"
                    >
                      <span>{progress ? "Lanjutkan" : "Mulai Membaca"}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

export default function QuranPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10" aria-hidden="true">
          <div className="mb-6">
            <div className="skeleton h-8 w-40" />
            <div className="skeleton h-4 w-64 mt-3" />
          </div>
          <div className="skeleton h-12 w-72 rounded-2xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card !p-5 flex items-center gap-4">
                <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <QuranPageContent />
    </Suspense>
  );
}
