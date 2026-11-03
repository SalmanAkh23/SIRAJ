"use strict";

import { DOA_CATEGORIES } from "./doa-config";

/**
 * Helper kecil untuk halaman Doa & Dzikir.
 * (Versi lama berisi logika cookie penghitung dzikir yang rusak —
 * sudah diganti dengan penyimpanan localStorage yang benar di halaman.)
 */

/** Hapus tag HTML dari teks (API terkadang mengirim teks ber-HTML). */
export function stripHtml(value: string): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .trim();
}

/** Nama kategori yang ramah dari slug (mis. "doa-harian" → "Doa Harian"). */
export function categoryLabelFromSlug(slug: string): string {
  const found = DOA_CATEGORIES.find((c) => c.slug === slug);
  return found ? found.label : slug;
}
