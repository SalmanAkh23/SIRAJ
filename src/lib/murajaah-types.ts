export type MurajaahMode = "hafalan" | "bantuan" | "sambung";

/**
 * Status bacaan untuk setiap ayat pada sesi murajaah Tartel.
 */
export type VerseMurajaahStatus =
  | "belum_dibaca"
  | "sedang_dibaca"
  | "selesai"
  | "perlu_diperiksa";

/**
 * Status kesiapan modul integrasi pengenalan suara / AI Voice Correction.
 * Disiapkan agar mudah dihubungkan ke backend Speech-to-Text / AI pada tahap berikutnya.
 */
export type VoiceIntegrationStatus =
  | "idle"
  | "ready_for_integration"
  | "listening"
  | "processing"
  | "unsupported"
  | "error";

/**
 * Struktur state per ayat untuk sesi murajaah & persiapan AI voice correction.
 */
export interface VerseSessionItemState {
  verseKey: string;
  verseNumber: number;
  chapterId: number;
  status: VerseMurajaahStatus;
  updatedAt?: string;
  /** Draft transkripsi suara jika kelak terhubung ke Speech-to-Text */
  voiceTranscriptDraft?: string;
  /** Catatan pemeriksaan mandiri atau dari sistem koreksi nantinya */
  reviewNote?: string;
}

/**
 * State global untuk kesiapan AI Voice Correction pada komponen sesi murajaah.
 */
export interface VoiceCorrectionSessionState {
  integrationStatus: VoiceIntegrationStatus;
  isMicEnabled: boolean;
  activeVerseKey: string | null;
  transcriptBuffer: string;
  lastError: string | null;
}

export type WordEvaluationStatus = "correct" | "uncertain" | "missing" | "different";

export interface EvaluatedWord {
  index: number;
  word: string; // Teks Utsmani asli dengan harakat
  normalizedTarget: string; // Teks normalisasi untuk pencocokan
  status: WordEvaluationStatus;
  spokenWord?: string; // Teks yang dilafadzkan reciter (jika ada)
  similarity: number; // 0.0 - 1.0
  note?: string;
}

export interface VerseEvaluationResult {
  verseKey: string; // misal "1:1"
  verseNumber: number;
  chapterId: number;
  targetArabic: string;
  targetTranslation: string;
  spokenArabic: string;
  score: number; // 0 - 100
  accuracyPercentage: number; // 0 - 100
  grade: "mumtaz" | "jayyid_jiddan" | "jayyid" | "perlu_latihan";
  gradeLabel: string;
  words: EvaluatedWord[];
  correctWordsCount: number;
  uncertainWordsCount: number;
  missingWordsCount: number;
  differentWordsCount: number;
  totalWords: number;
  extraWords: string[];
  feedbackNotes: string[];
  needsRepeat: boolean;
  repeatSuggestion?: string;
  evaluatedAt: string; // ISO date string
  /** Status murajaah eksplisit pada sesi Tartel */
  murajaahStatus?: VerseMurajaahStatus;
}

export interface MurajaahRangeSelection {
  type: "surah" | "juz";
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  juzNumber?: number;
  startVerse: number;
  endVerse: number;
  totalVersesInRange: number;
}

export interface MurajaahSessionRecord {
  id: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  mode: MurajaahMode;
  range: MurajaahRangeSelection;
  totalVersesTested: number;
  versesPassedCount: number;
  versesCompletedCount?: number;
  versesNeedsReviewCount?: number;
  versesUnreadCount?: number;
  averageScore: number;
  results: VerseEvaluationResult[];
  itemsToRepeat: {
    verseKey: string;
    verseNumber: number;
    reason: string;
  }[];
}

export interface MurajaahStats {
  totalSessions: number;
  totalVersesTested: number;
  averageScore: number;
  streakDays: number;
  lastActiveDate: string;
  dailyTarget: number; // Jumlah ayat target harian
  todayVersesTested: number;
  bestSurah?: {
    surahNumber: number;
    surahName: string;
    score: number;
  };
}

export interface MurajaahSettings {
  preferredMode: MurajaahMode;
  dailyTarget: number;
  autoPlayCorrectAudio: boolean;
  showTranslation: boolean;
  sensitivityLevel: "standard" | "strict" | "lenient";
}
