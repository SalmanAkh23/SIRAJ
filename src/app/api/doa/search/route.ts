import { NextRequest, NextResponse } from "next/server";

import { searchDoa } from "@/lib/doa-endpoints";
import { doaErrorResponse } from "@/lib/doa-route-helper";

/**
 * GET /api/doa/search?q=tidur&limit=20
 *
 * Mencari doa/dzikir berdasarkan kata kunci (judul atau terjemahan).
 * API Key dibaca di server (process.env), tidak pernah dikirim ke browser.
 *
 * Parameter:
 * - q     : wajib, minimal 2 karakter
 * - limit : opsional, 1..50, default 20
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const q = url.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json(
      { status: "error", code: "UNKNOWN", message: "Parameter 'q' wajib diisi." },
      { status: 400 }
    );
  }
  if (q.length < 2) {
    return NextResponse.json(
      { status: "error", code: "UNKNOWN", message: "Kata kunci minimal 2 karakter." },
      { status: 400 }
    );
  }

  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? "20") || 20));

  try {
    const { data, meta } = await searchDoa(q, limit);
    return NextResponse.json({ status: "success", data, meta });
  } catch (err) {
    return doaErrorResponse(err);
  }
}
