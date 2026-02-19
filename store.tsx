
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Cocktail, TheorySection, Language, SiteConfig, Certificate, ShareLink } from './types';
import { getInitialData } from './data';
import { translations } from './translations';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['it'];
  
  // Auth
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // CRUD Actions
  addCocktail: (cocktail: Cocktail) => Promise<void>;
  updateCocktail: (cocktail: Cocktail) => Promise<void>;
  deleteCocktail: (id: string) => Promise<void>;
  addTheory: (theory: TheorySection) => Promise<void>;
  updateTheory: (theory: TheorySection) => Promise<void>;
  deleteTheory: (id: string) => Promise<void>;
  addCertificate: (cert: Certificate) => Promise<void>;
  updateCertificate: (cert: Certificate) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  createShareLink: (ids: string[], expires: string | null, name: string) => Promise<string>;
  getSharedLink: (id: string) => ShareLink | undefined;
  updateSiteConfig: (config: SiteConfig) => Promise<void>;
  
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');
  
  // Always start with the correct local data based on language to ensure translations are immediate
  const [data, setData] = useState<AppData>(getInitialData('it'));
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Favorites State (Persisted in LocalStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
      const saved = localStorage.getItem('bartender_favorites');
      return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
      setFavorites(prev => {
          const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
          localStorage.setItem('bartender_favorites', JSON.stringify(newFavs));
          return newFavs;
      });
  };

  // Initial Fetch & Auth Check
  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 3. Load Data with Localization Logic
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const localData = getInitialData(language);
        
        const { data: cocktailsData } = await supabase.from('cocktails').select('*');
        const { data: theoryData } = await supabase.from('theory').select('*');
        const { data: certsData } = await supabase.from('certificates').select('*');
        
        // Config fetch
        const { data: configData } = await supabase.from('site_config').select('*').single();

        // MERGE STRATEGY:
        // 1. Start with Local Data (which has the correct Language).
        // 2. If Supabase has data, check if it's a "User Added" item (ID not in local) or a "Base" item.
        // 3. If it's a Base item, we prefer the Local Data (to keep translation) UNLESS the user explicitly wants to use DB edits (omitted here for simple translation support).
        // 4. If it's a User Added item (new UUID), we append it.

        let finalCocktails = localData.cocktails;
        if (cocktailsData) {
            const localIds = new Set(localData.cocktails.map(c => c.id));
            const userAddedCocktails = cocktailsData.filter(c => !localIds.has(c.id));
            finalCocktails = [...localData.cocktails, ...userAddedCocktails];
        }

        let finalTheory = localData.theory;
        if (theoryData) {
            const localIds = new Set(localData.theory.map(t => t.id));
            const userAddedTheory = theoryData.filter(t => !localIds.has(t.id));
            finalTheory = [...localData.theory, ...userAddedTheory];
        }

        setData({
            cocktails: finalCocktails,
            theory: finalTheory,
            certificates: certsData || [],
            sharedLinks: [], // Shared links usually fetched on demand or separate table
            siteConfig: configData ? { ...localData.siteConfig, ...configData } : localData.siteConfig
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        setData(getInitialData(language));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => subscription.unsubscribe();
  }, [language]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const t = translations[language];

  // --- AUTH ACTIONS ---
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // --- COCKTAILS ---
  const addCocktail = async (cocktail: Cocktail) => {
    setData(prev => ({ ...prev, cocktails: [...prev.cocktails, cocktail] }));
    await supabase.from('cocktails').insert([cocktail]);
  };
  const updateCocktail = async (cocktail: Cocktail) => {
    setData(prev => ({ ...prev, cocktails: prev.cocktails.map(c => c.id === cocktail.id ? cocktail : c) }));
    await supabase.from('cocktails').update(cocktail).eq('id', cocktail.id);
  };
  const deleteCocktail = async (id: string) => {
    setData(prev => ({ ...prev, cocktails: prev.cocktails.filter(c => c.id !== id) }));
    await supabase.from('cocktails').delete().eq('id', id);
  };

  // --- THEORY ---
  const addTheory = async (theory: TheorySection) => {
    setData(prev => ({ ...prev, theory: [...prev.theory, theory] }));
    await supabase.from('theory').insert([theory]);
  };
  const updateTheory = async (theory: TheorySection) => {
    setData(prev => ({ ...prev, theory: prev.theory.map(t => t.id === theory.id ? theory : t) }));
    await supabase.from('theory').update(theory).eq('id', theory.id);
  };
  const deleteTheory = async (id: string) => {
    setData(prev => ({ ...prev, theory: prev.theory.filter(t => t.id !== id) }));
    await supabase.from('theory').delete().eq('id', id);
  };

  // --- CERTIFICATES ---
  const addCertificate = async (cert: Certificate) => {
    setData(prev => ({ ...prev, certificates: [...prev.certificates, cert] }));
    await supabase.from('certificates').insert([cert]);
  };
  const updateCertificate = async (cert: Certificate) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.map(c => c.id === cert.id ? cert : c) }));
    await supabase.from('certificates').update(cert).eq('id', cert.id);
  };
  const deleteCertificate = async (id: string) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.filter(c => c.id !== id) }));
    await supabase.from('certificates').delete().eq('id', id);
  };

  // --- SHARE LINKS ---
  const createShareLink = async (ids: string[], expires: string | null, name: string) => {
      const shareId = Math.random().toString(36).substring(2, 10);
      const newLink: ShareLink = {
          id: shareId, certificateIds: ids, expirationDate: expires, createdDate: new Date().toISOString(), name
      };
      setData(prev => ({ ...prev, sharedLinks: [...prev.sharedLinks, newLink] }));
      return shareId;
  };
  const getSharedLink = (id: string) => {
      return data.sharedLinks.find(l => l.id === id);
  };

  // --- CONFIG ---
  const updateSiteConfig = async (config: SiteConfig) => {
    setData(prev => ({ ...prev, siteConfig: config }));
    await supabase.from('site_config').upsert({ id: 1, ...config });
  };

  return (
    <AppContext.Provider value={{
      data, isLoading, language, setLanguage, t, 
      user, isAdmin: !!user, login, logout,
      favorites, toggleFavorite,
      addCocktail, updateCocktail, deleteCocktail,
      addTheory, updateTheory, deleteTheory,
      addCertificate, updateCertificate, deleteCertificate,
      createShareLink, getSharedLink, updateSiteConfig,
      isDarkMode, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
