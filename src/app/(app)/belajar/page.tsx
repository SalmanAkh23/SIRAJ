"use client";

import Link from "next/link";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { categories, materiList } from "@/data/materi";
import EmptyState from "@/components/empty-state";
import {
  BelajarHeroIllustration,
  MateriThumbnail,
  IslamicFooterOrnament,
} from "@/components/belajar-illustrations";
import { useBookmarks } from "@/lib/bookmark-context";
import { useAuth } from "@/lib/auth-context";
import { readUserLearningData, EVENT_LEARNING_UPDATED } from "@/lib/learning-progress";
import {
  Heart,
  BookOpen,
  Users,
  Clock,
  Star,
  BookMarked,
  GraduationCap,
  Search,
  X,
  ChevronRight,
  Sparkles,
  Bookmark,
  CheckCircle2,
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
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const materiSectionRef = useRef<HTMLElement | null>(null);
  const { isBookmarked, toggle } = useBookmarks();

  const userEmail = user?.email ?? null;
  const [learningData, setLearningData] = useState(() => readUserLearningData(userEmail));

  const refreshLearning = useCallback(() => {
    setLearningData(readUserLearningData(userEmail));
  }, [userEmail]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi saat user berganti
    refreshLearning();

    const handleUpdate = () => refreshLearning();
    window.addEventListener(EVENT_LEARNING_UPDATED, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_LEARNING_UPDATED, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [userEmail, refreshLearning]);

  const materiListFiltered = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return materiList.filter((m) => {
      const matchesCategory =
        !activeCategory || m.category.toLowerCase() === activeCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!normalizedSearch) return true;

      return (
        m.title.toLowerCase().includes(normalizedSearch) ||
        m.description.toLowerCase().includes(normalizedSearch) ||
        m.category.toLowerCase().includes(normalizedSearch) ||
        m.content.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeCategory, searchQuery]);

  const handleViewAllMateri = () => {
    setActiveCategory(null);
    setSearchQuery("");
    materiSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasActiveFilter = Boolean(activeCategory || searchQuery.trim());

  return (
    <div className="relative min-h-screen bg-[#F8F7F2] text-[#263A35] overflow-x-hidden">
      {/* Ornamen Geometri Islami Halus di Background Atas */}
      <div
        className="absolute inset-x-0 top-0 h-[420px] pattern-star opacity-[0.035] pattern-fade pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* ================================================================
            1. HERO SECTION — MODERN ISLAMIC LEARNING DASHBOARD
        ================================================================ */}
        <section
          aria-label="Pengantar Belajar Islam"
          className="relative overflow-hidden rounded-3xl border border-[#D6B878]/40 bg-gradient-to-br from-[#FBF9F3] via-[#F5EFE2] to-[#E6EFEA] shadow-[0_10px_36px_-10px_rgba(23,74,58,0.08)] mb-10"
        >
          {/* Aksen Garis Emas Tipis di Bagian Atas */}
          <div
            className="h-1 w-full bg-gradient-to-r from-[#174A3A] via-[#D6B878] to-[#245C52]"
            aria-hidden="true"
          />

          {/* Pola Geometri Islami di Pinggir Hero dengan Opacity Rendah */}
          <div
            className="absolute inset-0 pattern-star opacity-[0.045] pointer-events-none"
            aria-hidden="true"
          />

          {/* Ornamen Mandala / Rosette Geometri Sudut Kiri Atas */}
          <div
            className="absolute -top-20 -left-20 w-64 h-64 opacity-[0.12] pointer-events-none"
            aria-hidden="true"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" stroke="#174A3A" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="72" stroke="#D6B878" strokeWidth="1.5" />
              <rect x="46" y="46" width="108" height="108" stroke="#174A3A" strokeWidth="1.2" />
              <rect
                x="46"
                y="46"
                width="108"
                height="108"
                transform="rotate(45 100 100)"
                stroke="#174A3A"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-6 sm:p-8 lg:p-10">
            {/* Kolom Kiri: Teks & Pencarian */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Label Kecil: Ilmu adalah Cahaya */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174A3A]/[0.08] border border-[#D6B878]/50 text-[#174A3A] text-xs font-semibold tracking-wide mb-4 shadow-2xs">
                <Sparkles size={13} className="text-[#B89246]" />
                <span>Ilmu adalah Cahaya</span>
              </div>

              {/* Judul Besar */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#263A35] tracking-tight leading-tight">
                Belajar Islam
              </h1>

              {/* Deskripsi Singkat */}
              <p className="text-sm sm:text-base text-[#718078] mt-3 leading-relaxed max-w-xl">
                Tingkatkan pemahamanmu tentang ajaran Islam melalui materi yang mudah dipahami
                dan sesuai dengan Al-Qur&apos;an dan Sunnah.
              </p>

              {/* Kolom Pencarian */}
              <div className="w-full max-w-xl mt-6">
                <label htmlFor="belajar-search" className="sr-only">
                  Cari materi pelajaran
                </label>
                <div className="relative flex items-center">
                  <Search
                    size={18}
                    className="absolute left-4 text-[#718078] pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="belajar-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari materi pelajaran..."
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-[#D6B878]/45 text-sm sm:text-[15px] text-[#263A35] placeholder:text-[#718078] shadow-[0_4px_16px_rgba(23,74,58,0.05)] focus:outline-none focus:border-[#174A3A] focus:ring-3 focus:ring-[#174A3A]/10 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 p-1 rounded-full text-[#718078] hover:text-[#263A35] hover:bg-[#F8F7F2] transition-colors"
                      aria-label="Hapus kata kunci pencarian"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Kutipan QS. Al-Anbiya: 107 */}
              <div className="w-full max-w-xl mt-6 pt-5 border-t border-[#D6B878]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs sm:text-[13px] italic text-[#263A35]/90 leading-relaxed">
                    &ldquo;Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi)
                    rahmat bagi seluruh alam.&rdquo;
                  </p>
                  <p className="text-[11px] font-semibold text-[#174A3A] tracking-wide uppercase">
                    — QS. Al-Anbiya: 107
                  </p>
                </div>
                <p
                  className="arabic-text text-lg sm:text-xl text-[#174A3A] shrink-0 select-text"
                  lang="ar"
                  dir="rtl"
                >
                  وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Ilustrasi Masjid & Mihrab Suasana Pagi */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-[380px] lg:max-w-none">
                <BelajarHeroIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. KATEGORI MATERI (6 KATEGORI UTAMA)
        ================================================================ */}
        <section className="mb-11" aria-labelledby="heading-kategori-materi">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#174A3A] to-[#D6B878]"
                aria-hidden="true"
              />
              <h2
                id="heading-kategori-materi"
                className="text-lg sm:text-xl font-bold text-[#263A35] tracking-tight"
              >
                Kategori Materi
              </h2>
            </div>

            <button
              type="button"
              onClick={handleViewAllMateri}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#174A3A] hover:text-[#245C52] transition-colors cursor-pointer group"
            >
              <span>Lihat Semua</span>
              <ChevronRight
                size={15}
                className="text-[#D6B878] group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] ?? BookOpen;
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(isActive ? null : category.name)}
                  aria-pressed={isActive}
                  className={`group relative text-left rounded-2xl p-4 sm:p-4.5 transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                    isActive
                      ? "bg-gradient-to-b from-[#174A3A] to-[#245C52] text-white border-[#174A3A] shadow-[0_10px_24px_-6px_rgba(23,74,58,0.28)] -translate-y-0.5"
                      : "bg-white text-[#263A35] border-[#E6E3D8] hover:border-[#D6B878] shadow-[0_2px_12px_rgba(23,74,58,0.04)] hover:shadow-[0_8px_22px_-6px_rgba(23,74,58,0.1)] hover:-translate-y-0.5"
                  }`}
                >
                  {/* Garis Aksen Emas Halus di Atas Kartu */}
                  <span
                    className={`absolute inset-x-4 top-0 h-[2px] rounded-full transition-opacity ${
                      isActive
                        ? "bg-[#D6B878] opacity-100"
                        : "bg-gradient-to-r from-transparent via-[#D6B878]/70 to-transparent opacity-0 group-hover:opacity-100"
                    }`}
                    aria-hidden="true"
                  />

                  <div>
                    {/* Baris Atas: Ikon & Panah Kecil */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors border ${
                          isActive
                            ? "bg-white/15 text-[#D6B878] border-white/20"
                            : "bg-[#F3EFE4] group-hover:bg-[#174A3A]/[0.09] text-[#174A3A] border-[#D6B878]/30"
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.9} />
                      </div>

                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-white/15 text-[#D6B878]"
                            : "bg-[#F8F7F2] text-[#718078] group-hover:bg-[#174A3A]/10 group-hover:text-[#174A3A] group-hover:translate-x-0.5"
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronRight size={14} />
                      </span>
                    </div>

                    {/* Nama Kategori */}
                    <h3
                      className={`font-bold text-sm sm:text-[15px] tracking-tight ${
                        isActive ? "text-white" : "text-[#263A35] group-hover:text-[#174A3A]"
                      }`}
                    >
                      {category.name}
                    </h3>

                    {/* Deskripsi Singkat Utuh */}
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        isActive ? "text-white/85" : "text-[#718078]"
                      }`}
                    >
                      {category.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            3. MATERI POPULER (KARTU PEMBELAJARAN VISUAL 2 KOLOM)
        ================================================================ */}
        <section ref={materiSectionRef} id="daftar-materi" aria-labelledby="heading-materi-populer">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#174A3A] to-[#D6B878]"
                aria-hidden="true"
              />
              <div>
                <h2
                  id="heading-materi-populer"
                  className="text-lg sm:text-xl font-bold text-[#263A35] tracking-tight"
                >
                  {activeCategory ? `Materi ${activeCategory}` : "Materi Populer"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilter ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#174A3A]/[0.08] hover:bg-[#174A3A]/[0.14] text-xs sm:text-sm font-semibold text-[#174A3A] transition-colors cursor-pointer"
                >
                  <span>Tampilkan Semua Materi</span>
                  <X size={14} />
                </button>
              ) : (
                <span className="text-xs sm:text-sm font-medium text-[#718078]">
                  Menampilkan {materiListFiltered.length} materi pilihan
                </span>
              )}
            </div>
          </div>

          {materiListFiltered.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title={
                searchQuery.trim()
                  ? `Materi "${searchQuery}" tidak ditemukan`
                  : `Belum ada materi ${activeCategory ?? ""}`
              }
              description={
                searchQuery.trim()
                  ? "Coba gunakan kata kunci lain atau pilih salah satu kategori materi di atas."
                  : "Materi untuk kategori ini sedang disiapkan. Sementara itu, jelajahi materi lainnya."
              }
            >
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setSearchQuery("");
                }}
                className="btn-secondary text-sm !py-2"
              >
                Lihat semua materi
              </button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {materiListFiltered.map((materi) => {
                const bookmarkId = `materi-${materi.id}`;
                const saved = isBookmarked(bookmarkId);
                const isCompleted = learningData.completedMateriIds.includes(materi.id);
                const displayProgress = isCompleted ? 100 : (learningData.materiProgress[materi.id] ?? 0);

                return (
                  <Link
                    key={materi.id}
                    href={`/belajar/${materi.id}`}
                    className="group relative bg-white rounded-2xl border border-[#E6E3D8] hover:border-[#D6B878] p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch gap-4 shadow-[0_2px_14px_rgba(23,74,58,0.04)] hover:shadow-[0_12px_28px_-8px_rgba(23,74,58,0.12)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Thumbnail Ilustrasi Relevan */}
                    <div className="relative w-full sm:w-40 lg:w-44 h-44 sm:h-auto shrink-0 rounded-xl overflow-hidden border border-[#D6B878]/35 shadow-2xs">
                      <MateriThumbnail
                        materiId={materi.id}
                        category={materi.category}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Tombol Bookmark Cepat di Sudut Thumbnail */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggle({
                            id: bookmarkId,
                            type: "materi",
                            title: materi.title,
                            description: materi.description,
                            href: `/belajar/${materi.id}`,
                          });
                        }}
                        aria-pressed={saved}
                        aria-label={
                          saved
                            ? `Hapus ${materi.title} dari tersimpan`
                            : `Simpan materi ${materi.title}`
                        }
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border ${
                          saved
                            ? "bg-[#174A3A] text-[#D6B878] border-[#D6B878]/60 shadow-sm"
                            : "bg-white/85 hover:bg-white text-[#263A35] border-white/60 shadow-2xs"
                        }`}
                      >
                        <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Konten Kartu Pembelajaran */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {/* Baris Meta: Badge Kategori, Waktu Baca & Status Selesai */}
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#174A3A]/[0.09] text-[#174A3A] border border-[#174A3A]/15">
                            {materi.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-[#718078]">
                            <Clock size={12} className="text-[#B89246]" />
                            {materi.readTime} menit membaca
                          </span>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#174A3A] text-white">
                              <CheckCircle2 size={11} className="text-[#D6B878]" /> Selesai
                            </span>
                          )}
                        </div>

                        {/* Judul Materi */}
                        <h3 className="font-bold text-base sm:text-[17px] text-[#263A35] group-hover:text-[#174A3A] transition-colors leading-snug">
                          {materi.title}
                        </h3>

                        {/* Deskripsi Singkat */}
                        <p className="text-xs sm:text-sm text-[#718078] mt-1.5 leading-relaxed line-clamp-2">
                          {materi.description}
                        </p>
                      </div>

                      {/* Bagian Bawah: Progress Bar, Persentase & Tombol Panah */}
                      <div className="mt-4 pt-3 border-t border-[#F0EDE4] flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-2.5">
                          <div className="flex-1 h-2 bg-[#ECE9DF] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#174A3A] via-[#245C52] to-[#D6B878] transition-all duration-500"
                              style={{ width: `${displayProgress}%` }}
                              role="progressbar"
                              aria-valuenow={displayProgress}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Progres belajar ${materi.title}`}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#263A35] shrink-0 min-w-[32px] text-right">
                            {displayProgress}%
                          </span>
                        </div>

                        <span
                          className="w-8 h-8 rounded-xl bg-[#F5F2E9] group-hover:bg-[#174A3A] text-[#174A3A] group-hover:text-white border border-[#D6B878]/35 group-hover:border-[#174A3A] flex items-center justify-center shrink-0 transition-all"
                          aria-hidden="true"
                        >
                          <ChevronRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Ornamen Siluet Kubah & Garis Emas Halus di Bagian Bawah */}
        <IslamicFooterOrnament className="mt-12 opacity-80" />
      </div>
    </div>
  );
}
