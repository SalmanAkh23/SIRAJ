/**
 * Data layer & API client untuk Hadits di SIRAJ.
 *
 * Mengintegrasikan data hadits otentik dari 9 Kitab Induk (Kutubut Tis'ah)
 * dengan teks Arab lengkap (matan), terjemahan Bahasa Indonesia,
 * perawi sahabat, nomor hadits, serta verifikasi derajat hadits.
 */

import {
  arbainHaditsList,
  getArbainHaditsByNumber,
  searchArbainHadits,
  ARBAIN_METADATA,
} from "@/data/arbain-nawawi";

export interface HaditsBook {
  slug: string;
  name: string;
  total: number;
  author: string;
  shortName: string;
  grade?: string;
  description: string;
}

export type HaditsCategory =
  | "Iman"
  | "Ibadah"
  | "Akhlak"
  | "Ilmu"
  | "Muamalah";

export interface HaditsItem {
  id: string; // Mis. "hadits-1"
  number: number;
  bookSlug: string;
  bookName: string;
  arab: string;
  text: string; // Terjemahan bahasa Indonesia lengkap dengan sanad
  matanSnippet?: string; // Cuplikan sabda utama jika tersedia
  narrator: string; // Perawi (Sahabat / Imam)
  source: string; // Format baku, mis. "HR. Bukhari no. 1"
  category: HaditsCategory | "Umum";
  grade?: string; // Mis. "Shahih" untuk Bukhari & Muslim
  note?: string;
  title?: string;
  theme?: string;
  lessons?: string[];
  originalSources?: Array<{ book: string; number?: number | string; note?: string }>;
}

export interface HaditsPagination {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage?: number;
  endPage?: number;
}

export interface HaditsListResponse {
  book: HaditsBook;
  items: HaditsItem[];
  pagination: HaditsPagination;
  isFallback?: boolean;
  message?: string;
}

/** Koleksi Kitab Hadits dengan Arba'in An-Nawawi sebagai kitab utama */
export const HADITS_BOOKS: HaditsBook[] = [
  {
    slug: "arbain-nawawi",
    name: "Arba'in An-Nawawi",
    shortName: "Arba'in",
    total: 42,
    author: ARBAIN_METADATA.author,
    grade: "Shahih & Hasan Terverifikasi",
    description: ARBAIN_METADATA.description,
  },
  {
    slug: "bukhari",
    name: "Shahih Bukhari",
    shortName: "Bukhari",
    total: 6638,
    author: "Imam Muhammad bin Ismail Al-Bukhari (194–256 H)",
    grade: "Shahih",
    description: "Kitab kumpulan hadits paling otentik dan memiliki derajat keshahihan tertinggi dalam Islam.",
  },
  {
    slug: "muslim",
    name: "Shahih Muslim",
    shortName: "Muslim",
    total: 4930,
    author: "Imam Muslim bin Al-Hajjaj An-Naisaburi (204–261 H)",
    grade: "Shahih",
    description: "Kitab hadits shahih dengan sistematika bab dan perangkaian sanad yang sangat rapi.",
  },
  {
    slug: "abu-dawud",
    name: "Sunan Abu Dawud",
    shortName: "Abu Dawud",
    total: 4419,
    author: "Imam Abu Dawud Sulaiman bin Al-Asy'ats (202–275 H)",
    description: "Koleksi hadits yang berfokus mendalam pada permasalahan hukum fiqih dan amaliah syariat.",
  },
  {
    slug: "tirmidzi",
    name: "Jami' At-Tirmidzi",
    shortName: "At-Tirmidzi",
    total: 3625,
    author: "Imam Abu Isa Muhammad bin Isa At-Tirmidzi (209–279 H)",
    description: "Kitab monumental yang mencantumkan penilaian derajat hadits dan perbedaan pandangan ulama fiqih.",
  },
  {
    slug: "nasai",
    name: "Sunan An-Nasa'i",
    shortName: "An-Nasa'i",
    total: 5364,
    author: "Imam Ahmad bin Syu'aib An-Nasa'i (215–303 H)",
    description: "Terkenal dengan ketatnya persyaratan perawi dan penelitian 'ilal (cacat tersembunyi) hadits.",
  },
  {
    slug: "ibnu-majah",
    name: "Sunan Ibnu Majah",
    shortName: "Ibnu Majah",
    total: 4285,
    author: "Imam Muhammad bin Yazid Ibnu Majah (209–273 H)",
    description: "Menyempurnakan enam kitab induk hadits (Kutubus Sittah) dengan tata bab yang sistematis.",
  },
  {
    slug: "ahmad",
    name: "Musnad Ahmad",
    shortName: "Ahmad",
    total: 4305,
    author: "Imam Ahmad bin Muhammad bin Hanbal (164–241 H)",
    description: "Salah satu ensiklopedia hadits terbesar peradaban Islam yang disusun berdasarkan nama sahabat perawi.",
  },
  {
    slug: "malik",
    name: "Muwatta Malik",
    shortName: "Malik",
    total: 1587,
    author: "Imam Malik bin Anas (93–179 H)",
    description: "Karya hadits dan atsar fiqih tertua yang memotret pengamalan otentik penduduk Madinah Munawwarah.",
  },
  {
    slug: "darimi",
    name: "Sunan Ad-Darimi",
    shortName: "Ad-Darimi",
    total: 2949,
    author: "Imam Abdullah bin Abdurrahman Ad-Darimi (181–255 H)",
    description: "Kumpulan hadits berkualitas tinggi dengan banyak sanad 'ali (jalur perawi yang pendek).",
  },
];

/** Base URL default untuk Hadits API (dapat dioverride via env) */
const DEFAULT_API_BASE = "https://hadis-api-id.vercel.app";

export function getHaditsApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env) {
    if (process.env.HADITH_API_BASE_URL) return process.env.HADITH_API_BASE_URL;
    if (process.env.NEXT_PUBLIC_HADITH_API_URL) return process.env.NEXT_PUBLIC_HADITH_API_URL;
  }
  return DEFAULT_API_BASE;
}

/** Temukan info kitab berdasarkan slug */
export function getBookBySlug(slug: string): HaditsBook {
  const found = HADITS_BOOKS.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
  return (
    found ?? {
      slug,
      name: `Kitab ${slug}`,
      shortName: slug,
      total: 0,
      author: "Imam Ahli Hadits",
      description: "Kitab koleksi hadits Nabi Muhammad ﷺ.",
    }
  );
}

/** Ekstrak nama perawi sahabat dari teks sanad terjemahan */
export function extractSahabatNarrator(text: string, defaultAuthor: string): string {
  if (!text) return defaultAuthor;

  // 1. Pola sahabat langsung mendengar dari Rasulullah / Nabi
  const p1 =
    /\[([^\]]+)\][^\n\r\[\]]*?(?:saya pernah mendengar|saya mendengar|diatas mimbar berkata|berkata)?\s*;\s*saya mendengar Rasulullah/i;
  const m1 = text.match(p1);
  if (m1 && m1[1]) {
    return formatSahabatName(m1[1].trim());
  }

  // 2. Pola dari [Sahabat] ... dari Nabi / Rasulullah
  const p2 =
    /(?:dari|bahwa)\s+\[([^\]]+)\][^\n\r\[\]]*?(?:dari\s+)?(?:Nabi|Rasulullah)\s+shallallahu\s+'alaihi\s+wasallam/i;
  const m2 = text.match(p2);
  if (m2 && m2[1]) {
    return formatSahabatName(m2[1].trim());
  }

  // 3. Bracket terakhir sebelum "bersabda"
  const idxBersabda = text.indexOf("bersabda");
  if (idxBersabda > -1) {
    const beforeBersabda = text.slice(0, idxBersabda);
    const brackets = Array.from(beforeBersabda.matchAll(/\[([^\]]+)\]/g));
    if (brackets.length > 0) {
      return formatSahabatName(brackets[brackets.length - 1][1].trim());
    }
  }

  // 4. Bracket terakhir di teks
  const all = Array.from(text.matchAll(/\[([^\]]+)\]/g));
  if (all.length > 0) {
    return formatSahabatName(all[all.length - 1][1].trim());
  }

  return defaultAuthor;
}

/** Tambahkan gelar taraddhi yang sesuai (radhiyallahu 'anhu/'anha/'anhuma) */
function formatSahabatName(name: string): string {
  if (
    /radhiyallahu/i.test(name) ||
    /'anhu/i.test(name) ||
    /'anha/i.test(name) ||
    /'anhuma/i.test(name)
  ) {
    return name;
  }
  const femaleNames = ["Aisyah", "Fathimah", "Khadijah", "Hafshah", "Ummu Salamah", "Zainab", "Asma"];
  if (femaleNames.some((n) => name.toLowerCase().includes(n.toLowerCase()))) {
    return `${name} radhiyallahu 'anha`;
  }
  const duoNames = ["Ibnu Umar", "Ibnu 'Abbas", "Ibnu Abbas", "Ibnu Amr", "Usamah bin Zaid"];
  if (duoNames.some((n) => name.toLowerCase().includes(n.toLowerCase()))) {
    return `${name} radhiyallahu 'anhuma`;
  }
  return `${name} radhiyallahu 'anhu`;
}

/** Ekstrak kutipan sabda utama jika ada tanda petik */
export function extractMatanSnippet(text: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/"([^"]{15,})"/);
  if (match && match[1]) {
    return match[1].trim();
  }
  const idx = text.indexOf("bersabda:");
  if (idx > -1) {
    return text.slice(idx + 9).trim();
  }
  return undefined;
}

/**
 * Klasifikasi tematik hadits ke 5 kategori SIRAJ:
 * Iman, Ibadah, Akhlak, Ilmu, Muamalah (atau Umum jika di luar itu).
 */
export function classifyHadits(text: string): HaditsCategory | "Umum" {
  if (!text) return "Umum";

  const scores: Record<HaditsCategory, number> = {
    Iman: 0,
    Ibadah: 0,
    Akhlak: 0,
    Ilmu: 0,
    Muamalah: 0,
  };

  const patterns: Record<HaditsCategory, RegExp[]> = {
    Iman: [
      /\bniat\b/i,
      /\biman\b/i,
      /\bberiman\b/i,
      /\bkeimanan\b/i,
      /\btauhid\b/i,
      /\bsyahadat\b/i,
      /\bmalaikat\b/i,
      /\bkiamat\b/i,
      /\bhari akhir\b/i,
      /\bsurga\b/i,
      /\bneraka\b/i,
      /\btakwa\b/i,
      /\bbertakwa\b/i,
      /\bmukmin\b/i,
      /\bfitrah\b/i,
      /\bwahyu\b/i,
      /\bkemunafikan\b/i,
      /\bmunafik\b/i,
    ],
    Ibadah: [
      /\bshalat\b/i,
      /\bsolat\b/i,
      /\bwudhu\b/i,
      /\bwudu\b/i,
      /\bpuasa\b/i,
      /\bramadhan\b/i,
      /\bramadlan\b/i,
      /\bzakat\b/i,
      /\bhaji\b/i,
      /\bumrah\b/i,
      /\bthaharah\b/i,
      /\bbersuci\b/i,
      /\bsujud\b/i,
      /\bruku\b/i,
      /\badzan\b/i,
      /\biqamah\b/i,
      /\bdoa\b/i,
      /\bdzikir\b/i,
      /\bqurban\b/i,
      /\bjenazah\b/i,
      /\btakbir\b/i,
      /\btasyahhud\b/i,
    ],
    Akhlak: [
      /\bakhlak\b/i,
      /\badab\b/i,
      /\bsantun\b/i,
      /\bmalu\b/i,
      /\bjujur\b/i,
      /\bkejujuran\b/i,
      /\bdusta\b/i,
      /\bkasih sayang\b/i,
      /\bmencintai saudaranya\b/i,
      /\bsenyum\b/i,
      /\bmarah\b/i,
      /\bsabar\b/i,
      /\bsyukur\b/i,
      /\bsilaturahim\b/i,
      /\bberbakti\b/i,
      /\borang tua\b/i,
      /\btetangga\b/i,
      /\bhasad\b/i,
      /\bghibah\b/i,
      /\bfitnah\b/i,
      /\btawadhu\b/i,
      /\bsombong\b/i,
      /\bamanah\b/i,
    ],
    Ilmu: [
      /\bilmu\b/i,
      /\bmenuntut ilmu\b/i,
      /\bulama\b/i,
      /\bbelajar\b/i,
      /\bmengajar\b/i,
      /\bmengajarkan\b/i,
      /\bpenghafal\b/i,
      /\bmemahami\b/i,
      /\bsampaikan dariku\b/i,
      /\bayat\b/i,
      /\bfatwa\b/i,
      /\bnasihat\b/i,
    ],
    Muamalah: [
      /\bjual beli\b/i,
      /\bperdagangan\b/i,
      /\btransaksi\b/i,
      /\bhutang\b/i,
      /\briba\b/i,
      /\bsewa\b/i,
      /\bgadai\b/i,
      /\bharta\b/i,
      /\bsedekah\b/i,
      /\binfak\b/i,
      /\bwaris\b/i,
      /\bwarisan\b/i,
      /\bpinjam\b/i,
      /\bupah\b/i,
      /\bpekerja\b/i,
      /\bperjanjian\b/i,
      /\bbisnis\b/i,
      /\btimbangan\b/i,
    ],
  };

  for (const [cat, regexList] of Object.entries(patterns) as [HaditsCategory, RegExp[]][]) {
    for (const r of regexList) {
      if (r.test(text)) {
        scores[cat] += 1;
      }
    }
  }

  let topCategory: HaditsCategory | null = null;
  let maxScore = 0;
  for (const [cat, score] of Object.entries(scores) as [HaditsCategory, number][]) {
    if (score > maxScore) {
      maxScore = score;
      topCategory = cat;
    }
  }

  return topCategory && maxScore > 0 ? topCategory : "Umum";
}

/** Hadits cadangan berverifikasi (otentik Arab + Terjemah) untuk fallback offline */
export const VERIFIED_FALLBACK_HADITS: HaditsItem[] = [
  {
    id: "hadits-1",
    number: 1,
    bookSlug: "bukhari",
    bookName: "Shahih Bukhari",
    arab: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    text: "Sesungguhnya setiap amalan tergantung pada niatnya. Dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan. Barangsiapa yang hijrahnya karena dunia yang ingin digapainya atau karena wanita yang ingin dinikahinya, maka hijrahnya kepada apa yang ia tuju.",
    matanSnippet: "Sesungguhnya setiap amalan tergantung pada niatnya, dan setiap orang akan mendapatkan apa yang ia niatkan.",
    narrator: "Umar bin Khaththab radhiyallahu 'anhu",
    source: "HR. Bukhari no. 1, Muslim no. 1907",
    category: "Iman",
    grade: "Shahih Muttafaq 'Alaih",
    note: "Hadits pokok dalam Islam yang menjadi landasan seluruh niat amalan hati dan perbuatan.",
  },
  {
    id: "hadits-2",
    number: 12,
    bookSlug: "bukhari",
    bookName: "Shahih Bukhari",
    arab: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    text: "Tidak beriman salah seorang di antara kalian hingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
    matanSnippet: "Tidak beriman salah seorang di antara kalian hingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
    narrator: "Anas bin Malik radhiyallahu 'anhu",
    source: "HR. Bukhari no. 13, Muslim no. 45",
    category: "Iman",
    grade: "Shahih Muttafaq 'Alaih",
    note: "Menegaskan kesempurnaan iman tercapai dengan menumbuhkan cinta dan ukhuwah sesama mukmin.",
  },
  {
    id: "hadits-3",
    number: 7,
    bookSlug: "bukhari",
    bookName: "Shahih Bukhari",
    arab: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ وَإِقَامِ الصَّلَاةِ وَإِيتَاءِ الزَّكَاةِ وَالْحَجِّ وَصَوْمِ رَمَضَانَ",
    text: "Islam dibangun di atas lima perkara: persaksian bahwa tidak ada tuhan selain Allah dan bahwa Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, menunaikan haji ke Baitullah, dan berpuasa di bulan Ramadhan.",
    matanSnippet: "Islam dibangun di atas lima perkara: bersaksi tidak ada tuhan selain Allah dan Muhammad utusan Allah, shalat, zakat, haji, dan puasa.",
    narrator: "Abdullah bin Umar radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 8, Muslim no. 16",
    category: "Ibadah",
    grade: "Shahih Muttafaq 'Alaih",
    note: "Fondasi rukun Islam yang mengikat ibadah zahir dan batin seorang Muslim.",
  },
  {
    id: "hadits-4",
    number: 8,
    bookSlug: "bukhari",
    bookName: "Shahih Bukhari",
    arab: "الْإِيمَانُ بِضْعٌ وَسِتُّونَ شُعْبَةً وَالْحَيَاءُ شُعْبَةٌ مِنْ الْإِيمَانِ",
    text: "Iman memiliki lebih dari enam puluh cabang, dan rasa malu adalah salah satu cabang dari iman.",
    matanSnippet: "Iman memiliki lebih dari enam puluh cabang, dan malu adalah bagian dari iman.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 9, Muslim no. 35",
    category: "Akhlak",
    grade: "Shahih Muttafaq 'Alaih",
    note: "Rasa malu menjaga seorang mukmin dari kemaksiatan dan mendorong kemuliaan budi pekerti.",
  },
  {
    id: "hadits-5",
    number: 2699,
    bookSlug: "muslim",
    bookName: "Shahih Muslim",
    arab: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    text: "Barangsiapa yang menempuh jalan untuk menuntut ilmu, niscaya Allah akan memudahkan baginya jalan menuju surga.",
    matanSnippet: "Barangsiapa menempuh suatu jalan untuk mencari ilmu, Allah mudahkan baginya jalan ke surga.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Muslim no. 2699",
    category: "Ilmu",
    grade: "Shahih Muslim",
    note: "Keutamaan agung bagi para penuntut ilmu syar'i dan kebaikan dunia-akhirat.",
  },
  {
    id: "hadits-6",
    number: 3461,
    bookSlug: "bukhari",
    bookName: "Shahih Bukhari",
    arab: "بَلِّغُوا عَنِّي وَلَوْ آيَةً",
    text: "Sampaikanlah dariku walau hanya satu ayat.",
    matanSnippet: "Sampaikanlah dariku walau hanya satu ayat.",
    narrator: "Abdullah bin Amr radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 3461",
    category: "Ilmu",
    grade: "Shahih Bukhari",
    note: "Kewajiban menyampaikan kebaikan dan dakwah Islam dengan amanah dan kejujuran ilmu.",
  },
  {
    id: "hadits-7",
    number: 1956,
    bookSlug: "tirmidzi",
    bookName: "Jami' At-Tirmidzi",
    arab: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    text: "Senyummu di hadapan saudaramu adalah sedekah bagimu.",
    matanSnippet: "Senyumanmu di depan saudaramu adalah sedekah.",
    narrator: "Abu Dzar Al-Ghifari radhiyallahu 'anhu",
    source: "HR. At-Tirmidzi no. 1956",
    category: "Akhlak",
    grade: "Shahih menurut At-Tirmidzi",
    note: "Kebaikan akhlak yang mudah diamalkan bernilai pahala sedekah di sisi Allah.",
  },
  {
    id: "hadits-8",
    number: 2079,
    bookSlug: "bukhari",
    bookName: "Shahih Bukhari",
    arab: "الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا فَإِنْ صَدَقَا وَبَيَّنَا بُورِكَ لَهُمَا فِي بَيْعِهِمَا وَإِنْ كَتَمَا وَكَذَبَا مُحِقَتْ بَرَكَةُ بَيْعِهِمَا",
    text: "Penjual dan pembeli memiliki hak khiyar (memilih melanjutkan atau membatalkan) selama belum berpisah. Jika keduanya jujur dan menjelaskan kondisi barang, maka jual beli keduanya diberkahi. Namun jika keduanya menyembunyikan cacat dan berdusta, maka dihapuskanlah keberkahan jual beli mereka.",
    matanSnippet: "Jika penjual dan pembeli jujur dan transparan, diberkahi jual beli mereka; jika berdusta dan menyembunyikan cacat, dicabut keberkahannya.",
    narrator: "Hakim bin Hizam radhiyallahu 'anhu",
    source: "HR. Bukhari no. 2079, Muslim no. 1532",
    category: "Muamalah",
    grade: "Shahih Muttafaq 'Alaih",
    note: "Prinsip kejujuran dan transparansi dalam akad perdagangan Islam untuk meraih berkah.",
  },
];

/** Cache in-memory per-key agar navigasi terasa instan */
const memoryCache = new Map<string, Promise<unknown>>();

function cachedFetch<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const existing = memoryCache.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = loader().catch((err: unknown) => {
    memoryCache.delete(key);
    throw err;
  });
  memoryCache.set(key, promise);
  return promise;
}

/** Format satu hadits dari raw response API */
export function formatRawHadits(
  raw: { number: number; arab: string; id: string },
  bookSlug: string
): HaditsItem {
  const book = getBookBySlug(bookSlug);
  const narrator = extractSahabatNarrator(raw.id, book.author);
  const category = classifyHadits(raw.id);
  const matanSnippet = extractMatanSnippet(raw.id);

  return {
    id: `hadits-${book.slug}-${raw.number}`,
    number: raw.number,
    bookSlug: book.slug,
    bookName: book.name,
    arab: (raw.arab ?? "").trim(),
    text: (raw.id ?? "").trim(),
    matanSnippet,
    narrator,
    source: `HR. ${book.shortName} no. ${raw.number}`,
    category,
    grade: book.grade,
  };
}

/**
 * Mengambil daftar hadits terpaginasi dari API Hadits.
 * Menggunakan internal proxy `/api/hadits` di browser untuk kestabilan,
 * atau langsung ke base URL bila dijalankan di server.
 */
export async function fetchHaditsList(options: {
  bookSlug?: string;
  page?: number;
  limit?: number;
  category?: string | null;
  search?: string;
}): Promise<HaditsListResponse> {
  const bookSlug = options.bookSlug || "arbain-nawawi";
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 20));
  const category = options.category || null;
  const search = options.search?.trim().toLowerCase() || "";

  const cacheKey = `list-${bookSlug}-${page}-${limit}-${category || "all"}-${search}`;

  return cachedFetch(cacheKey, async () => {
    const book = getBookBySlug(bookSlug);

    // Kasus khusus koleksi 42 Hadits Arba'in An-Nawawi
    if (bookSlug === "arbain-nawawi" || bookSlug === "arbain") {
      const filtered = search
        ? searchArbainHadits(search, category)
        : category && category !== "Semua"
        ? arbainHaditsList.filter(
            (h) => h.category.toLowerCase() === category.toLowerCase()
          )
        : [...arbainHaditsList];

      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / limit));
      const safePage = Math.min(page, totalPages);
      const startIndex = (safePage - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      return {
        book,
        items: paginated,
        pagination: {
          totalItems,
          currentPage: safePage,
          pageSize: limit,
          totalPages,
          startPage: 1,
          endPage: totalPages,
        },
      };
    }

    // Endpoint internal Next.js atau direct endpoint untuk kitab lain
    const isBrowser = typeof window !== "undefined";
    const requestUrl = isBrowser
      ? `/api/hadits?book=${bookSlug}&page=${page}&limit=${limit}${
          category ? `&category=${encodeURIComponent(category)}` : ""
        }${search ? `&search=${encodeURIComponent(search)}` : ""}`
      : `${getHaditsApiBaseUrl()}/hadith/${bookSlug}?page=${page}&limit=${limit}`;

    try {
      const response = await fetch(requestUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat hadits dari server (status ${response.status})`);
      }

      const json = await response.json();

      // Bila respons dari Next.js route `/api/hadits`
      if (json && json.items && json.pagination) {
        return json as HaditsListResponse;
      }

      // Bila respons langsung dari hadis-api-id.vercel.app
      if (json && Array.isArray(json.items)) {
        let items: HaditsItem[] = json.items.map((raw: { number: number; arab: string; id: string }) =>
          formatRawHadits(raw, bookSlug)
        );

        if (category && category !== "Semua") {
          items = items.filter((h) => h.category === category);
        }

        if (search) {
          items = items.filter(
            (h) =>
              h.text.toLowerCase().includes(search) ||
              h.narrator.toLowerCase().includes(search) ||
              h.source.toLowerCase().includes(search) ||
              String(h.number).includes(search)
          );
        }

        return {
          book,
          items,
          pagination: {
            totalItems: json.pagination?.totalItems ?? book.total,
            currentPage: json.pagination?.currentPage ?? page,
            pageSize: json.pagination?.pageSize ?? limit,
            totalPages: json.pagination?.totalPages ?? Math.ceil(book.total / limit),
            startPage: json.pagination?.startPage ?? 1,
            endPage: json.pagination?.endPage ?? 10,
          },
        };
      }

      throw new Error("Format respons API hadits tidak sesuai");
    } catch (err: unknown) {
      console.warn("API Hadits tidak dapat dijangkau, menggunakan fallback data otentik:", err);

      // Gunakan fallback verified hadits
      let fallbackItems = VERIFIED_FALLBACK_HADITS;
      if (bookSlug && bookSlug !== "all") {
        const filteredByBook = fallbackItems.filter((h) => h.bookSlug === bookSlug);
        if (filteredByBook.length > 0) fallbackItems = filteredByBook;
      }
      if (category && category !== "Semua") {
        fallbackItems = fallbackItems.filter((h) => h.category === category);
      }
      if (search) {
        fallbackItems = fallbackItems.filter(
          (h) =>
            h.text.toLowerCase().includes(search) ||
            h.narrator.toLowerCase().includes(search) ||
            h.source.toLowerCase().includes(search)
        );
      }

      return {
        book,
        items: fallbackItems,
        pagination: {
          totalItems: fallbackItems.length,
          currentPage: 1,
          pageSize: limit,
          totalPages: 1,
        },
        isFallback: true,
        message: "Menampilkan hadits cadangan terverifikasi (koneksi ke server API hadits sedang mengalami kendala).",
      };
    }
  });
}

/** Mengambil detail satu hadits spesifik berdasarkan kitab dan nomor */
export async function fetchHaditsDetail(
  bookSlug: string,
  hadithNumber: number
): Promise<HaditsItem | null> {
  const cacheKey = `detail-${bookSlug}-${hadithNumber}`;

  return cachedFetch(cacheKey, async () => {
    // Jika dari koleksi Arba'in An-Nawawi (1-42)
    if (bookSlug === "arbain-nawawi" || bookSlug === "arbain") {
      const match = getArbainHaditsByNumber(hadithNumber);
      if (match) return match;
    }

    const fallbackMatch = VERIFIED_FALLBACK_HADITS.find(
      (h) => h.bookSlug === bookSlug && h.number === hadithNumber
    );
    if (fallbackMatch) return fallbackMatch;

    const isBrowser = typeof window !== "undefined";
    const requestUrl = isBrowser
      ? `/api/hadits?book=${bookSlug}&number=${hadithNumber}`
      : `${getHaditsApiBaseUrl()}/hadith/${bookSlug}/${hadithNumber}`;

    try {
      const response = await fetch(requestUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) return null;
      const json = await response.json();

      // Jika dari Next.js proxy yang sudah memformat
      if (json && json.item) {
        return json.item as HaditsItem;
      }

      // Jika langsung dari hadis-api-id
      if (json && json.arab && json.id) {
        return formatRawHadits(
          {
            number: json.number ?? hadithNumber,
            arab: json.arab,
            id: json.id,
          },
          bookSlug
        );
      }

      return null;
    } catch {
      return fallbackMatch ?? null;
    }
  });
}
