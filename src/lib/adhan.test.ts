import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADHAN_AUDIO_SRC,
  ADHAN_PLAYED_KEY,
  claimPrayerOccurrence,
  getLocalDateTime,
  playAdhanAudio,
  readAdhanPreferences,
  type AdhanAudioPlayer,
} from "./adhan";

describe("adhan playback and schedule helpers", () => {
  const storedValues = new Map<string, string>();

  afterEach(() => {
    storedValues.clear();
    vi.unstubAllGlobals();
  });

  it("uses the supplied Subuh audio asset", () => {
    expect(ADHAN_AUDIO_SRC).toBe("/audio/adzan/subuh.mp3");
  });

  it("plays once, without looping, and clamps volume", async () => {
    const play = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const audio: AdhanAudioPlayer = {
      paused: true,
      loop: true,
      volume: 0.2,
      currentTime: 9,
      play,
    };

    await expect(playAdhanAudio(audio, 1.5)).resolves.toBe(true);

    expect(play).toHaveBeenCalledTimes(1);
    expect(audio.loop).toBe(false);
    expect(audio.volume).toBe(1);
    expect(audio.currentTime).toBe(0);

    audio.paused = false;
    await expect(playAdhanAudio(audio, 0.5)).resolves.toBe(false);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("calculates schedule date and time using the selected city offset", () => {
    expect(getLocalDateTime(new Date("2026-03-01T22:30:00.000Z"), 9)).toEqual({
      date: "2026-03-02",
      minutes: 450,
    });
  });

  it("claims a prayer occurrence once and resets claims on the next date", () => {
    const localStorage = {
      getItem: vi.fn((key: string) => storedValues.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storedValues.set(key, value);
      }),
    };
    vi.stubGlobal("window", { localStorage });

    const occurrence = "2026-03-01|subuh|04:12";
    expect(claimPrayerOccurrence(occurrence, "2026-03-01")).toEqual({
      claimed: true,
      persisted: true,
    });
    expect(claimPrayerOccurrence(occurrence, "2026-03-01")).toEqual({
      claimed: false,
      persisted: true,
    });
    expect(claimPrayerOccurrence("2026-03-02|subuh|04:12", "2026-03-02")).toEqual({
      claimed: true,
      persisted: true,
    });

    expect(JSON.parse(storedValues.get(ADHAN_PLAYED_KEY) ?? "{}")).toEqual({
      date: "2026-03-02",
      fired: ["2026-03-02|subuh|04:12"],
    });
  });

  it("uses stored preferences while keeping volume in the audio range", () => {
    const localStorage = {
      getItem: vi.fn(() =>
        JSON.stringify({
          enabled: true,
          volume: -0.5,
          notificationsEnabled: false,
        })
      ),
    };
    vi.stubGlobal("window", { localStorage });

    expect(readAdhanPreferences()).toEqual({
      enabled: true,
      volume: 0,
      notificationsEnabled: false,
    });
  });
});
