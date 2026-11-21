/**
 * Engine Evaluasi dan Pembanding Hafalan Al-Qur'an Berbasis NLP & AI SIRAJ.
 *
 * Menganalisis kesesuaian lafadz bacaan pengguna (hasil Speech-to-Text bahasa Arab)
 * dengan teks mushaf Utsmani resmi Al-Qur'an secara akurat, mendeteksi kata yang tepat,
 * terlewat (missing), berbeda (different), atau kurang yakin (uncertain).
 */

import type {
  EvaluatedWord,
  VerseEvaluationResult,
  WordEvaluationStatus,
} from "./murajaah-types";

/**
 * Menghapus seluruh harakat, tashkeel, tanwin, tanda waqaf, dan ornamen Al-Qur'an.
 */
export function stripTashkeel(text: string): string {
  return text
    // Harakat standar (fathah, kasrah, dhammah, sukun, tanwin, shaddah)
    .replace(/[\u064B-\u0652]/g, "")
    // Dagger alif / superscript alif (\u0670)
    .replace(/\u0670/g, "")
    // Tanda waqaf & simbol Utsmani resmi (\u06D6 s/d \u06ED)
    .replace(/[\u06D6-\u06ED]/g, "")
    // Tanda tajwid tambahan (\u0610 s/d \u061A)
    .replace(/[\u0610-\u061A]/g, "")
    // Tanda baca Arab (koma, titik dua, tatweel)
    .replace(/[\u060C\u061B\u061F\u0640]/g, "")
    // Kurung bunga ayat Al-Qur'an (\uFD3E, \uFD3F) dan digit Arab-Indik
    .replace(/[\uFD3E\uFD3F\u0660-\u0669]/g, "");
}

/**
 * Normalisasi teks Arab untuk perbandingan toleran:
 * - Menyamakan ragam Alif & Hamzah (إ, أ, آ, ٱ, ء)
 * - Menyamakan Ta Marbuthah (ة -> ه)
 * - Menyamakan Alif Maqsurah (ى -> ي)
 * - Menghilangkan spasi ganda dan karakter non-huruf
 */
export function normalizeArabicForComparison(text: string): string {
  const stripped = stripTashkeel(text);
  return stripped
    // Normalisasi variasi Alif & Hamzah
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ء/g, "")
    // Ta Marbuthah menjadi Ha (fleksibilitas lafadz waqaf vs washal)
    .replace(/ة/g, "ه")
    // Alif Maqsurah menjadi Ya
    .replace(/ى/g, "ي")
    // Hapus karakter non-huruf Arab dan pertahankan spasi
    .replace(/[^\u0621-\u064A\s]/g, "")
    // Rampingkan spasi berlebih
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Menghitung jarak Levenshtein antara dua string Arab ternormalisasi.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Menghitung tingkat kemiripan (0.0 s/d 1.0) antara dua kata Arab.
 * Memperhitungkan ejaan Utsmani vs ejaan modern (contoh: alif mad/dagger alif
 * pada "الرحمن" vs "الرحمان", "الصراط" vs "الصرط", "مالك" vs "ملك").
 */
export function computeWordSimilarity(target: string, spoken: string): number {
  if (target === spoken) return 1.0;
  if (!target || !spoken) return 0.0;

  // Toleransi variasi dagger alif Utsmani (menghilangkan 'ا' dari kedua kata)
  const noAlifTarget = target.replace(/ا/g, "");
  const noAlifSpoken = spoken.replace(/ا/g, "");
  if (noAlifTarget && noAlifTarget === noAlifSpoken) {
    return 0.96; // Praktis identik dalam konteks rasm Utsmani
  }

  const maxLen = Math.max(target.length, spoken.length);
  const dist = levenshteinDistance(target, spoken);
  const score = Math.max(0, 1 - dist / maxLen);

  // Jika kata cukup panjang (>= 4 huruf) dan hanya beda 1 karakter (misal alif/hamzah),
  // berikan skor tinggi toleran
  if (maxLen >= 4 && dist <= 1) {
    return Math.max(score, 0.88);
  }

  return score;
}

interface RawToken {
  original: string;
  normalized: string;
  index: number;
}

/**
 * Memecah teks menjadi token kata.
 */
function tokenizeWords(rawText: string): RawToken[] {
  const parts = rawText.trim().split(/\s+/).filter(Boolean);
  return parts.map((part, index) => ({
    original: part,
    normalized: normalizeArabicForComparison(part),
    index,
  }));
}

/**
 * Menjalankan Sequence Alignment (Needleman-Wunsch adaptif)
 * untuk memetakan kata-kata target Al-Qur'an dengan kata-kata yang diucapkan pengguna.
 */
export function alignQuranRecitation(
  targetVerseText: string,
  spokenText: string
): {
  evaluatedWords: EvaluatedWord[];
  extraWords: string[];
} {
  const targetTokens = tokenizeWords(targetVerseText);
  const spokenTokens = tokenizeWords(spokenText);

  const n = targetTokens.length;
  const m = spokenTokens.length;

  if (n === 0) {
    return {
      evaluatedWords: [],
      extraWords: spokenTokens.map((t) => t.original),
    };
  }

  // Jika pengguna belum membaca apa pun
  if (m === 0) {
    return {
      evaluatedWords: targetTokens.map((t, idx) => ({
        index: idx,
        word: t.original,
        normalizedTarget: t.normalized,
        status: "missing",
        similarity: 0,
        note: "Kata ini belum dilafadzkan.",
      })),
      extraWords: [],
    };
  }

  // Parameter skor alignment
  const MATCH_REWARD = 3;
  const CLOSE_MATCH_REWARD = 2;
  const GAP_PENALTY = -2;
  const MISMATCH_PENALTY = -2;

  // Matriks skor DP
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = 0; i <= n; i++) dp[i][0] = i * GAP_PENALTY;
  for (let j = 0; j <= m; j++) dp[0][j] = j * GAP_PENALTY;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sim = computeWordSimilarity(
        targetTokens[i - 1].normalized,
        spokenTokens[j - 1].normalized
      );

      let matchScore: number;
      if (sim >= 0.85) {
        matchScore = MATCH_REWARD;
      } else if (sim >= 0.6) {
        matchScore = CLOSE_MATCH_REWARD;
      } else {
        matchScore = MISMATCH_PENALTY;
      }

      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + matchScore, // match / substitute
        dp[i - 1][j] + GAP_PENALTY, // target deletion (missing)
        dp[i][j - 1] + GAP_PENALTY // spoken insertion (extra)
      );
    }
  }

  // Backtracking dari pojok kanan bawah
  let i = n;
  let j = m;

  type AlignmentPair = {
    targetIdx: number | null;
    spokenIdx: number | null;
  };

  const path: AlignmentPair[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const sim = computeWordSimilarity(
        targetTokens[i - 1].normalized,
        spokenTokens[j - 1].normalized
      );
      let matchScore: number;
      if (sim >= 0.85) {
        matchScore = MATCH_REWARD;
      } else if (sim >= 0.6) {
        matchScore = CLOSE_MATCH_REWARD;
      } else {
        matchScore = MISMATCH_PENALTY;
      }

      if (dp[i][j] === dp[i - 1][j - 1] + matchScore) {
        path.push({ targetIdx: i - 1, spokenIdx: j - 1 });
        i--;
        j--;
        continue;
      }
    }

    if (i > 0 && dp[i][j] === dp[i - 1][j] + GAP_PENALTY) {
      path.push({ targetIdx: i - 1, spokenIdx: null });
      i--;
      continue;
    }

    if (j > 0 && dp[i][j] === dp[i][j - 1] + GAP_PENALTY) {
      path.push({ targetIdx: null, spokenIdx: j - 1 });
      j--;
      continue;
    }

    // Fallback pencegah infinite loop
    if (i > 0 && j > 0) {
      path.push({ targetIdx: i - 1, spokenIdx: j - 1 });
      i--;
      j--;
    } else if (i > 0) {
      path.push({ targetIdx: i - 1, spokenIdx: null });
      i--;
    } else {
      path.push({ targetIdx: null, spokenIdx: j - 1 });
      j--;
    }
  }

  path.reverse();

  const evaluatedWords: EvaluatedWord[] = [];
  const extraWords: string[] = [];

  for (const pair of path) {
    if (pair.targetIdx !== null) {
      const targetToken = targetTokens[pair.targetIdx];
      if (pair.spokenIdx !== null) {
        const spokenToken = spokenTokens[pair.spokenIdx];
        const sim = computeWordSimilarity(
          targetToken.normalized,
          spokenToken.normalized
        );

        let status: WordEvaluationStatus;
        let note: string | undefined;

        if (sim >= 0.85) {
          status = "correct";
        } else if (sim >= 0.6) {
          status = "uncertain";
          note = `Terdengar "${spokenToken.original}", periksa kembali kejelasan makhraj lafadz ini.`;
        } else {
          status = "different";
          note = `Seharusnya "${targetToken.original}", namun terdeteksi dilafadzkan "${spokenToken.original}".`;
        }

        evaluatedWords.push({
          index: targetToken.index,
          word: targetToken.original,
          normalizedTarget: targetToken.normalized,
          status,
          spokenWord: spokenToken.original,
          similarity: Math.round(sim * 100) / 100,
          note,
        });
      } else {
        // Terlewat (reciter didn't say it)
        evaluatedWords.push({
          index: targetToken.index,
          word: targetToken.original,
          normalizedTarget: targetToken.normalized,
          status: "missing",
          similarity: 0,
          note: "Kata ini terlewat dari bacaan hafalan.",
        });
      }
    } else if (pair.spokenIdx !== null) {
      // Kata tambahan yang diucapkan reciter
      extraWords.push(spokenTokens[pair.spokenIdx].original);
    }
  }

  return { evaluatedWords, extraWords };
}

/**
 * Menghitung evaluasi lengkap satu ayat Al-Qur'an dari teks bacaan pengguna.
 */
export function evaluateVerseRecitation({
  verseKey,
  verseNumber,
  chapterId,
  targetArabic,
  targetTranslation,
  spokenArabic,
}: {
  verseKey: string;
  verseNumber: number;
  chapterId: number;
  targetArabic: string;
  targetTranslation: string;
  spokenArabic: string;
}): VerseEvaluationResult {
  const { evaluatedWords, extraWords } = alignQuranRecitation(
    targetArabic,
    spokenArabic
  );

  const totalWords = evaluatedWords.length;
  let correctWordsCount = 0;
  let uncertainWordsCount = 0;
  let missingWordsCount = 0;
  let differentWordsCount = 0;

  for (const word of evaluatedWords) {
    if (word.status === "correct") correctWordsCount++;
    else if (word.status === "uncertain") uncertainWordsCount++;
    else if (word.status === "missing") missingWordsCount++;
    else if (word.status === "different") differentWordsCount++;
  }

  // Perhitungan skor akurasi
  const rawScore =
    totalWords > 0
      ? ((correctWordsCount + uncertainWordsCount * 0.5) / totalWords) * 100
      : 0;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const accuracyPercentage =
    totalWords > 0
      ? Math.round((correctWordsCount / totalWords) * 100)
      : 0;

  let grade: VerseEvaluationResult["grade"];
  let gradeLabel: string;

  if (accuracyPercentage >= 95) {
    grade = "mumtaz";
    gradeLabel = "Mumtaz (Lancar & Sangat Baik)";
  } else if (accuracyPercentage >= 80) {
    grade = "jayyid_jiddan";
    gradeLabel = "Jayyid Jiddan (Baik Sekali)";
  } else if (accuracyPercentage >= 65) {
    grade = "jayyid";
    gradeLabel = "Jayyid (Cukup Baik)";
  } else {
    grade = "perlu_latihan";
    gradeLabel = "Perlu Pemantapan Hafalan";
  }

  const feedbackNotes: string[] = [];

  if (missingWordsCount > 0) {
    const missingSample = evaluatedWords
      .filter((w) => w.status === "missing")
      .map((w) => w.word)
      .slice(0, 3)
      .join("، ");
    feedbackNotes.push(
      `Ada ${missingWordsCount} kata yang terlewat (${missingSample}${
        missingWordsCount > 3 ? "..." : ""
      }).`
    );
  }

  if (differentWordsCount > 0) {
    const diffSample = evaluatedWords
      .filter((w) => w.status === "different")
      .map((w) => `"${w.word}"`)
      .slice(0, 2)
      .join(" dan ");
    feedbackNotes.push(
      `Perhatikan lafadz ${diffSample} yang terdeteksi berbeda dari mushaf.`
    );
  }

  if (uncertainWordsCount > 0) {
    feedbackNotes.push(
      `${uncertainWordsCount} kata terdengar kurang jelas artikulasinya pada rekaman.`
    );
  }

  if (extraWords.length > 0) {
    feedbackNotes.push(
      `Terdapat ${extraWords.length} kata tambahan di luar ayat: "${extraWords
        .slice(0, 3)
        .join(" ")}".`
    );
  }

  if (accuracyPercentage === 100) {
    feedbackNotes.push("Masya Allah! Seluruh lafadz ayat ini terbaca dengan tepat.");
  }

  const needsRepeat = accuracyPercentage < 85 || missingWordsCount > 0;
  let repeatSuggestion: string | undefined;

  if (needsRepeat) {
    const problematicWords = evaluatedWords
      .filter((w) => w.status === "missing" || w.status === "different")
      .map((w) => w.word);

    if (problematicWords.length > 0) {
      repeatSuggestion = `Ulangi hafalan ayat ini dan cermati lafadz: ${problematicWords
        .slice(0, 3)
        .join("، ")}.`;
    } else {
      repeatSuggestion = "Dengarkan murottal ayat ini lalu ulangi kembali hafalanmu.";
    }
  }

  return {
    verseKey,
    verseNumber,
    chapterId,
    targetArabic,
    targetTranslation,
    spokenArabic: spokenArabic.trim(),
    score,
    accuracyPercentage,
    grade,
    gradeLabel,
    words: evaluatedWords,
    correctWordsCount,
    uncertainWordsCount,
    missingWordsCount,
    differentWordsCount,
    totalWords,
    extraWords,
    feedbackNotes,
    needsRepeat,
    repeatSuggestion,
    evaluatedAt: new Date().toISOString(),
  };
}

export interface LiveVerseMatchProgress {
  matchedWordIndices: number[];
  matchedCount: number;
  totalWords: number;
  progressRatio: number;
  isCompleted: boolean;
  activeWordIndex: number;
  uncertainWordIndices: number[];
}

/**
 * Menghitung progres pencocokan kata secara real-time saat pengguna melafalkan ayat.
 * Toleran terhadap pengulangan kata (istidrak/waqaf & ibtida'), jeda nafas, dan variasi speech-to-text.
 */
export function checkLiveVerseProgress(
  targetVerseText: string,
  spokenText: string
): LiveVerseMatchProgress {
  const targetTokens = tokenizeWords(targetVerseText);
  const spokenTokens = tokenizeWords(spokenText);

  const totalWords = targetTokens.length;
  if (totalWords === 0) {
    return {
      matchedWordIndices: [],
      matchedCount: 0,
      totalWords: 0,
      progressRatio: 0,
      isCompleted: false,
      activeWordIndex: 0,
      uncertainWordIndices: [],
    };
  }

  if (spokenTokens.length === 0) {
    return {
      matchedWordIndices: [],
      matchedCount: 0,
      totalWords,
      progressRatio: 0,
      isCompleted: false,
      activeWordIndex: 0,
      uncertainWordIndices: [],
    };
  }

  const matchedSet = new Set<number>();
  const uncertainSet = new Set<number>();
  let targetPointer = 0;

  for (let sIdx = 0; sIdx < spokenTokens.length; sIdx++) {
    const sWord = spokenTokens[sIdx].normalized;

    // Window pencarian di sekitar targetPointer untuk toleransi pengulangan kata
    let bestMatchIdx = -1;
    let bestSim = 0;

    const startSearch = Math.max(0, targetPointer - 2);
    const endSearch = Math.min(totalWords, targetPointer + 4);

    for (let tIdx = startSearch; tIdx < endSearch; tIdx++) {
      const tWord = targetTokens[tIdx].normalized;
      const sim = computeWordSimilarity(tWord, sWord);
      if (sim >= 0.72 && sim > bestSim) {
        bestSim = sim;
        bestMatchIdx = tIdx;
      }
    }

    if (bestMatchIdx !== -1) {
      if (bestSim >= 0.85) {
        matchedSet.add(bestMatchIdx);
      } else {
        uncertainSet.add(bestMatchIdx);
      }
      targetPointer = Math.max(targetPointer, bestMatchIdx + 1);
    }
  }

  const matchedIndices = Array.from(matchedSet).sort((a, b) => a - b);
  const uncertainIndices = Array.from(uncertainSet).sort((a, b) => a - b);
  const matchedCount = matchedIndices.length + uncertainIndices.length;
  const progressRatio = totalWords > 0 ? matchedCount / totalWords : 0;

  // Ayat dianggap selesai jika >= 75% kata cocok ATAU kata terakhir telah tercapai dengan minimal 50% kata cocok
  const lastWordMatched =
    matchedSet.has(totalWords - 1) || uncertainSet.has(totalWords - 1);
  const isCompleted =
    progressRatio >= 0.75 ||
    (lastWordMatched && progressRatio >= 0.5) ||
    matchedCount >= totalWords;

  const activeWordIndex = Math.min(targetPointer, totalWords - 1);

  return {
    matchedWordIndices: matchedIndices,
    matchedCount,
    totalWords,
    progressRatio,
    isCompleted,
    activeWordIndex,
    uncertainWordIndices: uncertainIndices,
  };
}

/**
 * Mendeteksi apakah pengguna sudah mulai melafalkan ayat berikutnya.
 * Jika pengguna membaca 2 kata pembuka ayat selanjutnya, sistem mengenali transisi ayat secara otomatis.
 */
export function detectNextVerseTransition(
  nextVerseText: string,
  recentSpokenText: string
): boolean {
  if (!nextVerseText || !recentSpokenText) return false;
  const nextTokens = tokenizeWords(nextVerseText);
  const spokenTokens = tokenizeWords(recentSpokenText);

  if (nextTokens.length < 2 || spokenTokens.length < 2) return false;

  const firstNext = nextTokens[0].normalized;
  const secondNext = nextTokens[1].normalized;

  // Ambil 6 token terakhir dari bacaan yang masuk
  const recentSpoken = spokenTokens.slice(-6);

  for (let i = 0; i < recentSpoken.length - 1; i++) {
    const sim1 = computeWordSimilarity(firstNext, recentSpoken[i].normalized);
    const sim2 = computeWordSimilarity(secondNext, recentSpoken[i + 1].normalized);
    if (sim1 >= 0.8 && sim2 >= 0.8) {
      return true;
    }
  }

  return false;
}


