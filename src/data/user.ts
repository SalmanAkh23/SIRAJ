export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats: {
    materiCompleted: number;
    quizCompleted: number;
    bookmarks: number;
    streak: number;
  };
  progress: {
    category: string;
    percentage: number;
  }[];
  dailyTasks: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  recentMateri: string[];
}

export const mockUser: User = {
  id: "user-1",
  name: "Ahmad Fauzi",
  email: "ahmad.fauzi@email.com",
  stats: {
    materiCompleted: 12,
    quizCompleted: 5,
    bookmarks: 18,
    streak: 7,
  },
  progress: [
    { category: "Fiqih", percentage: 80 },
    { category: "Aqidah", percentage: 60 },
    { category: "Akhlak", percentage: 40 },
    { category: "Sirah", percentage: 20 },
    { category: "Adab", percentage: 10 },
    { category: "Tafsir", percentage: 5 },
  ],
  dailyTasks: [
    { id: "task-1", label: "Membaca Al-Qur'an", completed: false },
    { id: "task-2", label: "Membaca satu hadits", completed: false },
    { id: "task-3", label: "Mempelajari satu materi", completed: false },
    { id: "task-4", label: "Membaca doa harian", completed: false },
  ],
  recentMateri: ["rukun-iman", "thaharah", "akhlak-rasulullah"],
};

export interface BookmarkItem {
  id: string;
  type: "ayat" | "materi" | "hadits" | "doa";
  title: string;
  description: string;
  href?: string;
  savedAt: string;
}

export const mockBookmarks: BookmarkItem[] = [
  {
    id: "ayat-1-5",
    type: "ayat",
    title: "Al-Fatihah: 5",
    description: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.",
    href: "/quran/1",
    savedAt: "2024-03-15",
  },
  {
    id: "materi-rukun-iman",
    type: "materi",
    title: "Memahami Rukun Iman",
    description: "Mengenal enam perkara yang wajib diimani oleh setiap Muslim.",
    href: "/belajar/rukun-iman",
    savedAt: "2024-03-14",
  },
  {
    id: "hadits-1",
    type: "hadits",
    title: "Hadits tentang Niat",
    description: "Sesungguhnya setiap amalan tergantung pada niatnya.",
    href: "/hadits",
    savedAt: "2024-03-13",
  },
  {
    id: "doa-bangun-tidur",
    type: "doa",
    title: "Doa Bangun Tidur",
    description: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami.",
    href: "/doa",
    savedAt: "2024-03-12",
  },
  {
    id: "ayat-2-2",
    type: "ayat",
    title: "Al-Baqarah: 2",
    description: "Kitab (Al-Qur'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.",
    href: "/quran/2",
    savedAt: "2024-03-11",
  },
  {
    id: "materi-thaharah",
    type: "materi",
    title: "Panduan Thaharah (Bersuci)",
    description: "Memahami konsep bersuci dalam Islam.",
    href: "/belajar/thaharah",
    savedAt: "2024-03-10",
  },
];
