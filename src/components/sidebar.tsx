"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/logo";
import UserAvatar from "@/components/user-avatar";
import ThemeToggle from "@/components/theme-toggle";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Bookmark,
  User,
  Settings,
  LogOut,
  X,
  Clock,
  Mic,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const mainLinks = [
  { href: "/dashboard", labelKey: "navigation.dashboard", icon: LayoutDashboard },
  { href: "/jadwal-salat", labelKey: "navigation.prayerSchedule", icon: Clock },
  { href: "/quran", labelKey: "navigation.quran", icon: BookOpen },
  { href: "/murajaah", labelKey: "navigation.murajaah", icon: Mic },
  { href: "/book", labelKey: "navigation.book", icon: BookMarked },
];

const bottomLinks = [
  { href: "/bookmark", labelKey: "navigation.saved", icon: Bookmark },
  { href: "/profile", labelKey: "navigation.profile", icon: User },
  { href: "/profile#pengaturan", labelKey: "navigation.settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const bookFeatureRoutes = ["/belajar", "/doa", "/hadits", "/quiz"];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-border/70">
        <Link href="/dashboard" className="flex items-center gap-2.5 text-primary font-bold text-lg tracking-tight">
          <Logo size={32} />
          SIRAJ
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-muted hover:text-text rounded-lg transition-colors"
          aria-label={t("common.close")}
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Links */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted/80">
          {t("common.mainMenu")}
        </p>
        <div className="flex flex-col gap-1">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              pathname.startsWith(link.href + "/") ||
              (link.href === "/book" &&
                bookFeatureRoutes.some(
                  (route) => pathname === route || pathname.startsWith(route + "/")
                ));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-11 items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-primary bg-primary/[0.07] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-primary"
                    : "text-muted hover:text-text hover:bg-primary/[0.04]"
                }`}
              >
                <Icon size={18} className="shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="truncate">{t(link.labelKey)}</span>
              </Link>
            );
          })}
        </div>

        <div className="my-5 border-t border-border/80" />

        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted/80">
          {t("common.account")}
        </p>
        <div className="flex flex-col gap-1">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href === "/profile" &&
                pathname === "/profile");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-primary bg-primary/[0.07]"
                    : "text-muted hover:text-text hover:bg-primary/[0.04]"
                }`}
              >
                <Icon size={18} className="shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="truncate">{t(link.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="px-3 pb-4 pt-3 border-t border-border/80 space-y-1.5">
        <ThemeToggle />
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-primary/[0.04] transition-colors duration-200 group"
          title={t("common.openProfile")}
        >
          <UserAvatar size="sm" rounded="xl" />
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-bold text-text truncate group-hover:text-primary transition-colors">
              {user?.name || t("common.myProfile")}
            </span>
            <span className="block text-[11px] text-muted truncate">
              {user?.email || t("common.accountSettings")}
            </span>
          </div>
          <Settings
            size={14}
            className="text-muted group-hover:text-primary transition-colors shrink-0"
          />
        </Link>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex min-h-11 items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-error bg-error/[0.035] hover:bg-error/[0.08] transition-colors duration-200 w-full"
        >
          <LogOut size={18} strokeWidth={1.8} />
          {t("common.logout")}
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
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-surface z-50 shadow-xl animate-slide-in-left">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
