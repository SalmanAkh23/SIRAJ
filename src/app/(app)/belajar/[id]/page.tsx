"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { materiList, getMateriById } from "@/data/materi";
import MarkdownContent, { extractHeadings } from "@/components/md-content";
import { MateriThumbnail } from "@/components/belajar-illustrations";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  List,
  ArrowRight,
  Check,
} from "lucide-react";

function TocNav({
  headings,
  className = "",
}: {
  headings: { id: string; text: string }[];
  className?: string;
}) {
  return (
    <nav className={className} aria-label="Daftar isi">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#718078] mb-3">
        Daftar Isi
      </p>
      <ul className="flex flex-col gap-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-[#718078] hover:text-[#174A3A] transition-colors leading-snug block"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function MateriDetailPage() {
  const params = useParams<{ id: string }>();
  const materi = getMateriById(params.id);
  const { isBookmarked, toggle } = useBookmarks();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  if (!materi) notFound();

  const headings = extractHeadings(materi.content);
  const currentIndex = materiList.findIndex((m) => m.id === materi.id);
  const nextMateri = materiList[(currentIndex + 1) % materiList.length];

  const bookmarkId = `materi-${materi.id}`;
  const saved = isBookmarked(bookmarkId);

  const handleShare = async () => {
    const text = `${materi.title} — belajar bersama SIRAJ`;
    try {
      if (navigator.share) {
        await navigator.share({ title: materi.title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setNotice("Tautan materi disalin.");
    } catch {
      setNotice("Materi tidak dapat dibagikan saat ini.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Back link */}
      <Link
        href="/belajar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#718078] hover:text-[#174A3A] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Kembali ke daftar materi
      </Link>

      {/* Header Card */}
      <header className="relative overflow-hidden rounded-3xl border border-[#D6B878]/40 bg-gradient-to-br from-[#FBF9F3] via-[#F5EFE2] to-[#E6EFEA] p-6 sm:p-8 mb-8 shadow-[0_8px_28px_-8px_rgba(23,74,58,0.07)]">
        <div
          className="absolute inset-0 pattern-star opacity-[0.04] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-full md:w-52 h-44 md:h-40 rounded-2xl overflow-hidden border border-[#D6B878]/45 shrink-0 shadow-xs">
            <MateriThumbnail materiId={materi.id} className="w-full h-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#174A3A]/[0.09] text-[#174A3A] border border-[#174A3A]/15">
                {materi.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#718078]">
                <Clock size={14} className="text-[#B89246]" />
                {materi.readTime} menit membaca
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#263A35] tracking-tight leading-tight">
              {materi.title}
            </h1>
            <p className="text-[#718078] text-sm sm:text-base mt-2.5 leading-relaxed max-w-2xl">
              {materi.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-[#D6B878]/30">
              <div className="flex items-center gap-3 min-w-[180px]">
                <div className="w-28 h-2 bg-white/80 rounded-full overflow-hidden border border-[#D6B878]/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#174A3A] to-[#D6B878]"
                    style={{ width: `${materi.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#263A35]">
                  Progres {materi.progress}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    toggle({
                      id: bookmarkId,
                      type: "materi",
                      title: materi.title,
                      description: materi.description,
                      href: `/belajar/${materi.id}`,
                    })
                  }
                  className={`btn-secondary bg-white/90 text-sm !py-2 !px-4 ${
                    saved ? "!border-[#174A3A]/40 !text-[#174A3A]" : ""
                  }`}
                  aria-pressed={saved}
                >
                  <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Tersimpan" : "Simpan"}
                </button>
                <button
                  onClick={handleShare}
                  className="btn-secondary bg-white/90 text-sm !py-2 !px-4"
                >
                  <Share2 size={15} />
                  Bagikan
                </button>
              </div>
            </div>

            {notice && (
              <div
                role="status"
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 bg-[#174A3A]/[0.08] border border-[#174A3A]/20 rounded-lg text-sm text-[#174A3A] animate-fade-in"
              >
                <Check size={14} />
                {notice}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TOC mobile */}
      {headings.length > 0 && (
        <details className="lg:hidden card mb-6 !p-4">
          <summary className="flex items-center gap-2 text-sm font-medium text-[#263A35] cursor-pointer list-none">
            <List size={16} className="text-[#174A3A]" />
            Daftar isi
          </summary>
          <TocNav headings={headings} className="mt-4 pl-1" />
        </details>
      )}

      <div className="grid lg:grid-cols-[1fr_240px] gap-10 items-start">
        {/* Article */}
        <article className="max-w-3xl bg-white border border-[#E6E3D8] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-[0_2px_16px_rgba(23,74,58,0.03)]">
          <MarkdownContent content={materi.content} />
        </article>

        {/* TOC desktop */}
        {headings.length > 0 && (
          <aside className="hidden lg:block sticky top-24">
            <div className="border-l-2 border-[#D6B878]/50 pl-4">
              <TocNav headings={headings} />
            </div>
          </aside>
        )}
      </div>

      {/* Materi berikutnya */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-[#263A35] mb-4">Materi berikutnya</h2>
        <Link
          href={`/belajar/${nextMateri.id}`}
          className="group bg-white rounded-2xl border border-[#E6E3D8] hover:border-[#D6B878] p-3.5 sm:p-4 flex items-center gap-4 shadow-[0_2px_14px_rgba(23,74,58,0.04)] hover:shadow-[0_10px_24px_-6px_rgba(23,74,58,0.1)] transition-all max-w-2xl"
        >
          <div className="w-24 h-20 rounded-xl overflow-hidden border border-[#D6B878]/35 shrink-0">
            <MateriThumbnail materiId={nextMateri.id} className="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#174A3A]/[0.09] text-[#174A3A]">
                {nextMateri.category}
              </span>
              <span className="text-xs text-[#718078]">{nextMateri.readTime} menit membaca</span>
            </div>
            <h3 className="font-bold text-[#263A35] group-hover:text-[#174A3A] transition-colors truncate">
              {nextMateri.title}
            </h3>
            <p className="text-sm text-[#718078] mt-1 line-clamp-1">{nextMateri.description}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5F2E9] flex items-center justify-center shrink-0 group-hover:bg-[#174A3A] group-hover:text-white text-[#174A3A] border border-[#D6B878]/35 transition-all">
            <ArrowRight size={18} />
          </div>
        </Link>
      </section>
    </div>
  );
}
