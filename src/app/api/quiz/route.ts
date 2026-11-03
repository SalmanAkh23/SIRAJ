import { NextResponse } from "next/server";
import { quizQuestions, EXAM_QUESTION_COUNT, type QuizQuestion } from "@/data/quiz";

export interface PublicExamQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
}

export interface ExamReviewItem {
  id: string;
  question: string;
  options: string[];
  category: string;
  chosenIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface ExamSubmitResponse {
  sessionId: string;
  submittedAt: string;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  violationCount: number;
  categoryBreakdown: {
    category: string;
    correct: number;
    total: number;
  }[];
  review: ExamReviewItem[];
}

/** Simpan hasil sesi yang sudah dinilai di memori server untuk mencegah pengiriman ganda. */
const submittedSessions = new Map<string, ExamSubmitResponse>();

/** Pengacakan Fisher-Yates. */
function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * GET /api/quiz
 * Menghasilkan sesi ujian baru berisi tepat 40 soal unik dengan urutan soal
 * dan urutan pilihan jawaban (A, B, C, D) yang diacak.
 * Kunci jawaban dan pembahasan TIDAK dikirimkan sebelum ujian selesai.
 */
export async function GET() {
  if (quizQuestions.length < EXAM_QUESTION_COUNT) {
    return NextResponse.json(
      { error: "Bank soal belum memenuhi standar 40 soal ujian." },
      { status: 500 }
    );
  }

  const selectedQuestions = shuffleArray(quizQuestions).slice(
    0,
    EXAM_QUESTION_COUNT
  );

  const publicQuestions: PublicExamQuestion[] = selectedQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: shuffleArray(q.options),
    category: q.category,
  }));

  const sessionId = `exam-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return NextResponse.json(
    {
      sessionId,
      totalQuestions: EXAM_QUESTION_COUNT,
      questions: publicQuestions,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

interface SubmitRequestBody {
  sessionId?: string;
  questions?: { id: string; options: string[] }[];
  answers?: Record<string, number>;
  violationCount?: number;
}

/**
 * POST /api/quiz
 * Memvalidasi jawaban peserta di sisi server, menghitung skor berdasarkan 40 soal
 * dengan rumus Nilai = (Jumlah jawaban benar / 40) * 100, mencegah pengiriman ulang
 * sesi yang sama, dan mengembalikan pembahasan lengkap setelah ujian selesai.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitRequestBody;
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID sesi ujian tidak valid." },
        { status: 400 }
      );
    }

    // Jika sesi sudah pernah dinilai sebelumnya, kembalikan hasil yang tercatat (idempoten)
    const existingResult = submittedSessions.get(sessionId);
    if (existingResult) {
      return NextResponse.json(existingResult);
    }

    const sessionQuestions = Array.isArray(body.questions) ? body.questions : [];
    if (sessionQuestions.length !== EXAM_QUESTION_COUNT) {
      return NextResponse.json(
        { error: `Sesi ujian harus terdiri dari tepat ${EXAM_QUESTION_COUNT} soal.` },
        { status: 400 }
      );
    }

    const canonicalMap = new Map<string, QuizQuestion>();
    for (const q of quizQuestions) {
      canonicalMap.set(q.id, q);
    }

    // Pastikan tidak ada ID soal yang terduplikasi dalam satu sesi
    const seenIds = new Set<string>();
    for (const sq of sessionQuestions) {
      if (!sq?.id || seenIds.has(sq.id) || !canonicalMap.has(sq.id)) {
        return NextResponse.json(
          { error: "Daftar soal dalam sesi ujian tidak valid." },
          { status: 400 }
        );
      }
      seenIds.add(sq.id);
    }

    const answers = body.answers && typeof body.answers === "object" ? body.answers : {};
    const violationCount =
      typeof body.violationCount === "number" && body.violationCount >= 0
        ? Math.floor(body.violationCount)
        : 0;

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const categoryStats = new Map<string, { correct: number; total: number }>();
    const review: ExamReviewItem[] = [];

    for (const sq of sessionQuestions) {
      const canonical = canonicalMap.get(sq.id)!;
      const correctOptionText = canonical.options[canonical.correctAnswer];

      // Gunakan daftar opsi yang ditampilkan pada sesi peserta jika valid, atau opsi kanonik
      const displayedOptions =
        Array.isArray(sq.options) &&
        sq.options.length === 4 &&
        sq.options.includes(correctOptionText)
          ? sq.options
          : canonical.options;

      const correctIndex = displayedOptions.indexOf(correctOptionText);
      const rawChoice = answers[sq.id];
      const chosenIndex =
        typeof rawChoice === "number" &&
        Number.isInteger(rawChoice) &&
        rawChoice >= 0 &&
        rawChoice < displayedOptions.length
          ? rawChoice
          : null;

      const isCorrect = chosenIndex !== null && chosenIndex === correctIndex;

      if (chosenIndex === null) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      const catStat = categoryStats.get(canonical.category) ?? {
        correct: 0,
        total: 0,
      };
      catStat.total += 1;
      if (isCorrect) catStat.correct += 1;
      categoryStats.set(canonical.category, catStat);

      review.push({
        id: canonical.id,
        question: canonical.question,
        options: displayedOptions,
        category: canonical.category,
        chosenIndex,
        correctIndex,
        isCorrect,
        explanation: canonical.explanation,
      });
    }

    const answeredCount = correctCount + wrongCount;
    // Rumus: Nilai = (Jumlah jawaban benar / 40) * 100
    const rawScore = (correctCount / EXAM_QUESTION_COUNT) * 100;
    const score = Number.isInteger(rawScore)
      ? rawScore
      : Number(rawScore.toFixed(1));

    const result: ExamSubmitResponse = {
      sessionId,
      submittedAt: new Date().toISOString(),
      totalQuestions: EXAM_QUESTION_COUNT,
      answeredCount,
      unansweredCount,
      correctCount,
      wrongCount,
      score,
      violationCount,
      categoryBreakdown: Array.from(categoryStats.entries()).map(
        ([category, stat]) => ({
          category,
          correct: stat.correct,
          total: stat.total,
        })
      ),
      review,
    };

    // Simpan hasil di memori server (batasi ukuran map agar tidak bocor memori)
    if (submittedSessions.size > 500) {
      const firstKey = submittedSessions.keys().next().value;
      if (firstKey) submittedSessions.delete(firstKey);
    }
    submittedSessions.set(sessionId, result);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses pengiriman hasil ujian." },
      { status: 500 }
    );
  }
}

