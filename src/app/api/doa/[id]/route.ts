import { NextRequest, NextResponse } from "next/server";

import { fetchSingleDoa } from "@/lib/doa-endpoints";
import { doaErrorResponse } from "@/lib/doa-route-helper";

/**
 * GET /api/doa/[id]
 *
 * Mengambil satu doa/dzikir berdasarkan ID dari Ahmad Sanusi Open API.
 * API Key dibaca di server (process.env), tidak pernah dikirim ke browser.
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!idParam || !Number.isInteger(id) || id < 1) {
    return NextResponse.json(
      { status: "error", code: "UNKNOWN", message: "'id' harus berupa angka >= 1." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchSingleDoa(id);
    return NextResponse.json({ status: "success", data });
  } catch (err) {
    return doaErrorResponse(err);
  }
}
