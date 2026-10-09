"use client";

import Link from "next/link";
import { useState } from "react";
import {
  quizCategories,
  getQuizByCategory,
  getMixedQuiz,
  type QuizQuestion,
} from "@/data/quiz";
import PageHeader from "@/components/page-header";
import {
  Trophy,
  Check,
  X,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Layers,
} from "lucide-react";

type Stage = "select" | "playing" | "result";

const categoryDescriptions: Record<string, string> = {
  Aqidah: "Dasar-dasar keimanan.",
  Fiqih: "Tuntunan ibadah sehari-hari.",
  Akhlak: "Akhlak terpuji dalam Islam.",
  Sirah: "Perjalanan Rasulullah ﷺ.",
  Adab: "Adab dalam keseharian.",
};

function questionCount(category: string): number {
  return category === "Semua" ? 10 : getQuizByCategory(category).length;
}

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("select");
  const [category, setCategory] = useState<string>("Semua");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = (cat: string) => {
    const list = cat === "Semua" ? getMixedQuiz(10) : getQuizByCategory(cat);
    if (list.length === 0) return;
    setCategory(cat);
    setQuestions(list);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStage("playing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === questions[index].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setStage("result");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const back = () => {
    setStage("select");
    setSelected(null);
    setQuestions([]);
  };

  /* ---------------- Stage: pilih kategori ---------------- */
  if (stage === "select") {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <PageHeader title="Uji Pemahamanmu" subtitle="Pilih kategori, lalu jawab beberapa pertanyaan sederhana." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => startQuiz("Semua")}
            className="card text-left hover:border-primary/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mb-3">
              <Layers size={18} className="text-secondary-dark" strokeWidth={1.8} />
            </div>
            <h2 className="font-semibold text-text group-hover:text-primary transition-colors">
              Semua Kategori
            </h2>
            <p className="text-sm text-muted mt-1">Campuran soal dari semua kategori.</p>
            <p className="text-xs font-medium text-primary mt-3">{questionCount("Semua")} soal</p>
          </button>

          {quizCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => startQuiz(cat)}
              className="card text-left hover:border-primary/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-3">
                <GraduationCap size={18} className="text-primary" strokeWidth={1.8} />
              </div>
              <h2 className="font-semibold text-text group-hover:text-primary transition-colors">
                {cat}
              </h2>
              <p className="text-sm text-muted mt-1">{categoryDescriptions[cat]}</p>
              <p className="text-xs font-medium text-primary mt-3">
                {questionCount(cat)} soal
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- Stage: hasil ---------------- */
  if (stage === "result") {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16">
        <div className="card text-center p-8 lg:p-10 animate-slide-up">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
              passed ? "bg-primary text-white" : "bg-secondary/20 text-secondary-dark"
            }`}
          >
            <Trophy size={26} strokeWidth={1.8} />
          </div>

          <p className="text-sm font-medium text-muted">Kategori {category}</p>
          <p className="text-5xl font-bold text-text mt-3 tracking-tight">
            {score}
            <span className="text-2xl text-muted font-semibold"> / {questions.length}</span>
          </p>
          <p className="text-sm text-muted mt-2">Skor kamu {percentage}%</p>

          <div className="progress-bar mt-6 max-w-xs mx-auto">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
          </div>

          <h2 className="text-xl font-semibold text-text mt-7">
            {passed ? "Bagus! Terus belajar." : "Terus berlatih, kamu semakin dekat."}
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
            {passed
              ? "Pemahamanmu sudah baik. Jaga konsistensi dengan belajar sedikit setiap hari."
              : "Tidak apa-apa. Pelajari lagi materinya, lalu coba ulangi kuisnya."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <button onClick={() => startQuiz(category)} className="btn-primary text-sm !py-2.5">
              <RotateCcw size={16} />
              Ulangi
            </button>
            <Link href="/belajar" className="btn-secondary text-sm !py-2.5">
              <ArrowLeft size={16} />
              Kembali Belajar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Stage: mengerjakan ---------------- */
  const current = questions[index];
  const isCorrect = selected === current.correctAnswer;
  const progress = ((index + (selected !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
      {/* Header quiz */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="badge badge-primary">{category}</span>
        <button
          onClick={back}
          className="text-sm font-medium text-muted hover:text-text transition-colors"
        >
          Keluar kuis
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-muted mb-2">
        <span>
          Soal <strong className="text-text">{index + 1}</strong> / {questions.length}
        </span>
        <span>
          Benar: <strong className="text-primary">{score}</strong>
        </span>
      </div>
      <div className="progress-bar mb-8">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Pertanyaan */}
      <div className="card p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-text leading-snug mb-6">
          {current.question}
        </h2>

        <div className="flex flex-col gap-3" role="group" aria-label="Pilihan jawaban">
          {current.options.map((option, i) => {
            const answered = selected !== null;
            const isThisCorrect = i === current.correctAnswer;
            const isThisSelected = i === selected;

            let stateClass =
              "border-border hover:border-primary/40 hover:bg-primary/[0.02]";
            if (answered && isThisCorrect) {
              stateClass = "border-primary bg-primary/[0.06] text-primary";
            } else if (answered && isThisSelected) {
              stateClass = "border-error bg-error/[0.05] text-error";
            } else if (answered) {
              stateClass = "border-border opacity-60";
            }

            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={answered}
                className={`flex items-center gap-3 w-full text-left px-4 py-3.5 border-2 rounded-xl text-sm font-medium transition-all disabled:cursor-default ${stateClass}`}
                aria-pressed={isThisSelected}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                    answered && isThisCorrect
                      ? "bg-primary border-primary text-white"
                      : answered && isThisSelected
                        ? "bg-error border-error text-white"
                        : "border-border text-muted"
                  }`}
                >
                  {answered && isThisCorrect ? (
                    <Check size={13} strokeWidth={3} />
                  ) : answered && isThisSelected ? (
                    <X size={13} strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className={answered && !isThisCorrect && !isThisSelected ? "text-muted" : ""}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <div
            className={`mt-6 p-4 rounded-xl border animate-fade-in ${
              isCorrect
                ? "bg-primary/[0.05] border-primary/15"
                : "bg-error/[0.04] border-error/15"
            }`}
            role="status"
          >
            <p
              className={`text-sm font-semibold mb-1.5 ${
                isCorrect ? "text-primary" : "text-error"
              }`}
            >
              {isCorrect ? "Jawaban benar!" : "Jawaban belum tepat."}
            </p>
            <p className="text-sm text-muted leading-relaxed">{current.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={next}
            disabled={selected === null}
            className="btn-primary text-sm !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {index + 1 >= questions.length ? "Lihat Hasil" : "Soal Berikutnya"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
