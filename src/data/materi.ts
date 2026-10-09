export interface Materi {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  progress: number;
  content: string;
}

export const categories = [
  { id: "aqidah", name: "Aqidah", description: "Pelajari dasar-dasar keimanan.", icon: "Heart" },
  { id: "fiqih", name: "Fiqih", description: "Kenali tuntunan ibadah dalam kehidupan sehari-hari.", icon: "BookOpen" },
  { id: "akhlak", name: "Akhlak", description: "Belajar membangun akhlak yang baik.", icon: "Users" },
  { id: "sirah", name: "Sirah", description: "Kenali perjalanan Rasulullah ﷺ dan generasi terdahulu.", icon: "Clock" },
  { id: "adab", name: "Adab", description: "Pelajari adab dalam kehidupan sehari-hari.", icon: "Star" },
  { id: "tafsir", name: "Tafsir", description: "Pahami makna dan kandungan ayat-ayat Al-Qur'an.", icon: "BookMarked" },
];

export const materiList: Materi[] = [
  {
    id: "rukun-iman",
    title: "Memahami Rukun Iman",
    description: "Mengenal enam perkara yang wajib diimani oleh setiap Muslim sebagai pondasi akidah.",
    category: "Aqidah",
    readTime: 8,
    progress: 80,
    content: `## Pengertian Rukun Iman

Rukun Iman adalah enam perkara yang wajib diimani oleh setiap Muslim. Iman secara bahasa berarti membenarkan, sedangkan secara istilah berarti membenarkan dengan hati, mengucapkan dengan lisan, dan mengamalkan dengan anggota badan.

## Enam Rukun Iman

### 1. Iman kepada Allah
Iman kepada Allah adalah keyakinan yang teguh bahwa Allah itu ada, Maha Esa dalam Zat, Sifat, dan Perbuatan-Nya. Seorang Muslim wajib mengenal Allah melalui nama-nama dan sifat-sifat-Nya yang mulia (Asmaul Husna).

### 2. Iman kepada Malaikat
Malaikat adalah makhluk Allah yang diciptakan dari cahaya. Mereka selalu taat kepada Allah dan tidak pernah mendurhakai-Nya. Di antara malaikat yang wajib diketahui namanya ada sepuluh, seperti Jibril, Mikail, Israfil, dan Izrail.

### 3. Iman kepada Kitab-kitab Allah
Allah menurunkan kitab-kitab suci kepada para rasul-Nya sebagai petunjuk bagi umat manusia. Kitab-kitab yang wajib diimani: Taurat (Musa), Zabur (Daud), Injil (Isa), dan Al-Qur'an (Muhammad ﷺ).

### 4. Iman kepada Rasul-rasul Allah
Allah mengutus para rasul untuk menyampaikan wahyu dan membimbing manusia ke jalan yang benar. Nabi dan rasul yang disebutkan dalam Al-Qur'an berjumlah 25.

### 5. Iman kepada Hari Akhir
Iman kepada hari akhir mencakup keyakinan akan terjadinya hari kiamat, hari kebangkitan, hari perhitungan amal, serta adanya surga dan neraka.

### 6. Iman kepada Qada dan Qadar
Qada adalah ketetapan Allah sejak zaman azali, sedangkan Qadar adalah perwujudan dari ketetapan tersebut. Seorang Muslim wajib meyakini bahwa segala sesuatu terjadi atas kehendak dan takdir Allah.

## Dalil Rukun Iman

Dari Umar bin Khaththab radhiyallahu 'anhu, ketika Jibril bertanya kepada Rasulullah ﷺ tentang iman, beliau menjawab:

> "Iman adalah engkau beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan engkau beriman kepada takdir yang baik maupun yang buruk."
> 
> (HR. Muslim no. 8)

*Sumber: Hadits Jibril, HR. Muslim no. 8*`,
  },
  {
    id: "thaharah",
    title: "Panduan Thaharah (Bersuci)",
    description: "Memahami konsep bersuci dalam Islam, termasuk wudhu, tayamum, dan mandi wajib.",
    category: "Fiqih",
    readTime: 10,
    progress: 60,
    content: `## Pengertian Thaharah

Thaharah secara bahasa berarti bersih atau suci. Secara istilah syariat, thaharah adalah menghilangkan hadats dan najis, atau menghilangkan hukumnya dengan menggunakan air atau debu yang suci.

## Macam-macam Thaharah

### Wudhu
Wudhu adalah bersuci dengan air untuk anggota tubuh tertentu sebagai syarat sahnya shalat.

**Rukun Wudhu:**
1. Niat
2. Membasuh wajah
3. Membasuh kedua tangan sampai siku
4. Mengusap kepala
5. Membasuh kedua kaki sampai mata kaki
6. Tertib (berurutan)

### Tayamum
Tayamum adalah bersuci dengan debu yang suci sebagai pengganti wudhu atau mandi wajib ketika tidak ada air atau tidak bisa menggunakan air.

### Mandi Wajib
Mandi wajib adalah membasuh seluruh tubuh dengan air untuk menghilangkan hadats besar.

## Hal-hal yang Membatalkan Wudhu

1. Keluarnya sesuatu dari dua jalan (qubul dan dubur)
2. Tidur lelap
3. Hilang akal
4. Menyentuh kemaluan tanpa penghalang

*Sumber: Kitab Fiqih berdasarkan Al-Qur'an dan Sunnah*`,
  },
  {
    id: "akhlak-rasulullah",
    title: "Teladan Akhlak Rasulullah ﷺ",
    description: "Meneladani sifat-sifat mulia Rasulullah ﷺ dalam kehidupan sehari-hari.",
    category: "Akhlak",
    readTime: 7,
    progress: 40,
    content: `## Akhlak Rasulullah ﷺ

Allah Subhanahu wa Ta'ala berfirman:

> "Dan sesungguhnya engkau (Muhammad) benar-benar berbudi pekerti yang agung."
> 
> (QS. Al-Qalam: 4)

Rasulullah ﷺ adalah teladan terbaik dalam segala aspek kehidupan. Beliau memiliki akhlak yang mulia yang patut kita teladani.

## Sifat-sifat Mulia Rasulullah ﷺ

### 1. Jujur (Ash-Shidq)
Rasulullah ﷺ dikenal sebagai Al-Amin (yang dapat dipercaya) bahkan sebelum diangkat menjadi nabi. Kejujuran beliau diakui oleh kawan maupun lawan.

### 2. Amanah
Beliau selalu menjaga amanah yang diberikan kepadanya, baik dari Allah maupun dari manusia.

### 3. Rendah Hati (Tawadhu')
Meskipun beliau adalah pemimpin umat, Rasulullah ﷺ selalu rendah hati. Beliau memperbaiki sandalnya sendiri, menambal bajunya sendiri, dan membantu pekerjaan rumah.

### 4. Pemaaf
Rasulullah ﷺ terkenal pemaaf. Bahkan ketika beliau ditolak dan disakiti penduduk Thaif, beliau memilih untuk mendoakan mereka.

### 5. Kasih Sayang
Beliau sangat penyayang kepada keluarga, anak-anak, dan seluruh umatnya.

## Mengamalkan Akhlak Rasulullah ﷺ

Meneladani akhlak Rasulullah ﷺ bukan sekadar mengetahui, tetapi mengamalkannya dalam kehidupan sehari-hari. Mulai dari hal-hal kecil seperti mengucapkan salam, tersenyum, dan berkata baik.

*Sumber: Shahih al-Bukhari dan Shahih Muslim*`,
  },
  {
    id: "sejarah-nabi",
    title: "Sejarah Kehidupan Nabi Muhammad ﷺ",
    description: "Mengenal perjalanan hidup Rasulullah ﷺ dari kelahiran hingga wafatnya.",
    category: "Sirah",
    readTime: 12,
    progress: 20,
    content: `## Kelahiran dan Masa Kecil

Nabi Muhammad ﷺ lahir pada hari Senin, 12 Rabiul Awal tahun Gajah (570 M) di kota Makkah. Beliau lahir dalam keadaan yatim, karena ayahnya Abdullah bin Abdul Muthalib telah wafat sebelum beliau lahir.

## Masa Muda

Pada masa mudanya, beliau dikenal dengan julukan Al-Amin (yang dapat dipercaya). Beliau bekerja sebagai pedagang dan dikenal jujur serta amanah.

## Diangkat Menjadi Rasul

Pada usia 40 tahun, di Gua Hira, Jibril datang membawa wahyu pertama, yaitu Surah Al-'Alaq ayat 1-5. Inilah awal mula kenabian Muhammad ﷺ.

## Dakwah di Makkah

Selama 13 tahun berdakwah di Makkah, Rasulullah ﷺ dan para sahabat menghadapi berbagai cobaan dan penolakan dari kaum Quraisy.

## Hijrah ke Madinah

Pada tahun 622 M, Rasulullah ﷺ berhijrah ke Madinah. Di sinilah beliau membangun masyarakat Islam pertama, mendirikan masjid, dan menyusun Piagam Madinah.

## Wafat

Rasulullah ﷺ wafat pada hari Senin, 12 Rabiul Awal 11 H (632 M) di Madinah.

*Sumber: Sirah Ibnu Hisyam, Ar-Rahiq Al-Makhtum*`,
  },
  {
    id: "adab-makan",
    title: "Adab Makan dan Minum dalam Islam",
    description: "Tata cara makan dan minum sesuai dengan tuntunan Rasulullah ﷺ.",
    category: "Adab",
    readTime: 5,
    progress: 0,
    content: `## Adab Sebelum Makan

### 1. Membaca Bismillah
Rasulullah ﷺ bersabda: "Jika salah seorang di antara kalian makan, hendaklah menyebut nama Allah. Jika ia lupa menyebut nama Allah di awalnya, hendaklah ia mengucapkan: Bismillahi awwalahu wa aakhirahu." (HR. Abu Dawud dan At-Tirmidzi)

### 2. Makan dengan Tangan Kanan
Rasulullah ﷺ bersabda: "Janganlah kalian makan dengan tangan kiri, karena sesungguhnya setan makan dengan tangan kirinya." (HR. Muslim)

### 3. Makan yang Terdekat
Rasulullah ﷺ bersabda: "Bacalah bismillah, makanlah dengan tangan kananmu, dan makanlah dari yang terdekat denganmu." (HR. Bukhari dan Muslim)

## Adab Saat Makan

1. Tidak mencela makanan
2. Tidak makan berlebihan
3. Tidak meniup makanan yang panas

## Adab Setelah Makan

Membaca doa setelah makan:

> الحَمْدُ للهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ

*"Segala puji bagi Allah yang telah memberi makan ini kepadaku dan memberikan rezeki kepadaku tanpa daya dan kekuatan dariku."*

*Sumber: Shahih al-Bukhari, Shahih Muslim, Sunan Abu Dawud*`,
  },
  {
    id: "tafsir-al-fatihah",
    title: "Tafsir Surah Al-Fatihah",
    description: "Memahami makna dan kandungan surah yang paling sering dibaca dalam shalat.",
    category: "Tafsir",
    readTime: 15,
    progress: 0,
    content: `## Kedudukan Surah Al-Fatihah

Surah Al-Fatihah adalah surah pertama dalam mushaf Al-Qur'an. Surah ini memiliki beberapa nama, di antaranya: Ummul Qur'an (Induk Al-Qur'an), As-Sab'ul Matsani (Tujuh yang diulang-ulang), dan Al-Hamd.

## Tafsir Ayat per Ayat

### Ayat 1: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
*Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.*

Basmalah mengajarkan kita untuk memulai segala sesuatu dengan menyebut nama Allah.

### Ayat 2: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
*Segala puji bagi Allah, Tuhan seluruh alam.*

Kita memulai dengan memuji Allah sebagai Rabb (Tuhan, Pemelihara, Pengatur) seluruh alam semesta.

### Ayat 3: الرَّحْمَٰنِ الرَّحِيمِ
*Yang Maha Pengasih, Maha Penyayang.*

Penegasan bahwa Allah memiliki kasih sayang yang luas bagi seluruh makhluk-Nya.

### Ayat 4: مَالِكِ يَوْمِ الدِّينِ
*Pemilik hari pembalasan.*

Pengingat bahwa akan ada hari pertanggungjawaban di akhirat.

### Ayat 5: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
*Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.*

Inti tauhid: ibadah dan permohonan pertolongan hanya ditujukan kepada Allah semata.

### Ayat 6-7
Doa agar ditunjukkan jalan yang lurus, yaitu jalan orang-orang yang diberi nikmat oleh Allah.

*Sumber: Tafsir Ibnu Katsir*`,
  },
];

export function getMateriById(id: string): Materi | undefined {
  return materiList.find((m) => m.id === id);
}

export function getMateriByCategory(category: string): Materi[] {
  return materiList.filter((m) => m.category.toLowerCase() === category.toLowerCase());
}
