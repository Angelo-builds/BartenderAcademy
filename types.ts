
export type Language = 'it' | 'en';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Cocktail {
  id: string;
  name: string;
  image: string; // New field for photo URL
  method: string;
  glass: string;
  ingredients: Ingredient[];
  garnish: string;
  category: string;
  era: 'Professional' | 'Vintage' | 'Modern' | 'Classic' | 'Tiki';
  notes?: string;
  status?: 'published' | 'draft' | 'coming_soon';
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  category: 'Basics' | 'Rules' | 'Distillates';
  image?: string; // Added image field
  status?: 'published' | 'draft';
}

export interface AppData {
  cocktails: Cocktail[];
  theory: TheorySection[];
}
