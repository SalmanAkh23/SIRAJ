"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXAM_QUESTION_COUNT } from "@/data/quiz";
import type {
  PublicExamQuestion,
  ExamSubmitResponse,
} from "@/app/api/quiz/route";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Maximize2,
  Minimize2,
  FileCheck2,
  ListChecks,
  Wifi,
  Sparkles,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Clock,
  Check,
  X,
} from "lucide-react";

type ExamStage = "intro" | "exam" | "result";
type WarningReason = "pointer-leave" | "tab-switch";

interface PersistedExamSession {
  sessionId: string;
  questions: PublicExamQuestion[];
  answers: Record<string, number>;
  currentIndex: number;
  violationCount: number;
  startedAt: string;
}

const ACTIVE_SESSION_KEY = "siraj-exam-active-session-v1";
const LAST_RESULT_KEY = "siraj-exam-last-result-v1";
const EXAM_HISTORY_KEY = "siraj-exam-history-v1";
const WARNING_DURATION_SECONDS = 5;

/** Ilustrasi Pendidikan Islam pada Halaman Pembuka Ujian */
function ExamHeroIllustration() {
  return (
    <div className="relative select-none" aria-hidden="true">
      <svg
        viewBox="0 0 420 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
      >
        <defs>
          <linearGradient id="quizArchGrad" x1="210" y1="16" x2="210" y2="284" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#174A3A" />
            <stop offset="60%" stopColor="#245C52" />
            <stop offset="100%" stopColor="#103830" />
          </linearGradient>
          <linearGradient id="quizGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0DCAA" />
            <stop offset="50%" stopColor="#D6B878" />
            <stop offset="100%" stopColor="#B38E42" />
          </linearGradient>
        </defs>

        {/* Ornamen Geometri Latar */}
        <g opacity="0.22" stroke="#D6B878" strokeWidth="1.2">
          <circle cx="210" cy="150" r="128" strokeDasharray="4 4" />
          <rect x="118" y="58" width="184" height="184" transform="rotate(45 210 150)" />
          <rect x="118" y="58" width="184" height="184" />
        </g>

        {/* Bingkai Mihrab Utama */}
        <path
          d="M74 276V140C74 74 138 32 210 18C282 32 346 74 346 140V276H74Z"
          fill="url(#quizArchGrad)"
          stroke="url(#quizGoldGrad)"
          strokeWidth="2.5"
        />
        <path
          d="M84 268V142C84 82 143 42 210 28C277 42 336 82 336 142V268H84Z"
          stroke="#D6B878"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Pendaran Cahaya Ilmu */}
        <circle cx="210" cy="136" r="68" fill="#D6B878" fillOpacity="0.16" />
        <circle cx="210" cy="136" r="42" fill="#FFF8E6" fillOpacity="0.18" />

        {/* Bintang 8 Sudut (Rub el Hizb) & Medali Evaluasi di Atas */}
        <g transform="translate(210, 76)">
          <rect x="-20" y="-20" width="40" height="40" fill="#174A3A" stroke="#D6B878" strokeWidth="1.6" />
          <rect
            x="-20"
            y="-20"
            width="40"
            height="40"
            transform="rotate(45)"
            fill="#174A3A"
            stroke="#D6B878"
            strokeWidth="1.6"
          />
          <circle cx="0" cy="0" r="11" fill="#D6B878" />
          <path
            d="M-4 0.5L-1 3.5L5 -2.5"
            stroke="#174A3A"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Kitab / Mushaf Terbuka di Atas Rehal */}
        <path
          d="M126 146C154 138 184 146 210 158C236 146 266 138 294 146V204C266 196 236 204 210 216C184 204 154 196 126 204V146Z"
          fill="#F8F7F2"
          stroke="#D6B878"
          strokeWidth="2.2"
        />
        <line x1="210" y1="158" x2="210" y2="216" stroke="#B38E42" strokeWidth="1.8" />

        {/* Baris Teks Simbolik pada Kitab */}
        {[164, 175, 186].map((y, idx) => (
          <g key={idx}>
            <line
              x1="144"
              y1={y}
              x2="192"
              y2={y + 4}
              stroke="#174A3A"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <line
              x1="228"
              y1={y + 4}
              x2="276"
              y2={y}
              stroke="#174A3A"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
        ))}

        {/* Rehal Penyangga Kitab */}
        <path
          d="M146 236L210 206L274 236L266 246L210 218L154 246L146 236Z"
          fill="#D6B878"
        />

        {/* Lentera Gantung Kiri & Kanan */}
        <line x1="122" y1="48" x2="122" y2="86" stroke="#D6B878" strokeWidth="1.2" />
        <path d="M115 92L122 84L129 92V106L122 113L115 106V92Z" fill="#D6B878" />
        <circle cx="122" cy="99" r="3.5" fill="#FFFDF7" />

        <line x1="298" y1="48" x2="298" y2="86" stroke="#D6B878" strokeWidth="1.2" />
        <path d="M291 92L298 84L305 92V106L298 113L291 106V92Z" fill="#D6B878" />
        <circle cx="298" cy="99" r="3.5" fill="#FFFDF7" />

        {/* Badge 40 Soal di Bawah */}
        <rect
          x="150"
          y="246"
          width="120"
          height="24"
          rx="12"
          fill="#103830"
          stroke="#D6B878"
          strokeWidth="1.2"
        />
        <text
          x="210"
          y="262"
          textAnchor="middle"
          fill="#F8F7F2"
          fontSize="11"
          fontWeight="bold"
          letterSpacing="0.06em"
        >
          40 SOAL UJIAN
        </text>
      </svg>
    </div>
  );
}

export default function QuizPage() {
  const [stage, setStage] = useState<ExamStage>("intro");
  const [sessionId, setSessionId] = useState<string>("");
  const [questions, setQuestions] = useState<PublicExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [violationCount, setViolationCount] = useState<number>(0);

  // Saved session & last result on intro screen
  const [savedSession, setSavedSession] = useState<PersistedExamSession | null>(
    null
  );
  const [lastResult, setLastResult] = useState<ExamSubmitResponse | null>(null);

  // Modals & UI states
  const [showStartModal, setShowStartModal] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [isLoadingExam, setIsLoadingExam] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Proctoring / Anti-cheat warning states
  const [warningActive, setWarningActive] = useState<boolean>(false);
  const [warningReason, setWarningReason] =
    useState<WarningReason>("pointer-leave");
  const [warningSecondsLeft, setWarningSecondsLeft] = useState<number>(
    WARNING_DURATION_SECONDS
  );
  const [violationRecordedModal, setViolationRecordedModal] =
    useState<boolean>(false);

  // Result & review states
  const [examResult, setExamResult] = useState<ExamSubmitResponse | null>(null);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "incorrect" | "correct"
  >("all");

  // Refs for accurate timer management & avoiding duplicate triggers
  const warningDeadlineRef = useRef<number | null>(null);
  const warningIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const warningActiveRef = useRef<boolean>(false);
  const violationModalRef = useRef<boolean>(false);
  const showFinishModalRef = useRef<boolean>(false);

  useEffect(() => {
    warningActiveRef.current = warningActive;
  }, [warningActive]);

  useEffect(() => {
    violationModalRef.current = violationRecordedModal;
  }, [violationRecordedModal]);

  useEffect(() => {
    showFinishModalRef.current = showFinishModal;
  }, [showFinishModal]);

  // Hydrate saved session or last result from localStorage on mount
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (rawSession) {
        const parsed = JSON.parse(rawSession) as PersistedExamSession;
        if (
          parsed &&
          parsed.sessionId &&
          Array.isArray(parsed.questions) &&
          parsed.questions.length === EXAM_QUESTION_COUNT
        ) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- muat sesi tersimpan dari localStorage saat mount
          setSavedSession(parsed);
        }
      }
      const rawLast = localStorage.getItem(LAST_RESULT_KEY);
      if (rawLast) {
        const parsedResult = JSON.parse(rawLast) as ExamSubmitResponse;
        if (parsedResult && parsedResult.sessionId) {
          setLastResult(parsedResult);
        }
      }
    } catch {
      // abaikan bila localStorage tidak tersedia
    }
  }, []);

  // Persist active exam state automatically whenever answers, index, or violations change
  useEffect(() => {
    if (
      stage !== "exam" ||
      !sessionId ||
      questions.length !== EXAM_QUESTION_COUNT
    ) {
      return;
    }
    const payload: PersistedExamSession = {
      sessionId,
      questions,
      answers,
      currentIndex,
      violationCount,
      startedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(payload));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronkan ref sesi tersimpan
      setSavedSession(payload);
    } catch {
      // abaikan
    }
  }, [stage, sessionId, questions, answers, currentIndex, violationCount]);

  // Pantau status Fullscreen browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const enterFullscreenSafe = async () => {
    try {
      if (
        typeof document !== "undefined" &&
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
      ) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen ditolak atau tidak didukung oleh perangkat — ujian tetap berjalan normal
    }
  };

  const exitFullscreenSafe = async () => {
    try {
      if (
        typeof document !== "undefined" &&
        document.fullscreenElement &&
        document.exitFullscreen
      ) {
        await document.exitFullscreen();
      }
    } catch {
      // abaikan
    }
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await exitFullscreenSafe();
    } else {
      await enterFullscreenSafe();
    }
  };

  // Bersihkan timer peringatan
  const clearWarningTimer = useCallback(() => {
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
      warningIntervalRef.current = null;
    }
    warningDeadlineRef.current = null;
  }, []);

  // Batalkan peringatan ketika peserta kembali sebelum 5 detik habis
  const dismissWarningBeforeTimeout = useCallback(() => {
    clearWarningTimer();
    setWarningActive(false);
    setWarningSecondsLeft(WARNING_DURATION_SECONDS);
  }, [clearWarningTimer]);

  // Mulai hitung mundur 5 detik ketika peserta keluar area ujian atau berpindah tab
  const triggerLeaveWarning = useCallback(
    (reason: WarningReason) => {
      if (
        warningActiveRef.current ||
        violationModalRef.current ||
        showFinishModalRef.current
      ) {
        return;
      }

      clearWarningTimer();
      const deadline = Date.now() + WARNING_DURATION_SECONDS * 1000;
      warningDeadlineRef.current = deadline;
      setWarningReason(reason);
      setWarningSecondsLeft(WARNING_DURATION_SECONDS);
      setWarningActive(true);

      warningIntervalRef.current = setInterval(() => {
        const target = warningDeadlineRef.current;
        if (!target) return;
        const remainingMs = target - Date.now();
        const remainingSec = Math.ceil(remainingMs / 1000);

        if (remainingSec <= 0) {
          // Waktu 5 detik habis -> catat pelanggaran
          clearWarningTimer();
          setWarningActive(false);
          setWarningSecondsLeft(0);
          setViolationCount((prev) => prev + 1);
          setViolationRecordedModal(true);
        } else {
          setWarningSecondsLeft(remainingSec);
        }
      }, 200);
    },
    [clearWarningTimer]
  );

  // Pasang event listener pemantauan selama stage === "exam"
  useEffect(() => {
    if (stage !== "exam") {
      clearWarningTimer();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- bersihkan overlay peringatan saat keluar mode ujian
      setWarningActive(false);
      return;
    }

    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

    // A. Deteksi kursor keluar dari viewport halaman ujian (khusus perangkat pointer/desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (isCoarsePointer) return;
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight ||
        e.relatedTarget === null
      ) {
        triggerLeaveWarning("pointer-leave");
      }
    };

    // Jika peserta menggerakkan kursor kembali ke dalam area ujian sebelum 5 detik habis
    const handleMouseEnter = () => {
      if (
        warningActiveRef.current &&
        document.visibilityState === "visible" &&
        document.hasFocus()
      ) {
        dismissWarningBeforeTimeout();
      }
    };

    // B. Deteksi perpindahan tab atau kehilangan fokus jendela (Page Visibility API & blur)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        triggerLeaveWarning("tab-switch");
      }
    };

    const handleWindowBlur = () => {
      triggerLeaveWarning("tab-switch");
    };

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      clearWarningTimer();
    };
  }, [
    stage,
    triggerLeaveWarning,
    dismissWarningBeforeTimeout,
    clearWarningTimer,
  ]);

  // Mulai sesi ujian 40 soal baru setelah konfirmasi pengguna
  const handleConfirmStartNewExam = async () => {
    setErrorBanner(null);
    setIsLoadingExam(true);

    // Minta izin layar penuh melalui interaksi klik pengguna
    await enterFullscreenSafe();

    try {
      const response = await fetch("/api/quiz", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Gagal menyiapkan sesi 40 soal ujian.");
      }
      const data = (await response.json()) as {
        sessionId: string;
        totalQuestions: number;
        questions: PublicExamQuestion[];
      };

      if (
        !Array.isArray(data.questions) ||
        data.questions.length !== EXAM_QUESTION_COUNT
      ) {
        throw new Error(
          `Jumlah soal tidak memenuhi standar ${EXAM_QUESTION_COUNT} soal.`
        );
      }

      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentIndex(0);
      setViolationCount(0);
      setExamResult(null);
      setShowReview(false);
      setShowStartModal(false);
      setStage("exam");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorBanner(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memulai ujian. Periksa koneksi internetmu."
      );
    } finally {
      setIsLoadingExam(false);
    }
  };

  // Lanjutkan sesi ujian yang belum selesai dari penyimpanan lokal
  const handleResumeSavedSession = async () => {
    if (!savedSession) return;
    await enterFullscreenSafe();
    setSessionId(savedSession.sessionId);
    setQuestions(savedSession.questions);
    setAnswers(savedSession.answers ?? {});
    setCurrentIndex(savedSession.currentIndex ?? 0);
    setViolationCount(savedSession.violationCount ?? 0);
    setExamResult(null);
    setShowReview(false);
    setStage("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pilih atau ganti jawaban pada soal saat ini
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Kirim dan selesaikan ujian
  const handleConfirmFinishExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorBanner(null);

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questions: questions.map((q) => ({
            id: q.id,
            options: q.options,
          })),
          answers,
          violationCount,
        }),
      });

      if (!response.ok) {
        const errData = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(
          errData?.error ?? "Gagal memvalidasi hasil ujian di server."
        );
      }

      const resultData = (await response.json()) as ExamSubmitResponse;

      // Hapus sesi aktif dan simpan hasil terakhir serta riwayat ujian
      try {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(resultData));
        const rawHist = localStorage.getItem(EXAM_HISTORY_KEY);
        const histList: ExamSubmitResponse[] = rawHist ? JSON.parse(rawHist) : [];
        const filteredHist = Array.isArray(histList)
          ? histList.filter((item) => item.sessionId !== resultData.sessionId)
          : [];
        localStorage.setItem(
          EXAM_HISTORY_KEY,
          JSON.stringify([resultData, ...filteredHist].slice(0, 25))
        );
      } catch {
        // abaikan
      }

      setSavedSession(null);
      setLastResult(resultData);
      setExamResult(resultData);
      setShowFinishModal(false);
      clearWarningTimer();
      setWarningActive(false);
      await exitFullscreenSafe();
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorBanner(
        err instanceof Error
          ? err.message
          : "Gagal mengirimkan jawaban ujian. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Statistik pengerjaan saat ini
  const answeredCount = useMemo(() => {
    return questions.filter((q) => typeof answers[q.id] === "number").length;
  }, [questions, answers]);

  const unansweredCount = EXAM_QUESTION_COUNT - answeredCount;
  const progressPercentage = Math.round(
    (answeredCount / EXAM_QUESTION_COUNT) * 100
  );

  const firstUnansweredIndex = useMemo(() => {
    return questions.findIndex((q) => typeof answers[q.id] !== "number");
  }, [questions, answers]);

  const filteredReviewItems = useMemo(() => {
    if (!examResult) return [];
    if (reviewFilter === "correct") {
      return examResult.review.filter((item) => item.isCorrect);
    }
    if (reviewFilter === "incorrect") {
      return examResult.review.filter((item) => !item.isCorrect);
    }
    return examResult.review;
  }, [examResult, reviewFilter]);

  /* ============================================================================
     STAGE 1: HALAMAN PEMBUKA UJIAN ("Siap Menguji Kemampuanmu?")
  ============================================================================ */
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-[#F8F7F2] text-[#263A35]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
          {/* Banner Error bila ada */}
          {errorBanner && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/25 text-error text-sm flex items-center gap-3"
            >
              <AlertTriangle size={18} className="shrink-0" />
              <span>{errorBanner}</span>
            </div>
          )}

          {/* Kartu Hero Utama Pembuka Ujian */}
          <section className="relative overflow-hidden rounded-3xl border border-[#D6B878]/45 bg-gradient-to-br from-[#FFFFFF] via-[#FBF9F3] to-[#EBE6D8] shadow-[0_12px_40px_-12px_rgba(23,74,58,0.1)]">
            {/* Aksen Garis Emas Atas */}
            <div
              className="h-1.5 w-full bg-gradient-to-r from-[#174A3A] via-[#D6B878] to-[#245C52]"
              aria-hidden="true"
            />

            {/* Pola Bintang Geometri Islami */}
            <div
              className="absolute inset-0 pattern-star opacity-[0.04] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-9 lg:p-12">
              {/* Kolom Kiri: Informasi & Tombol Mulai Ujian */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#174A3A]/[0.08] border border-[#D6B878]/50 text-[#174A3A] text-xs font-semibold tracking-wide mb-4">
                  <Sparkles size={13} className="text-[#B89246]" />
                  <span>Evaluasi Pemahaman Islam Terpadu</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#174A3A] tracking-tight leading-tight">
                  Siap Menguji Kemampuanmu?
                </h1>

                <p className="text-sm sm:text-base text-[#66736D] mt-3.5 leading-relaxed">
                  Uji pemahamanmu tentang ajaran Islam melalui 40 soal yang telah
                  disiapkan. Kerjakan dengan fokus dan tunjukkan kemampuan
                  terbaikmu.
                </p>

                {/* Ringkasan Spesifikasi Ujian */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">
                  <div className="rounded-2xl bg-white/90 border border-[#D6B878]/40 p-4 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-[#174A3A]/10 text-[#174A3A] flex items-center justify-center mb-2.5">
                      <ListChecks size={18} />
                    </div>
                    <p className="text-xs text-[#66736D]">Jumlah Soal</p>
                    <p className="text-base font-bold text-[#17211D] mt-0.5">
                      40 Soal
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-[#D6B878]/40 p-4 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-[#245C52]/10 text-[#245C52] flex items-center justify-center mb-2.5">
                      <FileCheck2 size={18} />
                    </div>
                    <p className="text-xs text-[#66736D]">Jenis Ujian</p>
                    <p className="text-base font-bold text-[#17211D] mt-0.5">
                      Pilihan Ganda
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/90 border border-[#D6B878]/40 p-4 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-[#D6B878]/25 text-[#174A3A] flex items-center justify-center mb-2.5">
                      <Trophy size={18} />
                    </div>
                    <p className="text-xs text-[#66736D]">Penilaian &amp; Hasil</p>
                    <p className="text-base font-bold text-[#17211D] mt-0.5">
                      Setelah Selesai
                    </p>
                  </div>
                </div>

                {/* Catatan Kesiapan & Koneksi */}
                <div className="w-full mt-5 p-4 rounded-2xl bg-[#174A3A]/[0.05] border border-[#174A3A]/15 flex items-start gap-3">
                  <Wifi
                    size={18}
                    className="text-[#174A3A] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <p className="text-xs sm:text-sm text-[#263A35] leading-relaxed">
                    <strong>Catatan Persiapan:</strong> Pastikan koneksi internet
                    stabil dan kamu berada di tempat yang kondusif. Selama ujian
                    berlangsung, sistem akan memantau fokus layar agar ujian
                    berjalan tertib dan jujur.
                  </p>
                </div>

                {/* Tombol Utama: Mulai Ujian / Lanjutkan Sesi */}
                <div className="flex flex-wrap items-center gap-3.5 mt-7 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowStartModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#174A3A] hover:bg-[#245C52] text-white font-semibold text-base shadow-[0_8px_24px_-6px_rgba(23,74,58,0.4)] transition-all cursor-pointer"
                  >
                    <span>Mulai Ujian</span>
                    <ArrowRight size={18} />
                  </button>

                  {savedSession && (
                    <button
                      type="button"
                      onClick={handleResumeSavedSession}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F8F7F2] text-[#174A3A] border border-[#D6B878] font-semibold text-sm transition-all cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>
                        Lanjutkan Sesi ({Object.keys(savedSession.answers).length}
                        /40 Terjawab)
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Kolom Kanan: Ilustrasi Pendidikan Islam */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="w-full max-w-[360px]">
                  <ExamHeroIllustration />
                </div>
              </div>
            </div>
          </section>

          {/* Ringkasan Hasil Ujian Terakhir (Jika Peserta Pernah Menyelesaikan Ujian) */}
          {lastResult && (
            <section
              aria-label="Riwayat hasil ujian terakhir"
              className="mt-8 rounded-2xl bg-white border border-[#E6E3D8] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#174A3A]/10 text-[#174A3A] flex items-center justify-center font-bold text-lg shrink-0">
                  {lastResult.score}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#263A35]">
                    Hasil Ujian Terakhirmu
                  </h2>
                  <p className="text-xs sm:text-sm text-[#66736D] mt-0.5">
                    Benar {lastResult.correctCount} dari {lastResult.totalQuestions}{" "}
                    soal • Nilai {lastResult.score} • {lastResult.violationCount}{" "}
                    pelanggaran tercatat
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setExamResult(lastResult);
                  setStage("result");
                }}
                className="btn-secondary text-xs sm:text-sm !py-2 !px-4 self-start sm:self-auto"
              >
                Lihat Detail Hasil
              </button>
            </section>
          )}
        </div>

        {/* ====================================================================
            MODAL KONFIRMASI MEMULAI UJIAN & IZIN LAYAR PENUH
        ==================================================================== */}
        {showStartModal && (
          <div
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-start-exam-title"
          >
            <div className="bg-white rounded-3xl border border-[#D6B878]/50 max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#174A3A] text-[#D6B878] flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2
                    id="modal-start-exam-title"
                    className="text-lg sm:text-xl font-bold text-[#263A35]"
                  >
                    Konfirmasi Mulai Ujian
                  </h2>
                  <p className="text-xs text-[#66736D]">
                    Ujian Pemahaman Islam — 40 Soal Pilihan Ganda
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#263A35] leading-relaxed mb-4">
                Sebelum memulai sesi ujian, mohon perhatikan ketentuan pengerjaan
                berikut:
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#263A35] bg-[#F8F7F2] border border-[#E6E3D8] rounded-2xl p-4 mb-6">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#174A3A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Ujian terdiri dari <strong>tepat 40 soal Pilihan Ganda</strong>{" "}
                    yang diacak dari materi Aqidah, Fiqih, Akhlak, Sirah, Adab,
                    Al-Qur&apos;an, dan Hadits.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#174A3A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Saat menekan tombol mulai, browser akan mengaktifkan{" "}
                    <strong>Mode Layar Penuh (Fullscreen)</strong> agar pengerjaan
                    lebih fokus.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#174A3A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>Jangan meninggalkan halaman ujian</strong> atau
                    berpindah tab. Jika keluar dari area ujian lebih dari{" "}
                    <strong>5 detik</strong>, kejadian akan dicatat sebagai
                    pelanggaran.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#174A3A] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Jawaban tersimpan otomatis dan nilai akhir beserta pembahasan
                    akan ditampilkan setelah ujian diselesaikan.
                  </span>
                </li>
              </ul>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isLoadingExam}
                  onClick={() => setShowStartModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E6E3D8] text-sm font-semibold text-[#66736D] hover:text-[#263A35] hover:bg-[#F8F7F2] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isLoadingExam}
                  onClick={handleConfirmStartNewExam}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-60"
                >
                  <Maximize2 size={15} />
                  <span>
                    {isLoadingExam
                      ? "Menyiapkan 40 Soal..."
                      : "Setuju & Mulai Sekarang"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================================
     STAGE 3: HALAMAN HASIL UJIAN ("stage === 'result'")
  ============================================================================ */
  if (stage === "result" && examResult) {
    const isPassed = examResult.score >= 70;

    return (
      <div className="min-h-screen bg-[#F8F7F2] text-[#263A35]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
          {/* Kartu Utama Hasil Ujian */}
          <section className="relative overflow-hidden rounded-3xl bg-white border border-[#D6B878]/50 shadow-[0_12px_36px_-12px_rgba(23,74,58,0.1)] p-6 sm:p-9 lg:p-10">
            <div
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#174A3A] via-[#D6B878] to-[#245C52]"
              aria-hidden="true"
            />

            <div className="text-center max-w-2xl mx-auto">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border ${
                  isPassed
                    ? "bg-[#174A3A] text-[#D6B878] border-[#D6B878]/50"
                    : "bg-[#D6B878]/20 text-[#174A3A] border-[#D6B878]"
                }`}
              >
                <Trophy size={30} strokeWidth={1.8} />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#174A3A]/[0.08] text-[#174A3A]">
                Hasil Evaluasi Ujian Pemahaman Islam
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#263A35] mt-3">
                {isPassed
                  ? "Alhamdulillah, Hasil yang Sangat Baik!"
                  : "Terus Semangat Menuntut Ilmu!"}
              </h1>

              {/* Nilai Akhir Besar */}
              <div className="my-6 inline-flex flex-col items-center justify-center px-10 py-5 rounded-3xl bg-gradient-to-b from-[#FBF9F3] to-[#F2ECE0] border border-[#D6B878]/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#66736D]">
                  Nilai Akhir
                </span>
                <div className="text-5xl sm:text-6xl font-bold text-[#174A3A] tracking-tight mt-1">
                  {examResult.score}
                  <span className="text-xl text-[#66736D] font-normal">
                    {" "}
                    / 100
                  </span>
                </div>
                <span className="text-xs text-[#66736D] mt-1">
                  Rumus: ({examResult.correctCount} Benar ÷{" "}
                  {examResult.totalQuestions} Soal) × 100
                </span>
              </div>

              <p className="text-sm text-[#66736D] leading-relaxed">
                {isPassed
                  ? "Pemahamanmu terhadap materi Aqidah, Fiqih, Akhlak, Sirah, Adab, Al-Qur'an, dan Hadits sudah sangat baik. Pertahankan keistiqamahan belajar."
                  : "Jangan berkecil hati. Gunakan fitur pembahasan di bawah untuk mempelajari kembali soal-soal yang belum tepat, lalu coba kembali."}
              </p>
            </div>

            {/* Grid Statistik Hasil Ujian (5 Indikator Wajib) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8">
              <div className="rounded-2xl bg-[#F8F7F2] border border-[#E6E3D8] p-4 text-center">
                <p className="text-xs text-[#66736D]">Total Soal</p>
                <p className="text-2xl font-bold text-[#263A35] mt-1">
                  {examResult.totalQuestions}
                </p>
              </div>

              <div className="rounded-2xl bg-[#174A3A]/[0.06] border border-[#174A3A]/20 p-4 text-center">
                <p className="text-xs text-[#174A3A] font-medium">
                  Jawaban Benar
                </p>
                <p className="text-2xl font-bold text-[#174A3A] mt-1">
                  {examResult.correctCount}
                </p>
              </div>

              <div className="rounded-2xl bg-error/[0.05] border border-error/20 p-4 text-center">
                <p className="text-xs text-error font-medium">Jawaban Salah</p>
                <p className="text-2xl font-bold text-error mt-1">
                  {examResult.wrongCount}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8F7F2] border border-[#E6E3D8] p-4 text-center">
                <p className="text-xs text-[#66736D]">Tidak Dijawab</p>
                <p className="text-2xl font-bold text-[#263A35] mt-1">
                  {examResult.unansweredCount}
                </p>
              </div>

              <div
                className={`col-span-2 sm:col-span-1 rounded-2xl p-4 text-center border ${
                  examResult.violationCount === 0
                    ? "bg-[#174A3A]/[0.05] border-[#174A3A]/20"
                    : "bg-warning/10 border-warning/30"
                }`}
              >
                <p className="text-xs text-[#66736D]">Pelanggaran Tercatat</p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    examResult.violationCount === 0
                      ? "text-[#174A3A]"
                      : "text-warning"
                  }`}
                >
                  {examResult.violationCount}
                </p>
              </div>
            </div>

            {/* Ringkasan Hasil Per Kategori Materi */}
            {examResult.categoryBreakdown.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#E6E3D8]">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#66736D] mb-4">
                  Ringkasan Performa per Kategori Materi
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {examResult.categoryBreakdown.map((cat) => {
                    const pct = Math.round((cat.correct / cat.total) * 100);
                    return (
                      <div
                        key={cat.category}
                        className="rounded-xl bg-[#F8F7F2] border border-[#E6E3D8] p-3.5"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                          <span className="text-[#263A35]">{cat.category}</span>
                          <span className="text-[#174A3A]">
                            {cat.correct}/{cat.total} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#E5E3D8] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#174A3A] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tombol Aksi Halaman Hasil */}
            <div className="mt-8 pt-6 border-t border-[#E6E3D8] flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowReview((prev) => !prev)}
                className="btn-primary text-sm !py-3 !px-6 cursor-pointer"
              >
                <BookOpen size={16} />
                <span>
                  {showReview ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage("intro");
                  setShowStartModal(true);
                }}
                className="btn-secondary bg-white text-sm !py-3 !px-6 cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Coba Lagi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage("intro");
                  setShowReview(false);
                }}
                className="btn-ghost text-sm !py-3 !px-5 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Kembali ke Halaman Quiz</span>
              </button>
            </div>
          </section>

          {/* Bagian Pembahasan 40 Soal (Ditampilkan saat tombol Lihat Pembahasan diklik) */}
          {showReview && (
            <section className="mt-8 space-y-4" aria-label="Pembahasan soal ujian">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-[#E6E3D8] p-4">
                <h2 className="text-lg font-bold text-[#263A35]">
                  Pembahasan Lengkap ({filteredReviewItems.length} Soal)
                </h2>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setReviewFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      reviewFilter === "all"
                        ? "bg-[#174A3A] text-white"
                        : "bg-[#F8F7F2] text-[#66736D] hover:text-[#263A35]"
                    }`}
                  >
                    Semua (40)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("incorrect")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      reviewFilter === "incorrect"
                        ? "bg-error text-white"
                        : "bg-[#F8F7F2] text-[#66736D] hover:text-[#263A35]"
                    }`}
                  >
                    Salah / Kosong (
                    {examResult.wrongCount + examResult.unansweredCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("correct")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      reviewFilter === "correct"
                        ? "bg-[#174A3A] text-white"
                        : "bg-[#F8F7F2] text-[#66736D] hover:text-[#263A35]"
                    }`}
                  >
                    Benar ({examResult.correctCount})
                  </button>
                </div>
              </div>

              {filteredReviewItems.map((item) => {
                const originalNumber =
                  examResult.review.findIndex((r) => r.id === item.id) + 1;

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-white border border-[#E6E3D8] p-5 sm:p-6 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#174A3A]/10 text-[#174A3A] text-xs font-bold">
                          Soal #{originalNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F8F7F2] border border-[#E6E3D8] text-xs font-medium text-[#66736D]">
                          {item.category}
                        </span>
                      </div>

                      {item.chosenIndex === null ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning bg-warning/10 px-2.5 py-1 rounded-full">
                          <HelpCircle size={13} /> Tidak Dijawab
                        </span>
                      ) : item.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#174A3A] bg-[#174A3A]/10 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={13} /> Jawaban Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-error bg-error/10 px-2.5 py-1 rounded-full">
                          <XCircle size={13} /> Jawaban Salah
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#263A35] leading-snug mb-4">
                      {item.question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {item.options.map((opt, optIdx) => {
                        const isCorrectOpt = optIdx === item.correctIndex;
                        const isChosenOpt = optIdx === item.chosenIndex;

                        let boxClass =
                          "bg-[#F8F7F2] border-[#E6E3D8] text-[#66736D]";
                        if (isCorrectOpt) {
                          boxClass =
                            "bg-[#174A3A]/[0.08] border-[#174A3A] text-[#174A3A] font-semibold";
                        } else if (isChosenOpt && !isCorrectOpt) {
                          boxClass =
                            "bg-error/[0.06] border-error text-error font-semibold";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${boxClass}`}
                          >
                            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectOpt && (
                              <Check size={15} className="shrink-0 text-[#174A3A]" />
                            )}
                            {isChosenOpt && !isCorrectOpt && (
                              <X size={15} className="shrink-0 text-error" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FBF9F3] border border-[#D6B878]/40 text-xs sm:text-sm text-[#263A35] leading-relaxed">
                      <strong className="text-[#174A3A]">Pembahasan: </strong>
                      {item.explanation}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================================
     STAGE 2: HALAMAN PENGERJAAN UJIAN ("Ujian Pemahaman Islam" — 40 Soal)
  ============================================================================ */
  const currentQuestion = questions[currentIndex];
  const selectedOptionIndex = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#263A35] select-none">
      {/* Top Sticky Bar Ujian */}
      <header className="sticky top-14 lg:top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E6E3D8] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-bold text-[#174A3A]">
                  Ujian Pemahaman Islam
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#174A3A]/10 text-[#174A3A]">
                  Soal {currentIndex + 1} dari {EXAM_QUESTION_COUNT}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Badge Status Pelanggaran */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  violationCount === 0
                    ? "bg-[#174A3A]/[0.06] border-[#174A3A]/15 text-[#174A3A]"
                    : "bg-warning/15 border-warning/40 text-warning"
                }`}
                title="Jumlah pelanggaran meninggalkan halaman ujian"
              >
                <ShieldAlert size={14} />
                <span>{violationCount} Pelanggaran</span>
              </div>

              {/* Tombol Layar Penuh */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6E3D8] hover:border-[#174A3A]/40 bg-[#F8F7F2] text-xs font-medium text-[#263A35] transition-colors cursor-pointer"
                title={
                  isFullscreen ? "Keluar dari layar penuh" : "Masuk layar penuh"
                }
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 size={13} />
                    <span className="hidden sm:inline">Keluar Layar Penuh</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={13} />
                    <span className="hidden sm:inline">Layar Penuh</span>
                  </>
                )}
              </button>

              {/* Tombol Selesaikan Ujian di Header */}
              <button
                type="button"
                onClick={() => setShowFinishModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Selesaikan Ujian</span>
              </button>
            </div>
          </div>

          {/* Progress Bar Pengerjaan */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-[#66736D] mb-1">
              <span>
                Progres Pengerjaan:{" "}
                <strong className="text-[#263A35]">
                  {answeredCount} dari {EXAM_QUESTION_COUNT} soal terjawab
                </strong>
              </span>
              <span className="font-bold text-[#174A3A]">
                {progressPercentage}%
              </span>
            </div>
            <div className="h-2 bg-[#ECE9DF] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#174A3A] via-[#245C52] to-[#D6B878] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={answeredCount}
                aria-valuemin={0}
                aria-valuemax={EXAM_QUESTION_COUNT}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid: Kartu Pertanyaan (Kiri) + Navigasi 40 Nomor Soal (Kanan) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {errorBanner && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-error/10 border border-error/25 text-error text-sm flex items-center gap-3"
          >
            <AlertTriangle size={18} className="shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri (8 kolom): Soal & Pilihan Jawaban */}
          <div className="lg:col-span-8">
            {currentQuestion && (
              <div className="rounded-3xl bg-white border border-[#E6E3D8] p-6 sm:p-8 shadow-[0_6px_24px_-8px_rgba(23,74,58,0.06)]">
                {/* Meta Soal */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#174A3A]/[0.08] text-[#174A3A] border border-[#174A3A]/15">
                    Materi {currentQuestion.category}
                  </span>
                  <span className="text-xs font-medium text-[#66736D]">
                    {typeof selectedOptionIndex === "number"
                      ? "Sudah dijawab"
                      : "Belum dijawab"}
                  </span>
                </div>

                {/* Pertanyaan */}
                <h2 className="text-lg sm:text-xl font-bold text-[#263A35] leading-relaxed mb-6">
                  {currentQuestion.question}
                </h2>

                {/* 4 Pilihan Jawaban (A, B, C, D) */}
                <div
                  className="flex flex-col gap-3"
                  role="radiogroup"
                  aria-label={`Pilihan jawaban soal nomor ${currentIndex + 1}`}
                >
                  {currentQuestion.options.map((optionText, optIdx) => {
                    const isSelected = selectedOptionIndex === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() =>
                          handleSelectOption(currentQuestion.id, optIdx)
                        }
                        className={`group flex items-center gap-3.5 w-full text-left px-4 sm:px-5 py-4 rounded-2xl border-2 text-sm sm:text-[15px] transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#174A3A] bg-[#174A3A]/[0.06] text-[#174A3A] font-semibold shadow-2xs"
                            : "border-[#E6E3D8] hover:border-[#D6B878] bg-white hover:bg-[#FBF9F3] text-[#263A35]"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#174A3A] text-[#D6B878]"
                              : "bg-[#F8F7F2] text-[#66736D] group-hover:bg-[#174A3A]/10 group-hover:text-[#174A3A]"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 leading-snug">{optionText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tombol Navigasi Bawah: Sebelumnya, Selanjutnya, Selesaikan Ujian */}
                <div className="mt-8 pt-5 border-t border-[#F0EDE4] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6E3D8] bg-white hover:bg-[#F8F7F2] text-sm font-semibold text-[#263A35] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    {currentIndex < EXAM_QUESTION_COUNT - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentIndex((i) =>
                            Math.min(EXAM_QUESTION_COUNT - 1, i + 1)
                          )
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <span>Selanjutnya</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowFinishModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-[#D6B878] text-sm font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 size={16} />
                        <span>Selesaikan Ujian</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan (4 kolom): Navigasi Nomor Soal 1 - 40 */}
          <aside className="lg:col-span-4 rounded-3xl bg-white border border-[#E6E3D8] p-5 sm:p-6 shadow-[0_6px_24px_-8px_rgba(23,74,58,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#263A35]">
                Navigasi Nomor Soal
              </h2>
              <span className="text-xs text-[#66736D]">
                {answeredCount}/{EXAM_QUESTION_COUNT} Terjawab
              </span>
            </div>

            {/* Legenda Status Nomor Soal */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#66736D] mb-4 pb-3 border-b border-[#F0EDE4]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#174A3A] ring-2 ring-[#D6B878]" />
                Sedang dibuka
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#245C52]/90" />
                Sudah dijawab
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#F8F7F2] border border-[#D8D5C8]" />
                Belum dijawab
              </span>
            </div>

            {/* Grid 40 Nomor Soal */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = typeof answers[q.id] === "number";

                let btnStyle =
                  "bg-[#F8F7F2] text-[#66736D] border-[#E0DDD2] hover:border-[#174A3A]/40";
                if (isCurrent) {
                  btnStyle =
                    "bg-[#174A3A] text-white border-[#D6B878] ring-2 ring-[#D6B878] font-bold";
                } else if (isAnswered) {
                  btnStyle =
                    "bg-[#245C52] text-white border-[#245C52] font-semibold";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Soal nomor ${idx + 1} (${
                      isCurrent
                        ? "sedang dibuka"
                        : isAnswered
                        ? "sudah dijawab"
                        : "belum dijawab"
                    })`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`h-10 rounded-xl border text-xs transition-all flex items-center justify-center cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Tombol Selesaikan Ujian di Bawah Panel Navigasi */}
            <button
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="w-full mt-5 py-3 rounded-2xl bg-[#174A3A] hover:bg-[#245C52] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Selesaikan Ujian</span>
            </button>
          </aside>
        </div>
      </div>

      {/* ====================================================================
          OVERLAY PERINGATAN 5 DETIK KETIKA PESERTA MENINGGALKAN AREA UJIAN
      ==================================================================== */}
      {warningActive && (
        <div
          className="fixed inset-0 z-50 bg-[#103830]/90 backdrop-blur-md flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="warning-overlay-title"
        >
          <div className="bg-white rounded-3xl border-2 border-[#D6B878] max-w-md w-full p-6 sm:p-8 text-center shadow-2xl animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-warning/15 text-warning flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={34} />
            </div>

            <h2
              id="warning-overlay-title"
              className="text-xl sm:text-2xl font-bold text-[#263A35]"
            >
              Peringatan! Kamu meninggalkan area ujian.
            </h2>

            <p className="text-xs sm:text-sm text-[#66736D] mt-2">
              {warningReason === "pointer-leave"
                ? "Kursor terdeteksi keluar dari area halaman ujian."
                : "Kamu terdeteksi berpindah tab atau keluar dari jendela ujian."}
            </p>

            {/* Hitung Mundur 5 Detik */}
            <div className="my-6 py-4 px-6 rounded-2xl bg-[#F8F7F2] border border-[#D6B878]/60 inline-flex flex-col items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66736D] flex items-center gap-1.5">
                <Clock size={13} className="text-warning" />
                Batas Waktu Kembali
              </span>
              <span className="text-5xl font-bold text-error mt-1 tabular-nums">
                {warningSecondsLeft}
              </span>
              <span className="text-xs text-[#66736D] mt-0.5">detik</span>
            </div>

            <p className="text-sm font-medium text-[#263A35] leading-relaxed mb-6">
              Silakan kembali ke halaman ujian sebelum waktu habis.
            </p>

            <button
              type="button"
              onClick={dismissWarningBeforeTimeout}
              className="w-full py-3 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Saya Kembali ke Halaman Ujian
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL KETIKA HITUNG MUNDUR 5 DETIK HABIS (PELANGGARAN TERCATAT)
      ==================================================================== */}
      {violationRecordedModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="violation-recorded-title"
        >
          <div className="bg-white rounded-3xl border-2 border-error/40 max-w-md w-full p-6 sm:p-8 text-center shadow-2xl animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h2
              id="violation-recorded-title"
              className="text-lg sm:text-xl font-bold text-[#263A35]"
            >
              Batas Waktu Kembali Terlewati
            </h2>

            <p className="text-sm text-[#66736D] mt-2 leading-relaxed">
              Kamu telah meninggalkan area halaman ujian lebih dari{" "}
              <strong>5 detik</strong>. Aktivitas ini telah dicatat sebagai{" "}
              <strong className="text-error">
                Pelanggaran Aturan Ujian (#{violationCount})
              </strong>{" "}
              pada sesi ujianmu.
            </p>

            <div className="my-5 p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E6E3D8] text-xs text-[#263A35]">
              Jawaban yang sudah kamu kerjakan tetap tersimpan dengan aman.
              Harap tetap berada di halaman ujian hingga selesai.
            </div>

            <button
              type="button"
              onClick={() => setViolationRecordedModal(false)}
              className="w-full py-3 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Mengerti &amp; Lanjutkan Ujian
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          DIALOG KONFIRMASI SELESAIKAN UJIAN
      ==================================================================== */}
      {showFinishModal && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="finish-exam-modal-title"
        >
          <div className="bg-white rounded-3xl border border-[#D6B878]/50 max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            <h2
              id="finish-exam-modal-title"
              className="text-lg sm:text-xl font-bold text-[#263A35]"
            >
              Konfirmasi Selesaikan Ujian
            </h2>
            <p className="text-xs sm:text-sm text-[#66736D] mt-1">
              Periksa kembali ringkasan jawabanmu sebelum mengakhiri sesi ujian.
            </p>

            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="rounded-2xl bg-[#174A3A]/[0.06] border border-[#174A3A]/20 p-3.5 text-center">
                <p className="text-xs text-[#174A3A]">Sudah Dijawab</p>
                <p className="text-2xl font-bold text-[#174A3A] mt-0.5">
                  {answeredCount}
                </p>
              </div>
              <div
                className={`rounded-2xl p-3.5 text-center border ${
                  unansweredCount > 0
                    ? "bg-warning/10 border-warning/30 text-warning"
                    : "bg-[#F8F7F2] border-[#E6E3D8] text-[#66736D]"
                }`}
              >
                <p className="text-xs">Belum Dijawab</p>
                <p className="text-2xl font-bold mt-0.5">{unansweredCount}</p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="p-3.5 rounded-2xl bg-warning/10 border border-warning/30 text-xs text-[#263A35] mb-5 leading-relaxed">
                Masih terdapat <strong>{unansweredCount} soal</strong> yang belum
                dijawab. Kamu dapat kembali mengerjakannya terlebih dahulu agar
                nilai lebih maksimal.
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              {unansweredCount > 0 && firstUnansweredIndex >= 0 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setCurrentIndex(firstUnansweredIndex);
                    setShowFinishModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F8F7F2] hover:bg-[#ECE8DC] border border-[#D6B878] text-[#174A3A] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Kembali ke Soal Kosong (Soal #{firstUnansweredIndex + 1})
                </button>
              )}

              <div className="flex items-center justify-end gap-2.5 mt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E6E3D8] text-sm font-semibold text-[#66736D] hover:text-[#263A35] transition-colors cursor-pointer"
                >
                  Kembali ke Ujian
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmFinishExam}
                  className="flex-1 py-2.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? "Menilai Ujian..." : "Ya, Selesaikan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
