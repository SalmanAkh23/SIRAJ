import {
  arbainHaditsList,
  arbainCategories,
  getArbainHaditsByCategory,
  getArbainHaditsByNumber,
  searchArbainHadits,
  ARBAIN_METADATA,
  type ArbainHadits,
  type HaditsCategory,
} from "./arbain-nawawi";

export interface Hadits {
  id: string;
  number?: number;
  title?: string;
  theme?: string;
  arab?: string;
  text: string;
  matanSnippet?: string;
  narrator: string;
  source: string;
  category: string;
  grade?: string;
  bookSlug?: string;
  bookName?: string;
  note?: string;
  lessons?: string[];
}

export const haditsCategories = arbainCategories;

/**
 * Daftar 42 Hadits Arba'in An-Nawawi sebagai sumber hadits utama di SIRAJ.
 */
export const haditsList: Hadits[] = arbainHaditsList;

export function getHaditsByCategory(category: string): Hadits[] {
  return getArbainHaditsByCategory(category);
}

export function getHaditsById(id: string): Hadits | undefined {
  // Dukung lookup "hadits-1", "arbain-1", atau nomor murni
  const matchNum = id.match(/\d+/);
  if (matchNum) {
    const num = parseInt(matchNum[0], 10);
    const byNum = getArbainHaditsByNumber(num);
    if (byNum) return byNum;
  }
  return arbainHaditsList.find((h) => h.id === id);
}

// Re-export modul resmi Arba'in An-Nawawi
export {
  arbainHaditsList,
  arbainCategories,
  getArbainHaditsByCategory,
  getArbainHaditsByNumber,
  searchArbainHadits,
  ARBAIN_METADATA,
};
export type { ArbainHadits, HaditsCategory };
