"use strict";

export const AHMAD_SANUSI_BASE_URL = "https://api.ahmadsanusi.com";
export const AHMAD_SANUSI_API_KEY_HEADER = "x-api-key";

/**
 * Daftar slug kategori doa / dzikir yang didukung API.
 * Nama-nama ini diambil dari dokumentasi:
 * https://api.ahmadsanusi.com/docs (OpenAPI, path /v1/doa/kategori)
 */
export const DOA_CATEGORIES = [
  { slug: "doa-harian", label: "Doa Harian" },
  { slug: "dzikir-pagi", label: "Dzikir Pagi" },
  { slug: "dzikir-petang", label: "Dzikir Petang" },
  { slug: "dzikir-setelah-shalat", label: "Dzikir Setelah Salat" },
  { slug: "doa-pilihan", label: "Doa Pilihan" },
] as const;

export type DoaCategorySlug = (typeof DOA_CATEGORIES)[number]["slug"];
