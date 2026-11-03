import { NextRequest, NextResponse } from "next/server";
import {
  arbainHaditsList,
  getArbainHaditsByNumber,
  searchArbainHadits,
  ARBAIN_METADATA,
  type ArbainHadits,
} from "@/data/arbain-nawawi";
import {
  getBookBySlug,
  formatRawHadits,
  getHaditsApiBaseUrl,
  VERIFIED_FALLBACK_HADITS,
  type HaditsItem,
} from "@/lib/hadits-api";

export const dynamic = "force-dynamic";

/**
 * GET /api/hadits
 *
 * Mengembalikan data Hadits Arba'in An-Nawawi (hadits nomor 1 sampai 42)
 * dengan teks Arab lengkap, terjemahan Indonesia, perawi sahabat, rujukan kitab asal,
 * nomor hadits asli, derajat verifikasi, dan faedah pokok.
 *
 * Query params:
 * - book     : "arbain-nawawi" (default) atau slug kitab induk (bukhari, muslim, dll).
 * - number   : nomor hadits tertentu untuk mengambil detail tunggal (1-42).
 * - category : filter kategori ("Iman" | "Ibadah" | "Akhlak" | "Ilmu" | "Muamalah").
 * - search   : kata kunci pencarian teks judul, tema, terjemah, perawi, sumber, atau nomor.
 * - page     : nomor halaman (default 1).
 * - limit    : jumlah data per halaman (default 20, maksimum 50).
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const rawBookSlug = (url.searchParams.get("book") || "arbain-nawawi").toLowerCase().trim();
  const hadithNumber = url.searchParams.get("number");
  const category = url.searchParams.get("category")?.trim();
  const search = url.searchParams.get("search")?.toLowerCase().trim() || "";
  const page = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "20") || 20));

  const isArbain =
    rawBookSlug === "arbain" ||
    rawBookSlug === "arbain-nawawi" ||
    rawBookSlug === "arba'in" ||
    rawBookSlug === "all" ||
    !rawBookSlug;

  // =========================================================================
  // 1. DETAIL SATU HADITS (Query param: ?number=X)
  // =========================================================================
  if (hadithNumber) {
    const num = parseInt(hadithNumber, 10);
    if (isNaN(num) || num < 1) {
      return NextResponse.json(
        { status: "error", message: "Nomor hadits harus berupa angka positif." },
        { status: 400 }
      );
    }

    // Jika koleksi Arba'in An-Nawawi (1-42)
    if (isArbain) {
      const arbainMatch = getArbainHaditsByNumber(num);
      if (arbainMatch) {
        return NextResponse.json({
          status: "success",
          item: arbainMatch,
          metadata: ARBAIN_METADATA,
        });
      }

      return NextResponse.json(
        {
          status: "error",
          message: `Hadits Arba'in An-Nawawi nomor ${num} tidak ditemukan (koleksi terdiri dari nomor 1 sampai 42).`,
        },
        { status: 404 }
      );
    }

    // Jika kitab induk lain diminta secara spesifik
    const book = getBookBySlug(rawBookSlug);
    const baseUrl = getHaditsApiBaseUrl();

    try {
      const remoteRes = await fetch(`${baseUrl}/hadith/${rawBookSlug}/${num}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(6000),
      });

      if (remoteRes.ok) {
        const raw = await remoteRes.json();
        if (raw && raw.arab && raw.id) {
          const item = formatRawHadits(
            { number: raw.number ?? num, arab: raw.arab, id: raw.id },
            rawBookSlug
          );
          return NextResponse.json({ status: "success", item });
        }
      }
    } catch {
      // Abaikan error upstream dan gunakan fallback
    }

    const fallbackMatch = VERIFIED_FALLBACK_HADITS.find(
      (h) => h.bookSlug === rawBookSlug && h.number === num
    );
    if (fallbackMatch) {
      return NextResponse.json({
        status: "success",
        item: fallbackMatch,
        isFallback: true,
      });
    }

    return NextResponse.json(
      { status: "error", message: `Hadits ${book.name} nomor ${num} tidak ditemukan.` },
      { status: 404 }
    );
  }

  // =========================================================================
  // 2. DAFTAR 42 HADITS ARBA'IN AN-NAWAWI (Default)
  // =========================================================================
  if (isArbain) {
    const items: ArbainHadits[] = search
      ? searchArbainHadits(search, category)
      : category && category !== "Semua"
      ? arbainHaditsList.filter(
          (h) => h.category.toLowerCase() === category.toLowerCase()
        )
      : [...arbainHaditsList];

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      status: "success",
      book: {
        slug: "arbain-nawawi",
        name: "Arba'in An-Nawawi",
        shortName: "Arba'in",
        total: 42,
        author: ARBAIN_METADATA.author,
        grade: "Shahih & Hasan Terverifikasi",
        description: ARBAIN_METADATA.description,
      },
      metadata: ARBAIN_METADATA,
      items: paginatedItems,
      pagination: {
        totalItems,
        currentPage: safePage,
        pageSize: limit,
        totalPages,
        startPage: 1,
        endPage: totalPages,
      },
    });
  }

  // =========================================================================
  // 3. DAFTAR HADITS DARI KITAB LAIN JIKA DIMINTA SECARA EKSPLISIT
  // =========================================================================
  const book = getBookBySlug(rawBookSlug);
  const baseUrl = getHaditsApiBaseUrl();

  try {
    const remoteRes = await fetch(
      `${baseUrl}/hadith/${rawBookSlug}?page=${page}&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(6500),
      }
    );

    if (remoteRes.ok) {
      const data = await remoteRes.json();
      if (data && Array.isArray(data.items)) {
        let items: HaditsItem[] = data.items.map(
          (raw: { number: number; arab: string; id: string }) =>
            formatRawHadits(raw, rawBookSlug)
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

        return NextResponse.json({
          status: "success",
          book,
          items,
          pagination: {
            totalItems: data.pagination?.totalItems ?? book.total,
            currentPage: data.pagination?.currentPage ?? page,
            pageSize: data.pagination?.pageSize ?? limit,
            totalPages: data.pagination?.totalPages ?? Math.ceil(book.total / limit),
            startPage: data.pagination?.startPage ?? 1,
            endPage: data.pagination?.endPage ?? 10,
          },
        });
      }
    }
  } catch {
    // Abaikan error upstream dan gunakan fallback
  }

  // Fallback lokal
  let fallbackList = VERIFIED_FALLBACK_HADITS.filter(
    (h) => h.bookSlug === rawBookSlug
  );
  if (fallbackList.length === 0) fallbackList = VERIFIED_FALLBACK_HADITS;
  if (category && category !== "Semua") {
    fallbackList = fallbackList.filter((h) => h.category === category);
  }
  if (search) {
    fallbackList = fallbackList.filter(
      (h) =>
        h.text.toLowerCase().includes(search) ||
        h.narrator.toLowerCase().includes(search) ||
        h.source.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    status: "success",
    book,
    items: fallbackList,
    pagination: {
      totalItems: fallbackList.length,
      currentPage: 1,
      pageSize: limit,
      totalPages: 1,
    },
    isFallback: true,
  });
}
