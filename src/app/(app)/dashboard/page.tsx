"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useBookmarks } from "@/lib/bookmark-context";
import UserAvatar from "@/components/user-avatar";
import { mockUser } from "@/data/user";
import { getMateriById } from "@/data/materi";
import { dailyVerse } from "@/data/quran";
import { haditsList } from "@/data/hadits";
import { doaList } from "@/data/doa";
import { getHijriDate } from "@/lib/salat";
import {
  ArrowRight,
  BookOpen,
  Quote,
  HandHelping,
  Check,
  Clock,
  ChevronRight,
  Flame,
  Trophy,
  GraduationCap,
  Bookmark,
  Sparkles,
  Settings,
  Calendar,
  ArrowUpRight,
  BookMarked,
} from "lucide-react";

const TASKS_STORAGE_KEY = "siraj_dashboard_daily_tasks";

const quickAccessItems = [
  {
    href: "/quran",
    label: "Al-Qur'an",
    desc: "30 Juz & Terjemahan",
    icon: BookOpen,
    accent: "text-primary bg-primary/10",
  },
  {
    href: "/jadwal-salat",
    label: "Jadwal Salat",
    desc: "Waktu Salat & Kiblat",
    icon: Clock,
    accent: "text-primary bg-primary/10",
  },
  {
    href: "/belajar",
    label: "Belajar Islam",
    desc: "Aqidah, Fiqih, Akhlak & Sirah",
    icon: GraduationCap,
    accent: "text-primary bg-primary/10",
  },
  {
    href: "/doa",
    label: "Doa & Dzikir",
    desc: "Kumpulan Doa Harian",
    icon: HandHelping,
    accent: "text-primary bg-primary/10",
  },
  {
    href: "/hadits",
    label: "Kutipan Hadits",
    desc: "Hadits Shahih Tematik",
    icon: BookMarked,
    accent: "text-primary bg-primary/10",
  },
  {
    href: "/quiz",
    label: "Kuis Islami",
    desc: "Uji Pemahaman Agama",
    icon: Trophy,
    accent: "text-secondary-dark bg-secondary/15",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();

  // Dynamic Dates
  const todayMasehi = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const hijri = useMemo(() => {
    return getHijriDate(new Date());
  }, []);

  // Daily Tasks state with local storage persistence
  const [tasks, setTasks] = useState(() => {
    const defaultTasks = user?.dailyTasks ?? mockUser.dailyTasks;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(TASKS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return defaultTasks;
  });

  const toggleTask = (id: string) => {
    setTasks((prev: typeof tasks) => {
      const next = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // User Stats & Progress Calculations
  const stats = user?.stats ?? mockUser.stats;
  const userProgress = user?.progress ?? mockUser.progress;

  const avgProgress = useMemo(() => {
    if (!userProgress.length) return 0;
    const sum = userProgress.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / userProgress.length);
  }, [userProgress]);

  // Recent materi resolution
  const recentMateri = useMemo(() => {
    const list = user?.recentMateri ?? mockUser.recentMateri;
    return list
      .map((id) => getMateriById(id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [user?.recentMateri]);

  // Greeting name
  const userName = user?.name ? user.name.trim() : null;

  const hadits = haditsList[0];
  const doa = doaList[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* 1. Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Dynamic Date badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-muted mb-2.5 shadow-xs">
            <Calendar size={13} className="text-primary" />
            <span>{todayMasehi}</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="text-secondary-dark font-medium">{hijri.formatted}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Assalamu&apos;alaikum{userName ? `, ${userName.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm sm:text-base text-muted mt-1 leading-relaxed">
            Selamat datang di SIRAJ. Mari lanjutkan ikhtiar belajar dan mengamalkan ilmu kebaikan hari ini.
          </p>
        </div>

        {/* User Profile Quick Link */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-3 p-2 pr-3.5 bg-surface hover:bg-primary/[0.03] border border-border hover:border-primary/30 rounded-2xl transition-all shadow-xs shrink-0 self-start md:self-auto group"
          title="Buka Profil dan Pengaturan"
        >
          <UserAvatar
            size="md"
            rounded="xl"
            className="group-hover:scale-105 transition-transform"
          />
          <div className="text-left min-w-0">
            <span className="block text-xs font-bold text-text truncate max-w-[140px]">
              {userName || "Profil Saya"}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted">
              <Settings size={11} className="shrink-0" /> Pengaturan
            </span>
          </div>
          <ChevronRight size={15} className="text-muted group-hover:text-primary transition-colors ml-1 shrink-0" />
        </Link>
      </header>

      {/* 2. Kartu Utama (Hero Focus Card) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light rounded-3xl p-7 sm:p-9 lg:p-10 mb-8 text-white shadow-sm border border-secondary/20">
        {/* Subtle Islamic Geometrical Background Pattern */}
        <div
          className="absolute inset-0 pattern-star opacity-10 pattern-fade pointer-events-none"
          aria-hidden="true"
        />

        {/* Decorative Golden Rosette Accent (subtle right watermark) */}
        <div
          className="absolute -right-8 -bottom-10 w-64 h-64 opacity-15 pointer-events-none"
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="#D6B878" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="50" y="50" width="100" height="100" stroke="#D6B878" strokeWidth="1.5" rx="4" />
            <rect x="50" y="50" width="100" height="100" stroke="#D6B878" strokeWidth="1.5" rx="4" transform="rotate(45 100 100)" />
            <circle cx="100" cy="100" r="25" stroke="#D6B878" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-secondary-light mb-3.5 border border-white/10">
            <Sparkles size={13} className="text-secondary" />
            <span>Pesan Hari Ini</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            Perjalanan ilmu dimulai dari satu langkah.
          </h2>

          <p className="text-white/80 text-sm sm:text-base mt-3 leading-relaxed max-w-xl">
            Luangkan sedikit waktu setiap hari untuk mempelajari Al-Qur&apos;an, memperdalam sunnah, dan menata adab ibadah dengan konsisten.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-7">
            <Link
              href="/belajar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-white/90 transition-all shadow-sm hover:shadow"
            >
              Lanjutkan Belajar
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/quran"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-medium text-sm transition-colors backdrop-blur-sm"
            >
              <BookOpen size={16} />
              Buka Al-Qur&apos;an
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Ringkasan Aktivitas Belajar (Activity Summary Metric Cards) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-bold text-text">Ringkasan Aktivitas</h2>
          <Link
            href="/profile"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-light transition-colors"
          >
            Detail Akun
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Materi Selesai */}
          <div className="card !p-5 flex flex-col justify-between hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted">Materi Dipelajari</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text tracking-tight">
                {stats.materiCompleted}
              </div>
              <span className="text-xs text-muted mt-0.5 block">Materi terselesaikan</span>
            </div>
          </div>

          {/* Card 2: Rata-rata Progres */}
          <div className="card !p-5 flex flex-col justify-between hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted">Rata-rata Progres</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary tracking-tight">
                {avgProgress}%
              </div>
              <div className="w-full bg-border h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Item Disimpan (Real Bookmarks) */}
          <div className="card !p-5 flex flex-col justify-between hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted">Tersimpan</span>
              <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary-dark flex items-center justify-center">
                <Bookmark size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text tracking-tight">
                {bookmarks.length}
              </div>
              <span className="text-xs text-muted mt-0.5 block">Ayat, hadits, &amp; doa</span>
            </div>
          </div>

          {/* Card 4: Streak */}
          <div className="card !p-5 flex flex-col justify-between hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted">Konsistensi Belajar</span>
              <div className="w-8 h-8 rounded-lg bg-warning/15 text-warning flex items-center justify-center">
                <Flame size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text tracking-tight">
                {stats.streak} <span className="text-sm font-semibold text-muted">Hari</span>
              </div>
              <span className="text-xs text-muted mt-0.5 block">Streak aktif</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Akses Cepat (Quick Access Grid) */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-text">Akses Cepat</h2>
            <p className="text-xs text-muted mt-0.5">Pintasan menuju fitur-fitur utama SIRAJ</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="card !p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all group flex flex-col justify-between text-left"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${item.accent}`}
                  >
                    <Icon size={19} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-text text-sm group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{item.label}</span>
                    <ArrowUpRight
                      size={13}
                      className="text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all"
                    />
                  </h3>
                  <p className="text-[11px] text-muted mt-1 leading-snug line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Main Content Grid: Rekomendasi/Materi Terakhir + Tantangan Harian */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Left Column (2/3): Materi Terakhir & Inspirasi Hari Ini */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Lanjutkan Materi Terakhir */}
          <section>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-lg font-bold text-text">Lanjutkan Belajar</h2>
              <Link
                href="/belajar"
                className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-light transition-colors"
              >
                Semua Materi
              </Link>
            </div>

            {recentMateri.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentMateri.map((materi) => (
                  <Link
                    key={materi.id}
                    href={`/belajar/${materi.id}`}
                    className="card group flex items-center justify-between gap-4 !p-4 hover:border-primary/40 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-primary !py-0.5 !px-2 !text-[11px] font-semibold">
                          {materi.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <Clock size={12} />
                          {materi.readTime} menit baca
                        </span>
                      </div>
                      <h3 className="font-bold text-text text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                        {materi.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 max-w-xs">
                        <div className="progress-bar flex-1 h-1.5">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${materi.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-muted">
                          {materi.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-primary/5 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center shrink-0 transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card !p-8 text-center bg-surface border-border">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <GraduationCap size={24} />
                </div>
                <h3 className="font-bold text-text text-base">Belum Ada Materi yang Dibuka</h3>
                <p className="text-xs sm:text-sm text-muted mt-1 max-w-sm mx-auto">
                  Mulai perjalanan menuntut ilmu dengan membaca materi dasar Aqidah, Fiqih, atau Akhlak.
                </p>
                <Link
                  href="/belajar"
                  className="btn-primary text-xs font-semibold !py-2 !px-4 mt-4 inline-flex items-center gap-1.5"
                >
                  Mulai Memilih Materi
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </section>

          {/* Section: Inspirasi Hari Ini */}
          <section>
            <h2 className="text-lg font-bold text-text mb-3.5">Inspirasi Harian</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Ayat Hari Ini */}
              <Link
                href={`/quran/${dailyVerse.surahNumber}`}
                className="card group hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <BookOpen size={17} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                    Ayat Hari Ini
                  </span>
                  <p className="text-xs text-muted leading-relaxed line-clamp-3 italic">
                    &ldquo;{dailyVerse.translation}&rdquo;
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-text group-hover:text-primary transition-colors mt-4 pt-3 border-t border-border/60">
                  QS. {dailyVerse.surahName}: {dailyVerse.ayatNumber}
                  <ChevronRight size={13} />
                </span>
              </Link>

              {/* Hadits Hari Ini */}
              <Link
                href="/hadits"
                className="card group hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary-dark flex items-center justify-center mb-3">
                    <Quote size={17} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark block mb-1">
                    Hadits Hari Ini
                  </span>
                  <p className="text-xs text-muted leading-relaxed line-clamp-3">
                    &ldquo;{hadits.text}&rdquo;
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-text group-hover:text-primary transition-colors mt-4 pt-3 border-t border-border/60">
                  {hadits.source}
                  <ChevronRight size={13} />
                </span>
              </Link>

              {/* Doa Hari Ini */}
              <Link
                href="/doa"
                className="card group hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <HandHelping size={17} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
                    Doa Pilihan
                  </span>
                  <h4 className="text-xs font-bold text-text line-clamp-1 mb-1">
                    {doa.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    Amalkan doa harian ini untuk memohon keberkahan dan perlindungan Allah.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-text group-hover:text-primary transition-colors mt-4 pt-3 border-t border-border/60">
                  Buka Kumpulan Doa
                  <ChevronRight size={13} />
                </span>
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column (1/3): Tantangan Harian & Kategori Belajar */}
        <div className="space-y-6">
          {/* Tantangan Hari Ini (Daily Checklist) */}
          <section className="card !p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-text">Tantangan Harian</h2>
              <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                {completedCount}/{tasks.length} Selesai
              </span>
            </div>

            <p className="text-xs text-muted mb-3.5">
              Rutin kecil harian untuk menjaga keistiqamahan ibadah dan belajar.
            </p>

            {/* Progress Bar */}
            <div className="progress-bar h-2 mb-5">
              <div
                className="progress-bar-fill transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Tasks list */}
            <ul className="flex flex-col gap-2.5">
              {tasks.map((task) => (
                <li key={task.id}>
                  <label className="flex items-center gap-3 cursor-pointer group select-none p-2 rounded-xl hover:bg-primary/[0.03] transition-colors">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="sr-only peer"
                    />
                    <span
                      aria-hidden="true"
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                        task.completed
                          ? "bg-primary border-primary text-white"
                          : "border-border bg-surface group-hover:border-primary/50"
                      }`}
                    >
                      {task.completed && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        task.completed ? "text-muted line-through" : "text-text"
                      }`}
                    >
                      {task.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            {/* Streak & Note */}
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <Flame size={15} className="text-warning" />
                <span>Streak: <strong className="text-text">{stats.streak} hari</strong></span>
              </div>
              {completedCount === tasks.length && (
                <span className="text-primary font-bold text-[11px] animate-fade-in">
                  Alhamdulillah tercapai! 🎉
                </span>
              )}
            </div>
          </section>

          {/* Progres Pemahaman Kategori */}
          <section className="card !p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text">Progres Kategori</h2>
              <Link
                href="/profile"
                className="text-xs font-semibold text-primary hover:text-primary-light"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3.5">
              {userProgress.slice(0, 4).map((item) => (
                <div key={item.category}>
                  <div className="flex items-baseline justify-between text-xs mb-1 font-medium">
                    <span className="text-text">{item.category}</span>
                    <span className="font-bold text-primary">{item.percentage}%</span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border text-center">
              <Link
                href="/belajar"
                className="text-xs font-semibold text-primary hover:text-primary-light inline-flex items-center gap-1"
              >
                Eksplorasi Semua Kategori
                <ChevronRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
