export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const EXAM_QUESTION_COUNT = 40;

export const quizQuestions: QuizQuestion[] = [
  // ===================== AQIDAH (1 - 8) =====================
  {
    id: "q1",
    question: "Berapa jumlah Rukun Iman yang wajib diyakini oleh setiap Muslim?",
    options: ["4 perkara", "5 perkara", "6 perkara", "7 perkara"],
    correctAnswer: 2,
    explanation:
      "Rukun Iman berjumlah 6 perkara: Iman kepada Allah, Malaikat-Nya, Kitab-kitab-Nya, Rasul-rasul-Nya, Hari Akhir, serta Qada dan Qadar (HR. Muslim no. 8).",
    category: "Aqidah",
  },
  {
    id: "q2",
    question: "Siapa malaikat yang bertugas menyampaikan wahyu kepada para nabi dan rasul?",
    options: ["Malaikat Mikail", "Malaikat Israfil", "Malaikat Jibril", "Malaikat Izrail"],
    correctAnswer: 2,
    explanation:
      "Malaikat Jibril 'alaihissalam bertugas menyampaikan wahyu dari Allah Subhanahu wa Ta'ala kepada para nabi dan rasul (QS. Asy-Syu'ara: 192-193).",
    category: "Aqidah",
  },
  {
    id: "q3",
    question: "Kitab suci yang diturunkan Allah kepada Nabi Daud 'alaihissalam adalah...",
    options: ["Taurat", "Zabur", "Injil", "Al-Qur'an"],
    correctAnswer: 1,
    explanation:
      "Allah menurunkan kitab Zabur kepada Nabi Daud 'alaihissalam sebagaimana firman-Nya: 'Dan Kami berikan Zabur kepada Daud.' (QS. An-Nisa: 163).",
    category: "Aqidah",
  },
  {
    id: "q4",
    question: "Apa arti kalimat tauhid 'La ilaha illallah'?",
    options: [
      "Tidak ada tuhan yang berhak disembah selain Allah",
      "Allah Maha Mendengar lagi Maha Mengetahui",
      "Hanya kepada Allah tempat memohon rezeki",
      "Allah Maha Pencipta seluruh alam semesta",
    ],
    correctAnswer: 0,
    explanation:
      "'La ilaha illallah' (لا إله إلا الله) berarti tidak ada sesembahan yang berhak disembah dengan benar kecuali Allah semata.",
    category: "Aqidah",
  },
  {
    id: "q5",
    question: "Malaikat yang bertugas meniup sangkakala pada hari kiamat adalah...",
    options: ["Malaikat Malik", "Malaikat Ridwan", "Malaikat Israfil", "Malaikat Munkar"],
    correctAnswer: 2,
    explanation:
      "Malaikat Israfil bertugas meniup sangkakala (ash-shur) sebagai tanda berakhirnya kehidupan dunia dan kebangkitan makhluk.",
    category: "Aqidah",
  },
  {
    id: "q6",
    question: "Meyakini bahwa Allah Maha Esa dalam zat, sifat, dan perbuatan-Nya serta tidak menyekutukan-Nya disebut...",
    options: ["Tawakal", "Tauhid", "Tawadhu", "Tasamuh"],
    correctAnswer: 1,
    explanation:
      "Tauhid adalah mengesakan Allah dalam rububiyyah (penciptaan dan pengaturan), uluhiyyah (ibadah), serta asma wa shifat (nama dan sifat-Nya).",
    category: "Aqidah",
  },
  {
    id: "q7",
    question: "Berapa jumlah nabi dan rasul yang wajib diketahui namanya sebagaimana disebutkan dalam Al-Qur'an?",
    options: ["10 nabi dan rasul", "20 nabi dan rasul", "25 nabi dan rasul", "99 nabi dan rasul"],
    correctAnswer: 2,
    explanation:
      "Terdapat 25 nabi dan rasul yang disebutkan secara jelas namanya di dalam Al-Qur'an, dimulai dari Nabi Adam 'alaihissalam hingga Nabi Muhammad ﷺ.",
    category: "Aqidah",
  },
  {
    id: "q8",
    question: "Sifat wajib bagi para rasul yang berarti 'cerdas' dalam menyampaikan kebenaran adalah...",
    options: ["Shiddiq", "Amanah", "Tabligh", "Fathanah"],
    correctAnswer: 3,
    explanation:
      "Empat sifat wajib bagi rasul adalah Shiddiq (jujur), Amanah (dapat dipercaya), Tabligh (menyampaikan wahyu), dan Fathanah (cerdas/bijaksana).",
    category: "Aqidah",
  },

  // ===================== FIQIH (9 - 16) =====================
  {
    id: "q9",
    question: "Surah apa yang wajib dibaca pada setiap rakaat dalam shalat?",
    options: ["Surah Al-Ikhlas", "Surah Al-Fatihah", "Surah An-Nas", "Surah Al-Baqarah"],
    correctAnswer: 1,
    explanation:
      "Membaca Surah Al-Fatihah merupakan rukun shalat pada setiap rakaat. Rasulullah ﷺ bersabda: 'Tidak sah shalat bagi orang yang tidak membaca Al-Fatihah.' (HR. Bukhari & Muslim).",
    category: "Fiqih",
  },
  {
    id: "q10",
    question: "Berapa jumlah rakaat shalat fardhu Maghrib?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat", "1 rakaat"],
    correctAnswer: 1,
    explanation:
      "Shalat fardhu Maghrib terdiri dari 3 rakaat, dengan bacaan jahr (dikeraskan) pada dua rakaat pertama oleh imam.",
    category: "Fiqih",
  },
  {
    id: "q11",
    question: "Pada bulan apa umat Islam diwajibkan melaksanakan ibadah puasa fardhu?",
    options: ["Bulan Syawal", "Bulan Dzulhijjah", "Bulan Rajab", "Bulan Ramadhan"],
    correctAnswer: 3,
    explanation:
      "Puasa Ramadhan adalah rukun Islam keempat/kelima yang wajib dilaksanakan selama bulan Ramadhan (QS. Al-Baqarah: 183-185).",
    category: "Fiqih",
  },
  {
    id: "q12",
    question: "Berapa jumlah rakaat shalat fardhu Subuh?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"],
    correctAnswer: 0,
    explanation:
      "Shalat fardhu Subuh berjumlah 2 rakaat dan dikerjakan sejak terbit fajar shadiq hingga sebelum terbit matahari.",
    category: "Fiqih",
  },
  {
    id: "q13",
    question: "Apa yang digunakan untuk bersuci (tayamum) sebagai pengganti wudhu ketika tidak ada air?",
    options: ["Debu atau tanah yang suci", "Minyak zaitun murni", "Air mawar", "Daun bidara kering"],
    correctAnswer: 0,
    explanation:
      "Tayamum dilakukan dengan mengusap wajah dan kedua telapak tangan menggunakan debu/permukaan bumi yang suci ketika tidak mendapati air atau berhalangan memakai air (QS. An-Nisa: 43).",
    category: "Fiqih",
  },
  {
    id: "q14",
    question: "Zakat yang wajib dikeluarkan oleh setiap Muslim menjelang Hari Raya Idul Fitri disebut...",
    options: ["Zakat Maal", "Zakat Fitrah", "Zakat Profesi", "Zakat Rikaz"],
    correctAnswer: 1,
    explanation:
      "Zakat Fitrah wajib ditunaikan sebelum pelaksanaan shalat Idul Fitri sebagai penyuci bagi orang yang berpuasa dan makanan bagi orang miskin (HR. Abu Dawud).",
    category: "Fiqih",
  },
  {
    id: "q15",
    question: "Manakah di bawah ini yang termasuk hal yang membatalkan wudhu?",
    options: [
      "Berbicara ketika sedang berwudhu",
      "Tidur nyenyak hingga hilang kesadaran",
      "Minum air putih setelah berwudhu",
      "Memotong kuku dan rambut",
    ],
    correctAnswer: 1,
    explanation:
      "Tidur lelap yang membuat seseorang tidak menyadari keluarnya hadats termasuk perkara yang membatalkan wudhu.",
    category: "Fiqih",
  },
  {
    id: "q16",
    question: "Thawaf mengelilingi Ka'bah dalam ibadah haji dan umrah dilakukan sebanyak...",
    options: ["3 putaran", "5 putaran", "7 putaran", "9 putaran"],
    correctAnswer: 2,
    explanation:
      "Thawaf dilakukan dengan mengelilingi Ka'bah sebanyak 7 putaran dimulai dan diakhiri dari sejajar Hajar Aswad.",
    category: "Fiqih",
  },

  // ===================== AKHLAK (17 - 23) =====================
  {
    id: "q17",
    question: "Sifat terpuji dalam Islam yang berarti 'jujur' dalam perkataan dan perbuatan adalah...",
    options: ["Amanah", "Ash-Shidq", "Tabligh", "Kanaah"],
    correctAnswer: 1,
    explanation:
      "Ash-Shidq berarti kejujuran. Rasulullah ﷺ bersabda bahwa kejujuran menuntun kepada kebaikan, dan kebaikan menuntun ke surga (HR. Bukhari & Muslim).",
    category: "Akhlak",
  },
  {
    id: "q18",
    question: "Apa arti sikap 'husnuzan' dalam akhlak seorang Muslim?",
    options: ["Berbaik sangka", "Berburuk sangka", "Rendah hati", "Menerima apa adanya"],
    correctAnswer: 0,
    explanation:
      "Husnuzan adalah berbaik sangka, baik kepada ketetapan Allah maupun kepada sesama Muslim, sedangkan lawannya adalah su'uzan (berburuk sangka).",
    category: "Akhlak",
  },
  {
    id: "q19",
    question: "Menurut sabda Rasulullah ﷺ, tersenyum di hadapan saudara sesama Muslim bernilai sebagai...",
    options: ["Sedekah", "Kafarat sumpah", "Syarat sah ibadah", "Pengganti puasa sunnah"],
    correctAnswer: 0,
    explanation:
      "Rasulullah ﷺ bersabda: 'Senyummu di hadapan saudaramu adalah sedekah bagimu.' (HR. At-Tirmidzi no. 1956).",
    category: "Akhlak",
  },
  {
    id: "q20",
    question: "Sikap rendah hati dan tidak menyombongkan diri di hadapan manusia disebut...",
    options: ["Takabur", "Tawadhu'", "Tasamuh", "Ta'awun"],
    correctAnswer: 1,
    explanation:
      "Tawadhu' berarti rendah hati. Rasulullah ﷺ bersabda: 'Tidaklah seseorang bertawadhu' karena Allah melainkan Allah akan mengangkat derajatnya.' (HR. Muslim).",
    category: "Akhlak",
  },
  {
    id: "q21",
    question: "Sikap merasa cukup dan rela atas rezeki yang dikaruniakan Allah setelah berusaha disebut...",
    options: ["Qana'ah", "Istiqamah", "Syaja'ah", "Iffah"],
    correctAnswer: 0,
    explanation:
      "Qana'ah adalah kerelaan hati menerima pembagian rezeki dari Allah Subhanahu wa Ta'ala. Kekayaan sejati adalah kekayaan hati (HR. Bukhari & Muslim).",
    category: "Akhlak",
  },
  {
    id: "q22",
    question: "Membicarakan keburukan atau aib orang lain di belakangnya yang ia tidak sukai jika mendengarnya disebut...",
    options: ["Fitnah", "Ghibah", "Namimah", "Hasad"],
    correctAnswer: 1,
    explanation:
      "Ghibah adalah menyebut saudaramu dengan sesuatu yang tidak ia sukai di belakangnya (HR. Muslim no. 2589, QS. Al-Hujurat: 12).",
    category: "Akhlak",
  },
  {
    id: "q23",
    question: "Sikap tolong-menolong dalam kebaikan dan ketakwaan dalam istilah Islam disebut...",
    options: ["Ta'awun", "Tabayyun", "Tawakal", "Tafakur"],
    correctAnswer: 0,
    explanation:
      "Allah berfirman: 'Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan tolong-menolong dalam berbuat dosa dan permusuhan.' (QS. Al-Ma'idah: 2).",
    category: "Akhlak",
  },

  // ===================== SIRAH NABAWIYAH (24 - 30) =====================
  {
    id: "q24",
    question: "Apa gelar yang diberikan masyarakat Makkah kepada Nabi Muhammad ﷺ sebelum diangkat menjadi rasul karena kejujurannya?",
    options: ["Al-Faruq", "Al-Amin", "Dzun Nurain", "Asadullah"],
    correctAnswer: 1,
    explanation:
      "Nabi Muhammad ﷺ diberi gelar Al-Amin (yang dapat dipercaya) oleh penduduk Makkah karena kejujuran dan amanah beliau yang luar biasa.",
    category: "Sirah",
  },
  {
    id: "q25",
    question: "Di kota manakah Nabi Muhammad ﷺ dilahirkan?",
    options: ["Madinah", "Thaif", "Makkah", "Baitul Maqdis"],
    correctAnswer: 2,
    explanation:
      "Nabi Muhammad ﷺ lahir di kota Makkah pada hari Senin bulan Rabiul Awal pada Tahun Gajah (570 M).",
    category: "Sirah",
  },
  {
    id: "q26",
    question: "Siapakah nama istri pertama Rasulullah ﷺ yang juga merupakan orang pertama yang beriman kepada beliau?",
    options: [
      "Khadijah binti Khuwailid",
      "Aisyah binti Abu Bakar",
      "Hafshah binti Umar",
      "Zainab binti Jahsy",
    ],
    correctAnswer: 0,
    explanation:
      "Khadijah binti Khuwailid radhiyallahu 'anha adalah istri pertama Rasulullah ﷺ yang senantiasa mendukung perjuangan dakwah beliau dengan jiwa dan hartanya.",
    category: "Sirah",
  },
  {
    id: "q27",
    question: "Berapa lama Rasulullah ﷺ berdakwah di kota Makkah sebelum berhijrah ke Madinah?",
    options: ["8 tahun", "10 tahun", "13 tahun", "15 tahun"],
    correctAnswer: 2,
    explanation:
      "Rasulullah ﷺ berdakwah di Makkah selama 13 tahun, kemudian berdakwah di Madinah selama 10 tahun hingga wafat pada usia 63 tahun.",
    category: "Sirah",
  },
  {
    id: "q28",
    question: "Di tempat manakah Nabi Muhammad ﷺ menerima wahyu pertama melalui Malaikat Jibril?",
    options: ["Gua Tsur", "Gua Hira", "Bukit Shafa", "Lembah Badar"],
    correctAnswer: 1,
    explanation:
      "Wahyu pertama (QS. Al-'Alaq ayat 1-5) turun kepada Nabi Muhammad ﷺ ketika beliau sedang berkhalwat di Gua Hira, Jabal Nur.",
    category: "Sirah",
  },
  {
    id: "q29",
    question: "Siapakah sahabat mulia yang menemani Rasulullah ﷺ bersembunyi di Gua Tsur saat perjalanan hijrah ke Madinah?",
    options: [
      "Umar bin Khaththab",
      "Abu Bakar Ash-Shiddiq",
      "Utsman bin Affan",
      "Ali bin Abi Thalib",
    ],
    correctAnswer: 1,
    explanation:
      "Abu Bakar Ash-Shiddiq radhiyallahu 'anhu menemani Rasulullah ﷺ dalam perjalanan hijrah dan berada bersama beliau di Gua Tsur (QS. At-Taubah: 40).",
    category: "Sirah",
  },
  {
    id: "q30",
    question: "Masjid pertama yang dibangun oleh Rasulullah ﷺ ketika tiba di wilayah Madinah saat hijrah adalah...",
    options: ["Masjid Quba", "Masjid Qiblatain", "Masjidil Haram", "Masjid Al-Aqsha"],
    correctAnswer: 0,
    explanation:
      "Masjid Quba adalah masjid pertama yang dibangun oleh Rasulullah ﷺ atas dasar ketakwaan ketika beliau tiba di Quba sebelum memasuki pusat kota Madinah.",
    category: "Sirah",
  },

  // ===================== ADAB ISLAMI (31 - 36) =====================
  {
    id: "q31",
    question: "Bagaimana adab makan dan minum yang diajarkan oleh Rasulullah ﷺ?",
    options: [
      "Membaca basmalah dan menggunakan tangan kanan",
      "Makan sambil berdiri agar cepat selesai",
      "Meniup makanan panas dengan kuat",
      "Menggunakan tangan kiri jika lebih mudah",
    ],
    correctAnswer: 0,
    explanation:
      "Rasulullah ﷺ bersabda kepada Umar bin Abi Salamah: 'Wahai anakku, sebutlah nama Allah (bacalah bismillah), makanlah dengan tangan kananmu, dan makanlah dari yang terdekat denganmu.' (HR. Bukhari & Muslim).",
    category: "Adab",
  },
  {
    id: "q32",
    question: "Doa yang diajarkan dalam Al-Qur'an (QS. Thaha: 114) untuk memohon tambahan ilmu yang bermanfaat adalah...",
    options: [
      "Rabbi zidnii 'ilmaa",
      "Rabbighfirlii waliwaalidayya",
      "Hasbunallahu wa ni'mal wakiil",
      "Subhanakallahumma wa bihamdika",
    ],
    correctAnswer: 0,
    explanation:
      "'Wa qul Rabbi zidnii 'ilmaa' artinya: 'Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.' (QS. Thaha: 114).",
    category: "Adab",
  },
  {
    id: "q33",
    question: "Apa adab utama ketika seorang Muslim hendak memasuki rumah?",
    options: [
      "Mengucapkan salam kepada penghuni rumah",
      "Langsung masuk tanpa suara",
      "Mengetuk pintu dengan keras terus-menerus",
      "Berdiri tepat menghadap bagian dalam pintu",
    ],
    correctAnswer: 0,
    explanation:
      "Allah berfirman: 'Maka apabila kamu memasuki rumah-rumah, hendaklah kamu memberi salam kepada penghuninya, salam yang ditetapkan dari sisi Allah, yang diberi berkat lagi baik.' (QS. An-Nur: 61).",
    category: "Adab",
  },
  {
    id: "q34",
    question: "Ketika seorang Muslim bersin dan mengucapkan 'Alhamdulillah', doa yang diucapkan oleh Muslim yang mendengarnya adalah...",
    options: [
      "Yarhamukallah",
      "Barakallahu fiik",
      "Astaghfirullah",
      "Inna lillahi wa inna ilaihi raji'un",
    ],
    correctAnswer: 0,
    explanation:
      "Apabila salah seorang bersin lalu mengucapkan 'Alhamdulillah', maka doakanlah dengan 'Yarhamukallah' (Semoga Allah merahmatimu), lalu yang bersin menjawab 'Yahdikumullah wa yushlihu balakum' (HR. Bukhari).",
    category: "Adab",
  },
  {
    id: "q35",
    question: "Kaki manakah yang dianjurkan untuk didahulukan ketika memasuki masjid?",
    options: [
      "Kaki kanan sambil membaca doa masuk masjid",
      "Kaki kiri sambil membaca istighfar",
      "Kedua kaki melompat bersamaan",
      "Tidak ada anjuran khusus",
    ],
    correctAnswer: 0,
    explanation:
      "Termasuk sunnah mendahulukan kaki kanan saat masuk masjid sambil memohon dibukakan pintu-pintu rahmat Allah, dan mendahulukan kaki kiri saat keluar masjid.",
    category: "Adab",
  },
  {
    id: "q36",
    question: "Apa yang dianjurkan dilakukan sebelum tidur menurut tuntunan Rasulullah ﷺ?",
    options: [
      "Berwudhu, membersihkan tempat tidur, dan membaca doa/dzikir sebelum tidur",
      "Tidur tengkurap sepanjang malam",
      "Makan kenyang sesaat sebelum memejamkan mata",
      "Membiarkan seluruh lampu dan api menyala",
    ],
    correctAnswer: 0,
    explanation:
      "Rasulullah ﷺ menganjurkan berwudhu sebelum tidur, mengibaskan tempat tidur tiga kali, berbaring miring ke kanan, dan membaca doa serta ayat-ayat perlindungan (HR. Bukhari & Muslim).",
    category: "Adab",
  },

  // ===================== AL-QUR'AN (37 - 44) =====================
  {
    id: "q37",
    question: "Berapa jumlah seluruh surah dan juz di dalam Al-Qur'an?",
    options: [
      "114 surah dan 30 juz",
      "112 surah dan 30 juz",
      "114 surah dan 29 juz",
      "110 surah dan 30 juz",
    ],
    correctAnswer: 0,
    explanation:
      "Mushaf Al-Qur'an terdiri dari 114 surah (dimulai dari Al-Fatihah hingga An-Nas) dan terbagi ke dalam 30 juz.",
    category: "Al-Qur'an",
  },
  {
    id: "q38",
    question: "Surah manakah yang merupakan surah terpanjang di dalam Al-Qur'an dengan jumlah 286 ayat?",
    options: [
      "Surah Ali 'Imran",
      "Surah Al-Baqarah",
      "Surah An-Nisa'",
      "Surah Al-A'raf",
    ],
    correctAnswer: 1,
    explanation:
      "Surah Al-Baqarah (surah ke-2) adalah surah terpanjang dalam Al-Qur'an yang terdiri dari 286 ayat.",
    category: "Al-Qur'an",
  },
  {
    id: "q39",
    question: "Surah manakah yang merupakan surah terpendek di dalam Al-Qur'an yang terdiri dari 3 ayat?",
    options: [
      "Surah Al-Ikhlas",
      "Surah Al-Kautsar",
      "Surah Al-Falaq",
      "Surah Quraisy",
    ],
    correctAnswer: 1,
    explanation:
      "Surah Al-Kautsar (surah ke-108) adalah surah terpendek dalam Al-Qur'an dengan jumlah 3 ayat.",
    category: "Al-Qur'an",
  },
  {
    id: "q40",
    question: "Surah di dalam Al-Qur'an yang tidak diawali dengan lafaz Basmalah adalah...",
    options: [
      "Surah At-Taubah",
      "Surah Al-Anfal",
      "Surah Al-Kahf",
      "Surah Maryam",
    ],
    correctAnswer: 0,
    explanation:
      "Surah At-Taubah (surah ke-9) adalah satu-satunya surah dalam Al-Qur'an yang tidak diawali dengan Basmalah.",
    category: "Al-Qur'an",
  },
  {
    id: "q41",
    question: "Di dalam surah apakah terdapat Ayat Kursi yang agung?",
    options: [
      "Surah Al-Baqarah ayat 255",
      "Surah Ali 'Imran ayat 18",
      "Surah Al-Baqarah ayat 286",
      "Surah Al-Hasyr ayat 22",
    ],
    correctAnswer: 0,
    explanation:
      "Ayat Kursi adalah ayat ke-255 dari Surah Al-Baqarah yang menjelaskan keagungan tauhid dan kekuasaan Allah Yang Mahahidup lagi terus-menerus mengurus makhluk-Nya.",
    category: "Al-Qur'an",
  },
  {
    id: "q42",
    question: "Juz ke-30 dalam Al-Qur'an sering disebut sebagai 'Juz 'Amma' karena dimulai dengan surah...",
    options: [
      "Surah An-Naba'",
      "Surah Al-Mulk",
      "Surah Al-Fajr",
      "Surah Adh-Dhuha",
    ],
    correctAnswer: 0,
    explanation:
      "Juz 30 dimulai dengan Surah An-Naba' (surah ke-78) ayat 1 yang berbunyi 'Amma yatasa'alun, dan berakhir pada Surah An-Nas ayat 6.",
    category: "Al-Qur'an",
  },
  {
    id: "q43",
    question: "Surah Al-Fatihah disebut juga dengan 'As-Sab'ul Matsani' yang artinya...",
    options: [
      "Tujuh ayat yang dibaca berulang-ulang",
      "Pembuka segala kebaikan",
      "Penawar segala penyakit hati",
      "Cahaya petunjuk yang nyata",
    ],
    correctAnswer: 0,
    explanation:
      "As-Sab'ul Matsani berarti tujuh ayat yang diulang-ulang bacaannya dalam setiap rakaat shalat (QS. Al-Hijr: 87).",
    category: "Al-Qur'an",
  },
  {
    id: "q44",
    question: "Ayat Al-Qur'an yang berbunyi 'Inna ma'al 'usri yusra' (Sesungguhnya bersama kesulitan ada kemudahan) terdapat dalam...",
    options: [
      "Surah Asy-Syarh (Al-Insyirah)",
      "Surah Adh-Dhuha",
      "Surah Al-'Ashr",
      "Surah Al-Ma'un",
    ],
    correctAnswer: 0,
    explanation:
      "Firman Allah 'Fa inna ma'al 'usri yusra, inna ma'al 'usri yusra' terdapat pada Surah Asy-Syarh (surah ke-94) ayat 5 dan 6.",
    category: "Al-Qur'an",
  },

  // ===================== HADITS (45 - 50) =====================
  {
    id: "q45",
    question: "Hadits pertama dalam kitab Arba'in An-Nawawi yang diriwayatkan dari Umar bin Khaththab membahas tentang...",
    options: [
      "Setiap amalan tergantung pada niatnya",
      "Rukun Islam yang lima",
      "Larangan marah",
      "Meninggalkan hal yang tidak bermanfaat",
    ],
    correctAnswer: 0,
    explanation:
      "Hadits pertama Arba'in Nawawi adalah 'Innamal a'malu bin-niyyat' (Sesungguhnya setiap amalan tergantung pada niatnya) — HR. Bukhari no. 1 & Muslim no. 1907.",
    category: "Hadits",
  },
  {
    id: "q46",
    question: "Apa arti istilah 'Ihsan' sebagaimana dijelaskan dalam Hadits Jibril (HR. Muslim)?",
    options: [
      "Engkau beribadah kepada Allah seakan-akan melihat-Nya, dan jika tidak melihat-Nya sesungguhnya Dia melihatmu",
      "Mengeluarkan sebagian harta untuk membantu fakir miskin",
      "Menghafalkan seluruh ayat Al-Qur'an dengan tajwid",
      "Melaksanakan shalat malam secara berjamaah",
    ],
    correctAnswer: 0,
    explanation:
      "Dalam Hadits Jibril (HR. Muslim no. 8), Rasulullah ﷺ menjelaskan: 'Ihsan adalah engkau beribadah kepada Allah seolah-olah engkau melihat-Nya; jika engkau tidak melihat-Nya maka sesungguhnya Dia melihatmu.'",
    category: "Hadits",
  },
  {
    id: "q47",
    question: "Menurut hadits riwayat Bukhari dari Utsman bin Affan, siapakah sebaik-baik manusia di antara umat Islam?",
    options: [
      "Orang yang mempelajari Al-Qur'an dan mengajarkannya",
      "Orang yang paling banyak hartanya di dunia",
      "Orang yang paling jauh perjalanan dagangnya",
      "Orang yang paling tinggi kedudukan sosialnya",
    ],
    correctAnswer: 0,
    explanation:
      "Rasulullah ﷺ bersabda: 'Khairukum man ta'allamal Qur'ana wa 'allamahu' — Sebaik-baik kalian adalah orang yang mempelajari Al-Qur'an dan mengajarkannya (HR. Bukhari no. 5027).",
    category: "Hadits",
  },
  {
    id: "q48",
    question: "Dalam hadits riwayat Muslim dari Abu Malik Al-Asy'ari, Rasulullah ﷺ menyebutkan bahwa 'Ath-Thuhuru syathrul iman' yang artinya...",
    options: [
      "Kesucian (kebersihan) itu adalah sebagian dari iman",
      "Sabar itu adalah cahaya kehidupan",
      "Doa adalah senjata orang beriman",
      "Shalat adalah tiang agama",
    ],
    correctAnswer: 0,
    explanation:
      "Rasulullah ﷺ bersabda: 'Ath-thuhuru syathrul iman' (Bersuci/kesucian itu adalah separuh/sebagian dari iman) — HR. Muslim no. 223.",
    category: "Hadits",
  },
  {
    id: "q49",
    question: "Nasihat singkat Rasulullah ﷺ kepada seorang sahabat yang meminta wasiat (HR. Bukhari no. 6116) dan diulang beberapa kali adalah...",
    options: [
      "Janganlah engkau marah (Laa taghdhab)",
      "Janganlah engkau bepergian jauh",
      "Janganlah engkau berdagang di pasar",
      "Janganlah engkau tidur setelah Ashar",
    ],
    correctAnswer: 0,
    explanation:
      "Ketika seorang laki-laki berkata kepada Nabi ﷺ 'Berilah aku wasiat', beliau bersabda: 'Laa taghdhab' (Jangan marah), dan beliau mengulanginya berkali-kali (HR. Bukhari no. 6116).",
    category: "Hadits",
  },
  {
    id: "q50",
    question: "Menurut hadits Arba'in Nawawi ke-12, di antara tanda baiknya keislaman seseorang adalah...",
    options: [
      "Meninggalkan hal-hal yang tidak bermanfaat baginya",
      "Mengetahui seluruh urusan pribadi orang lain",
      "Memperbanyak perdebatan dalam masalah furu'",
      "Mengumpulkan harta sebanyak-banyaknya",
    ],
    correctAnswer: 0,
    explanation:
      "Rasulullah ﷺ bersabda: 'Min husni islamil mar'i tarkuhu maa laa ya'niihi' — Di antara tanda baiknya Islam seseorang adalah ia meninggalkan perkara yang tidak bermanfaat baginya (HR. At-Tirmidzi no. 2317).",
    category: "Hadits",
  },
];

export const quizCategories = [
  "Aqidah",
  "Fiqih",
  "Akhlak",
  "Sirah",
  "Adab",
  "Al-Qur'an",
  "Hadits",
];

export function getQuizByCategory(category: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.category === category);
}

/** Campuran soal dari semua kategori. */
export function getMixedQuiz(count = EXAM_QUESTION_COUNT): QuizQuestion[] {
  const byCategory = quizCategories.map((c) => getQuizByCategory(c));
  const result: QuizQuestion[] = [];
  let round = 0;

  while (result.length < count && round < 20) {
    let added = false;
    for (const list of byCategory) {
      if (list[round]) {
        result.push(list[round]);
        added = true;
        if (result.length >= count) break;
      }
    }
    if (!added) break;
    round++;
  }

  return result;
}
