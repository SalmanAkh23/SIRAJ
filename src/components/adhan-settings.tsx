"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import {
  ADHAN_ENABLE_EVENT,
  ADHAN_PREFERENCES_KEY,
  ADHAN_SETTINGS_CHANGED,
  ADHAN_TEST_EVENT,
  DEFAULT_ADHAN_PREFERENCES,
  readAdhanPreferences,
  type AdhanPreferences,
} from "@/lib/adhan";

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#174A3A]" : "bg-[#D8D5C8]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function AdhanSettings() {
  const [preferences, setPreferences] = useState<AdhanPreferences>(
    DEFAULT_ADHAN_PREFERENCES
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load saved sound preferences
    setPreferences(readAdhanPreferences());
  }, []);

  const updatePreferences = (next: AdhanPreferences) => {
    setPreferences(next);
    setSaveError(null);
    try {
      window.localStorage.setItem(ADHAN_PREFERENCES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(ADHAN_SETTINGS_CHANGED));
    } catch {
      setSaveError("Pengaturan tidak dapat disimpan di browser ini.");
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#174A3A]/[0.08] text-[#174A3A]">
            <Volume2 size={17} />
          </span>
          <div>
            <span className="block text-sm font-semibold text-[#263A35]">
              Suara Adzan Otomatis
            </span>
            <span className="block text-xs text-[#718078]">
              Putar adzan saat waktu salat di kota pilihan tiba
            </span>
          </div>
        </div>
        <Toggle
          checked={preferences.enabled}
          label="Suara adzan otomatis"
          onChange={() =>
            updatePreferences({
              ...preferences,
              enabled: !preferences.enabled,
            })
          }
        />
      </div>

      <div className="ml-0 sm:ml-[54px] grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#52645C]">
            <span>Volume</span>
            <span>{Math.round(preferences.volume * 100)}%</span>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={preferences.volume}
            onChange={(event) =>
              updatePreferences({
                ...preferences,
                volume: Number(event.target.value),
              })
            }
            disabled={!preferences.enabled}
            aria-label="Volume suara adzan"
            className="w-full accent-[#174A3A] disabled:opacity-50"
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="block text-xs font-semibold text-[#263A35]">
              Notifikasi Adzan
            </span>
            <span className="block text-xs text-[#718078]">
              Tampilkan pemberitahuan waktu salat
            </span>
          </div>
          <Toggle
            checked={preferences.notificationsEnabled}
            label="Notifikasi waktu salat"
            onChange={() =>
              updatePreferences({
                ...preferences,
                notificationsEnabled: !preferences.notificationsEnabled,
              })
            }
          />
        </div>
      </div>

      {saveError && (
        <p role="alert" className="text-xs text-error">
          {saveError}
        </p>
      )}

      {preferences.enabled && (
        <div className="ml-0 sm:ml-[54px] flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event(ADHAN_ENABLE_EVENT))
            }
            className="rounded-lg border border-[#174A3A]/20 px-3 py-1.5 text-xs font-semibold text-[#174A3A] hover:bg-[#174A3A]/[0.06]"
          >
            Aktifkan Suara Adzan
          </button>
          <span className="text-xs text-[#718078]">
            Tekan untuk menguji audio dan memberi izin pemutaran browser.
          </span>
        </div>
      )}

      {process.env.NODE_ENV !== "production" && (
        <div className="ml-0 sm:ml-[54px] border-t border-[#F0EDE4] pt-3">
          <p className="mb-2 text-xs font-semibold text-[#52645C]">
            Simulasi development
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(ADHAN_TEST_EVENT, {
                    detail: { prayerKey: "subuh" },
                  })
                )
              }
              className="rounded-lg border border-[#E6E3D8] px-2.5 py-1.5 text-xs font-medium text-[#174A3A] hover:bg-[#174A3A]/[0.06]"
            >
              Test Adzan
            </button>
          </div>
          <p className="mt-2 text-xs text-[#718078]">
            Tombol uji langsung memutar audio Subuh, tidak mengubah jadwal,
            dan hanya tersedia di development.
          </p>
        </div>
      )}
    </div>
  );
}

