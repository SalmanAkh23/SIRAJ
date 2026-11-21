"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const label =
    theme === "dark"
      ? language === "id"
        ? "Ganti ke mode terang"
        : "Switch to light mode"
      : language === "id"
        ? "Ganti ke mode gelap"
        : "Switch to dark mode";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        compact
          ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-primary/[0.06] hover:text-text"
          : "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted transition-colors hover:bg-primary/[0.05] hover:text-text"
      }
      aria-label={label}
      title={label}
    >
      <Icon size={18} strokeWidth={1.8} />
      {!compact && (
        <span>
          {language === "id"
            ? theme === "dark"
              ? "Mode terang"
              : "Mode gelap"
            : theme === "dark"
              ? "Light mode"
              : "Dark mode"}
        </span>
      )}
    </button>
  );
}
