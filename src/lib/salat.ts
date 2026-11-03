import { IndonesianCity, DEFAULT_CITY } from "./salat-cities";

export type PrayerKey = "subuh" | "zuhur" | "asar" | "magrib" | "isya";

export interface PrayerItem {
  key: PrayerKey;
  name: string; // Subuh, Zuhur, Asar, Magrib, Isya
  arabic: string; // الفجر, الظهر, العصر, المغرب, العشاء
  time: string; // "04:10"
  rakaat: number;
  description: string;
  isNext: boolean;
  isCurrent: boolean;
  isPassed: boolean;
}

export interface SalatTimings {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  zuhur: string;
  asar: string;
  magrib: string;
  isya: string;
}

export interface HijriDate {
  day: number;
  monthNumber: number;
  monthName: string;
  monthArabic: string;
  year: number;
  formatted: string;
  masehiFormatted: string;
}

export interface NextPrayerInfo {
  key: PrayerKey;
  name: string;
  time: string;
  remainingSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedRemaining: string;
  progressPercent: number; // 0 - 100%
  isTomorrow: boolean;
}

export interface CurrentPrayerInfo {
  key: PrayerKey;
  name: string;
  time: string;
}

export interface SalatDayData {
  city: IndonesianCity;
  dateStr: string; // YYYY-MM-DD
  hijri: HijriDate;
  timings: SalatTimings;
  prayers: PrayerItem[];
  nextPrayer: NextPrayerInfo;
  currentPrayer: CurrentPrayerInfo | null;
  qiblaDirection: number; // degrees from North
}

export const HIJRI_MONTHS_ID = [
  "Muharram",
  "Safar",
  "Rabi'ul Awwal",
  "Rabi'ul Akhir",
  "Jumadil Ula",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

export const HIJRI_MONTHS_AR = [
  "المحرّم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوّال",
  "ذو القعدة",
  "ذو الحجة",
];

export const PRAYER_DETAILS: Record<
  PrayerKey,
  { name: string; arabic: string; rakaat: number; description: string }
> = {
  subuh: {
    name: "Subuh",
    arabic: "الفجر",
    rakaat: 2,
    description: "Salat fardu 2 rakaat di awal fajar shadiq hingga terbit matahari.",
  },
  zuhur: {
    name: "Zuhur",
    arabic: "الظهر",
    rakaat: 4,
    description: "Salat fardu 4 rakaat setelah matahari tergelincir dari zenit.",
  },
  asar: {
    name: "Asar",
    arabic: "العصر",
    rakaat: 4,
    description: "Salat fardu 4 rakaat ketika bayangan benda sama panjang dengan aslinya.",
  },
  magrib: {
    name: "Magrib",
    arabic: "المغرب",
    rakaat: 3,
    description: "Salat fardu 3 rakaat tepat saat matahari terbenam sempurna.",
  },
  isya: {
    name: "Isya",
    arabic: "العشاء",
    rakaat: 4,
    description: "Salat fardu 4 rakaat saat mega merah (syafaq) di barat telah hilang.",
  },
};

// ---------------------------------------------------------------------------
// Astronomical Calculation for Prayer Times (Kemenag standard)
// ---------------------------------------------------------------------------
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function formatHoursToTime(hours: number): string {
  let h = Math.floor(hours) % 24;
  let m = Math.round((hours - Math.floor(hours)) * 60);
  if (m >= 60) {
    h = (h + 1) % 24;
    m = 0;
  }
  return `${padZero(h)}:${padZero(m)}`;
}

/**
 * Hitung arah kiblat dari koordinat (derajat dari Utara ke arah jarum jam)
 * Kaaba: 21.4225° N, 39.8262° E
 */
export function calculateQibla(lat: number, lng: number): number {
  const kaabaLat = degToRad(21.4225);
  const kaabaLng = degToRad(39.8262);
  const userLat = degToRad(lat);
  const userLng = degToRad(lng);

  const deltaLng = kaabaLng - userLng;

  const y = Math.sin(deltaLng);
  const x =
    Math.cos(userLat) * Math.tan(kaabaLat) -
    Math.sin(userLat) * Math.cos(deltaLng);

  let qibla = radToDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;
  return Math.round(qibla * 10) / 10;
}

/**
 * Standard astronomical calculation based on NOAA / Kemenag formulas:
 * Subuh angle: 20°
 * Isya angle: 18°
 * Asr shadow factor: 1 (Shafi'i / majority)
 * Ihtiyat (safety margin): +2 minutes
 */
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  gmtOffset: number
): SalatTimings {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const d = jd - 2451545.0; // Days since J2000.0

  // Mean anomaly of the Sun
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L =
    (q +
      1.915 * Math.sin(degToRad(g)) +
      0.02 * Math.sin(degToRad(2 * g))) %
    360;

  // Obliquity of ecliptic
  const e = 23.439 - 0.00000036 * d;

  // Sun Declination
  const sinDecl = Math.sin(degToRad(e)) * Math.sin(degToRad(L));
  const decl = radToDeg(Math.asin(sinDecl));

  // Equation of Time in hours
  const RA =
    radToDeg(
      Math.atan2(
        Math.cos(degToRad(e)) * Math.sin(degToRad(L)),
        Math.cos(degToRad(L))
      )
    ) / 15;
  const eqTime = q / 15 - (RA < 0 ? RA + 24 : RA);

  // Solar Noon (Zuhur base)
  const solarNoon = 12 + gmtOffset - lng / 15 - eqTime;

  // Function to calculate hour angle for a given depression/elevation angle
  const getHourAngle = (angle: number): number => {
    const latRad = degToRad(lat);
    const declRad = degToRad(decl);
    const angleRad = degToRad(angle);

    const cosH =
      (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) /
      (Math.cos(latRad) * Math.cos(declRad));

    if (cosH > 1 || cosH < -1) return 0; // extreme latitudes
    return radToDeg(Math.acos(cosH)) / 15;
  };

  // Subuh: 20° below horizon (-20°)
  const fajrAngle = -20;
  const fajrHA = getHourAngle(fajrAngle);
  const fajr = solarNoon - fajrHA;

  // Sunrise (Terbit): -0.833°
  const sunriseHA = getHourAngle(-0.833);
  const sunrise = solarNoon - sunriseHA;

  // Sunset (Magrib): -0.833°
  const sunset = solarNoon + sunriseHA;

  // Isya: 18° below horizon (-18°)
  const ishaAngle = -18;
  const ishaHA = getHourAngle(ishaAngle);
  const isha = solarNoon + ishaHA;

  // Asar: Shafi'i shadow = object + shadow at noon
  const noonZenith = Math.abs(lat - decl);
  const asrAngle = radToDeg(
    Math.atan(1 / (1 + Math.tan(degToRad(noonZenith))))
  );
  const asrHA = getHourAngle(asrAngle);
  const asr = solarNoon + asrHA;

  // Kemenag additions: +2 minutes ihtiyat (safety), Imsak = Subuh - 10 mins, Dhuha = Terbit + 20 mins
  const ihtiyat = 2 / 60; // 2 minutes

  const imsakTime = fajr + ihtiyat - 10 / 60;
  const subuhTime = fajr + ihtiyat;
  const terbitTime = sunrise - ihtiyat;
  const dhuhaTime = sunrise + 20 / 60;
  const zuhurTime = solarNoon + ihtiyat;
  const asarTime = asr + ihtiyat;
  const magribTime = sunset + ihtiyat;
  const isyaTime = isha + ihtiyat;

  return {
    imsak: formatHoursToTime(imsakTime),
    subuh: formatHoursToTime(subuhTime),
    terbit: formatHoursToTime(terbitTime),
    dhuha: formatHoursToTime(dhuhaTime),
    zuhur: formatHoursToTime(zuhurTime),
    asar: formatHoursToTime(asarTime),
    magrib: formatHoursToTime(magribTime),
    isya: formatHoursToTime(isyaTime),
  };
}

/**
 * Approximate Hijri Date conversion
 * Uses standard Umm al-Qura approximation or Intl formatter
 */
export function getHijriDate(date: Date): HijriDate {
  try {
    // Attempt modern browser Intl Islamic Umm al-Qura calendar
    const formatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const parts = formatter.formatToParts(date);
    let day = 1;
    let monthNumber = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === "day") day = parseInt(part.value, 10);
      if (part.type === "month") monthNumber = parseInt(part.value, 10);
      if (part.type === "year") year = parseInt(part.value, 10);
    }

    const monthIndex = Math.max(0, Math.min(11, monthNumber - 1));
    const monthName = HIJRI_MONTHS_ID[monthIndex];
    const monthArabic = HIJRI_MONTHS_AR[monthIndex];

    const masehiFormatter = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      day,
      monthNumber,
      monthName,
      monthArabic,
      year,
      formatted: `${day} ${monthName} ${year} H`,
      masehiFormatted: masehiFormatter.format(date),
    };
  } catch {
    // Fallback if Intl calendar not supported
    const masehiFormatter = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      day: 12,
      monthNumber: 5,
      monthName: "Jumadil Ula",
      monthArabic: "جمادى الأولى",
      year: 1448,
      formatted: `12 Jumadil Ula 1448 H`,
      masehiFormatted: masehiFormatter.format(date),
    };
  }
}

/**
 * Parse "HH:MM" to Date on the given base Date
 */
export function parseTimeToDate(timeStr: string, baseDate: Date): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Calculates current and next prayer with remaining countdown and progress
 */
export function calculateNextPrayer(
  timings: SalatTimings,
  now: Date
): {
  nextPrayer: NextPrayerInfo;
  currentPrayer: CurrentPrayerInfo | null;
  prayers: PrayerItem[];
} {
  const prayerKeys: PrayerKey[] = ["subuh", "zuhur", "asar", "magrib", "isya"];

  const prayerDates: { key: PrayerKey; time: string; date: Date }[] = prayerKeys.map(
    (key) => ({
      key,
      time: timings[key],
      date: parseTimeToDate(timings[key], now),
    })
  );

  const nowMs = now.getTime();

  // Determine current active prayer and next prayer
  let currentKey: PrayerKey | null = null;
  let nextKey: PrayerKey = "subuh";
  let targetDate: Date = prayerDates[0].date;
  let prevDate: Date = prayerDates[0].date;
  let isTomorrow = false;

  if (nowMs < prayerDates[0].date.getTime()) {
    // Before Subuh: next is Subuh of today, previous was Isya of yesterday
    nextKey = "subuh";
    targetDate = prayerDates[0].date;
    prevDate = new Date(prayerDates[4].date);
    prevDate.setDate(prevDate.getDate() - 1);
    currentKey = null; // nighttime before fajr
  } else if (nowMs < prayerDates[1].date.getTime()) {
    // Subuh -> Zuhur
    currentKey = "subuh";
    nextKey = "zuhur";
    prevDate = prayerDates[0].date;
    targetDate = prayerDates[1].date;
  } else if (nowMs < prayerDates[2].date.getTime()) {
    // Zuhur -> Asar
    currentKey = "zuhur";
    nextKey = "asar";
    prevDate = prayerDates[1].date;
    targetDate = prayerDates[2].date;
  } else if (nowMs < prayerDates[3].date.getTime()) {
    // Asar -> Magrib
    currentKey = "asar";
    nextKey = "magrib";
    prevDate = prayerDates[2].date;
    targetDate = prayerDates[3].date;
  } else if (nowMs < prayerDates[4].date.getTime()) {
    // Magrib -> Isya
    currentKey = "magrib";
    nextKey = "isya";
    prevDate = prayerDates[3].date;
    targetDate = prayerDates[4].date;
  } else {
    // After Isya: next is Subuh of tomorrow
    currentKey = "isya";
    nextKey = "subuh";
    prevDate = prayerDates[4].date;
    targetDate = new Date(prayerDates[0].date);
    targetDate.setDate(targetDate.getDate() + 1);
    isTomorrow = true;
  }

  const remainingSeconds = Math.max(
    0,
    Math.floor((targetDate.getTime() - nowMs) / 1000)
  );

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedRemaining = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

  // Progress percentage
  const totalInterval = targetDate.getTime() - prevDate.getTime();
  const elapsed = nowMs - prevDate.getTime();
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((elapsed / totalInterval) * 100))
  );

  const nextPrayer: NextPrayerInfo = {
    key: nextKey,
    name: PRAYER_DETAILS[nextKey].name,
    time: timings[nextKey],
    remainingSeconds,
    hours,
    minutes,
    seconds,
    formattedRemaining,
    progressPercent,
    isTomorrow,
  };

  const currentPrayer: CurrentPrayerInfo | null = currentKey
    ? {
        key: currentKey,
        name: PRAYER_DETAILS[currentKey].name,
        time: timings[currentKey],
      }
    : null;

  const prayers: PrayerItem[] = prayerKeys.map((key) => {
    const details = PRAYER_DETAILS[key];
    const time = timings[key];
    const itemDate = parseTimeToDate(time, now);

    return {
      key,
      name: details.name,
      arabic: details.arabic,
      time,
      rakaat: details.rakaat,
      description: details.description,
      isNext: key === nextKey,
      isCurrent: key === currentKey,
      isPassed: nowMs > itemDate.getTime(),
    };
  });

  return { nextPrayer, currentPrayer, prayers };
}

/**
 * Builds complete day data for city & date
 */
export function getSalatDayData(
  city: IndonesianCity = DEFAULT_CITY,
  date: Date = new Date(),
  customTimings?: SalatTimings
): SalatDayData {
  const timings =
    customTimings ||
    calculatePrayerTimes(date, city.lat, city.lng, city.gmtOffset);

  const hijri = getHijriDate(date);
  const { nextPrayer, currentPrayer, prayers } = calculateNextPrayer(
    timings,
    date
  );
  const qiblaDirection = calculateQibla(city.lat, city.lng);

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const dateStr = `${year}-${month}-${day}`;

  return {
    city,
    dateStr,
    hijri,
    timings,
    prayers,
    nextPrayer,
    currentPrayer,
    qiblaDirection,
  };
}
