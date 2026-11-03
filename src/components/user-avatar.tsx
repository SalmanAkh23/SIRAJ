"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockUser } from "@/data/user";
import { cn } from "@/lib/utils";

export function getUserInitials(name?: string | null): string {
  const cleaned = (name ?? "").trim();
  if (!cleaned) return "S";
  return cleaned
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const sizeClasses = {
  sm: "w-9 h-9 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl",
} as const;

const roundedClasses = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const;

interface UserAvatarProps {
  /** Opsional: override URL foto profil (default diambil dari state autentikasi) */
  src?: string | null;
  /** Opsional: override nama pengguna untuk inisial & atribut alt */
  name?: string | null;
  /** Ukuran avatar */
  size?: keyof typeof sizeClasses;
  /** Bentuk sudut avatar */
  rounded?: keyof typeof roundedClasses;
  /** Kelas tambahan pada container avatar */
  className?: string;
  /** Kelas tambahan pada teks inisial fallback */
  fallbackClassName?: string;
}

export default function UserAvatar({
  src,
  name,
  size = "md",
  rounded = "xl",
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const { user } = useAuth();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const resolvedName =
    name !== undefined ? name : (user?.name ?? mockUser.name);
  const resolvedAvatar =
    src !== undefined ? src : (user?.avatar ?? "");

  const normalizedSrc = resolvedAvatar?.trim() || "";
  const showImage = Boolean(normalizedSrc) && failedSrc !== normalizedSrc;
  const initials = getUserInitials(resolvedName);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-primary text-white flex items-center justify-center font-bold select-none shrink-0 shadow-xs",
        sizeClasses[size],
        roundedClasses[rounded],
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- mendukung Data URL dan URL gambar dinamis dengan fallback inisial
        <img
          key={normalizedSrc}
          src={normalizedSrc}
          alt={`Foto profil ${resolvedName || "Pengguna"}`}
          className="w-full h-full object-cover block"
          onError={() => setFailedSrc(normalizedSrc)}
        />
      ) : (
        <span
          className={cn(
            "tracking-wider leading-none",
            fallbackClassName
          )}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

