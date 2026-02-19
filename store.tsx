
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
  
  // Storage
  uploadImage: (file: File) => Promise<string | null>;

  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to check if ID is a legacy local string (short) or a DB UUID (long)
const isLocalId = (id: string) => id.length < 30;

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
        const { data: configData } = await supabase.from('site_config').select('*').single();

        // --- MERGE STRATEGY COCKTAILS ---
        let finalCocktails = [...localData.cocktails];
        
        if (cocktailsData) {
            const dbCocktails = cocktailsData as Cocktail[];
            const dbCocktailMap = new Map(dbCocktails.map(c => [c.id, c]));
            
            // Deduplication: If a local cocktail (e.g. c102 Americano) has a namesake in DB (UUID Americano),
            // it means we already migrated it. We prefer the DB version and drop the local legacy one.
            const dbNames = new Set(dbCocktails.map(c => c.name.toLowerCase().trim()));

            finalCocktails = finalCocktails.filter(localC => {
                // If local ID exists in DB map, we keep it (it will be updated next step)
                if (dbCocktailMap.has(localC.id)) return true;
                
                // If it's a Legacy ID AND the name already exists in DB, drop the local duplicate
                if (isLocalId(localC.id) && dbNames.has(localC.name.toLowerCase().trim())) {
                    return false; 
                }
                return true;
            });

            // Update local items that match DB IDs
            finalCocktails = finalCocktails.map(localC => 
                dbCocktailMap.has(localC.id) ? dbCocktailMap.get(localC.id) as Cocktail : localC
            );

            // Add new items from DB
            const currentIds = new Set(finalCocktails.map(c => c.id));
            const newDbItems = dbCocktails.filter(c => !currentIds.has(c.id));
            finalCocktails = [...finalCocktails, ...newDbItems];
        }

        // --- MERGE STRATEGY THEORY ---
        let finalTheory = [...localData.theory];
        if (theoryData) {
            const dbTheory = theoryData as TheorySection[];
            const dbTheoryMap = new Map(dbTheory.map(t => [t.id, t]));
            const dbTitles = new Set(dbTheory.map(t => t.title.toLowerCase().trim()));

            finalTheory = finalTheory.filter(localT => {
                if (dbTheoryMap.has(localT.id)) return true;
                if (isLocalId(localT.id) && dbTitles.has(localT.title.toLowerCase().trim())) return false;
                return true;
            });

            finalTheory = finalTheory.map(localT => 
                dbTheoryMap.has(localT.id) ? dbTheoryMap.get(localT.id) as TheorySection : localT
            );
            const currentIds = new Set(finalTheory.map(t => t.id));
            const newDbItems = dbTheory.filter(t => !currentIds.has(t.id));
            finalTheory = [...finalTheory, ...newDbItems];
        }

        setData({
            cocktails: finalCocktails,
            theory: finalTheory,
            certificates: certsData || [],
            sharedLinks: [],
            siteConfig: configData ? { ...localData.siteConfig, ...configData } : localData.siteConfig
        });

      } catch (error) {
        console.error("Error fetching data:", error);
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

  // --- AUTH ---
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // --- STORAGE ---
  const uploadImage = async (file: File): Promise<string | null> => {
      try {
          // SANITIZATION: Remove special characters, spaces, and ensure ASCII only for filename
          // This prevents Supabase/S3 from rejecting files or creating broken links.
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
          const fileName = `${Date.now()}-${cleanName}.${fileExt}`;
          const filePath = `${fileName}`;

          console.log(`Uploading file as: ${filePath}`);

          const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
          });

          if (uploadError) {
              console.error('Error uploading image:', uploadError);
              alert(`Errore upload: ${uploadError.message}. Controlla i permessi del bucket 'images'.`);
              return null;
          }

          const { data } = supabase.storage.from('images').getPublicUrl(filePath);

          console.log("Upload success, public URL:", data.publicUrl);
          return data.publicUrl;
      } catch (error) {
          console.error('Error in uploadImage:', error);
          alert('Errore imprevisto durante l\'upload.');
          return null;
      }
  };

  // --- COCKTAILS ---
  const addCocktail = async (cocktail: Cocktail) => {
    setData(prev => ({ ...prev, cocktails: [...prev.cocktails, cocktail] }));
    const { error } = await supabase.from('cocktails').insert([cocktail]);
    if (error) { console.error("DB Insert Error:", error); alert(`Errore DB: ${error.message}`); }
  };
  
  // SMART UPDATE: Handles Migration from Local ID -> UUID
  const updateCocktail = async (cocktail: Cocktail) => {
    // If it's a Legacy Local ID (e.g. 'c102'), we must migrate it to a UUID
    if (isLocalId(cocktail.id)) {
        const newId = crypto.randomUUID();
        const newCocktail = { ...cocktail, id: newId };
        
        console.log(`Migrating Cocktail ${cocktail.name} (ID: ${cocktail.id}) to DB (UUID: ${newId})`);

        // Update local state: Replace old item with new item
        setData(prev => ({
            ...prev,
            cocktails: prev.cocktails.map(c => c.id === cocktail.id ? newCocktail : c)
        }));

        // Insert as NEW record in Supabase
        const { error } = await supabase.from('cocktails').insert(newCocktail);
        if (error) { 
            console.error("Migration Error:", error); 
            alert(`Errore Migrazione DB: ${error.message}`); 
        } else {
            alert("Cocktail salvato e migrato sul database con successo!");
        }
    } else {
        // Standard Update for existing DB items
        setData(prev => ({ ...prev, cocktails: prev.cocktails.map(c => c.id === cocktail.id ? cocktail : c) }));
        const { error } = await supabase.from('cocktails').upsert(cocktail);
        if (error) { 
            console.error("DB Update Error:", error); 
            alert(`Errore DB: ${error.message}`); 
        }
    }
  };
  
  const deleteCocktail = async (id: string) => {
    setData(prev => ({ ...prev, cocktails: prev.cocktails.filter(c => c.id !== id) }));
    if (!isLocalId(id)) {
        await supabase.from('cocktails').delete().eq('id', id);
    }
  };

  // --- THEORY ---
  const addTheory = async (theory: TheorySection) => {
    setData(prev => ({ ...prev, theory: [...prev.theory, theory] }));
    const { error } = await supabase.from('theory').insert([theory]);
    if (error) { console.error("DB Insert Error:", error); alert(`Errore DB: ${error.message}`); }
  };
  
  // SMART UPDATE THEORY
  const updateTheory = async (theory: TheorySection) => {
    if (isLocalId(theory.id)) {
        const newId = crypto.randomUUID();
        const newTheory = { ...theory, id: newId };
        
        setData(prev => ({
            ...prev,
            theory: prev.theory.map(t => t.id === theory.id ? newTheory : t)
        }));

        const { error } = await supabase.from('theory').insert(newTheory);
        if (error) { console.error("Migration Error:", error); alert(`Errore Migrazione DB: ${error.message}`); }
    } else {
        setData(prev => ({ ...prev, theory: prev.theory.map(t => t.id === theory.id ? theory : t) }));
        const { error } = await supabase.from('theory').upsert(theory);
        if (error) { console.error("DB Update Error:", error); alert(`Errore DB: ${error.message}`); }
    }
  };
  
  const deleteTheory = async (id: string) => {
    setData(prev => ({ ...prev, theory: prev.theory.filter(t => t.id !== id) }));
    if (!isLocalId(id)) {
        await supabase.from('theory').delete().eq('id', id);
    }
  };

  // --- CERTIFICATES ---
  const addCertificate = async (cert: Certificate) => {
    setData(prev => ({ ...prev, certificates: [...prev.certificates, cert] }));
    const { error } = await supabase.from('certificates').insert([cert]);
    if (error) { console.error("DB Insert Error:", error); alert(`Errore DB: ${error.message}`); }
  };
  
  const updateCertificate = async (cert: Certificate) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.map(c => c.id === cert.id ? cert : c) }));
    const { error } = await supabase.from('certificates').upsert(cert);
    if (error) { console.error("DB Update Error:", error); alert(`Errore DB: ${error.message}`); }
  };
  
  const deleteCertificate = async (id: string) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.filter(c => c.id !== id) }));
    await supabase.from('certificates').delete().eq('id', id);
  };

  // --- SHARE LINKS & CONFIG ---
  const createShareLink = async (ids: string[], expires: string | null, name: string) => {
      const shareId = Math.random().toString(36).substring(2, 10);
      const newLink: ShareLink = { id: shareId, certificateIds: ids, expirationDate: expires, createdDate: new Date().toISOString(), name };
      setData(prev => ({ ...prev, sharedLinks: [...prev.sharedLinks, newLink] }));
      return shareId;
  };
  const getSharedLink = (id: string) => data.sharedLinks.find(l => l.id === id);

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
      uploadImage,
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
