import { NextRequest, NextResponse } from "next/server";

import { fetchDoaByCategory } from "@/lib/doa-endpoints";
import { doaErrorResponse } from "@/lib/doa-route-helper";

/**
 * GET /api/doa/category?slug=doa-harian&page=1&limit=50
 *
 * Mengambil daftar doa/dzikir dalam satu kategori dari Ahmad Sanusi Open API.
 * API Key dibaca di server (process.env), tidak pernah dikirim ke browser.
 *
 * Parameter:
 * - slug  : wajib (doa-harian, dzikir-pagi, dzikir-petang,
 *            dzikir-setelah-shalat, doa-pilihan)
 * - page  : opsional, minimal 1, default 1
 * - limit : opsional, 1..100, default 50
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const slug = url.searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json(
      { status: "error", code: "UNKNOWN", message: "Parameter 'slug' wajib diisi." },
      { status: 400 }
    );
  }

  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") ?? "50") || 50)
  );

  try {
    const { data, meta } = await fetchDoaByCategory(slug, page, limit);
    return NextResponse.json({ status: "success", data, meta });
  } catch (err) {
    return doaErrorResponse(err);
  }
}
