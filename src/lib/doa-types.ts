"use strict";

/**
 * Tipe data untuk integrasi Doa & Dzikir — Ahmad Sanusi Open API.
 *
 * Sumber data: https://api.ahmadsanusi.com/docs
 *   - GET /v1/doa/kategori
 *   - GET /v1/doa/kategori/{slug}
 *   - GET /v1/doa/search
 *   - GET /v1/doa/{doa_id}
 *i
 * Karena dokumentasi OpenAPI tidak menerangkan bentuk detail field
 * (hanya { status, data }), kita kenakan normalisasi di doa-endpoints.ts
 * agar halaman React selalu menerima bentuk yang rapi dan konsisten.
 */

export type AmalanType = "doa" | "dzikir";

/** Satu doa/dzikir dalam bentuk rapi yang dipakai halaman React. */
export interface DoaItem {
  id: number | string;
  title: string;
  /** Teks Arab. */
  arabic: string;
  /** Transliterasi Latin. */
  latin: string;
  /** Terjemahan Bahasa Indonesia. */
  translation: string;
  /** Referensi / sumber (mis. "HR. Bukhari no. 6312"). */
  source: string;
  /** Nama kategori (label). */
  category: string;
  /** Slug kategori (mis. "doa-harian"). */
  slug: string;
  /** Jenis amalan: doa atau dzikir. */
  type: AmalanType;
  /** Jumlah pengulangan jika memiliki dasar (mis. "Dibaca 1x", "Dibaca 3x"). */
  repetition?: string;
  /** Faedah / keutamaan dalil (jika tersedia). */
  fawaid?: string;
  /** Nomor urut jika tersedia dari API. */
  order?: number;
}

/** Satu kategori doa/dzikir. */
export interface DoaCategory {
  slug: string;
  name: string;
  doa_count: number;
}

/** Metadata paginasi (opsional dari API). */
export interface DoaMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/** Bentuk umum respons API Ahmad Sanusi: { status, data }. */
export interface ApiEnvelope<T> {
  status: "success" | "error" | string;
  data: T;
  meta?: DoaMeta;
  message?: string;
  detail?: string;
}

/** Kode error yang bisa dikirim route lokal ke halaman React. */
export type DoaErrorCode =
  | "API_KEY_MISSING"
  | "API_KEY_INVALID"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "NETWORK"
  | "UNKNOWN";

/** Bentuk respons error dari route lokal /api/doa/*. */
export interface DoaErrorResponse {
  status: "error";
  code: DoaErrorCode;
  message: string;
}

/** Bentuk respons sukses dari route lokal /api/doa/*. */
export interface DoaListResponse {
  status: "success";
  data: DoaItem[];
  meta?: DoaMeta;
}

export interface DoaCategoryListResponse {
  status: "success";
  data: DoaCategory[];
}

// ---------------------------------------------------------------------------
// Tipe mentah (raw) — hanya dipakai di dalam doa-endpoints.ts.
// Field dibuat opsional karena bentuk pasti dari API tidak dipublikasikan.
// ---------------------------------------------------------------------------
export interface DoaRawItem {
  id?: number | string;
  doa_id?: number | string;
  title?: string;
  judul?: string;
  name?: string;

  arabic?: string;
  arab?: string;
  teks_arab?: string;
  text?: string;
  text_arab?: string;

  latin?: string;
  transliterasi?: string;
  transliteration?: string;
  latin_text?: string;

  translation?: string;
  terjemahan?: string;
  terjemah?: string;
  arti?: string;
  meaning?: string;
  translation_id?: string;

  source?: string;
  reference?: string;
  dalil?: string;
  sumber?: string;

  category?: string;
  kategori?: string;
  category_name?: string;
  slug?: string;
  category_slug?: string;
  kategori_id?: number;
  type?: string;
  group_name?: string;

  catatan?: string;
  repetition?: string;
  fawaid?: string;
  urutan?: number;

  [key: string]: unknown;
}

export interface DoaCategoryRawItem {
  slug?: string;
  id?: string;
  name?: string;
  nama?: string;
  label?: string;
  title?: string;
  doa_count?: number;
  count?: number;
  total?: number;
  jumlah?: number;
  [key: string]: unknown;
}
