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
  const [timings, setTimings] = useState<SalatTimings>(() =>
    calculatePrayerTimes(
      new Date(),
      selectedCity.lat,
      selectedCity.lng,
      selectedCity.gmtOffset
    )
  );
  const [hijri, setHijri] = useState<HijriDate>(() => getHijriDate(new Date()));
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Modal / Tab States
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"hari-ini" | "bulanan" | "dzikir">("hari-ini");
  const [expandedDzikir, setExpandedDzikir] = useState<number | null>(null);

  // Fetch timings when city changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTimings() {
      try {
        const res = await fetch(`/api/jadwal-salat?city=${selectedCity.id}`, {
          signal: controller.signal,
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data.timings && isMounted) setTimings(data.timings);
          if (data.hijri && isMounted) setHijri(data.hijri);
        }
      } catch {
        // Fallback calculations already initialized
      }
    }

    fetchTimings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedCity.id]);

  // Live real-time clock (updates every 1000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute countdown and prayer states dynamically based on currentTime & timings
  const { nextPrayer, currentPrayer, prayers } = useMemo(() => {
    return calculateNextPrayer(timings, currentTime);
  }, [timings, currentTime]);

  // Qibla direction for current city
  const qiblaAngle = useMemo(() => {
    return calculateQibla(selectedCity.lat, selectedCity.lng);
  }, [selectedCity]);

  // Handle City Selection
  const handleSelectCity = (city: IndonesianCity) => {
    setSelectedCity(city);
    setTimings(
      calculatePrayerTimes(new Date(), city.lat, city.lng, city.gmtOffset)
    );
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
    const now = currentTime;
    const year = now.getFullYear();
    const month = now.getMonth();
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
  }, [currentTime, selectedCity]);

  // Time formatter
  const formattedLiveClock = currentTime.toLocaleTimeString("id-ID", {
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

      {/* Top Banner: Tanggal Hijriah, Masehi & Live Clock */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div
          className="absolute inset-0 pattern-star opacity-10 pattern-fade pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Hijri & Masehi */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-secondary-light mb-3">
              <CalendarDays size={13} />
              <span>{selectedCity.name}, {selectedCity.province}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{hijri.formatted}</span>
            </h2>
            <div className="flex items-center gap-3 mt-1.5 text-white/80 text-sm sm:text-base">
              <span>{hijri.masehiFormatted}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="font-arabic text-lg text-secondary-light tracking-wide">
                {hijri.monthArabic}
              </span>
            </div>
          </div>

          {/* Live Clock Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3.5 flex flex-col items-center md:items-end w-full md:w-auto">
            <span className="text-xs uppercase tracking-wider text-white/70 font-medium">
              Waktu Lokal ({selectedCity.timezone})
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white mt-0.5">
              {formattedLiveClock}
            </div>
          </div>
        </div>
      </section>

      {/* Hero: Hitung Mundur Waktu Salat Berikutnya */}
      <section className="card !p-6 sm:!p-8 mb-8 bg-surface border-border relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Info Salat Berikutnya */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/15 text-secondary-dark border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary-dark animate-pulse" />
                Salat Berikutnya
              </span>
              {currentPrayer && (
                <span className="text-xs text-muted">
                  • Sedang berlangsung: <strong className="text-text">{currentPrayer.name}</strong> ({currentPrayer.time})
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-text">
                Menuju {nextPrayer.name}
              </h3>
              <span className="text-base sm:text-lg font-semibold text-primary">
                pukul {nextPrayer.time} {selectedCity.timezone}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted mt-1.5">
              {nextPrayer.isTomorrow ? "Salat Subuh esok hari. " : ""}
              {PRAYER_DETAILS[nextPrayer.key].description}
            </p>

            {/* Interval Progress Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs text-muted mb-1.5 font-medium">
                <span>Selang Waktu</span>
                <span>{nextPrayer.progressPercent}% berjalan</span>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${nextPrayer.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Big Countdown Digits */}
          <div className="bg-primary/[0.04] border border-primary/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center shrink-0 w-full lg:w-auto">
            <span className="text-xs uppercase tracking-wider text-muted font-semibold mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              Sisa Waktu Menuju Salat
            </span>
            <div className="flex items-center gap-2 sm:gap-3 text-center">
              {/* Jam */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-primary">
                  {String(nextPrayer.hours).padStart(2, "0")}
                </div>
                <span className="text-[10px] sm:text-xs text-muted uppercase mt-1.5 font-medium">
                  Jam
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-bold text-muted pb-4">:</span>

              {/* Menit */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-primary">
                  {String(nextPrayer.minutes).padStart(2, "0")}
                </div>
                <span className="text-[10px] sm:text-xs text-muted uppercase mt-1.5 font-medium">
                  Menit
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-bold text-muted pb-4">:</span>

              {/* Detik */}
              <div className="flex flex-col items-center">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-center text-2xl sm:text-3xl font-bold font-mono text-primary">
                  {String(nextPrayer.seconds).padStart(2, "0")}
                </div>
                <span className="text-[10px] sm:text-xs text-muted uppercase mt-1.5 font-medium">
                  Detik
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: Hari Ini / Bulanan / Doa & Dzikir */}
      <div className="flex items-center gap-2 border-b border-border mb-6 pb-2">
        <button
          onClick={() => setActiveTab("hari-ini")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "hari-ini"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-text hover:bg-primary/[0.04]"
          }`}
        >
          Waktu Hari Ini
        </button>
        <button
          onClick={() => setActiveTab("bulanan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "bulanan"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-text hover:bg-primary/[0.04]"
          }`}
        >
          Jadwal Bulanan
        </button>
        <button
          onClick={() => setActiveTab("dzikir")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "dzikir"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-text hover:bg-primary/[0.04]"
          }`}
        >
          Dzikir Setelah Salat
        </button>
      </div>

      {/* Tab Content: Hari Ini */}
      {activeTab === "hari-ini" && (
        <>
          {/* 5 Kartu Jadwal Salat Fardu */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Jadwal Salat 5 Waktu
              </h3>
              <span className="text-xs text-muted">
                Metode Kementerian Agama RI (Kemenag)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {prayers.map((prayer) => {
                const Icon = PRAYER_ICONS[prayer.key];

                let cardStyle = "bg-surface border-border hover:border-primary/30";
                let badgeNode = null;

                if (prayer.isNext) {
                  cardStyle =
                    "bg-secondary/5 border-secondary shadow-md ring-2 ring-secondary/30";
                  badgeNode = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-primary">
                      Berikutnya
                    </span>
                  );
                } else if (prayer.isCurrent) {
                  cardStyle =
                    "bg-primary/[0.04] border-primary shadow-sm ring-2 ring-primary/20";
                  badgeNode = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                      Waktu Ini
                    </span>
                  );
                } else if (prayer.isPassed) {
                  cardStyle = "bg-surface/80 border-border opacity-75";
                  badgeNode = (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted">
                      <Check size={11} className="text-success" />
                      Selesai
                    </span>
                  );
                }

                return (
                  <div
                    key={prayer.key}
                    className={`card !p-5 transition-all flex flex-col justify-between ${cardStyle}`}
                  >
                    <div>
                      {/* Header Kartu */}
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            prayer.isNext
                              ? "bg-secondary text-primary font-bold"
                              : prayer.isCurrent
                              ? "bg-primary text-white"
                              : "bg-primary/5 text-primary"
                          }`}
                        >
                          <Icon size={20} strokeWidth={2} />
                        </div>
                        {badgeNode}
                      </div>

                      {/* Nama Salat & Bahasa Arab */}
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="font-bold text-text text-base">
                          {prayer.name}
                        </h4>
                        <span className="font-arabic text-muted text-sm" dir="rtl">
                          {prayer.arabic}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted mb-4">
                        {prayer.rakaat} Raka&apos;at
                      </p>
                    </div>

                    {/* Waktu Jam */}
                    <div className="pt-3 border-t border-border/60 flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-primary tracking-tight">
                        {prayer.time}
                      </span>
                      <span className="text-[11px] text-muted font-medium">
                        {selectedCity.timezone}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
                    {timings.imsak}
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">
                    10 mnt sebelum Subuh
                  </span>
                </div>

                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <span className="text-xs text-muted block mb-1">Terbit (Syuruq)</span>
                  <div className="text-xl font-bold font-mono text-text">
                    {timings.terbit}
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">
                    Batas akhir Subuh
                  </span>
                </div>

                <div className="p-3.5 bg-background rounded-xl border border-border">
                  <span className="text-xs text-muted block mb-1">Salat Dhuha</span>
                  <div className="text-xl font-bold font-mono text-text">
                    {timings.dhuha}
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
              Hari ini: <strong className="text-primary">{hijri.formatted}</strong>
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
