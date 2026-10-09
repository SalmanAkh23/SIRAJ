"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getSurahByNumber } from "@/data/quran";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  ArrowLeft,
  Bookmark,
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";

function padNumber(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export default function SurahDetailPage() {
  const params = useParams<{ number: string }>();
  const surah = getSurahByNumber(Number(params.number));
  const { isBookmarked, toggle } = useBookmarks();
  const [notice, setNotice] = useState<string | null>(null);
  const [currentAyat, setCurrentAyat] = useState(1);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!surah) notFound();

  const hasPartialData = surah.ayat.length > 0 && surah.ayat.length < surah.totalAyat;
  const showBismillah = surah.number !== 1 && surah.number !== 9 && surah.ayat.length > 0;
  const lastIndex = surah.ayat.length;

  const scrollToAyat = (n: number) => {
    const el = document.getElementById(`ayat-${n}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentAyat(n);
    }
  };

  const handleShare = async (ayatNumber: number, translation: string) => {
    const text = `QS. ${surah.nameLatin}: ${ayatNumber}\n\n"${translation}"\n\n— SIRAJ`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `QS. ${surah.nameLatin}: ${ayatNumber}`, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotice("Ayat disalin ke clipboard.");
    } catch {
      setNotice("Ayat tidak dapat dibagikan saat ini.");
    }
  };

  const handlePlay = () => {
    setNotice("Audio murattal akan tersedia pada phase berikutnya.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Back link */}
      <Link
        href="/quran"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Kembali ke daftar surah
      </Link>

      {/* Header */}
      <header className="card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {padNumber(surah.number)}
              </span>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-text tracking-tight">
                  {surah.nameLatin}
                </h1>
                <p className="text-sm text-muted mt-0.5">
                  {surah.totalAyat} Ayat • {surah.type} • {surah.meaning}
                </p>
              </div>
            </div>
          </div>
          <p className="arabic-text text-3xl lg:text-4xl shrink-0" aria-hidden="true">
            {surah.nameArabic}
          </p>
        </div>

        {hasPartialData && (
          <p className="mt-4 pt-4 border-t border-border text-xs text-muted">
            Contoh data Phase 1: menampilkan {surah.ayat.length} ayat pertama dari{" "}
            {surah.totalAyat} ayat. Ayat lengkap akan ditambahkan pada phase berikutnya.
          </p>
        )}
      </header>

      {/* Notice */}
      {notice && (
        <div
          role="status"
          className="mb-6 px-4 py-3 bg-primary/[0.06] border border-primary/15 rounded-xl text-sm text-primary animate-fade-in"
        >
          {notice}
        </div>
      )}

      {surah.ayat.length === 0 ? (
        <div className="card text-center py-12 px-6">
          <div className="w-12 h-12 rounded-xl bg-primary/[0.06] flex items-center justify-center mx-auto mb-4">
            <BookOpen size={22} className="text-primary" strokeWidth={1.8} />
          </div>
          <h2 className="font-semibold text-text">Ayat belum tersedia</h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
            Teks ayat untuk Surah {surah.nameLatin} belum termasuk dalam contoh data
            Phase 1. Kamu bisa membaca surah lain sambil menunggu pembaruan.
          </p>
          <Link href="/quran" className="btn-secondary text-sm !py-2 mt-6 inline-flex">
            Lihat surah lain
          </Link>
        </div>
      ) : (
        <>
          {showBismillah && (
            <div className="text-center py-6 mb-2" aria-hidden="true">
              <p className="arabic-text text-2xl sm:text-3xl leading-loose">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {surah.ayat.map((ayat) => {
              const bookmarkId = `ayat-${surah.number}-${ayat.number}`;
              const saved = isBookmarked(bookmarkId);

              return (
                <article
                  key={ayat.number}
                  id={`ayat-${ayat.number}`}
                  className="card scroll-mt-24"
                >
                  {/* Ayat header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-primary/[0.07] border border-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {ayat.number}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          toggle({
                            id: bookmarkId,
                            type: "ayat",
                            title: `${surah.nameLatin}: ${ayat.number}`,
                            description: ayat.translation,
                            href: `/quran/${surah.number}`,
                          })
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          saved
                            ? "text-primary bg-primary/[0.08]"
                            : "text-muted hover:text-primary hover:bg-primary/[0.05]"
                        }`}
                        aria-label={saved ? "Hapus bookmark ayat" : "Simpan ayat ke bookmark"}
                        title={saved ? "Tersimpan" : "Bookmark"}
                      >
                        <Bookmark
                          size={16}
                          fill={saved ? "currentColor" : "none"}
                          strokeWidth={1.8}
                        />
                      </button>

                      <button
                        onClick={handlePlay}
                        className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/[0.05] transition-colors"
                        aria-label="Putar audio ayat"
                        title="Putar audio"
                      >
                        <Play size={16} strokeWidth={1.8} />
                      </button>

                      <button
                        onClick={() => handleShare(ayat.number, ayat.translation)}
                        className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/[0.05] transition-colors"
                        aria-label="Bagikan ayat"
                        title="Bagikan"
                      >
                        <Share2 size={16} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>

                  {/* Teks Arab */}
                  <p
                    className="arabic-text text-2xl sm:text-3xl lg:text-[2.1rem] text-text mb-5"
                    lang="ar"
                  >
                    {ayat.arabic}
                  </p>

                  {/* Terjemahan */}
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1.5">
                      Terjemahan
                    </p>
                    <p className="text-text/90 leading-relaxed">{ayat.translation}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Navigasi ayat */}
          <nav
            className="flex items-center justify-between gap-3 mt-8"
            aria-label="Navigasi ayat"
          >
            <button
              onClick={() => scrollToAyat(currentAyat - 1)}
              disabled={currentAyat <= 1}
              className="btn-secondary text-sm !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} />
              Ayat sebelumnya
            </button>

            <span className="text-sm text-muted">
              Ayat {currentAyat} dari {lastIndex}
            </span>

            <button
              onClick={() => scrollToAyat(currentAyat + 1)}
              disabled={currentAyat >= lastIndex}
              className="btn-secondary text-sm !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent"
            >
              Ayat berikutnya
              <ChevronRight size={16} />
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
