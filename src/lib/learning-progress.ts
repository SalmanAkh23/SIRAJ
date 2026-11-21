/**
 * Sistem Pengelolaan Progres Belajar, Aktivitas & Statistik Pengguna SIRAJ
 * 
 * Modul ini menjadi single source of truth untuk:
 * - Progres materi belajar per user
 * - Riwayat materi yang diselesaikan dan terakhir dibuka
 * - Penghitungan konsistensi belajar (streak) nyata multi-fitur
 * - Penghitungan progres pemahaman per kategori materi
 * - Status checklist tantangan harian dinamis
 */

import { materiList, categories } from "@/data/materi";
import { readLastRead, readJuzProgressMap } from "./quran-api";

export interface UserLearningData {
  completedMateriIds: string[];
  materiProgress: Record<string, number>;
  materiLastOpened: Record<string, string>;
  recentMateriIds: string[];
  activityDates: string[];
}

export interface CategoryProgressItem {
  category: string;
  percentage: number;
  completedCount: number;
  totalCount: number;
}

export interface DailyTaskItem {
  id: string;
  label: string;
  completed: boolean;
  autoCompleted?: boolean;
}

export const EVENT_LEARNING_UPDATED = "siraj-learning-updated";
const HADITS_LAST_READ_KEY = "siraj-hadits-last-read-date";
const DOA_LAST_READ_KEY = "siraj-doa-last-read-date";

function normalizeEmail(email?: string | null): string {
  return (email ?? "").trim().toLowerCase();
}

function getStorageKey(userEmail?: string | null): string {
  const norm = normalizeEmail(userEmail);
  return norm ? `siraj-learning-data-${norm}` : "siraj-learning-data-guest";
}

function getTasksStorageKey(userEmail?: string | null, dateString?: string): string {
  const norm = normalizeEmail(userEmail);
  const date = dateString || getTodayDateString();
  return `siraj-daily-tasks-${norm || "guest"}-${date}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Dispatch event global agar seluruh komponen (Dashboard, Belajar, Profil)
 * memperbarui tampilannya secara realtime tanpa perlu refresh halaman.
 */
export function dispatchLearningUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_LEARNING_UPDATED));
  }
}

/**
 * Membaca data progres belajar pengguna dari localStorage.
 */
export function readUserLearningData(userEmail?: string | null): UserLearningData {
  const defaultData: UserLearningData = {
    completedMateriIds: [],
    materiProgress: {},
    materiLastOpened: {},
    recentMateriIds: [],
    activityDates: [],
  };

  if (typeof window === "undefined") return defaultData;

  try {
    const key = getStorageKey(userEmail);
    const raw = localStorage.getItem(key);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return {
      completedMateriIds: Array.isArray(parsed.completedMateriIds) ? parsed.completedMateriIds : [],
      materiProgress: parsed.materiProgress && typeof parsed.materiProgress === "object" ? parsed.materiProgress : {},
      materiLastOpened: parsed.materiLastOpened && typeof parsed.materiLastOpened === "object" ? parsed.materiLastOpened : {},
      recentMateriIds: Array.isArray(parsed.recentMateriIds) ? parsed.recentMateriIds : [],
      activityDates: Array.isArray(parsed.activityDates) ? parsed.activityDates : [],
    };
  } catch {
    return defaultData;
  }
}

/**
 * Menyimpan data progres belajar pengguna ke localStorage.
 */
export function writeUserLearningData(userEmail: string | null | undefined, data: UserLearningData): void {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(data));
    dispatchLearningUpdated();
  } catch {
    // Abaikan kegagalan localStorage
  }
}

/**
 * Mencatat aktivitas membaca hadits hari ini untuk checklist harian & streak.
 */
export function recordHaditsRead(userEmail?: string | null): void {
  const today = getTodayDateString();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(HADITS_LAST_READ_KEY, today);
    } catch {
      // Abaikan
    }
  }
  recordUserActivity(userEmail, today);
}

/**
 * Mencatat aktivitas membaca doa hari ini untuk checklist harian & streak.
 */
export function recordDoaRead(userEmail?: string | null): void {
  const today = getTodayDateString();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DOA_LAST_READ_KEY, today);
    } catch {
      // Abaikan
    }
  }
  recordUserActivity(userEmail, today);
}

/**
 * Mencatat aktivitas belajar pengguna pada hari ini ke daftar activityDates.
 */
export function recordUserActivity(userEmail: string | null | undefined, dateStr?: string): void {
  const date = dateStr || getTodayDateString();
  const current = readUserLearningData(userEmail);

  if (!current.activityDates.includes(date)) {
    current.activityDates.push(date);
    writeUserLearningData(userEmail, current);
  }
}

/**
 * Mencatat saat pengguna membuka materi (merekam recentMateri dan progress minimal jika baru).
 */
export function recordMateriOpened(userEmail: string | null | undefined, materiId: string): void {
  const current = readUserLearningData(userEmail);
  const now = new Date().toISOString();
  const today = getTodayDateString();

  // Update last opened timestamp
  current.materiLastOpened[materiId] = now;

  // Update recent list (geser ke urutan terdepan)
  current.recentMateriIds = [
    materiId,
    ...current.recentMateriIds.filter((id) => id !== materiId),
  ].slice(0, 5);

  // Jika belum ada progres, set progres awal membaca 25%
  if (current.materiProgress[materiId] === undefined) {
    current.materiProgress[materiId] = 25;
  }

  // Rekam aktivitas harian
  if (!current.activityDates.includes(today)) {
    current.activityDates.push(today);
  }

  writeUserLearningData(userEmail, current);
}

/**
 * Memperbarui persentase progres suatu materi (0 - 100).
 * Jika persentase mencapai 100, materi otomatis ditandai selesai.
 */
export function updateMateriProgress(
  userEmail: string | null | undefined,
  materiId: string,
  percentage: number
): void {
  const current = readUserLearningData(userEmail);
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const now = new Date().toISOString();
  const today = getTodayDateString();

  current.materiProgress[materiId] = clamped;
  current.materiLastOpened[materiId] = now;

  if (clamped >= 100) {
    if (!current.completedMateriIds.includes(materiId)) {
      current.completedMateriIds.push(materiId);
    }
  } else {
    current.completedMateriIds = current.completedMateriIds.filter((id) => id !== materiId);
  }

  if (!current.recentMateriIds.includes(materiId)) {
    current.recentMateriIds.unshift(materiId);
  }

  if (!current.activityDates.includes(today)) {
    current.activityDates.push(today);
  }

  writeUserLearningData(userEmail, current);
}

/**
 * Menandai materi selesai atau membatalkan status selesai (toggle).
 */
export function toggleMateriCompleted(
  userEmail: string | null | undefined,
  materiId: string
): boolean {
  const current = readUserLearningData(userEmail);
  const isCompleted = current.completedMateriIds.includes(materiId);
  const today = getTodayDateString();
  const now = new Date().toISOString();

  if (isCompleted) {
    current.completedMateriIds = current.completedMateriIds.filter((id) => id !== materiId);
    current.materiProgress[materiId] = Math.min(current.materiProgress[materiId] || 75, 75);
  } else {
    current.completedMateriIds.push(materiId);
    current.materiProgress[materiId] = 100;
  }

  current.materiLastOpened[materiId] = now;

  if (!current.recentMateriIds.includes(materiId)) {
    current.recentMateriIds.unshift(materiId);
  }

  if (!current.activityDates.includes(today)) {
    current.activityDates.push(today);
  }

  writeUserLearningData(userEmail, current);
  return !isCompleted;
}

/**
 * Menghitung streak konsistensi belajar berturut-turut (dalam hari)
 * berdasarkan tanggal aktivitas riil lintas fitur SIRAJ:
 * - Al-Qur'an (last read & progres juz)
 * - Murajaah AI (riwayat hafalan)
 * - Kuis Islami (riwayat ujian)
 * - Belajar Islam (materi dibuka & diselesaikan)
 * - Bookmark (penyimpanan konten)
 */
export function calculateRealStreak(userEmail?: string | null): number {
  if (typeof window === "undefined") return 0;

  const dateSet = new Set<string>();

  // 1. Aktivitas Materi Belajar
  const learningData = readUserLearningData(userEmail);
  for (const d of learningData.activityDates) {
    if (d && d.length === 10) dateSet.add(d);
  }
  for (const ts of Object.values(learningData.materiLastOpened)) {
    if (ts) dateSet.add(ts.slice(0, 10));
  }

  // 2. Aktivitas Al-Qur'an (Last Read & Juz Progress)
  try {
    const lastRead = readLastRead();
    if (lastRead?.updatedAt) {
      dateSet.add(lastRead.updatedAt.slice(0, 10));
    }
    const juzMap = readJuzProgressMap();
    for (const item of Object.values(juzMap)) {
      if (item.updatedAt) {
        dateSet.add(item.updatedAt.slice(0, 10));
      }
    }
  } catch {
    // Abaikan
  }

  // 3. Aktivitas Murajaah AI
  try {
    const rawMurajaah = localStorage.getItem("siraj-murajaah-history-v1");
    if (rawMurajaah) {
      const parsed = JSON.parse(rawMurajaah);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.completedAt) dateSet.add(String(item.completedAt).slice(0, 10));
        }
      }
    }
  } catch {
    // Abaikan
  }

  // 4. Aktivitas Kuis Islami
  try {
    const rawExamHist = localStorage.getItem("siraj-exam-history-v1");
    if (rawExamHist) {
      const parsed = JSON.parse(rawExamHist);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.submittedAt) dateSet.add(String(item.submittedAt).slice(0, 10));
        }
      }
    }
  } catch {
    // Abaikan
  }

  // 5. Aktivitas Bookmarks
  try {
    const norm = normalizeEmail(userEmail);
    const rawBm = localStorage.getItem(norm ? `siraj-bookmarks-${norm}` : "siraj-bookmarks");
    if (rawBm) {
      const parsed = JSON.parse(rawBm);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.savedAt) dateSet.add(String(item.savedAt).slice(0, 10));
        }
      }
    }
  } catch {
    // Abaikan
  }

  if (dateSet.size === 0) return 0;

  // Urutkan tanggal secara descending
  const dates = Array.from(dateSet).sort().reverse();
  const today = getTodayDateString();

  // Hitung tanggal kemarin
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  // Jika hari ini atau kemarin tidak ada aktivitas, maka streak terputus (0)
  const latestDate = dates[0];
  if (latestDate !== today && latestDate !== yesterday) {
    return 0;
  }

  // Hitung jumlah hari berturut-turut ke belakang
  let streak = 0;
  const cursor = new Date(latestDate === today ? today : yesterday);

  while (true) {
    const cursorStr = cursor.toISOString().slice(0, 10);
    if (dateSet.has(cursorStr)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Menghitung progres pemahaman per kategori materi (Fiqih, Aqidah, Akhlak, Sirah, dll).
 * Menghitung persentase dari: (materi selesai dalam kategori / total materi dalam kategori) * 100.
 */
export function calculateCategoryProgress(userEmail?: string | null): CategoryProgressItem[] {
  const learningData = readUserLearningData(userEmail);
  const completedSet = new Set(learningData.completedMateriIds);

  return categories.map((cat) => {
    const inCategory = materiList.filter(
      (m) => m.category.toLowerCase() === cat.name.toLowerCase()
    );
    const totalCount = inCategory.length;
    if (totalCount === 0) {
      return {
        category: cat.name,
        percentage: 0,
        completedCount: 0,
        totalCount: 0,
      };
    }

    const completedCount = inCategory.filter((m) => completedSet.has(m.id)).length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    return {
      category: cat.name,
      percentage,
      completedCount,
      totalCount,
    };
  });
}

/**
 * Menghitung rata-rata progres belajar pengguna.
 * Jika pengguna telah mempelajari materi, hitung rata-rata progres dari materi yang aktif dibuka.
 * Jika belum ada satupun materi yang dipelajari, kembalikan 0.
 */
export function calculateAverageProgress(userEmail?: string | null): number {
  const learningData = readUserLearningData(userEmail);
  const progressEntries = Object.entries(learningData.materiProgress);

  if (progressEntries.length === 0) return 0;

  const sum = progressEntries.reduce((acc, [, val]) => acc + val, 0);
  return Math.round(sum / progressEntries.length);
}

/**
 * Mendapatkan daftar materi terakhir yang dibuka oleh pengguna.
 */
export function getRecentMateriList(userEmail?: string | null) {
  const learningData = readUserLearningData(userEmail);
  const result: Array<{
    id: string;
    title: string;
    category: string;
    readTime: number;
    progress: number;
    isCompleted: boolean;
  }> = [];

  for (const id of learningData.recentMateriIds) {
    const m = materiList.find((item) => item.id === id);
    if (m) {
      const isCompleted = learningData.completedMateriIds.includes(id);
      const userProg = isCompleted ? 100 : (learningData.materiProgress[id] ?? 0);
      result.push({
        id: m.id,
        title: m.title,
        category: m.category,
        readTime: m.readTime,
        progress: userProg,
        isCompleted,
      });
    }
  }

  return result;
}

/**
 * Sinkronisasi status checklist tantangan harian hari ini.
 * Memeriksa aktivitas riil pengguna pada hari ini, namun tetap
 * menghormati toggle manual pengguna.
 */
export function getDailyTasks(userEmail?: string | null): DailyTaskItem[] {
  const today = getTodayDateString();
  const learningData = readUserLearningData(userEmail);

  // 1. Cek apakah Al-Qur'an dibaca hari ini
  let readQuranToday = false;
  try {
    const lastRead = readLastRead();
    if (lastRead?.updatedAt && lastRead.updatedAt.slice(0, 10) === today) {
      readQuranToday = true;
    }
  } catch {
    // Abaikan
  }

  // 2. Cek apakah ada materi yang dibuka atau dipelajari hari ini
  let studiedMateriToday = false;
  for (const ts of Object.values(learningData.materiLastOpened)) {
    if (ts && ts.slice(0, 10) === today) {
      studiedMateriToday = true;
      break;
    }
  }

  // 3. Cek apakah hadits dan doa dibaca hari ini
  let readHaditsToday = false;
  let readDoaToday = false;
  if (typeof window !== "undefined") {
    try {
      readHaditsToday = localStorage.getItem(HADITS_LAST_READ_KEY) === today;
      readDoaToday = localStorage.getItem(DOA_LAST_READ_KEY) === today;
    } catch {
      // Abaikan
    }
  }

  // 4. Baca override manual dari storage hari ini
  let savedTasks: Record<string, boolean> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(getTasksStorageKey(userEmail, today));
      if (raw) {
        savedTasks = JSON.parse(raw);
      }
    } catch {
      savedTasks = {};
    }
  }

  const tasksConfig = [
    {
      id: "task-1",
      label: "Membaca Al-Qur'an",
      autoCompleted: readQuranToday,
    },
    {
      id: "task-2",
      label: "Membaca satu hadits",
      autoCompleted: readHaditsToday,
    },
    {
      id: "task-3",
      label: "Mempelajari satu materi",
      autoCompleted: studiedMateriToday,
    },
    {
      id: "task-4",
      label: "Membaca doa harian",
      autoCompleted: readDoaToday,
    },
  ];

  return tasksConfig.map((item) => {
    // Prioritaskan manual override jika pengguna telah mengklik centang
    const isManuallyChecked = savedTasks[item.id];
    const completed = isManuallyChecked !== undefined ? isManuallyChecked : item.autoCompleted;

    return {
      id: item.id,
      label: item.label,
      completed,
      autoCompleted: item.autoCompleted,
    };
  });
}

/**
 * Menyimpan toggle manual untuk item tantangan harian hari ini.
 */
export function toggleDailyTask(userEmail: string | null | undefined, taskId: string): DailyTaskItem[] {
  const today = getTodayDateString();
  const currentTasks = getDailyTasks(userEmail);
  const target = currentTasks.find((t) => t.id === taskId);
  if (!target) return currentTasks;

  const nextCompleted = !target.completed;

  // Baca storage saat ini
  let savedTasks: Record<string, boolean> = {};
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(getTasksStorageKey(userEmail, today));
      if (raw) savedTasks = JSON.parse(raw);
    } catch {
      savedTasks = {};
    }

    savedTasks[taskId] = nextCompleted;

    try {
      localStorage.setItem(getTasksStorageKey(userEmail, today), JSON.stringify(savedTasks));
    } catch {
      // Abaikan
    }

    // Jika dicentang selesai, catat sebagai aktivitas harian
    if (nextCompleted) {
      recordUserActivity(userEmail, today);
    }

    dispatchLearningUpdated();
  }

  return getDailyTasks(userEmail);
}
