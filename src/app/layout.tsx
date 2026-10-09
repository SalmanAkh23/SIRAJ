import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { BookmarksProvider } from "@/lib/bookmark-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

// Ganti dengan domain produksi (atau set env NEXT_PUBLIC_SITE_URL) saat launch
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SIRAJ — Belajar. Mengamalkan. Berbagi.",
  description:
    "SIRAJ adalah platform pembelajaran Islam untuk membantu kamu mempelajari Al-Qur'an, hadits, doa, dan ilmu Islam secara bertahap.",
  keywords: ["Islam", "Al-Quran", "belajar", "hadits", "doa", "dzikir", "edukasi"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "SIRAJ",
    title: "SIRAJ — Belajar. Mengamalkan. Berbagi.",
    description:
      "Belajar Al-Qur'an, hadits, doa, dan ilmu Islam secara bertahap — satu langkah setiap hari.",
    images: [{ url: "/logo-512.png", width: 512, height: 512, alt: "Logo SIRAJ" }],
  },
  twitter: {
    card: "summary",
    title: "SIRAJ — Belajar. Mengamalkan. Berbagi.",
    description:
      "Belajar Al-Qur'an, hadits, doa, dan ilmu Islam secara bertahap — satu langkah setiap hari.",
    images: ["/logo-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${amiri.variable}`}>
        <body className="font-sans antialiased">
        <AuthProvider>
          <BookmarksProvider>{children}</BookmarksProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
