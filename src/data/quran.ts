export interface Surah {
  number: number;
  nameArabic: string;
  nameLatin: string;
  meaning: string;
  totalAyat: number;
  type: "Makkiyah" | "Madaniyah";
  ayat: Ayat[];
}

export interface Ayat {
  number: number;
  arabic: string;
  translation: string;
  surahNumber: number;
}

export const surahs: Surah[] = [
  {
    number: 1,
    nameArabic: "الفاتحة",
    nameLatin: "Al-Fatihah",
    meaning: "Pembukaan",
    totalAyat: 7,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.", surahNumber: 1 },
      { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "Segala puji bagi Allah, Tuhan seluruh alam.", surahNumber: 1 },
      { number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "Yang Maha Pengasih, Maha Penyayang.", surahNumber: 1 },
      { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", translation: "Pemilik hari pembalasan.", surahNumber: 1 },
      { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.", surahNumber: 1 },
      { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Tunjukilah kami jalan yang lurus.", surahNumber: 1 },
      { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "(Yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.", surahNumber: 1 },
    ],
  },
  {
    number: 2,
    nameArabic: "البقرة",
    nameLatin: "Al-Baqarah",
    meaning: "Sapi",
    totalAyat: 286,
    type: "Madaniyah",
    ayat: [
      { number: 1, arabic: "الٓمٓ", translation: "Alif Lam Mim.", surahNumber: 2 },
      { number: 2, arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", translation: "Kitab (Al-Qur'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.", surahNumber: 2 },
      { number: 3, arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", translation: "(Yaitu) mereka yang beriman kepada yang gaib, melaksanakan shalat, dan menginfakkan sebagian rezeki yang Kami berikan kepada mereka.", surahNumber: 2 },
      { number: 4, arabic: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", translation: "Dan mereka yang beriman kepada (Al-Qur'an) yang diturunkan kepadamu (Muhammad) dan (kitab-kitab) yang telah diturunkan sebelum engkau, dan mereka yakin akan adanya akhirat.", surahNumber: 2 },
      { number: 5, arabic: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", translation: "Merekalah yang mendapat petunjuk dari Tuhannya, dan mereka itulah orang-orang yang beruntung.", surahNumber: 2 },
    ],
  },
  {
    number: 3,
    nameArabic: "آل عمران",
    nameLatin: "Ali 'Imran",
    meaning: "Keluarga Imran",
    totalAyat: 200,
    type: "Madaniyah",
    ayat: [
      { number: 1, arabic: "الٓمٓ", translation: "Alif Lam Mim.", surahNumber: 3 },
      { number: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", translation: "Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus menerus mengurus (makhluk-Nya).", surahNumber: 3 },
    ],
  },
  {
    number: 4,
    nameArabic: "النساء",
    nameLatin: "An-Nisa",
    meaning: "Wanita",
    totalAyat: 176,
    type: "Madaniyah",
    ayat: [
      { number: 1, arabic: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ", translation: "Wahai manusia! Bertakwalah kepada Tuhanmu yang telah menciptakan kamu dari diri yang satu.", surahNumber: 4 },
    ],
  },
  {
    number: 5,
    nameArabic: "المائدة",
    nameLatin: "Al-Ma'idah",
    meaning: "Hidangan",
    totalAyat: 120,
    type: "Madaniyah",
    ayat: [],
  },
  {
    number: 6,
    nameArabic: "الأنعام",
    nameLatin: "Al-An'am",
    meaning: "Binatang Ternak",
    totalAyat: 165,
    type: "Makkiyah",
    ayat: [],
  },
  {
    number: 7,
    nameArabic: "الأعراف",
    nameLatin: "Al-A'raf",
    meaning: "Tempat Tertinggi",
    totalAyat: 206,
    type: "Makkiyah",
    ayat: [],
  },
  {
    number: 36,
    nameArabic: "يس",
    nameLatin: "Yasin",
    meaning: "Yasin",
    totalAyat: 83,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "يسٓ", translation: "Ya Sin.", surahNumber: 36 },
      { number: 2, arabic: "وَالْقُرْآنِ الْحَكِيمِ", translation: "Demi Al-Qur'an yang penuh hikmah.", surahNumber: 36 },
      { number: 3, arabic: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", translation: "Sungguh, engkau (Muhammad) adalah salah seorang dari rasul-rasul.", surahNumber: 36 },
    ],
  },
  {
    number: 55,
    nameArabic: "الرحمن",
    nameLatin: "Ar-Rahman",
    meaning: "Yang Maha Pengasih",
    totalAyat: 78,
    type: "Madaniyah",
    ayat: [
      { number: 1, arabic: "الرَّحْمَٰنُ", translation: "(Allah) Yang Maha Pengasih.", surahNumber: 55 },
      { number: 2, arabic: "عَلَّمَ الْقُرْآنَ", translation: "Yang telah mengajarkan Al-Qur'an.", surahNumber: 55 },
      { number: 3, arabic: "خَلَقَ الْإِنسَانَ", translation: "Dia menciptakan manusia.", surahNumber: 55 },
      { number: 4, arabic: "عَلَّمَهُ الْبَيَانَ", translation: "Mengajarnya pandai berbicara.", surahNumber: 55 },
    ],
  },
  {
    number: 67,
    nameArabic: "الملك",
    nameLatin: "Al-Mulk",
    meaning: "Kerajaan",
    totalAyat: 30,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translation: "Mahasuci Allah yang menguasai (segala) kerajaan, dan Dia Mahakuasa atas segala sesuatu.", surahNumber: 67 },
    ],
  },
  {
    number: 94,
    nameArabic: "الشرح",
    nameLatin: "Asy-Syarh",
    meaning: "Melapangkan",
    totalAyat: 8,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", translation: "Bukankah Kami telah membuka dadamu?", surahNumber: 94 },
      { number: 2, arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ", translation: "Dan Kami telah menanggalkan bebanmu darimu,", surahNumber: 94 },
      { number: 3, arabic: "الَّذِي أَنقَضَ ظَهْرَكَ", translation: "yang memberatkan punggungmu,", surahNumber: 94 },
      { number: 4, arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ", translation: "dan Kami telah meninggikan namamu.", surahNumber: 94 },
      { number: 5, arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Maka sesungguhnya bersama kesulitan itu ada kemudahan.", surahNumber: 94 },
      { number: 6, arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Sesungguhnya bersama kesulitan itu ada kemudahan.", surahNumber: 94 },
      { number: 7, arabic: "فَإِذَا فَرَغْتَ فَانصَبْ", translation: "Apabila engkau telah selesai (dari satu urusan), kerjakanlah dengan sungguh-sungguh (urusan) yang lain,", surahNumber: 94 },
      { number: 8, arabic: "وَإِلَىٰ رَبِّكَ فَارْغَب", translation: "dan hanya kepada Tuhanmu lah engkau berharap.", surahNumber: 94 },
    ],
  },
  {
    number: 112,
    nameArabic: "الإخلاص",
    nameLatin: "Al-Ikhlas",
    meaning: "Ikhlas",
    totalAyat: 4,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", translation: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'", surahNumber: 112 },
      { number: 2, arabic: "اللَّهُ الصَّمَدُ", translation: "Allah tempat meminta segala sesuatu.", surahNumber: 112 },
      { number: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "(Allah) tidak beranak dan tidak pula diperanakkan.", surahNumber: 112 },
      { number: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", translation: "Dan tidak ada sesuatu yang setara dengan Dia.", surahNumber: 112 },
    ],
  },
  {
    number: 113,
    nameArabic: "الفلق",
    nameLatin: "Al-Falaq",
    meaning: "Waktu Subuh",
    totalAyat: 5,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", translation: "Katakanlah, 'Aku berlindung kepada Tuhan yang menguasai subuh (fajar).'", surahNumber: 113 },
      { number: 2, arabic: "مِن شَرِّ مَا خَلَقَ", translation: "Dari kejahatan (makhluk yang) Dia ciptakan.", surahNumber: 113 },
      { number: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translation: "Dan dari kejahatan malam apabila telah gelap gulita.", surahNumber: 113 },
      { number: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", translation: "Dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya).", surahNumber: 113 },
      { number: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "Dan dari kejahatan orang yang dengki apabila dia dengki.", surahNumber: 113 },
    ],
  },
  {
    number: 114,
    nameArabic: "الناس",
    nameLatin: "An-Nas",
    meaning: "Manusia",
    totalAyat: 6,
    type: "Makkiyah",
    ayat: [
      { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", translation: "Katakanlah, 'Aku berlindung kepada Tuhannya manusia.'", surahNumber: 114 },
      { number: 2, arabic: "مَلِكِ النَّاسِ", translation: "Raja manusia.", surahNumber: 114 },
      { number: 3, arabic: "إِلَٰهِ النَّاسِ", translation: "Sembahan manusia.", surahNumber: 114 },
      { number: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", translation: "Dari kejahatan (bisikan) setan yang bersembunyi.", surahNumber: 114 },
      { number: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", translation: "Yang membisikkan (kejahatan) ke dalam dada manusia.", surahNumber: 114 },
      { number: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", translation: "Dari (golongan) jin dan manusia.", surahNumber: 114 },
    ],
  },
];

export function getSurahByNumber(number: number): Surah | undefined {
  return surahs.find((s) => s.number === number);
}

/** Ayat pilihan hari ini — ditampilkan di landing page & dashboard. */
export const dailyVerse = {
  surahNumber: 94,
  ayatNumber: 6,
  surahName: "Asy-Syarh",
  arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
  translation: "Sesungguhnya bersama kesulitan itu ada kemudahan.",
};
