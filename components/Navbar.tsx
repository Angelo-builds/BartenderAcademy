
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

  // Helper component for Nav Items
  const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link 
        to={to} 
        className={`relative flex items-center justify-center gap-2 px-3 py-2 rounded-full transition-all duration-300 
        ${active ? 'bg-gray-100 dark:bg-white/10 text-brand-orange shadow-inner' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
    >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        {/* Text reveals on GROUP hover */}
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap text-xs font-bold uppercase tracking-wide">
            {label}
        </span>
    </Link>
  );

  // High contrast separator
  const Separator = () => (
    <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
  );

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* UNIFIED CONTAINER - Everything lives here now */}
        <div className="pointer-events-auto bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl shadow-black/10 rounded-full p-1.5 flex items-center gap-1 transition-all duration-300 max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar">
          
          {/* 1. LOGO SECTION - Integrated but distinct */}
          <Link to="/" className="flex items-center gap-3 pr-4 pl-1 rounded-full group mr-1 flex-shrink-0">
             <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-red-600 dark:from-blue-600 dark:to-night-azure shadow-lg shadow-orange-500/20 dark:shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Martini className="text-white w-5 h-5 -ml-0.5" strokeWidth={2.5} />
            </div>
            {/* Show text only on Large screens (lg) to save space on Medium (md) tablets/laptops */}
            <div className="hidden lg:flex flex-col justify-center">
                <span className="text-gray-900 dark:text-white font-black text-sm leading-none tracking-tight group-hover:text-brand-orange dark:group-hover:text-night-azure transition-colors">
                BARTENDER
                </span>
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] leading-none mt-0.5">
                ACADEMY
                </span>
            </div>
          </Link>

          {/* Major Divider after Logo */}
          <div className="hidden md:block w-px h-8 bg-gray-300 dark:bg-gray-500 mx-2"></div>

          {/* 2. MENU ITEMS (Desktop - MD breakpoint) */}
          <div className="hidden md:flex items-center gap-1">
              
              {/* Theory Group */}
              <div className="group flex items-center px-1">
                  <NavItem to="/theory" icon={BookOpen} label={t.nav.theory} active={isActive('/theory')} />
                  <NavItem to="/distillates" icon={FlaskConical} label={t.nav.distillates} active={isActive('/distillates')} />
              </div>

              <Separator />

              {/* School Group */}
              <div className="group flex items-center px-1">
                   <NavItem to="/school" icon={GraduationCap} label={t.nav.training} active={isActive('/school')} />
              </div>

              <Separator />

              {/* Practice Group */}
              <div className="group flex items-center px-1">
                  <NavItem to="/cocktails" icon={Wine} label={t.nav.cocktails} active={isActive('/cocktails')} />
                  <NavItem to="/lab" icon={Sparkles} label={t.nav.lab} active={isActive('/lab')} />
              </div>

              <Separator />

              {/* Tools Group */}
              <div className="group flex items-center px-1">
                  <NavItem to="/tools" icon={Calculator} label="Tools" active={isActive('/tools')} />
              </div>

              <Separator />

              {/* Settings Group */}
              <div className="group flex items-center px-1 gap-1">
                 <button onClick={toggleLanguage} className="w-9 h-9 flex items-center justify-center rounded-full text-[10px] font-black text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    {language === 'it' ? 'IT' : 'EN'}
                 </button>
                 <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                     {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                 </button>
              </div>

              <Separator />

              {/* User Group - Adjusted padding for centering */}
              <div className="group flex items-center px-1">
                 {user ? (
                     <div className="flex items-center gap-1">
                        <Link 
                            to="/admin" 
                            className={`relative flex items-center justify-center h-10 w-10 px-0 rounded-full transition-all duration-300 group-hover:w-auto group-hover:px-3
                            ${isActive('/admin') ? 'bg-brand-orange text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            <User size={18} className="flex-shrink-0" />
                            <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap text-xs font-bold uppercase tracking-wide ml-0 group-hover:ml-2">
                                Admin
                            </span>
                        </Link>
                        <button 
                            onClick={logout} 
                            className="relative flex items-center justify-center h-10 w-10 px-0 rounded-full transition-all duration-300 group-hover:w-auto group-hover:px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={18} className="flex-shrink-0" />
                            <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap text-xs font-bold uppercase tracking-wide ml-0 group-hover:ml-2">
                                {language === 'it' ? 'Esci' : 'Logout'}
                            </span>
                        </button>
                     </div>
                 ) : (
                    <Link 
                        to="/admin" 
                        className="relative flex items-center justify-center h-10 w-10 px-0 rounded-full transition-all duration-300 group-hover:w-auto group-hover:px-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        <LogIn size={18} className="flex-shrink-0" />
                        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 transition-all duration-500 ease-out whitespace-nowrap text-xs font-bold uppercase tracking-wide ml-0 group-hover:ml-2">
                            {language === 'it' ? 'Accedi' : 'Login'}
                        </span>
                    </Link>
                 )}
              </div>
          </div>

          {/* 3. MOBILE TOGGLE (Visible on SM and below) */}
          <div className="md:hidden ml-auto pl-4">
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
            <Link to="/cocktails" onClick={() => setIsOpen(false)} className="text-xl font-bold text-brand-orange flex items-center gap-3"><Wine size={20} />{t.nav.cocktails}</Link>
            <Link to="/lab" onClick={() => setIsOpen(false)} className="text-xl font-bold text-purple-600 flex items-center gap-3"><Sparkles size={20} />{t.nav.lab}</Link>
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
