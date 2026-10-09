import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/[0.07] flex items-center justify-center mb-6">
        <Compass size={26} className="text-primary" strokeWidth={1.8} />
      </div>
      <span className="text-sm font-semibold text-primary tracking-widest">404</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-text mt-2">Halaman tidak ditemukan</h1>
      <p className="text-muted mt-3 max-w-md leading-relaxed">
        Halaman yang kamu cari mungkin sudah dipindahkan atau belum tersedia di SIRAJ.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link href="/" className="btn-secondary">
          Kembali ke Beranda
        </Link>
        <Link href="/dashboard" className="btn-primary">
          Buka Dashboard
        </Link>
      </div>
    </div>
  );
}
