import { NextResponse } from "next/server";

import { fetchDoaCategories } from "@/lib/doa-endpoints";
import { doaErrorResponse } from "@/lib/doa-route-helper";

/**
 * GET /api/doa/categories
 *
 * Mengambil daftar kategori doa/dzikir dari Ahmad Sanusi Open API.
 * API Key dibaca di server (process.env), tidak pernah dikirim ke browser.
 *
 * Respons sukses:
 * { "status": "success", "data": [ { "slug": "doa-harian", "name": "Doa Harian", "doa_count": 239 }, ... ] }
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchDoaCategories();
    return NextResponse.json({ status: "success", data });
  } catch (err) {
    return doaErrorResponse(err);
  }
}
