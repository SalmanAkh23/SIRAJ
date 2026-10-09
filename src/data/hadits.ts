export interface Hadits {
  id: string;
  text: string;
  narrator: string;
  source: string;
  category: string;
  note?: string;
}

export const haditsCategories = [
  "Iman",
  "Ibadah",
  "Akhlak",
  "Ilmu",
  "Muamalah",
];

export const haditsList: Hadits[] = [
  {
    id: "hadits-1",
    text: "Sesungguhnya setiap amalan tergantung pada niatnya. Dan sesungguhnya setiap orang akan mendapatkan apa yang ia niatkan.",
    narrator: "Umar bin Khaththab radhiyallahu 'anhu",
    source: "HR. Bukhari no. 1, Muslim no. 1907",
    category: "Iman",
  },
  {
    id: "hadits-2",
    text: "Tidak beriman salah seorang di antara kalian hingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
    narrator: "Anas bin Malik radhiyallahu 'anhu",
    source: "HR. Bukhari no. 13, Muslim no. 45",
    category: "Iman",
  },
  {
    id: "hadits-3",
    text: "Islam dibangun di atas lima perkara: bersaksi bahwa tidak ada tuhan yang berhak disembah selain Allah dan bahwa Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, berpuasa di bulan Ramadhan, dan menunaikan haji ke Baitullah bagi yang mampu.",
    narrator: "Ibnu Umar radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 8, Muslim no. 16",
    category: "Ibadah",
  },
  {
    id: "hadits-4",
    text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.",
    narrator: "Jabir radhiyallahu 'anhu",
    source: "HR. Ath-Thabrani dalam Al-Mu'jam Al-Ausath",
    category: "Akhlak",
    note: "Hadits ini dishahihkan oleh Al-Albani dalam Silsilah Ash-Shahihah no. 426",
  },
  {
    id: "hadits-5",
    text: "Barangsiapa yang menempuh jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Muslim no. 2699",
    category: "Ilmu",
  },
  {
    id: "hadits-6",
    text: "Mukmin yang kuat lebih baik dan lebih dicintai Allah daripada mukmin yang lemah. Dan pada masing-masing terdapat kebaikan.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Muslim no. 2664",
    category: "Iman",
  },
  {
    id: "hadits-7",
    text: "Tersenyum di hadapan saudaramu adalah sedekah.",
    narrator: "Abu Dzar radhiyallahu 'anhu",
    source: "HR. At-Tirmidzi no. 1956",
    category: "Akhlak",
  },
  {
    id: "hadits-8",
    text: "Bertakwalah kepada Allah di mana pun kamu berada. Iringilah keburukan dengan kebaikan, niscaya kebaikan itu akan menghapusnya. Dan berakhlaklah kepada manusia dengan akhlak yang baik.",
    narrator: "Mu'adz bin Jabal radhiyallahu 'anhu",
    source: "HR. At-Tirmidzi no. 1987",
    category: "Akhlak",
  },
  {
    id: "hadits-9",
    text: "Sampaikan dariku walau satu ayat.",
    narrator: "Abdullah bin Amr radhiyallahu 'anhuma",
    source: "HR. Bukhari no. 3461",
    category: "Ilmu",
  },
  {
    id: "hadits-10",
    text: "Malu itu sebagian dari iman.",
    narrator: "Abu Hurairah radhiyallahu 'anhu",
    source: "HR. Bukhari no. 9, Muslim no. 35",
    category: "Iman",
  },
];

export function getHaditsByCategory(category: string): Hadits[] {
  return haditsList.filter((h) => h.category === category);
}

export function getHaditsById(id: string): Hadits | undefined {
  return haditsList.find((h) => h.id === id);
}
