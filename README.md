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

## Suara adzan otomatis

Letakkan rekaman adzan yang Anda miliki atau berlisensi untuk digunakan di
`public/audio/adzan/subuh.mp3`. Pengaturan suara, volume, dan notifikasi tersedia di
**Profil → Pengaturan Akun**. Browser dapat meminta interaksi pengguna sebelum
memutar audio; gunakan tombol **Aktifkan Suara Adzan** untuk menguji dan
mengizinkan pemutaran.

Di mode development, tombol **Test Adzan** dan **Test Adzan Subuh** di bagian
pengaturan langsung menguji audio Subuh tanpa menunggu jadwal. Tombol ini tidak
mengubah jadwal sebenarnya dan tidak tersedia di production.

## PWA dan persiapan Android

SIRAJ menyediakan web app manifest di `src/app/manifest.ts` dan ikon dari logo
yang sama di `public/logo-192.png` serta `public/logo-512.png`. Di browser yang
mendukungnya, tombol **Install SIRAJ** membuka prompt instalasi; browser lain
menampilkan petunjuk untuk menambahkan situs ke layar utama. PWA harus dibuka
dari HTTPS (Vercel sudah menyediakan HTTPS) atau `localhost`.

Service worker belum digunakan agar jadwal salat, API, dan data akun tidak
ter-cache secara usang. Saat offline, SIRAJ memberi tahu pengguna bahwa beberapa
fitur memerlukan koneksi; konten offline belum tersedia.

APK/AAB belum dibuat. Aplikasi Next.js ini memakai API routes dan halaman
server-rendered, sehingga belum dapat langsung diekspor sebagai aset statis
untuk dibundel ke Capacitor. Sebelum membuat paket Android dengan web app lokal,
perlu diputuskan cara memindahkan/menyediakan API dan mengadaptasi halaman
server-rendered. Alternatif shell WebView yang memuat website Vercel tetap
bergantung pada internet dan perlu peninjauan autentikasi serta navigasi native.

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
