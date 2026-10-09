"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { surahs } from "@/data/quran";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import { Search, BookOpen, X } from "lucide-react";

const filters = ["Semua", "Makkiyah", "Madaniyah"] as const;
type Filter = (typeof filters)[number];

function padNumber(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export default function QuranPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [loading, setLoading] = useState(true);

  // Simulasikan pemuatan data daftar surah
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return surahs.filter((surah) => {
      const matchFilter = filter === "Semua" || surah.type === filter;
      const matchQuery =
        !q ||
        surah.nameLatin.toLowerCase().includes(q) ||
        surah.meaning.toLowerCase().includes(q) ||
        surah.nameArabic.includes(query.trim()) ||
        String(surah.number) === q;
      return matchFilter && matchQuery;
    });
  }, [query, filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <PageHeader title="Al-Qur'an" subtitle="Baca, renungkan, dan pahami." />

      {/* Search & filter */}
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
            placeholder="Cari surah..."
            className="input pl-10 pr-10"
            aria-label="Cari surah"
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

        <div className="flex items-center gap-1 bg-surface border border-border rounded-[10px] p-1 self-start">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "text-muted hover:text-text hover:bg-primary/[0.04]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card !p-4 flex items-center gap-4">
              <div className="skeleton w-11 h-11 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Surah tidak ditemukan"
          description={`Tidak ada surah yang cocok dengan pencarian "${query}" atau filter ${filter}. Coba kata kunci lain.`}
        >
          <button
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
          {results.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="card group flex items-center gap-4 hover:border-primary/20 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <span className="text-sm font-semibold text-primary">
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
                  <p className="arabic-text text-xl shrink-0" aria-label={`Nama surah ${surah.nameLatin}`}>
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
      )}
    </div>
  );
}
