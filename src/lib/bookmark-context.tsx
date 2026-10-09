"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { mockBookmarks, type BookmarkItem } from "@/data/user";

export type BookmarkType = BookmarkItem["type"];

export type BookmarkDraft = Omit<BookmarkItem, "savedAt">;

interface BookmarksContextType {
  bookmarks: BookmarkItem[];
  isBookmarked: (id: string) => boolean;
  toggle: (item: BookmarkDraft) => void;
  remove: (id: string) => void;
}

const STORAGE_KEY = "siraj-bookmarks";

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(mockBookmarks);

  // Load saved bookmarks after mount (keeps SSR/CSR render consistent)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi dari localStorage saat mount
          setBookmarks(parsed as BookmarkItem[]);
        }
      }
    } catch {
      // Ignore corrupted storage and fall back to mock data
    }
  }, []);

  const persist = useCallback((next: BookmarkItem[]) => {
    setBookmarks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode) — state still works in memory
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
        persist(bookmarks.filter((b) => b.id !== item.id));
      } else {
        persist([
          { ...item, savedAt: new Date().toISOString().slice(0, 10) },
          ...bookmarks,
        ]);
      }
    },
    [bookmarks, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(bookmarks.filter((b) => b.id !== id));
    },
    [bookmarks, persist]
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
