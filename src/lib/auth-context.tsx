"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockUser, User } from "@/data/user";

export interface ProfileUpdateInput {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: ProfileUpdateInput) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const SESSION_KEY = "siraj-session";
const PROFILE_KEY = "siraj-profile";
const PROFILES_BY_EMAIL_KEY = "siraj-profiles-by-email";
const CREDENTIALS_KEY = "siraj-auth-credentials";

function normalizeEmail(email?: string | null): string {
  return (email ?? "").trim().toLowerCase();
}

function readProfilesByEmailMap(): Record<string, Partial<User>> {
  try {
    const raw = localStorage.getItem(PROFILES_BY_EMAIL_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readSavedProfile(emailHint?: string): Partial<User> | null {
  try {
    const rawActive = localStorage.getItem(PROFILE_KEY);
    const activeProfile = rawActive
      ? (JSON.parse(rawActive) as Partial<User>)
      : null;
    const byEmailMap = readProfilesByEmailMap();

    const targetEmail = normalizeEmail(emailHint || activeProfile?.email);
    const byEmailProfile = targetEmail ? byEmailMap[targetEmail] : undefined;

    if (emailHint) {
      const normalizedHint = normalizeEmail(emailHint);
      const activeMatchesHint =
        !activeProfile?.email ||
        normalizeEmail(activeProfile.email) === normalizedHint;

      if (byEmailProfile && activeMatchesHint && activeProfile) {
        return { ...byEmailProfile, ...activeProfile };
      }
      if (byEmailProfile) {
        return byEmailProfile;
      }
      if (activeMatchesHint && activeProfile) {
        return activeProfile;
      }
      return null;
    }

    if (activeProfile && byEmailProfile) {
      return { ...byEmailProfile, ...activeProfile };
    }
    return activeProfile ?? byEmailProfile ?? null;
  } catch {
    return null;
  }
}

function writeSavedProfile(profile: Partial<User>) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    const emailKey = normalizeEmail(profile.email);
    if (emailKey) {
      const map = readProfilesByEmailMap();
      map[emailKey] = {
        ...(map[emailKey] ?? {}),
        ...profile,
      };
      localStorage.setItem(PROFILES_BY_EMAIL_KEY, JSON.stringify(map));
    }
  } catch {
    // ignore storage errors
  }
}

function deriveDefaultUsername(nameOrEmail: string): string {
  const base = nameOrEmail
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  return base || "muslim_siraj";
}

function buildHydratedUser(saved: Partial<User> | null, fallbackEmail?: string): User {
  const mergedEmail = saved?.email || fallbackEmail || mockUser.email;
  const mergedName = saved?.name || mockUser.name;
  return {
    ...mockUser,
    ...saved,
    name: mergedName,
    email: mergedEmail,
    username: saved?.username || deriveDefaultUsername(mergedName || mergedEmail),
    phone: saved?.phone ?? mockUser.phone ?? "",
    avatar: saved?.avatar ?? "",
    joinedAt: saved?.joinedAt || mockUser.joinedAt,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const emailHint =
        session !== "mock-session" && session.includes("@") ? session : undefined;
      const saved = readSavedProfile(emailHint);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrasi sesi dari localStorage saat mount
      setUser(buildHydratedUser(saved, emailHint));
    }
    setIsLoading(false);
  }, []);

  // Sinkronisasi lintas tab jika profil atau sesi berubah
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SESSION_KEY) {
        if (!event.newValue) {
          setUser(null);
        } else {
          const emailHint =
            event.newValue !== "mock-session" && event.newValue.includes("@")
              ? event.newValue
              : undefined;
          setUser(buildHydratedUser(readSavedProfile(emailHint), emailHint));
        }
      } else if (event.key === PROFILE_KEY || event.key === PROFILES_BY_EMAIL_KEY) {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
          const emailHint =
            session !== "mock-session" && session.includes("@")
              ? session
              : undefined;
          setUser(buildHydratedUser(readSavedProfile(emailHint), emailHint));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const trimmedEmail = email.trim();
    const existingSaved = readSavedProfile(trimmedEmail || undefined);
    const resolvedEmail = trimmedEmail || existingSaved?.email || mockUser.email;

    localStorage.setItem(SESSION_KEY, resolvedEmail);

    const savedForAccount = readSavedProfile(resolvedEmail);
    const isSameAccountAsMock =
      normalizeEmail(resolvedEmail) === normalizeEmail(mockUser.email);
    const defaultNameFromEmail = resolvedEmail
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const resolvedName =
      savedForAccount?.name ||
      (isSameAccountAsMock ? mockUser.name : defaultNameFromEmail || mockUser.name);
    const resolvedUsername =
      savedForAccount?.username ||
      deriveDefaultUsername(resolvedName || resolvedEmail);
    const resolvedJoinedAt =
      savedForAccount?.joinedAt ||
      (isSameAccountAsMock
        ? mockUser.joinedAt
        : new Date().toISOString().slice(0, 10));
    const resolvedPhone =
      savedForAccount?.phone ?? (isSameAccountAsMock ? mockUser.phone : "");
    const resolvedAvatar = savedForAccount?.avatar ?? "";

    const nextProfile: Partial<User> = {
      ...savedForAccount,
      name: resolvedName,
      email: resolvedEmail,
      username: resolvedUsername,
      phone: resolvedPhone,
      avatar: resolvedAvatar,
      joinedAt: resolvedJoinedAt,
    };

    try {
      if (password) {
        localStorage.setItem(
          CREDENTIALS_KEY,
          JSON.stringify({ email: resolvedEmail, password })
        );
      }
      writeSavedProfile(nextProfile);
    } catch {
      // ignore storage errors
    }

    setUser(buildHydratedUser(nextProfile, resolvedEmail));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const resolvedEmail = email.trim() || mockUser.email;
    const resolvedName = name.trim() || mockUser.name;
    localStorage.setItem(SESSION_KEY, resolvedEmail);

    const joinedAt = new Date().toISOString().slice(0, 10);
    const username = deriveDefaultUsername(resolvedName || resolvedEmail);
    const profile: Partial<User> = {
      name: resolvedName,
      email: resolvedEmail,
      username,
      phone: "",
      avatar: "",
      joinedAt,
    };
    try {
      writeSavedProfile(profile);
      if (password) {
        localStorage.setItem(
          CREDENTIALS_KEY,
          JSON.stringify({ email: resolvedEmail, password })
        );
      }
    } catch {
      // ignore storage errors
    }
    setUser(buildHydratedUser(profile, resolvedEmail));
    setIsLoading(false);
  };

  const updateProfile = (data: ProfileUpdateInput) => {
    setUser((prev) => {
      const base = prev ?? buildHydratedUser(readSavedProfile());
      const next: User = {
        ...base,
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.username !== undefined ? { username: data.username } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      };
      const existing = readSavedProfile(next.email) ?? {};
      writeSavedProfile({
        ...existing,
        name: next.name,
        email: next.email,
        username: next.username,
        phone: next.phone,
        avatar: next.avatar ?? "",
        joinedAt: next.joinedAt,
      });
      return next;
    });
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!currentPassword.trim()) {
      throw new Error("Masukkan password saat ini terlebih dahulu.");
    }
    if (newPassword.trim().length < 6) {
      throw new Error("Password baru minimal harus terdiri dari 6 karakter.");
    }

    try {
      const rawCreds = localStorage.getItem(CREDENTIALS_KEY);
      if (rawCreds) {
        const parsed = JSON.parse(rawCreds) as { password?: string };
        if (parsed.password && parsed.password !== currentPassword) {
          throw new Error("Password saat ini yang dimasukkan tidak sesuai.");
        }
      }
      localStorage.setItem(
        CREDENTIALS_KEY,
        JSON.stringify({
          email: user?.email ?? mockUser.email,
          password: newPassword,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Gagal menyimpan perubahan password.");
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateProfile,
        updatePassword,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
