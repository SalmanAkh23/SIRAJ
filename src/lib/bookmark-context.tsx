"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { type BookmarkItem } from "@/data/user";
import { useAuth } from "@/lib/auth-context";
import { dispatchLearningUpdated, recordUserActivity } from "@/lib/learning-progress";

export type BookmarkType = BookmarkItem["type"];

export type BookmarkDraft = Omit<BookmarkItem, "savedAt">;

interface BookmarksContextType {
  bookmarks: BookmarkItem[];
  isBookmarked: (id: string) => boolean;
  toggle: (item: BookmarkDraft) => void;
  remove: (id: string) => void;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

function getStorageKeyForEmail(email?: string | null): string {
  const norm = (email ?? "").trim().toLowerCase();
  return norm ? `siraj-bookmarks-${norm}` : "siraj-bookmarks";
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userEmail = user?.email ?? null;

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load saved bookmarks when userEmail changes or upon mount
  useEffect(() => {
    try {
      const storageKey = getStorageKeyForEmail(userEmail);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi dari localStorage saat user berubah
          setBookmarks(parsed as BookmarkItem[]);
          return;
        }
      }
      setBookmarks([]);
    } catch {
      setBookmarks([]);
    }
  }, [userEmail]);

  // Sinkronisasi lintas tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const currentKey = getStorageKeyForEmail(userEmail);
      if (e.key === currentKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBookmarks(parsed);
          }
        } catch {
          // Abaikan
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userEmail]);

  const persist = useCallback((next: BookmarkItem[], email: string | null) => {
    setBookmarks(next);
    try {
      const storageKey = getStorageKeyForEmail(email);
      localStorage.setItem(storageKey, JSON.stringify(next));
      // Trigger update ke seluruh komponen dashboard/profil
      dispatchLearningUpdated();
    } catch {
      // Storage unavailable — state tetap bekerja di memory
    }
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggle = useCallback(
    (item: BookmarkDraft) => {
      const exists = bookmarks.some((b) => b.id === item.id);
      if (exists) {
        persist(bookmarks.filter((b) => b.id !== item.id), userEmail);
      } else {
        const today = new Date().toISOString().slice(0, 10);
        recordUserActivity(userEmail, today);
        persist(
          [
            { ...item, savedAt: today },
            ...bookmarks,
          ],
          userEmail
        );
      }
    },
    [bookmarks, persist, userEmail]
  );

  const remove = useCallback(
    (id: string) => {
      persist(bookmarks.filter((b) => b.id !== id), userEmail);
    },
    [bookmarks, persist, userEmail]
  );

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggle, remove }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
}
