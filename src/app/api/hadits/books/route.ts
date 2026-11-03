import { NextResponse } from "next/server";
import { HADITS_BOOKS } from "@/lib/hadits-api";

export const dynamic = "force-dynamic";

/**
 * GET /api/hadits/books
 *
 * Mengembalikan daftar 9 Kitab Induk Hadits (Kutubut Tis'ah)
 * beserta metadata jumlah hadits, penulis, dan deskripsi ringkas.
 */
export async function GET() {
  return NextResponse.json({
    status: "success",
    data: HADITS_BOOKS,
  });
}
