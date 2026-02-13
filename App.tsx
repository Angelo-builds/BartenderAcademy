
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Theory from './pages/Theory';
import Cocktails from './pages/Cocktails';
import Distillates from './pages/Distillates';
import DistillateDetail from './pages/DistillateDetail';
import Admin from './pages/Admin';
import ComingSoon from './pages/ComingSoon';
import SharedCertificates from './pages/SharedCertificates';
import { AppProvider, useAppStore } from './store';

// Separated layout component to access the context
const MainLayout: React.FC = () => {
  const { language } = useAppStore();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isSharedPage = location.pathname.startsWith('/shared/');

  // Reduced spacing for non-home pages as requested
  const spacingClass = (isHomePage || isSharedPage) ? '' : 'pt-20 md:pt-24';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {!isSharedPage && <Navbar />}
      {/* Key prop triggers re-render animation when language changes */}
      <main className={`${!isSharedPage ? 'container mx-auto px-4 pb-12' : ''} ${spacingClass}`}>
        <div key={language} className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/cocktails" element={<Cocktails />} />
            <Route path="/distillates" element={<Distillates />} />
            <Route path="/distillates/:id" element={<DistillateDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/shared/:id" element={<SharedCertificates />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
