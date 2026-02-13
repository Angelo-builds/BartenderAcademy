
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

export interface Certificate {
  id: string;
  title: string;
  section: string; // e.g., 'Corsi', 'Master', 'Seminari'
  date: string;
  description?: string;
  image: string;
}

export interface ShareLink {
  id: string; // Unique slug/hash
  certificateIds: string[]; // IDs of certs to show
  expirationDate?: string | null; // ISO string or null
  createdDate: string;
  name?: string; // Optional name for the admin to remember what this link is
}

export interface SiteConfig {
  // Home
  homeHeroImage: string;
  homeTitle: string;
  homeSubtitle: string;
  homeQuote: string;
  
  // Theory Page
  theoryHeroImage?: string;
  theoryTitle?: string;
  theorySubtitle?: string;

  // Distillates Page
  distillatesHeroImage?: string;
  distillatesTitle?: string;
  distillatesSubtitle?: string;
}

export interface AppData {
  cocktails: Cocktail[];
  theory: TheorySection[];
  certificates: Certificate[];
  sharedLinks: ShareLink[];
  siteConfig: SiteConfig;
}
