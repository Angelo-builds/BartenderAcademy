
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
  
  // System
  uploadLocalDataToDb: () => Promise<string[]>; // Returns logs
  
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
        let finalCocktails: Cocktail[] = [];
        
        if (cocktailsData && cocktailsData.length > 0) {
            // If DB has data, use it as the single source of truth.
            // This prevents deleted items (which exist in local data.ts) from reappearing.
            finalCocktails = cocktailsData as Cocktail[];
        } else {
            // Only fall back to local data if DB is completely empty
            finalCocktails = [...localData.cocktails];
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

        // --- MERGE STRATEGY CONFIG ---
        // Simple merge: Use DB values if present, otherwise local defaults
        const mergedConfig = { ...localData.siteConfig };
        
        if (configData) {
            mergedConfig.homeTitle = configData.homeTitle || mergedConfig.homeTitle;
            mergedConfig.homeSubtitle = configData.homeSubtitle || mergedConfig.homeSubtitle;
            mergedConfig.homeSubtitleEn = configData.homeSubtitleEn || mergedConfig.homeSubtitleEn; // Load the new field
            mergedConfig.homeQuote = configData.homeQuote || mergedConfig.homeQuote;
            
            mergedConfig.theoryTitle = configData.theoryTitle || mergedConfig.theoryTitle;
            mergedConfig.theorySubtitle = configData.theorySubtitle || mergedConfig.theorySubtitle;
            
            mergedConfig.distillatesTitle = configData.distillatesTitle || mergedConfig.distillatesTitle;
            mergedConfig.distillatesSubtitle = configData.distillatesSubtitle || mergedConfig.distillatesSubtitle;

            // Images
            mergedConfig.homeHeroImage = configData.homeHeroImage || mergedConfig.homeHeroImage;
            mergedConfig.theoryHeroImage = configData.theoryHeroImage || mergedConfig.theoryHeroImage;
            mergedConfig.distillatesHeroImage = configData.distillatesHeroImage || mergedConfig.distillatesHeroImage;
        }

        setData({
            cocktails: finalCocktails,
            theory: finalTheory,
            certificates: certsData || [],
            sharedLinks: [],
            siteConfig: mergedConfig
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
              return null;
          }

          const { data } = supabase.storage.from('images').getPublicUrl(filePath);
          return data.publicUrl;
      } catch (error) {
          console.error('Error in uploadImage:', error);
          return null;
      }
  };

  // --- SYSTEM: SYNC LOCAL TO DB ---
  const uploadLocalDataToDb = async (): Promise<string[]> => {
      const logs: string[] = [];
      const addLog = (msg: string) => {
          console.log(msg);
          logs.push(msg);
      };

      addLog(">>> AVVIO SINCRONIZZAZIONE <<<");
      
      if (!user) {
          addLog("❌ ERRORE: Utente non loggato. Accesso Admin richiesto.");
          return logs;
      }

      // Use Italian data as the source of truth for structure
      const localData = getInitialData('it');
      
      let successCount = 0;
      let errorCount = 0;

      try {
          // 1. CONFIG
          addLog("--- Elaborazione Configurazione Sito ---");
          const cleanConfig = JSON.parse(JSON.stringify(localData.siteConfig));
          const { error: configError } = await supabase.from('site_config').upsert({ id: 1, ...cleanConfig });
          
          if (configError) {
              addLog(`❌ Errore Config: ${configError.message}`);
              errorCount++;
          } else {
              addLog("✅ Configurazione aggiornata");
          }

          // 2. COCKTAILS
          addLog(`--- Elaborazione ${localData.cocktails.length} Cocktails ---`);
          for (const c of localData.cocktails) {
              // Prepare payload without local ID to let DB generate UUID if it's new
              // However, we want to UPSERT based on name to avoid duplicates and fix partial data
              const { id, ...payload } = c;
              
              // We check if it exists by Name first to get its UUID if present
              const { data: existing } = await supabase.from('cocktails').select('id').eq('name', c.name).maybeSingle();
              
              let dbOperation;
              
              if (existing) {
                  // Update existing
                  dbOperation = supabase.from('cocktails').update({ ...payload, ingredients: payload.ingredients }).eq('id', existing.id);
                  addLog(`🔄 Aggiornamento: ${c.name}`);
              } else {
                  // Insert new
                  dbOperation = supabase.from('cocktails').insert({ ...payload, ingredients: payload.ingredients });
                  addLog(`✨ Inserimento: ${c.name}`);
              }

              const { error } = await dbOperation;

              if (error) {
                  addLog(`❌ Errore su '${c.name}': ${error.message}`);
                  errorCount++;
              } else {
                  successCount++;
              }
          }

          // 3. THEORY
          addLog(`--- Elaborazione ${localData.theory.length} Sezioni Teoria ---`);
          for (const th of localData.theory) {
              const { id, ...payload } = th;
              const { data: existing } = await supabase.from('theory').select('id').eq('title', th.title).maybeSingle();

              let dbOperation;
              if (existing) {
                  dbOperation = supabase.from('theory').update(payload).eq('id', existing.id);
                  addLog(`🔄 Aggiornamento Teoria: ${th.title}`);
              } else {
                  dbOperation = supabase.from('theory').insert(payload);
                  addLog(`✨ Inserimento Teoria: ${th.title}`);
              }

              const { error } = await dbOperation;

              if (error) {
                  addLog(`❌ Errore Teoria '${th.title}': ${error.message}`);
                  errorCount++;
              } else {
                  successCount++;
              }
          }

          addLog(">>> SINCRONIZZAZIONE COMPLETATA <<<");
          addLog(`Riepilogo: ${successCount} Successi, ${errorCount} Errori.`);

      } catch (globalError: any) {
          addLog(`❌ CRITICAL ERROR: ${globalError.message}`);
      }
      
      return logs;
  };

  // --- COCKTAILS ---
  const addCocktail = async (cocktail: Cocktail) => {
    setData(prev => ({ ...prev, cocktails: [...prev.cocktails, cocktail] }));
    const { error } = await supabase.from('cocktails').insert([cocktail]);
    if (error) { console.error("DB Insert Error:", error); }
  };
  
  const updateCocktail = async (cocktail: Cocktail) => {
    if (isLocalId(cocktail.id)) {
        const newId = crypto.randomUUID();
        const newCocktail = { ...cocktail, id: newId };
        
        setData(prev => ({
            ...prev,
            cocktails: prev.cocktails.map(c => c.id === cocktail.id ? newCocktail : c)
        }));

        const { error } = await supabase.from('cocktails').insert(newCocktail);
        if (error) { console.error(`Migration Error: ${error.message}`); }
    } else {
        setData(prev => ({ ...prev, cocktails: prev.cocktails.map(c => c.id === cocktail.id ? cocktail : c) }));
        const { error } = await supabase.from('cocktails').upsert(cocktail);
        if (error) { console.error(`DB Error: ${error.message}`); }
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
    if (error) { console.error("DB Insert Error:", error); }
  };
  
  const updateTheory = async (theory: TheorySection) => {
    if (isLocalId(theory.id)) {
        const newId = crypto.randomUUID();
        const newTheory = { ...theory, id: newId };
        setData(prev => ({ ...prev, theory: prev.theory.map(t => t.id === theory.id ? newTheory : t) }));
        const { error } = await supabase.from('theory').insert(newTheory);
        if (error) { console.error("Migration Error:", error); }
    } else {
        setData(prev => ({ ...prev, theory: prev.theory.map(t => t.id === theory.id ? theory : t) }));
        const { error } = await supabase.from('theory').upsert(theory);
        if (error) { console.error("DB Update Error:", error); }
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
    if (error) { console.error("DB Insert Error:", error); }
  };
  
  const updateCertificate = async (cert: Certificate) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.map(c => c.id === cert.id ? cert : c) }));
    const { error } = await supabase.from('certificates').upsert(cert);
    if (error) { console.error("DB Update Error:", error); }
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
    const { error } = await supabase.from('site_config').upsert({ id: 1, ...config });
    
    if (error) {
        console.error("Config Update Error:", error);
    }
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
      uploadLocalDataToDb, // Exposed for Admin
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
