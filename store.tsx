
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Cocktail, TheorySection, Language, SiteConfig, Certificate, ShareLink } from './types';
import { getInitialData, theory_IT, cocktails_IT } from './data';
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
  bulkUpdateCocktails: (cocktails: Cocktail[]) => Promise<void>;
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

// Fallback for crypto.randomUUID
export const generateUUID = () => {
  try {
    // Try window.crypto first (most common in browsers)
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    // Try global crypto (Node.js or some browser environments)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch (e) {
    console.warn('Native randomUUID failed, using fallback:', e);
  }

  // Fallback: Math.random based UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme State - Persisted
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('bartender_theme');
          if (saved) return saved === 'dark';
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
  });

  // Language State - Persisted
  const [language, setLanguageState] = useState<Language>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('bartender_language');
          return (saved === 'it' || saved === 'en') ? saved : 'it';
      }
      return 'it';
  });

  const setLanguage = (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem('bartender_language', lang);
  };

  // Always start with the correct local data based on language
  const [data, setData] = useState<AppData>(() => getInitialData(language));
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  const toggleTheme = () => {
      setIsDarkMode(prev => {
          const newMode = !prev;
          localStorage.setItem('bartender_theme', newMode ? 'dark' : 'light');
          return newMode;
      });
  };

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
        // Goal: Respect DB deletions/additions but PRESERVE local translations.
        let finalCocktails = [...localData.cocktails];
        
        if (cocktailsData) {
            const dbCocktails = cocktailsData as Cocktail[];
            const dbIdMap = new Set(dbCocktails.map(c => c.id));
            const dbSlugMap = new Set(dbCocktails.map(c => c.slug).filter(Boolean));
            const dbNameMap = new Set(dbCocktails.map(c => c.name.toLowerCase()));

            // 1. Filter Local: Keep if ID matches OR if Slug/Name matches (to preserve local translation)
            finalCocktails = finalCocktails.filter(c => {
                if (dbIdMap.has(c.id)) return true;
                if (c.slug && dbSlugMap.has(c.slug)) return true;
                if (dbNameMap.has(c.name.toLowerCase())) return true;
                return false; // Deleted in DB
            });

            // 2. Add New from DB
            const localIds = new Set(finalCocktails.map(c => c.id));
            const localSlugs = new Set(finalCocktails.map(c => c.slug).filter(Boolean));
            const localNames = new Set(finalCocktails.map(c => c.name.toLowerCase()));

            const newDbItems = dbCocktails.filter(c => {
                if (localIds.has(c.id)) return false;
                if (c.slug && localSlugs.has(c.slug)) return false;
                if (localNames.has(c.name.toLowerCase())) return false;
                return true;
            });
            
            finalCocktails = [...finalCocktails, ...newDbItems];
        }

        // --- MERGE STRATEGY THEORY ---
        let finalTheory = [...localData.theory];
        
        if (theoryData) {
            const dbTheory = theoryData as TheorySection[];
            const dbIdMap = new Set(dbTheory.map(t => t.id));
            const dbSlugMap = new Set(dbTheory.map(t => t.slug).filter(Boolean));
            const dbTitleMap = new Map(dbTheory.map(t => [t.title.toLowerCase(), t]));

            // Helper to find DB match for a local item
            const findDbMatch = (localItem: TheorySection) => {
                // 1. Try ID (if UUID match)
                if (dbIdMap.has(localItem.id)) return dbTheory.find(t => t.id === localItem.id);
                
                // 2. Try Slug
                if (localItem.slug && dbSlugMap.has(localItem.slug)) return dbTheory.find(t => t.slug === localItem.slug);

                // 3. Try Title (Direct match)
                if (dbTitleMap.has(localItem.title.toLowerCase())) return dbTitleMap.get(localItem.title.toLowerCase());

                // 4. Try Cross-Language Title Match (The Fix!)
                // Find the Italian version of this local item (by ID)
                const itVersion = theory_IT.find(it => it.id === localItem.id);
                if (itVersion && dbTitleMap.has(itVersion.title.toLowerCase())) {
                    return dbTitleMap.get(itVersion.title.toLowerCase());
                }

                return null;
            };

            const matchedDbIds = new Set<string>();

            // 1. Update Local Items with DB Status/Image if match found
            finalTheory = finalTheory.map(localItem => {
                const match = findDbMatch(localItem);
                if (match) {
                    matchedDbIds.add(match.id);
                    // Keep Local Content (Title, Content) but take DB Status and Image (if updated)
                    return {
                        ...localItem,
                        status: match.status,
                        image: match.image || localItem.image, // Prefer DB image if exists? Or maybe only if changed? Let's assume DB is source of truth for media.
                        // We do NOT overwrite title/content to preserve language
                    };
                }
                return localItem;
            });

            // 2. Add New from DB (that were NOT matched to any local item)
            const newDbItems = dbTheory.filter(t => !matchedDbIds.has(t.id));
            
            // Filter out items that might be duplicates but missed by matching (safety net)
            // e.g. if we are in EN, and we have "Glassware", and DB has "Cristalleria" (which we matched), we don't want to add "Cristalleria" again.
            // The matchedDbIds check handles this.

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
            mergedConfig.theoryTitleEn = configData.theoryTitleEn || mergedConfig.theoryTitleEn;
            mergedConfig.theorySubtitle = configData.theorySubtitle || mergedConfig.theorySubtitle;
            mergedConfig.theorySubtitleEn = configData.theorySubtitleEn || mergedConfig.theorySubtitleEn;
            
            mergedConfig.distillatesTitle = configData.distillatesTitle || mergedConfig.distillatesTitle;
            mergedConfig.distillatesTitleEn = configData.distillatesTitleEn || mergedConfig.distillatesTitleEn;
            mergedConfig.distillatesSubtitle = configData.distillatesSubtitle || mergedConfig.distillatesSubtitle;
            mergedConfig.distillatesSubtitleEn = configData.distillatesSubtitleEn || mergedConfig.distillatesSubtitleEn;

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
        const newId = generateUUID();
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

  const bulkUpdateCocktails = async (cocktails: Cocktail[]) => {
    // Ensure all items have an ID
    const toUpsert = cocktails.map(c => ({
        ...c,
        id: c.id || generateUUID()
    }));
    
    // Find IDs to delete (exist in current data but not in new data)
    const newIds = toUpsert.map(c => c.id);
    const toDelete = data.cocktails.filter(c => !newIds.includes(c.id)).map(c => c.id);
    
    // Update local state immediately
    setData(prev => ({ ...prev, cocktails: toUpsert }));
    
    // Upsert to Supabase
    if (toUpsert.length > 0) {
        const { error: upsertError } = await supabase.from('cocktails').upsert(toUpsert);
        if (upsertError) {
            console.error("Bulk Update Error:", upsertError);
            throw new Error(upsertError.message);
        }
    }
    
    // Delete from Supabase
    if (toDelete.length > 0) {
        const { error: deleteError } = await supabase.from('cocktails').delete().in('id', toDelete);
        if (deleteError) {
            console.error("Bulk Delete Error:", deleteError);
            throw new Error(deleteError.message);
        }
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
        const newId = generateUUID();
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
      addCocktail, updateCocktail, deleteCocktail, bulkUpdateCocktails,
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
