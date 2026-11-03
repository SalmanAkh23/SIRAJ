"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockUser } from "@/data/user";
import UserAvatar from "@/components/user-avatar";
import { useBookmarks } from "@/lib/bookmark-context";
import { getMateriById, materiList } from "@/data/materi";
import {
  readLastRead,
  readJuzProgressMap,
  type QuranLastRead,
  type JuzProgressEntry,
} from "@/lib/quran-api";
import type { ExamSubmitResponse } from "@/app/api/quiz/route";
import {
  BookOpen,
  Trophy,
  Bookmark,
  Pencil,
  Bell,
  SlidersHorizontal,
  LogOut,
  Check,
  Camera,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  AtSign,
  ShieldCheck,
  KeyRound,
  Clock,
  GraduationCap,
  HandHelping,
  BookMarked,
  ChevronRight,
  Trash2,
  AlertCircle,
  Sparkles,
  Award,
  X,
} from "lucide-react";

const PREFS_STORAGE_KEY = "siraj-profile-preferences-v1";
const QURAN_TRANSLATION_KEY = "siraj-quran-show-translation";
const LAST_EXAM_RESULT_KEY = "siraj-exam-last-result-v1";
const EXAM_HISTORY_KEY = "siraj-exam-history-v1";

interface UserPreferences {
  dailyReminder: boolean;
  dataSaverMode: boolean;
}

function formatIndonesianDate(isoOrDate?: string): string {
  if (!isoOrDate) return "—";
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return isoOrDate;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Kompres & potong gambar profil menjadi persegi 256x256 Data URL agar ringan disimpan */
function resizeAvatarImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File harus berupa gambar (JPG, PNG, atau WebP)."));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error("Ukuran foto maksimal 4 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format gambar tidak didukung."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const targetSize = 256;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal memproses gambar."));
          return;
        }
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(
          img,
          sx,
          sy,
          minSide,
          minSide,
          0,
          0,
          targetSize,
          targetSize
        );
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Edit Profile Form state
  const [formName, setFormName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Preferences & Activity Data from storage
  const [prefs, setPrefs] = useState<UserPreferences>({
    dailyReminder: true,
    dataSaverMode: false,
  });
  const [showQuranTranslation, setShowQuranTranslation] = useState(true);
  const [lastReadQuran, setLastReadQuran] = useState<QuranLastRead | null>(
    null
  );
  const [juzProgressList, setJuzProgressList] = useState<JuzProgressEntry[]>(
    []
  );
  const [examHistory, setExamHistory] = useState<ExamSubmitResponse[]>([]);

  // Muat data aktivitas aktual & preferensi dari localStorage
  useEffect(() => {
    try {
      const rawPrefs = localStorage.getItem(PREFS_STORAGE_KEY);
      if (rawPrefs) {
        const parsed = JSON.parse(rawPrefs) as Partial<UserPreferences>;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrasi preferensi dan riwayat aktual dari localStorage
        setPrefs({
          dailyReminder: parsed.dailyReminder ?? true,
          dataSaverMode: parsed.dataSaverMode ?? false,
        });
      }

      const rawTrans = localStorage.getItem(QURAN_TRANSLATION_KEY);
      if (rawTrans !== null) {
        setShowQuranTranslation(rawTrans === "1");
      }

      setLastReadQuran(readLastRead());
      const juzMap = readJuzProgressMap();
      setJuzProgressList(
        Object.values(juzMap).sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );

      const rawHist = localStorage.getItem(EXAM_HISTORY_KEY);
      const rawLastExam = localStorage.getItem(LAST_EXAM_RESULT_KEY);
      if (rawHist) {
        const parsedHist = JSON.parse(rawHist);
        if (Array.isArray(parsedHist) && parsedHist.length > 0) {
          setExamHistory(parsedHist as ExamSubmitResponse[]);
        }
      } else if (rawLastExam) {
        const parsedLast = JSON.parse(rawLastExam) as ExamSubmitResponse;
        if (parsedLast && parsedLast.sessionId) {
          setExamHistory([parsedLast]);
        }
      }
    } catch {
      // abaikan
    }
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeUser = user ?? mockUser;
  const displayUsername =
    activeUser.username ||
    activeUser.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

  // Buka Modal Edit Profil dengan data terkini
  const openEditProfileModal = () => {
    setFormName(activeUser.name);
    setFormUsername(displayUsername);
    setFormPhone(activeUser.phone ?? "");
    setFormError(null);
    setShowEditModal(true);
  };

  // Simpan perubahan Informasi Pribadi
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = formName.trim();
    const trimmedUsername = formUsername
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
    const trimmedPhone = formPhone.trim();

    if (trimmedName.length < 2) {
      setFormError("Nama lengkap minimal harus 2 karakter.");
      return;
    }
    if (!/^[a-z0-9_]{3,24}$/.test(trimmedUsername)) {
      setFormError(
        "Username harus 3–24 karakter dan hanya boleh berisi huruf kecil, angka, atau garis bawah (_)."
      );
      return;
    }
    if (trimmedPhone && !/^[0-9+\-\s()]{8,18}$/.test(trimmedPhone)) {
      setFormError("Format nomor telepon tidak valid (gunakan 8–18 digit).");
      return;
    }

    setIsSavingProfile(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    updateProfile({
      name: trimmedName,
      username: trimmedUsername,
      phone: trimmedPhone,
    });

    setIsSavingProfile(false);
    setShowEditModal(false);
    setToast({
      type: "success",
      message: "Informasi pribadi berhasil diperbarui.",
    });
  };

  // Unggah Foto Profil
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await resizeAvatarImage(file);
      updateProfile({ avatar: dataUrl });
      setToast({
        type: "success",
        message: "Foto profil berhasil diperbarui.",
      });
    } catch (err) {
      setToast({
        type: "error",
        message:
          err instanceof Error ? err.message : "Gagal mengunggah foto profil.",
      });
    }
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatar: "" });
    setToast({
      type: "success",
      message: "Foto profil dikembalikan ke avatar default.",
    });
  };

  // Simpan Password Baru
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
      setToast({
        type: "success",
        message: "Password akun berhasil diperbarui.",
      });
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Gagal memperbarui password."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Toggle Preferensi & Notifikasi
  const updatePreference = (key: keyof UserPreferences, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // abaikan
    }
    setToast({
      type: "success",
      message: "Pengaturan preferensi berhasil disimpan.",
    });
  };

  const toggleQuranTranslationPref = () => {
    const next = !showQuranTranslation;
    setShowQuranTranslation(next);
    try {
      localStorage.setItem(QURAN_TRANSLATION_KEY, next ? "1" : "0");
    } catch {
      // abaikan
    }
    setToast({
      type: "success",
      message: `Terjemahan Al-Qur'an diatur ke ${
        next ? "Aktif" : "Disembunyikan"
      }.`,
    });
  };

  // ==========================================================================
  // Kalkulasi Statistik Belajar dari Data Aktual Pengguna
  // ==========================================================================
  const progressList = activeUser.progress ?? mockUser.progress;

  const avgLearningProgress = useMemo(() => {
    if (!progressList.length) return 0;
    const total = progressList.reduce((acc, item) => acc + item.percentage, 0);
    return Math.round(total / progressList.length);
  }, [progressList]);

  const materiStudiedCount = useMemo(() => {
    const startedInList = materiList.filter((m) => m.progress > 0).length;
    return Math.max(activeUser.stats.materiCompleted, startedInList);
  }, [activeUser.stats.materiCompleted]);

  const totalQuizCompleted = useMemo(() => {
    return examHistory.length > 0
      ? examHistory.length
      : activeUser.stats.quizCompleted;
  }, [examHistory.length, activeUser.stats.quizCompleted]);

  const avgQuizScore = useMemo(() => {
    if (examHistory.length === 0) return null;
    const sum = examHistory.reduce((acc, item) => acc + item.score, 0);
    const avg = sum / examHistory.length;
    return Number.isInteger(avg) ? avg : Number(avg.toFixed(1));
  }, [examHistory]);

  const recentMateriItems = useMemo(() => {
    const ids = activeUser.recentMateri ?? [];
    return ids
      .map((id) => getMateriById(id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [activeUser.recentMateri]);

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#263A35]">
      {/* Input File Tersembunyi untuk Upload Foto Profil */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleAvatarFileChange}
        className="sr-only"
        aria-label="Unggah foto profil"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Toast Notification */}
        {toast && (
          <div
            role="status"
            className={`fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm px-4 py-3 rounded-2xl shadow-lg border flex items-center gap-2.5 text-sm font-medium animate-fade-in ${
              toast.type === "success"
                ? "bg-[#174A3A] text-white border-[#D6B878]/50"
                : "bg-error text-white border-error"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={16} className="text-[#D6B878] shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* ==================================================================
            1. PROFILE HEADER — MODERN ISLAMIC USER PROFILE DASHBOARD
        ================================================================== */}
        <header className="relative overflow-hidden rounded-3xl border border-[#D6B878]/45 bg-gradient-to-br from-[#174A3A] via-[#1C5544] to-[#245C52] text-white shadow-[0_14px_38px_-12px_rgba(23,74,58,0.28)] mb-8">
          {/* Aksen Garis Emas Atas */}
          <div
            className="h-1.5 w-full bg-gradient-to-r from-[#D6B878]/40 via-[#D6B878] to-[#D6B878]/40"
            aria-hidden="true"
          />

          {/* Ornamen Geometri Islami Opacity Rendah */}
          <div
            className="absolute inset-0 pattern-star opacity-[0.07] pointer-events-none"
            aria-hidden="true"
          />

          {/* Ornamen Rosette Emas di Kanan Header */}
          <div
            className="absolute -right-12 -bottom-16 w-72 h-72 opacity-[0.12] pointer-events-none"
            aria-hidden="true"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="88" stroke="#D6B878" strokeWidth="1.5" strokeDasharray="4 4" />
              <rect x="44" y="44" width="112" height="112" stroke="#D6B878" strokeWidth="1.5" />
              <rect
                x="44"
                y="44"
                width="112"
                height="112"
                transform="rotate(45 100 100)"
                stroke="#D6B878"
                strokeWidth="1.5"
              />
              <circle cx="100" cy="100" r="32" stroke="#D6B878" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-9">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Foto Profil + Identitas */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Avatar Container */}
                <div className="relative self-start sm:self-auto">
                  <UserAvatar
                    size="xl"
                    rounded="3xl"
                    className="border-2 border-[#D6B878] bg-[#103830] shadow-lg"
                    fallbackClassName="text-[#D6B878]"
                  />

                  {/* Tombol Kamera Cepat */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#D6B878] hover:bg-[#e3c88b] text-[#17211D] flex items-center justify-center shadow-md border border-white/40 transition-transform hover:scale-105 cursor-pointer"
                    title="Ubah foto profil"
                    aria-label="Ubah foto profil"
                  >
                    <Camera size={15} />
                  </button>
                </div>

                {/* Nama, Username, Email, Status & Tanggal Bergabung */}
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">
                      {activeUser.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D6B878]/20 text-[#D6B878] border border-[#D6B878]/40">
                      <ShieldCheck size={12} />
                      Akun Aktif
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-white/85">
                    <span className="inline-flex items-center gap-1 font-medium text-[#D6B878]">
                      <AtSign size={13} />
                      {displayUsername}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={13} className="text-white/70" />
                      {activeUser.email}
                    </span>
                  </div>

                  {activeUser.joinedAt && (
                    <p className="text-xs text-white/75 flex items-center gap-1.5 pt-0.5">
                      <Calendar size={13} className="text-[#D6B878]" />
                      <span>
                        Bergabung sejak{" "}
                        {formatIndonesianDate(activeUser.joinedAt)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Tombol Edit Profil di Header */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D6B878] hover:bg-[#e3c88b] text-[#17211D] font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  <Pencil size={15} />
                  <span>Edit Profil</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ==================================================================
            2. STATISTIK BELAJAR (DARI DATA AKTUAL PENGGUNA)
        ================================================================== */}
        <section className="mb-8" aria-labelledby="heading-statistik-belajar">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#174A3A] to-[#D6B878]"
                aria-hidden="true"
              />
              <h2
                id="heading-statistik-belajar"
                className="text-lg sm:text-xl font-bold text-[#263A35]"
              >
                Statistik Belajar
              </h2>
            </div>
            <span className="text-xs text-[#718078]">
              Ringkasan capaian belajar aktual
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* Stat 1: Total Materi */}
            <div className="bg-white rounded-2xl border border-[#E6E3D8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(23,74,58,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#718078]">
                  Materi Dipelajari
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center">
                  <BookOpen size={17} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#263A35]">
                  {materiStudiedCount}
                </p>
                <p className="text-[11px] text-[#718078] mt-0.5">
                  Materi pembelajaran Islam
                </p>
              </div>
            </div>

            {/* Stat 2: Total Quiz Dikerjakan */}
            <div className="bg-white rounded-2xl border border-[#E6E3D8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(23,74,58,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#718078]">
                  Quiz Dikerjakan
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#245C52]/[0.08] text-[#245C52] flex items-center justify-center">
                  <Trophy size={17} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#263A35]">
                  {totalQuizCompleted}
                </p>
                <p className="text-[11px] text-[#718078] mt-0.5">
                  Sesi evaluasi selesai
                </p>
              </div>
            </div>

            {/* Stat 3: Rata-rata Nilai Quiz */}
            <div className="bg-white rounded-2xl border border-[#E6E3D8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(23,74,58,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#718078]">
                  Rata-rata Nilai Quiz
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#D6B878]/20 text-[#174A3A] flex items-center justify-center">
                  <Award size={17} />
                </div>
              </div>
              <div>
                {avgQuizScore !== null ? (
                  <>
                    <p className="text-2xl font-bold text-[#174A3A]">
                      {avgQuizScore}
                      <span className="text-xs font-normal text-[#718078]">
                        {" "}
                        / 100
                      </span>
                    </p>
                    <p className="text-[11px] text-[#718078] mt-0.5">
                      Dari {examHistory.length} ujian 40 soal
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-bold text-[#263A35]">
                      Belum ada nilai
                    </p>
                    <Link
                      href="/quiz"
                      className="text-[11px] font-semibold text-[#174A3A] hover:underline mt-0.5 inline-block"
                    >
                      Mulai ujian 40 soal &rarr;
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stat 4: Total Bookmark */}
            <div className="bg-white rounded-2xl border border-[#E6E3D8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(23,74,58,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#718078]">
                  Total Tersimpan
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center">
                  <Bookmark size={17} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#263A35]">
                  {bookmarks.length}
                </p>
                <p className="text-[11px] text-[#718078] mt-0.5">
                  Ayat, materi, hadits &amp; doa
                </p>
              </div>
            </div>

            {/* Stat 5: Rata-rata Progress Belajar */}
            <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-[#E6E3D8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(23,74,58,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#718078]">
                  Progres Belajar
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center">
                  <GraduationCap size={17} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#174A3A]">
                  {avgLearningProgress}%
                </p>
                <div className="h-1.5 bg-[#ECE9DF] rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#174A3A] to-[#D6B878] rounded-full"
                    style={{ width: `${avgLearningProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. GRID 2 KOLOM DESKTOP:
               KIRI: INFORMASI PRIBADI & PROGRES KATEGORI
               KANAN: AKTIVITAS TERBARU & PENGATURAN AKUN
        ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* KOLOM KIRI (5 KOLOM) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Kartu Informasi Pribadi */}
            <section
              aria-labelledby="heading-info-pribadi"
              className="bg-white rounded-2xl border border-[#E6E3D8] p-6 shadow-[0_2px_14px_rgba(23,74,58,0.04)]"
            >
              <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[#F0EDE4]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                  <h2
                    id="heading-info-pribadi"
                    className="text-base sm:text-lg font-bold text-[#263A35]"
                  >
                    Informasi Pribadi
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={openEditProfileModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174A3A] hover:text-[#245C52] bg-[#174A3A]/[0.06] hover:bg-[#174A3A]/[0.12] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <dl className="space-y-4 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#F4F2EB]">
                  <dt className="text-xs font-medium text-[#718078] flex items-center gap-1.5">
                    <UserIcon size={13} />
                    Nama Lengkap
                  </dt>
                  <dd className="font-semibold text-[#263A35]">
                    {activeUser.name}
                  </dd>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#F4F2EB]">
                  <dt className="text-xs font-medium text-[#718078] flex items-center gap-1.5">
                    <AtSign size={13} />
                    Username
                  </dt>
                  <dd className="font-semibold text-[#174A3A]">
                    @{displayUsername}
                  </dd>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#F4F2EB]">
                  <dt className="text-xs font-medium text-[#718078] flex items-center gap-1.5">
                    <Mail size={13} />
                    Email Akun
                  </dt>
                  <dd className="font-medium text-[#263A35] truncate">
                    {activeUser.email}
                  </dd>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#F4F2EB]">
                  <dt className="text-xs font-medium text-[#718078] flex items-center gap-1.5">
                    <Phone size={13} />
                    Nomor Telepon
                  </dt>
                  <dd className="font-medium text-[#263A35]">
                    {activeUser.phone ? (
                      activeUser.phone
                    ) : (
                      <span className="text-xs italic text-[#718078]">
                        Belum ditambahkan
                      </span>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <dt className="text-xs font-medium text-[#718078] flex items-center gap-1.5">
                    <Calendar size={13} />
                    Tanggal Bergabung
                  </dt>
                  <dd className="font-medium text-[#263A35]">
                    {formatIndonesianDate(activeUser.joinedAt)}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Kartu Progres Pembelajaran per Kategori */}
            <section
              aria-labelledby="heading-progres-kategori"
              className="bg-white rounded-2xl border border-[#E6E3D8] p-6 shadow-[0_2px_14px_rgba(23,74,58,0.04)]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EDE4]">
                <h2
                  id="heading-progres-kategori"
                  className="text-base sm:text-lg font-bold text-[#263A35]"
                >
                  Progres Materi per Kategori
                </h2>
                <Link
                  href="/belajar"
                  className="text-xs font-semibold text-[#174A3A] hover:underline"
                >
                  Buka Materi
                </Link>
              </div>

              <div className="space-y-4">
                {progressList.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                      <span className="font-semibold text-[#263A35]">
                        {item.category}
                      </span>
                      <span className="font-bold text-[#174A3A]">
                        {item.percentage}%
                      </span>
                    </div>
                    <div
                      className="h-2 bg-[#ECE9DF] rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={item.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progres ${item.category}`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#174A3A] via-[#245C52] to-[#D6B878] transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Progres Bacaan Juz Al-Qur'an jika tersedia */}
              {juzProgressList.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#F0EDE4]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#718078]">
                      Progres Bacaan Juz Al-Qur&apos;an
                    </span>
                    <Link
                      href="/quran?mode=juz"
                      className="text-xs font-semibold text-[#174A3A] hover:underline"
                    >
                      30 Juz
                    </Link>
                  </div>
                  <div className="space-y-2.5">
                    {juzProgressList.slice(0, 3).map((jp) => (
                      <Link
                        key={jp.juzNumber}
                        href={`/quran/juz/${jp.juzNumber}#ayat-${jp.lastSurahNumber}-${jp.lastVerseNumber}`}
                        className="block p-3 rounded-xl bg-[#F8F7F2] hover:bg-[#174A3A]/[0.05] border border-[#E6E3D8] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-[#263A35]">
                            Juz {jp.juzNumber} (QS. {jp.lastSurahName}:{" "}
                            {jp.lastVerseNumber})
                          </span>
                          <span className="text-[#174A3A]">
                            {jp.percentage}%
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* KOLOM KANAN (7 KOLOM): AKTIVITAS TERBARU & PENGATURAN AKUN */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bagian Aktivitas Terbaru Pengguna */}
            <section
              aria-labelledby="heading-aktivitas-terbaru"
              className="bg-white rounded-2xl border border-[#E6E3D8] p-6 shadow-[0_2px_14px_rgba(23,74,58,0.04)]"
            >
              <div className="flex items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[#F0EDE4]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h2
                      id="heading-aktivitas-terbaru"
                      className="text-base sm:text-lg font-bold text-[#263A35]"
                    >
                      Aktivitas Terbaru
                    </h2>
                  </div>
                </div>
                <span className="text-xs text-[#718078]">
                  Riwayat belajar &amp; ibadahmu
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. Aktivitas Terakhir Membaca Al-Qur'an */}
                {lastReadQuran ? (
                  <Link
                    href={`/quran/juz/${lastReadQuran.juzNumber}#ayat-${lastReadQuran.surahNumber}-${lastReadQuran.verseNumber}`}
                    className="group flex items-start justify-between gap-3.5 p-3.5 rounded-2xl bg-[#F8F7F2] hover:bg-[#174A3A]/[0.04] border border-[#E6E3D8] hover:border-[#D6B878] transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#174A3A] text-[#D6B878] flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen size={17} />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#174A3A]">
                          Terakhir Membaca Al-Qur&apos;an
                        </span>
                        <h3 className="text-sm font-bold text-[#263A35] group-hover:text-[#174A3A] transition-colors truncate">
                          QS. {lastReadQuran.surahName}: Ayat{" "}
                          {lastReadQuran.verseNumber} (Juz{" "}
                          {lastReadQuran.juzNumber})
                        </h3>
                        <p className="text-xs text-[#718078] mt-0.5">
                          Progres Juz {lastReadQuran.juzNumber}:{" "}
                          {lastReadQuran.percentageInJuz}% •{" "}
                          {formatIndonesianDate(lastReadQuran.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-[#718078] group-hover:text-[#174A3A] shrink-0 self-center"
                    />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F8F7F2] border border-[#E6E3D8]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#174A3A]/10 text-[#174A3A] flex items-center justify-center shrink-0">
                        <BookOpen size={17} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#263A35]">
                          Bacaan Al-Qur&apos;an
                        </p>
                        <p className="text-xs text-[#718078]">
                          Tandai ayat terakhir dibaca saat membuka Al-Qur&apos;an.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/quran"
                      className="text-xs font-semibold text-[#174A3A] hover:underline shrink-0"
                    >
                      Mulai Baca &rarr;
                    </Link>
                  </div>
                )}

                {/* 2. Aktivitas Quiz Terakhir Dikerjakan */}
                {examHistory.length > 0 && (
                  <Link
                    href="/quiz"
                    className="group flex items-start justify-between gap-3.5 p-3.5 rounded-2xl bg-[#F8F7F2] hover:bg-[#174A3A]/[0.04] border border-[#E6E3D8] hover:border-[#D6B878] transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#D6B878]/25 text-[#174A3A] flex items-center justify-center shrink-0 mt-0.5">
                        <Trophy size={17} />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#B89246]">
                          Ujian Quiz Terakhir
                        </span>
                        <h3 className="text-sm font-bold text-[#263A35] group-hover:text-[#174A3A] transition-colors truncate">
                          Ujian Pemahaman Islam — Nilai {examHistory[0].score}/100
                        </h3>
                        <p className="text-xs text-[#718078] mt-0.5">
                          Benar {examHistory[0].correctCount} dari{" "}
                          {examHistory[0].totalQuestions} soal •{" "}
                          {formatIndonesianDate(examHistory[0].submittedAt)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-[#718078] group-hover:text-[#174A3A] shrink-0 self-center"
                    />
                  </Link>
                )}

                {/* 3. Materi yang Terakhir Dipelajari */}
                {recentMateriItems.slice(0, 2).map((materi) => (
                  <Link
                    key={materi.id}
                    href={`/belajar/${materi.id}`}
                    className="group flex items-start justify-between gap-3.5 p-3.5 rounded-2xl bg-[#F8F7F2] hover:bg-[#174A3A]/[0.04] border border-[#E6E3D8] hover:border-[#D6B878] transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#174A3A]/10 text-[#174A3A] flex items-center justify-center shrink-0 mt-0.5">
                        <GraduationCap size={17} />
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#245C52]">
                          Materi Dipelajari • {materi.category}
                        </span>
                        <h3 className="text-sm font-bold text-[#263A35] group-hover:text-[#174A3A] transition-colors truncate">
                          {materi.title}
                        </h3>
                        <p className="text-xs text-[#718078] mt-0.5">
                          Progres bacaan {materi.progress}% • {materi.readTime}{" "}
                          menit baca
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-[#718078] group-hover:text-[#174A3A] shrink-0 self-center"
                    />
                  </Link>
                ))}

                {/* 4. Item Terbaru yang Disimpan (Doa, Hadits, Ayat) */}
                {bookmarks.slice(0, 3).map((bm) => {
                  const Icon =
                    bm.type === "doa"
                      ? HandHelping
                      : bm.type === "hadits"
                      ? BookMarked
                      : bm.type === "ayat"
                      ? BookOpen
                      : GraduationCap;

                  return (
                    <Link
                      key={bm.id}
                      href={bm.href || "/bookmark"}
                      className="group flex items-start justify-between gap-3.5 p-3.5 rounded-2xl bg-[#F8F7F2] hover:bg-[#174A3A]/[0.04] border border-[#E6E3D8] hover:border-[#D6B878] transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E6E3D8] text-[#174A3A] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#718078]">
                            Disimpan ({bm.type}) •{" "}
                            {formatIndonesianDate(bm.savedAt)}
                          </span>
                          <h3 className="text-sm font-bold text-[#263A35] group-hover:text-[#174A3A] transition-colors truncate">
                            {bm.title}
                          </h3>
                          <p className="text-xs text-[#718078] line-clamp-1 mt-0.5">
                            {bm.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[#718078] group-hover:text-[#174A3A] shrink-0 self-center"
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EDE4] flex items-center justify-between text-xs">
                <Link
                  href="/bookmark"
                  className="font-semibold text-[#174A3A] hover:underline inline-flex items-center gap-1"
                >
                  <Bookmark size={13} />
                  <span>Lihat semua item tersimpan ({bookmarks.length})</span>
                </Link>
                <Link
                  href="/quiz"
                  className="font-semibold text-[#174A3A] hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles size={13} />
                  <span>Uji pemahaman di Quiz</span>
                </Link>
              </div>
            </section>

            {/* Bagian Pengaturan Akun (#pengaturan) */}
            <section
              id="pengaturan"
              aria-labelledby="heading-pengaturan-akun"
              className="scroll-mt-24 bg-white rounded-2xl border border-[#E6E3D8] overflow-hidden shadow-[0_2px_14px_rgba(23,74,58,0.04)]"
            >
              <div className="p-6 pb-4 border-b border-[#F0EDE4]">
                <h2
                  id="heading-pengaturan-akun"
                  className="text-base sm:text-lg font-bold text-[#263A35]"
                >
                  Pengaturan Akun
                </h2>
                <p className="text-xs text-[#718078] mt-0.5">
                  Kelola foto profil, informasi pribadi, keamanan, dan preferensi
                  aplikasi SIRAJ.
                </p>
              </div>

              <div className="divide-y divide-[#F0EDE4]">
                {/* 1. Ubah Foto Profil */}
                <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <UserAvatar size="md" rounded="xl" />
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Foto Profil
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Unggah foto baru (JPG, PNG, WebP) atau gunakan avatar
                        inisial
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeUser.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-error hover:bg-error/5 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#174A3A]/10 border border-[#E6E3D8] text-xs font-semibold text-[#174A3A] transition-colors cursor-pointer"
                    >
                      Pilih Foto
                    </button>
                  </div>
                </div>

                {/* 2. Edit Informasi Pribadi */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center shrink-0">
                      <Pencil size={17} />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Edit Informasi Pribadi
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Perbarui nama lengkap, username, dan nomor telepon
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openEditProfileModal}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#174A3A]/10 border border-[#E6E3D8] text-xs font-semibold text-[#174A3A] transition-colors cursor-pointer"
                  >
                    Ubah Data
                  </button>
                </div>

                {/* 3. Ubah Password */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center shrink-0">
                      <KeyRound size={17} />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Keamanan &amp; Password
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Perbarui kata sandi masuk akun SIRAJ kamu
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError(null);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setShowPasswordModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#174A3A]/10 border border-[#E6E3D8] text-xs font-semibold text-[#174A3A] transition-colors cursor-pointer"
                  >
                    Ubah Password
                  </button>
                </div>

                {/* 4. Pengaturan Notifikasi */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center shrink-0">
                      <Bell size={17} />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Notifikasi Pengingat Belajar
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Pengingat harian membaca Al-Qur&apos;an, dzikir, dan materi
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.dailyReminder}
                    aria-label="Notifikasi pengingat belajar harian"
                    onClick={() =>
                      updatePreference("dailyReminder", !prefs.dailyReminder)
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                      prefs.dailyReminder ? "bg-[#174A3A]" : "bg-[#D8D5C8]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        prefs.dailyReminder ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* 5. Preferensi Terjemahan Al-Qur'an */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center shrink-0">
                      <BookOpen size={17} />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Tampilkan Terjemahan Al-Qur&apos;an
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Otomatis tampilkan terjemahan Bahasa Indonesia saat
                        membaca Surah &amp; Juz
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showQuranTranslation}
                    aria-label="Tampilkan terjemahan Al-Qur'an"
                    onClick={toggleQuranTranslationPref}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                      showQuranTranslation ? "bg-[#174A3A]" : "bg-[#D8D5C8]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        showQuranTranslation ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* 6. Preferensi Mode Hemat Kuota */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A] flex items-center justify-center shrink-0">
                      <SlidersHorizontal size={17} />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Preferensi Mode Hemat Kuota
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Muat audio murottal hanya saat tombol putar ditekan
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.dataSaverMode}
                    aria-label="Preferensi mode hemat kuota"
                    onClick={() =>
                      updatePreference("dataSaverMode", !prefs.dataSaverMode)
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                      prefs.dataSaverMode ? "bg-[#174A3A]" : "bg-[#D8D5C8]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                        prefs.dataSaverMode ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* 7. Keluar dari Sesi Akun */}
                <div className="p-5 flex items-center justify-between gap-4 bg-error/[0.02]">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                      <LogOut size={17} />
                    </span>
                    <div>
                      <span className="block text-sm font-semibold text-[#263A35]">
                        Keluar dari Akun
                      </span>
                      <span className="block text-xs text-[#718078]">
                        Akhiri sesi masuk pada perangkat ini dengan aman
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="px-4 py-1.5 rounded-lg border border-error/30 text-xs font-semibold text-error hover:bg-error hover:text-white transition-colors cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MODAL EDIT INFORMASI PRIBADI
      ==================================================================== */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-edit-profile-title"
        >
          <div className="bg-white rounded-3xl border border-[#D6B878]/50 max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2
                  id="modal-edit-profile-title"
                  className="text-lg sm:text-xl font-bold text-[#263A35]"
                >
                  Edit Informasi Pribadi
                </h2>
                <p className="text-xs text-[#718078] mt-0.5">
                  Perbarui data profil akun SIRAJ milikmu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-[#718078] hover:text-[#263A35] hover:bg-[#F8F7F2]"
                aria-label="Tutup modal edit profil"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-error/10 border border-error/25 text-xs text-error flex items-center gap-2"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="edit-profile-name"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Nama Lengkap
                </label>
                <input
                  id="edit-profile-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="input"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="edit-profile-username"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm text-[#718078] select-none">
                    @
                  </span>
                  <input
                    id="edit-profile-username"
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="input pl-8"
                    placeholder="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-profile-email"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Email Akun (Terhubung dengan Autentikasi)
                </label>
                <input
                  id="edit-profile-email"
                  type="email"
                  value={activeUser.email}
                  disabled
                  readOnly
                  className="input bg-[#F8F7F2] text-[#718078] cursor-not-allowed"
                />
                <p className="text-[11px] text-[#718078] mt-1">
                  Alamat email dikunci demi keamanan sesi autentikasi akun.
                </p>
              </div>

              <div>
                <label
                  htmlFor="edit-profile-phone"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Nomor Telepon (Opsional)
                </label>
                <input
                  id="edit-profile-phone"
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="input"
                  placeholder="Contoh: 0812-3456-7890"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E3D8] text-xs sm:text-sm font-semibold text-[#718078] hover:text-[#263A35] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL UBAH PASSWORD
      ==================================================================== */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-change-password-title"
        >
          <div className="bg-white rounded-3xl border border-[#D6B878]/50 max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2
                  id="modal-change-password-title"
                  className="text-lg sm:text-xl font-bold text-[#263A35]"
                >
                  Ubah Password Akun
                </h2>
                <p className="text-xs text-[#718078] mt-0.5">
                  Pastikan password baru minimal terdiri dari 6 karakter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-lg text-[#718078] hover:text-[#263A35] hover:bg-[#F8F7F2]"
                aria-label="Tutup modal ubah password"
              >
                <X size={18} />
              </button>
            </div>

            {passwordError && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-error/10 border border-error/25 text-xs text-error flex items-center gap-2"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Password Saat Ini
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  placeholder="Masukkan password saat ini"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Password Baru
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-xs font-semibold text-[#263A35] mb-1.5"
                >
                  Konfirmasi Password Baru
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Ulangi password baru"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  disabled={isSavingPassword}
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E3D8] text-xs sm:text-sm font-semibold text-[#718078] hover:text-[#263A35] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-5 py-2.5 rounded-xl bg-[#174A3A] hover:bg-[#245C52] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSavingPassword ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL KONFIRMASI KELUAR AKUN (LOGOUT)
      ==================================================================== */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-logout-title"
        >
          <div className="bg-white rounded-3xl border border-[#E6E3D8] max-w-sm w-full p-6 text-center shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mx-auto mb-3.5">
              <LogOut size={22} />
            </div>
            <h2
              id="modal-logout-title"
              className="text-lg font-bold text-[#263A35]"
            >
              Keluar dari Akun SIRAJ?
            </h2>
            <p className="text-xs sm:text-sm text-[#718078] mt-1.5 leading-relaxed">
              Progres belajar, bookmark, dan pengaturan profilmu tetap tersimpan
              dengan aman ketika kamu masuk kembali.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E6E3D8] text-xs sm:text-sm font-semibold text-[#718078] hover:text-[#263A35] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-error hover:bg-error/90 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
