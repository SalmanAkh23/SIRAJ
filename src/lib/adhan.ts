import type { PrayerKey } from "@/lib/salat";

export interface AdhanPreferences {
  enabled: boolean;
  volume: number;
  notificationsEnabled: boolean;
}

export interface AdhanAudioPlayer {
  paused: boolean;
  loop: boolean;
  volume: number;
  currentTime: number;
  play(): Promise<void>;
}

export const ADHAN_PREFERENCES_KEY = "siraj-adhan-preferences-v1";
export const ADHAN_PLAYED_KEY = "siraj-adhan-played-v1";
export const ADHAN_SETTINGS_CHANGED = "siraj-adhan-settings-changed";
export const ADHAN_TEST_EVENT = "siraj-adhan-test";
export const ADHAN_ENABLE_EVENT = "siraj-adhan-enable";
export const ADHAN_AUDIO_SRC = "/audio/adzan/subuh.mp3";

export const DEFAULT_ADHAN_PREFERENCES: AdhanPreferences = {
  enabled: true,
  volume: 0.7,
  notificationsEnabled: true,
};

const inMemoryClaims = new Set<string>();
let inMemoryClaimDate: string | null = null;

export function readAdhanPreferences(): AdhanPreferences {
  if (typeof window === "undefined") return DEFAULT_ADHAN_PREFERENCES;

  try {
    const stored = window.localStorage.getItem(ADHAN_PREFERENCES_KEY);
    if (!stored) return DEFAULT_ADHAN_PREFERENCES;

    const parsed = JSON.parse(stored) as Partial<AdhanPreferences>;
    return {
      enabled:
        typeof parsed.enabled === "boolean"
          ? parsed.enabled
          : DEFAULT_ADHAN_PREFERENCES.enabled,
      volume:
        typeof parsed.volume === "number" && Number.isFinite(parsed.volume)
          ? Math.min(1, Math.max(0, parsed.volume))
          : DEFAULT_ADHAN_PREFERENCES.volume,
      notificationsEnabled:
        typeof parsed.notificationsEnabled === "boolean"
          ? parsed.notificationsEnabled
          : DEFAULT_ADHAN_PREFERENCES.notificationsEnabled,
    };
  } catch {
    return DEFAULT_ADHAN_PREFERENCES;
  }
}

export function getLocalDateTime(
  now: Date,
  gmtOffset: number
): { date: string; minutes: number } {
  const localDate = new Date(now.getTime() + gmtOffset * 60 * 60 * 1000);
  return {
    date: localDate.toISOString().slice(0, 10),
    minutes: localDate.getUTCHours() * 60 + localDate.getUTCMinutes(),
  };
}

export async function playAdhanAudio(
  audio: AdhanAudioPlayer,
  volume: number
): Promise<boolean> {
  if (!audio.paused) return false;

  audio.loop = false;
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.currentTime = 0;
  await audio.play();
  return true;
}

export function claimPrayerOccurrence(
  occurrenceId: string,
  localDate: string
): { claimed: boolean; persisted: boolean } {
  if (inMemoryClaimDate !== localDate) {
    inMemoryClaims.clear();
    inMemoryClaimDate = localDate;
  }

  if (inMemoryClaims.has(occurrenceId)) {
    return { claimed: false, persisted: true };
  }

  try {
    const raw = window.localStorage.getItem(ADHAN_PLAYED_KEY);
    let fired: string[] = [];

    if (raw) {
      const saved = JSON.parse(raw) as { date?: unknown; fired?: unknown };
      if (saved.date === localDate && Array.isArray(saved.fired)) {
        fired = saved.fired.filter(
          (item): item is string => typeof item === "string"
        );
      }
    }

    if (fired.includes(occurrenceId)) {
      inMemoryClaims.add(occurrenceId);
      return { claimed: false, persisted: true };
    }

    inMemoryClaims.add(occurrenceId);
    window.localStorage.setItem(
      ADHAN_PLAYED_KEY,
      JSON.stringify({ date: localDate, fired: [...fired, occurrenceId] })
    );
    return { claimed: true, persisted: true };
  } catch {
    inMemoryClaims.add(occurrenceId);
    return { claimed: true, persisted: false };
  }
}

export function isPrayerKey(value: unknown): value is PrayerKey {
  return (
    value === "subuh" ||
    value === "zuhur" ||
    value === "asar" ||
    value === "magrib" ||
    value === "isya"
  );
}

