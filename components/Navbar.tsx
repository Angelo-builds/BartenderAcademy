
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, Martini, GraduationCap, BookOpen, FlaskConical, Sparkles, Calculator, Wine, LogIn, LogOut } from 'lucide-react';
import { useAppStore } from '../store';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme, isAdmin, language, setLanguage, t, logout, user } = useAppStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
      setLanguage(language === 'it' ? 'en' : 'it');
  };

  // --- REUSABLE STYLES ---
  // Base style for the "Pill" button - Added transform-gpu for performance
  const baseItemClass = "relative flex items-center justify-center h-10 rounded-full transition-all duration-300 ease-out overflow-hidden transform-gpu backface-hidden";
  
  // Style when item is inactive (gray) vs active (orange/highlighted)
  // UPDATED: Uses dark:bg-white/10 and dark:text-night-azure for Dark Mode
  const getItemClass = (active: boolean) => 
    `${baseItemClass} ${active 
        ? 'bg-gray-100 dark:bg-white/10 text-brand-orange dark:text-night-azure shadow-inner w-auto px-4' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 w-10 group-hover/section:w-auto group-hover/section:px-4'
    }`;
  
  // Style for the text span that reveals itself
  // Added will-change-max-width to hint browser about layout changes
  const textClass = (active: boolean) => 
    `whitespace-nowrap font-bold text-xs uppercase tracking-wide transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden will-change-[max-width,opacity]
     ${active 
        ? 'max-w-[150px] opacity-100 ml-2' 
        : 'max-w-0 opacity-0 group-hover/section:max-w-[150px] group-hover/section:opacity-100 group-hover/section:ml-2'
     }`;

  // Helper component for Nav Items
  const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link to={to} className={getItemClass(active)}>
        <Icon size={18} strokeWidth={active ? 2.5 : 2} className="flex-shrink-0" />
        <span className={textClass(active)}>
            {label}
        </span>
    </Link>
  );

  // High contrast separator
  const Separator = () => (
    <div className="hidden md:block w-[1.5px] h-5 bg-gray-300 dark:bg-gray-700 mx-2 self-center rounded-full opacity-70"></div>
  );

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* UNIFIED CONTAINER */}
        {/* Added transform-gpu to the main container */}
        <div className="pointer-events-auto bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-2xl shadow-black/10 rounded-full p-1.5 flex items-center gap-0 transition-all duration-300 max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar transform-gpu">
          
          {/* 1. LOGO SECTION */}
          <Link to="/" className="flex items-center gap-0 group/logo pr-2 pl-1">
             <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-red-600 dark:from-night-blue dark:to-night-azure shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20 group-hover/logo:scale-105 transition-transform flex-shrink-0">
                <Martini className="text-white w-5 h-5 -ml-0.5" strokeWidth={2.5} />
            </div>
            {/* Logo Text - Reveals on hover (Desktop) / Always visible (Mobile) */}
            <div className="max-w-[150px] opacity-100 ml-3 md:max-w-0 md:opacity-0 md:ml-0 md:group-hover/logo:max-w-[150px] md:group-hover/logo:opacity-100 md:group-hover/logo:ml-3 overflow-hidden transition-all duration-500 ease-out flex flex-col justify-center whitespace-nowrap will-change-[max-width]">
                <span className="text-gray-900 dark:text-white font-black text-sm leading-none tracking-tight">
                BARTENDER
                </span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] leading-none mt-0.5">
                ACADEMY
                </span>
            </div>
          </Link>

          <Separator />

          {/* 2. MENU ITEMS (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
              
              {/* Theory Group */}
              <div className="group/section flex items-center gap-1">
                  <NavItem to="/theory" icon={BookOpen} label={t.nav.theory} active={isActive('/theory')} />
                  <NavItem to="/distillates" icon={FlaskConical} label={t.nav.distillates} active={isActive('/distillates')} />
              </div>

              <Separator />

              {/* School Group */}
              <div className="group/section flex items-center gap-1">
                   <NavItem to="/school" icon={GraduationCap} label={t.nav.training} active={isActive('/school')} />
              </div>

              <Separator />

              {/* Practice Group */}
              <div className="group/section flex items-center gap-1">
                  <NavItem to="/cocktails" icon={Wine} label={t.nav.cocktails} active={isActive('/cocktails')} />
                  <NavItem to="/lab" icon={Sparkles} label={t.nav.lab} active={isActive('/lab')} />
              </div>

              <Separator />

              {/* Tools Group */}
              <div className="group/section flex items-center gap-1">
                  <NavItem to="/tools" icon={Calculator} label="Tools" active={isActive('/tools')} />
              </div>

              <Separator />

              {/* Settings Group */}
              <div className="flex items-center gap-1">
                 <button onClick={toggleLanguage} className="w-10 h-10 flex items-center justify-center rounded-full text-[10px] font-black text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    {language === 'it' ? 'IT' : 'EN'}
                 </button>
                 <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                     {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
              </div>

              <Separator />

              {/* User Group */}
              <div className="group/section flex items-center gap-1">
                 {user ? (
                     <>
                        <NavItem to="/admin" icon={User} label="Admin" active={isActive('/admin')} />
                        <button 
                            onClick={logout} 
                            className="relative flex items-center justify-center h-10 w-10 group-hover/section:w-auto group-hover/section:px-4 rounded-full transition-all duration-300 ease-out overflow-hidden text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={18} className="flex-shrink-0" />
                            <span className="whitespace-nowrap font-bold text-xs uppercase tracking-wide max-w-0 opacity-0 group-hover/section:max-w-[150px] group-hover/section:opacity-100 group-hover/section:ml-2 transition-all duration-300 overflow-hidden">
                                {language === 'it' ? 'Esci' : 'Logout'}
                            </span>
                        </button>
                     </>
                 ) : (
                    <NavItem to="/admin" icon={LogIn} label={language === 'it' ? 'Accedi' : 'Login'} active={isActive('/admin')} />
                 )}
              </div>
          </div>

          {/* 3. MOBILE TOGGLE */}
          <div className="md:hidden ml-auto pl-2">
             <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
          </div>
          
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl animate-fadeIn pt-28 px-6 flex flex-col items-center gap-6 overflow-y-auto">
            <Link to="/theory" onClick={() => setIsOpen(false)} className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3"><BookOpen size={20} />{t.nav.theory}</Link>
            <Link to="/distillates" onClick={() => setIsOpen(false)} className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3"><FlaskConical size={20} />{t.nav.distillates}</Link>
            <div className="w-12 h-px bg-gray-200 dark:bg-gray-800"></div>
            <Link to="/school" onClick={() => setIsOpen(false)} className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3"><GraduationCap size={20} />{t.nav.training}</Link>
            <div className="w-12 h-px bg-gray-200 dark:bg-gray-800"></div>
            <Link to="/cocktails" onClick={() => setIsOpen(false)} className="text-xl font-bold text-brand-orange dark:text-night-azure flex items-center gap-3"><Wine size={20} />{t.nav.cocktails}</Link>
            <Link to="/lab" onClick={() => setIsOpen(false)} className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-3"><Sparkles size={20} />{t.nav.lab}</Link>
            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
            <Link to="/tools" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2"><Calculator size={20} /> Bar Tools</Link>
            <button onClick={() => {toggleLanguage(); setIsOpen(false);}} className="text-lg font-bold text-gray-500">
                {language === 'it' ? 'Lingua: Italiano' : 'Language: English'}
            </button>
            {user ? (
               <>
                 <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-500 flex items-center gap-2">
                    <User size={20} /> Admin Dashboard
                 </Link>
                 <button onClick={() => {logout(); setIsOpen(false);}} className="text-lg font-bold text-red-500 flex items-center gap-2">
                    <LogOut size={20} /> {language === 'it' ? 'Esci' : 'Logout'}
                 </button>
               </>
            ) : (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-500 flex items-center gap-2">
                     <LogIn size={20} /> {language === 'it' ? 'Accedi' : 'Login'}
                </Link>
            )}
        </div>
      )}
    </>
  );
};

export default Navbar;
