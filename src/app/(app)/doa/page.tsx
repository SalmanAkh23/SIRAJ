"use client";

import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmptyState from "@/components/empty-state";
import IslamicBookCover, { BookVariant } from "@/components/islamic-book-cover";
import { useBookmarks } from "@/lib/bookmark-context";
import { recordDoaRead } from "@/lib/learning-progress";
import {
  Search,
  Copy,
  Check,
  Bookmark,
  HandHelping,
  X,
  AlertTriangle,
  RotateCcw,
  Hash,
  ArrowLeft,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import type { DoaItem, DoaErrorCode } from "@/lib/doa-types";
import { stripHtml } from "@/lib/doa-api";

// ---------------------------------------------------------------------------
// Tipe & Konstanta
// ---------------------------------------------------------------------------
type ViewState =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "empty" }
  | { kind: "error"; code: DoaErrorCode | "UNKNOWN"; message: string };

const CATEGORY_COUNTER_KEY = "siraj-dzikir-category-counter";
const TASBIH_COUNTER_KEY = "siraj-dzikir-item-tasbih";

const TABS_DOA = [
  { slug: "semua", label: "Semua Doa" },
  { slug: "doa-harian", label: "Doa Harian" },
  { slug: "doa-pilihan", label: "Doa Pilihan" },
] as const;

const TABS_DZIKIR = [
  { slug: "semua", label: "Semua Dzikir" },
  { slug: "dzikir-pagi", label: "Dzikir Pagi" },
  { slug: "dzikir-petang", label: "Dzikir Petang" },
  { slug: "dzikir-setelah-shalat", label: "Dzikir Setelah Salat" },
] as const;

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Mengekstrak angka pengulangan dari teks catatan (mis. "Dibaca 3x" -> 3) */
function parseRepetitionTarget(repetitionText?: string): number {
  if (!repetitionText) return 1;
  const match = repetitionText.match(/(\d+)\s*x/i);
  if (match) {
    const num = parseInt(match[1], 10);
    return num > 0 ? num : 1;
  }
  return 1;
}

// ---------------------------------------------------------------------------
// Kartu Doa (Buku Doa)
// ---------------------------------------------------------------------------
function DoaCard({
  doa,
  copiedId,
  onCopy,
}: {
  doa: DoaItem;
  copiedId: string | null;
  onCopy: (id: string) => void;
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const key = String(doa.id);
  const saved = isBookmarked(key);

  const handleCopy = async () => {
    const text = [
      doa.title,
      "",
      doa.arabic,
      "",
      doa.latin,
      "",
      doa.translation,
      doa.source ? `\nSumber: ${doa.source}` : "",
      doa.fawaid ? `\nKeutamaan: ${doa.fawaid}` : "",
    ]
      .filter((s) => s !== "")
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      onCopy(key);
    } catch {
      /* clipboard gagal — abaikan */
    }
  };

  return (
    <article className="card flex flex-col justify-between border-border/80 hover:border-primary/30 transition-all bg-surface">
      <div>
        {/* Header Kartu: Judul & Kategori */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="font-semibold text-text text-base leading-snug">
            {doa.title || "Doa"}
          </h3>
          <span className="badge badge-primary !py-0.5 !px-2.5 !text-[11px] shrink-0 font-medium">
            {doa.category || "Doa Harian"}
          </span>
        </div>

        {/* Teks Arab */}
        {doa.arabic && (
          <p
            className="arabic-text text-2xl leading-loose mb-4 text-right font-normal text-text select-text"
            lang="ar"
          >
            {stripHtml(doa.arabic)}
          </p>
        )}

        {/* Transliterasi Latin */}
        {doa.latin && (
          <p className="text-sm text-muted leading-relaxed mb-3 italic">
            {stripHtml(doa.latin)}
          </p>
        )}

        {/* Terjemahan Indonesia */}
        {doa.translation && (
          <p className="text-sm text-text/90 leading-relaxed mb-4">
            {stripHtml(doa.translation)}
          </p>
        )}

        {/* Faedah / Keutamaan (Fawaid jika ada) */}
        {doa.fawaid && (
          <div className="p-3 rounded-lg bg-primary/[0.04] border border-primary/10 text-xs text-text/80 mb-3 flex items-start gap-2 leading-relaxed">
            <Info size={14} className="text-primary shrink-0 mt-0.5" />
            <span>{stripHtml(doa.fawaid)}</span>
          </div>
        )}

        {/* Sumber Dalil */}
        {doa.source && (
          <p className="text-xs text-muted/90 flex items-center gap-1.5 mt-2">
            <Hash size={12} className="text-primary/70" aria-hidden="true" />
            <span className="font-medium">{stripHtml(doa.source)}</span>
          </p>
        )}
      </div>

      {/* Aksi Bawah: Salin & Simpan Bookmark */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/70">
        <button
          onClick={handleCopy}
          className="btn-secondary text-xs !py-1.5 !px-3.5 flex items-center gap-1.5"
          aria-label={`Salin doa ${doa.title || ""}`}
        >
          {copiedId === key ? (
            <>
              <Check size={14} className="text-primary" />
              Tersalin
            </>
          ) : (
            <>
              <Copy size={14} />
              Salin
            </>
          )}
        </button>

        <button
          onClick={() =>
            toggle({
              id: key,
              type: "doa",
              title: doa.title || "Doa",
              description: stripHtml(doa.translation),
              href: "/doa?buku=doa",
            })
          }
          className={`btn-ghost text-xs !py-1.5 !px-3 flex items-center gap-1.5 ${
            saved ? "!text-primary font-semibold" : ""
          }`}
          aria-pressed={saved}
          aria-label={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
        >
          <Bookmark
            size={14}
            fill={saved ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {saved ? "Tersimpan" : "Bookmark"}
        </button>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Kartu Dzikir (Buku Dzikir dengan Tasbih & Pengulangan Interaktif)
// ---------------------------------------------------------------------------
function DzikirCard({
  dzikir,
  copiedId,
  onCopy,
  tasbihCount,
  onIncrementTasbih,
  onResetTasbih,
}: {
  dzikir: DoaItem;
  copiedId: string | null;
  onCopy: (id: string) => void;
  tasbihCount: number;
  onIncrementTasbih: (id: string) => void;
  onResetTasbih: (id: string) => void;
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const key = String(dzikir.id);
  const saved = isBookmarked(key);

  const target = parseRepetitionTarget(dzikir.repetition);
  const isTargetCompleted = tasbihCount >= target;

  const handleCopy = async () => {
    const text = [
      dzikir.title,
      dzikir.repetition ? `(${dzikir.repetition})` : "",
      "",
      dzikir.arabic,
      "",
      dzikir.latin,
      "",
      dzikir.translation,
      dzikir.source ? `\nSumber: ${dzikir.source}` : "",
      dzikir.fawaid ? `\nKeutamaan: ${dzikir.fawaid}` : "",
    ]
      .filter((s) => s !== "")
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      onCopy(key);
    } catch {
      /* clipboard gagal — abaikan */
    }
  };

  return (
    <article className="card flex flex-col justify-between border-border/80 hover:border-[#D6B878]/50 transition-all bg-surface">
      <div>
        {/* Header Kartu: Judul, Kategori & Badge Pengulangan Emas */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-text text-base leading-snug">
              {dzikir.title || "Dzikir"}
            </h3>
            <span className="text-[11px] text-muted font-medium mt-0.5 inline-block">
              {dzikir.category || "Dzikir Harian"}
            </span>
          </div>

          {dzikir.repetition ? (
            <span className="badge bg-[#D6B878]/15 text-[#9E7B28] border border-[#D6B878]/30 !py-0.5 !px-2.5 !text-[11px] font-semibold shrink-0">
              {dzikir.repetition}
            </span>
          ) : (
            <span className="badge badge-secondary !py-0.5 !px-2.5 !text-[11px] font-medium shrink-0">
              Dibaca 1x
            </span>
          )}
        </div>

        {/* Teks Arab */}
        {dzikir.arabic && (
          <p
            className="arabic-text text-2xl leading-loose mb-4 text-right font-normal text-text select-text"
            lang="ar"
          >
            {stripHtml(dzikir.arabic)}
          </p>
        )}

        {/* Transliterasi Latin */}
        {dzikir.latin && (
          <p className="text-sm text-muted leading-relaxed mb-3 italic">
            {stripHtml(dzikir.latin)}
          </p>
        )}

        {/* Terjemahan Indonesia */}
        {dzikir.translation && (
          <p className="text-sm text-text/90 leading-relaxed mb-4">
            {stripHtml(dzikir.translation)}
          </p>
        )}

        {/* Faedah / Keutamaan (Fawaid jika ada) */}
        {dzikir.fawaid && (
          <div className="p-3 rounded-lg bg-[#D6B878]/[0.08] border border-[#D6B878]/20 text-xs text-text/80 mb-3 flex items-start gap-2 leading-relaxed">
            <Sparkles size={14} className="text-[#9E7B28] shrink-0 mt-0.5" />
            <span>{stripHtml(dzikir.fawaid)}</span>
          </div>
        )}

        {/* Sumber Dalil */}
        {dzikir.source && (
          <p className="text-xs text-muted/90 flex items-center gap-1.5 mt-2">
            <Hash size={12} className="text-[#9E7B28]" aria-hidden="true" />
            <span className="font-medium">{stripHtml(dzikir.source)}</span>
          </p>
        )}
      </div>

      {/* Bagian Bawah: Tasbih Digital Interaktif & Aksi Kartu */}
      <div className="mt-5 pt-4 border-t border-border/70 flex flex-col gap-3">
        {/* Tasbih Per Dzikir */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/60">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-text">Penghitung Bacaan:</span>
            <span
              className={`font-bold tabular-nums px-2 py-0.5 rounded text-xs ${
                isTargetCompleted
                  ? "bg-emerald-100 text-emerald-800 font-semibold"
                  : "bg-surface border border-border text-primary font-semibold"
              }`}
            >
              {tasbihCount} / {target}
            </span>
            {isTargetCompleted && (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                <Check size={12} /> Selesai
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onIncrementTasbih(key)}
              className="btn-primary !text-xs !py-1 !px-3 shadow-sm hover:brightness-105"
              aria-label={`Hitung bacaan dzikir ${dzikir.title || ""}`}
            >
              +1
            </button>
            {tasbihCount > 0 && (
              <button
                onClick={() => onResetTasbih(key)}
                className="btn-ghost !text-xs !p-1 text-muted hover:text-error"
                title="Reset hitungan dzikir ini"
                aria-label={`Reset hitungan dzikir ${dzikir.title || ""}`}
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Tombol Salin & Bookmark */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-secondary text-xs !py-1.5 !px-3.5 flex items-center gap-1.5"
              aria-label={`Salin dzikir ${dzikir.title || ""}`}
            >
              {copiedId === key ? (
                <>
                  <Check size={14} className="text-primary" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Salin
                </>
              )}
            </button>

            <button
              onClick={() =>
                toggle({
                  id: key,
                  type: "doa",
                  title: dzikir.title || "Dzikir",
                  description: stripHtml(dzikir.translation),
                  href: "/doa?buku=dzikir",
                })
              }
              className={`btn-ghost text-xs !py-1.5 !px-3 flex items-center gap-1.5 ${
                saved ? "!text-primary font-semibold" : ""
              }`}
              aria-pressed={saved}
              aria-label={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
            >
              <Bookmark
                size={14}
                fill={saved ? "currentColor" : "none"}
                aria-hidden="true"
              />
              {saved ? "Tersimpan" : "Bookmark"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Penghitung Kategori Dzikir (LocalStorage)
// ---------------------------------------------------------------------------
function DzikirCategoryCounter({
  slug,
  label,
  count,
  onIncrement,
  onReset,
}: {
  slug: string;
  label: string;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}) {
  return (
    <div className="card !py-3 !px-4 flex flex-wrap items-center justify-between gap-3 border-[#D6B878]/40 bg-[#D6B878]/[0.05] mb-6">
      <span className="text-sm font-medium text-text flex items-center gap-2">
        <Hash size={16} className="text-[#9E7B28]" aria-hidden="true" />
        <span>
          Putaran {label} — sudah dibaca lengkap:
        </span>
      </span>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-primary tabular-nums min-w-[2.5ch] text-center">
          {count}x
        </span>
        <button
          onClick={onIncrement}
          className="btn-secondary !text-primary !border-primary/40 hover:!bg-primary hover:!text-white text-xs !py-1.5 !px-3 font-semibold"
          aria-label={`Tambah putaran dzikir ${label}`}
        >
          +1 Putaran
        </button>
        <button
          onClick={onReset}
          className="btn-ghost text-xs !py-1.5 !px-2.5 text-muted hover:text-error"
          aria-label={`Reset putaran dzikir ${label}`}
        >
          <RotateCcw size={13} aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kartu Skeleton Loading
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="card animate-pulse border-border/60">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-5 w-2/5 skeleton rounded" />
        <div className="h-5 w-16 skeleton rounded" />
      </div>
      <div className="h-16 w-full skeleton rounded mb-4" />
      <div className="h-4 w-full skeleton rounded mb-3" />
      <div className="h-4 w-3/4 skeleton rounded mb-4" />
      <div className="h-4 w-1/2 skeleton rounded" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tampilan Rak Dua Buku Digital (Halaman Awal)
// ---------------------------------------------------------------------------
function DigitalBookshelf({
  onSelectBook,
}: {
  onSelectBook: (variant: BookVariant) => void;
}) {
  return (
    <div className="animate-fade-in">
      {/* Header Halaman Pustaka Digital */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.08] border border-primary/20 text-xs font-semibold text-primary mb-3">
          <BookOpen size={14} />
          <span>PUSTAKA DIGITAL SIRAJ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
          Buku Doa &amp; Dzikir
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          Pilih salah satu kitab digital di bawah ini untuk membuka kumpulan doa
          sehari-hari atau untaian dzikir harian sesuai tuntunan Al-Qur’an dan
          Sunnah.
        </p>
      </div>

      {/* Rak Dua Buku Berdampingan */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-stretch mb-12">
        {/* Buku 1: DOA */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] sm:max-w-[340px]">
            <IslamicBookCover
              variant="doa"
              onClick={() => onSelectBook("doa")}
            />
          </div>

          <div className="mt-6 text-center max-w-xs">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="badge badge-primary text-xs font-semibold">
                247 Doa Shahih
              </span>
              <span className="badge bg-[#174A3A]/10 text-[#174A3A] text-xs font-medium">
                Al-Qur’an &amp; Sunnah
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Kumpulan doa sehari-hari, doa ibadah, perlindungan, dan doa para nabi
              lengkap dengan teks Arab, transliterasi Latin, dan terjemahan.
            </p>
            <button
              onClick={() => onSelectBook("doa")}
              className="btn-primary w-full text-sm !py-2.5 flex items-center justify-center gap-2 shadow-sm"
              aria-label="Buka Kitab Kumpulan Doa"
            >
              <span>Buka Buku Doa</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Buku 2: DZIKIR */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] sm:max-w-[340px]">
            <IslamicBookCover
              variant="dzikir"
              onClick={() => onSelectBook("dzikir")}
            />
          </div>

          <div className="mt-6 text-center max-w-xs">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="badge bg-[#D6B878]/20 text-[#9E7B28] border border-[#D6B878]/40 text-xs font-semibold">
                51 Untaian Dzikir
              </span>
              <span className="badge badge-secondary text-xs font-medium">
                Dengan Tasbih
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Untaian dzikir pagi &amp; petang, dzikir setelah salat fardhu, dan
              dzikir harian dengan penghitung pengulangan sesuai hadits.
            </p>
            <button
              onClick={() => onSelectBook("dzikir")}
              className="btn-primary w-full text-sm !py-2.5 flex items-center justify-center gap-2 shadow-sm !bg-[#103830] hover:!bg-[#15463c]"
              aria-label="Buka Kitab Kumpulan Dzikir"
            >
              <span>Buka Buku Dzikir</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Fitur Unggulan */}
      <div className="max-w-4xl mx-auto rounded-xl p-5 sm:p-6 bg-surface border border-border/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        <div className="flex items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text uppercase tracking-wide">
              Sumber Shahih
            </h4>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              Disusun dari hadits riwayat Bukhari, Muslim, serta kitab shahih
              lainnya.
            </p>
          </div>
        </div>

        <div className="flex items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D6B878]/20 text-[#9E7B28] flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text uppercase tracking-wide">
              Lengkap &amp; Jelas
            </h4>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              Memuat teks Arab berharakat, transliterasi Latin, dan terjemahan resmi.
            </p>
          </div>
        </div>

        <div className="flex items-center sm:items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Bookmark size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text uppercase tracking-wide">
              Interaktif &amp; Disimpan
            </h4>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              Dilengkapi penghitung tasbih dan fitur bookmark ke akun Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Komponen Utama Halaman
// ---------------------------------------------------------------------------
function DoaPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sinkronisasi status buku dari URL ("doa" | "dzikir" | null)
  const initialBook = searchParams.get("buku");
  const [selectedBook, setSelectedBook] = useState<BookVariant | null>(
    initialBook === "doa" || initialBook === "dzikir"
      ? (initialBook as BookVariant)
      : null
  );

  // Tab kategori aktif (sesuai buku yang dibuka)
  const [activeTab, setActiveTab] = useState<string>("semua");

  // State pencarian
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data doa/dzikir dan status tampilan
  const [items, setItems] = useState<DoaItem[]>([]);
  const [view, setView] = useState<ViewState>({ kind: "loading" });

  // Penghitung putaran kategori dzikir (localStorage)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );

  // Penghitung tasbih per item dzikir (localStorage)
  const [tasbihCounts, setTasbihCounts] = useState<Record<string, number>>({});

  // Muat state counter dari localStorage
  useEffect(() => {
    recordDoaRead();
    try {
      const rawCat = localStorage.getItem(CATEGORY_COUNTER_KEY);
      if (rawCat) {
        const parsed = JSON.parse(rawCat);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrasi localStorage saat mount
          setCategoryCounts(parsed as Record<string, number>);
        }
      }

      const rawTasbih = localStorage.getItem(TASBIH_COUNTER_KEY);
      if (rawTasbih) {
        const parsed = JSON.parse(rawTasbih);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setTasbihCounts(parsed as Record<string, number>);
        }
      }
    } catch {
      /* abaikan error localStorage */
    }
  }, []);

  // Update URL saat memilih buku (mendukung tombol Back/Forward browser)
  const handleSelectBook = useCallback(
    (variant: BookVariant | null) => {
      setSelectedBook(variant);
      setActiveTab("semua");
      setQuery("");

      const url = variant ? `/doa?buku=${variant}` : "/doa";
      router.push(url, { scroll: true });
    },
    [router]
  );

  // Sinkronisasi saat pengguna menekan tombol Back di browser
  useEffect(() => {
    const bookParam = searchParams.get("buku");
    if (bookParam === "doa" || bookParam === "dzikir") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi URL search params
      setSelectedBook(bookParam as BookVariant);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi URL search params
      setSelectedBook(null);
    }
  }, [searchParams]);

  // Persist putaran kategori dzikir
  const persistCategoryCounts = useCallback(
    (next: Record<string, number>) => {
      setCategoryCounts(next);
      try {
        localStorage.setItem(CATEGORY_COUNTER_KEY, JSON.stringify(next));
      } catch {
        /* storage tidak tersedia */
      }
    },
    []
  );

  // Persist tasbih per dzikir
  const handleIncrementTasbih = useCallback((id: string) => {
    setTasbihCounts((prev) => {
      const current = prev[id] ?? 0;
      const next = { ...prev, [id]: current + 1 };
      try {
        localStorage.setItem(TASBIH_COUNTER_KEY, JSON.stringify(next));
      } catch {
        /* storage tidak tersedia */
      }
      return next;
    });
  }, []);

  const handleResetTasbih = useCallback((id: string) => {
    setTasbihCounts((prev) => {
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem(TASBIH_COUNTER_KEY, JSON.stringify(next));
      } catch {
        /* storage tidak tersedia */
      }
      return next;
    });
  }, []);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Ambil data dari API sesuai buku & kategori aktif
  useEffect(() => {
    if (!selectedBook) return;

    const controller = new AbortController();
    let cancelled = false;

    const loadData = async () => {
      setView({ kind: "loading" });

      const q = normalizeQuery(debouncedQuery);
      let url: string;

      if (q.length >= 2) {
        url = `/api/doa/search?q=${encodeURIComponent(q)}&limit=50`;
      } else if (activeTab === "semua") {
        url = `/api/doa/all?type=${selectedBook}&limitPerCategory=50`;
      } else {
        url = `/api/doa/category?slug=${encodeURIComponent(activeTab)}&limit=100`;
      }

      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        const json = (await res.json()) as {
          status?: string;
          data?: DoaItem[];
          message?: string;
          code?: DoaErrorCode;
        };

        if (cancelled) return;

        if (!res.ok || json.status !== "success") {
          setView({
            kind: "error",
            code: json.code ?? "UNKNOWN",
            message: json.message ?? `Gagal memuat data (status ${res.status}).`,
          });
          return;
        }

        let loadedItems = Array.isArray(json.data) ? json.data : [];

        // Jika dalam mode pencarian, saring hanya yang sesuai buku aktif
        if (q.length >= 2) {
          loadedItems = loadedItems.filter((item) => {
            if (selectedBook === "dzikir") {
              return (
                item.type === "dzikir" ||
                item.slug.includes("dzikir") ||
                item.category.toLowerCase().includes("dzikir")
              );
            }
            return (
              item.type === "doa" ||
              !item.slug.includes("dzikir") ||
              !item.category.toLowerCase().includes("dzikir")
            );
          });
        }

        setItems(loadedItems);
        setView(loadedItems.length === 0 ? { kind: "empty" } : { kind: "ready" });
      } catch (err) {
        if (
          cancelled ||
          (err instanceof DOMException && err.name === "AbortError")
        ) {
          return;
        }
        setView({
          kind: "error",
          code: "NETWORK",
          message:
            err instanceof Error
              ? err.message
              : "Tidak dapat terhubung ke server doa.",
        });
      }
    };

    loadData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedBook, activeTab, debouncedQuery]);

  // Filter lokal tambahan untuk hasil pencarian instan
  const filteredItems = useMemo(() => {
    const q = normalizeQuery(query);
    if (q.length < 2) return items;
    return items.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.latin.toLowerCase().includes(q) ||
        d.arabic.includes(query.trim())
    );
  }, [query, items]);

  const isSearching = normalizeQuery(query).length >= 2;
  const currentTabs = selectedBook === "dzikir" ? TABS_DZIKIR : TABS_DOA;

  // Jika belum memilih buku, tampilkan rak digital
  if (!selectedBook) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <DigitalBookshelf onSelectBook={handleSelectBook} />
      </div>
    );
  }

  // ----- Render Konten Buku Terpilih ---------------------------------------
  let contentNode: React.ReactNode;
  if (view.kind === "loading") {
    contentNode = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  } else if (view.kind === "error") {
    contentNode =
      view.code === "API_KEY_MISSING" ? (
        <EmptyState
          icon={AlertTriangle}
          title="API Key Belum Diatur"
          description="Halaman ini memuat data doa & dzikir dari Ahmad Sanusi Open API. Silakan periksa file .env untuk memastikan kredensial API telah terpasang."
        />
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="Gagal Memuat Isi Kitab"
          description={view.message}
        >
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary text-sm !py-2"
          >
            Coba Lagi
          </button>
        </EmptyState>
      );
  } else if (view.kind === "empty" || filteredItems.length === 0) {
    contentNode = (
      <EmptyState
        icon={HandHelping}
        title={
          selectedBook === "doa"
            ? "Tidak Ada Doa Ditemukan"
            : "Tidak Ada Dzikir Ditemukan"
        }
        description={
          isSearching
            ? `Tidak ada bacaan yang cocok dengan pencarian "${query}". Coba kata kunci lainnya.`
            : "Kategori ini belum memiliki bacaan saat ini."
        }
      >
        <button
          onClick={() => {
            setQuery("");
            setActiveTab("semua");
          }}
          className="btn-secondary text-sm !py-2"
        >
          Reset Pencarian
        </button>
      </EmptyState>
    );
  } else {
    contentNode = (
      <>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm text-muted">
            Menampilkan <span className="font-semibold text-text">{filteredItems.length}</span>{" "}
            {selectedBook === "doa" ? "doa" : "dzikir"}
            {!isSearching && activeTab !== "semua" && (
              <>
                {" "}
                dari kategori{" "}
                <span className="font-medium text-text">
                  &ldquo;
                  {currentTabs.find((t) => t.slug === activeTab)?.label ||
                    activeTab}
                  &rdquo;
                </span>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {filteredItems.map((item) =>
            selectedBook === "dzikir" ? (
              <DzikirCard
                key={String(item.id)}
                dzikir={item}
                copiedId={copiedId}
                onCopy={setCopiedId}
                tasbihCount={tasbihCounts[String(item.id)] ?? 0}
                onIncrementTasbih={handleIncrementTasbih}
                onResetTasbih={handleResetTasbih}
              />
            ) : (
              <DoaCard
                key={String(item.id)}
                doa={item}
                copiedId={copiedId}
                onCopy={setCopiedId}
              />
            )
          )}
        </div>
      </>
    );
  }

  const activeCategoryLabel =
    currentTabs.find((t) => t.slug === activeTab)?.label || activeTab;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 animate-fade-in">
      {/* Bar Atas: Tombol Kembali ke Rak Buku & Pengganti Buku Cepat */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border/80 mb-6">
        <button
          onClick={() => handleSelectBook(null)}
          className="btn-ghost !text-xs sm:!text-sm flex items-center gap-2 text-muted hover:text-text !px-2.5 !py-1.5"
          aria-label="Kembali ke Pilihan Buku"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Rak Buku</span>
        </button>

        {/* Tab Switcher Cepat Antara Buku Doa & Dzikir */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-full border border-border shadow-xs">
          <button
            onClick={() => handleSelectBook("doa")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedBook === "doa"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-text hover:bg-black/5"
            }`}
          >
            <span>📘</span>
            <span>Buku Doa</span>
          </button>
          <button
            onClick={() => handleSelectBook("dzikir")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedBook === "dzikir"
                ? "bg-[#103830] text-[#FAF0D4] shadow-xs"
                : "text-muted hover:text-text hover:bg-black/5"
            }`}
          >
            <span>📿</span>
            <span>Buku Dzikir</span>
          </button>
        </div>
      </div>

      {/* Header Kitab yang Sedang Dibuka */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-surface border border-border mb-8 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Miniatur Sampul Buku */}
          <div className="w-14 sm:w-16 shrink-0">
            <IslamicBookCover
              variant={selectedBook}
              size="md"
              isInteractive={false}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-text">
                {selectedBook === "doa" ? "Kumpulan Doa" : "Kumpulan Dzikir"}
              </h1>
              <span
                className={`badge text-[11px] font-semibold ${
                  selectedBook === "doa"
                    ? "badge-primary"
                    : "bg-[#D6B878]/20 text-[#9E7B28] border border-[#D6B878]/40"
                }`}
              >
                {selectedBook === "doa" ? "Pustaka Doa" : "Pustaka Dzikir"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed max-w-xl">
              {selectedBook === "doa"
                ? "Kumpulan doa sehari-hari dari Al-Qur’an dan Sunnah yang shahih beserta transliterasi Latin dan terjemahannya."
                : "Untaian dzikir harian, dzikir pagi & petang, serta dzikir setelah salat fardhu dengan panduan hitungan tasbih."}
            </p>
          </div>
        </div>
      </div>

      {/* Kolom Pencarian */}
      <div className="relative mb-5">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            selectedBook === "doa"
              ? "Cari doa (mis. tidur, makan, keluar rumah, orang tua, istikharah)..."
              : "Cari dzikir (mis. istighfar, petang, ayat kursi, tasbih, sayyidul istighfar)..."
          }
          className="input pl-10 pr-10 text-sm shadow-xs"
          aria-label={
            selectedBook === "doa" ? "Cari dalam buku doa" : "Cari dalam buku dzikir"
          }
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Tab Kategori Buku */}
      <div className="flex flex-wrap gap-2 mb-6">
        {currentTabs.map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setActiveTab(tab.slug)}
            aria-pressed={activeTab === tab.slug}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeTab === tab.slug
                ? selectedBook === "doa"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-[#103830] text-[#FAF0D4] border-[#103830] shadow-xs"
                : "bg-surface text-muted border-border hover:border-primary/40 hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Penghitung Dzikir Putaran Kategori (Khusus Buku Dzikir & Kategori Tunggal) */}
      {selectedBook === "dzikir" && activeTab !== "semua" && !isSearching && (
        <DzikirCategoryCounter
          slug={activeTab}
          label={activeCategoryLabel}
          count={categoryCounts[activeTab] ?? 0}
          onIncrement={() =>
            persistCategoryCounts({
              ...categoryCounts,
              [activeTab]: (categoryCounts[activeTab] ?? 0) + 1,
            })
          }
          onReset={() => {
            const next = { ...categoryCounts };
            delete next[activeTab];
            persistCategoryCounts(next);
          }}
        />
      )}

      {/* Daftar Kartu Doa / Dzikir */}
      {contentNode}

      {/* Keterangan Sumber Resmi */}
      <footer className="text-xs text-muted/75 mt-12 border-t border-border pt-5 text-center leading-relaxed">
        Seluruh teks doa dan dzikir bersumber dari hadits-hadits shahih dan
        diambil melalui{" "}
        <a
          href="https://api.ahmadsanusi.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary transition-colors font-medium"
        >
          Ahmad Sanusi Open API
        </a>
        . Bacaan, referensi, dan jumlah pengulangan disajikan sesuai riwayat
        aslinya.
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export Halaman dengan Suspense Boundary (Standar Next.js App Router)
// ---------------------------------------------------------------------------
export default function DoaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <div className="h-8 w-64 skeleton rounded mb-4" />
          <div className="h-4 w-96 skeleton rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 skeleton rounded-2xl" />
            <div className="h-96 skeleton rounded-2xl" />
          </div>
        </div>
      }
    >
      <DoaPageInner />
    </Suspense>
  );
}
