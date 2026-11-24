import { describe, expect, it } from "vitest";
import { calculateNextPrayer, type SalatTimings } from "./salat";

const timings: SalatTimings = {
  imsak: "04:00",
  subuh: "04:10",
  terbit: "05:30",
  dhuha: "05:50",
  zuhur: "12:00",
  asar: "15:30",
  magrib: "18:00",
  isya: "19:15",
};

describe("calculateNextPrayer", () => {
  it("moves to the following prayer when the current prayer time is reached", () => {
    const result = calculateNextPrayer(
      timings,
      new Date(2026, 5, 5, 4, 10, 0)
    );

    expect(result.nextPrayer.key).toBe("zuhur");
    expect(result.currentPrayer?.key).toBe("subuh");
    expect(result.prayers.find((prayer) => prayer.key === "subuh")).toMatchObject({
      isCurrent: true,
      isNext: false,
    });
  });

  it("counts down to tomorrow's Subuh after Isya", () => {
    const result = calculateNextPrayer(
      timings,
      new Date(2026, 5, 5, 23, 0, 0)
    );

    expect(result.nextPrayer).toMatchObject({
      key: "subuh",
      isTomorrow: true,
    });
    expect(result.nextPrayer.remainingSeconds).toBeGreaterThan(0);
    expect(result.nextPrayer.formattedRemaining).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
