export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Berapa jumlah Rukun Iman?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 2,
    explanation: "Rukun Iman ada 6: Iman kepada Allah, Malaikat, Kitab-kitab, Rasul-rasul, Hari Akhir, dan Qada & Qadar.",
    category: "Aqidah",
  },
  {
    id: "q2",
    question: "Surah apa yang wajib dibaca dalam setiap rakaat shalat?",
    options: ["Al-Ikhlas", "Al-Fatihah", "An-Nas", "Al-Baqarah"],
    correctAnswer: 1,
    explanation: "Surah Al-Fatihah wajib dibaca pada setiap rakaat shalat. Rasulullah ﷺ bersabda: 'Tidak sah shalat bagi orang yang tidak membaca Al-Fatihah.' (HR. Bukhari)",
    category: "Fiqih",
  },
  {
    id: "q3",
    question: "Siapa malaikat yang bertugas menyampaikan wahyu?",
    options: ["Mikail", "Israfil", "Jibril", "Izrail"],
    correctAnswer: 2,
    explanation: "Malaikat Jibril 'alaihissalam bertugas menyampaikan wahyu dari Allah kepada para nabi dan rasul.",
    category: "Aqidah",
  },
  {
    id: "q4",
    question: "Berapa jumlah rakaat shalat Maghrib?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"],
    correctAnswer: 1,
    explanation: "Shalat Maghrib terdiri dari 3 rakaat.",
    category: "Fiqih",
  },
  {
    id: "q5",
    question: "Apa julukan Rasulullah ﷺ sebelum menjadi nabi?",
    options: ["Al-Mukhtar", "Al-Amin", "Al-Hadi", "Al-Mujtahid"],
    correctAnswer: 1,
    explanation: "Rasulullah ﷺ dijuluki Al-Amin yang artinya 'yang dapat dipercaya' karena kejujuran dan amanah beliau.",
    category: "Sirah",
  },
  {
    id: "q6",
    question: "Apa nama bulan di mana umat Islam diwajibkan berpuasa?",
    options: ["Syawal", "Dzulhijjah", "Rajab", "Ramadhan"],
    correctAnswer: 3,
    explanation: "Puasa Ramadhan adalah salah satu Rukun Islam yang kelima. Allah berfirman: 'Wahai orang-orang yang beriman, diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu.' (QS. Al-Baqarah: 183)",
    category: "Fiqih",
  },
  {
    id: "q7",
    question: "Di kota mana Rasulullah ﷺ dilahirkan?",
    options: ["Madinah", "Thaif", "Makkah", "Yerusalem"],
    correctAnswer: 2,
    explanation: "Rasulullah ﷺ dilahirkan di kota Makkah pada tahun 570 Masehi, yang dikenal sebagai Tahun Gajah.",
    category: "Sirah",
  },
  {
    id: "q8",
    question: "Sifat terpuji yang berarti jujur dalam Islam disebut?",
    options: ["Amanah", "Shidq", "Tabligh", "Fathanah"],
    correctAnswer: 1,
    explanation: "Shidq artinya jujur, benar. Ini adalah salah satu sifat wajib bagi rasul dan sifat terpuji yang harus dimiliki setiap Muslim.",
    category: "Akhlak",
  },
  {
    id: "q9",
    question: "Berapa jumlah surah dalam Al-Qur'an?",
    options: ["112", "113", "114", "115"],
    correctAnswer: 2,
    explanation: "Al-Qur'an terdiri dari 114 surah, dimulai dari Surah Al-Fatihah dan diakhiri dengan Surah An-Nas.",
    category: "Aqidah",
  },
  {
    id: "q10",
    question: "Adab makan yang benar menurut sunnah adalah menggunakan tangan...?",
    options: ["Kiri", "Kanan", "Keduanya", "Tergantung situasi"],
    correctAnswer: 1,
    explanation: "Rasulullah ﷺ bersabda: 'Janganlah kalian makan dengan tangan kiri, karena sesungguhnya setan makan dengan tangan kirinya.' (HR. Muslim)",
    category: "Adab",
  },
  {
    id: "q11",
    question: "Kitab yang diturunkan kepada Nabi Daud 'alaihissalam adalah...",
    options: ["Taurat", "Zabur", "Injil", "Al-Qur'an"],
    correctAnswer: 1,
    explanation: "Allah menurunkan Taurat kepada Nabi Musa, Zabur kepada Nabi Daud, Injil kepada Nabi Isa, dan Al-Qur'an kepada Nabi Muhammad ﷺ.",
    category: "Aqidah",
  },
  {
    id: "q12",
    question: "Apa arti kalimat tauhid \"La ilaha illallah\"?",
    options: [
      "Tidak ada tuhan yang berhak disembah selain Allah",
      "Allah Maha Mendengar lagi Maha Mengetahui",
      "Hanya kepada Allah kita memohon pertolongan",
      "Allah Mahakuasa atas segala sesuatu",
    ],
    correctAnswer: 0,
    explanation: "La ilaha illallah berarti tidak ada tuhan yang berhak disembah kecuali Allah semata. Inilah inti tauhid dalam Islam.",
    category: "Aqidah",
  },
  {
    id: "q13",
    question: "Berapa rakaat shalat Subuh?",
    options: ["2 rakaat", "3 rakaat", "4 rakaat", "1 rakaat"],
    correctAnswer: 0,
    explanation: "Shalat Subuh diwajibkan dua rakaat dan termasuk shalat fardhu yang dianjurkan untuk dikerjakan berjamaah.",
    category: "Fiqih",
  },
  {
    id: "q14",
    question: "Apa yang digunakan untuk bersuci ketika tidak ada air?",
    options: ["Debu/tanah (tayamum)", "Minyak zaitun", "Air mawar", "Kapur barus"],
    correctAnswer: 0,
    explanation: "Tayamum adalah bersuci dengan debu yang suci sebagai pengganti air, sebagaimana firman Allah: 'Maka ber-tayamumlah kamu dari tanah itu.' (QS. An-Nisa: 43)",
    category: "Fiqih",
  },
  {
    id: "q15",
    question: "Apa doa yang sering dibaca ketika ingin menambah ilmu?",
    options: ["Robbi zidnii 'ilmaa", "Robbighfirlii", "Laa hawla wa laa quwwata illaa billaah", "Alhamdulillah"],
    correctAnswer: 0,
    explanation: "'Robbi zidnii 'ilmaa' artinya 'Ya Tuhanku, tambahkanlah kepadaku ilmu.' (QS. Thaha: 114)",
    category: "Adab",
  },
  {
    id: "q16",
    question: "Apa arti husnuzan dalam akhlak Islam?",
    options: ["Berbaik sangka", "Berburuk sangka", "Bersabar", "Bersyukur"],
    correctAnswer: 0,
    explanation: "Husnuzan berarti berbaik sangka. Islam menganjurkan berbaik sangka kepada Allah dan kepada sesama manusia selama tidak bertentangan dengan fakta.",
    category: "Akhlak",
  },
  {
    id: "q17",
    question: "Menurut hadits, tersenyum di hadapan saudaramu termasuk...",
    options: ["Sedekah", "Puasa sunnah", "Shalat sunnah", "Dzikir pagi"],
    correctAnswer: 0,
    explanation: "Rasulullah ﷺ bersabda: 'Tersenyum di hadapan saudaramu adalah sedekah.' (HR. At-Tirmidzi no. 1956)",
    category: "Akhlak",
  },
  {
    id: "q18",
    question: "Siapa istri pertama Rasulullah ﷺ?",
    options: ["Khadijah", "Aisyah", "Hafshah", "Saudah"],
    correctAnswer: 0,
    explanation: "Rasulullah ﷺ menikahi Khadijah binti Khuwailid, wanita pertama yang beriman kepada dakwah beliau.",
    category: "Sirah",
  },
  {
    id: "q19",
    question: "Berapa lama Rasulullah ﷺ berdakwah di Makkah sebelum hijrah?",
    options: ["10 tahun", "11 tahun", "12 tahun", "13 tahun"],
    correctAnswer: 3,
    explanation: "Rasulullah ﷺ berdakwah di Makkah selama kurang lebih 13 tahun, kemudian berhijrah ke Madinah pada tahun 622 M.",
    category: "Sirah",
  },
  {
    id: "q20",
    question: "Apa adab Islam ketika memasuki rumah?",
    options: ["Mengucapkan salam", "Mengetuk pintu berulang kali", "Masuk tanpa berkata-kata", "Memutar pintu perlahan"],
    correctAnswer: 0,
    explanation: "Allah berfirman: 'Apabila kamu memasuki rumah-rumah, ucapkanlah salam ke atas diri (penghuni rumah) dengan kalimat yang baik.' (QS. An-Nur: 61)",
    category: "Adab",
  },
];

export const quizCategories = ["Aqidah", "Fiqih", "Akhlak", "Sirah", "Adab"];

export function getQuizByCategory(category: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.category === category);
}

/** Campuran 10 soal dari semua kategori (acak tapi deterministik). */
export function getMixedQuiz(count = 10): QuizQuestion[] {
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
