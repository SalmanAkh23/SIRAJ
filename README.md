# SIRAJ

**Belajar. Mengamalkan. Berbagi.**

SIRAJ adalah platform digital edukasi dan dakwah Islam: Al-Qur'an, materi pembelajaran, doa & dzikir, hadits, quiz, dan progress belajar — dirancang modern, minimal, dan nyaman dibaca di perangkat apa pun.

## Menjalankan proyek

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm run start    # jalankan build produksi
npm run lint     # eslint
```

## Struktur

```
src/
├── app/
│   ├── (app)/              # halaman yang butuh login (dilindungi AuthLayout)
│   │   ├── dashboard/
│   │   ├── quran/          # daftar surah + detail surah ([number])
│   │   ├── belajar/        # daftar materi + detail materi ([id])
│   │   ├── doa/
│   │   ├── hadits/
│   │   ├── quiz/
│   │   ├── profile/
│   │   └── bookmark/
│   ├── login/
│   ├── register/
│   ├── page.tsx            # landing page
│   ├── layout.tsx          # root layout (font, metadata, providers)
│   ├── not-found.tsx       # halaman 404
│   └── globals.css         # design tokens (Tailwind v4 @theme)
├── components/             # navbar, sidebar, footer, auth-layout, ui kecil
├── data/                   # mock data terstruktur (Phase 1, tanpa backend)
│   ├── quran.ts            # surah, ayat, ayat harian
│   ├── materi.ts           # kategori + materi (konten artikel)
│   ├── doa.ts              # doa & dzikir per kategori
│   ├── hadits.ts           # hadits + sumber periwayat
│   ├── quiz.ts             # soal per kategori
│   └── user.ts             # mock user, progress, bookmark awal
└── lib/
    ├── auth-context.tsx    # mock auth (session di localStorage)
    ├── bookmark-context.tsx# state bookmark (localStorage)
    └── utils.ts            # cn() helper
```

## Design tokens

Warna utama: `#174A3A` (primary), `#D6B878` (gold), `#F8F7F2` (background), `#FFFFFF` (surface), `#17211D` (text), `#66736D` (muted), `#E5E5DE` (border).

Font: **Inter** untuk UI, **Amiri** untuk teks Arab (via `next/font`).

## Catatan Phase

- **Phase 1 (sekarang):** mock data + mock auth. Seluruh alur Landing → Login → Dashboard → semua halaman sudah bisa dinavigasi.
- **Phase 2:** ganti `auth-context` dengan Supabase Auth, pindahkan mock data ke database, lalu tambahkan fitur "Tanya Ilmu" dengan sumber yang dapat diverifikasi.

## Aturan konten Islam

1. Tidak mengarang ayat Al-Qur'an atau hadits.
2. Setiap hadits dan doa ditampilkan bersama sumbernya.
3. Konten tanpa sumber ditandai sebagai contoh data.
4. SIRAJ tidak menggantikan ustadz, ulama, atau fatwa resmi.
