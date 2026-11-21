/**
 * Penyimpanan dan Sinkronisasi Data Riwayat serta Statistik Murajaah Hafalan Pengguna.
 */

import type {
  MurajaahSessionRecord,
  MurajaahSettings,
  MurajaahStats,
} from "./murajaah-types";

const HISTORY_KEY = "siraj-murajaah-history-v1";
const STATS_KEY = "siraj-murajaah-stats-v1";
const SETTINGS_KEY = "siraj-murajaah-settings-v1";

export const DEFAULT_MURAJAAH_SETTINGS: MurajaahSettings = {
  preferredMode: "hafalan",
  dailyTarget: 10,
  autoPlayCorrectAudio: false,
  showTranslation: true,
  sensitivityLevel: "standard",
};

export const DEFAULT_MURAJAAH_STATS: MurajaahStats = {
  totalSessions: 0,
  totalVersesTested: 0,
  averageScore: 0,
  streakDays: 0,
  lastActiveDate: "",
  dailyTarget: 10,
  todayVersesTested: 0,
};

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readMurajaahSettings(): MurajaahSettings {
  if (typeof window === "undefined") return DEFAULT_MURAJAAH_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_MURAJAAH_SETTINGS;
    return { ...DEFAULT_MURAJAAH_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_MURAJAAH_SETTINGS;
  }
}

export function saveMurajaahSettings(settings: Partial<MurajaahSettings>): MurajaahSettings {
  const current = readMurajaahSettings();
  const next = { ...current, ...settings };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    // abaikan storage error
  }
  return next;
}

export function readMurajaahHistory(): MurajaahSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveMurajaahSession(
  session: MurajaahSessionRecord
): MurajaahSessionRecord[] {
  const current = readMurajaahHistory();
  // Simpan maksimal 100 sesi terbaru
  const next = [session, ...current.filter((s) => s.id !== session.id)].slice(0, 100);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    updateStatsOnNewSession(session, next);
  } catch {
    // abaikan storage error
  }

  return next;
}

export function readMurajaahStats(): MurajaahStats {
  if (typeof window === "undefined") return DEFAULT_MURAJAAH_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const today = getTodayDateString();
    let stats: MurajaahStats = DEFAULT_MURAJAAH_STATS;

    if (raw) {
      stats = { ...DEFAULT_MURAJAAH_STATS, ...JSON.parse(raw) };
    }

    // Reset hitungan harian jika berganti hari
    if (stats.lastActiveDate !== today) {
      stats = {
        ...stats,
        todayVersesTested: 0,
      };
    }

    return stats;
  } catch {
    return DEFAULT_MURAJAAH_STATS;
  }
}

function updateStatsOnNewSession(
  session: MurajaahSessionRecord,
  allSessions: MurajaahSessionRecord[]
) {
  const today = getTodayDateString();
  const prevStats = readMurajaahStats();

  const totalVerses = allSessions.reduce((acc, s) => acc + s.totalVersesTested, 0);
  const totalScore = allSessions.reduce((acc, s) => acc + s.averageScore, 0);
  const avgScore = allSessions.length > 0 ? Math.round(totalScore / allSessions.length) : 0;

  // Hitung streak
  let newStreak = prevStats.streakDays;
  if (!prevStats.lastActiveDate) {
    newStreak = 1;
  } else if (prevStats.lastActiveDate === today) {
    // Hari yang sama, streak tetap
  } else {
    const lastDate = new Date(prevStats.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = prevStats.streakDays + 1;
    } else {
      newStreak = 1;
    }
  }

  const todayCount =
    (prevStats.lastActiveDate === today ? prevStats.todayVersesTested : 0) +
    session.totalVersesTested;

  const nextStats: MurajaahStats = {
    totalSessions: allSessions.length,
    totalVersesTested: totalVerses,
    averageScore: avgScore,
    streakDays: newStreak,
    lastActiveDate: today,
    dailyTarget: prevStats.dailyTarget || 10,
    todayVersesTested: todayCount,
  };

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(nextStats));
  } catch {
    // abaikan
  }
}

