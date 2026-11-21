"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "id" | "en";

const translations = {
  id: {
    common: {
      search: "Cari",
      save: "Simpan",
      cancel: "Batal",
      back: "Kembali",
      close: "Tutup",
      loading: "Memuat...",
      menu: "Menu",
      openProfile: "Buka profil saya",
      settings: "Pengaturan",
      account: "Akun",
      mainMenu: "Menu utama",
      logout: "Keluar",
      myProfile: "Profil Saya",
      accountSettings: "Pengaturan Akun",
    },
    navigation: {
      dashboard: "Dashboard",
      prayerSchedule: "Jadwal Salat",
      quran: "Al-Qur'an",
      murajaah: "Murajaah Hafalan",
      book: "Book",
      saved: "Disimpan",
      profile: "Profil",
      settings: "Pengaturan",
      learning: "Belajar",
      dua: "Doa & Dzikir",
      hadith: "Hadits",
      quiz: "Quiz",
    },
    book: {
      title: "Book",
      description: "Kumpulan ilmu dan materi SIRAJ",
      learning: "Belajar",
      learningDescription: "Pelajari berbagai materi keislaman",
      dua: "Doa & Dzikir",
      duaDescription: "Kumpulan doa dan dzikir",
      hadith: "Hadits",
      hadithDescription: "Pelajari dan baca hadits pilihan",
      quiz: "Quiz",
      quizDescription: "Uji pemahaman dari materi yang telah dipelajari",
    },
    settings: {
      language: "Bahasa",
      theme: "Tema",
      selectLanguage: "Pilih bahasa",
      languageDescription: "Gunakan SIRAJ dalam bahasa pilihan Anda.",
    },
  },
  en: {
    common: {
      search: "Search",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      close: "Close",
      loading: "Loading...",
      menu: "Menu",
      openProfile: "Open my profile",
      settings: "Settings",
      account: "Account",
      mainMenu: "Main menu",
      logout: "Logout",
      myProfile: "My Profile",
      accountSettings: "Account Settings",
    },
    navigation: {
      dashboard: "Dashboard",
      prayerSchedule: "Prayer Schedule",
      quran: "Al-Qur'an",
      murajaah: "Hifz Review",
      book: "Book",
      saved: "Saved",
      profile: "Profile",
      settings: "Settings",
      learning: "Learning",
      dua: "Dua & Dhikr",
      hadith: "Hadith",
      quiz: "Quiz",
    },
    book: {
      title: "Book",
      description: "Islamic knowledge and learning",
      learning: "Learning",
      learningDescription: "Explore Islamic learning materials",
      dua: "Dua & Dhikr",
      duaDescription: "A collection of daily duas and dhikr",
      hadith: "Hadith",
      hadithDescription: "Read and explore selected hadiths",
      quiz: "Quiz",
      quizDescription: "Test your understanding",
    },
    settings: {
      language: "Language",
      theme: "Theme",
      selectLanguage: "Select language",
      languageDescription: "Use SIRAJ in your preferred language.",
    },
  },
} as const;

type TranslationKey = string;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LANGUAGE_STORAGE_KEY = "siraj-language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getTranslation(language: Language, key: string): string {
  const source: unknown = translations[language];
  let value: unknown = source;
  for (const segment of key.split(".")) {
    if (!value || typeof value !== "object" || !(segment in value)) return key;
    value = (value as Record<string, unknown>)[segment];
  }
  return typeof value === "string" ? value : key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "id";
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "id";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    document.documentElement.lang = nextLanguage;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.error("Preferensi bahasa tidak dapat disimpan.", error);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => getTranslation(language, key),
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus digunakan di dalam LanguageProvider.");
  }
  return context;
}
