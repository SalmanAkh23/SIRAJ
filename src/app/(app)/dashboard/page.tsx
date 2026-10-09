"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockUser } from "@/data/user";
import { getMateriById } from "@/data/materi";
import { dailyVerse } from "@/data/quran";
import { haditsList } from "@/data/hadits";
import { doaList } from "@/data/doa";
import {
  ArrowRight,
  BookOpen,
  Quote,
  HandHelping,
  Check,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";

const today = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(
    () => user?.dailyTasks ?? mockUser.dailyTasks
  );

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const topProgress = (user?.progress ?? mockUser.progress).slice(0, 3);
  const recentMateri = (user?.recentMateri ?? mockUser.recentMateri)
    .map((id) => getMateriById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const hadits = haditsList[0];
  const doa = doaList[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Greeting */}
      <header className="mb-8">
        <p className="text-sm text-muted">{today}</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-text tracking-tight mt-1">
          Assalamu&apos;alaikum 👋
        </h1>
        <p className="text-muted mt-1">Selamat datang kembali.</p>
      </header>

      {/* Hero card */}
      <section className="relative overflow-hidden bg-primary rounded-2xl p-8 lg:p-10 mb-10">
        <div className="absolute inset-0 pattern-star opacity-[0.07] pattern-fade" aria-hidden="true" />
        <div className="relative z-10 max-w-xl">
          <p className="text-xl lg:text-2xl font-semibold text-white leading-snug">
            Teruslah belajar, meski satu ilmu dalam sehari.
          </p>
          <p className="text-white/60 text-sm mt-3">
            Konsistensi kecil hari ini menjadi bekal besar di masa depan.
          </p>
          <Link
            href="/belajar/rukun-iman"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-primary rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            Lanjutkan Belajar
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Perjalanan Belajarmu */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Perjalanan Belajarmu</h2>
          <Link
            href="/profile"
            className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            Lihat semua
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topProgress.map((item) => (
            <div key={item.category} className="card">
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-medium text-text text-sm">{item.category}</span>
                <span className="text-sm font-semibold text-primary">{item.percentage}%</span>
              </div>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progres ${item.category}`}
              >
                <div className="progress-bar-fill" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hari Ini */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">Hari Ini</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={`/quran/${dailyVerse.surahNumber}`} className="card group">
            <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-3">
              <BookOpen size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Ayat Hari Ini</h3>
            <p className="text-sm text-muted leading-relaxed line-clamp-2">
              &ldquo;{dailyVerse.translation}&rdquo;
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3">
              QS. {dailyVerse.surahName}: {dailyVerse.ayatNumber}
              <ChevronRight size={13} />
            </span>
          </Link>

          <Link href="/hadits" className="card group">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mb-3">
              <Quote size={18} className="text-secondary-dark" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Hadits Hari Ini</h3>
            <p className="text-sm text-muted leading-relaxed line-clamp-2">
              &ldquo;{hadits.text}&rdquo;
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3">
              {hadits.source}
              <ChevronRight size={13} />
            </span>
          </Link>

          <Link href="/doa" className="card group">
            <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center mb-3">
              <HandHelping size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text text-sm mb-1">Doa Hari Ini</h3>
            <p className="text-sm text-muted leading-relaxed line-clamp-2">{doa.title}</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3">
              Amalkan hari ini
              <ChevronRight size={13} />
            </span>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Materi Terakhir */}
        <section className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-text mb-4">Materi Terakhir</h2>
          <div className="flex flex-col gap-3">
            {recentMateri.map((materi) => (
              <Link
                key={materi.id}
                href={`/belajar/${materi.id}`}
                className="card group flex items-center gap-4 !p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-primary !py-1 !px-2.5 !text-[11px]">
                      {materi.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Clock size={12} />
                      {materi.readTime} menit
                    </span>
                  </div>
                  <h3 className="font-semibold text-text text-sm truncate group-hover:text-primary transition-colors">
                    {materi.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="progress-bar flex-1 max-w-[160px]">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${materi.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">{materi.progress}%</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted shrink-0 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Tantangan Hari Ini */}
        <section>
          <h2 className="text-lg font-semibold text-text mb-4">Tantangan Hari Ini</h2>
          <div className="card">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-muted">Progress harian</span>
              <span className="text-sm font-semibold text-primary">
                {completedCount}/{tasks.length}
              </span>
            </div>
            <div className="progress-bar mb-5">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <ul className="flex flex-col gap-2.5">
              {tasks.map((task) => (
                <li key={task.id}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="sr-only peer"
                    />
                    <span
                      aria-hidden="true"
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                        task.completed
                          ? "bg-primary border-primary"
                          : "border-border bg-surface group-hover:border-primary/40"
                      }`}
                    >
                      {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        task.completed ? "text-muted line-through" : "text-text"
                      }`}
                    >
                      {task.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted">
              <Flame size={16} className="text-secondary-dark" />
              Streak kamu: <strong className="text-text">{user?.stats.streak ?? mockUser.stats.streak} hari</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
