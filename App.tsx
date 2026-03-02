
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, useNavigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Theory from './pages/Theory';
import Cocktails from './pages/Cocktails';
import Distillates from './pages/Distillates';
import DistillateDetail from './pages/DistillateDetail';
import Admin from './pages/Admin';
import Academy from './pages/Academy';
import Lab from './pages/Lab';
import Tools from './pages/Tools';
import ComingSoon from './pages/ComingSoon';
import SharedCertificates from './pages/SharedCertificates';
import Chatbot from './components/Chatbot';
import { AppProvider, useAppStore } from './store';

const LanguageWrapper: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { setLanguage, language } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang === 'it' || lang === 'en') {
      if (language !== lang) {
        setLanguage(lang as 'it' | 'en');
      }
    } else {
      // Invalid language param, redirect to default 'it' preserving the rest of the path if possible, 
      // or just to root /it if it's a mess.
      // Since this wrapper is at /:lang, if we are here, lang is something.
      // If it's not 'it' or 'en', we redirect.
      const path = location.pathname.replace(/^\/[^/]+/, '/it');
      navigate(path, { replace: true });
    }
  }, [lang, language, setLanguage, navigate, location.pathname]);

  return <Outlet />;
};

const MainLayout: React.FC = () => {
  const { language } = useAppStore();
  const location = useLocation();

  // Check if we are in a shared page (which might be outside the main nav structure or not)
  // With the new routing, shared page is /:lang/shared/:id
  const isSharedPage = location.pathname.includes('/shared/');
  const isSchoolMode = location.pathname.includes('/academy');
  
  // Dynamic padding based on route to handle full-screen experiences better
  // We check if the path ends with the language root (e.g. /it or /it/) to detect home
  const isHome = location.pathname.endsWith(`/${language}`) || location.pathname.endsWith(`/${language}/`);
  
  const spacingClass = (isHome || isSharedPage || isSchoolMode) ? '' : 'pt-20 md:pt-24';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {!isSharedPage && <Navbar />}
      
      <main className={`${!isSharedPage ? 'container mx-auto px-4 pb-12' : ''} ${spacingClass}`}>
        <div key={language} className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      {!isSharedPage && <Chatbot />}
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/it" replace />} />
      <Route path="/:lang" element={<LanguageWrapper />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="theory" element={<Theory />} />
          <Route path="cocktails" element={<Cocktails />} />
          <Route path="distillates" element={<Distillates />} />
          <Route path="distillates/:id" element={<DistillateDetail />} />
          <Route path="academy" element={<Academy />} />
          <Route path="lab" element={<Lab />} />
          <Route path="tools" element={<Tools />} />
          <Route path="admin" element={<Admin />} />
          <Route path="coming-soon" element={<ComingSoon />} />
          <Route path="shared/:id" element={<SharedCertificates />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
