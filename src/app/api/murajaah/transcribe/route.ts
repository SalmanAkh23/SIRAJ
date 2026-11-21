import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: "File audio tidak ditemukan dalam permintaan." },
        { status: 400 }
      );
    }

    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    // 1. Prioritaskan Groq Whisper jika tersedia (sangat cepat & hemat biaya)
    if (groqKey) {
      try {
        const groqBody = new FormData();
        groqBody.append("file", audioFile, "recitation.webm");
        groqBody.append("model", "whisper-large-v3-turbo");
        groqBody.append("language", "ar");
        groqBody.append("temperature", "0");

        const groqRes = await fetch(
          "https://api.groq.com/openai/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${groqKey}`,
            },
            body: groqBody,
          }
        );

        if (groqRes.ok) {
          const data = await groqRes.json();
          return NextResponse.json({
            provider: "groq-whisper",
            text: (data.text || "").trim(),
          });
        }
      } catch (err) {
        console.warn("[api/murajaah/transcribe] Groq Whisper gagal, lanjut ke provider lain:", err);
      }
    }

    // 2. Gunakan OpenAI Whisper jika tersedia
    if (openAiKey) {
      try {
        const openAiBody = new FormData();
        openAiBody.append("file", audioFile, "recitation.webm");
        openAiBody.append("model", "whisper-1");
        openAiBody.append("language", "ar");
        openAiBody.append("temperature", "0");

        const openAiRes = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openAiKey}`,
            },
            body: openAiBody,
          }
        );

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          return NextResponse.json({
            provider: "openai-whisper",
            text: (data.text || "").trim(),
          });
        }
      } catch (err) {
        console.warn("[api/murajaah/transcribe] OpenAI Whisper gagal:", err);
      }
    }

    // 3. Jika belum ada server AI API key yang disetel
    return NextResponse.json(
      {
        provider: "client-speech-api",
        fallback: true,
        message:
          "API Key server (OPENAI_API_KEY atau GROQ_API_KEY) belum disetel. Transkripsi menggunakan Web Speech API browser klien (ar-SA).",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/murajaah/transcribe] Kesalahan internal:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada layanan pemrosesan suara server." },
      { status: 500 }
    );
  }
}

