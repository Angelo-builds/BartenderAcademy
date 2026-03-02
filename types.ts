
export type Language = 'it' | 'en';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Cocktail {
  id: string; // UUID in Supabase
  name: string;
  slug?: string; // For consistent image naming across languages
  image: string;
  method: string;
  glass: string;
  ingredients: Ingredient[]; // Stored as JSONB
  garnish: string;
  category: string;
  era: 'Professional' | 'Vintage' | 'Modern' | 'Classic' | 'Tiki';
  notes?: string;
  status?: 'published' | 'draft' | 'coming_soon';
}

export interface TheorySection {
  id: string;
  title: string;
  slug?: string; // For consistent image naming across languages
  content: string;
  category: 'Basics' | 'Rules' | 'Distillates' | 'Basi' | 'Regole'; // Added Italian categories for type safety
  image?: string;
  status?: 'published' | 'draft';
}

export interface Certificate {
  id: string;
  title: string;
  section: string;
  date: string;
  description?: string;
  image: string;
}

export interface ShareLink {
  id: string;
  certificateIds: string[];
  expirationDate?: string | null;
  createdDate: string;
  name?: string;
}

export interface SiteConfig {
  homeHeroImage: string;
  homeTitle: string;
  homeSubtitle: string;
  homeSubtitleEn?: string; // New field for English subtitle
  homeQuote: string;
  theoryHeroImage?: string;
  theoryTitle?: string;
  theoryTitleEn?: string;
  theorySubtitle?: string;
  theorySubtitleEn?: string;
  distillatesHeroImage?: string;
  distillatesTitle?: string;
  distillatesTitleEn?: string;
  distillatesSubtitle?: string;
  distillatesSubtitleEn?: string;
  ollamaUrl?: string; // New field for dynamic Ollama connection
}

export interface AppData {
  cocktails: Cocktail[];
  theory: TheorySection[];
  certificates: Certificate[];
  sharedLinks: ShareLink[];
  siteConfig: SiteConfig;
}
