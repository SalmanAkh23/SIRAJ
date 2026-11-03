/**
 * Data layer halaman Al-Qur'an — Quran.com API v4 (https://api.quran.com).
 *
 * - Teks Arab: Uthmani script (fields=text_uthmani,chapter_id).
 * - Terjemahan Indonesia: resource resmi "Indonesian Islamic Affairs Ministry"
 *   (id 33, slug quran.id) — dicek tersedia melalui /resources/translations.
 * - Metadata surah: /chapters (nama Arab, nama Indonesia, jumlah ayat,
 *   tempat turun, penanda basmalah).
 * - Metadata & ayat Juz: /juzs dan /verses/by_juz/{juz_number}.
 * - Audio murottal multi-qari: CDN https://verses.quran.foundation & mirror resmi (per ayat).
 */

const API_BASE = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.foundation";

/** Resource terjemahan Bahasa Indonesia — "Indonesian Islamic Affairs Ministry" (quran.id). */
export const INDONESIAN_TRANSLATION_ID = 33;

/** Reciter murottal default — Mishari Rashid al-`Afasy. */
export const RECITATION_ID = 7;

/** Maksimal ayat per halaman permintaan API (batas resmi endpoint: 50). */
const PER_PAGE = 50;

export const TOTAL_SURAHS = 114;
export const TOTAL_JUZS = 30;

export interface QuranReciter {
  id: number;
  name: string;
  style: string;
  arabicName: string;
}

/** Daftar Qari resmi yang didukung Quran.com API v4 (per-ayat). */
export const QURAN_RECITERS: QuranReciter[] = [
  {
    id: 7,
    name: "Mishari Rashid al-`Afasy",
    style: "Murattal",
    arabicName: "مشاري راشد العفاسي",
  },
  {
    id: 3,
    name: "Abdur-Rahman as-Sudais",
    style: "Imam Masjidil Haram",
    arabicName: "عبدالرحمن السديس",
  },
  {
    id: 2,
    name: "AbdulBaset AbdulSamad",
    style: "Murattal",
    arabicName: "عبد الباسط عبد الصمد",
  },
  {
    id: 4,
    name: "Abu Bakr al-Shatri",
    style: "Murattal",
    arabicName: "أبو بكر الشاطري",
  },
  {
    id: 6,
    name: "Mahmoud Khalil Al-Husary",
    style: "Murattal",
    arabicName: "محمود خليل الحصري",
  },
  {
    id: 10,
    name: "Sa`ud ash-Shuraym",
    style: "Imam Masjidil Haram",
    arabicName: "سعود الشريم",
  },
  {
    id: 5,
    name: "Hani ar-Rifai",
    style: "Murattal",
    arabicName: "هاني الرفاعي",
  },
];

export interface ChapterMeta {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: string;
  bismillah_pre: boolean;
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface QuranVerse {
  /** Nomor surah (1–114). */
  chapterId: number;
  /** Nomor ayat dalam surah (1-based). */
  number: number;
  /** Kunci ayat, contoh "2:255". */
  key: string;
  /** Teks Arab Uthmani apa adanya dari API. */
  arabic: string;
  /** Terjemahan Bahasa Indonesia tanpa tag HTML/penanda catatan kaki. */
  translation: string;
  /** URL audio murottal ayat, null bila tidak tersedia. */
  audioUrl: string | null;
}

export interface JuzSurahSegment {
  surahNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  startVerse: number;
  endVerse: number;
}

export interface JuzMeta {
  juzNumber: number;
  nameLatin: string;
  nameArabic: string;
  versesCount: number;
  startSurahNumber: number;
  startSurahName: string;
  startVerse: number;
  endSurahNumber: number;
  endSurahName: string;
  endVerse: number;
  verseMapping: Record<string, string>;
  segments: JuzSurahSegment[];
}

export interface TranslationEdition {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
}

interface RawVerse {
  verse_number: number;
  verse_key: string;
  chapter_id?: number;
  text_uthmani?: string;
  translations?: { text: string }[];
  audio?: { url: string };
}

interface RawVersesResponse {
  verses: RawVerse[];
  pagination: { total_pages: number; total_records: number };
}

interface RawChaptersResponse {
  chapters: ChapterMeta[];
}

interface RawJuzItem {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}

interface RawJuzsResponse {
  juzs: RawJuzItem[];
}

interface RawTranslationsResponse {
  translations: TranslationEdition[];
}

/**
 * Spesifikasi terverifikasi 30 Juz sesuai Mushaf Utsmani standar & Quran.com API v4.
 * Digunakan untuk memperkaya nama tradisional Juz serta validasi rentang surah/ayat.
 */
interface VerifiedJuzSpec {
  juzNumber: number;
  nameLatin: string;
  nameArabic: string;
  versesCount: number;
  verseMapping: Record<string, string>;
}

export const VERIFIED_JUZ_SPECS: VerifiedJuzSpec[] = [
  { juzNumber: 1, nameLatin: "Alif Lam Mim", nameArabic: "آلم", versesCount: 148, verseMapping: { "1": "1-7", "2": "1-141" } },
  { juzNumber: 2, nameLatin: "Sayaqul", nameArabic: "سَيَقُولُ", versesCount: 111, verseMapping: { "2": "142-252" } },
  { juzNumber: 3, nameLatin: "Tilkal Rusul", nameArabic: "تِلْكَ الرُّسُلُ", versesCount: 126, verseMapping: { "2": "253-286", "3": "1-92" } },
  { juzNumber: 4, nameLatin: "Lan Tanalul Birra", nameArabic: "لَنْ تَنَالُوا الْبِرَّ", versesCount: 131, verseMapping: { "3": "93-200", "4": "1-23" } },
  { juzNumber: 5, nameLatin: "Wal Muhshanat", nameArabic: "وَالْمُحْصَنَاتُ", versesCount: 124, verseMapping: { "4": "24-147" } },
  { juzNumber: 6, nameLatin: "La Yuhibbullah", nameArabic: "لَا يُحِبُّ اللَّهُ", versesCount: 110, verseMapping: { "4": "148-176", "5": "1-81" } },
  { juzNumber: 7, nameLatin: "Wa Idza Sami'u", nameArabic: "وَإِذَا سَمِعُوا", versesCount: 149, verseMapping: { "5": "82-120", "6": "1-110" } },
  { juzNumber: 8, nameLatin: "Wa Lau Annana", nameArabic: "وَلَوْ أَنَّنَا", versesCount: 142, verseMapping: { "6": "111-165", "7": "1-87" } },
  { juzNumber: 9, nameLatin: "Qalal Mala'u", nameArabic: "قَالَ الْمَلَأُ", versesCount: 159, verseMapping: { "7": "88-206", "8": "1-40" } },
  { juzNumber: 10, nameLatin: "Wa'lamu", nameArabic: "وَاعْلَمُوا", versesCount: 127, verseMapping: { "8": "41-75", "9": "1-92" } },
  { juzNumber: 11, nameLatin: "Ya'tadzirun", nameArabic: "يَعْتَذِرُونَ", versesCount: 151, verseMapping: { "9": "93-129", "10": "1-109", "11": "1-5" } },
  { juzNumber: 12, nameLatin: "Wa Ma Min Dabbah", nameArabic: "وَمَا مِنْ دَابَّةٍ", versesCount: 170, verseMapping: { "11": "6-123", "12": "1-52" } },
  { juzNumber: 13, nameLatin: "Wa Ma Ubarri'u", nameArabic: "وَمَا أُبَرِّئُ", versesCount: 154, verseMapping: { "12": "53-111", "13": "1-43", "14": "1-52" } },
  { juzNumber: 14, nameLatin: "Rubama", nameArabic: "رُبَمَا", versesCount: 227, verseMapping: { "15": "1-99", "16": "1-128" } },
  { juzNumber: 15, nameLatin: "Subhanalladzi", nameArabic: "سُبْحَانَ الَّذِي", versesCount: 185, verseMapping: { "17": "1-111", "18": "1-74" } },
  { juzNumber: 16, nameLatin: "Qala Alam", nameArabic: "قَالَ أَلَمْ", versesCount: 269, verseMapping: { "18": "75-110", "19": "1-98", "20": "1-135" } },
  { juzNumber: 17, nameLatin: "Iqtaraba Linnas", nameArabic: "اقْتَرَبَ لِلنَّاسِ", versesCount: 190, verseMapping: { "21": "1-112", "22": "1-78" } },
  { juzNumber: 18, nameLatin: "Qad Aflaha", nameArabic: "قَدْ أَفْلَحَ", versesCount: 202, verseMapping: { "23": "1-118", "24": "1-64", "25": "1-20" } },
  { juzNumber: 19, nameLatin: "Wa Qalalladzina", nameArabic: "وَقَالَ الَّذِينَ", versesCount: 339, verseMapping: { "25": "21-77", "26": "1-227", "27": "1-55" } },
  { juzNumber: 20, nameLatin: "A'man Khalaqa", nameArabic: "أَمَّنْ خَلَقَ", versesCount: 171, verseMapping: { "27": "56-93", "28": "1-88", "29": "1-45" } },
  { juzNumber: 21, nameLatin: "Utlu Ma Uhiya", nameArabic: "اتْلُ مَا أُوحِيَ", versesCount: 178, verseMapping: { "29": "46-69", "30": "1-60", "31": "1-34", "32": "1-30", "33": "1-30" } },
  { juzNumber: 22, nameLatin: "Wa Man Yaqnut", nameArabic: "وَمَنْ يَقْنُتْ", versesCount: 169, verseMapping: { "33": "31-73", "34": "1-54", "35": "1-45", "36": "1-27" } },
  { juzNumber: 23, nameLatin: "Wa Maliya", nameArabic: "وَمَا لِيَ", versesCount: 357, verseMapping: { "36": "28-83", "37": "1-182", "38": "1-88", "39": "1-31" } },
  { juzNumber: 24, nameLatin: "Faman Azhlamu", nameArabic: "فَمَنْ أَظْلَمُ", versesCount: 175, verseMapping: { "39": "32-75", "40": "1-85", "41": "1-46" } },
  { juzNumber: 25, nameLatin: "Ilaihi Yuraddu", nameArabic: "إِلَيْهِ يُرَدُّ", versesCount: 246, verseMapping: { "41": "47-54", "42": "1-53", "43": "1-89", "44": "1-59", "45": "1-37" } },
  { juzNumber: 26, nameLatin: "Ha Mim", nameArabic: "حم", versesCount: 195, verseMapping: { "46": "1-35", "47": "1-38", "48": "1-29", "49": "1-18", "50": "1-45", "51": "1-30" } },
  { juzNumber: 27, nameLatin: "Qala Fama Khathbukum", nameArabic: "قَالَ فَمَا خَطْبُكُمْ", versesCount: 399, verseMapping: { "51": "31-60", "52": "1-49", "53": "1-62", "54": "1-55", "55": "1-78", "56": "1-96", "57": "1-29" } },
  { juzNumber: 28, nameLatin: "Qad Sami'allahu", nameArabic: "قَدْ سَمِعَ اللَّهُ", versesCount: 137, verseMapping: { "58": "1-22", "59": "1-24", "60": "1-13", "61": "1-14", "62": "1-11", "63": "1-11", "64": "1-18", "65": "1-12", "66": "1-12" } },
  { juzNumber: 29, nameLatin: "Tabarakalladzi", nameArabic: "تَبَارَكَ الَّذِي", versesCount: 431, verseMapping: { "67": "1-30", "68": "1-52", "69": "1-52", "70": "1-44", "71": "1-28", "72": "1-28", "73": "1-20", "74": "1-56", "75": "1-40", "76": "1-31", "77": "1-50" } },
  {
    juzNumber: 30,
    nameLatin: "'Amma Yatasa'alun",
    nameArabic: "عَمَّ يَتَسَاءَلُونَ",
    versesCount: 564,
    verseMapping: {
      "78": "1-40", "79": "1-46", "80": "1-42", "81": "1-29", "82": "1-19",
      "83": "1-36", "84": "1-25", "85": "1-22", "86": "1-17", "87": "1-19",
      "88": "1-26", "89": "1-30", "90": "1-20", "91": "1-15", "92": "1-21",
      "93": "1-11", "94": "1-8", "95": "1-8", "96": "1-19", "97": "1-5",
      "98": "1-8", "99": "1-8", "100": "1-11", "101": "1-11", "102": "1-8",
      "103": "1-3", "104": "1-9", "105": "1-5", "106": "1-4", "107": "1-7",
      "108": "1-3", "109": "1-6", "110": "1-3", "111": "1-5", "112": "1-4",
      "113": "1-5", "114": "1-6",
    },
  },
];

/** Pesan error yang ramah untuk pengguna. */
function messageForStatus(status: number): string {
  if (status === 404) return "Data Al-Qur'an tidak ditemukan.";
  if (status === 429)
    return "Terlalu banyak permintaan ke Quran.com. Tunggu sebentar lalu coba lagi.";
  return "Gagal memuat data dari Quran.com. Periksa koneksi internetmu lalu coba lagi.";
}

async function getJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`);
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke Quran.com. Periksa koneksi internetmu lalu coba lagi."
    );
  }
  if (!response.ok) throw new Error(messageForStatus(response.status));
  return (await response.json()) as T;
}

/** Cache per-key agar data tidak diambil ulang saat navigasi bolak-balik. */
const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const existing = cache.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = loader().catch((error: unknown) => {
    cache.delete(key); // gagal → izinkan percobaan berikutnya
    throw error;
  });
  cache.set(key, promise);
  return promise;
}

/** Daftar metadata 114 surah (bahasa Indonesia). */
export function fetchChapters(): Promise<ChapterMeta[]> {
  return cached("chapters", async () => {
    const data = await getJson<RawChaptersResponse>("/chapters?language=id");
    if (!Array.isArray(data.chapters) || data.chapters.length === 0) {
      throw new Error("Daftar surah tidak tersedia. Coba lagi nanti.");
    }
    return data.chapters;
  });
}

/** Bangun objek JuzMeta lengkap dari verse_mapping dan daftar ChapterMeta. */
function buildJuzMeta(
  juzNumber: number,
  verseMapping: Record<string, string>,
  versesCount: number,
  chaptersMap: Map<number, ChapterMeta>
): JuzMeta {
  const spec = VERIFIED_JUZ_SPECS.find((s) => s.juzNumber === juzNumber);
  const segments: JuzSurahSegment[] = Object.entries(verseMapping)
    .map(([surahKey, rangeStr]) => {
      const surahNumber = Number(surahKey);
      const [startStr, endStr] = String(rangeStr).split("-");
      const startVerse = Number(startStr) || 1;
      const endVerse = Number(endStr) || startVerse;
      const chapter = chaptersMap.get(surahNumber);
      return {
        surahNumber,
        surahNameLatin: chapter?.name_simple ?? `Surah ${surahNumber}`,
        surahNameArabic: chapter?.name_arabic ?? "",
        startVerse,
        endVerse,
      };
    })
    .sort((a, b) => a.surahNumber - b.surahNumber);

  const firstSeg = segments[0] ?? {
    surahNumber: 1,
    surahNameLatin: "Al-Fatihah",
    surahNameArabic: "الفاتحة",
    startVerse: 1,
    endVerse: 7,
  };
  const lastSeg = segments[segments.length - 1] ?? firstSeg;

  return {
    juzNumber,
    nameLatin: spec?.nameLatin ?? `Juz ${juzNumber}`,
    nameArabic: spec?.nameArabic ?? "",
    versesCount: versesCount || spec?.versesCount || 0,
    startSurahNumber: firstSeg.surahNumber,
    startSurahName: firstSeg.surahNameLatin,
    startVerse: firstSeg.startVerse,
    endSurahNumber: lastSeg.surahNumber,
    endSurahName: lastSeg.surahNameLatin,
    endVerse: lastSeg.endVerse,
    verseMapping,
    segments,
  };
}

/**
 * Daftar metadata 30 Juz dengan informasi surah/ayat awal & akhir
 * yang diambil dari Quran.com API v4 (/juzs + /chapters) dan tervalidasi.
 */
export function fetchJuzs(): Promise<JuzMeta[]> {
  return cached("juzs-meta", async () => {
    const [chapters, rawJuzsResp] = await Promise.all([
      fetchChapters(),
      getJson<RawJuzsResponse>("/juzs").catch(() => ({ juzs: [] as RawJuzItem[] })),
    ]);

    const chaptersMap = new Map<number, ChapterMeta>();
    for (const ch of chapters) {
      chaptersMap.set(ch.id, ch);
    }

    const byJuzNumber = new Map<number, RawJuzItem>();
    for (const item of rawJuzsResp.juzs ?? []) {
      if (
        item.juz_number >= 1 &&
        item.juz_number <= TOTAL_JUZS &&
        !byJuzNumber.has(item.juz_number) &&
        item.verse_mapping &&
        Object.keys(item.verse_mapping).length > 0
      ) {
        byJuzNumber.set(item.juz_number, item);
      }
    }

    return VERIFIED_JUZ_SPECS.map((spec) => {
      const apiJuz = byJuzNumber.get(spec.juzNumber);
      const mapping = apiJuz?.verse_mapping ?? spec.verseMapping;
      const count = apiJuz?.verses_count ?? spec.versesCount;
      return buildJuzMeta(spec.juzNumber, mapping, count, chaptersMap);
    });
  });
}

/** Info edisi terjemahan untuk menampilkan sumber terjemahan. */
export function fetchTranslationEdition(): Promise<TranslationEdition> {
  return cached(`edition-${INDONESIAN_TRANSLATION_ID}`, async () => {
    const data = await getJson<RawTranslationsResponse>(
      "/resources/translations?language=id"
    );
    const found = data.translations.find(
      (item) => item.id === INDONESIAN_TRANSLATION_ID
    );
    return (
      found ?? {
        id: INDONESIAN_TRANSLATION_ID,
        name: "Terjemahan Bahasa Indonesia",
        author_name: "",
        language_name: "indonesian",
      }
    );
  });
}

/**
 * Teks basmalah (ayat 1:1) diambil langsung dari API, bukan ditulis manual,
 * agar tidak pernah ada teks Al-Qur'an yang salah ketik.
 */
export function fetchBasmalah(): Promise<string | null> {
  return cached("basmalah", async () => {
    const data = await getJson<RawVersesResponse>(
      `/verses/by_chapter/1?fields=text_uthmani&per_page=1&page=1`
    );
    return data.verses[0]?.text_uthmani ?? null;
  });
}

async function fetchVersePage(
  chapterNumber: number,
  page: number,
  recitationId: number
): Promise<RawVersesResponse> {
  return getJson<RawVersesResponse>(
    `/verses/by_chapter/${chapterNumber}` +
      `?fields=text_uthmani,chapter_id` +
      `&translations=${INDONESIAN_TRANSLATION_ID}` +
      `&audio=${recitationId}` +
      `&per_page=${PER_PAGE}&page=${page}`
  );
}

async function fetchJuzVersePage(
  juzNumber: number,
  page: number,
  recitationId: number
): Promise<RawVersesResponse> {
  return getJson<RawVersesResponse>(
    `/verses/by_juz/${juzNumber}` +
      `?fields=text_uthmani,chapter_id` +
      `&translations=${INDONESIAN_TRANSLATION_ID}` +
      `&audio=${recitationId}` +
      `&per_page=${PER_PAGE}&page=${page}`
  );
}

/** Normalisasi URL audio dari Quran.com API v4 (mendukung path relatif, //mirror, dan https). */
export function resolveAudioUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  return `${AUDIO_BASE}/${trimmed.replace(/^\//, "")}`;
}

/** Hapus tag HTML (penanda catatan kaki) dan entitas dari teks terjemahan. */
export function stripTranslationHtml(raw: string): string {
  const entities: Record<string, string> = {
    "&quot;": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&amp;": "&",
  };
  return raw
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&(?:quot|apos|lt|gt|nbsp|amp|#39);/g, (match) => entities[match] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

function toQuranVerse(raw: RawVerse): QuranVerse {
  const [keyChapter, keyVerse] = (raw.verse_key ?? "").split(":");
  const chapterId = raw.chapter_id ?? (Number(keyChapter) || 1);
  const verseNumber = raw.verse_number || Number(keyVerse) || 1;
  const translationRaw = raw.translations?.[0]?.text ?? "";
  return {
    chapterId,
    number: verseNumber,
    key: raw.verse_key || `${chapterId}:${verseNumber}`,
    arabic: (raw.text_uthmani ?? "").trim(),
    translation: stripTranslationHtml(translationRaw),
    audioUrl: resolveAudioUrl(raw.audio?.url),
  };
}

/** Semua ayat satu surah, digabung dari semua halaman permintaan. */
export function fetchSurahVerses(
  chapterNumber: number,
  recitationId: number = RECITATION_ID
): Promise<QuranVerse[]> {
  return cached(`verses-surah-${chapterNumber}-qari-${recitationId}`, async () => {
    const first = await fetchVersePage(chapterNumber, 1, recitationId);
    const totalPages = Math.max(1, first.pagination?.total_pages ?? 1);

    let pages: RawVersesResponse[] = [first];
    if (totalPages > 1) {
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          fetchVersePage(chapterNumber, i + 2, recitationId)
        )
      );
      pages = pages.concat(rest);
    }

    const verses = pages
      .flatMap((page) => page.verses ?? [])
      .map(toQuranVerse)
      .sort((a, b) => a.chapterId - b.chapterId || a.number - b.number);

    if (verses.length === 0) {
      throw new Error("Ayat untuk surah ini tidak tersedia. Coba lagi nanti.");
    }
    return verses;
  });
}

/** Semua ayat dalam satu Juz (1–30), berurutan lintas surah sesuai batas juz resmi. */
export function fetchJuzVerses(
  juzNumber: number,
  recitationId: number = RECITATION_ID
): Promise<QuranVerse[]> {
  return cached(`verses-juz-${juzNumber}-qari-${recitationId}`, async () => {
    const first = await fetchJuzVersePage(juzNumber, 1, recitationId);
    const totalPages = Math.max(1, first.pagination?.total_pages ?? 1);

    let pages: RawVersesResponse[] = [first];
    if (totalPages > 1) {
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          fetchJuzVersePage(juzNumber, i + 2, recitationId)
        )
      );
      pages = pages.concat(rest);
    }

    const verses = pages
      .flatMap((page) => page.verses ?? [])
      .map(toQuranVerse)
      .sort((a, b) => a.chapterId - b.chapterId || a.number - b.number);

    if (verses.length === 0) {
      throw new Error("Ayat untuk juz ini tidak tersedia. Coba lagi nanti.");
    }
    return verses;
  });
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Konversi angka ke digit Arab-Indik (untuk penanda ayat ala mushaf). */
export function toArabicDigits(value: number): string {
  return String(value)
    .split("")
    .map((char) => ARABIC_DIGITS[Number(char)] ?? char)
    .join("");
}

/**
 * Label kategori turun: "Makkiyah" | "Madaniyah".
 */
export function revelationLabel(place: string): "Makkiyah" | "Madaniyah" {
  return place.trim().toLowerCase().startsWith("mad") ? "Madaniyah" : "Makkiyah";
}

/** Validasi nomor surah 1–114 (harus bulat). */
export function isValidSurahNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= TOTAL_SURAHS;
}

/** Validasi nomor juz 1–30 (harus bulat). */
export function isValidJuzNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= TOTAL_JUZS;
}

/** Cari nomor Juz (1–30) berdasarkan nomor surah dan nomor ayat. */
export function findJuzNumberByVerse(surahNumber: number, verseNumber: number): number {
  const key = String(surahNumber);
  for (const spec of VERIFIED_JUZ_SPECS) {
    const range = spec.verseMapping[key];
    if (!range) continue;
    const [startStr, endStr] = range.split("-");
    const start = Number(startStr) || 1;
    const end = Number(endStr) || start;
    if (verseNumber >= start && verseNumber <= end) {
      return spec.juzNumber;
    }
  }
  return 1;
}

/** Hitung posisi urut ayat (1-based) dan total ayat di dalam Juz untuk (surahNumber, verseNumber). */
export function calculateVersePositionInJuz(
  juzNumber: number,
  surahNumber: number,
  verseNumber: number
): { position: number; total: number; percentage: number } {
  const spec = VERIFIED_JUZ_SPECS.find((s) => s.juzNumber === juzNumber);
  if (!spec) return { position: 1, total: 1, percentage: 0 };

  let passed = 0;
  const entries = Object.entries(spec.verseMapping).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  for (const [surahKey, rangeStr] of entries) {
    const sNum = Number(surahKey);
    const [startStr, endStr] = rangeStr.split("-");
    const start = Number(startStr) || 1;
    const end = Number(endStr) || start;
    if (sNum < surahNumber) {
      passed += end - start + 1;
    } else if (sNum === surahNumber) {
      const clamped = Math.max(start, Math.min(end, verseNumber));
      passed += clamped - start + 1;
      break;
    }
  }

  const total = spec.versesCount || 1;
  const position = Math.max(1, Math.min(total, passed || 1));
  const percentage = Math.max(1, Math.min(100, Math.round((position / total) * 100)));
  return { position, total, percentage };
}

// ============================================================================
// Penyimpanan Lokal: Pilihan Qari, Ayat Terakhir Dibaca & Progres Bacaan Juz
// ============================================================================

const KEY_RECITER = "siraj-quran-reciter-id";
const KEY_LAST_READ = "siraj-quran-last-read";
const KEY_JUZ_PROGRESS = "siraj-quran-juz-progress";

export interface QuranLastRead {
  mode: "surah" | "juz";
  juzNumber: number;
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  verseKey: string;
  percentageInJuz: number;
  updatedAt: string;
}

export interface JuzProgressEntry {
  juzNumber: number;
  lastVerseKey: string;
  lastSurahNumber: number;
  lastSurahName: string;
  lastVerseNumber: number;
  readCount: number;
  totalVerses: number;
  percentage: number;
  updatedAt: string;
}

export function readReciterId(): number {
  if (typeof window === "undefined") return RECITATION_ID;
  try {
    const raw = localStorage.getItem(KEY_RECITER);
    if (raw) {
      const parsed = Number(raw);
      if (QURAN_RECITERS.some((r) => r.id === parsed)) return parsed;
    }
  } catch {
    // abaikan
  }
  return RECITATION_ID;
}

export function saveReciterId(reciterId: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_RECITER, String(reciterId));
  } catch {
    // abaikan
  }
}

export function readLastRead(): QuranLastRead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_LAST_READ);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuranLastRead;
    if (parsed && parsed.verseKey && parsed.surahNumber && parsed.juzNumber) {
      return parsed;
    }
  } catch {
    // abaikan
  }
  return null;
}

export function readJuzProgressMap(): Record<number, JuzProgressEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY_JUZ_PROGRESS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<number, JuzProgressEntry>;
    }
  } catch {
    // abaikan
  }
  return {};
}

export function markVerseAsLastRead(params: {
  mode: "surah" | "juz";
  juzNumber?: number;
  surahNumber: number;
  surahName: string;
  verseNumber: number;
}): { lastRead: QuranLastRead; juzProgress: JuzProgressEntry } {
  const juzNumber =
    params.juzNumber ?? findJuzNumberByVerse(params.surahNumber, params.verseNumber);
  const { position, total, percentage } = calculateVersePositionInJuz(
    juzNumber,
    params.surahNumber,
    params.verseNumber
  );
  const verseKey = `${params.surahNumber}:${params.verseNumber}`;
  const now = new Date().toISOString();

  const lastRead: QuranLastRead = {
    mode: params.mode,
    juzNumber,
    surahNumber: params.surahNumber,
    surahName: params.surahName,
    verseNumber: params.verseNumber,
    verseKey,
    percentageInJuz: percentage,
    updatedAt: now,
  };

  const juzProgress: JuzProgressEntry = {
    juzNumber,
    lastVerseKey: verseKey,
    lastSurahNumber: params.surahNumber,
    lastSurahName: params.surahName,
    lastVerseNumber: params.verseNumber,
    readCount: position,
    totalVerses: total,
    percentage,
    updatedAt: now,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY_LAST_READ, JSON.stringify(lastRead));
      const map = readJuzProgressMap();
      map[juzNumber] = juzProgress;
      localStorage.setItem(KEY_JUZ_PROGRESS, JSON.stringify(map));
    } catch {
      // abaikan
    }
  }

  return { lastRead, juzProgress };
}
