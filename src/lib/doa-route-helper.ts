import { NextResponse } from "next/server";

import { DoaApiError } from "@/lib/doa-endpoints";
import type { DoaErrorCode } from "@/lib/doa-types";

/**
 * Helper bersama untuk route handler Doa & Dzikir.
 *
 * Mengubah DoaApiError menjadi respons JSON yang konsisten + kode error,
 * sehingga halaman React bisa mengenali masalahnya (mis. "API Key belum
 * diatur") dan menampilkan panduan yang tepat.
 */

const STATUS_FOR_CODE: Record<DoaErrorCode, number> = {
  API_KEY_MISSING: 503,
  API_KEY_INVALID: 502,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  NETWORK: 502,
  UNKNOWN: 500,
};

export function doaErrorResponse(err: unknown): NextResponse {
  let code: DoaErrorCode = "UNKNOWN";
  let message = "Terjadi kesalahan saat mengambil data doa.";

  if (err instanceof DoaApiError) {
    code = err.code;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Log di server saja untuk membantu debugging.
  console.error("[api/doa] error:", code, message, err);

  return NextResponse.json(
    { status: "error", code, message },
    { status: STATUS_FOR_CODE[code] ?? 500 }
  );
}
