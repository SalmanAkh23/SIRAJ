import { NextRequest, NextResponse } from "next/server";

import { fetchDoaByCategory } from "@/lib/doa-endpoints";
import { doaErrorResponse } from "@/lib/doa-route-helper";
import { DOA_CATEGORIES } from "@/lib/doa-config";
import type { DoaItem } from "@/lib/doa-types";

/**
 * GET /api/doa/all?limitPerCategory=20
 *
 * Menggabungkan doa dari semua kategori (Doa Harian, Dzikir Pagi,
 * Dzikir Petang, Dzikir Setelah Salat, Doa Pilihan) untuk tab "Semua".
 *
 * Setiap kategori diambil paralel. Jika ada kategori yang gagal,
 * kita lewati agar seluruh halaman tidak ikut gagal.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type"); // "doa" | "dzikir" | null
  const limitPerCategory = Math.min(
    100,
    Math.max(
      1,
      Number(url.searchParams.get("limitPerCategory") ?? "50") || 50
    )
  );

  const targetCategories =
    typeParam === "doa"
      ? DOA_CATEGORIES.filter((c) => !c.slug.startsWith("dzikir"))
      : typeParam === "dzikir"
        ? DOA_CATEGORIES.filter((c) => c.slug.startsWith("dzikir"))
        : DOA_CATEGORIES;

  try {
    const results = await Promise.allSettled(
      targetCategories.map((c) =>
        fetchDoaByCategory(c.slug, 1, limitPerCategory)
      )
    );

    const seen = new Set<string>();
    const combined: DoaItem[] = [];

    results.forEach((result, index) => {
      if (result.status !== "fulfilled") return;
      const slug = targetCategories[index].slug;
      for (const item of result.value.data) {
        const key = item.id !== "" ? String(item.id) : `${slug}-${item.title}`;
        if (seen.has(key)) continue;
        seen.add(key);
        combined.push({ ...item, slug: item.slug || slug });
      }
    });

    // Jika semua kategori gagal, lempar error pertama agar pesannya jelas.
    if (combined.length === 0) {
      const firstError = results.find((r) => r.status === "rejected");
      if (firstError && firstError.status === "rejected") {
        throw firstError.reason;
      }
    }

    return NextResponse.json({ status: "success", data: combined });
  } catch (err) {
    return doaErrorResponse(err);
  }
}
