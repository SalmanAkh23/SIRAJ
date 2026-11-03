export interface IndonesianCity {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  timezone: "WIB" | "WITA" | "WIT";
  gmtOffset: number; // in hours, e.g. 7, 8, 9
}

export const INDONESIAN_CITIES: IndonesianCity[] = [
  // DKI Jakarta & Banten & Jawa Barat
  { id: "jakarta", name: "Jakarta", province: "DKI Jakarta", lat: -6.2088, lng: 106.8456, timezone: "WIB", gmtOffset: 7 },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", lat: -6.9175, lng: 107.6191, timezone: "WIB", gmtOffset: 7 },
  { id: "bogor", name: "Bogor", province: "Jawa Barat", lat: -6.5971, lng: 106.8060, timezone: "WIB", gmtOffset: 7 },
  { id: "depok", name: "Depok", province: "Jawa Barat", lat: -6.4025, lng: 106.7942, timezone: "WIB", gmtOffset: 7 },
  { id: "bekasi", name: "Bekasi", province: "Jawa Barat", lat: -6.2383, lng: 106.9756, timezone: "WIB", gmtOffset: 7 },
  { id: "tangerang", name: "Tangerang", province: "Banten", lat: -6.1783, lng: 106.6319, timezone: "WIB", gmtOffset: 7 },
  { id: "tangerang-selatan", name: "Tangerang Selatan", province: "Banten", lat: -6.2885, lng: 106.7179, timezone: "WIB", gmtOffset: 7 },
  { id: "serang", name: "Serang", province: "Banten", lat: -6.1104, lng: 106.1640, timezone: "WIB", gmtOffset: 7 },
  { id: "cirebon", name: "Cirebon", province: "Jawa Barat", lat: -6.7320, lng: 108.5523, timezone: "WIB", gmtOffset: 7 },

  // Jawa Tengah & DIY & Jawa Timur
  { id: "semarang", name: "Semarang", province: "Jawa Tengah", lat: -6.9667, lng: 110.4167, timezone: "WIB", gmtOffset: 7 },
  { id: "surakarta", name: "Surakarta (Solo)", province: "Jawa Tengah", lat: -7.5755, lng: 110.8243, timezone: "WIB", gmtOffset: 7 },
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", lat: -7.7956, lng: 110.3695, timezone: "WIB", gmtOffset: 7 },
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur", lat: -7.2575, lng: 112.7521, timezone: "WIB", gmtOffset: 7 },
  { id: "malang", name: "Malang", province: "Jawa Timur", lat: -7.9666, lng: 112.6326, timezone: "WIB", gmtOffset: 7 },
  { id: "banyuwangi", name: "Banyuwangi", province: "Jawa Timur", lat: -8.2192, lng: 114.3692, timezone: "WIB", gmtOffset: 7 },

  // Sumatera
  { id: "banda-aceh", name: "Banda Aceh", province: "Aceh", lat: 5.5483, lng: 95.3238, timezone: "WIB", gmtOffset: 7 },
  { id: "medan", name: "Medan", province: "Sumatera Utara", lat: 3.5952, lng: 98.6722, timezone: "WIB", gmtOffset: 7 },
  { id: "padang", name: "Padang", province: "Sumatera Barat", lat: -0.9471, lng: 100.4172, timezone: "WIB", gmtOffset: 7 },
  { id: "pekanbaru", name: "Pekanbaru", province: "Riau", lat: 0.5071, lng: 101.4478, timezone: "WIB", gmtOffset: 7 },
  { id: "batam", name: "Batam", province: "Kepulauan Riau", lat: 1.1301, lng: 104.0529, timezone: "WIB", gmtOffset: 7 },
  { id: "jambi", name: "Jambi", province: "Jambi", lat: -1.6101, lng: 103.6131, timezone: "WIB", gmtOffset: 7 },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan", lat: -2.9761, lng: 104.7754, timezone: "WIB", gmtOffset: 7 },
  { id: "bengkulu", name: "Bengkulu", province: "Bengkulu", lat: -3.8004, lng: 102.2655, timezone: "WIB", gmtOffset: 7 },
  { id: "bandar-lampung", name: "Bandar Lampung", province: "Lampung", lat: -5.4500, lng: 105.2667, timezone: "WIB", gmtOffset: 7 },

  // Bali & Nusa Tenggara
  { id: "denpasar", name: "Denpasar", province: "Bali", lat: -8.6705, lng: 115.2126, timezone: "WITA", gmtOffset: 8 },
  { id: "mataram", name: "Mataram", province: "Nusa Tenggara Barat", lat: -8.5833, lng: 116.1167, timezone: "WITA", gmtOffset: 8 },
  { id: "kupang", name: "Kupang", province: "Nusa Tenggara Timur", lat: -10.1772, lng: 123.6070, timezone: "WITA", gmtOffset: 8 },

  // Kalimantan
  { id: "pontianak", name: "Pontianak", province: "Kalimantan Barat", lat: -0.0263, lng: 109.3425, timezone: "WIB", gmtOffset: 7 },
  { id: "banjarmasin", name: "Banjarmasin", province: "Kalimantan Selatan", lat: -3.3167, lng: 114.5833, timezone: "WITA", gmtOffset: 8 },
  { id: "palangkaraya", name: "Palangkaraya", province: "Kalimantan Tengah", lat: -2.2161, lng: 113.9139, timezone: "WIB", gmtOffset: 7 },
  { id: "samarinda", name: "Samarinda", province: "Kalimantan Timur", lat: -0.5022, lng: 117.1536, timezone: "WITA", gmtOffset: 8 },
  { id: "balikpapan", name: "Balikpapan", province: "Kalimantan Timur", lat: -1.2379, lng: 116.8289, timezone: "WITA", gmtOffset: 8 },

  // Sulawesi
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan", lat: -5.1477, lng: 119.4327, timezone: "WITA", gmtOffset: 8 },
  { id: "manado", name: "Manado", province: "Sulawesi Utara", lat: 1.4748, lng: 124.8428, timezone: "WITA", gmtOffset: 8 },
  { id: "palu", name: "Palu", province: "Sulawesi Tengah", lat: -0.9003, lng: 119.8780, timezone: "WITA", gmtOffset: 8 },
  { id: "kendari", name: "Kendari", province: "Sulawesi Tenggara", lat: -3.9985, lng: 122.5126, timezone: "WITA", gmtOffset: 8 },
  { id: "gorontalo", name: "Gorontalo", province: "Gorontalo", lat: 0.5435, lng: 123.0568, timezone: "WITA", gmtOffset: 8 },

  // Maluku & Papua
  { id: "ambon", name: "Ambon", province: "Maluku", lat: -3.6547, lng: 128.1906, timezone: "WIT", gmtOffset: 9 },
  { id: "ternate", name: "Ternate", province: "Maluku Utara", lat: 0.7904, lng: 127.3809, timezone: "WIT", gmtOffset: 9 },
  { id: "jayapura", name: "Jayapura", province: "Papua", lat: -2.5916, lng: 140.6690, timezone: "WIT", gmtOffset: 9 },
  { id: "sorong", name: "Sorong", province: "Papua Barat Daya", lat: -0.8762, lng: 131.2558, timezone: "WIT", gmtOffset: 9 },
  { id: "merauke", name: "Merauke", province: "Papua Selatan", lat: -8.4991, lng: 140.4018, timezone: "WIT", gmtOffset: 9 },
];

export const DEFAULT_CITY = INDONESIAN_CITIES[0]; // Jakarta

export function findCityById(id: string): IndonesianCity {
  return INDONESIAN_CITIES.find((c) => c.id === id) || DEFAULT_CITY;
}

export function findClosestCity(lat: number, lng: number): IndonesianCity {
  let closest = DEFAULT_CITY;
  let minDistance = Infinity;

  for (const city of INDONESIAN_CITIES) {
    // Equirectangular approximation for fast distance
    const dLat = (city.lat - lat) * (Math.PI / 180);
    const dLng = (city.lng - lng) * (Math.PI / 180);
    const x = dLng * Math.cos(((city.lat + lat) / 2) * (Math.PI / 180));
    const distance = Math.sqrt(dLat * dLat + x * x);

    if (distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  }

  return closest;
}
