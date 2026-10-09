"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBookmarks } from "@/lib/bookmark-context";
import type { BookmarkType } from "@/lib/bookmark-context";
import type { BookmarkItem } from "@/data/user";
import EmptyState from "@/components/empty-state";
import {
  Bookmark,
  BookOpen,
  GraduationCap,
  BookMarked,
  HandHelping,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TabId = "semua" | BookmarkType;

const tabs: { id: TabId; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "ayat", label: "Ayat" },
  { id: "materi", label: "Materi" },
  { id: "hadits", label: "Hadits" },
  { id: "doa", label: "Doa" },
];

const typeMeta: Record<BookmarkType, { label: string; icon: LucideIcon }> = {
  ayat: { label: "Ayat", icon: BookOpen },
  materi: { label: "Materi", icon: GraduationCap },
  hadits: { label: "Hadits", icon: BookMarked },
  doa: { label: "Doa", icon: HandHelping },
};

const emptyCopy: Record<TabId, { title: string; description: string }> = {
  semua: {
    title: "Belum ada yang disimpan",
    description:
      "Simpan ayat, materi, hadits, atau doa favoritmu agar mudah ditemukan kembali di sini.",
  },
  ayat: {
    title: "Belum ada ayat tersimpan",
    description: "Tekan ikon bookmark pada ayat Al-Qur'an untuk menyimpannya di sini.",
  },
  materi: {
    title: "Belum ada materi tersimpan",
    description: "Simpan materi yang ingin kamu baca lagi nanti.",
  },
  hadits: {
    title: "Belum ada hadits tersimpan",
    description: "Simpan hadits yang ingin kamu hafalkan atau renungkan.",
  },
  doa: {
    title: "Belum ada doa tersimpan",
    description: "Simpan doa harian agar mudah diamalkan setiap hari.",
  },
};

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

export default function BookmarkPage() {
  const { bookmarks, remove } = useBookmarks();
  const [tab, setTab] = useState<TabId>("semua");

  const counts = useMemo(() => {
    const result: Record<string, number> = { semua: bookmarks.length };
    for (const b of bookmarks) {
      result[b.type] = (result[b.type] ?? 0) + 1;
    }
    return result;
  }, [bookmarks]);

  const filtered = useMemo(
    () => (tab === "semua" ? bookmarks : bookmarks.filter((b) => b.type === tab)),
    [bookmarks, tab]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <header className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text tracking-tight">Disimpan</h1>
        <p className="text-muted mt-1.5 text-sm sm:text-base">
          Ayat, materi, hadits, dan doa yang kamu simpan untuk dibaca lagi.
        </p>
      </header>

      {/* Tabs */}
      <div
        className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-border"
        role="tablist"
        aria-label="Kategori bookmark"
      >
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs text-muted">({counts[t.id] ?? 0})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={emptyCopy[tab].title}
          description={emptyCopy[tab].description}
        >
          <Link href="/quran" className="btn-primary text-sm !py-2.5">
            Jelajahi Al-Qur&apos;an
            <ArrowRight size={16} />
          </Link>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item: BookmarkItem) => {
            const meta = typeMeta[item.type];
            const Icon = meta.icon;
            return (
              <article key={item.id} className="card flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="badge badge-primary !py-1 !px-2.5 !text-[11px]">
                    <Icon size={12} />
                    {meta.label}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    className="p-1.5 -m-1 rounded-lg text-muted hover:text-error hover:bg-error/5 transition-colors"
                    aria-label={`Hapus ${item.title} dari disimpan`}
                  >
                    <Trash2 size={15} strokeWidth={1.8} />
                  </button>
                </div>

                <h2 className="font-semibold text-text">{item.title}</h2>
                <p className="text-sm text-muted mt-1.5 leading-relaxed flex-1 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted">Disimpan {formatDate(item.savedAt)}</span>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                    >
                      Buka
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
