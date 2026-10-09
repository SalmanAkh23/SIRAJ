"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { materiList, getMateriById } from "@/data/materi";
import MarkdownContent, { extractHeadings } from "@/components/md-content";
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

function TocNav({ headings, className = "" }: { headings: { id: string; text: string }[]; className?: string }) {
  return (
    <nav className={className} aria-label="Daftar isi">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
        Daftar Isi
      </p>
      <ul className="flex flex-col gap-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-muted hover:text-primary transition-colors leading-snug block"
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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Kembali ke daftar materi
      </Link>

      {/* Header */}
      <header className="max-w-3xl mb-8">
        <span className="badge badge-primary mb-4">{materi.category}</span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text tracking-tight leading-tight">
          {materi.title}
        </h1>
        <p className="text-muted mt-3 leading-relaxed">{materi.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <Clock size={15} />
            {materi.readTime} menit membaca
          </span>

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
              className={`btn-secondary text-sm !py-2 !px-4 ${
                saved ? "!border-primary/40 !text-primary" : ""
              }`}
              aria-pressed={saved}
            >
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
              {saved ? "Tersimpan" : "Simpan"}
            </button>
            <button onClick={handleShare} className="btn-secondary text-sm !py-2 !px-4">
              <Share2 size={15} />
              Bagikan
            </button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 bg-primary/[0.06] border border-primary/15 rounded-lg text-sm text-primary animate-fade-in"
          >
            <Check size={14} />
            {notice}
          </div>
        )}
      </header>

      {/* TOC mobile */}
      {headings.length > 0 && (
        <details className="lg:hidden card mb-6 !p-4">
          <summary className="flex items-center gap-2 text-sm font-medium text-text cursor-pointer list-none">
            <List size={16} className="text-primary" />
            Daftar isi
          </summary>
          <TocNav headings={headings} className="mt-4 pl-1" />
        </details>
      )}

      <div className="grid lg:grid-cols-[1fr_240px] gap-10 items-start">
        {/* Article */}
        <article className="max-w-3xl bg-surface border border-border rounded-xl p-6 sm:p-8 lg:p-10">
          <MarkdownContent content={materi.content} />
        </article>

        {/* TOC desktop */}
        {headings.length > 0 && (
          <aside className="hidden lg:block sticky top-24">
            <div className="border-l-2 border-border pl-4">
              <TocNav headings={headings} />
            </div>
          </aside>
        )}
      </div>

      {/* Materi berikutnya */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-text mb-4">Materi berikutnya</h2>
        <Link
          href={`/belajar/${nextMateri.id}`}
          className="card group flex items-center gap-4 hover:border-primary/20 transition-all max-w-2xl"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-primary !py-1 !px-2.5 !text-[11px]">
                {nextMateri.category}
              </span>
              <span className="text-xs text-muted">{nextMateri.readTime} menit</span>
            </div>
            <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
              {nextMateri.title}
            </h3>
            <p className="text-sm text-muted mt-1 line-clamp-1">{nextMateri.description}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white text-primary transition-all">
            <ArrowRight size={18} />
          </div>
        </Link>
      </section>
    </div>
  );
}
