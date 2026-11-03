"use strict";

/**
 * Lapisan akses data Doa & Dzikir — Ahmad Sanusi Open API.
 *
 * Semua fungsi di sini HANYA dipanggil dari sisi server (Route Handler
 * Next.js). API Key diambil dari environment variable server sehingga
 * tidak pernah sampai ke browser.
 *
 * Dokumentasi: https://api.ahmadsanusi.com/docs
 * Header autentikasi: X-API-Key: ask_xxxxxxxx
 */

import {
  AHMAD_SANUSI_BASE_URL,
  AHMAD_SANUSI_API_KEY_HEADER,
} from "./doa-config";
import type {
  ApiEnvelope,
  DoaCategory,
  DoaCategoryRawItem,
  DoaItem,
  DoaMeta,
  DoaRawItem,
  AmalanType,
} from "./doa-types";

export type {
  DoaCategory,
  DoaItem,
  DoaMeta,
  DoaCategoryListResponse,
  DoaListResponse,
  DoaErrorResponse,
  DoaErrorCode,
} from "./doa-types";

/** Error khusus agar route handler bisa mengirim kode error yang tepat. */
export class DoaApiError extends Error {
  readonly code:
    | "API_KEY_MISSING"
    | "API_KEY_INVALID"
    | "RATE_LIMITED"
    | "NOT_FOUND"
    | "NETWORK"
    | "UNKNOWN";

  constructor(
    message: string,
    code: DoaApiError["code"] = "UNKNOWN"
  ) {
    super(message);
    this.name = "DoaApiError";
    this.code = code;
  }
}

/** Ambil API Key dari environment variable server. */
function getApiKey(): string {
  return (process.env.AHMAD_SANUSI_API_KEY ?? "").trim();
}

let warnedMissingKey = false;

/**
 * Cek API Key sekali di sisi server. Jika kosong, kirim peringatan sekali
 * (agar tidak memenuhi log saat build) dan lempar error bertipe khusus.
 */
function assertApiKey(): string {
  const key = getApiKey();
  if (!key) {
    if (!warnedMissingKey && process.env.NODE_ENV !== "production") {
      warnedMissingKey = true;
      console.warn(
        "[siraj] AHMAD_SANUSI_API_KEY belum diisi. Halaman Doa & Dzikir " +
          "tidak akan bisa memuat data sampai Anda menambahkannya ke file " +
          ".env.local (lihat .env.example)."
      );
    }
    throw new DoaApiError(
      "API Key belum diatur di server. Tambahkan AHMAD_SANUSI_API_KEY ke file .env.local.",
      "API_KEY_MISSING"
    );
  }
  return key;
}

/** Terjemahkan status HTTP menjadi kode error yang ramah. */
function codeForStatus(status: number): DoaApiError["code"] {
  if (status === 401 || status === 403) return "API_KEY_INVALID";
  if (status === 429) return "RATE_LIMITED";
  if (status === 404) return "NOT_FOUND";
  return "UNKNOWN";
}

/**
 * FETCH dasar ke API Ahmad Sanusi.
 * - Menyisipkan header X-API-Key.
 * - Melempar DoaApiError dengan kode yang benar agar bisa ditangani route.
 */
async function apiFetch(path: string): Promise<unknown> {
  const key = assertApiKey();

  const url = `${AHMAD_SANUSI_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        [AHMAD_SANUSI_API_KEY_HEADER]: key,
      },
      // Data doa/dzikir statis, aman di-cache sebentar agar hemat kuota.
      next: { revalidate: 300 },
    });
  } catch (err) {
    throw new DoaApiError(
      "Tidak dapat terhubung ke server Ahmad Sanusi Open API. Periksa koneksi internet lalu coba lagi.",
      "NETWORK"
    );
  }

  if (!response.ok) {
    // Coba baca pesan detail dari body respons.
    let detail = "";
    try {
      const body = (await response.json()) as {
        detail?: unknown;
        message?: unknown;
      };
      if (typeof body?.detail === "string") detail = body.detail;
      else if (typeof body?.message === "string") detail = body.message;
    } catch {
      // body bukan JSON — abaikan
    }

    const code = codeForStatus(response.status);
    const fallback =
      code === "API_KEY_INVALID"
        ? "API Key tidak valid atau sudah dinonaktifkan."
        : code === "RATE_LIMITED"
          ? "Terlalu banyak permintaan. Coba lagi nanti."
          : code === "NOT_FOUND"
            ? "Data tidak ditemukan di server API."
            : `Gagal mengambil data (HTTP ${response.status}).`;

    throw new DoaApiError(detail || fallback, code);
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new DoaApiError(
      "Respons server API tidak berupa JSON yang valid.",
      "UNKNOWN"
    );
  }
}

// ---------------------------------------------------------------------------
// Normalisasi — API tidak mempublikasikan bentuk field secara detail,
// jadi kita terima beberapa kemungkinan penamaan dengan aman.
// ---------------------------------------------------------------------------
function str(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

/** Ambil nilai string dari salah satu kunci kandidat. */
function pickStr(
  obj: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const v = str(obj[key]);
    if (v) return v;
  }
  return "";
}

/** Peta kategori ID API Ahmad Sanusi untuk fallback pelengkap */
const CATEGORY_MAP_BY_ID: Record<number, { slug: string; name: string; type: AmalanType }> = {
  1: { slug: "doa-harian", name: "Doa Harian", type: "doa" },
  2: { slug: "dzikir-pagi", name: "Dzikir Pagi", type: "dzikir" },
  3: { slug: "dzikir-petang", name: "Dzikir Petang", type: "dzikir" },
  4: { slug: "dzikir-setelah-shalat", name: "Dzikir Setelah Salat", type: "dzikir" },
  5: { slug: "doa-pilihan", name: "Doa Pilihan", type: "doa" },
};

/** Ubah satu item mentah menjadi DoaItem yang rapi. */
export function normalizeDoa(
  raw: DoaRawItem,
  fallbackMeta?: { slug?: string; category?: string; type?: AmalanType }
): DoaItem {
  const obj = raw as Record<string, unknown>;

  const idRaw = obj.id ?? obj.doa_id;
  const id: number | string =
    typeof idRaw === "number"
      ? idRaw
      : typeof idRaw === "string" && idRaw.trim()
        ? idRaw.trim()
        : "";

  const katId = Number(obj.kategori_id);
  const mapped = !Number.isNaN(katId) ? CATEGORY_MAP_BY_ID[katId] : undefined;

  const slug =
    pickStr(obj, ["slug", "category_slug"]) ||
    fallbackMeta?.slug ||
    mapped?.slug ||
    "";

  const category =
    pickStr(obj, ["category", "kategori", "category_name"]) ||
    fallbackMeta?.category ||
    mapped?.name ||
    "";

  const explicitType = pickStr(obj, ["type", "group_name"]) as AmalanType | "";
  const detectedType: AmalanType =
    (explicitType === "doa" || explicitType === "dzikir" ? explicitType : undefined) ||
    fallbackMeta?.type ||
    mapped?.type ||
    (slug.includes("dzikir") ? "dzikir" : "doa");

  return {
    id,
    title: pickStr(obj, ["title", "judul", "name", "nama"]),
    arabic: pickStr(obj, ["arabic", "arab", "teks_arab", "text_arab", "text"]),
    latin: pickStr(obj, ["latin", "transliterasi", "transliteration", "latin_text"]),
    translation: pickStr(obj, [
      "translation",
      "terjemahan",
      "terjemah",
      "arti",
      "meaning",
      "translation_id",
    ]),
    source: pickStr(obj, ["source", "reference", "dalil", "sumber"]),
    category,
    slug,
    type: detectedType,
    repetition: pickStr(obj, ["repetition", "catatan", "ulangi", "jumlah"]),
    fawaid: pickStr(obj, ["fawaid", "keutamaan", "faedah"]),
    order:
      typeof obj.urutan === "number"
        ? obj.urutan
        : typeof obj.order === "number"
          ? obj.order
          : undefined,
  };
}

/** Ubah satu kategori mentah menjadi DoaCategory yang rapi. */
function normalizeCategory(raw: DoaCategoryRawItem): DoaCategory {
  const obj = raw as Record<string, unknown>;
  const countRaw = obj.doa_count ?? obj.count ?? obj.total ?? obj.jumlah;
  return {
    slug: pickStr(obj, ["slug", "id", "category_slug"]),
    name: pickStr(obj, ["name", "nama", "label", "title"]),
    doa_count: typeof countRaw === "number" ? countRaw : Number(countRaw) || 0,
  };
}

/** Normalisasi metadata paginasi (dengan nilai cadangan yang aman). */
function normalizeMeta(
  raw: unknown,
  fallbackTotal: number,
  perPage: number
): DoaMeta {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const num = (v: unknown, d: number): number =>
    typeof v === "number" && Number.isFinite(v) ? v : d;

  const total = num(obj.total, fallbackTotal);
  const page = num(obj.page, 1);
  const per_page = num(obj.per_page ?? obj.limit, perPage);
  const total_pages = num(
    obj.total_pages,
    Math.max(1, Math.ceil(total / Math.max(1, per_page)))
  );

  return { page, per_page, total, total_pages };
}

/**
 * Ambil array dari envelope API. Beberapa endpoint mengembalikan
 * data sebagai array langsung, ada juga yang membungkusnya lagi.
 */
function extractArray(payload: unknown): Record<string, unknown>[] {
  const env = payload as ApiEnvelope<unknown>;
  const data = env?.data;

  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const inner = data as Record<string, unknown>;
    for (const key of ["items", "doa", "data", "results", "list"]) {
      if (Array.isArray(inner[key])) {
        return inner[key] as Record<string, unknown>[];
      }
    }
    // Jika data adalah objek tunggal (bukan list), bungkus jadi array.
    return [inner];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Endpoint publik
// ---------------------------------------------------------------------------

/**
 * Daftar kategori doa/dzikir.
 * GET /v1/doa/kategori
 */
export async function fetchDoaCategories(): Promise<DoaCategory[]> {
  const payload = await apiFetch("/v1/doa/kategori");
  const items = extractArray(payload);
  return items
    .map((item) => normalizeCategory(item as DoaCategoryRawItem))
    .filter((c) => c.slug && c.name);
}

/**
 * Doa dalam satu kategori.
 * GET /v1/doa/kategori/{slug}?page=&limit=
 */
export async function fetchDoaByCategory(
  slug: string,
  page = 1,
  limit = 50
): Promise<{ data: DoaItem[]; meta: DoaMeta }> {
  const payload = await apiFetch(
    `/v1/doa/kategori/${encodeURIComponent(slug)}?page=${page}&limit=${limit}`
  );
  const items = extractArray(payload);
  const env = payload as ApiEnvelope<unknown>;
  const kat = (env?.data as Record<string, unknown>)?.kategori as
    | Record<string, unknown>
    | undefined;

  const katSlug = (kat?.slug as string) || slug;
  const katName = (kat?.nama as string) || (kat?.name as string) || "";
  const groupName = (kat?.group_name as string) || "";
  const fallbackType: AmalanType =
    groupName === "dzikir" || katSlug.includes("dzikir") ? "dzikir" : "doa";

  const data = items
    .map((item) =>
      normalizeDoa(item as DoaRawItem, {
        slug: katSlug,
        category: katName,
        type: fallbackType,
      })
    )
    .filter((d) => d.arabic || d.translation || d.title);

  const meta = normalizeMeta(env?.meta, data.length, limit);
  return { data, meta };
}

/**
 * Pencarian doa.
 * GET /v1/doa/search?q=&limit=
 */
export async function searchDoa(
  query: string,
  limit = 50
): Promise<{ data: DoaItem[]; meta: DoaMeta }> {
  const q = query.trim();
  if (q.length < 2) {
    throw new DoaApiError("Kata kunci minimal 2 karakter.", "UNKNOWN");
  }

  const payload = await apiFetch(
    `/v1/doa/search?q=${encodeURIComponent(q)}&limit=${limit}`
  );
  const items = extractArray(payload);
  const data = items
    .map((item) => normalizeDoa(item as DoaRawItem))
    .filter((d) => d.arabic || d.translation || d.title);

  const env = payload as ApiEnvelope<unknown>;
  const meta = normalizeMeta(env?.meta, data.length, limit);
  return { data, meta };
}

/**
 * Detail satu doa.
 * GET /v1/doa/{doa_id}
 */
export async function fetchSingleDoa(
  doaId: number
): Promise<DoaItem> {
  const payload = await apiFetch(`/v1/doa/${doaId}`);
  const env = payload as ApiEnvelope<unknown>;

  // Kadang data berupa objek tunggal, kadang array berisi satu item.
  if (Array.isArray(env?.data)) {
    const first = (env.data as Record<string, unknown>[])[0];
    return normalizeDoa((first ?? {}) as DoaRawItem);
  }
  return normalizeDoa((env?.data ?? {}) as DoaRawItem);
}
