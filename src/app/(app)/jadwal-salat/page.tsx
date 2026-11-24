"use client";

import { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/page-header";
import {
  INDONESIAN_CITIES,
  DEFAULT_CITY,
  findCityById,
  findClosestCity,
  IndonesianCity,
} from "@/lib/salat-cities";
import {
  PrayerKey,
  SalatTimings,
  HijriDate,
  PRAYER_DETAILS,
  calculatePrayerTimes,
  calculateNextPrayer,
  calculateQibla,
  getHijriDate,
} from "@/lib/salat";
import {
  Clock,
  MapPin,
  Compass,
  Sunrise,
  Sunset,
  Sun,
  SunMedium,
  MoonStar,
  Search,
  Check,
  Navigation,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const STORAGE_CITY_KEY = "siraj_prayer_city";

function getCityWallTime(now: Date, gmtOffset: number): Date {
  return new Date(
    now.getTime() + (gmtOffset * 60 + now.getTimezoneOffset()) * 60_000
  );
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSalatTimings(value: unknown): value is SalatTimings {
  if (!value || typeof value !== "object") return false;
  const timings = value as Record<string, unknown>;
  return [
    "imsak",
    "subuh",
    "terbit",
    "dhuha",
    "zuhur",
    "asar",
    "magrib",
    "isya",
  ].every((key) => {
    const time = timings[key];
    return (
      typeof time === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)
    );
  });
}

function getUpdatedLabel(updatedAt: Date, now: Date): string {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now.getTime() - updatedAt.getTime()) / 1000)
  );

  if (elapsedSeconds < 60) return `${elapsedSeconds} detik yang lalu`;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit yang lalu`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  return `${elapsedHours} jam yang lalu`;
}

const PRAYER_ICONS: Record<
  PrayerKey,
  React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
> = {
  subuh: Sunrise,
  zuhur: Sun,
  asar: SunMedium,
  magrib: Sunset,
  isya: MoonStar,
};

// Doa & Dzikir ringkas setelah salat fardhu
const DZIKIR_AFTER_PRAYER = [
  {
    title: "Istighfar (3x)",
    arabic: "أَسْتَغْفِرُ اللهَ (٣×)",
    latin: "Astaghfirullah (3x)",
    arti: "Aku memohon ampunan kepada Allah.",
  },
  {
    title: "Doa Keselamatan",
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    latin: "Allahumma antas salam wa minkas salam tabarakta ya dzal jalali wal ikram.",
    arti: "Ya Allah, Engkaulah As-Salam (Yang memberi keselamatan), dan dari-Mu lah keselamatan, Maha Berkah Engkau, wahai Dzat yang memiliki keagungan dan kemuliaan.",
  },
  {
    title: "Tasbih, Tahmid, Takbir (33x)",
    arabic: "سُبْحَانَ اللهِ (٣٣×) ، الْحَمْدُ لِلَّهِ (٣٣×) ، اللهُ أَكْبَرُ (٣٣×)",
    latin: "Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x)",
    arti: "Maha Suci Allah (33x), Segala puji bagi Allah (33x), Allah Maha Besar (33x).",
  },
  {
    title: "Penyempurna Seratus (Tahlil)",
    arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli syai'in qodiir.",
    arti: "Tiada ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala pujian, dan Dia Maha Kuasa atas segala sesuatu.",
  },
];

export default function JadwalSalatPage() {
  const [selectedCity, setSelectedCity] = useState<IndonesianCity>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCityId = localStorage.getItem(STORAGE_CITY_KEY);
        if (savedCityId) return findCityById(savedCityId);
      } catch {
        // localStorage may fail
      }
    }
    return DEFAULT_CITY;
  });

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [timings, setTimings] = useState<SalatTimings>(() => {
    const cityTime = getCityWallTime(new Date(), selectedCity.gmtOffset);
    return calculatePrayerTimes(
      new Date(cityTime.getFullYear(), cityTime.getMonth(), cityTime.getDate()),
      selectedCity.lat,
      selectedCity.lng,
      selectedCity.gmtOffset
    );
  });
  const [timingsDateKey, setTimingsDateKey] = useState(() =>
    getDateKey(getCityWallTime(new Date(), selectedCity.gmtOffset))
  );
  const [hijriDateKey, setHijriDateKey] = useState(() =>
    getDateKey(getCityWallTime(new Date(), selectedCity.gmtOffset))
  );
  const [hijri, setHijri] = useState<HijriDate>(() =>
    getHijriDate(getCityWallTime(new Date(), selectedCity.gmtOffset))
  );
  const [scheduleResult, setScheduleResult] = useState<{
    cityId: string;
    dateKey: string;
    status: "ready" | "error";
    updatedAt: Date | null;
  } | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Modal / Tab States
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"hari-ini" | "bulanan" | "dzikir">("hari-ini");
  const [expandedDzikir, setExpandedDzikir] = useState<number | null>(null);

  const selectedCityTime = useMemo(
    () => getCityWallTime(currentTime, selectedCity.gmtOffset),
    [currentTime, selectedCity.gmtOffset]
  );
  const selectedDateKey = useMemo(
    () => getDateKey(selectedCityTime),
    [selectedCityTime]
  );
  const currentScheduleResult =
    scheduleResult?.cityId === selectedCity.id &&
    scheduleResult.dateKey === selectedDateKey
      ? scheduleResult
      : null;
  const currentTimings = useMemo(() => {
    if (timingsDateKey === selectedDateKey) return timings;

    const [year, month, day] = selectedDateKey.split("-").map(Number);
    return calculatePrayerTimes(
      new Date(year, month - 1, day),
      selectedCity.lat,
      selectedCity.lng,
      selectedCity.gmtOffset
    );
  }, [selectedCity, selectedDateKey, timings, timingsDateKey]);
  const currentHijri = useMemo(() => {
    if (hijriDateKey === selectedDateKey) return hijri;
    const [year, month, day] = selectedDateKey.split("-").map(Number);
    return getHijriDate(new Date(year, month - 1, day));
  }, [hijri, hijriDateKey, selectedDateKey]);

  // Fetch once when the selected city or its local calendar day changes.
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTimings() {
      try {
        const res = await fetch(
          `/api/jadwal-salat?city=${encodeURIComponent(selectedCity.id)}&date=${selectedDateKey}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error(`Jadwal salat gagal dimuat (${res.status}).`);
        }

        const data = (await res.json()) as {
          timings?: unknown;
          hijri?: HijriDate;
        };
        if (!isSalatTimings(data.timings)) {
          throw new Error("Data jadwal salat dari API tidak valid.");
        }
        if (!isMounted) return;

        setTimings(data.timings);
        setTimingsDateKey(selectedDateKey);
        if (data.hijri) {
          setHijri(data.hijri);
          setHijriDateKey(selectedDateKey);
        }
        setScheduleResult({
          cityId: selectedCity.id,
          dateKey: selectedDateKey,
          status: "ready",
          updatedAt: new Date(),
        });
      } catch {
        if (!isMounted || controller.signal.aborted) return;
        setScheduleResult({
          cityId: selectedCity.id,
          dateKey: selectedDateKey,
          status: "error",
          updatedAt: null,
        });
      }
    }

    fetchTimings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedCity.id, selectedDateKey]);

  // Live real-time clock (updates every 1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute countdown and prayer states dynamically based on currentTime & timings
  const { nextPrayer, currentPrayer, prayers } = useMemo(() => {
    return calculateNextPrayer(currentTimings, selectedCityTime);
  }, [currentTimings, selectedCityTime]);

  // Qibla direction for current city
  const qiblaAngle = useMemo(() => {
    return calculateQibla(selectedCity.lat, selectedCity.lng);
  }, [selectedCity]);

  // Handle City Selection
  const handleSelectCity = (city: IndonesianCity) => {
    setSelectedCity(city);
    const cityTime = getCityWallTime(currentTime, city.gmtOffset);
    const cityDateKey = getDateKey(cityTime);
    const cityDate = new Date(
      cityTime.getFullYear(),
      cityTime.getMonth(),
      cityTime.getDate()
    );
    setTimings(
      calculatePrayerTimes(
        cityDate,
        city.lat,
        city.lng,
        city.gmtOffset
      )
    );
    setTimingsDateKey(cityDateKey);
    setHijri(getHijriDate(cityDate));
    setHijriDateKey(cityDateKey);
    setIsCityModalOpen(false);
    setCitySearchQuery("");
    setGpsError(null);
    try {
      localStorage.setItem(STORAGE_CITY_KEY, city.id);
    } catch {
      // ignore
    }
  };

  // Handle Geolocation (GPS)
  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Browser Anda tidak mendukung deteksi lokasi otomatis.");
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        const matchedCity = findClosestCity(latitude, longitude);
        handleSelectCity(matchedCity);
      },
      (err) => {
        setIsGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Izin lokasi ditolak. Silakan pilih kota secara manual.");
        } else {
          setGpsError("Gagal mendeteksi lokasi GPS. Silakan pilih kota secara manual.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filtered cities for search modal
  const filteredCities = useMemo(() => {
    const q = citySearchQuery.trim().toLowerCase();
    if (!q) return INDONESIAN_CITIES;
    return INDONESIAN_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q) ||
        c.timezone.toLowerCase().includes(q)
    );
  }, [citySearchQuery]);

  // Monthly Schedule Generator (days of current month)
  const monthlySchedule = useMemo(() => {
    const [year, month, day] = selectedDateKey.split("-").map(Number);
    const now = new Date(year, month - 1, day);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const dayTimings = calculatePrayerTimes(
        d,
        selectedCity.lat,
        selectedCity.lng,
        selectedCity.gmtOffset
      );
      const isToday = day === now.getDate();
      days.push({
        day,
        dateObj: d,
        isToday,
        timings: dayTimings,
        dayName: d.toLocaleDateString("id-ID", { weekday: "short" }),
      });
    }
    return days;
  }, [selectedDateKey, selectedCity]);

  // Time formatter
  const formattedLiveClock = selectedCityTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
      {/* Page Header */}
      <PageHeader
        title="Jadwal Salat"
        subtitle="Waktu salat fardu, imsakiah, dan hitung mundur salat berikutnya"
      >
        {/* City Selector Button & GPS trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:border-primary/40 rounded-xl text-sm font-medium text-text transition-all shadow-sm hover:shadow cursor-pointer"
            title="Ubah lokasi kota"
          >
            <MapPin size={16} className="text-primary shrink-0" />
            <span className="font-semibold text-primary">{selectedCity.name}</span>
            <span className="text-muted text-xs hidden sm:inline">
              ({selectedCity.timezone})
            </span>
            <ChevronDown size={14} className="text-muted ml-0.5" />
          </button>

          <button
            onClick={handleDetectLocation}
            disabled={isGpsLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Deteksi lokasi saya saat ini via GPS"
          >
            {isGpsLoading ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <Navigation size={14} className="text-primary" />
            )}
            <span className="hidden sm:inline">Lokasi Saya</span>
          </button>
        </div>
      </PageHeader>

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="mb-6 p-3.5 bg-error/10 border border-error/20 rounded-xl flex items-center justify-between text-xs text-error">
          <span>{gpsError}</span>
          <button
            onClick={() => setGpsError(null)}
            className="p-1 hover:bg-error/10 rounded-md cursor-pointer"
            aria-label="Tutup"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <section className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted">
            <CalendarDays size={14} className="text-primary" />
            <span>{selectedCity.name}, {selectedCity.province}</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-text">
            {currentHijri.formatted}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span>{currentHijri.masehiFormatted}</span>
            <span aria-hidden="true">·</span>
            <span className="font-arabic text-base text-primary" dir="rtl">
              {currentHijri.monthArabic}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted sm:justify-end">
          <Clock size={15} className="text-primary" />
          <span>Waktu {selectedCity.timezone}</span>
          <time className="font-mono font-semibold tabular-nums text-text">
            {formattedLiveClock}
          </time>
        </div>
      </section>

      <section
        aria-labelledby="next-prayer-title"
        className="mb-8 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Salat Berikutnya
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3
                id="next-prayer-title"
                key={nextPrayer.key}
                className="text-3xl font-semibold tracking-tight text-text transition-opacity sm:text-4xl"
              >
                {nextPrayer.name}
              </h3>
              <span className="font-mono text-xl font-semibold tabular-nums text-primary sm:text-2xl">
                {nextPrayer.time}
                <span className="ml-1.5 font-sans text-xs font-medium text-muted">
                  {selectedCity.timezone}
                </span>
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted">
              {nextPrayer.isTomorrow ? "Salat Subuh esok hari. " : ""}
              {PRAYER_DETAILS[nextPrayer.key].description}
            </p>
            {currentPrayer && (
              <p className="mt-2 text-xs text-muted">
                Sedang berlangsung:{" "}
                <span className="font-semibold text-text">
                  {currentPrayer.name} ({currentPrayer.time})
                </span>
              </p>
            )}
          </div>

          <div className="sm:min-w-[220px] sm:text-right">
            <p className="text-xs font-medium text-muted">Waktu tersisa</p>
            <p
              aria-label={`${nextPrayer.formattedRemaining} lagi`}
              className="mt-1 font-mono text-4xl font-semibold tracking-tight tabular-nums text-primary sm:text-5xl"
            >
              {nextPrayer.formattedRemaining}
            </p>
            <p className="mt-1 text-sm text-muted">lagi</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>Menuju waktu salat</span>
            <span>{nextPrayer.progressPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Waktu menuju salat berikutnya"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={nextPrayer.progressPercent}
            className="h-1.5 overflow-hidden rounded-full bg-primary/10"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
              style={{ width: `${nextPrayer.progressPercent}%` }}
            />
          </div>
        </div>

        <p role="status" className="mt-4 text-xs text-muted">
          {currentScheduleResult?.status === "ready" &&
          currentScheduleResult.updatedAt
            ? `Terakhir diperbarui: ${getUpdatedLabel(currentScheduleResult.updatedAt, currentTime)}`
            : currentScheduleResult?.status === "error"
              ? "Jadwal API tidak tersedia; menampilkan perhitungan lokal SIRAJ."
              : "Memuat jadwal salat..."}
        </p>
      </section>

      {/* Tabs: Hari Ini / Bulanan / Doa & Dzikir */}
      <div className="mb-6 grid grid-cols-3 gap-1 border-b border-border pb-2 sm:flex sm:items-center sm:gap-2">
        <button
          onClick={() => setActiveTab("hari-ini")}
          className={`rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors cursor-pointer sm:px-4 sm:text-sm ${
            activeTab === "hari-ini"
              ? "bg-primary text-white"
              : "text-muted hover:text-text hover:bg-primary/[0.04]"
          }`}
        >
          Waktu Hari Ini
        </button>
        <button
          onClick={() => setActiveTab("bulanan")}
          className={`rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors cursor-pointer sm:px-4 sm:text-sm ${
            activeTab === "bulanan"
              ? "bg-primary text-white"
              : "text-muted hover:text-text hover:bg-primary/[0.04]"
          }`}
        >
          Jadwal Bulanan
        </button>
        <button
          onClick={() => setActiveTab("dzikir")}
          className={`rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors cursor-pointer sm:px-4 sm:text-sm ${
            activeTab === "dzikir"
              ? "bg-primary text-white"
              : "text-muted hover:text-text hover:bg-primary/[0.04]"
          }`}
        >
          Dzikir Setelah Salat
        </button>
      </div>

      {/* Tab Content: Hari Ini */}
      {activeTab === "hari-ini" && (
        <>
          {/* Jadwal Salat Fardu */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-text">
                Jadwal Salat
              </h3>
              <span className="text-xs text-muted">
                Metode Kementerian Agama RI (Kemenag)
              </span>
            </div>

            <ol className="overflow-hidden rounded-xl border border-border bg-surface divide-y divide-border sm:grid sm:grid-cols-5 sm:divide-x sm:divide-y-0">
              {prayers.map((prayer) => {
                const Icon = PRAYER_ICONS[prayer.key];
                const stateLabel = prayer.isNext
                  ? "Berikutnya"
                  : prayer.isCurrent
                    ? "Waktu ini"
                    : prayer.isPassed
                      ? "Selesai"
                      : null;

                return (
                  <li
                    key={prayer.key}
                    aria-current={prayer.isCurrent ? "step" : undefined}
                    className={`min-w-0 ${
                      prayer.isNext
                        ? "bg-primary/[0.05] sm:border-t-2 sm:border-t-primary"
                        : prayer.isCurrent
                          ? "bg-secondary/[0.07]"
                          : prayer.isPassed
                            ? "opacity-60"
                            : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 p-4 sm:flex-col sm:items-start sm:gap-3 sm:p-4">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          prayer.isNext || prayer.isCurrent
                            ? "bg-primary text-white"
                            : "bg-primary/[0.07] text-primary"
                        }`}
                      >
                        <Icon size={17} strokeWidth={1.9} />
                      </span>

                      <div className="min-w-0 flex-1 sm:w-full sm:flex-none">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-text">
                            {prayer.name}
                          </h4>
                          {stateLabel && (
                            <span
                              className={`shrink-0 text-[10px] font-semibold ${
                                prayer.isNext || prayer.isCurrent
                                  ? "text-primary"
                                  : "text-muted"
                              }`}
                            >
                              {stateLabel}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                          <span className="font-arabic" dir="rtl">
                          {prayer.arabic}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{prayer.rakaat} rakaat</span>
                        </div>
                      </div>

                      <div className="ml-auto text-right sm:ml-0 sm:w-full sm:border-t sm:border-border/70 sm:pt-3 sm:text-left">
                        <time className="font-mono text-xl font-semibold tabular-nums text-text sm:text-2xl">
                        {prayer.time}
                        </time>
                        <span className="ml-1.5 text-[10px] font-medium text-muted">
                          {selectedCity.timezone}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Jadwal Tambahan (Imsakiah, Syuruq, Dhuha) & Kiblat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Waktu Pendukung / Imsakiah */}
            <div className="card md:col-span-2 !p-6">
              <h4 className="font-semibold text-text text-base mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-secondary-dark" />
                Waktu Pelengkap &amp; Sunnah
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <span className="text-xs text-muted block mb-1">Imsak (Sahur)</span>
                  <div className="text-xl font-bold font-mono text-text">
                    {currentTimings.imsak}
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">
                    10 mnt sebelum Subuh
                  </span>
                </div>

                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <span className="text-xs text-muted block mb-1">Terbit (Syuruq)</span>
                  <div className="text-xl font-bold font-mono text-text">
                    {currentTimings.terbit}
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">
                    Batas akhir Subuh
                  </span>
                </div>

                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <span className="text-xs text-muted block mb-1">Salat Dhuha</span>
                  <div className="text-xl font-bold font-mono text-text">
                    {currentTimings.dhuha}
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">
                    20 mnt setelah terbit
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3.5 bg-primary/[0.03] border border-primary/10 rounded-xl flex items-start gap-3">
                <BookOpen size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  <strong>Catatan Ihtiyat:</strong> Jadwal telah menyertakan waktu pengaman (ihtiyat) sebesar 2 menit sesuai standar hisab rukyat Kementerian Agama Republik Indonesia untuk kehati-hatian dalam ibadah.
                </p>
              </div>
            </div>

            {/* Arah Kiblat */}
            <div className="card !p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-text text-base mb-1 flex items-center gap-2">
                  <Compass size={17} className="text-primary" />
                  Arah Kiblat
                </h4>
                <p className="text-xs text-muted mb-4">
                  Dari {selectedCity.name} menuju Ka&apos;bah di Makkah
                </p>

                {/* Kompas visual */}
                <div className="relative w-28 h-28 mx-auto my-2 rounded-full border-2 border-dashed border-primary/30 bg-primary/[0.02] flex items-center justify-center">
                  {/* Lingkaran penunjuk derajat */}
                  <span className="absolute top-1 text-[9px] font-bold text-muted">U</span>
                  <span className="absolute right-1 text-[9px] font-bold text-muted">T</span>
                  <span className="absolute bottom-1 text-[9px] font-bold text-muted">S</span>
                  <span className="absolute left-1 text-[9px] font-bold text-muted">B</span>

                  {/* Jarum Kiblat yang berputar */}
                  <div
                    className="absolute w-full h-full flex items-center justify-center transition-transform duration-700"
                    style={{ transform: `rotate(${qiblaAngle}deg)` }}
                  >
                    <div className="w-1 h-12 bg-gradient-to-t from-transparent via-primary to-secondary-dark rounded-full relative">
                      <div className="w-2.5 h-2.5 bg-secondary-dark rounded-full absolute -top-1 -left-[3px] shadow-sm" />
                    </div>
                  </div>

                  {/* Titik pusat */}
                  <div className="w-3 h-3 rounded-full bg-primary z-10" />
                </div>
              </div>

              <div className="text-center pt-3 border-t border-border mt-3">
                <span className="text-2xl font-bold font-mono text-primary">
                  {qiblaAngle}°
                </span>
                <span className="text-xs text-muted block mt-0.5">
                  Barat Laut (BBW)
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab Content: Bulanan */}
      {activeTab === "bulanan" && (
        <section className="card !p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-text">
                Jadwal Salat Bulan Ini
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Wilayah {selectedCity.name} dan sekitarnya ({selectedCity.timezone})
              </p>
            </div>
            <div className="text-xs text-muted bg-background px-3 py-1.5 rounded-lg border border-border">
              Hari ini: <strong className="text-primary">{currentHijri.formatted}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted uppercase tracking-wider bg-background/50">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Imsak</th>
                  <th className="py-3 px-3">Subuh</th>
                  <th className="py-3 px-3">Terbit</th>
                  <th className="py-3 px-3">Zuhur</th>
                  <th className="py-3 px-3">Asar</th>
                  <th className="py-3 px-3">Magrib</th>
                  <th className="py-3 px-3">Isya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {monthlySchedule.map((row) => (
                  <tr
                    key={row.day}
                    className={`transition-colors ${
                      row.isToday
                        ? "bg-primary/[0.08] font-semibold text-primary"
                        : "hover:bg-primary/[0.02]"
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{row.dayName}, {row.day}</span>
                        {row.isToday && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-primary text-white rounded font-bold">
                            Hari Ini
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted">{row.timings.imsak}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">{row.timings.subuh}</td>
                    <td className="py-2.5 px-3 font-mono text-muted">{row.timings.terbit}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">{row.timings.zuhur}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">{row.timings.asar}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">{row.timings.magrib}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">{row.timings.isya}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab Content: Dzikir & Doa Setelah Salat */}
      {activeTab === "dzikir" && (
        <section className="card !p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-text">
              Dzikir &amp; Doa Setelah Salat Fardhu
            </h3>
            <p className="text-xs text-muted mt-1">
              Dzikir yang disunnahkan untuk dibaca sesudah menunaikan salat wajib berdasarkan hadits shahih.
            </p>
          </div>

          <div className="space-y-4">
            {DZIKIR_AFTER_PRAYER.map((item, idx) => {
              const isExpanded = expandedDzikir === idx || expandedDzikir === null;
              return (
                <div
                  key={item.title}
                  className="p-5 bg-background rounded-xl border border-border transition-all hover:border-primary/20"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() =>
                      setExpandedDzikir(expandedDzikir === idx ? -1 : idx)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-text text-sm sm:text-base">
                        {item.title}
                      </h4>
                    </div>
                    <button className="text-muted hover:text-text p-1 cursor-pointer" aria-label="Toggle dzikir">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border/60">
                      {/* Teks Arab */}
                      <p
                        className="font-arabic text-xl sm:text-2xl text-text leading-loose text-right mb-3"
                        dir="rtl"
                      >
                        {item.arabic}
                      </p>

                      {/* Transliterasi Latin */}
                      <p className="text-xs sm:text-sm text-primary font-medium italic mb-2">
                        &ldquo;{item.latin}&rdquo;
                      </p>

                      {/* Terjemahan */}
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">
                        <strong>Artinya:</strong> {item.arti}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Modal: Pemilih Kota */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-text text-lg">Pilih Kota / Wilayah</h3>
                <p className="text-xs text-muted mt-0.5">
                  Pilih kota untuk menghitung waktu salat secara presisi
                </p>
              </div>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="p-1.5 text-muted hover:text-text rounded-lg hover:bg-background transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Input & Quick GPS */}
            <div className="p-4 border-b border-border bg-background/50 space-y-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                  placeholder="Cari nama kota atau provinsi (cth: Surabaya, Aceh)..."
                  className="input !pl-10 !py-2 text-sm"
                  autoFocus
                />
                {citySearchQuery && (
                  <button
                    onClick={() => setCitySearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setIsCityModalOpen(false);
                  handleDetectLocation();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-xl text-xs font-semibold border border-primary/20 transition-colors cursor-pointer"
              >
                <Navigation size={13} />
                Gunakan Lokasi GPS Saya Saat Ini
              </button>
            </div>

            {/* City List */}
            <div className="flex-1 overflow-y-auto p-3 divide-y divide-border/40 max-h-96">
              {filteredCities.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">
                  Tidak ditemukan kota dengan kata kunci &ldquo;{citySearchQuery}&rdquo;.
                </div>
              ) : (
                filteredCities.map((city) => {
                  const isSelected = city.id === selectedCity.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className={`w-full p-3 text-left rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/[0.08] text-primary font-semibold"
                          : "hover:bg-primary/[0.03] text-text"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin
                          size={16}
                          className={isSelected ? "text-primary" : "text-muted"}
                        />
                        <div>
                          <div className="text-sm font-medium">{city.name}</div>
                          <div className="text-xs text-muted">
                            {city.province} • {city.timezone}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
