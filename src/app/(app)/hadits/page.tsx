"use client";

import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  HADITS_BOOKS,
  fetchHaditsList,
  fetchHaditsDetail,
  type HaditsItem,
  type HaditsPagination,
} from "@/lib/hadits-api";
import { haditsCategories } from "@/data/hadits";
import {
  Search,
  BookMarked,
  Bookmark,
  Info,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  BookCheck,
  ScrollText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Komponen Kartu Hadits
// ---------------------------------------------------------------------------
function HaditsCard({
  hadits,
  onOpenDetail,
}: {
  hadits: HaditsItem;
  onOpenDetail: (hadits: HaditsItem) => void;
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved =
    isBookmarked(hadits.id) ||
    isBookmarked(`hadits-${hadits.number}`) ||
    isBookmarked(`arbain-${hadits.number}`);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({
      id: hadits.id,
      type: "hadits",
      title: hadits.title
        ? `Hadits ${hadits.number}: ${hadits.title}`
        : `${hadits.bookName} no. ${hadits.number}`,
      description: hadits.matanSnippet || hadits.text,
      href: `/hadits?kitab=${hadits.bookSlug}&nomor=${hadits.number}`,
    });
  };

  return (
    <article
      onClick={() => onOpenDetail(hadits)}
      className="card flex flex-col cursor-pointer transition-all hover:border-primary/40 hover:shadow-md group relative"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail(hadits);
        }
      }}
      aria-label={`Lihat detail Hadits no. ${hadits.number}: ${hadits.title || hadits.source}`}
    >
      {/* Header Kartu: Nomor, Kategori, Derajat & Bookmark */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
            Hadits #{hadits.number}
          </span>
          <span className="badge badge-primary !py-1 !px-2.5 !text-[11px]">
            {hadits.category}
          </span>
          {hadits.grade && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/15 text-text border border-secondary/30">
              <ShieldCheck size={11} className="text-secondary-dark shrink-0" />
              <span>{hadits.grade}</span>
            </span>
          )}
        </div>
        <button
          onClick={handleBookmarkClick}
          className={`p-2 -m-1 rounded-lg transition-colors ${
            saved
              ? "text-primary"
              : "text-muted hover:text-primary hover:bg-primary/[0.05]"
          }`}
          aria-pressed={saved}
          aria-label={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} strokeWidth={1.8} />
        </button>
      </div>

      {/* Judul Hadits jika ada */}
      {hadits.title && (
        <h3 className="text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors mb-2 leading-snug">
          {hadits.title}
        </h3>
      )}

      {/* Teks Arab (Matan Asli Berharakat) */}
      {hadits.arab && (
        <div className="my-2 p-3.5 bg-primary/[0.025] border border-primary/10 rounded-xl">
          <p
            className="arabic-text text-xl sm:text-2xl leading-loose text-right text-text select-text"
            lang="ar"
            dir="rtl"
          >
            {hadits.arab.length > 200 ? `${hadits.arab.slice(0, 200)}...` : hadits.arab}
          </p>
        </div>
      )}

      {/* Terjemahan Bahasa Indonesia */}
      <p className="text-text leading-relaxed flex-1 text-sm sm:text-base mt-2">
        &ldquo;
        {hadits.matanSnippet
          ? hadits.matanSnippet
          : hadits.text.length > 220
          ? `${hadits.text.slice(0, 220)}...`
          : hadits.text}
        &rdquo;
      </p>

      {/* Footer Info: Perawi Sahabat, Sumber Kitab, Action */}
      <div className="mt-5 pt-3.5 border-t border-border space-y-1.5">
        <p className="text-xs sm:text-sm text-muted">
          <span className="text-text font-medium">Perawi:</span> {hadits.narrator}
        </p>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <p className="text-xs sm:text-sm text-primary font-medium truncate">
            {hadits.source}
          </p>
          <span className="text-xs text-muted group-hover:text-primary transition-colors font-medium flex items-center gap-1 shrink-0">
            Lihat detail &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Loading Cards
// ---------------------------------------------------------------------------
function HaditsCardSkeleton() {
  return (
    <div className="card flex flex-col animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-border/60 rounded-md" />
          <div className="h-5 w-16 bg-border/60 rounded-full" />
        </div>
        <div className="h-6 w-6 bg-border/60 rounded-lg" />
      </div>
      <div className="h-5 bg-border/40 rounded w-2/3 mb-3" />
      <div className="space-y-2 mb-4 p-3 bg-border/20 rounded-xl">
        <div className="h-4 bg-border/50 rounded w-full ml-auto" />
        <div className="h-4 bg-border/50 rounded w-3/4 ml-auto" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-3.5 bg-border/40 rounded w-full" />
        <div className="h-3.5 bg-border/40 rounded w-11/12" />
        <div className="h-3.5 bg-border/40 rounded w-4/5" />
      </div>
      <div className="mt-5 pt-4 border-t border-border space-y-2">
        <div className="h-3 bg-border/40 rounded w-1/2" />
        <div className="h-3 bg-border/50 rounded w-1/3" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal Detail Hadits Lengkap
// ---------------------------------------------------------------------------
function HaditsDetailModal({
  hadits,
  onClose,
}: {
  hadits: HaditsItem | null;
  onClose: () => void;
}) {
  const { isBookmarked, toggle } = useBookmarks();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!hadits) return null;

  const saved =
    isBookmarked(hadits.id) ||
    isBookmarked(`hadits-${hadits.number}`) ||
    isBookmarked(`arbain-${hadits.number}`);

  const handleCopy = async () => {
    const lines = [
      `Hadits #${hadits.number}: ${hadits.title || hadits.bookName}`,
      hadits.grade ? `Derajat: ${hadits.grade}` : "",
      `Perawi: ${hadits.narrator}`,
      `Sumber: ${hadits.source}`,
      "",
      hadits.arab ? `${hadits.arab}\n` : "",
      `Terjemahan:`,
      `"${hadits.text}"`,
      "",
    ];

    if (hadits.lessons && hadits.lessons.length > 0) {
      lines.push("Pelajaran & Faedah Hadits:");
      hadits.lessons.forEach((l, i) => lines.push(`${i + 1}. ${l}`));
      lines.push("");
    }

    lines.push("Sumber: SIRAJ — Belajar. Mengamalkan. Berbagi.");

    const textToCopy = lines.filter((l) => l !== "").join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback jika clipboard diblokir */
    }
  };

  const handleBookmark = () => {
    toggle({
      id: hadits.id,
      type: "hadits",
      title: hadits.title
        ? `Hadits ${hadits.number}: ${hadits.title}`
        : `${hadits.bookName} no. ${hadits.number}`,
      description: hadits.matanSnippet || hadits.text,
      href: `/hadits?kitab=${hadits.bookSlug}&nomor=${hadits.number}`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-hadits-title"
    >
      <div
        className="bg-surface rounded-2xl border border-border shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-border bg-background/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                Hadits #{hadits.number}
              </span>
              <span className="badge badge-primary !text-xs">{hadits.category}</span>
              {hadits.grade && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/20 text-text border border-secondary/40">
                  <ShieldCheck size={12} className="text-secondary-dark" />
                  {hadits.grade}
                </span>
              )}
            </div>
            <h2 id="modal-hadits-title" className="text-lg sm:text-xl font-bold text-text">
              {hadits.title ? hadits.title : `${hadits.bookName} No. ${hadits.number}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded-xl text-muted hover:text-text hover:bg-background transition-colors"
            aria-label="Tutup jendela detail hadits"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Teks Arab Matan Lengkap */}
          {hadits.arab && (
            <div className="p-4 sm:p-5 bg-primary/[0.03] border border-primary/10 rounded-2xl">
              <p className="text-xs text-muted mb-2 font-medium tracking-wide uppercase">
                Teks Arab (Matan Lengkap Berharakat)
              </p>
              <p
                className="arabic-text text-2xl sm:text-3xl leading-loose sm:leading-loose text-right text-text select-text"
                lang="ar"
                dir="rtl"
              >
                {hadits.arab}
              </p>
            </div>
          )}

          {/* Terjemahan Bahasa Indonesia Lengkap */}
          <div>
            <p className="text-xs text-muted mb-2 font-medium tracking-wide uppercase">
              Terjemahan Bahasa Indonesia
            </p>
            <div className="p-4 bg-background rounded-xl border border-border">
              <p className="text-text leading-relaxed text-sm sm:text-base select-text">
                &ldquo;{hadits.text}&rdquo;
              </p>
            </div>
          </div>

          {/* Rincian Sumber & Penilaian Verifikasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-xs text-muted block mb-0.5">Perawi Sahabat</span>
              <span className="font-semibold text-text">{hadits.narrator}</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-xs text-muted block mb-0.5">Kitab Sumber Asli</span>
              <span className="font-semibold text-text">{hadits.source}</span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-xs text-muted block mb-0.5">Nomor Hadits Arba&apos;in</span>
              <span className="font-semibold text-primary font-mono text-base">
                #{hadits.number} dari 42
              </span>
            </div>
            <div className="p-3 bg-surface border border-border rounded-xl">
              <span className="text-xs text-muted block mb-0.5">Derajat / Status Keshahihan</span>
              <span className="font-semibold text-primary">
                {hadits.grade || "Shahih / Hasan"}
              </span>
            </div>
          </div>

          {/* Pelajaran & Faedah Hadits */}
          {hadits.lessons && hadits.lessons.length > 0 && (
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary-dark uppercase tracking-wider">
                <ScrollText size={15} />
                <span>Pelajaran &amp; Faedah Hadits</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-text">
                {hadits.lessons.map((lesson, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-dark mt-2 shrink-0" />
                    <span className="leading-relaxed">{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hadits.note && (
            <div className="p-3 bg-primary/[0.04] border border-primary/15 rounded-xl">
              <p className="text-xs text-text leading-relaxed">
                <span className="font-semibold text-primary">Catatan Syarah:</span>{" "}
                {hadits.note}
              </p>
            </div>
          )}

          <div className="text-[11px] text-muted leading-relaxed flex items-center gap-1.5 pt-1">
            <Info size={13} className="text-primary shrink-0" />
            <span>
              Teks hadits disinkronkan dengan Kitab Al-Arba&apos;in An-Nawawiyyah karya
              Al-Imam An-Nawawi (631–676 H) dan rujukan Kutubut Tis&apos;ah.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-t border-border bg-background/50">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-secondary text-xs sm:text-sm !py-2 !px-3.5 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-primary" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Salin Hadits</span>
                </>
              )}
            </button>
            <button
              onClick={handleBookmark}
              className={`btn-secondary text-xs sm:text-sm !py-2 !px-3.5 flex items-center gap-1.5 transition-colors ${
                saved ? "!border-primary !text-primary bg-primary/5" : ""
              }`}
              aria-pressed={saved}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              <span>{saved ? "Tersimpan" : "Simpan"}</span>
            </button>
          </div>
          <button onClick={onClose} className="btn-primary text-xs sm:text-sm !py-2 !px-4">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Komponen Utama Halaman Hadits
// ---------------------------------------------------------------------------
function HaditsPageContent() {
  const searchParams = useSearchParams();

  // State parameter pencarian & filter
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedBookSlug, setSelectedBookSlug] = useState<string>(() => {
    const k = searchParams.get("kitab");
    return k && HADITS_BOOKS.some((b) => b.slug === k) ? k : "arbain-nawawi";
  });
  const [page, setPage] = useState<number>(1);

  // State data API
  const [items, setItems] = useState<HaditsItem[]>([]);
  const [pagination, setPagination] = useState<HaditsPagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal detail
  const [activeDetail, setActiveDetail] = useState<HaditsItem | null>(null);

  // Ambil buku aktif (default: Arba'in An-Nawawi)
  const currentBook = useMemo(
    () => HADITS_BOOKS.find((b) => b.slug === selectedBookSlug) || HADITS_BOOKS[0],
    [selectedBookSlug]
  );

  // Menentukan batas per halaman (tampilkan seluruh 42 hadits jika Arba'in)
  const pageSize = selectedBookSlug === "arbain-nawawi" ? 42 : 20;

  // Load data hadits dari API / local source
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchHaditsList({
        bookSlug: selectedBookSlug,
        page,
        limit: pageSize,
        category,
        search: query,
      });

      setItems(response.items);
      setPagination(response.pagination);
    } catch (err: unknown) {
      console.error("Gagal mengambil data hadits:", err);
      setError("Gagal memuat hadits dari server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedBookSlug, page, pageSize, category, query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi data dari API saat filter atau halaman berubah
    loadData();
  }, [loadData]);

  // Cek deep link dari URL (mis. /hadits?nomor=1 atau /hadits?kitab=arbain-nawawi&nomor=1)
  useEffect(() => {
    const nomorParam = searchParams.get("nomor");
    const kitabParam = searchParams.get("kitab") || "arbain-nawawi";

    if (nomorParam) {
      const num = parseInt(nomorParam, 10);
      if (!isNaN(num)) {
        fetchHaditsDetail(kitabParam, num).then((detail) => {
          if (detail) {
            setActiveDetail(detail);
          }
        });
      }
    }
  }, [searchParams]);

  // Ganti kitab koleksi
  const handleSelectBook = (slug: string) => {
    if (slug === selectedBookSlug) return;
    setSelectedBookSlug(slug);
    setPage(1);
  };

  // Reset filter
  const handleReset = () => {
    setQuery("");
    setCategory(null);
    setPage(1);
  };

  const isArbainActive = selectedBookSlug === "arbain-nawawi";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Header Utama */}
      <PageHeader
        title="Hadits"
        subtitle="Pelajaran dari sabda Rasulullah ﷺ, lengkap dengan sumbernya."
      />

      {/* Banner Utama: 42 Hadits Arba'in An-Nawawi */}
      <div className="p-4 sm:p-5 bg-primary/[0.04] border border-primary/15 rounded-2xl mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <BookCheck size={20} className="text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-text">
                42 Hadits Arba&apos;in An-Nawawiyyah
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-secondary/20 text-secondary-dark border border-secondary/30">
                <Sparkles size={11} />
                Lengkap No. 1–42
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Karya monumental Al-Imam Abu Zakariya Yahya bin Syaraf An-Nawawi (631–676 H).
              Memuat prinsip pokok ajaran Islam yang bersumber dari kitab hadits shahih
              terpercaya (Shahih Bukhari, Muslim, Abu Dawud, At-Tirmidzi, dll).
            </p>
          </div>
        </div>
      </div>

      {/* Pilihan Koleksi Kitab Hadits */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            <span>Koleksi Hadits:</span>
          </label>
          <span className="text-xs text-muted">
            {currentBook.name} ({currentBook.total.toLocaleString("id-ID")} hadits)
          </span>
        </div>
        <div
          className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin"
          role="tablist"
          aria-label="Pilihan Kitab Hadits"
        >
          {HADITS_BOOKS.map((book) => {
            const isSelected = selectedBookSlug === book.slug;
            return (
              <button
                key={book.slug}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectBook(book.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm font-semibold"
                    : "bg-surface text-muted border-border hover:border-primary/30 hover:text-text"
                }`}
              >
                {book.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kolom Pencarian */}
      <div className="relative mb-4">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={
            isArbainActive
              ? "Cari 42 Hadits Arba'in (nomor, judul, tema, terjemahan, perawi)..."
              : `Cari hadits dalam ${currentBook.name} (teks terjemah, perawi, nomor)...`
          }
          className="input pl-10 pr-10"
          aria-label="Cari hadits"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Kategori: Semua, Iman, Ibadah, Akhlak, Ilmu, Muamalah */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setCategory(null);
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !category
              ? "bg-primary text-white border-primary"
              : "bg-surface text-muted border-border hover:border-primary/30 hover:text-text"
          }`}
          aria-pressed={!category}
        >
          Semua
        </button>
        {haditsCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(category === cat ? null : cat);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? "bg-primary text-white border-primary"
                : "bg-surface text-muted border-border hover:border-primary/30 hover:text-text"
            }`}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pesan Error & Tombol Coba Lagi */}
      {error ? (
        <div className="p-6 bg-error/5 border border-error/20 rounded-2xl text-center my-6">
          <AlertTriangle size={32} className="mx-auto text-error mb-2" />
          <h3 className="font-semibold text-text mb-1">Gagal Memuat Hadits</h3>
          <p className="text-sm text-muted mb-4 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => loadData()}
            className="btn-primary text-sm !py-2 !px-4 inline-flex items-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : isLoading ? (
        /* Loading Skeleton */
        <div>
          <div className="h-4 w-48 bg-border/40 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <HaditsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={BookMarked}
          title="Hadits tidak ditemukan"
          description={
            query
              ? `Tidak ada hadits yang cocok dengan pencarian "${query}". Coba kata kunci lain atau cari berdasarkan nomor hadits.`
              : `Belum ada hadits pada kategori ${category} yang sesuai.`
          }
        >
          <button onClick={handleReset} className="btn-secondary text-sm !py-2">
            Reset pencarian &amp; filter
          </button>
        </EmptyState>
      ) : (
        /* Daftar Hadits Sukses Dimuat */
        <>
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-sm text-muted">
              Menampilkan {items.length} hadits dari{" "}
              <span className="font-medium text-text">{currentBook.name}</span>
              {pagination && pagination.totalPages > 1 && (
                <span className="ml-1 text-xs text-muted">
                  (Halaman {pagination.currentPage} dari {pagination.totalPages})
                </span>
              )}
            </p>
            <div className="text-xs text-muted">
              Total {pagination ? pagination.totalItems : items.length} hadits
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((hadits) => (
              <HaditsCard
                key={hadits.id}
                hadits={hadits}
                onOpenDetail={(item) => setActiveDetail(item)}
              />
            ))}
          </div>

          {/* Kontrol Navigasi Pagination (Bila lebih dari 1 halaman) */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
              <span className="text-xs text-muted order-2 sm:order-1">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
              </span>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  disabled={pagination.currentPage <= 1 || isLoading}
                  className="btn-secondary text-xs sm:text-sm !py-2 !px-3.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={16} />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    const start = Math.max(
                      1,
                      Math.min(pagination.currentPage - 2, pagination.totalPages - 4)
                    );
                    const pageNum = start + idx;
                    if (pageNum > pagination.totalPages) return null;
                    const isCurrent = pageNum === pagination.currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setPage(pageNum);
                          window.scrollTo({ top: 200, behavior: "smooth" });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          isCurrent
                            ? "bg-primary text-white font-semibold"
                            : "bg-surface text-muted border border-border hover:border-primary/40 hover:text-text"
                        }`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setPage((p) => Math.min(pagination.totalPages, p + 1));
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                  className="btn-secondary text-xs sm:text-sm !py-2 !px-3.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Halaman berikutnya"
                >
                  <span>Berikutnya</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Detail Hadits */}
      <HaditsDetailModal
        hadits={activeDetail}
        onClose={() => setActiveDetail(null)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export Default dengan Suspense untuk searchParams
// ---------------------------------------------------------------------------
export default function HaditsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          <PageHeader
            title="Hadits"
            subtitle="Pelajaran dari sabda Rasulullah ﷺ, lengkap dengan sumbernya."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <HaditsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <HaditsPageContent />
    </Suspense>
  );
}
