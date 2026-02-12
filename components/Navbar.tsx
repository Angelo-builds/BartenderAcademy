import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut, User, Globe } from 'lucide-react';
import { useAppStore } from '../store';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme, isAdmin, logout, language, setLanguage, t } = useAppStore();
  const location = useLocation();

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.theory, path: '/theory' },
    { name: t.nav.distillates, path: '/distillates' },
    { name: t.nav.cocktails, path: '/cocktails' },
    { name: t.nav.comingSoon, path: '/coming-soon' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
      setLanguage(language === 'it' ? 'en' : 'it');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-red flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
                BS
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">
                Bartender<span className="font-light text-brand-orange dark:text-night-azure">School</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-gray-100 dark:bg-gray-800 text-brand-orange dark:text-night-azure shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors uppercase"
            >
              <Globe size={14} /> {language}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAdmin ? (
               <Link 
                 to="/admin" 
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity shadow-md"
               >
                 <span>{t.admin.dashboard}</span>
               </Link>
            ) : (
               <Link to="/admin" className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                 <User size={20} />
               </Link>
            )}

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 absolute w-full z-50">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium ${
                   isActive(link.path)
                      ? 'bg-gray-100 dark:bg-gray-800 text-brand-orange dark:text-night-azure'
                      : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <button onClick={() => {toggleLanguage(); setIsOpen(false);}} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300">
                Switch Language ({language.toUpperCase()})
             </button>
             {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-3 mt-4 rounded-xl bg-brand-orange text-white font-bold text-center">
                  {t.admin.dashboard}
                </Link>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;