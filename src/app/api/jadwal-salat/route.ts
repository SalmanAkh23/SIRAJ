import { NextRequest, NextResponse } from "next/server";
import {
  calculatePrayerTimes,
  calculateQibla,
  getHijriDate,
  SalatTimings,
  HIJRI_MONTHS_ID,
  HIJRI_MONTHS_AR,
} from "@/lib/salat";
import {
  findCityById,
  findClosestCity,
  DEFAULT_CITY,
} from "@/lib/salat-cities";

// In-memory cache for API route
const cache = new Map<string, { data: unknown; expires: number }>();

function cleanTime(str: string): string {
  // Strip timezone suffix if any (e.g. "04:10 (WIB)" -> "04:10")
  return str.split(" ")[0].trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cityId = searchParams.get("city") || "";
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const dateParam = searchParams.get("date"); // YYYY-MM-DD or empty for today

    const dateMatch = dateParam
      ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateParam)
      : null;
    const dateParts = dateMatch?.slice(1).map(Number);
    const hasValidDate = Boolean(
      dateParts &&
        dateParts[1] >= 1 &&
        dateParts[1] <= 12 &&
        dateParts[2] >= 1 &&
        dateParts[2] <= 31 &&
        new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]))
          .toISOString()
          .startsWith(dateParam ?? "")
    );
    const now = hasValidDate && dateParts
      ? new Date(
          dateParts[0],
          dateParts[1] - 1,
          dateParts[2],
          12
        )
      : new Date();
    const targetDate = isNaN(now.getTime()) ? new Date() : now;

    // Resolve city & coordinates
    let lat: number;
    let lng: number;
    let resolvedCity = DEFAULT_CITY;

    if (latParam && lngParam) {
      lat = parseFloat(latParam);
      lng = parseFloat(lngParam);
      if (isNaN(lat) || isNaN(lng)) {
        lat = DEFAULT_CITY.lat;
        lng = DEFAULT_CITY.lng;
      } else {
        resolvedCity = findClosestCity(lat, lng);
      }
    } else if (cityId) {
      resolvedCity = findCityById(cityId);
      lat = resolvedCity.lat;
      lng = resolvedCity.lng;
    } else {
      lat = DEFAULT_CITY.lat;
      lng = DEFAULT_CITY.lng;
    }

    const dateKey = hasValidDate && dateParam
      ? dateParam
      : targetDate.toISOString().slice(0, 10);
    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${dateKey}`;

    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json(cached.data);
    }

    // Default local fallback calculation
    const fallbackTimings = calculatePrayerTimes(
      targetDate,
      lat,
      lng,
      resolvedCity.gmtOffset
    );
    const fallbackHijri = getHijriDate(targetDate);
    const qiblaDirection = calculateQibla(lat, lng);

    let timings: SalatTimings = fallbackTimings;
    let hijri = fallbackHijri;

    // Attempt fetching from Aladhan API (Kemenag method: 20) with 3.5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Aladhan format: DD-MM-YYYY
      const dayStr = String(targetDate.getDate()).padStart(2, "0");
      const monthStr = String(targetDate.getMonth() + 1).padStart(2, "0");
      const yearStr = targetDate.getFullYear();
      const aladhanDate = `${dayStr}-${monthStr}-${yearStr}`;

      const apiUrl = `https://api.aladhan.com/v1/timings/${aladhanDate}?latitude=${lat}&longitude=${lng}&method=20`;

      const res = await fetch(apiUrl, {
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.code === 200 && json.data) {
          const t = json.data.timings;
          timings = {
            imsak: cleanTime(t.Imsak || fallbackTimings.imsak),
            subuh: cleanTime(t.Fajr || fallbackTimings.subuh),
            terbit: cleanTime(t.Sunrise || fallbackTimings.terbit),
            dhuha: fallbackTimings.dhuha,
            zuhur: cleanTime(t.Dhuhr || fallbackTimings.zuhur),
            asar: cleanTime(t.Asr || fallbackTimings.asar),
            magrib: cleanTime(t.Maghrib || fallbackTimings.magrib),
            isya: cleanTime(t.Isha || fallbackTimings.isya),
          };

          const h = json.data.date?.hijri;
          if (h) {
            const hDay = parseInt(h.day, 10) || fallbackHijri.day;
            const hMonthNum = parseInt(h.month?.number, 10) || fallbackHijri.monthNumber;
            const hMonthIdx = Math.max(0, Math.min(11, hMonthNum - 1));
            const hYear = parseInt(h.year, 10) || fallbackHijri.year;

            hijri = {
              day: hDay,
              monthNumber: hMonthNum,
              monthName: HIJRI_MONTHS_ID[hMonthIdx],
              monthArabic: HIJRI_MONTHS_AR[hMonthIdx],
              year: hYear,
              formatted: `${hDay} ${HIJRI_MONTHS_ID[hMonthIdx]} ${hYear} H`,
              masehiFormatted: fallbackHijri.masehiFormatted,
            };
          }
        }
      }
    } catch {
      // Gracefully use the calculated fallback
    }

    const responseData = {
      city: resolvedCity,
      coordinates: { lat, lng },
      date: dateKey,
      hijri,
      timings,
      qiblaDirection,
      source: timings === fallbackTimings ? "astronomical_calc" : "aladhan_kemenag",
    };

    // Cache for 1 hour
    cache.set(cacheKey, {
      data: responseData,
      expires: Date.now() + 1000 * 60 * 60,
    });

    return NextResponse.json(responseData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
