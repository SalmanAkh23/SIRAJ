import Link from "next/link";
import Logo from "@/components/logo";

export default function Footer() {
  return (
    <footer className="bg-primary text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight mb-3">
              <Logo size={32} variant="light" />
              SIRAJ
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Belajar. Mengamalkan. Berbagi.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Jelajahi</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/quran" className="text-sm text-white/60 hover:text-white transition-colors">Al-Qur&apos;an</Link>
              <Link href="/belajar" className="text-sm text-white/60 hover:text-white transition-colors">Belajar</Link>
              <Link href="/doa" className="text-sm text-white/60 hover:text-white transition-colors">Doa & Dzikir</Link>
              <Link href="/hadits" className="text-sm text-white/60 hover:text-white transition-colors">Hadits</Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tentang</h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm text-white/60">Tentang SIRAJ</span>
              <span className="text-sm text-white/60">Kebijakan Privasi</span>
              <span className="text-sm text-white/60">Syarat & Ketentuan</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-white/40 text-xs text-center">
            © 2024 SIRAJ. Platform pembelajaran Islam.
          </p>
        </div>
      </div>
    </footer>
  );
}
