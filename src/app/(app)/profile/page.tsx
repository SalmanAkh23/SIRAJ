"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockUser } from "@/data/user";
import { useBookmarks } from "@/lib/bookmark-context";
import {
  BookOpen,
  Trophy,
  Bookmark,
  Flame,
  Pencil,
  Bell,
  SlidersHorizontal,
  LogOut,
  Check,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? mockUser.name);
  const [email, setEmail] = useState(user?.email ?? mockUser.email);
  const [saved, setSaved] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const stats = [
    { label: "Materi selesai", value: user?.stats.materiCompleted ?? mockUser.stats.materiCompleted, icon: BookOpen },
    { label: "Quiz selesai", value: user?.stats.quizCompleted ?? mockUser.stats.quizCompleted, icon: Trophy },
    { label: "Bookmark", value: bookmarks.length, icon: Bookmark },
    { label: "Streak", value: `${user?.stats.streak ?? mockUser.stats.streak} hari`, icon: Flame },
  ];

  const progress = user?.progress ?? mockUser.progress;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim(), email: email.trim() });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (user?.name ?? mockUser.name)
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Profile header */}
      <header className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-text truncate">{user?.name ?? mockUser.name}</h1>
            <p className="text-sm text-muted truncate">{user?.email ?? mockUser.email}</p>
          </div>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary animate-fade-in">
              <Check size={15} />
              Tersimpan
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}>
                <div className="flex items-center gap-1.5 text-muted mb-1.5">
                  <Icon size={14} />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-text">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </header>

      {/* Perjalanan Belajar */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-text mb-4">Perjalanan Belajar</h2>
        <div className="card grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {progress.map((item) => (
            <div key={item.category}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium text-text">{item.category}</span>
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

      {/* Pengaturan */}
      <section id="pengaturan" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-text mb-4">Pengaturan</h2>

        <div className="card !p-0 overflow-hidden">
          {/* Edit profil */}
          <div className="p-5 border-b border-border">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center justify-between w-full text-left group"
              aria-expanded={editing}
            >
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-primary/[0.07] flex items-center justify-center">
                  <Pencil size={16} className="text-primary" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-text">Edit profil</span>
                  <span className="block text-xs text-muted">Ubah nama dan email kamu</span>
                </span>
              </span>
              <span className="text-sm font-medium text-primary group-hover:underline">
                {editing ? "Tutup" : "Ubah"}
              </span>
            </button>

            {editing && (
              <form onSubmit={handleSave} className="mt-5 pl-12 space-y-4 animate-fade-in">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-text mb-1.5">
                    Nama lengkap
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-text mb-1.5">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm !py-2.5">
                    Simpan perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-ghost"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Notifikasi */}
          <div className="p-5 border-b border-border flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-primary/[0.07] flex items-center justify-center">
                <Bell size={16} className="text-primary" />
              </span>
              <span>
                <span className="block text-sm font-medium text-text">Notifikasi</span>
                <span className="block text-xs text-muted">Pengingat belajar harian</span>
              </span>
            </span>
            <button
              role="switch"
              aria-checked={notifications}
              aria-label="Notifikasi"
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                notifications ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  notifications ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Preferensi */}
          <div className="p-5 border-b border-border flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-primary/[0.07] flex items-center justify-center">
                <SlidersHorizontal size={16} className="text-primary" />
              </span>
              <span>
                <span className="block text-sm font-medium text-text">Preferensi</span>
                <span className="block text-xs text-muted">Mode hemat kuota saat membaca</span>
              </span>
            </span>
            <button
              role="switch"
              aria-checked={reminders}
              aria-label="Preferensi mode hemat kuota"
              onClick={() => setReminders(!reminders)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                reminders ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  reminders ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Keluar */}
          <div className="p-5 flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-error/[0.07] flex items-center justify-center">
                <LogOut size={16} className="text-error" />
              </span>
              <span>
                <span className="block text-sm font-medium text-text">Keluar</span>
                <span className="block text-xs text-muted">Akhiri sesi di perangkat ini</span>
              </span>
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium text-error hover:bg-error/5 px-4 py-2 rounded-lg transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </section>

      {/* CTA ke bookmark */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/bookmark" className="btn-secondary text-sm !py-2.5">
          <Bookmark size={16} />
          Lihat disimpan ({bookmarks.length})
        </Link>
        <Link href="/quiz" className="btn-secondary text-sm !py-2.5">
          <Trophy size={16} />
          Coba kuis lagi
        </Link>
      </div>
    </div>
  );
}
