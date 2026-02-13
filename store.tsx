
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Cocktail, TheorySection, Language, SiteConfig } from './types';
import { getInitialData } from './data';
import { translations } from './translations';

interface AppContextType {
  data: AppData;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['it'];
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addCocktail: (cocktail: Cocktail) => void;
  updateCocktail: (cocktail: Cocktail) => void;
  deleteCocktail: (id: string) => void;
  setCocktails: (cocktails: Cocktail[]) => void;
  addTheory: (theory: TheorySection) => void;
  updateTheory: (theory: TheorySection) => void;
  deleteTheory: (id: string) => void;
  updateSiteConfig: (config: SiteConfig) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');
  // Load data based on current language
  const [data, setData] = useState<AppData>(getInitialData('it'));
  
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // When language changes, reset data to that language's initial set
  // Note: in a real app with backend, we would fetch the locale data.
  // Here we re-initialize. If the user added custom drinks in 'IT', they won't appear in 'EN' automatically
  // unless we implemented a complex sync. For this demo, switching language switches the dataset.
  useEffect(() => {
    setData(getInitialData(language));
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

  const login = (password: string) => {
    if (password === 'admin123') { 
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  // --- Cocktails ---
  const addCocktail = (cocktail: Cocktail) => {
    setData(prev => ({
      ...prev,
      cocktails: [...prev.cocktails, cocktail]
    }));
  };

  const updateCocktail = (cocktail: Cocktail) => {
    setData(prev => ({
      ...prev,
      cocktails: prev.cocktails.map(c => c.id === cocktail.id ? cocktail : c)
    }));
  };

  const deleteCocktail = (id: string) => {
    setData(prev => ({
      ...prev,
      cocktails: prev.cocktails.filter(c => c.id !== id)
    }));
  };

  const setCocktails = (cocktails: Cocktail[]) => {
    setData(prev => ({
      ...prev,
      cocktails
    }));
  };

  // --- Theory ---
  const addTheory = (theory: TheorySection) => {
    setData(prev => ({
      ...prev,
      theory: [...prev.theory, theory]
    }));
  };

  const updateTheory = (updatedSection: TheorySection) => {
    setData(prev => ({
      ...prev,
      theory: prev.theory.map(t => t.id === updatedSection.id ? updatedSection : t)
    }));
  };

  const deleteTheory = (id: string) => {
    setData(prev => ({
      ...prev,
      theory: prev.theory.filter(t => t.id !== id)
    }));
  };

  // --- Site Config ---
  const updateSiteConfig = (config: SiteConfig) => {
    setData(prev => ({
      ...prev,
      siteConfig: config
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      language,
      setLanguage,
      t,
      isAdmin,
      login,
      logout,
      addCocktail,
      updateCocktail,
      deleteCocktail,
      setCocktails,
      addTheory,
      updateTheory,
      deleteTheory,
      updateSiteConfig,
      isDarkMode,
      toggleTheme
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
