import type { Metadata, Viewport } from "next";
import { Inter, Amiri, Amiri_Quran } from "next/font/google";
import "./globals.css";
import PwaExperience from "@/components/pwa-experience";
import { AuthProvider } from "@/lib/auth-context";
import { BookmarksProvider } from "@/lib/bookmark-context";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

// Font khusus bacaan Al-Qur'an (bentuk glyph sesuai teks Uthmani)
const amiriQuran = Amiri_Quran({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-amiri-quran",
});

// Ganti dengan domain produksi (atau set env NEXT_PUBLIC_SITE_URL) saat launch
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SIRAJ — Belajar. Mengamalkan. Berbagi.",
  description: "Platform edukasi Islam dan dakwah",
  keywords: ["Islam", "Al-Quran", "belajar", "hadits", "doa", "dzikir", "edukasi"],
  applicationName: "SIRAJ",
  appleWebApp: {
    capable: true,
    title: "SIRAJ",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo-192.png", sizes: "192x192", type: "image/png" }],
  },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#174A3A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${amiri.variable} ${amiriQuran.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try { var theme = localStorage.getItem('siraj-theme'); if (theme === 'dark') document.documentElement.dataset.theme = 'dark'; var language = localStorage.getItem('siraj-language'); document.documentElement.lang = language === 'en' ? 'en' : 'id'; } catch (error) {}",
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <PwaExperience />
          <ThemeProvider>
            <AuthProvider>
              <BookmarksProvider>{children}</BookmarksProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
