/**
 * Modul Data Resmi: 42 Hadits Arba'in An-Nawawi
 *
 * Disusun oleh Al-Imam Abu Zakariya Yahya bin Syaraf An-Nawawi (631–676 H).
 * Teks Arab lengkap bertasykil, terjemahan bahasa Indonesia, sanad/perawi sahabat,
 * rujukan kitab hadits induk (Kutubut Tis'ah / Kutubus Sittah), nomor hadits sumber asli,
 * derajat keshahihan berdasar kesepakatan ulama muhadditsin, dan faedah/hikmah inti.
 */

export type HaditsCategory =
  | "Iman"
  | "Ibadah"
  | "Akhlak"
  | "Ilmu"
  | "Muamalah";

export interface OriginalSourceRef {
  book: string;
  number?: number | string;
  note?: string;
}

export interface ArbainHadits {
  id: string; // Mis. "hadits-1"
  number: number; // 1 - 42
  title: string; // Judul / tema ringkas hadits
  theme: string; // Tema ringkas penjelasan
  arab: string; // Teks Arab lengkap berharakat (matan)
  translation: string; // Terjemahan bahasa Indonesia lengkap
  snippet: string; // Cuplikan teks untuk kartu hadits
  narrator: string; // Sahabat perawi utama
  source: string; // Rujukan ringkas baku, mis. "HR. Bukhari no. 1 dan Muslim no. 1907"
  originalSources: OriginalSourceRef[];
  grade: string; // Derajat hadits (mis. "Shahih Muttafaq 'Alaih", "Shahih Muslim")
  category: HaditsCategory;
  lessons: string[]; // Pelajaran dan faedah pokok hadits
  explanation?: string; // Penjelasan ringkas / syarah
  // Properti kompatibilitas dengan antarmuka Hadits SIRAJ
  text: string;
  matanSnippet?: string;
  bookSlug: string;
  bookName: string;
  note?: string;
}

export const arbainCategories: HaditsCategory[] = [
  "Iman",
  "Ibadah",
  "Akhlak",
  "Ilmu",
  "Muamalah",
];

export const ARBAIN_METADATA = {
  title: "Arba'in An-Nawawiyyah",
  author: "Imam Abu Zakariya Yahya bin Syaraf An-Nawawi (631–676 H)",
  total: 42,
  description:
    "Kumpulan 42 hadits pokok karya Imam An-Nawawi yang mencakup fondasi dasar ajaran Islam dalam akidah, ibadah, akhlak, hukum muamalah, dan penyucian jiwa (tazkiyatun nufus).",
  primarySources: "Kutubut Tis'ah (Shahih Al-Bukhari, Shahih Muslim, Sunan Abu Dawud, Jami' At-Tirmidzi, Sunan An-Nasa'i, Sunan Ibnu Majah, Musnad Ahmad, dll)",
};

const arbainHaditsSource: ArbainHadits[] = [
  {
    id: "hadits-1",
    number: 1,
    title: "Niat dan Keikhlasan",
    theme: "Amalan Bergantung pada Niat dan Keikhlasan Hati",
    arab: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ»",
    translation:
      "Dari Amirul Mukminin Abu Hafsh Umar bin Al-Khaththab radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya setiap amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan. Maka barangsiapa yang hijrahnya kepada Allah dan Rasul-Nya, maka hijrahnya kepada Allah dan Rasul-Nya. Dan barangsiapa yang hijrahnya karena dunia yang ingin diraihnya atau karena wanita yang ingin dinikahinya, maka hijrahnya kepada apa yang ia tuju.\"",
    snippet:
      "Sesungguhnya setiap amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan.",
    narrator: "Umar bin Al-Khaththab radhiyallahu 'anhu",
    source: "HR. Bukhari no. 1 dan Muslim no. 1907",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 1 },
      { book: "Shahih Muslim", number: 1907 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Iman",
    lessons: [
      "Niat merupakan syarat penentu diterima atau ditolaknya setiap amalan batin dan lahiriah.",
      "Pembeda utama antara kebiasaan sehari-hari dengan ibadah yang berpahala adalah niat ikhlas karena Allah.",
      "Ikhlas memurnikan tujuan hanya untuk Allah Ta'ala menjauhkan manusia dari riya dan kesia-siaan amal.",
    ],
    explanation:
      "Hadits agung ini merupakan poros utama agama Islam, sampai para ulama seperti Imam Asy-Syafi'i menyebutnya sebagai sepertiga dari seluruh ilmu Islam.",
    text: "Sesungguhnya setiap amalan tergantung pada niatnya, dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan. Barangsiapa yang hijrahnya kepada Allah dan Rasul-Nya, maka hijrahnya kepada Allah dan Rasul-Nya. Dan barangsiapa yang hijrahnya karena dunia yang ingin diraihnya atau karena wanita yang ingin dinikahinya, maka hijrahnya kepada apa yang ia tuju.",
    matanSnippet:
      "Sesungguhnya setiap amalan tergantung pada niatnya, dan setiap orang akan mendapatkan apa yang ia niatkan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
    note: "Diriwayatkan oleh dua imam hadits terbesar: Al-Bukhari dan Muslim.",
  },
  {
    id: "hadits-2",
    number: 2,
    title: "Islam, Iman, dan Ihsan (Hadits Jibril)",
    theme: "Tingkatan Rukun Islam, Rukun Iman, Hakikat Ihsan, dan Tanda-Tanda Kiamat",
    arab: "عَنْ عُمَرَ رَضِيَ اللهُ عَنْهُ أَيْضاً قَالَ: بَيْنَمَا نَحْنُ جُلُوسٌ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعْرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، فَأَسْنَدَ رُكْبَتَيْهِ إِلَى رُكْبَتَيْهِ، وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ، وَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ. فَقَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ البَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً». قَالَ: صَدَقْتَ. فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ! قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ. قَالَ: «أَنْ تُؤْمِنَ بِاللَّهِ، وَمَلاَئِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَاليَوْمِ الآخِرِ، وَتُؤْمِنَ بِالقَدَرِ خَيْرِهِ وَشَرِّهِ». قَالَ: صَدَقْتَ. قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ. قَالَ: «أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ». قَالَ: فَأَخْبِرْنِي عَنِ السَّاعَةِ. قَالَ: «مَا المَسْؤُولُ عَنْهَا بِأَعْلَمَ مِنَ السَّائِلِ». قَالَ: فَأَخْبِرْنِي عَنْ أَمَارَاتِهَا. قَالَ: «أَنْ تَلِدَ الأَمَةُ رَبَّتَهَا، وَأَنْ تَرَى الحُفَاةَ العُرَاةَ العَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي البُنْيَانِ». ثُمَّ انْطَلَقَ فَلَبِثْتُ مَلِيّاً، ثُمَّ قَالَ: «يَا عُمَرُ، أَتَدْرِي مَنِ السَّائِلُ؟» قُلْتُ: اللَّهُ وَرَسُولُهُ أَعْلَمُ. قَالَ: «فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ»",
    translation:
      "Dari Umar radhiyallahu 'anhu juga, ia berkata: Pada suatu hari ketika kami sedang duduk bersama Rasulullah shallallahu 'alaihi wa sallam, tiba-tiba muncul seorang laki-laki yang berpakaian sangat putih dan berambut sangat hitam, tidak tampak padanya bekas perjalanan jauh dan tak seorang pun dari kami yang mengenalnya. Ia duduk di hadapan Nabi, menyandarkan kedua lututnya ke kedua lutut Nabi, dan meletakkan kedua telapak tangannya di atas kedua paha Nabi, seraya berkata: \"Wahai Muhammad, kabarkanlah kepadaku tentang Islam?\" Beliau menjawab: \"Islam adalah engkau bersaksi bahwa tidak ada tuhan yang berhak disembah selain Allah dan Muhammad utusan Allah, mendirikan shalat, menunaikan zakat, berpuasa Ramadhan, dan haji ke Baitullah jika engkau mampu ke sana.\" Orang itu berkata: \"Engkau benar.\" Kami heran kepadanya, dia yang bertanya lalu dia pula yang membenarkannya. Ia bertanya lagi: \"Kabarkan kepadaku tentang Iman?\" Beliau menjawab: \"Engkau beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan beriman kepada takdir baik dan buruk.\" Orang itu berkata: \"Engkau benar.\" Ia bertanya lagi: \"Kabarkan kepadaku tentang Ihsan?\" Beliau bersabda: \"Engkau beribadah kepada Allah seakan-akan engkau melihat-Nya; jika engkau tidak dapat melihat-Nya, maka sesungguhnya Dia melihatmu.\" Ia bertanya lagi tentang hari kiamat, beliau bersabda: \"Tidaklah orang yang ditanya lebih tahu daripada orang yang bertanya.\" Ia bertanya tanda-tandanya, beliau bersabda: \"Jika seorang budak wanita melahirkan tuannya, dan engkau melihat orang-orang yang bertelanjang kaki, miskin, dan penggembala domba saling berlomba-lomba meninggikan bangunan.\" Kemudian orang itu pergi dan aku terdiam sesaat. Beliau bertanya: \"Wahai Umar, tahukah engkau siapa yang bertanya tadi?\" Aku menjawab: \"Allah dan Rasul-Nya lebih tahu.\" Beliau bersabda: \"Sesungguhnya dia adalah Jibril yang datang kepada kalian untuk mengajarkan agama kalian.\"",
    snippet:
      "Islam adalah syahadat, shalat, zakat, puasa, dan haji. Iman adalah beriman kepada Allah, malaikat, kitab, rasul, hari akhir, dan takdir. Ihsan adalah beribadah seakan melihat-Nya.",
    narrator: "Umar bin Al-Khaththab radhiyallahu 'anhu",
    source: "HR. Muslim no. 8",
    originalSources: [{ book: "Shahih Muslim", number: 8 }],
    grade: "Shahih Muslim",
    category: "Iman",
    lessons: [
      "Agama Islam terbagi menjadi tiga tingkatan bertingkat: Islam (amalan raga zahir), Iman (keyakinan batin), dan Ihsan (kesadaran muraqabah tertinggi).",
      "Wajib beriman kepada enam rukun iman tanpa membedakan atau mengingkari salah satunya.",
      "Adab menuntut ilmu: berpenampilan rapi, duduk dengan sopan di depan guru, dan bertanya hal bermanfaat.",
    ],
    text: "Islam dibangun di atas syahadatain, shalat, zakat, puasa, dan haji. Iman mencakup percaya kepada Allah, para malaikat, kitab-kitab, para rasul, hari akhir, dan takdir. Ihsan adalah beribadah kepada Allah seakan melihat-Nya.",
    matanSnippet:
      "Islam, Iman, dan Ihsan adalah fondasi utama ajaran agama yang diajarkan Malaikat Jibril 'alaihissalam.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
    note: "Dikenal sebagai 'Ummus Sunnah' (Induk Hadits-Hadits Sunnah Nabi).",
  },
  {
    id: "hadits-3",
    number: 3,
    title: "Rukun Islam",
    theme: "Lima Pilar Pokok Bangunan Agama Islam",
    arab: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ البَيْتِ، وَصَوْمِ رَمَضَانَ»",
    translation:
      "Dari Abu Abdirrahman Abdullah bin Umar bin Al-Khaththab radhiyallahu 'anhuma, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Islam dibangun di atas lima perkara: persaksian bahwa tiada tuhan yang berhak disembah selain Allah dan bahwa Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, menunaikan haji ke Baitullah, dan berpuasa di bulan Ramadhan.\"",
    snippet:
      "Islam dibangun di atas lima perkara: syahadat bahwa tidak ada tuhan selain Allah dan Muhammad utusan Allah, shalat, zakat, haji, dan puasa Ramadhan.",
    narrator: "Abdullah bin Umar radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 8 dan Muslim no. 16",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 8 },
      { book: "Shahih Muslim", number: 16 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Ibadah",
    lessons: [
      "Islam diibaratkan seperti sebuah bangunan kubah kokoh yang disangga oleh lima pilar utama.",
      "Shalat dan zakat senantiasa beriringan sebagai tiang ibadah badaniah dan maliyah sosial.",
      "Mengerjakan rukun-rukun ini dengan ikhlas merupakan kewajiban mutlak setiap muslim mukallaf.",
    ],
    text: "Islam dibangun di atas lima perkara: persaksian bahwa tidak ada tuhan yang berhak disembah selain Allah dan bahwa Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, menunaikan haji ke Baitullah, dan berpuasa di bulan Ramadhan.",
    matanSnippet:
      "Islam dibangun di atas lima perkara: syahadat, mendirikan shalat, menunaikan zakat, haji, dan puasa Ramadhan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-4",
    number: 4,
    title: "Penciptaan Manusia dan Ketetapan Takdir",
    theme: "Tahapan Perkembangan Janin dalam Rahim dan Catatan Takdir Manusia",
    arab: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللهُ عَنْهُ قَالَ: حَدَّثَنَا رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَهُوَ الصَّادِقُ المَصْدُوقُ: «إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْماً، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ المَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ، وَأَجَلِهِ، وَعَمَلِهِ، وَشَقِيٌّ أَوْ سَعِيدٌ. فَوَاللَّهِ الَّذِي لاَ إِلَهَ غَيْرُهُ، إِنَّ أَحَدَكُمْ لَيَعْمَلُ بِعَمَلِ أَهْلِ الجَنَّةِ حَتَّى مَا يَكُونَ بَيْنَهُ وَبَيْنَهَا إِلاَّ ذِرَاعٌ فَيَسْبِقُ عَلَيْهِ الكِتَابُ فَيَعْمَلُ بِعَمَلِ أَهْلِ النَّارِ فَيَدْخُلُهَا، وَإِنَّ أَحَدَكُمْ لَيَعْمَلُ بِعَمَلِ أَهْلِ النَّارِ حَتَّى مَا يَكُونَ بَيْنَهُ وَبَيْنَهَا إِلاَّ ذِرَاعٌ فَيَسْبِقُ عَلَيْهِ الكِتَابُ فَيَعْمَلُ بِعَمَلِ أَهْلِ الجَنَّةِ فَيَدْخُلُهَا»",
    translation:
      "Dari Abu Abdirrahman Abdullah bin Mas'ud radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam yang jujur lagi dipercaya bersabda: \"Sesungguhnya salah seorang di antara kalian dihimpun penciptaannya dalam rahim ibunya selama empat puluh hari (berupa nuthfah), kemudian menjadi segumpal darah ('alaqah) selama masa itu pula, kemudian menjadi segumpal daging (mudghah) selama masa itu pula. Kemudian Allah mengutus malaikat meniupkan ruh dan diperintahkan mencatat empat ketetapan: rezekinya, ajalnya, amalnya, serta celaka atau bahagianya. Demi Allah yang tiada tuhan selain-Nya, sungguh seseorang beramal dengan amalan penghuni surga hingga tiada jarak antara dirinya dan surga kecuali sehasta, lalu catatan takdir mendahuluinya dan ia beramal dengan amalan penghuni neraka lalu memasukinya. Dan sungguh seseorang beramal dengan amalan penghuni neraka hingga jaraknya tinggal sehasta, lalu catatan takdir mendahuluinya dan ia beramal dengan amalan penghuni surga lalu memasukinya.\"",
    snippet:
      "Tahapan penciptaan janin 40 hari nuthfah, 'alaqah, mudghah lalu ditiupkan ruh dan ditetapkan rezeki, ajal, amal, dan akhir kehidupannya.",
    narrator: "Abdullah bin Mas'ud radhiyallahu 'anhu",
    source: "HR. Bukhari no. 3208 dan Muslim no. 2643",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 3208 },
      { book: "Shahih Muslim", number: 2643 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Iman",
    lessons: [
      "Penjelasan ilmiah kenabian tentang tahapan embrionik janin manusia di dalam rahim.",
      "Ketetapan qadar Allah mendahului segala amalan hamba dan tidak ada yang luput dari ilmu-Nya.",
      "Kewajiban senantiasa berdoa memohon keteguhan iman dan husnul khatimah hingga akhir hayat.",
    ],
    text: "Sesungguhnya setiap kalian dihimpun penciptaannya dalam rahim ibunya... kemudian ditiupkan ruh dan dicatat empat perkara: rezekinya, ajalnya, amalnya, dan sengsara atau bahagianya.",
    matanSnippet:
      "Penciptaan janin dan ketetapan empat takdir: rezeki, ajal, amal perbuatan, serta celaka atau bahagia.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-5",
    number: 5,
    title: "Larangan Mengada-ada dalam Agama (Bid'ah)",
    theme: "Ketertolakan Perkara Baru yang Dibuat-buat Tanpa Dalil Syar'i",
    arab: "عَنْ أُمِّ المُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ فِيهِ فَهُوَ رَدٌّ». وَفِي رِوَايَةٍ لِمُسْلِمٍ: «مَنْ عَمِلَ عَمَلاً لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ»",
    translation:
      "Dari Ummul Mukminin Ummu Abdillah Aisyah radhiyallahu 'anha, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Barangsiapa mengada-adakan hal baru dalam urusan (agama) kami ini yang bukan bagian darinya, maka amalan itu tertolak.\" Dan dalam riwayat Muslim: \"Barangsiapa melakukan suatu amalan yang tidak ada perintah kami atasnya, maka amalan itu tertolak.\"",
    snippet:
      "Barangsiapa mengada-adakan hal baru dalam urusan agama kami ini yang bukan bagian darinya, maka amalan tersebut tertolak.",
    narrator: "Ummul Mukminin Aisyah radhiyallahu 'anha",
    source: "HR. Bukhari no. 2697 dan Muslim no. 1718",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 2697 },
      { book: "Shahih Muslim", number: 1718 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Ibadah",
    lessons: [
      "Amalan ibadah hanya sah apabila memenuhi dua syarat: ikhlas karena Allah dan mutaba'ah (mengikuti tuntunan Nabi).",
      "Agama Islam telah sempurna, tidak memerlukan penambahan ibadah buatan manusia.",
      "Setiap inovasi amalan agama yang bertentangan dengan Al-Qur'an dan Sunnah tertolak di sisi Allah.",
    ],
    text: "Barangsiapa mengada-adakan perkara baru dalam urusan agama kami ini yang bukan bagian darinya, maka amalan itu tertolak.",
    matanSnippet:
      "Barangsiapa mengada-adakan perkara baru dalam agama yang bukan darinya, maka ia tertolak.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-6",
    number: 6,
    title: "Halal, Haram, dan Menjaga Hati",
    theme: "Perkara yang Jelas, Menghindari Syubhat, dan Segumpal Daging Penentu Perilaku",
    arab: "عَنْ أَبِي عَبْدِ اللَّهِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّ الحَلاَلَ بَيِّنٌ وَإِنَّ الحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ لاَ يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ، وَمَنْ وَقَعَ فِي الشُّبُهَاتِ وَقَعَ فِي الحَرَامِ، كَالرَّاعِي يَرْعَى حَوْلَ الحِمَى يُوشِكُ أَنْ يَرْتَعَ فِيهِ، أَلاَ وَإِنَّ لِكُلِّ مَلِكٍ حِمًى، أَلاَ وَإِنَّ حِمَى اللَّهِ مَحَارِمُهُ، أَلاَ وَإِنَّ فِي الجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الجَسَدُ كُلُّهُ، أَلاَ وَهِيَ القَلْبُ»",
    translation:
      "Dari Abu Abdillah An-Nu'man bin Basyir radhiyallahu 'anhuma, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya yang halal itu jelas dan yang haram itu jelas. Di antara keduanya terdapat perkara-perkara syubhat (samar) yang tidak diketahui oleh kebanyakan manusia. Maka barangsiapa menjauhi perkara-perkara syubhat, ia telah menjaga agama dan kehormatannya. Dan barangsiapa terjerumus ke dalam syubhat, ia telah jatuh ke dalam yang haram, laksana penggembala yang menggembalakan ternaknya di sekitar tanah larangan, hampir-hampir ternaknya masuk ke dalamnya. Ketahuilah, setiap raja memiliki tanah larangan, dan ketahuilah tanah larangan Allah adalah apa yang Dia haramkan. Ketahuilah, sesungguhnya di dalam tubuh ada segumpal daging; jika ia baik maka baiklah seluruh tubuh, dan jika ia rusak maka rusaklah seluruh tubuh. Ketahuilah, segumpal daging itu adalah hati.\"",
    snippet:
      "Yang halal jelas dan yang haram jelas. Di antara keduanya ada perkara syubhat. Di dalam tubuh ada segumpal daging; jika baik maka baiklah seluruhnya, yaitu hati.",
    narrator: "An-Nu'man bin Basyir radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 52 dan Muslim no. 1599",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 52 },
      { book: "Shahih Muslim", number: 1599 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Muamalah",
    lessons: [
      "Hukum terbagi menjadi tiga: halal jelas, haram jelas, dan syubhat yang membutuhkan kehati-hatian (wara').",
      "Menghindari hal syubhat adalah perisai pelindung kehormatan pribadi di hadapan manusia dan kesucian agama di hadapan Allah.",
      "Kondisi fisik dan perilaku lahiriah merupakan cerminan langsung dari kebaikan atau kerusakan hati nurani.",
    ],
    text: "Sesungguhnya yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya terdapat perkara-perkara syubhat... dan ketahuilah bahwa di dalam tubuh ada segumpal daging: jika baik maka baik seluruh tubuh, yaitu hati.",
    matanSnippet:
      "Yang halal jelas dan yang haram jelas. Hati adalah segumpal daging penentu kebaikan seluruh tubuh.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-7",
    number: 7,
    title: "Agama Adalah Nasihat",
    theme: "Ketulusan Loyalitas kepada Allah, Kitab-Nya, Rasul-Nya, Pemimpin, dan Kaum Muslimin",
    arab: "عَنْ أَبِي رُقَيَّةَ تَمِيمِ بْنِ أَوْسٍ الدَّارِيِّ رَضِيَ اللهُ عَنْهُ أَنَّ النَّبِيَّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «الدِّينُ النَّصِيحَةُ». قُلْنَا: لِمَنْ؟ قَالَ: «لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلأَئِمَّةِ المُسْلِمِينَ، وَعَامَّتِهِمْ»",
    translation:
      "Dari Abu Ruqayyah Tamim bin Aus Ad-Dari radhiyallahu 'anhu, bahwasanya Nabi shallallahu 'alaihi wa sallam bersabda: \"Agama itu adalah nasihat.\" Kami bertanya: \"Untuk siapa wahai Rasulullah?\" Beliau menjawab: \"Untuk Allah, untuk Kitab-Nya, untuk Rasul-Nya, untuk para pemimpin kaum muslimin, dan untuk seluruh kaum muslimin pada umumnya.\"",
    snippet:
      "Agama itu adalah nasihat: untuk Allah, untuk Kitab-Nya, untuk Rasul-Nya, untuk para pemimpin kaum muslimin, dan untuk segenap kaum muslimin.",
    narrator: "Tamim bin Aus Ad-Dari radhiyallahu 'anhu",
    source: "HR. Muslim no. 55",
    originalSources: [{ book: "Shahih Muslim", number: 55 }],
    grade: "Shahih Muslim",
    category: "Akhlak",
    lessons: [
      "Hakikat nasihat adalah ketulusan niat (al-ikhlas) dan kebersihan hati dalam menginginkan kebaikan.",
      "Nasihat kepada Allah dan Kitab-Nya bermakna beriman, mentauhidkan-Nya, mengamalkan syariat, dan menjauhi maksiat.",
      "Nasihat kepada pemimpin dan sesama muslim dilakukan dengan santun, saling tolong-menolong, dan amar ma'ruf nahi munkar.",
    ],
    text: "Agama itu adalah nasihat. Kami bertanya: Untuk siapa? Beliau bersabda: Untuk Allah, Kitab-Nya, Rasul-Nya, para pemimpin kaum muslimin, dan seluruh kaum muslimin.",
    matanSnippet: "Agama ini berpijak pada ketulusan nasihat untuk kebaikan seluruh umat.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-8",
    number: 8,
    title: "Kehormatan Jiwa dan Harta Muslim",
    theme: "Perlindungan Darah dan Harta Orang yang Menegakkan Pokok-Pokok Syariat",
    arab: "عَنِ ابْنِ عُمَرَ رَضِيَ اللهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَيُقِيمُوا الصَّلاَةَ، وَيُؤْتُوا الزَّكَاةَ، فَإِذَا فَعَلُوا ذَلِكَ عَصَمُوا مِنِّي دِمَاءَهُمْ وَأَمْوَالَهُمْ إِلاَّ بِحَقِّ الإِسْلاَمِ، وَحِسَابُهُمْ عَلَى اللَّهِ تَعَالَى»",
    translation:
      "Dari Ibnu Umar radhiyallahu 'anhuma, bahwasanya Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tiada tuhan yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, serta mendirikan shalat dan menunaikan zakat. Jika mereka telah melakukan hal itu, maka terpeliharalah darah dan harta mereka dariku kecuali dengan hak Islam, dan perhitungan mereka diserahkan kepada Allah Ta'ala.\"",
    snippet:
      "Aku diperintahkan memerangi manusia hingga mereka bersyahadat, shalat, dan zakat. Bila telah melaksanakannya, terjagalah darah dan harta mereka.",
    narrator: "Abdullah bin Umar radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 25 dan Muslim no. 22",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 25 },
      { book: "Shahih Muslim", number: 22 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Iman",
    lessons: [
      "Keislaman lahiriah seseorang menjadi pelindung mutlak bagi darah, jiwa, dan hartanya.",
      "Hukum dunia ditegakkan berdasar tanda-tanda lahiriah yang nyata, sementara keikhlasan batin diserahkan kepada Allah.",
      "Kewajiban menjaga kehormatan sesama muslim dan haramnya menumpahkan darah tanpa alasan hak syar'i.",
    ],
    text: "Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tiada tuhan selain Allah dan Muhammad utusan Allah, mendirikan shalat, dan menunaikan zakat...",
    matanSnippet: "Perlindungan darah dan harta muslim yang menegakkan shalat dan zakat.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-9",
    number: 9,
    title: "Menjalankan Perintah Sesuai Kesanggupan",
    theme: "Larangan Menyelisihi Syariat dan Kemudahan Melaksanakan Titah Agama",
    arab: "عَنْ أَبِي هُرَيْرَةَ عَبْدِ الرَّحْمَنِ بْنِ صَخْرٍ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ، فَإِنَّمَا أَهْلَكَ الَّذِينَ مِنْ قَبْلِكُمْ كَثْرَةُ مَسَائِلِهِمْ وَاخْتِلاَفُهُمْ عَلَى أَنْبِيَائِهِمْ»",
    translation:
      "Dari Abu Hurairah Abdurrahman bin Shakhr radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Apa yang aku larang atas kalian maka jauhilah seluruhnya, dan apa yang aku perintahkan kepada kalian maka kerjakanlah semampu kalian. Sesungguhnya yang membinasakan umat-umat sebelum kalian adalah banyaknya pertanyaan mereka yang tidak bermanfaat dan perselisihan mereka terhadap para nabi mereka.\"",
    snippet:
      "Apa yang aku larang maka jauhilah, dan apa yang aku perintahkan kerjakanlah semampu kalian. Yang membinasakan umat terdahulu adalah banyak tanya dan membangkang nabi mereka.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 7288 dan Muslim no. 1337",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 7288 },
      { book: "Shahih Muslim", number: 1337 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Ibadah",
    lessons: [
      "Prinsip kaidah fiqih: larangan harus ditinggalkan secara total tanpa pengecualian, sedangkan perintah dijalankan semaksimal kemampuan.",
      "Kemudahan syariat Islam yang tidak membebani hamba melampaui batas kemampuannya.",
      "Tercelanya berbantah-bantahan, mengajukan pertanyaan rumit yang berlebihan, dan membangkang kepada sunnah rasul.",
    ],
    text: "Apa yang aku larang atas kalian maka jauhilah, dan apa yang aku perintahkan kerjakanlah semampu kalian.",
    matanSnippet: "Larangan dijauhi seutuhnya, perintah dijalankan sebatas kesanggupan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-10",
    number: 10,
    title: "Makanan Halal dan Terkabulnya Doa",
    theme: "Allah Maha Baik dan Pengaruh Rezeki Halal terhadap Pengabulan Doa",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «إِنَّ اللَّهَ تَعَالَى طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّباً، وَإِنَّ اللَّهَ أَمَرَ المُؤْمِنِينَ بِمَا أَمَرَ بِهِ المُرْسَلِينَ فَقَالَ تَعَالَى: {يَا أَيُّهَا الرُّسُلُ كُلُوا مِنَ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحاً}، وَقَالَ تَعَالَى: {يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ}، ثُمَّ ذَكَرَ الرَّجُلَ يُطِيلُ السَّفَرَ أَشْعَثَ أَغْبَرَ، يَمُدُّ يَدَيْهِ إِلَى السَّمَاءِ: يَا رَبِّ يَا رَبِّ، وَمَطْعَمُهُ حَرَامٌ، وَمَشْرَبُهُ حَرَامٌ، وَمَلْبَسُهُ حَرَامٌ، وَغُذِيَ بِالحَرَامِ، فَأَنَّى يُسْتَجَابُ لِذَلِكَ؟!»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya Allah Ta'ala itu Maha Baik dan tidak menerima kecuali yang baik. Dan sesungguhnya Allah memerintahkan kaum mukminin dengan apa yang Dia perintahkan kepada para rasul. Allah Ta'ala berfirman: 'Wahai para rasul, makanlah dari makanan yang baik-baik dan kerjakanlah kebajikan.' Dan Dia berfirman: 'Wahai orang-orang yang beriman, makanlah dari rezeki yang baik yang Kami berikan kepadamu.' Kemudian beliau menceritakan seorang laki-laki yang melakukan perjalanan jauh hingga rambutnya kusut masai dan berdebu, ia menengadahkan kedua tangannya ke langit seraya berdoa: 'Ya Rabb, Ya Rabb!', padahal makanannya dari yang haram, minumannya haram, pakaiannya haram, dan ia diberi asupan dari yang haram, maka bagaimanakah doanya akan dikabulkan?!\"",
    snippet:
      "Sesungguhnya Allah Maha Baik dan tidak menerima kecuali yang baik. Bagaimana mungkin doa dikabulkan bila makanan, minuman, dan pakaian berasal dari yang haram?",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Muslim no. 1015",
    originalSources: [{ book: "Shahih Muslim", number: 1015 }],
    grade: "Shahih Muslim",
    category: "Muamalah",
    lessons: [
      "Mengonsumsi rezeki yang halal dan thayyib adalah syarat mutlak diterimanya sedekah dan dikabulkannya doa.",
      "Perilaku maksiat dalam mencari nafkah dapat menghalangi keberkahan safar dan pengabulan hajat spiritual.",
      "Adab berdoa: mengangkat tangan, bersungguh-sungguh dalam safar, dan menyucikan diri dari penghasilan haram.",
    ],
    text: "Sesungguhnya Allah Maha Baik dan tidak menerima kecuali yang baik... bagaimana mungkin doanya dikabulkan bila makan, minum, dan pakaiannya dari yang haram?!",
    matanSnippet: "Rezeki halal adalah kunci utama diterimanya amal dan terkabulnya doa.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-11",
    number: 11,
    title: "Meninggalkan yang Meragukan Menuju Kepastian",
    theme: "Sikap Wara' Memilih Keyakinan dan Menepis Keragu-raguan",
    arab: "عَنْ أَبِي مُحَمَّدٍ الحَسَنِ بْنِ عَلِيِّ بْنِ أَبِي طَالِبٍ سِبْطِ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَرَيْحَانَتِهِ رَضِيَ اللهُ عَنْهُمَا قَالَ: حَفِظْتُ مِنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «دَعْ مَا يَرِيبُكَ إِلَى مَا لاَ يَرِيبُكَ»",
    translation:
      "Dari Abu Muhammad Al-Hasan bin Ali bin Abi Thalib, cucu sekaligus kesayangan Rasulullah shallallahu 'alaihi wa sallam radhiyallahu 'anhuma, ia berkata: Aku menghafal dari Rasulullah shallallahu 'alaihi wa sallam: \"Tinggalkanlah apa yang meragukanmu menuju apa yang tidak meragukanmu.\"",
    snippet:
      "Tinggalkanlah apa yang meragukanmu menuju apa yang tidak meragukanmu.",
    narrator: "Al-Hasan bin Ali radhiyallahu 'anhuma",
    source: "HR. At-Tirmidzi no. 2518 dan An-Nasa'i no. 5711",
    originalSources: [
      { book: "Jami' At-Tirmidzi", number: 2518 },
      { book: "Sunan An-Nasa'i", number: 5711 },
    ],
    grade: "Hasan Shahih menurut At-Tirmidzi",
    category: "Akhlak",
    lessons: [
      "Prinsip wara': keluar dari keragu-raguan menuju kepastian hukum yang jelas dan menentramkan hati.",
      "Kebenaran senantiasa mendatangkan ketenangan batin, sedangkan kebatilan dan syubhat memicu kegundahan.",
      "Mendidik jiwa agar memiliki standar integritas moral yang tinggi dalam muamalah dan ibadah.",
    ],
    text: "Tinggalkanlah apa yang meragukanmu menuju apa yang tidak meragukanmu.",
    matanSnippet: "Tinggalkan keraguan menuju kepastian dan ketentraman hati.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-12",
    number: 12,
    title: "Meninggalkan Hal yang Tidak Bermanfaat",
    theme: "Tanda Baiknya Kualitas Keislaman Seseorang",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «مِنْ حُسْنِ إِسْلاَمِ المَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Di antara tanda baiknya keislaman seseorang adalah ia meninggalkan apa yang tidak bermanfaat baginya.\"",
    snippet:
      "Di antara tanda baiknya kualitas keislaman seseorang adalah ia meninggalkan apa yang tidak bermanfaat baginya.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. At-Tirmidzi no. 2317 dan Ibnu Majah no. 3976",
    originalSources: [
      { book: "Jami' At-Tirmidzi", number: 2317 },
      { book: "Sunan Ibnu Majah", number: 3976 },
    ],
    grade: "Hadits Hasan",
    category: "Akhlak",
    lessons: [
      "Menjaga waktu, ucapan, dan perhatian dari hal-hal sia-sia yang tidak berguna untuk urusan dunia maupun akhirat.",
      "Fokus pada perbaikan diri sendiri tanpa menyibukkan diri mengurusi aib atau privasi orang lain.",
      "Kunci ketenangan hidup dan kemuliaan akhlak seorang muslim sejati.",
    ],
    text: "Di antara tanda kebaikan keislaman seseorang adalah ia meninggalkan apa yang tidak bermanfaat baginya.",
    matanSnippet: "Tanda kebaikan Islam seseorang adalah meninggalkan hal yang tidak berguna.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-13",
    number: 13,
    title: "Mencintai Kebaikan untuk Saudara Seiman",
    theme: "Kesempurnaan Iman Terwujud Lewat Rasa Kasih Sayang terhadap Sesama",
    arab: "عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللهُ عَنْهُ خَادِمِ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ»",
    translation:
      "Dari Abu Hamzah Anas bin Malik radhiyallahu 'anhu, pelayan Rasulullah shallallahu 'alaihi wa sallam, dari Nabi shallallahu 'alaihi wa sallam, beliau bersabda: \"Tidak beriman salah seorang di antara kalian (dengan iman yang sempurna) sampai ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.\"",
    snippet:
      "Tidak sempurna iman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.",
    narrator: "Anas bin Malik radhiyallahu 'anhu",
    source: "HR. Bukhari no. 13 dan Muslim no. 45",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 13 },
      { book: "Shahih Muslim", number: 45 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Iman",
    lessons: [
      "Kewajiban menumbuhkan rasa empati, ukhuwah, dan solidaritas persaudaraan seiman.",
      "Mengikis penyakit hati seperti iri, dengki, dan rasa tidak senang ketika saudara memperoleh karunia.",
      "Berbagi kebahagiaan dan mengikhlaskan kebaikan bagi sesama manusia sebagaimana ia menyukainya untuk dirinya.",
    ],
    text: "Tidak beriman salah seorang di antara kalian hingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
    matanSnippet: "Mencintai untuk saudara apa yang dicintai untuk diri sendiri adalah tanda iman.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-14",
    number: 14,
    title: "Keharaman Darah Muslim Kecuali Tiga Alasan",
    theme: "Kesucian Nyawa Seorang Muslim dan Batasan Pidana Qishash dalam Syariat",
    arab: "عَنِ ابْنِ مَسْعُودٍ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لاَ يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ، يَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنِّي رَسُولُ اللَّهِ، إِلاَّ بِإِحْدَى ثَلاَثٍ: الثَّيِّبُ الزَّانِي، وَالنَّفْسُ بِالنَّفْسِ، وَالتَّارِكُ لِدِينِهِ المُفَارِقُ لِلْجَمَاعَةِ»",
    translation:
      "Dari Ibnu Mas'ud radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Tidak halal darah seorang muslim yang bersaksi bahwa tidak ada tuhan yang berhak disembah selain Allah dan bahwa aku adalah utusan Allah, kecuali karena salah satu dari tiga perkara: orang yang pernah menikah yang berzina (tsayyib), jiwa dibalas dengan jiwa (qishash pembunuhan sengaja), dan orang yang meninggalkan agamanya (murtad) serta memisahkan diri dari jamaah kaum muslimin.\"",
    snippet:
      "Tidak halal darah seorang muslim kecuali karena tiga hal: pezina yang sudah menikah, qishash jiwa dibalas jiwa, dan orang murtad yang membelot dari jamaah.",
    narrator: "Abdullah bin Mas'ud radhiyallahu 'anhu",
    source: "HR. Bukhari no. 6878 dan Muslim no. 1676",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 6878 },
      { book: "Shahih Muslim", number: 1676 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Muamalah",
    lessons: [
      "Besarnya kehormatan nyawa seorang muslim yang haram dihilangkan tanpa hak syar'i.",
      "Penetapan dan pelaksanaan sanksi hukum berat ini merupakan hak mutlak pengadilan hakim yang sah, bukan main hakim sendiri.",
      "Perlindungan syariat Islam terhadap lima perkara pokok: agama, jiwa, keturunan, akal, dan harta.",
    ],
    text: "Tidak halal darah seorang muslim yang bersaksi bahwa tidak ada tuhan selain Allah dan aku utusan-Nya, kecuali karena salah satu dari tiga perkara: pezina yang sudah menikah, pembunuh (qishash), dan yang murtad dari agamanya.",
    matanSnippet: "Kesucian darah seorang muslim dan batas-batas hukum qishash.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-15",
    number: 15,
    title: "Menjaga Lisan, Memuliakan Tetangga dan Tamu",
    theme: "Tiga Manifestasi Akhlak Sosial yang Berakar dari Keimanan",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيَقُلْ خَيْراً أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَاليَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, bahwasanya Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam. Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia memuliakan tetangganya. Dan barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia memuliakan tamunya.\"",
    snippet:
      "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah berkata baik atau diam, memuliakan tetangganya, dan memuliakan tamunya.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 6018 dan Muslim no. 47",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 6018 },
      { book: "Shahih Muslim", number: 47 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Akhlak",
    lessons: [
      "Menahan lisan dari perkataan dusta, ghibah, dan kesia-siaan adalah bukti nyata iman kepada hari pembalasan.",
      "Kewajiban menghormati hak-hak tetangga dengan menjaga keamanan dan tidak mengganggu kenyamanan mereka.",
      "Memuliakan dan melayani tamu dengan ramah serta menyuguhkan jamuan terbaik yang mampu diberikan.",
    ],
    text: "Barangsiapa yang beriman kepada Allah dan hari akhir hendaklah ia berkata yang baik atau diam, memuliakan tetangganya, dan memuliakan tamunya.",
    matanSnippet: "Berkata baik atau diam, menghormati tetangga, serta menjamu tamu dengan mulia.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-16",
    number: 16,
    title: "Larangan Marah",
    theme: "Wasiat Rasulullah ﷺ untuk Mengendalikan Hawa Nafsu Amarah",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَجُلاً قَالَ لِلنَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: أَوْصِنِي. قَالَ: «لاَ تَغْضَبْ». فَرَدَّدَ مِرَاراً، قَالَ: «لاَ تَغْضَبْ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, bahwasanya ada seorang laki-laki berkata kepada Nabi shallallahu 'alaihi wa sallam: \"Berilah aku wasiat.\" Beliau bersabda: \"Jangan marah.\" Orang itu mengulang-ulang permintaannya beberapa kali, dan beliau tetap menegaskan: \"Jangan marah.\"",
    snippet:
      "Jangan marah! Rasulullah mengulang wasiat ini berkali-kali sebagai benteng utama keselamatan jiwa.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 6116",
    originalSources: [{ book: "Shahih Al-Bukhari", number: 6116 }],
    grade: "Shahih Bukhari",
    category: "Akhlak",
    lessons: [
      "Mengendalikan amarah mencegah terjadinya penyesalan, permusuhan, dan keputusan gegabah yang merugikan.",
      "Menahan emosi ketika marah merupakan tanda kekuatan jiwa yang sejati.",
      "Anjuran meredakan amarah dengan berwudhu, beristighfar, diam, atau mengubah posisi tubuh.",
    ],
    text: "Ada seorang laki-laki berkata kepada Nabi: Berilah aku wasiat. Beliau bersabda: Jangan marah. Orang itu mengulanginya beberapa kali, beliau tetap bersabda: Jangan marah.",
    matanSnippet: "Wasiat emas Rasulullah ﷺ: Jangan marah dan kendalikan emosi jiwa.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-17",
    number: 17,
    title: "Kewajiban Berbuat Ihsan dalam Segala Hal",
    theme: "Kebaikan dan Kasih Sayang Menyeluruh, Bahkan Saat Menyembelih Hewan",
    arab: "عَنْ أَبِي يَعْلَى شَدَّادِ بْنِ أَوْسٍ رَضِيَ اللهُ عَنْهُ، عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إِنَّ اللَّهَ كَتَبَ الإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا القِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ»",
    translation:
      "Dari Abu Ya'la Syaddad bin Aus radhiyallahu 'anhu, dari Rasulullah shallallahu 'alaihi wa sallam, beliau bersabda: \"Sesungguhnya Allah mewajibkan berbuat ihsan (kebaikan profesional) atas segala sesuatu. Maka jika kalian membunuh, membunuhlah dengan cara yang baik; dan jika kalian menyembelih, sembelihlah dengan cara yang baik; hendaklah salah seorang di antara kalian menajamkan bilah pisaunya dan memberikan kenyamanan pada hewan sembelihannya.\"",
    snippet:
      "Sesungguhnya Allah mewajibkan berbuat ihsan atas segala sesuatu. Jika menyembelih, sembelihlah dengan baik dan tajamkan pisau kalian agar menyenangkan hewan sembelihannya.",
    narrator: "Syaddad bin Aus radhiyallahu 'anhu",
    source: "HR. Muslim no. 1955",
    originalSources: [{ book: "Shahih Muslim", number: 1955 }],
    grade: "Shahih Muslim",
    category: "Akhlak",
    lessons: [
      "Prinsip kebaikan menyeluruh dalam Islam mencakup interaksi dengan seluruh makhluk ciptaan Allah.",
      "Kasih sayang terhadap hewan: haram menyiksa, menumpulkan pisau, atau menyembelih di hadapan hewan lain.",
      "Tuntutan profesionalisme (itqan) dan keindahan dalam setiap pekerjaan dan profesi seorang muslim.",
    ],
    text: "Sesungguhnya Allah telah menetapkan perbuatan baik (ihsan) atas segala sesuatu. Apabila kalian menyembelih, maka sembelihlah dengan baik, tajamkanlah pisau dan tenangkanlah hewan sembelihan.",
    matanSnippet: "Kewajiban ihsan dalam segala urusan hingga pada adab menyembelih hewan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-18",
    number: 18,
    title: "Takwa di Mana Saja dan Akhlak Mulia",
    theme: "Tiga Pedoman Hidup: Takwa kepada Allah, Taubat Membersihkan Dosa, dan Bergaul Baik dengan Manusia",
    arab: "عَنْ أَبِي ذَرٍّ جُنْدُبِ بْنِ جُنَادَةَ، وَأَبِي عَبْدِ الرَّحْمَنِ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللهُ عَنْهُمَا، عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ»",
    translation:
      "Dari Abu Dzar Jundub bin Junadah dan Abu Abdirrahman Mu'adz bin Jabal radhiyallahu 'anhuma, dari Rasulullah shallallahu 'alaihi wa sallam, beliau bersabda: \"Bertakwalah kepada Allah di mana pun kamu berada, iringilah keburukan dengan kebaikan niscaya kebaikan itu akan menghapusnya, dan pergaulilah manusia dengan akhlak yang mulia.\"",
    snippet:
      "Bertakwalah kepada Allah di mana pun berada, iringilah keburukan dengan kebaikan niscaya menghapusnya, dan pergaulilah sesama dengan budi pekerti yang luhur.",
    narrator: "Abu Dzar Al-Ghifari & Mu'adz bin Jabal radhiyallahu 'anhuma",
    source: "HR. At-Tirmidzi no. 1987",
    originalSources: [{ book: "Jami' At-Tirmidzi", number: 1987 }],
    grade: "Hasan Shahih menurut At-Tirmidzi",
    category: "Akhlak",
    lessons: [
      "Menjaga ketakwaan secara konsisten baik di hadapan orang banyak maupun saat sendirian tanpa pantauan manusia.",
      "Kebaikan, sedekah, dan istighfar memiliki daya ampuh menghapuskan jejak-jejak dosa kecil.",
      "Akhlak mulia adalah buah terindah dari akidah dan takwa yang tulus kepada Allah Ta'ala.",
    ],
    text: "Bertakwalah kepada Allah di mana pun kamu berada. Iringilah keburukan dengan kebaikan, niscaya kebaikan itu akan menghapusnya. Dan berakhlaklah kepada manusia dengan akhlak yang baik.",
    matanSnippet: "Bertakwa di mana pun berada, menghapus dosa dengan kebaikan, dan berakhlak terpuji.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-19",
    number: 19,
    title: "Menjaga Hak Allah dan Pertolongan-Nya",
    theme: "Wasiat Emas kepada Ibnu Abbas tentang Tauhid, Tawakal, dan Perlindungan Ilahi",
    arab: "عَنْ أَبِي العَبَّاسِ عَبْدِ اللَّهِ بْنِ عَبَّاسٍ رَضِيَ اللهُ عَنْهُمَا قَالَ: كُنْتُ خَلْفَ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَوْماً فَقَالَ: «يَا غُلاَمُ، إِنِّي أُعَلِّمُكَ كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوِ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَإِنِ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إِلاَّ بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ، رُفِعَتِ الأَقْلاَمُ وَجَفَّتِ الصُّحُفُ»",
    translation:
      "Dari Abul Abbas Abdullah bin Abbas radhiyallahu 'anhuma, ia berkata: Suatu hari aku pernah dibonceng di belakang Nabi shallallahu 'alaihi wa sallam, lalu beliau bersabda: \"Wahai anak muda, sesungguhnya aku ingin mengajarkan kepadamu beberapa kalimat nasihat: Jagalah Allah (hak-hak dan syariat-Nya), niscaya Dia akan menjagamu. Jagalah Allah, niscaya engkau dapati Dia selalu di hadapanmu. Jika engkau memohon, mohonlah kepada Allah; dan jika engkau meminta pertolongan, mintalah pertolongan kepada Allah. Ketahuilah, seandainya seluruh umat bersatu padu untuk memberimu suatu manfaat, mereka tidak akan mampu memberimu manfaat kecuali apa yang telah Allah tetapkan untukmu. Dan seandainya mereka bersatu padu untuk mencelakakanmu dengan suatu bahaya, mereka tidak akan mampu membahayakanmu kecuali apa yang telah Allah tetapkan atasmu. Pena telah diangkat dan lembaran-lembaran catatan takdir telah kering.\"",
    snippet:
      "Jagalah Allah niscaya Dia menjagamu. Jika memohon mintalah pada Allah, jika meminta tolong mintalah pada Allah. Manfaat dan mudharat seluruhnya telah tertulis dalam takdir-Nya.",
    narrator: "Abdullah bin Abbas radhiyallahu 'anhuma",
    source: "HR. At-Tirmidzi no. 2516",
    originalSources: [{ book: "Jami' At-Tirmidzi", number: 2516 }],
    grade: "Hasan Shahih menurut At-Tirmidzi",
    category: "Iman",
    lessons: [
      "Pentingnya menanamkan dasar-dasar akidah tauhid dan tawakal sejak usia dini kepada generasi muda.",
      "Barangsiapa memelihara perintah Allah dan batasan-Nya, maka Allah akan menjaga agama, keluarga, dan kehidupannya.",
      "Kemerdekaan jiwa seorang mukmin: tidak takut pada ancaman manusia dan tidak berharap pada selain Allah, karena segala sesuatu telah ditetapkan dalam Lauhul Mahfuzh.",
    ],
    text: "Jagalah Allah niscaya Dia menjagamu, jagalah Allah niscaya engkau dapati Dia di hadapanmu. Bila meminta mintalah pada Allah, bila memohon pertolongan mintalah pada Allah...",
    matanSnippet: "Jagalah hak-hak Allah niscaya Dia menjagamu dalam segala keadaan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-20",
    number: 20,
    title: "Rasa Malu Warisan Pokok Kenabian",
    theme: "Rasa Malu sebagai Pengendali Batin dari Perbuatan Keji dan Dosa",
    arab: "عَنْ أَبِي مَسْعُودٍ عُقْبَةَ بْنِ عَمْرٍو الأَنْصَارِيِّ البَدْرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلاَمِ النُّبُوَّةِ الأُولَى: إِذَا لَمْ تَسْتَحِ فَاصْنَعْ مَا شِئْتَ»",
    translation:
      "Dari Abu Mas'ud Uqbah bin Amr Al-Anshari Al-Badri radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya di antara ungkapan kenabian terdahulu yang masih didapati manusia adalah: 'Jika engkau tidak lagi memiliki rasa malu, maka perbuatlah apa saja yang engkau kehendaki.'\"",
    snippet:
      "Jika engkau tidak lagi memiliki rasa malu, maka berbuatlah sesukamu. Malu adalah penjaga kehormatan harkat manusia.",
    narrator: "Abu Mas'ud Al-Anshari radhiyallahu 'anhu",
    source: "HR. Bukhari no. 3484",
    originalSources: [{ book: "Shahih Al-Bukhari", number: 3484 }],
    grade: "Shahih Bukhari",
    category: "Akhlak",
    lessons: [
      "Rasa malu (haya') adalah ajaran universal seluruh nabi dan rasul sejak nabi pertama.",
      "Hilangnya rasa malu menyebabkan manusia kehilangan kontrol moral sehingga berani bermaksiat secara terang-terangan.",
      "Malu kepada Allah adalah tingkatan tertinggi yang menahan hamba dari dosa di tempat sunyi.",
    ],
    text: "Sesungguhnya sebagian dari ajaran yang didapati manusia dari perkataan kenabian terdahulu adalah: Jika kamu tidak malu, maka berbuatlah sesukamu.",
    matanSnippet: "Rasa malu adalah benteng kenabian yang membentengi manusia dari keburukan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-21",
    number: 21,
    title: "Beriman Kemudian Beristiqamah",
    theme: "Dua Fondasi Keselamatan: Kemurnian Akidah dan Kekonsistenan Amal",
    arab: "عَنْ أَبِي عَمْرٍو - وَقِيلَ: أَبِي عَمْرَةَ - سُفْيَانَ بْنِ عَبْدِ اللَّهِ رَضِيَ اللهُ عَنْهُ قَالَ: قُلْتُ: يَا رَسُولَ اللَّهِ، قُلْ لِي فِي الإِسْلاَمِ قَوْلاً لاَ أَسْأَلُ عَنْهُ أَحَداً غَيْرَكَ. قَالَ: «قُلْ: آمَنْتُ بِاللَّهِ، ثُمَّ اسْتَقِمْ»",
    translation:
      "Dari Abu 'Amr—ada yang mengatakan: Abu 'Amrah—Sufyan bin Abdillah radhiyallahu 'anhu, ia berkata: Aku berkata: \"Wahai Rasulullah, ajarkan kepadaku dalam Islam suatu perkataan ringkas yang tidak akan kutanyakan lagi kepada seorang pun selain engkau.\" Beliau bersabda: \"Katakanlah: 'Aku beriman kepada Allah', kemudian beristiqamahlah.\"",
    snippet:
      "Katakanlah: Aku beriman kepada Allah, kemudian beristiqamahlah secara konsisten hingga akhir hayat.",
    narrator: "Sufyan bin Abdillah Ats-Tsaqafi radhiyallahu 'anhu",
    source: "HR. Muslim no. 38",
    originalSources: [{ book: "Shahih Muslim", number: 38 }],
    grade: "Shahih Muslim",
    category: "Iman",
    lessons: [
      "Jawami'ul Kalim: perkataan Nabi shallallahu 'alaihi wa sallam yang sangat ringkas namun sarat makna komprehensif.",
      "Iman sejati bukan hanya pengakuan lisan, tetapi harus dibuktikan dengan konsistensi amalan di atas syariat.",
      "Istiqamah adalah karamah terbesar yang menjaga seorang hamba tetap berada dalam jalan yang lurus.",
    ],
    text: "Katakanlah: Aku beriman kepada Allah, kemudian beristiqamahlah.",
    matanSnippet: "Katakan: Aku beriman kepada Allah, lalu istiqamahlah.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-22",
    number: 22,
    title: "Mencukupkan Diri dengan yang Fardhu untuk Meraih Surga",
    theme: "Melaksanakan Kewajiban Utama dan Menjauhi Haram Sebagai Jalan Keselamatan",
    arab: "عَنْ أَبِي عَبْدِ اللَّهِ جَابِرِ بْنِ عَبْدِ اللَّهِ الأَنْصَارِيِّ رَضِيَ اللهُ عَنْهُمَا: أَنَّ رَجُلاً سَأَلَ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: أَرَأَيْتَ إِذَا صَلَّيْتُ المَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الحَلاَلَ، وَحَرَّمْتُ الحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئاً، أَأَدْخُلُ الجَنَّةَ؟ قَالَ: «نَعَمْ»",
    translation:
      "Dari Abu Abdillah Jabir bin Abdillah Al-Anshari radhiyallahu 'anhuma: Bahwasanya ada seorang laki-laki bertanya kepada Rasulullah shallallahu 'alaihi wa sallam: \"Bagaimanakah pendapatmu jika aku melaksanakan shalat-shalat fardhu, berpuasa Ramadhan, menghalalkan yang halal, mengharamkan yang haram, dan aku tidak menambah sedikit pun di atas hal itu, apakah aku akan masuk surga?\" Beliau menjawab: \"Ya.\"",
    snippet:
      "Jika aku shalat fardhu, berpuasa Ramadhan, menghalalkan yang halal dan menjauhi yang haram tanpa menambah amalan lain, apakah aku masuk surga? Beliau menjawab: Ya.",
    narrator: "Jabir bin Abdillah radhiyallahu 'anhuma",
    source: "HR. Muslim no. 15",
    originalSources: [{ book: "Shahih Muslim", number: 15 }],
    grade: "Shahih Muslim",
    category: "Ibadah",
    lessons: [
      "Menunaikan kewajiban fardhu dan meninggalkan hal yang diharamkan merupakan jaminan pasti keselamatan masuk surga.",
      "Kemudahan syariat Islam bagi setiap orang yang memiliki keterbatasan untuk menambah amalan tathawwu' (sunnah).",
      "Pentingnya kepatuhan mutlak terhadap halal dan haram yang telah digariskan oleh Allah Ta'ala.",
    ],
    text: "Seorang laki-laki bertanya: Bagaimanakah bila aku mengerjakan shalat fardhu, berpuasa Ramadhan, menghalalkan yang halal, dan mengharamkan yang haram tanpa menambah apapun, apakah aku masuk surga? Nabi menjawab: Ya.",
    matanSnippet: "Menegakkan amalan fardhu dan menjauhi yang haram mengantarkan ke surga.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-23",
    number: 23,
    title: "Kesucian, Shalat Cahaya, Sedekah Bukti, dan Sabar Pelita",
    theme: "Keutamaan Amalan Hati dan Raga yang Mengantarkan Kemerdekaan Jiwa",
    arab: "عَنْ أَبِي مَالِكٍ الحَارِثِ بْنِ عَاصِمٍ الأَشْعَرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «الطُّهُورُ شَطْرُ الإِيمَانِ، وَالحَمْدُ لِلَّهِ تَمْلأُ المِيزَانَ، وَسُبْحَانَ اللَّهِ وَالحَمْدُ لِلَّهِ تَمْلآنِ - أَوْ تَمْلأُ - مَا بَيْنَ السَّمَاءِ وَالأَرْضِ، وَالصَّلاَةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ، كُلُّ النَّاسِ يَغْدُو، فَبَائِعٌ نَفْسَهُ، فَمُعْتِقُهَا أَوْ مُوبِقُهَا»",
    translation:
      "Dari Abu Malik Al-Harits bin Ashim Al-Asy'ari radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Bersuci adalah separuh dari keimanan. Kalimat 'Alhamdulillah' memenuhi timbangan amal. Kalimat 'Subhanallah walhamdulillah' memenuhi antara langit dan bumi. Shalat adalah cahaya, sedekah adalah bukti nyata (iman), kesabaran adalah pelita yang menerangi, dan Al-Qur'an adalah pembela bagimu atau penuntut atasmu. Setiap manusia berpagi hari lalu menjual dirinya; maka ada yang memerdekakan dirinya (dari azab) atau membinasakannya.\"",
    snippet:
      "Bersuci adalah separuh iman, Alhamdulillah memenuhi timbangan amal, shalat adalah cahaya, sedekah bukti iman, dan sabar adalah pelita yang menerangi.",
    narrator: "Abu Malik Al-Asy'ari radhiyallahu 'anhu",
    source: "HR. Muslim no. 223",
    originalSources: [{ book: "Shahih Muslim", number: 223 }],
    grade: "Shahih Muslim",
    category: "Ibadah",
    lessons: [
      "Thaharah (bersuci) membersihkan kotoran raga sekaligus kotoran dosa maksiat.",
      "Besarnya bobot dzikir tasbih dan tahmid dalam timbangan mizan amal di akhirat kelak.",
      "Al-Qur'an akan menjadi saksi pembela bagi yang membacanya dan mengamalkannya, atau menjadi penggugat bagi yang menyia-nyiakannya.",
    ],
    text: "Bersuci adalah separuh keimanan, Alhamdulillah memenuhi timbangan... shalat adalah cahaya, sedekah adalah bukti, kesabaran adalah pelita, dan Al-Qur'an menjadi pembela atau penuntut atasmu.",
    matanSnippet: "Kesucian, dzikir mizan, shalat cahaya, sedekah bukti, dan Al-Qur'an pembela.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-24",
    number: 24,
    title: "Keharaman Zhalim dan Maha Kayanya Allah (Hadits Qudsi)",
    theme: "Larangan Berbuat Zhalim, Rahmat Hidayah, dan Allah Tidak Butuh kepada Makhluk-Nya",
    arab: "عَنْ أَبِي ذَرٍّ الغِفَارِيِّ رَضِيَ اللهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فِيمَا يَرْوِيهِ عَنْ رَبِّهِ عَزَّ وَجَلَّ أَنَّهُ قَالَ: «يَا عِبَادِي، إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي، وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّماً فَلاَ تَظَالَمُوا. يَا عِبَادِي، كُلُّكُمْ ضَالٌّ إِلاَّ مَنْ هَدَيْتُهُ فَاسْتَهْدُونِي أَهْدِكُمْ. يَا عِبَادِي، كُلُّكُمْ جَائِعٌ إِلاَّ مَنْ أَطْعَمْتُهُ فَاسْتَطْعِمُونِي أُطْعِمْكُمْ. يَا عِبَادِي، كُلُّكُمْ عَارٍ إِلاَّ مَنْ كَسَوْتُهُ فَاسْتَكْسُونِي أَكْسُكُمْ. يَا عِبَادِي، إِنَّكُمْ تُخْطِئُونَ بِاللَّيْلِ وَالنَّهَارِ وَأَنَا أَغْفِرُ الذُّنُوبَ جَمِيعاً فَاسْتَغْفِرُونِي أَغْفِرْ لَكُمْ... يَا عِبَادِي، إِنَّمَا هِيَ أَعْمَالُكُمْ أُحْصِيهَا لَكُمْ ثُمَّ أُوَفِّيكُمْ إِيَّاهَا، فَمَنْ وَجَدَ خَيْراً فَلْيَحْمَدِ اللَّهَ، وَمَنْ وَجَدَ غَيْرَ ذَلِكَ فَلاَ يَلُومَنَّ إِلاَّ نَفْسَهُ»",
    translation:
      "Dari Abu Dzar Al-Ghifari radhiyallahu 'anhu, dari Nabi shallallahu 'alaihi wa sallam meriwayatkan firman Allah 'Azza wa Jalla: \"Wahai hamba-hamba-Ku, sesungguhnya Aku telah mengharamkan kezhaliman atas diri-Ku dan Aku menjadikannya haram di antara kalian, maka janganlah kalian saling menzhalimi. Wahai hamba-hamba-Ku, kalian semua tersesat kecuali siapa yang Aku beri petunjuk, maka mintalah petunjuk kepada-Ku niscaya Aku tunjuki. Wahai hamba-hamba-Ku, kalian semua lapar kecuali siapa yang Aku beri makan, maka mintalah makan kepada-Ku niscaya Aku beri makan. Wahai hamba-hamba-Ku, kalian semua telanjang kecuali siapa yang Aku beri pakaian, maka mintalah pakaian kepada-Ku niscaya Aku beri pakaian. Wahai hamba-hamba-Ku, sesungguhnya kalian berbuat salah di waktu malam dan siang sedangkan Aku mengampuni seluruh dosa, maka mohonlah ampunan kepada-Ku niscaya Aku ampuni kalian... Wahai hamba-Ku, sesungguhnya ini hanyalah amal perbuatan kalian yang Aku catat untuk kalian kemudian Aku balas secara sempurna. Maka barangsiapa mendapati kebaikan hendaklah memuji Allah, dan barangsiapa mendapati selain itu maka janganlah mencela kecuali dirinya sendiri.\"",
    snippet:
      "Wahai hamba-Ku, Aku haramkan kezhaliman atas diri-Ku dan Aku jadikan haram di antara kalian, maka janganlah saling menzhalimi! Ini hanyalah amal perbuatan kalian yang Ku-catat lalu Ku-balas seutuhnya.",
    narrator: "Abu Dzar Al-Ghifari radhiyallahu 'anhu",
    source: "HR. Muslim no. 2577",
    originalSources: [{ book: "Shahih Muslim", number: 2577 }],
    grade: "Shahih Muslim",
    category: "Muamalah",
    lessons: [
      "Kezhaliman adalah dosa besar yang paling dimurkai Allah, baik zhalim terhadap hak Allah maupun hak sesama hamba.",
      "Seluruh makhluk mutlak bergantung kepada rezeki, hidayah, dan ampunan Allah setiap tarikan nafas.",
      "Ketaatan seluruh makhluk tidak menambah kemuliaan Allah sedikit pun, dan kedurhakaan mereka tidak mengurangi kekuasaan-Nya.",
    ],
    text: "Wahai hamba-Ku, sesungguhnya Aku telah mengharamkan kezhaliman atas diri-Ku dan menjadikannya haram di antara kalian, maka janganlah kalian saling berbuat zhalim...",
    matanSnippet: "Kezhaliman diharamkan mutlak, dan Allah Maha Kaya dari seluruh makhluk-Nya.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-25",
    number: 25,
    title: "Luasnya Pintu-Pintu Sedekah",
    theme: "Dzikir, Amar Ma'ruf, Nahi Munkar, dan Nafkah Keluarga Bernilai Pahala Sedekah",
    arab: "عَنْ أَبِي ذَرٍّ رَضِيَ اللهُ عَنْهُ أَيْضاً: أَنَّ نَاساً مِنْ أَصْحَابِ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالُوا لِلنَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: يَا رَسُولَ اللَّهِ، ذَهَبَ أَهْلُ الدُّثُورِ بِالأُجُورِ، يُصَلُّونَ كَمَا نُصَلِّي، وَيَصُومُونَ كَمَا نَصُومُ، وَيَتَصَدَّقُونَ بِفُضُولِ أَمْوَالِهِمْ. قَالَ: «أَوَلَيْسَ قَدْ جَعَلَ اللَّهُ لَكُمْ مَا تَصَّدَّقُونَ؟ إِنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً، وَكُلِّ تَكْبِيرَةٍ صَدَقَةً، وَكُلِّ تَحْمِيدَةٍ صَدَقَةً، وَكُلِّ تَهْلِيلَةٍ صَدَقَةً، وَأَمْرٌ بِالمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ، وَفِي بُضْعِ أَحَدِكُمْ صَدَقَةٌ». قَالُوا: يَا رَسُولَ اللَّهِ، أَيَأْتِي أَحَدُنَا شَهْوَتَهُ وَيَكُونُ لَهُ فِيهَا أَجْرٌ؟ قَالَ: «أَرَأَيْتُمْ لَوْ وَضَعَهَا فِي حَرَامٍ أَكَانَ عَلَيْهِ فِيهَا وِزْرٌ؟ فَكَذَلِكَ إِذَا وَضَعَهَا فِي الحَلاَلِ كَانَ لَهُ أَجْرٌ»",
    translation:
      "Dari Abu Dzar radhiyallahu 'anhu juga: Bahwasanya sejumlah sahabat fakir berkata kepada Nabi shallallahu 'alaihi wa sallam: \"Wahai Rasulullah, orang-orang kaya telah memborong banyak pahala. Mereka shalat sebagaimana kami shalat, berpuasa sebagaimana kami berpuasa, dan mereka dapat bersedekah dengan kelebihan harta mereka.\" Beliau bersabda: \"Bukankah Allah telah menjadikan bagi kalian hal-hal yang dapat kalian sedekahkan? Sesungguhnya setiap ucapan tasbih adalah sedekah, setiap takbir adalah sedekah, setiap tahmid adalah sedekah, setiap tahlil adalah sedekah, memerintahkan kebaikan adalah sedekah, melarang kemungkaran adalah sedekah, dan pada hubungan halal kalian terdapat sedekah.\" Mereka bertanya: \"Wahai Rasulullah, apakah salah seorang di antara kami yang menyalurkan syahwatnya bisa berbuah pahala?\" Beliau menjawab: \"Bagaimana pendapat kalian seandainya ia menyalurkannya pada yang haram, bukankah ia menanggung dosa? Maka demikian pula jika ia menyalurkannya pada yang halal, baginya pahala.\"",
    snippet:
      "Sedekah bukan hanya harta: tasbih, tahmid, takbir, tahlil, amar ma'ruf nahi munkar, hingga nafkah pada pasangan adalah sedekah bernilai pahala.",
    narrator: "Abu Dzar Al-Ghifari radhiyallahu 'anhu",
    source: "HR. Muslim no. 1006",
    originalSources: [{ book: "Shahih Muslim", number: 1006 }],
    grade: "Shahih Muslim",
    category: "Ibadah",
    lessons: [
      "Luasnya rahmat karunia Allah membuka pintu sedekah bagi orang kaya maupun dhuafa tanpa batasan materi.",
      "Setiap kalimat thoyyibah dzikir bernilai sedekah yang memperberat timbangan amal.",
      "Niat yang baik mengubah rutinitas fitrah biologis menjadi ibadah bernilai pahala di sisi Allah.",
    ],
    text: "Setiap tasbih adalah sedekah, setiap takbir adalah sedekah, setiap tahmid adalah sedekah, amar ma'ruf sedekah, nahi munkar sedekah, dan hubungan halal bersedekah...",
    matanSnippet: "Keluasan pintu sedekah meliputi dzikir, kebaikan sosial, dan nafkah halal.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-26",
    number: 26,
    title: "Sedekah atas Setiap Persendian Tubuh",
    theme: "Mendamaikan Manusia, Membantu Orang Lain, Tutur Kata Baik, dan Menyingkirkan Duri",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «كُلُّ سُلاَمَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ: تَعْدِلُ بَيْنَ الاِثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَبِكُلِّ خُطْوَةٍ تَمْشِيهَا إِلَى الصَّلاَةِ صَدَقَةٌ، وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Setiap persendian manusia memiliki kewajiban sedekah pada setiap hari matahari terbit: engkau mendamaikan secara adil antara dua orang yang berselisih adalah sedekah, engkau menolong seseorang pada kendaraannya lalu membantunya naik atau mengangkatkan barang bawaannya adalah sedekah, perkataan yang baik adalah sedekah, setiap langkah yang engkau ayunkan untuk shalat adalah sedekah, dan menyingkirkan duri atau gangguan dari jalanan adalah sedekah.\"",
    snippet:
      "Setiap persendian wajib disedekahi setiap hari: mendamaikan dua orang berselisih, menolong sesama, tutur kata santun, melangkah ke masjid, dan membersihkan jalanan.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 2989 dan Muslim no. 1009",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 2989 },
      { book: "Shahih Muslim", number: 1009 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Muamalah",
    lessons: [
      "Mensyukuri nikmat 360 persendian tubuh manusia yang sehat melalui amal kemanusiaan sehari-hari.",
      "Keutamaan mendamaikan hubungan (ishlah dzatil bain) di antara saudara yang bertikai.",
      "Menjaga kebersihan dan ketertiban fasilitas umum jalanan bernilai pahala ibadah nyata.",
    ],
    text: "Setiap persendian manusia wajib disedekahi setiap hari ketika matahari terbit: mendamaikan dua orang adalah sedekah, menolong orang lain sedekah, kata yang baik sedekah, langkah ke masjid sedekah, dan membuang gangguan di jalan adalah sedekah.",
    matanSnippet: "Sedekah harian untuk mensyukuri persendian tubuh melalui amal kebaikan sosial.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-27",
    number: 27,
    title: "Hakikat Kebaikan dan Tanda Dosa dalam Hati",
    theme: "Kebaikan adalah Akhlak Mulia dan Dosa adalah Kegelisahan Hati",
    arab: "عَنِ النَّوَّاسِ بْنِ سَمْعَانَ رَضِيَ اللهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «البِرُّ حُسْنُ الخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ، وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ» (رَوَاهُ مُسْلِمٌ). وَعَنْ وَابِصَةَ بْنِ مَعْبَدٍ رَضِيَ اللهُ عَنْهُ قَالَ: أَتَيْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: «جِئْتَ تَسْأَلُ عَنِ البِرِّ؟» قُلْتُ: نَعَمْ. قَالَ: «اسْتَفْتِ قَلْبَكَ؛ البِرُّ مَا اطْمَأَنَّتْ إِلَيْهِ النَّفْسُ وَاطْمَأَنَّ إِلَيْهِ القَلْبُ، وَالإِثْمُ مَا حَاكَ فِي النَّفْسِ وَتَرَدَّدَ فِي الصَّدْرِ، وَإِنْ أَفْتَاكَ النَّاسُ وَأَفْتَوْكَ»",
    translation:
      "Dari An-Nawwas bin Sam'an radhiyallahu 'anhu, dari Nabi shallallahu 'alaihi wa sallam, beliau bersabda: \"Kebaikan itu adalah akhlak yang mulia, dan dosa adalah apa yang mengganjal di dalam dadamu dan engkau tidak suka jika orang lain mengetahuinya.\" (HR. Muslim). Dan dari Wabishah bin Ma'bad radhiyallahu 'anhu, ia berkata: Aku mendatangi Rasulullah shallallahu 'alaihi wa sallam, lalu beliau bertanya: \"Apakah engkau datang untuk menanyakan tentang kebaikan?\" Aku menjawab: \"Ya.\" Beliau bersabda: \"Mintalah fatwa kepada hatimu; kebaikan adalah apa yang membuat jiwa dan hati merasa tenang, sedangkan dosa adalah apa yang menggelisahkan jiwa dan ragu di dalam dada, sekalipun orang-orang berulang kali memberimu fatwa pembenaran.\"",
    snippet:
      "Kebaikan adalah akhlak mulia. Dosa adalah apa yang menggelisahkan dadamu dan engkau benci bila diketahui orang lain. Mintalah fatwa kepada nurani hatimu.",
    narrator: "An-Nawwas bin Sam'an & Wabishah bin Ma'bad radhiyallahu 'anhuma",
    source: "HR. Muslim no. 2553 dan Ahmad no. 18001",
    originalSources: [
      { book: "Shahih Muslim", number: 2553 },
      { book: "Musnad Ahmad", number: 18001 },
    ],
    grade: "Shahih dan Hasan",
    category: "Akhlak",
    lessons: [
      "Fitrah hati mukmin yang bersih memiliki radar kepekaan alami mengenali kebajikan dan menolak keburukan.",
      "Kebaikan selalu melahirkan kedamaian jiwa, sedangkan dosa menimbulkan kegelisahan dan rasa was-was.",
      "Pentingnya mendengarkan suara hati nurani yang dibimbing cahaya syariat.",
    ],
    text: "Kebaikan itu adalah akhlak yang baik, dan dosa adalah apa yang meragukan dadamu dan engkau benci orang lain mengetahuinya.",
    matanSnippet: "Kebaikan menentramkan nurani, sedangkan dosa menggelisahkan batin.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-28",
    number: 28,
    title: "Wasiat Takwa, Ketaatan, dan Berpegang pada Sunnah",
    theme: "Nasihat Perpisahan Menghadapi Perselisihan Umat dengan Meneladani Khulafaur Rasyidin",
    arab: "عَنْ أَبِي نَجِيحٍ العِرْبَاضِ بْنِ سَارِيَةَ رَضِيَ اللهُ عَنْهُ قَالَ: وَعَظَنَا رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ مَوْعِظَةً بَلِيغَةً وَجِلَتْ مِنْهَا القُلُوبُ وَذَرَفَتْ مِنْهَا العُيُونُ، فَقُلْنَا: يَا رَسُولَ اللَّهِ، كَأَنَّهَا مَوْعِظَةُ مُوَدِّعٍ فَأَوْصِنَا. قَالَ: «أُوصِيكُمْ بِتَقْوَى اللَّهِ، وَالسَّمْعِ وَالطَّاعَةِ وَإِنْ تَأَمَّرَ عَلَيْكُمْ عَبْدٌ، فَإِنَّهُ مَنْ يَعِشْ مِنْكُمْ بَعْدِي فَسَيَرَى اخْتِلاَفاً كَثِيراً، فَعَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الخُلَفَاءِ الرَّاشِدِينَ المَهْدِيِّينَ، عَضُّوا عَلَيْهَا بِالنَّوَاجِذِ، وَإِيَّاكُمْ وَمُحْدَثَاتِ الأُمُورِ، فَإِنَّ كُلَّ مُحْدَثَةٍ بِدْعَةٌ، وَكُلَّ بِدْعَةٍ ضَلاَلَةٌ»",
    translation:
      "Dari Abu Najih Al-Irbadh bin Sariyah radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam memberi kami nasihat mendalam yang membuat hati bergetar dan air mata berlinang. Kami berkata: \"Wahai Rasulullah, seakan-akan ini adalah nasihat perpisahan, maka berilah kami wasiat.\" Beliau bersabda: \"Aku berwasiat kepada kalian untuk bertakwa kepada Allah, mendengar dan taat sekalipun yang memimpin kalian adalah seorang hamba sahaya. Sesungguhnya barangsiapa di antara kalian yang hidup setelahku niscaya akan menyaksikan perselisihan yang sangat banyak; maka wajib atas kalian berpegang teguh pada sunnahku dan sunnah Khulafaur Rasyidin yang mendapat petunjuk, gigitlah ia erat-erat dengan gigi geraham kalian. Dan jauhilah perkara-perkara baru yang diada-adakan dalam agama, karena setiap perkara baru adalah bid'ah dan setiap bid'ah adalah kesesatan.\"",
    snippet:
      "Berpegang teguhlah pada sunnahku dan sunnah Khulafaur Rasyidin, gigitlah dengan gigi geraham. Dan jauhilah perkara baru yang diada-adakan karena setiap bid'ah adalah sesat.",
    narrator: "Al-Irbadh bin Sariyah radhiyallahu 'anhu",
    source: "HR. Abu Dawud no. 4607 dan At-Tirmidzi no. 2676",
    originalSources: [
      { book: "Sunan Abu Dawud", number: 4607 },
      { book: "Jami' At-Tirmidzi", number: 2676 },
    ],
    grade: "Hadits Shahih (At-Tirmidzi & Ibnu Hibban)",
    category: "Ilmu",
    lessons: [
      "Jalan keluar dan benteng keselamatan umat di masa fitnah perselisihan adalah kembali kepada petunjuk sunnah Nabi dan para sahabat.",
      "Kewajiban menjaga persatuan dengan mentaati kepemimpinan yang sah demi mencegah kekacauan sosial.",
      "Peringatan tegas terhadap bahaya penyimpangan bid'ah yang merusak kemurnian ajaran Islam.",
    ],
    text: "Aku wasiatkan kalian untuk bertakwa kepada Allah, mendengar dan taat... berpegang teguhlah pada sunnahku dan sunnah Khulafaur Rasyidin, gigitlah dengan gigi geraham.",
    matanSnippet: "Pegang teguh sunnah Nabi dan Khulafaur Rasyidin di tengah fitnah perselisihan.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-29",
    number: 29,
    title: "Kunci Masuk Surga dan Bahaya Menjaga Lidah",
    theme: "Pintu Kebaikan, Tiang Shalat, Puncak Jihad, dan Lidah Penentu Akhirat",
    arab: "عَنْ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللهُ عَنْهُ قَالَ: قُلْتُ: يَا رَسُولَ اللَّهِ، أَخْبِرْنِي بِعَمَلٍ يُدْخِلُنِي الجَنَّةَ وَيُبَاعِدُنِي عَنِ النَّارِ. قَالَ: «لَقَدْ سَأَلْتَ عَنْ عَظِيمٍ، وَإِنَّهُ لَيَسِيرٌ عَلَى مَنْ يَسَّرَهُ اللَّهُ تَعَالَى عَلَيْهِ: تَعْبُدُ اللَّهَ لاَ تُشْرِكُ بِهِ شَيْئاً، وَتُقِيمُ الصَّلاَةَ، وَتُؤْتِي الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ البَيْتَ». ثُمَّ قَالَ: «أَلاَ أَدُلُّكَ عَلَى أَبْوَابِ الخَيْرِ؟ الصَّوْمُ جُنَّةٌ، وَالصَّدَقَةُ تُطْفِئُ الخَطِيئَةَ كَمَا يُطْفِئُ المَاءُ النَّارَ، وَصَلاَةُ الرَّجُلِ فِي جَوْفِ اللَّيْلِ»، ثُمَّ تَلاَ: {تَتَجَافَى جُنُوبُهُمْ عَنِ الْمَضَاجِعِ} حَتَّى بَلَغَ {يَعْمَلُونَ}. ثُمَّ قَالَ: «أَلاَ أُخْبِرُكَ بِرَأْسِ الأَمْرِ وَعَمُودِهِ وَذِرْوَةِ سَنَامِهِ؟» قُلْتُ: بَلَى يَا رَسُولَ اللَّهِ. قَالَ: «رَأْسُ الأَمْرِ الإِسْلاَمُ، وَعَمُودُهُ الصَّلاَةُ، وَذِرْوَةُ سَنَامِهِ الجِهَادُ». ثُمَّ قَالَ: «أَلاَ أُخْبِرُكَ بِمِلاَكِ ذَلِكَ كُلِّهِ؟» فَقُلْتُ: بَلَى يَا رَسُولَ اللَّهِ. فَأَخَذَ بِلِسَانِهِ وَقَالَ: «كُفَّ عَلَيْكَ هَذَا». قُلْتُ: يَا نَبِيَّ اللَّهِ، وَإِنَّا لَمُؤَاخَذُونَ بِمَا نَتَكَلَّمُ بِهِ؟! فَقَالَ: «ثَكِلَتْكَ أُمُّكَ يَا مُعَاذُ! وَهَلْ يَكُبُّ النَّاسَ فِي النَّارِ عَلَى وُجُوهِهِمْ - أَوْ قَالَ: عَلَى مَنَاخِرِهِمْ - إِلاَّ حَصَائِدُ أَلْسِنَتِهِمْ؟!»",
    translation:
      "Dari Mu'adz bin Jabal radhiyallahu 'anhu, ia berkata: Aku berkata: \"Wahai Rasulullah, kabarkanlah kepadaku amalan yang memasukkanku ke surga dan menjauhkanku dari neraka.\" Beliau bersabda: \"Sungguh engkau telah menanyakan perkara yang agung, namun sangat mudah bagi orang yang dimudahkan oleh Allah: Engkau beribadah kepada Allah tanpa menyekutukan-Nya, mendirikan shalat, menunaikan zakat, berpuasa Ramadhan, dan haji ke Baitullah.\" Kemudian beliau bersabda: \"Maukah kutunjukkan kepadamu pintu-pintu kebaikan? Puasa adalah perisai, sedekah memadamkan dosa laksana air memadamkan api, dan shalat seseorang di tengah malam.\" Kemudian beliau bersabda: \"Maukah kuberitahu pokok segala urusan, tiangnya, dan puncaknya? Pokok urusan adalah Islam, tiangnya adalah shalat, dan puncaknya adalah jihad.\" Kemudian beliau memegang lidahnya seraya bersabda: \"Tahanlah ini!\" Aku bertanya: \"Wahai Nabi Allah, apakah kita disiksa karena apa yang kita bicarakan?!\" Beliau bersabda: \"Ibumu kehilanganmu wahai Mu'adz! Bukankah manusia ditelungkupkan ke neraka di atas wajah-wajah mereka melainkan karena buah petikan lisan-lisan mereka?!\"",
    snippet:
      "Pokok urusan adalah Islam, tiangnya shalat, puncaknya jihad. Dan kunci penjaga semuanya adalah menjaga lisan dari dosa ucapan.",
    narrator: "Mu'adz bin Jabal radhiyallahu 'anhu",
    source: "HR. At-Tirmidzi no. 2616",
    originalSources: [{ book: "Jami' At-Tirmidzi", number: 2616 }],
    grade: "Hasan Shahih menurut At-Tirmidzi",
    category: "Ibadah",
    lessons: [
      "Kedudukan agung shalat malam (qiyamul lail) dan sedekah dalam menggugurkan dosa.",
      "Bahaya lisan yang tidak terjaga adalah penyebab terbanyak manusia terjerumus ke dalam api neraka.",
      "Menjaga ucapan merupakan pengendali utama keberkahan seluruh rangkaian ibadah anggota badan.",
    ],
    text: "Pokok segala perkara adalah Islam, tiangnya adalah shalat, dan puncak tertingginya adalah jihad... tahanlah lidahmu ini, karena manusia ditelungkupkan ke neraka akibat ucapan lisannya.",
    matanSnippet: "Bahaya ucapan lisan dan pentingnya menjaga lidah sebagai pengendali amal.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-30",
    number: 30,
    title: "Batasan-Batasan yang Ditetapkan Allah",
    theme: "Menunaikan Fardhu, Menjaga Batas Hukum, dan Rahmat dalam Perkara yang Didiamkan",
    arab: "عَنْ أَبِي ثَعْلَبَةَ الخُشَنِيِّ جُرْثُومِ بْنِ نَاشِرٍ رَضِيَ اللهُ عَنْهُ، عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إِنَّ اللَّهَ تَعَالَى فَرَضَ فَرَائِضَ فَلاَ تُضَيِّعُوهَا، وَحَدَّ حُدُوداً فَلاَ تَعْتَدُوهَا، وَحَرَّمَ أَشْيَاءَ فَلاَ تَنْتَهِكُوهَا، وَسَكَتَ عَنْ أَشْيَاءَ رَحْمَةً لَكُمْ غَيْرَ نِسْيَانٍ فَلاَ تَبْحَثُوا عَنْهَا»",
    translation:
      "Dari Abu Tsa'labah Al-Khusyani Jurtsum bin Nasyir radhiyallahu 'anhu, dari Rasulullah shallallahu 'alaihi wa sallam, beliau bersabda: \"Sesungguhnya Allah Ta'ala telah mewajibkan kewajiban-kewajiban fardhu maka janganlah kalian menyia-nyiakannya, telah menetapkan batasan-batasan hukum maka jangan kalian langgar, telah mengharamkan beberapa perkara maka jangan kalian terobos, dan Dia mendiamkan perkara-perkara tertentu sebagai bentuk rahmat kasih sayang bagi kalian tanpa lupa maka janganlah kalian bersusah-susah mencarinya.\"",
    snippet:
      "Allah menetapkan kewajiban maka jangan disia-siakan, menentukan batasan maka jangan dilanggar, mengharamkan perkara maka jangan diterobos, dan mendiamkan perkara sebagai rahmat.",
    narrator: "Abu Tsa'labah Al-Khusyani radhiyallahu 'anhu",
    source: "HR. Ad-Daraquthni no. 4393 dan Al-Baihaqi",
    originalSources: [
      { book: "Sunan Ad-Daraquthni", number: 4393 },
      { book: "As-Sunan Al-Kubra Al-Baihaqi", number: 20217 },
    ],
    grade: "Hadits Hasan (Imam An-Nawawi)",
    category: "Ibadah",
    lessons: [
      "Hukum syariat terbagi menjadi empat: yang difardhukan, yang dibatasi, yang diharamkan, dan yang dimaafkan (afw).",
      "Perkara yang tidak dijelaskan pengharamannya oleh nash hukum asalnya adalah boleh dan merupakan kelapangan bagi manusia.",
      "Larangan bersikap memberatkan diri (ghuluw dan takalluf) dalam urusan yang telah diringankan oleh Allah.",
    ],
    text: "Sesungguhnya Allah mewajibkan kewajiban fardhu maka jangan disia-siakan, menentukan batasan jangan dilanggar, mengharamkan perkara jangan diterobos, dan mendiamkan perkara sebagai rahmat.",
    matanSnippet: "Kewajiban fardhu, batasan hukum, dan rahmat kemudahan syariat.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-31",
    number: 31,
    title: "Hakikat Zuhud Menggapai Cinta Allah dan Manusia",
    theme: "Zuhud terhadap Duniawi dan Lepas dari Mengharap Harta di Tangan Sesama",
    arab: "عَنْ أَبِي العَبَّاسِ سَهْلِ بْنِ سَعْدٍ السَّاعِدِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: جَاءَ رَجُلٌ إِلَى النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: يَا رَسُولَ اللَّهِ، دُلَّنِي عَلَى عَمَلٍ إِذَا عَمِلْتُهُ أَحَبَّنِي اللَّهُ وَأَحَبَّنِي النَّاسُ. فَقَالَ: «ازْهَدْ فِي الدُّنْيَا يُحِبَّكَ اللَّهُ، وَازْهَدْ فِيمَا فِي أَيْدِي النَّاسِ يُحِبَّكَ النَّاسُ»",
    translation:
      "Dari Abul Abbas Sahl bin Sa'd As-Sa'idi radhiyallahu 'anhu, ia berkata: Datang seorang laki-laki kepada Nabi shallallahu 'alaihi wa sallam seraya berkata: \"Wahai Rasulullah, tunjukkanlah kepadaku suatu amalan yang apabila aku mengerjakannya niscaya aku dicintai oleh Allah dan dicintai oleh manusia.\" Beliau bersabda: \"Zuhudlah terhadap dunia niscaya Allah mencintaimu, dan zuhudlah terhadap apa yang ada di tangan manusia niscaya manusia mencintaimu.\"",
    snippet:
      "Zuhudlah terhadap dunia niscaya Allah mencintaimu, dan zuhudlah terhadap apa yang ada di tangan manusia niscaya manusia mencintaimu.",
    narrator: "Sahl bin Sa'd As-Sa'idi radhiyallahu 'anhu",
    source: "HR. Ibnu Majah no. 4102",
    originalSources: [{ book: "Sunan Ibnu Majah", number: 4102 }],
    grade: "Hadits Hasan (An-Nawawi & Ibnu Hajar)",
    category: "Akhlak",
    lessons: [
      "Hakikat zuhud sejati adalah tidak menaruh kecintaan dunia di dalam hati, bukan meninggalkan ikhtiar mencari rezeki.",
      "Menjaga harga diri ('iffah) dari meminta-minta dan tamak pada harta kepemilikan orang lain mendatangkan kehormatan di mata masyarakat.",
      "Kunci kebahagiaan hati bermula dari rasa qana'ah dan ridha terhadap pemberian Allah Ta'ala.",
    ],
    text: "Zuhudlah terhadap dunia niscaya Allah mencintaimu, dan zuhudlah terhadap apa yang ada di tangan manusia niscaya manusia mencintaimu.",
    matanSnippet: "Zuhud terhadap dunia mengundang cinta Allah, zuhud pada milik orang mengundang simpati manusia.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-32",
    number: 32,
    title: "Larangan Menimbulkan dan Membalas Bahaya",
    theme: "Kaidah Akbar Fiqih Islam Menghilangkan Segala Kemudharatan",
    arab: "عَنْ أَبِي سَعِيدٍ سَعْدِ بْنِ مَالِكِ بْنِ سِنَانٍ الخُدْرِيِّ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لاَ ضَرَرَ وَلاَ ضِرَارَ»",
    translation:
      "Dari Abu Sa'id Sa'd bin Malik bin Sinan Al-Khudri radhiyallahu 'anhu, bahwasanya Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Tidak boleh menimbulkan bahaya (pada diri sendiri maupun orang lain) dan tidak boleh membalas bahaya dengan bahaya serupa.\"",
    snippet:
      "Tidak boleh menimbulkan bahaya dan tidak boleh membalas bahaya dengan bahaya yang sepadan (La dharara wa la dhirar).",
    narrator: "Abu Sa'id Al-Khudri radhiyallahu 'anhu",
    source: "HR. Ibnu Majah no. 2340 dan Ad-Daraquthni no. 4540",
    originalSources: [
      { book: "Sunan Ibnu Majah", number: 2340 },
      { book: "Sunan Ad-Daraquthni", number: 4540 },
      { book: "Al-Muwatta Malik", number: 1435 },
    ],
    grade: "Hadits Hasan (Didukung Banyak Jalur Sanad)",
    category: "Muamalah",
    lessons: [
      "Merupakan salah satu dari 5 Kaidah Asasi Fiqih Islam (Adh-Dhararu Yuzal - Kemudharatan harus dilenyapkan).",
      "Segala bentuk perbuatan yang merusak lingkungan, kesehatan, keselamatan umum, atau menipu transaksi diharamkan secara syar'i.",
      "Larangan melakukan tindakan balas dendam destruktif di luar koridor keadilan hukum yang sah.",
    ],
    text: "Tidak boleh menimbulkan bahaya dan tidak boleh membalas bahaya dengan bahaya.",
    matanSnippet: "Kaidah asasi: Haram mendatangkan bahaya dan haram membalas bahaya secara membabi-buta.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-33",
    number: 33,
    title: "Beban Pembuktian Penuduh dan Sumpah yang Mengingkari",
    theme: "Prinsip Keadilan Hukum Acara Peradilan Islam dan Praduga Tak Bersalah",
    arab: "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لَوْ يُعْطَى النَّاسُ بِدَعْوَاهُمْ، لاَدَّعَى رِجَالٌ أَمْوَالَ قَوْمٍ وَدِمَاءَهُمْ، لَكِنِ البَيِّنَةُ عَلَى المُدَّعِي، وَاليَمِينُ عَلَى مَنْ أَنْكَرَ»",
    translation:
      "Dari Ibnu Abbas radhiyallahu 'anhuma, bahwasanya Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Seandainya setiap manusia diberikan apa yang mereka klaim begitu saja, niscaya orang-orang akan menuntut harta dan darah suatu kaum. Akan tetapi, beban pembuktian (bayyinah) wajib atas penuduh/penggugat, dan sumpah dibebankan atas orang yang mengingkari gugatan/tergugat.\"",
    snippet:
      "Beban bukti ada pada penuduh, dan sumpah ada pada yang mengingkari klaim tuduhan.",
    narrator: "Abdullah bin Abbas radhiyallahu 'anhuma",
    source: "HR. Al-Baihaqi no. 20921 dan sebagian di Bukhari & Muslim",
    originalSources: [
      { book: "As-Sunan Al-Kubra Al-Baihaqi", number: 20921 },
      { book: "Shahih Al-Bukhari", number: 4552 },
      { book: "Shahih Muslim", number: 1711 },
    ],
    grade: "Hadits Hasan Shahih",
    category: "Muamalah",
    lessons: [
      "Prinsip dasar praduga tak bersalah: status seseorang bebas dari tuntutan sampai terbukti dengan dalil sah di depan hakim.",
      "Perlindungan tatanan sosial dari fitnah, tuduhan palsu, dan perebutan harta batil.",
      "Sumpah dengan nama Allah menjadi penutup perkara bagi tergugat yang tidak memiliki bukti lain.",
    ],
    text: "Seandainya setiap orang dikabulkan klaimnya, niscaya ada orang yang mengklaim darah dan harta kaum lain. Namun bukti wajib atas penggugat dan sumpah bagi yang mengingkari.",
    matanSnippet: "Kaidah peradilan: Bukti wajib bagi penuduh dan sumpah bagi yang mengingkari.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-34",
    number: 34,
    title: "Tingkatan Mengubah Kemungkaran",
    theme: "Amar Ma'ruf Nahi Munkar dengan Tangan Kekuasaan, Lisan Nasihat, dan Penolakan Hati",
    arab: "عَنْ أَبِي سَعِيدٍ الخُدْرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «مَنْ رَأَى مِنْكُمْ مُنْكَراً فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الإِيمَانِ»",
    translation:
      "Dari Abu Sa'id Al-Khudri radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Barangsiapa di antara kalian melihat suatu kemungkaran, hendaklah ia mengubahnya dengan tangannya (kekuasaan/tindakan nyata); jika ia tidak mampu maka dengan lisannya (nasihat/teguran); dan jika ia tidak mampu maka dengan hatinya (membenci dan menolak kemungkaran tersebut), dan itulah selemah-lemah iman.\"",
    snippet:
      "Siapa melihat kemungkaran ubahlah dengan tangannya; jika tak mampu dengan lisannya; jika tak mampu dengan hatinya, dan itu selemah-lemah iman.",
    narrator: "Abu Sa'id Al-Khudri radhiyallahu 'anhu",
    source: "HR. Muslim no. 49",
    originalSources: [{ book: "Shahih Muslim", number: 49 }],
    grade: "Shahih Muslim",
    category: "Akhlak",
    lessons: [
      "Mengubah dengan tangan adalah wewenang pihak berwenang, aparat pemerintah, atau kepala keluarga dalam rumah tangganya.",
      "Mengubah dengan lisan merupakan tugas para ulama, pendakwah, dan pemberi nasihat secara hikmah dan bijaksana.",
      "Mengingkari dengan hati adalah kewajiban mutlak setiap muslim yang tidak gugur dalam keadaan apa pun.",
    ],
    text: "Barangsiapa di antara kalian melihat kemungkaran, hendaklah ia mengubahnya dengan tangannya; jika tidak mampu maka dengan lisannya; jika tidak mampu maka dengan hatinya, dan itu adalah selemah-lemah iman.",
    matanSnippet: "Tiga tingkatan mengubah kemungkaran: wewenang tangan, lisan nasihat, dan ingkar batin.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-35",
    number: 35,
    title: "Persaudaraan Islam dan Larangan Mendzalimi",
    theme: "Ukhuwah Islamiyah, Haramnya Hasad, Membenci, Meremehkan, dan Mengambil Hak Saudara",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لاَ تَحَاسَدُوا، وَلاَ تَنَاجَشُوا، وَلاَ تَبَاغَضُوا، وَلاَ تَدَابَرُوا، وَلاَ يَبِعْ بَعْضُكُمْ عَلَى بَيْعِ بَعْضٍ، وَكُونُوا عِبَادَ اللَّهِ إِخْوَاناً. المُسْلِمُ أَخُو المُسْلِمِ: لاَ يَظْلِمُهُ، وَلاَ يَخْذُلُهُ، وَلاَ يَكْذِبُهُ، وَلاَ يَحْقِرُهُ. التَّقْوَى هَاهُنَا - وَيُشِيرُ إِلَى صَدْرِهِ ثَلاَثَ مَرَّاتٍ - بِحَسْبِ امْرِئٍ مِنَ الشَّرِّ أَنْ يَحْقِرَ أَخَاهُ المُسْلِمَ، كُلُّ المُسْلِمِ عَلَى المُسْلِمِ حَرَامٌ: دَمُهُ، وَمَالُهُ، وَعِرْضُهُ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Janganlah kalian saling mendengki, jangan saling menaikkan tawaran palsu (najasy), jangan saling membenci, jangan saling membelakangi (memutus silaturahmi), dan janganlah sebagian kalian menjual di atas akad penjualan orang lain; dan jadilah kalian hamba-hamba Allah yang bersaudara. Seorang muslim adalah saudara bagi muslim lainnya: ia tidak boleh menzhaliminya, tidak membiarkannya terlantar, tidak mendustainya, dan tidak meremehkannya. Ketakwaan itu letaknya di sini—beliau menunjuk ke dadanya tiga kali. Cukuplah seseorang dianggap melakukan kejahatan jika ia meremehkan saudaranya sesama muslim. Setiap muslim atas muslim lainnya haram: darahnya, hartanya, dan kehormatannya.\"",
    snippet:
      "Jangan saling hasad, jangan saling membenci, dan jadilah hamba Allah yang bersaudara. Setiap muslim atas muslim lainnya haram darahnya, hartanya, dan kehormatannya.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Muslim no. 2564",
    originalSources: [{ book: "Shahih Muslim", number: 2564 }],
    grade: "Shahih Muslim",
    category: "Akhlak",
    lessons: [
      "Haram berbuat hasad (dengki), manipulasi harga perniagaan (najasy), serta memutus hubungan persaudaraan.",
      "Takwa berpusat di dalam hati nurani yang dibuktikan dengan kesantunan menghargai martabat setiap manusia.",
      "Kehormatan darah, harta, dan reputasi nama baik sesama muslim terlindungi suci dalam hukum Islam.",
    ],
    text: "Jangan saling mendengki, jangan menipu jual-beli, jangan saling membenci... Muslim adalah saudara muslim lainnya, haram darah, harta, dan kehormatannya.",
    matanSnippet: "Pondasi persaudaraan Islam dan larangan hasad, meremehkan, serta merampas hak sesama.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-36",
    number: 36,
    title: "Melapangkan Kesulitan Saudara dan Kemuliaan Majelis Ilmu",
    theme: "Balasan Kebaikan Sejenis Amalan, Pertolongan Allah, Menuntut Ilmu, dan Naungan Sakinah",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ القِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ يَسَّرَ اللَّهُ عَلَيْهِ فِي الدُّنْيَا وَالآخِرَةِ، وَمَنْ سَتَرَ مُسْلِماً سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالآخِرَةِ، وَاللَّهُ فِي عَوْنِ العَبْدِ مَا كَانَ العَبْدُ فِي عَوْنِ أَخِيهِ. وَمَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الجَنَّةِ، وَمَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللَّهِ يَتْلُونَ كِتَابَ اللَّهِ وَيَتَدَارَسُونَهُ بَيْنَهُمْ إِلاَّ نَزَلَتْ عَلَيْهِمُ السَّكِينَةُ، وَغَشِيَتْهُمُ الرَّحْمَةُ، وَحَفَّتْهُمُ المَلاَئِكَةُ، وَذَكَرَهُمُ اللَّهُ فِيمَنْ عِنْدَهُ، وَمَنْ بَطَّأَ بِهِ عَمَلُهُ لَمْ يُسْرِعْ بِهِ نَسَبُهُ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, dari Nabi shallallahu 'alaihi wa sallam, beliau bersabda: \"Barangsiapa melapangkan dari seorang mukmin satu kesulitan dunia, niscaya Allah melapangkan darinya satu kesulitan di hari kiamat. Barangsiapa memudahkan orang yang sedang kesulitan (hutang/beban), niscaya Allah memudahkan urusannya di dunia dan akhirat. Barangsiapa menutupi aib seorang muslim, niscaya Allah menutupi aibnya di dunia dan akhirat. Allah senantiasa menolong hamba-Nya selama hamba tersebut menolong saudaranya. Barangsiapa menempuh suatu jalan untuk mencari ilmu, niscaya Allah memudahkan baginya jalan menuju surga. Tidaklah suatu kaum berkumpul di salah satu rumah Allah membaca Kitabullah dan saling mempelajarinya di antara mereka, melainkan ketenangan (sakinah) akan turun kepada mereka, rahmat melimpahi mereka, malaikat menaungi mereka, dan Allah menyebut-nyebut mereka di hadapan makhluk di sisi-Nya. Dan barangsiapa yang lambat karena amalnya, nasab keturunannya tidak akan mampu mempercepatnya.\"",
    snippet:
      "Siapa melapangkan kesulitan saudaranya, Allah lapangkan kesulitannya di hari kiamat. Siapa menempuh jalan mencari ilmu, Allah mudahkan jalannya menuju surga.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Muslim no. 2699",
    originalSources: [{ book: "Shahih Muslim", number: 2699 }],
    grade: "Shahih Muslim",
    category: "Ilmu",
    lessons: [
      "Kaidah balasan setimpal (al-jaza' min jinsil 'amal): menolong dan menutupi aib sesama akan dibalas pertolongan berlipat dari Allah.",
      "Kemuliaan agung majelis ta'lim dan tadarus Al-Qur'an yang diliputi sakinah, rahmat, dan doa para malaikat.",
      "Kemuliaan seseorang ditentukan oleh ketakwaan dan amal shalihnya, bukan oleh status garis keturunan atau kebangsawanan.",
    ],
    text: "Barangsiapa melapangkan kesulitan seorang mukmin di dunia, Allah akan melapangkan kesulitannya di hari kiamat... dan barangsiapa menempuh jalan untuk menuntut ilmu, Allah mudahkan jalannya ke surga.",
    matanSnippet: "Melapangkan beban sesama, menuntut ilmu surga, dan keberkahan majelis Al-Qur'an.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-37",
    number: 37,
    title: "Rahmat Allah dalam Pencatatan Amal Kebaikan dan Keburukan",
    theme: "Keadilan dan Kemurahan Allah: Kebaikan Dilipatgandakan dan Dosa Dicatat Seimbang",
    arab: "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللهُ عَنْهُمَا، عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فِيمَا يَرْوِيهِ عَنْ رَبِّهِ تَبَارَكَ وَتَعَالَى قَالَ: «إِنَّ اللَّهَ كَتَبَ الحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ: فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ إِلَى أَضْعَافٍ كَثِيرَةٍ. وَإِنْ هَمَّ بِسَيِّئَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ سَيِّئَةً وَاحِدَةً»",
    translation:
      "Dari Ibnu Abbas radhiyallahu 'anhuma, dari Rasulullah shallallahu 'alaihi wa sallam meriwayatkan firman Allah Tabaraka wa Ta'ala: \"Sesungguhnya Allah telah menetapkan kebaikan-kebaikan dan keburukan-keburukan, kemudian Dia menjelaskannya: Barangsiapa berniat melakukan satu kebaikan lalu ia tidak sempat mengerjakannya, Allah mencatat di sisi-Nya sebagai satu kebaikan sempurna. Jika ia berniat melakukannya lalu mengerjakannya, Allah mencatat di sisi-Nya sepuluh kebaikan hingga tujuh ratus kali lipat bahkan kelipatan yang sangat banyak. Dan jika ia berniat melakukan satu keburukan lalu mengurungkannya (karena Allah), Allah mencatat di sisi-Nya sebagai satu kebaikan sempurna. Namun jika ia berniat melakukannya lalu mengerjakannya, Allah hanya mencatatnya sebagai satu keburukan saja.\"",
    snippet:
      "Niat baik yang tak sempat diamalkan dicatat 1 kebaikan; jika diamalkan dicatat 10 hingga 700 kali lipat. Niat buruk yang diurungkan dicatat kebaikan, dan jika dikerjakan hanya dicatat 1 dosa.",
    narrator: "Abdullah bin Abbas radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 6491 dan Muslim no. 131",
    originalSources: [
      { book: "Shahih Al-Bukhari", number: 6491 },
      { book: "Shahih Muslim", number: 131 },
    ],
    grade: "Shahih Muttafaq 'Alaih",
    category: "Iman",
    lessons: [
      "Luasnya rahmat kasih sayang Allah mendahului murka-Nya terhadap para hamba.",
      "Kemuliaan niat tulus (al-hammu bil hasanah) yang telah diganjar pahala sebelum amalan fisik terwujud.",
      "Keadilan sempurna Allah yang tidak melipatgandakan hukuman satu dosa lebih dari kadar perbuatannya.",
    ],
    text: "Sesungguhnya Allah mencatat kebaikan dan keburukan: Barangsiapa berniat kebaikan lalu tidak mengerjakannya, dicatat satu kebaikan penuh... dan jika berniat keburukan lalu mengerjakannya, hanya dicatat satu dosa.",
    matanSnippet: "Pelipatgandaan pahala kebaikan dan keadilan mutlak pencatatan dosa.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-38",
    number: 38,
    title: "Wali Allah dan Cinta Ilahi Melalui Amalan Sunnah (Hadits Qudsi)",
    theme: "Mendekatkan Diri Melalui Amalan Wajib dan Sunnah Nawafil Hingga Meraih Bimbingan Ilahi",
    arab: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «إِنَّ اللَّهَ تَعَالَى قَالَ: مَنْ عَادَى لِي وَلِيّاً فَقَدْ آذَنْتُهُ بِالحَرْبِ، وَمَا تَقَرَّبَ إِلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إِلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وَمَا يَزَالُ عَبْدِي يَتَقَرَّبُ إِلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ، فَإِذَا أَحْبَبْتُهُ كُنْتُ سَمْعَهُ الَّذِي يَسْمَعُ بِهِ، وَبَصَرَهُ الَّذِي يُبْصِرُ بِهِ، وَيَدَهُ الَّتِي يَبْطِشُ بِهَا، وَرِجْلَهُ الَّتِي يَمْشِي بِهَا، وَإِنْ سَأَلَنِي لأُعْطِيَنَّهُ، وَلَئِنِ اسْتَعَاذَنِي لأُعِيذَنَّهُ»",
    translation:
      "Dari Abu Hurairah radhiyallahu 'anhu, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya Allah Ta'ala berfirman: 'Barangsiapa memusuhi wali-Ku, sungguh Aku telah menyatakan perang kepadanya. Tidaklah hamba-Ku mendekatkan diri kepada-Ku dengan sesuatu yang lebih Kucintai daripada apa yang telah Ku-wajibkan atasnya. Dan hamba-Ku senantiasa mendekatkan diri kepada-Ku dengan amalan-amalan sunnah (nawafil) hingga Aku mencintainya. Maka apabila Aku telah mencintainya, jadilah Aku pendengarannya yang ia gunakan untuk mendengar, penglihatannya yang ia gunakan untuk melihat, tangannya yang ia gunakan untuk memegang, dan kakinya yang ia gunakan untuk melangkah. Jika ia memohon kepada-Ku pasti Kuberi, dan jika ia memohon perlindungan kepada-Ku pasti Kulindungi.'\"",
    snippet:
      "Siapa memusuhi wali-Ku, Aku nyatakan perang padanya. Hamba-Ku senantiasa mendekat dengan amalan sunnah hingga Aku mencintainya; bila meminta pasti Kuberi, bila memohon perlindungan pasti Kulindungi.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 6502",
    originalSources: [{ book: "Shahih Al-Bukhari", number: 6502 }],
    grade: "Shahih Bukhari",
    category: "Ibadah",
    lessons: [
      "Peringatan keras bagi siapa saja yang memusuhi, menyakiti, atau merendahkan para wali Allah dan orang-orang shalih.",
      "Kewajiban memprioritaskan amalan fardhu sebelum memperbanyak amalan sunnah tambahan.",
      "Buah kecintaan Allah kepada hamba: perlindungan taufik pada seluruh anggota badannya dan doa yang mustajab.",
    ],
    text: "Barangsiapa memusuhi wali-Ku sungguh Aku nyatakan perang padanya... Hamba-Ku senantiasa mendekat dengan amalan sunnah hingga Aku mencintainya. Jika meminta pasti Kuberi.",
    matanSnippet: "Kecintaan Allah kepada hamba yang tekun mengamalkan ibadah fardhu dan sunnah.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-39",
    number: 39,
    title: "Diampuninya Kekeliruan, Lupa, dan Pemaksaan",
    theme: "Kasih Sayang Syariat: Gugurnya Dosa atas Tindakan Khilaf, Lupa, dan Terpaksa",
    arab: "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إِنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي الخَطَأَ وَالنِّسْيَانَ وَمَا اسْتُكْرِهُوا عَلَيْهِ»",
    translation:
      "Dari Ibnu Abbas radhiyallahu 'anhuma, bahwasanya Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya Allah telah memaafkan untukku dari umatku: kesalahan yang tidak disengaja (kekhilafan), kelupaan, dan apa-apa yang dipaksakan kepada mereka atasnya.\"",
    snippet:
      "Sesungguhnya Allah memaafkan dari umatku: kekhilafan (tanpa sengaja), lupa, dan perbuatan karena dipaksa.",
    narrator: "Abdullah bin Abbas radhiyallahu 'anhuma",
    source: "HR. Ibnu Majah no. 2045 dan Al-Baihaqi",
    originalSources: [
      { book: "Sunan Ibnu Majah", number: 2045 },
      { book: "As-Sunan Al-Kubra Al-Baihaqi", number: 15088 },
    ],
    grade: "Hadits Hasan (Imam An-Nawawi)",
    category: "Ibadah",
    lessons: [
      "Prinsip kemudahan syariat: tidak ada dosa (taklif diangkat) atas perbuatan yang dilakukan murni karena kelupaan atau kekhilafan.",
      "Perbuatan di bawah intimidasi paksaan berat tidak dihukum dosa selama hati tetap teguh dalam keimanan.",
      "Namun kewajiban ganti rugi materi hak sesama (dhaman) tetap diperhitungkan secara adil sesuai ketetapan fiqih.",
    ],
    text: "Sesungguhnya Allah telah memaafkan dari umatku kesalahan yang tidak disengaja, kelupaan, dan apa yang dipaksakan kepada mereka.",
    matanSnippet: "Gugurnya dosa atas kekhilafan, kelupaan, dan pemaksaan yang tidak disengaja.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-40",
    number: 40,
    title: "Menjadi Pengembara Asing di Dunia Fana",
    theme: "Hakikat Dunia yang Sementara dan Wasiat Memanfaatkan Waktu Sehat Sebelum Datang Sakit",
    arab: "عَنِ ابْنِ عُمَرَ رَضِيَ اللهُ عَنْهُمَا قَالَ: أَخَذَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ بِمَنْكِبَيَّ فَقَالَ: «كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ». وَكَانَ ابْنُ عُمَرَ رَضِيَ اللهُ عَنْهُمَا يَقُولُ: «إِذَا أَمْسَيْتَ فَلاَ تَنْتَظِرِ الصَّبَاحَ، وَإِذَا أَصْبَحْتَ فَلاَ تَنْتَظِرِ المَسَاءَ، وَخُذْ مِنْ صِحَّتِكَ لِمَرَضِكَ، وَمِنْ حَيَاتِكَ لِمَوْتِكَ»",
    translation:
      "Dari Ibnu Umar radhiyallahu 'anhuma, ia berkata: Rasulullah shallallahu 'alaihi wa sallam memegang kedua pundakku seraya bersabda: \"Jadilah engkau di dunia ini seakan-akan orang asing atau seorang pengembara yang sekadar melintasi jalan.\" Dan Ibnu Umar sering berkata: \"Apabila engkau berada di waktu sore maka janganlah menanti waktu pagi, dan apabila engkau berada di waktu pagi maka janganlah menanti waktu sore. Manfaatkanlah masa sehatmu sebelum datang masa sakitmu, dan masa hidupmu sebelum datang kematianmu.\"",
    snippet:
      "Jadilah di dunia seakan orang asing atau pengembara yang melintas jalan. Manfaatkan waktu sehat sebelum sakit dan masa hidup sebelum ajal tiba.",
    narrator: "Abdullah bin Umar radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 6416",
    originalSources: [{ book: "Shahih Al-Bukhari", number: 6416 }],
    grade: "Shahih Bukhari",
    category: "Akhlak",
    lessons: [
      "Dunia adalah tempat persinggahan sementara untuk mengumpulkan bekal akhirat yang kekal abadi.",
      "Larangan menunda-nunda amal kebajikan (thulul amal) karena ajal dapat menjemput sewaktu-waktu.",
      "Memanfaatkan masa muda, kesehatan fisik, dan kelapangan rezeki untuk ketaatan kepada Allah.",
    ],
    text: "Jadilah engkau di dunia ini seakan-akan orang asing atau seorang pengembara. Bila di waktu sore jangan menanti pagi, bila di waktu pagi jangan menanti sore.",
    matanSnippet: "Dunia adalah tempat perlintasan; persiapkan bekal akhirat selagi sehat dan bernyawa.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-41",
    number: 41,
    title: "Menundukkan Hawa Nafsu Mengikuti Syariat Nabi",
    theme: "Kesempurnaan Iman Terwujud Ketika Kecenderungan Hati Tunduk pada Ajaran Wahyu",
    arab: "عَنْ أَبِي مُحَمَّدٍ عَبْدِ اللَّهِ بْنِ عَمْرِو بْنِ العَاصِ رَضِيَ اللهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يَكُونَ هَوَاهُ تَبَعاً لِمَا جِئْتُ بِهِ»",
    translation:
      "Dari Abu Muhammad Abdullah bin Amr bin Al-Ash radhiyallahu 'anhuma, ia berkata: Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Tidak sempurna iman salah seorang di antara kalian hingga hawa nafsunya tunduk mengikuti apa yang aku bawa (syariat wahyu Al-Qur'an dan Sunnah).\"",
    snippet:
      "Tidak beriman salah seorang di antara kalian hingga hawa nafsunya tunduk mengikuti petunjuk wahyu yang aku bawa.",
    narrator: "Abdullah bin Amr bin Al-Ash radhiyallahu 'anhuma",
    source: "HR. Al-Baghawi dalam Syarh As-Sunnah dan dinukil Ibnu Rajab",
    originalSources: [
      { book: "Syarh As-Sunnah Al-Baghawi", number: 104 },
      { book: "Kitab Al-Hujjah fi Bayan Al-Mahajjah", number: 104 },
    ],
    grade: "Hadits Hasan Shahih (Dikuatkan Imam An-Nawawi)",
    category: "Iman",
    lessons: [
      "Kewajiban mendahulukan syariat Allah dan Rasul-Nya di atas selera pribadi, adat, dan hawa nafsu.",
      "Tanda keikhlasan iman: merasa tenang dan ridha menerima seluruh ketetapan hukum Islam.",
      "Menundukkan kecenderungan hati agar senantiasa mencintai apa yang dicintai Allah dan membenci apa yang dimurkai-Nya.",
    ],
    text: "Tidak beriman salah seorang di antara kalian hingga hawa nafsunya tunduk mengikuti ajaran yang aku bawa.",
    matanSnippet: "Tundukkan hawa nafsu dan kecenderungan diri pada petunjuk syariat Nabi.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
  {
    id: "hadits-42",
    number: 42,
    title: "Luasnya Ampunan Allah bagi Orang yang Beristighfar (Hadits Qudsi)",
    theme: "Keluasan Pengampunan Ilahi Bagi yang Berdoa dan Tidak Menyekutukan-Nya dengan Suatu Apapun",
    arab: "عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «قَالَ اللَّهُ تَبَارَكَ وَتَعَالَى: يَا ابْنَ آدَمَ، إِنَّكَ مَا دَعَوْتَنِي وَرَجَوْتَنِي غَفَرْتُ لَكَ عَلَى مَا كَانَ فِيكَ وَلاَ أُبَالِي. يَا ابْنَ آدَمَ، لَوْ بَلَغَتْ ذُنُوبُكَ عَنَانَ السَّمَاءِ ثُمَّ اسْتَغْفَرْتَنِي غَفَرْتُ لَكَ وَلاَ أُبَالِي. يَا ابْنَ آدَمَ، إِنَّكَ لَوْ أَتَيْتَنِي بِقُرَابِ الأَرْضِ خَطَايَا ثُمَّ لَقِيتَنِي لاَ تُشْرِكُ بِي شَيْئاً لأَتَيْتُكَ بِقُرَابِهَا مَغْفِرَةً»",
    translation:
      "Dari Anas bin Malik radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Allah Tabaraka wa Ta'ala berfirman: 'Wahai anak Adam, sesungguhnya selama engkau berdoa kepada-Ku dan mengharapkan ampunan-Ku, Aku ampuni dosa-dosa yang ada padamu dan Aku tidak peduli. Wahai anak Adam, seandainya dosa-dosamu membubung setinggi awan di langit kemudian engkau memohon ampunan kepada-Ku, niscaya Aku ampuni dirimu dan Aku tidak peduli. Wahai anak Adam, sesungguhnya jika engkau datang kepada-Ku dengan membawa dosa sepenuh bumi lalu engkau menemui-Ku tanpa menyekutukan-Ku dengan sesuatu apa pun, niscaya Aku akan mendatangimu dengan ampunan sepenuh bumi pula.'\"",
    snippet:
      "Wahai anak Adam, seandainya dosamu setinggi langit lalu engkau memohon ampun, niscaya Aku ampuni. Jika engkau datang membawa dosa sepenuh bumi tanpa syirik, niscaya Kuberi ampunan sepenuh bumi pula.",
    narrator: "Anas bin Malik radhiyallahu 'anhu",
    source: "HR. At-Tirmidzi no. 3540",
    originalSources: [{ book: "Jami' At-Tirmidzi", number: 3540 }],
    grade: "Hasan Shahih menurut At-Tirmidzi",
    category: "Iman",
    lessons: [
      "Keagungan tauhid yang murni membebaskan hamba dari kekekalan di neraka dan mengundang maghfirah ampunan sepenuh bumi.",
      "Pintu taubat dan istighfar selalu terbuka luas bagi siapa pun yang bersungguh-sungguh kembali kepada Allah.",
      "Larangan berputus asa dari rahmat Allah betapa pun besarnya kesalahan masa lalu yang telah diperbuat.",
    ],
    text: "Wahai anak Adam, selama engkau berdoa dan berharap kepada-Ku, Aku ampuni dosa yang ada padamu... Jika engkau menemui-Ku tanpa berbuat syirik sedikit pun, niscaya Aku mendatangimu dengan ampunan sepenuh bumi.",
    matanSnippet: "Keluasan ampunan Allah bagi hamba yang bertauhid dan senantiasa beristighfar.",
    bookSlug: "arbain-nawawi",
    bookName: "Arba'in An-Nawawi",
  },
];

export const arbainHaditsList: ArbainHadits[] = arbainHaditsSource.map(
  (hadits) => ({
    ...hadits,
    text: hadits.translation,
  })
);

/** Ambil seluruh 42 Hadits Arba'in */
export function getAllArbainHadits(): ArbainHadits[] {
  return arbainHaditsList;
}

/** Cari hadits berdasarkan nomor 1-42 */
export function getArbainHaditsByNumber(no: number): ArbainHadits | undefined {
  return arbainHaditsList.find((h) => h.number === no);
}

/** Filter hadits berdasarkan kategori SIRAJ */
export function getArbainHaditsByCategory(category: string): ArbainHadits[] {
  if (!category || category === "Semua") return arbainHaditsList;
  return arbainHaditsList.filter(
    (h) => h.category.toLowerCase() === category.toLowerCase()
  );
}

/** Pencarian multifield (nomor, judul, tema, terjemahan, perawi, sumber) */
export function searchArbainHadits(
  keyword: string,
  category?: string | null
): ArbainHadits[] {
  let list = arbainHaditsList;

  if (category && category !== "Semua") {
    list = list.filter(
      (h) => h.category.toLowerCase() === category.toLowerCase()
    );
  }

  const q = keyword.trim().toLowerCase();
  if (!q) return list;

  // Jika input berupa angka murni (mis. "1", "42")
  const numQuery = parseInt(q, 10);
  if (!isNaN(numQuery) && String(numQuery) === q) {
    const exactNum = list.filter((h) => h.number === numQuery);
    if (exactNum.length > 0) return exactNum;
  }

  return list.filter((h) => {
    return (
      String(h.number).includes(q) ||
      h.title.toLowerCase().includes(q) ||
      h.theme.toLowerCase().includes(q) ||
      h.translation.toLowerCase().includes(q) ||
      h.narrator.toLowerCase().includes(q) ||
      h.source.toLowerCase().includes(q) ||
      h.grade.toLowerCase().includes(q) ||
      h.lessons.some((l) => l.toLowerCase().includes(q))
    );
  });
}
