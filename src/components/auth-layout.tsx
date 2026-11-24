"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Logo from "@/components/logo";
import UserAvatar from "@/components/user-avatar";
import ThemeToggle from "@/components/theme-toggle";
import AdhanMonitor from "@/components/adhan-monitor";
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Bookmark,
  User,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const bottomNavLinks = [
  { href: "/dashboard", labelKey: "navigation.dashboard", icon: LayoutDashboard },
  { href: "/quran", labelKey: "navigation.quran", icon: BookOpen },
  { href: "/book", labelKey: "navigation.book", icon: BookMarked },
  { href: "/bookmark", labelKey: "navigation.saved", icon: Bookmark },
  { href: "/profile", labelKey: "navigation.profile", icon: User },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

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
          <p className="text-muted text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdhanMonitor />
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-muted hover:text-text rounded-lg transition-colors"
              aria-label={t("common.menu")}
            >
              <Menu size={20} />
            </button>
            <span className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
              <Logo size={26} />
              SIRAJ
            </span>
            <div className="flex items-center gap-1">
              <ThemeToggle compact />
              <Link
                href="/profile"
                className="rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                title={t("common.openProfile")}
                aria-label={t("common.openProfile")}
              >
                <UserAvatar size="sm" rounded="lg" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]"
        aria-label={t("common.mainMenu")}
      >
        <div className="grid grid-cols-5">
          {bottomNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              pathname.startsWith(link.href + "/") ||
              (link.href === "/book" &&
                ["/belajar", "/doa", "/hadits", "/quiz"].some(
                  (route) => pathname === route || pathname.startsWith(route + "/")
                ));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted hover:text-text"
                }`}
              >
                <span
                  className={`flex w-12 items-center justify-center rounded-full py-1 transition-colors duration-200 ${
                    isActive ? "bg-primary/[0.08]" : ""
                  }`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                {t(link.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
