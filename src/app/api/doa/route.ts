import { NextResponse } from "next/server";

/**
 * GET /api/doa
 *
 * Route induk. Halaman Doa & Dzikir memakai route turunan:
 *   - /api/doa/categories         → daftar kategori
 *   - /api/doa/category?slug=...  → doa per kategori
 *   - /api/doa/search?q=...       → pencarian
 *   - /api/doa/[id]               → detail satu doa
 *
 * Route ini hanya memberi tahu cara pemakaiannya.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "success",
    message:
      "Gunakan /api/doa/categories, /api/doa/category?slug=..., /api/doa/search?q=..., atau /api/doa/{id}.",
    endpoints: [
      "/api/doa/categories",
      "/api/doa/category?slug=doa-harian",
      "/api/doa/search?q=tidur",
      "/api/doa/1",
    ],
  });
}
