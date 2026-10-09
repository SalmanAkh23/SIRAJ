"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/logo";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  HandHelping,
  BookMarked,
  Trophy,
  Bookmark,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quran", label: "Al-Qur'an", icon: BookOpen },
  { href: "/belajar", label: "Belajar", icon: GraduationCap },
  { href: "/doa", label: "Doa & Dzikir", icon: HandHelping },
  { href: "/hadits", label: "Hadits", icon: BookMarked },
  { href: "/quiz", label: "Quiz", icon: Trophy },
];

const bottomLinks = [
  { href: "/bookmark", label: "Disimpan", icon: Bookmark },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/profile#pengaturan", label: "Pengaturan", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-primary font-bold text-lg tracking-tight">
          <Logo size={32} />
          SIRAJ
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-muted hover:text-text rounded-lg transition-colors"
          aria-label="Tutup sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Links */}
      <div className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-0.5">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-primary bg-primary/[0.07]"
                    : "text-muted hover:text-text hover:bg-primary/[0.03]"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-border" />

        <div className="flex flex-col gap-0.5">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-primary bg-primary/[0.07]"
                    : "text-muted hover:text-text hover:bg-primary/[0.03]"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-error hover:bg-error/5 transition-all w-full"
        >
          <LogOut size={18} strokeWidth={1.8} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-border h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40 animate-fade-in"
            onClick={onClose}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-surface z-50 shadow-xl animate-slide-up">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
