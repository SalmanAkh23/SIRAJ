export interface Doa {
  id: string;
  title: string;
  category: string;
  arabic: string;
  translation: string;
  source: string;
}

export const doaCategories = [
  { id: "pagi", name: "Pagi", icon: "Sunrise" },
  { id: "petang", name: "Petang", icon: "Sunset" },
  { id: "tidur", name: "Sebelum Tidur", icon: "Moon" },
  { id: "shalat", name: "Setelah Shalat", icon: "HandHelping" },
  { id: "perjalanan", name: "Perjalanan", icon: "MapPin" },
  { id: "makan", name: "Makan & Minum", icon: "Coffee" },
  { id: "belajar", name: "Belajar", icon: "BookOpen" },
  { id: "perlindungan", name: "Perlindungan", icon: "Shield" },
];

export const doaList: Doa[] = [
  {
    id: "doa-bangun-tidur",
    title: "Doa Bangun Tidur",
    category: "pagi",
    arabic: "الحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translation: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami akan dikembalikan.",
    source: "HR. Bukhari no. 6312",
  },
  {
    id: "doa-keluar-rumah",
    title: "Doa Keluar Rumah",
    category: "pagi",
    arabic: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
    translation: "Dengan nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan Allah.",
    source: "HR. Abu Dawud no. 5095, At-Tirmidzi no. 3426",
  },
  {
    id: "dzikir-pagi-1",
    title: "Dzikir Pagi — Sayyidul Istighfar",
    category: "pagi",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    translation: "Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah selain Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku berada di atas janji dan perjanjian-Mu semampuku. Aku berlindung kepada-Mu dari kejahatan yang aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Maka ampunilah aku, karena sesungguhnya tidak ada yang mengampuni dosa selain Engkau.",
    source: "HR. Bukhari no. 6306",
  },
  {
    id: "doa-petang-1",
    title: "Doa Petang",
    category: "petang",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    translation: "Kami telah memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah. Tidak ada tuhan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya.",
    source: "HR. Muslim no. 2723",
  },
  {
    id: "doa-sebelum-tidur",
    title: "Doa Sebelum Tidur",
    category: "tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
    source: "HR. Bukhari no. 6314",
  },
  {
    id: "doa-setelah-shalat",
    title: "Doa Setelah Shalat",
    category: "shalat",
    arabic: "أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    translation: "Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau-lah As-Salam (sumber keselamatan), dari-Mu keselamatan, Mahasuci Engkau wahai Pemilik keagungan dan kemuliaan.",
    source: "HR. Muslim no. 591",
  },
  {
    id: "doa-naik-kendaraan",
    title: "Doa Naik Kendaraan",
    category: "perjalanan",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    translation: "Mahasuci (Allah) yang telah menundukkan semua ini bagi kami, padahal kami sebelumnya tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.",
    source: "QS. Az-Zukhruf: 13-14",
  },
  {
    id: "doa-sebelum-makan",
    title: "Doa Sebelum Makan",
    category: "makan",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ بِسْمِ اللهِ",
    translation: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami, dan lindungilah kami dari siksa neraka. Dengan nama Allah.",
    source: "HR. Ibnu As-Sunni",
  },
  {
    id: "doa-sebelum-belajar",
    title: "Doa Sebelum Belajar",
    category: "belajar",
    arabic: "رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا",
    translation: "Ya Tuhanku, tambahkanlah kepadaku ilmu dan berikanlah aku pemahaman.",
    source: "QS. Thaha: 114 (dengan tambahan doa)",
  },
  {
    id: "doa-perlindungan",
    title: "Doa Perlindungan dari Kejahatan",
    category: "perlindungan",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.",
    source: "HR. Muslim no. 2708",
  },
];

export function getDoaByCategory(category: string): Doa[] {
  return doaList.filter((d) => d.category === category);
}

export function getDoaById(id: string): Doa | undefined {
  return doaList.find((d) => d.id === id);
}
