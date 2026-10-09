"use client";

import { useMemo, useState } from "react";
import { haditsList, haditsCategories, type Hadits } from "@/data/hadits";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { useBookmarks } from "@/lib/bookmark-context";
import { Search, BookMarked, Bookmark, Info, X } from "lucide-react";

function HaditsCard({ hadits }: { hadits: Hadits }) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(hadits.id);

  return (
    <article className="card flex flex-col">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="badge badge-primary !py-1 !px-2.5 !text-[11px]">
          {hadits.category}
        </span>
        <button
          onClick={() =>
            toggle({
              id: hadits.id,
              type: "hadits",
              title: `Hadits ${hadits.category}`,
              description: hadits.text,
              href: "/hadits",
            })
          }
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

      <p className="text-text leading-relaxed flex-1">&ldquo;{hadits.text}&rdquo;</p>

      <div className="mt-5 pt-4 border-t border-border space-y-1.5">
        <p className="text-sm text-muted">
          <span className="text-text font-medium">Perawi:</span> {hadits.narrator}
        </p>
        <p className="text-sm text-primary font-medium">{hadits.source}</p>
        {hadits.note && (
          <p className="text-xs text-muted italic leading-relaxed pt-1">{hadits.note}</p>
        )}
      </div>
    </article>
  );
}

export default function HaditsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return haditsList.filter((hadits) => {
      const matchCategory = !category || hadits.category === category;
      const matchQuery =
        !q ||
        hadits.text.toLowerCase().includes(q) ||
        hadits.narrator.toLowerCase().includes(q) ||
        hadits.source.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <PageHeader title="Hadits" subtitle="Pelajaran dari sabda Rasulullah ﷺ, lengkap dengan sumbernya." />

      {/* Disclaimer sumber */}
      <div className="flex items-start gap-2.5 p-3.5 bg-primary/[0.04] border border-primary/10 rounded-xl mb-6">
        <Info size={16} className="text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted leading-relaxed">
          Setiap hadits di SIRAJ ditampilkan bersama sumber periwayatannya. Untuk
          kepastian hukum, rujuklah kepada ulama dan kitab induk hadits.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari hadits..."
          className="input pl-10 pr-10"
          aria-label="Cari hadits"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
            aria-label="Hapus pencarian"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter kategori */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory(null)}
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
            onClick={() => setCategory(category === cat ? null : cat)}
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

      {results.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="Hadits tidak ditemukan"
          description={
            query
              ? `Tidak ada hadits yang cocok dengan pencarian "${query}". Coba kata kunci lain.`
              : "Belum ada hadits pada kategori ini."
          }
        >
          <button
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
            className="btn-secondary text-sm !py-2"
          >
            Reset pencarian
          </button>
        </EmptyState>
      ) : (
        <>
          <p className="text-sm text-muted mb-4">Menampilkan {results.length} hadits</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((hadits) => (
              <HaditsCard key={hadits.id} hadits={hadits} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
