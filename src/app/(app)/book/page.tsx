"use client";

import Link from "next/link";
import {
  GraduationCap,
  HandHelping,
  BookMarked,
  Trophy,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface BookCard {
  href: string;
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  accent: string;
}

export default function BookPage() {
  const { t } = useLanguage();
  const cards: BookCard[] = [
    {
      href: "/belajar",
      titleKey: "book.learning",
      descriptionKey: "book.learningDescription",
      icon: GraduationCap,
      accent: "bg-[#174A3A]/[0.08] text-[#174A3A]",
    },
    {
      href: "/doa",
      titleKey: "book.dua",
      descriptionKey: "book.duaDescription",
      icon: HandHelping,
      accent: "bg-[#B89246]/10 text-[#8A692F]",
    },
    {
      href: "/hadits",
      titleKey: "book.hadith",
      descriptionKey: "book.hadithDescription",
      icon: BookMarked,
      accent: "bg-[#245C52]/[0.08] text-[#245C52]",
    },
    {
      href: "/quiz",
      titleKey: "book.quiz",
      descriptionKey: "book.quizDescription",
      icon: Trophy,
      accent: "bg-[#D6B878]/15 text-[#7C6438]",
    },
  ];

  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      <div
        className="absolute inset-x-0 top-0 h-72 pattern-star opacity-[0.025] pattern-fade pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
        <header className="mb-7 sm:mb-9">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
            SIRAJ
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
            {t("book.title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted">
            {t("book.description")}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group min-h-36 rounded-2xl border border-border bg-surface p-5 sm:p-6 flex items-center gap-4 transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <span
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.accent}`}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors">
                    {t(card.titleKey)}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {t(card.descriptionKey)}
                  </span>
                </span>
                <ChevronRight
                  size={19}
                  className="text-muted shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
