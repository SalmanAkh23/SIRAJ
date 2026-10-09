"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Logo from "@/components/logo";
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  HandHelping,
  User,
} from "lucide-react";

const bottomNavLinks = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/quran", label: "Al-Qur'an", icon: BookOpen },
  { href: "/belajar", label: "Belajar", icon: GraduationCap },
  { href: "/doa", label: "Doa", icon: HandHelping },
  { href: "/profile", label: "Profil", icon: User },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold animate-pulse">
            S
          </div>
          <p className="text-muted text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-muted hover:text-text rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            <span className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
              <Logo size={26} />
              SIRAJ
            </span>
            <div className="w-9" />
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border"
        aria-label="Navigasi utama"
      >
        <div className="grid grid-cols-5">
          {bottomNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted hover:text-text"
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
