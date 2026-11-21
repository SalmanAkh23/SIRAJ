import { NextRequest, NextResponse } from "next/server";
import { evaluateVerseRecitation } from "@/lib/murajaah-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      verseKey,
      verseNumber,
      chapterId,
      targetArabic,
      targetTranslation,
      spokenArabic,
    } = body;

    if (!targetArabic || typeof targetArabic !== "string") {
      return NextResponse.json(
        { error: "Teks ayat target (targetArabic) harus disertakan." },
        { status: 400 }
      );
    }

    const evaluation = evaluateVerseRecitation({
      verseKey: String(verseKey || ""),
      verseNumber: Number(verseNumber) || 1,
      chapterId: Number(chapterId) || 1,
      targetArabic: String(targetArabic),
      targetTranslation: String(targetTranslation || ""),
      spokenArabic: typeof spokenArabic === "string" ? spokenArabic : "",
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("[api/murajaah/evaluate] Gagal mengevaluasi bacaan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada evaluasi AI murajaah." },
      { status: 500 }
    );
  }
}

