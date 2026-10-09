"use client";

import { useMemo, useState } from "react";
import { doaList, doaCategories, type Doa } from "@/data/doa";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  Search,
  Copy,
  Check,
  Bookmark,
  HandHelping,
  X,
} from "lucide-react";

function DoaCard({ doa }: { doa: Doa }) {
  const { isBookmarked, toggle } = useBookmarks();
  const [copied, setCopied] = useState(false);
  const saved = isBookmarked(doa.id);

  const handleCopy = async () => {
    const text = `${doa.title}\n\n${doa.arabic}\n\n${doa.translation}\nSumber: ${doa.source}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard tidak tersedia — abaikan
    }
  };

  return (
    <article className="card flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="font-semibold text-text">{doa.title}</h2>
        <span className="badge badge-secondary !py-1 !px-2.5 !text-[11px] shrink-0">
          {doaCategories.find((c) => c.id === doa.category)?.name ?? doa.category}
        </span>
      </div>

      <p
        className="arabic-text text-2xl leading-loose mb-4"
        lang="ar"
      >
        {doa.arabic}
      </p>

      <p className="text-sm text-text/85 leading-relaxed flex-1">{doa.translation}</p>

      <p className="text-xs text-muted mt-3 italic">{doa.source}</p>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
        <button
          onClick={handleCopy}
          className="btn-secondary text-sm !py-2 !px-4"
          aria-label={`Salin ${doa.title}`}
        >
          {copied ? (
            <>
              <Check size={15} className="text-primary" />
              Tersalin
            </>
          ) : (
            <>
              <Copy size={15} />
              Salin
            </>
          )}
        </button>

        <button
          onClick={() =>
            toggle({
              id: doa.id,
              type: "doa",
              title: doa.title,
              description: doa.translation,
              href: "/doa",
            })
          }
          className={`btn-ghost ${saved ? "!text-primary" : ""}`}
          aria-pressed={saved}
          aria-label={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
        >
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          {saved ? "Tersimpan" : "Bookmark"}
        </button>
      </div>
    </article>
  );
}

export default function DoaPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doaList.filter((doa) => {
      const matchCategory = !category || doa.category === category;
      const matchQuery =
        !q ||
        doa.title.toLowerCase().includes(q) ||
        doa.translation.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  const hasFilter = Boolean(query || category);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <PageHeader
        title="Doa & Dzikir"
        subtitle="Kumpulan doa harian lengkap dengan terjemahan dan sumbernya."
      />

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
          placeholder="Cari doa..."
          className="input pl-10 pr-10"
          aria-label="Cari doa"
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

      {/* Kategori */}
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
        {doaCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(category === cat.id ? null : cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat.id
                ? "bg-primary text-white border-primary"
                : "bg-surface text-muted border-border hover:border-primary/30 hover:text-text"
            }`}
            aria-pressed={category === cat.id}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={HandHelping}
          title="Doa tidak ditemukan"
          description={`Tidak ada doa yang cocok dengan pencarian "${query}". Coba kata kunci lain.`}
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
          {hasFilter && (
            <p className="text-sm text-muted mb-4">
              Menampilkan {results.length} doa
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((doa) => (
              <DoaCard key={doa.id} doa={doa} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
