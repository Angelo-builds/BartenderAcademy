
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, Globe, Martini } from 'lucide-react';
import { useAppStore } from '../store';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme, isAdmin, language, setLanguage, t } = useAppStore();
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
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/80 dark:bg-black/90 backdrop-blur-xl border border-white/40 dark:border-white/10 dark:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-full px-2 py-2 shadow-2xl shadow-black/5 transition-all duration-500 max-w-5xl w-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 pl-4 pr-6 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-red-600 dark:from-blue-600 dark:to-night-azure shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20 group-hover:shadow-orange-500/40 dark:group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Martini className="text-white w-5 h-5 -ml-0.5 group-hover:-rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col justify-center">
                <span className="hidden sm:block text-gray-900 dark:text-white font-black text-lg leading-none tracking-tight group-hover:text-brand-orange dark:group-hover:text-night-azure transition-colors">
                BARTENDER
                </span>
                <span className="hidden sm:block text-[10px] font-bold text-gray-400 dark:text-night-azure uppercase tracking-[0.3em] leading-none transition-colors mt-0.5">
                SCHOOL
                </span>
            </div>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                {isActive(link.path) && (
                    <span className="absolute inset-0 bg-gray-900 dark:bg-night-blue rounded-full -z-10 animate-scale-in shadow-sm"></span>
                )}
                {/* Text is handled by parent class, explicit span removed for cleaner DOM */}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pl-4 pr-2">
             <button
              onClick={toggleLanguage}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:rotate-12"
            >
               <span key={language} className="text-xs font-black uppercase animate-slide-down">{language}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
            >
               <div key={isDarkMode ? 'dark' : 'light'} className="animate-scale-in">
                 {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
               </div>
            </button>
            
            <Link 
              to="/admin" 
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 ${isAdmin ? 'bg-brand-orange dark:bg-night-blue text-white shadow-lg shadow-brand-orange/40 dark:shadow-blue-500/40' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
            >
                 <User size={16} />
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-fadeIn pt-24 px-6 flex flex-col items-center">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`w-full text-center py-4 text-2xl font-bold border-b border-gray-100 dark:border-gray-800 transition-all ${
                   isActive(link.path)
                      ? 'text-brand-orange dark:text-night-azure'
                      : 'text-gray-900 dark:text-white'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
