"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockUser, User } from "@/data/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const PROFILE_KEY = "siraj-profile";

function readSavedProfile(): Partial<User> | null {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? (JSON.parse(saved) as Partial<User>) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session (mock auth — swap with Supabase Auth on Phase 2)
    const session = localStorage.getItem("siraj-session");
    if (session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrasi sesi dari localStorage saat mount
      setUser({ ...mockUser, ...readSavedProfile() });
    }
    setIsLoading(false);
  }, []);

  // `password` disimpan untuk disambungkan ke Supabase Auth pada Phase 2
  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("siraj-session", "mock-session");
    setUser({ ...mockUser, ...readSavedProfile(), email });
    setIsLoading(false);
  };

  const register = async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem("siraj-session", "mock-session");
    const profile = { name, email };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore storage errors
    }
    setUser({ ...mockUser, ...profile });
    setIsLoading(false);
  };

  const updateProfile = (data: { name?: string; email?: string }) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...data };
      try {
        localStorage.setItem(
          PROFILE_KEY,
          JSON.stringify({ name: next.name, email: next.email })
        );
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const logout = () => {
    localStorage.removeItem("siraj-session");
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
