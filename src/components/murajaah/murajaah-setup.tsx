"use client";

import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Layers,
  Play,
} from "lucide-react";
import type { ChapterMeta, JuzMeta } from "@/lib/quran-api";
import type {
  MurajaahMode,
  MurajaahRangeSelection,
} from "@/lib/murajaah-types";

interface MurajaahSetupProps {
  chapters: ChapterMeta[];
  juzs: JuzMeta[];
  defaultMode?: MurajaahMode;
  onStartSession: (config: {
    range: MurajaahRangeSelection;
    mode: MurajaahMode;
    showTranslation: boolean;
  }) => void;
}

export default function MurajaahSetup({
  chapters,
  juzs,
  defaultMode = "bantuan",
  onStartSession,
}: MurajaahSetupProps) {
  const [tab, setTab] = useState<"surah" | "juz">("surah");
  const [searchQuery, setSearchQuery] = useState("");

  // Pilihan Surah & Rentang Ayat
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1); // Default: Al-Fatihah
  const [startVerse, setStartVerse] = useState<number>(1);
  const [endVerse, setEndVerse] = useState<number>(7);

  // Pilihan Juz
  const [selectedJuzNumber, setSelectedJuzNumber] = useState<number>(30); // Default: Juz 'Amma

  // Mode Murajaah & Terjemahan
  const [mode] = useState<MurajaahMode>(defaultMode);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

  // Selected Chapter Metadata
  const currentChapter = useMemo(() => {
    return chapters.find((c) => c.id === selectedSurahId) ?? chapters[0];
  }, [chapters, selectedSurahId]);

  const maxVerses = currentChapter?.verses_count ?? 7;

  // Filter Surah
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase().trim();
    return chapters.filter(
      (c) =>
        c.name_simple.toLowerCase().includes(q) ||
        c.translated_name.name.toLowerCase().includes(q) ||
        String(c.id).includes(q) ||
        c.name_arabic.includes(q)
    );
  }, [chapters, searchQuery]);

  // Handler ganti surah (otomatis memilih seluruh ayat surat tersebut)
  const handleSelectSurah = (surahId: number) => {
    setSelectedSurahId(surahId);
    const ch = chapters.find((c) => c.id === surahId);
    const count = ch?.verses_count ?? 7;
    setStartVerse(1);
    setEndVerse(count);
  };

  // Preset Cepat Rentang Ayat
  const handleSetPreset = (preset: "all" | "first10" | "last10") => {
    if (preset === "all") {
      setStartVerse(1);
      setEndVerse(maxVerses);
    } else if (preset === "first10") {
      setStartVerse(1);
      setEndVerse(Math.min(maxVerses, 10));
    } else if (preset === "last10") {
      setStartVerse(Math.max(1, maxVerses - 9));
      setEndVerse(maxVerses);
    }
  };

  // Validasi & Mulai Sesi
  const handleStart = () => {
    if (tab === "surah") {
      const validStart = Math.max(1, Math.min(startVerse, maxVerses));
      const validEnd = Math.max(validStart, Math.min(endVerse, maxVerses));
      const count = validEnd - validStart + 1;

      onStartSession({
        range: {
          type: "surah",
          surahNumber: currentChapter.id,
          surahName: currentChapter.name_simple,
          surahArabic: currentChapter.name_arabic,
          startVerse: validStart,
          endVerse: validEnd,
          totalVersesInRange: count,
        },
        mode,
        showTranslation,
      });
    } else {
      const currentJuz = juzs.find((j) => j.juzNumber === selectedJuzNumber) ?? juzs[0];
      onStartSession({
        range: {
          type: "juz",
          surahNumber: currentJuz.startSurahNumber,
          surahName: `Juz ${currentJuz.juzNumber} (${currentJuz.nameLatin})`,
          surahArabic: currentJuz.nameArabic,
          juzNumber: currentJuz.juzNumber,
          startVerse: currentJuz.startVerse,
          endVerse: currentJuz.endVerse,
          totalVersesInRange: currentJuz.versesCount,
        },
        mode,
        showTranslation,
      });
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 sm:p-7 mb-10">
      {/* Header Pengaturan */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text tracking-tight">
              Pilih Surat untuk Murajaah
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Pilih surat yang ingin dibaca. Seluruh ayat dari surat yang dipilih akan ditampilkan secara berurutan.
            </p>
          </div>

          {/* Segmented Tab: Surah vs Juz */}
          <div className="inline-flex p-1 bg-background border border-border rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTab("surah")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                tab === "surah"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              <BookOpen size={14} />
              <span>Surat (114)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("juz")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                tab === "juz"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              <Layers size={14} />
              <span>Juz (30)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pemilihan Surah atau Juz */}
        {tab === "surah" ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="text-xs sm:text-sm font-semibold text-text">
                Surat Terpilih:{" "}
                <span className="text-primary font-bold">
                  {currentChapter?.name_simple} ({maxVerses} Ayat)
                </span>
              </div>

              {/* Kolom Cari Surah */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  placeholder="Cari nama atau nomor surat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Grid Daftar Surah */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-1.5 border border-border rounded-xl bg-background/50">
              {filteredChapters.map((ch) => {
                const isSelected = ch.id === selectedSurahId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectSurah(ch.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-surface hover:bg-primary/[0.04] border-border text-text"
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-border text-muted"
                          }`}
                        >
                          {ch.id}
                        </span>
                        <span className="text-xs font-bold truncate">
                          {ch.name_simple}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] block mt-0.5 truncate ${
                          isSelected ? "text-white/80" : "text-muted"
                        }`}
                      >
                        {ch.verses_count} ayat
                      </span>
                    </div>
                    <span
                      className={`font-arabic text-sm shrink-0 ${
                        isSelected ? "text-secondary" : "text-primary"
                      }`}
                    >
                      {ch.name_arabic}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pengaturan Rentang Ayat (Default: Seluruh Ayat Surat) */}
            <div className="mt-4 p-3.5 rounded-xl bg-background border border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold text-text">
                  Rentang Ayat:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1">
                    <span className="text-xs text-muted">Dari</span>
                    <input
                      type="number"
                      min={1}
                      max={maxVerses}
                      value={startVerse}
                      onChange={(e) =>
                        setStartVerse(
                          Math.max(1, Math.min(Number(e.target.value) || 1, maxVerses))
                        )
                      }
                      className="w-12 text-center text-xs sm:text-sm font-bold text-primary focus:outline-none"
                    />
                  </div>
                  <span className="text-muted">–</span>
                  <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1">
                    <span className="text-xs text-muted">Sampai</span>
                    <input
                      type="number"
                      min={startVerse}
                      max={maxVerses}
                      value={endVerse}
                      onChange={(e) =>
                        setEndVerse(
                          Math.max(
                            startVerse,
                            Math.min(Number(e.target.value) || startVerse, maxVerses)
                          )
                        )
                      }
                      className="w-12 text-center text-xs sm:text-sm font-bold text-primary focus:outline-none"
                    />
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    ({Math.max(0, endVerse - startVerse + 1)} Ayat)
                  </span>
                </div>
              </div>

              {/* Pintasan Rentang */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleSetPreset("all")}
                  className="px-2.5 py-1 bg-surface hover:bg-primary/10 border border-border rounded-lg font-medium text-primary transition-colors cursor-pointer"
                >
                  Seluruh Ayat ({maxVerses})
                </button>
                {maxVerses > 10 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSetPreset("first10")}
                      className="px-2.5 py-1 bg-surface hover:bg-primary/10 border border-border rounded-lg font-medium text-primary transition-colors cursor-pointer"
                    >
                      10 Awal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPreset("last10")}
                      className="px-2.5 py-1 bg-surface hover:bg-primary/10 border border-border rounded-lg font-medium text-primary transition-colors cursor-pointer"
                    >
                      10 Akhir
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text mb-2.5">
              Pilih Juz Al-Qur&apos;an (Juz 1 s/d 30)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-1.5 border border-border rounded-xl bg-background/50">
              {juzs.map((j) => {
                const isSelected = j.juzNumber === selectedJuzNumber;
                return (
                  <button
                    key={j.juzNumber}
                    type="button"
                    onClick={() => setSelectedJuzNumber(j.juzNumber)}
                    className={`flex flex-col justify-between p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-surface hover:bg-primary/[0.04] border-border text-text"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Juz {j.juzNumber}</span>
                        <span
                          className={`font-arabic text-sm ${
                            isSelected ? "text-secondary" : "text-primary"
                          }`}
                        >
                          {j.nameArabic}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] block mt-1 truncate ${
                          isSelected ? "text-white/80" : "text-muted"
                        }`}
                      >
                        {j.nameLatin}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] mt-2 block pt-1 border-t ${
                        isSelected
                          ? "border-white/20 text-white/70"
                          : "border-border text-muted"
                      }`}
                    >
                      {j.versesCount} ayat
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Opsi Terjemahan & Tombol Mulai */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border">
          <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-text cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-border focus:ring-primary/30 cursor-pointer"
            />
            <span>Tampilkan terjemahan Bahasa Indonesia pada sesi murajaah</span>
          </label>

          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            <Play size={16} className="fill-white" />
            <span>Mulai Sesi Murajaah</span>
          </button>
        </div>
      </div>
    </div>
  );
}
