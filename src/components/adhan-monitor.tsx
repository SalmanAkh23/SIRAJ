"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  ADHAN_AUDIO_SRC,
  ADHAN_ENABLE_EVENT,
  ADHAN_PREFERENCES_KEY,
  ADHAN_SETTINGS_CHANGED,
  ADHAN_TEST_EVENT,
  claimPrayerOccurrence,
  getLocalDateTime,
  isPrayerKey,
  playAdhanAudio,
  readAdhanPreferences,
  type AdhanPreferences,
} from "@/lib/adhan";
import { DEFAULT_CITY, findCityById } from "@/lib/salat-cities";
import {
  PRAYER_DETAILS,
  calculatePrayerTimes,
  type PrayerKey,
  type SalatTimings,
} from "@/lib/salat";

const CITY_STORAGE_KEY = "siraj_prayer_city";
const CHECK_INTERVAL_MS = 15_000;
const LATE_PRAYER_GRACE_MS = 5 * 60_000;

interface ToastMessage {
  message: string;
  showEnableButton: boolean;
}

interface TimingsResponse {
  timings?: SalatTimings;
}

function isSalatTimings(value: unknown): value is SalatTimings {
  if (!value || typeof value !== "object") return false;
  const timings = value as Record<string, unknown>;
  return ["subuh", "zuhur", "asar", "magrib", "isya"].every(
    (key) => typeof timings[key] === "string"
  );
}

export default function AdhanMonitor() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const preferencesRef = useRef<AdhanPreferences>(readAdhanPreferences());
  const scheduleRef = useRef<{
    cityId: string;
    date: string;
    timings: SalatTimings;
  } | null>(null);
  const loadingRef = useRef(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let active = true;
    const updatePreferences = () => {
      preferencesRef.current = readAdhanPreferences();
      audio.volume = preferencesRef.current.volume;
    };
    updatePreferences();

    const showToast = (message: string, showEnableButton = false) => {
      if (active) setToast({ message, showEnableButton });
    };
    const getSelectedCityId = () => {
      try {
        return window.localStorage.getItem(CITY_STORAGE_KEY) || DEFAULT_CITY.id;
      } catch {
        return DEFAULT_CITY.id;
      }
    };

    const playAdhan = async (prayerKey: PrayerKey, isTest = false) => {
      const preferences = preferencesRef.current;
      const prayerName = PRAYER_DETAILS[prayerKey].name;

      if (!preferences.enabled && !isTest) return;

      if (isTest) {
        showToast("Testing suara adzan sedang diputar.");
      } else if (preferences.notificationsEnabled) {
        showToast(
          `Waktu ${prayerName} telah tiba. Saatnya menunaikan salat ${prayerName}.`
        );
      }

      try {
        const started = await playAdhanAudio(audio, preferences.volume);
        if (!started) return;
        if (!active) return;
      } catch {
        showToast(
          `Waktu ${prayerName} telah tiba, tetapi suara adzan belum dapat diputar. Aktifkan suara melalui tombol berikut.`,
          true
        );
      }
    };

    const notifyPrayer = (prayerKey: PrayerKey, isTest = false) => {
      const preferences = preferencesRef.current;
      const prayerName = PRAYER_DETAILS[prayerKey].name;
      if (isTest) {
        if (!preferences.enabled) {
          if (preferences.notificationsEnabled) {
            showToast(
              `Waktu ${prayerName} telah tiba. Suara adzan sedang nonaktif.`
            );
          }
          return;
        }
        void playAdhan(prayerKey, true);
        return;
      }

      if (preferences.enabled) {
        void playAdhan(prayerKey);
      } else if (preferences.notificationsEnabled) {
        showToast(
          `Waktu ${prayerName} telah tiba. Saatnya menunaikan salat ${prayerName}.`
        );
      }
    };

    const loadSchedule = async (now: Date) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      const cityId = getSelectedCityId();
      const city = findCityById(cityId);
      const { date } = getLocalDateTime(now, city.gmtOffset);
      const currentSchedule = scheduleRef.current;

      if (
        currentSchedule?.cityId === city.id &&
        currentSchedule.date === date
      ) {
        loadingRef.current = false;
        return;
      }

      let timings = calculatePrayerTimes(
        new Date(`${date}T12:00:00`),
        city.lat,
        city.lng,
        city.gmtOffset
      );

      try {
        const response = await fetch(
          `/api/jadwal-salat?city=${encodeURIComponent(city.id)}&date=${date}`
        );
        if (!response.ok) {
          throw new Error(`Jadwal salat gagal dimuat (${response.status}).`);
        }
        const data = (await response.json()) as TimingsResponse;
        if (isSalatTimings(data.timings)) timings = data.timings;
      } catch {
        // Jadwal yang sama tetap tersedia melalui kalkulasi lokal SIRAJ.
      }

      if (active) {
        scheduleRef.current = { cityId: city.id, date, timings };
      }
      loadingRef.current = false;
    };

    const checkPrayerTimes = async () => {
      const now = new Date();
      await loadSchedule(now);
      if (!active) return;

      const cityId = getSelectedCityId();
      const city = findCityById(cityId);
      const { date, minutes } = getLocalDateTime(now, city.gmtOffset);
      const schedule = scheduleRef.current;
      if (!schedule || schedule.cityId !== city.id || schedule.date !== date) {
        return;
      }

      const prayerKeys: PrayerKey[] = [
        "subuh",
        "zuhur",
        "asar",
        "magrib",
        "isya",
      ];

      for (const prayerKey of prayerKeys) {
        const [hour, minute] = schedule.timings[prayerKey].split(":").map(Number);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) continue;
        const prayerMinutes = hour * 60 + minute;
        const elapsedMinutes = minutes - prayerMinutes;
        if (elapsedMinutes < 0 || elapsedMinutes * 60_000 > LATE_PRAYER_GRACE_MS) {
          continue;
        }

        const occurrenceId = `${date}|${prayerKey}|${schedule.timings[prayerKey]}`;
        const claim = claimPrayerOccurrence(occurrenceId, date);
        if (claim.claimed) {
          if (!claim.persisted) {
            showToast(
              "Browser tidak dapat menyimpan status adzan; duplikasi setelah refresh mungkin terjadi."
            );
          }
          notifyPrayer(prayerKey);
        }
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CITY_STORAGE_KEY || event.key === ADHAN_PREFERENCES_KEY) {
        updatePreferences();
        scheduleRef.current = null;
        void checkPrayerTimes();
      }
    };

    const handleTest = (event: Event) => {
      const detail = (event as CustomEvent<{ prayerKey?: unknown }>).detail;
      if (!isPrayerKey(detail?.prayerKey)) return;
      notifyPrayer(detail.prayerKey, true);
    };

    const handleEnable = () => {
      const prayerKey: PrayerKey = "zuhur";
      void playAdhan(prayerKey, true);
    };

    const handleAudioError = () => {
      showToast(
        "File audio adzan tidak tersedia. Periksa public/audio/adzan/subuh.mp3."
      );
    };

    const interval = window.setInterval(
      () => void checkPrayerTimes(),
      CHECK_INTERVAL_MS
    );
    window.addEventListener("storage", handleStorage);
    window.addEventListener(ADHAN_SETTINGS_CHANGED, updatePreferences);
    window.addEventListener(ADHAN_TEST_EVENT, handleTest);
    window.addEventListener(ADHAN_ENABLE_EVENT, handleEnable);
    audio.addEventListener("error", handleAudioError);
    void checkPrayerTimes();

    return () => {
      active = false;
      loadingRef.current = false;
      window.clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(ADHAN_SETTINGS_CHANGED, updatePreferences);
      window.removeEventListener(ADHAN_TEST_EVENT, handleTest);
      window.removeEventListener(ADHAN_ENABLE_EVENT, handleEnable);
      audio.removeEventListener("error", handleAudioError);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      <audio ref={audioRef} src={ADHAN_AUDIO_SRC} preload="none" />
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 right-4 z-[60] flex max-w-sm items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text shadow-lg sm:right-6 lg:bottom-6"
        >
          <Volume2 size={17} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p>{toast.message}</p>
            {toast.showEnableButton && (
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event(ADHAN_ENABLE_EVENT))
                }
                className="mt-2 font-semibold text-primary underline underline-offset-2"
              >
                Aktifkan Suara Adzan
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

