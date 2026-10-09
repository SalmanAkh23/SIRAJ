"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, materiList } from "@/data/materi";
import PageHeader from "@/components/page-header";
import EmptyState from "@/components/empty-state";
import {
  Heart,
  BookOpen,
  Users,
  Clock,
  Star,
  BookMarked,
  GraduationCap,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  BookOpen,
  Users,
  Clock,
  Star,
  BookMarked,
};

export default function BelajarPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const materiListFiltered = useMemo(() => {
    if (!activeCategory) return materiList;
    return materiList.filter(
      (m) => m.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      <PageHeader title="Belajar Islam" subtitle="Temukan ilmu yang ingin kamu pelajari." />

      {/* Kategori */}
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] ?? BookOpen;
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(isActive ? null : category.name)}
                className={`card text-left transition-all ${
                  isActive
                    ? "!border-primary/40 bg-primary/[0.03] shadow-[0_4px_20px_rgba(23,74,58,0.08)]"
                    : "hover:border-primary/20"
                }`}
                aria-pressed={isActive}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    isActive ? "bg-primary text-white" : "bg-primary/[0.07]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "" : "text-primary"}
                    strokeWidth={1.8}
                  />
                </div>
                <h2 className="font-semibold text-text text-sm">{category.name}</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Materi Populer */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-text">
            {activeCategory ? `Materi ${activeCategory}` : "Materi Populer"}
          </h2>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              Semua kategori
              <X size={14} />
            </button>
          )}
        </div>

        {materiListFiltered.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title={`Belum ada materi ${activeCategory ?? ""}`}
            description="Materi untuk kategori ini sedang disiapkan. Sementara itu, jelajahi materi lainnya."
          >
            <button onClick={() => setActiveCategory(null)} className="btn-secondary text-sm !py-2">
              Lihat semua materi
            </button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materiListFiltered.map((materi) => (
              <Link
                key={materi.id}
                href={`/belajar/${materi.id}`}
                className="card group flex flex-col hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-primary !py-1 !px-2.5 !text-[11px]">
                    {materi.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    {materi.readTime} menit membaca
                  </span>
                </div>

                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                  {materi.title}
                </h3>
                <p className="text-sm text-muted mt-1.5 leading-relaxed flex-1 line-clamp-2">
                  {materi.description}
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <div className="progress-bar flex-1">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${materi.progress}%` }}
                      role="progressbar"
                      aria-valuenow={materi.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted shrink-0">
                    {materi.progress}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
