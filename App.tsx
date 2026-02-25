
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

const MainLayout: React.FC = () => {
  const { language } = useAppStore();
  const location = useLocation();

  const isSharedPage = location.pathname.startsWith('/shared/');
  const isSchoolMode = location.pathname === '/academy';
  
  // Dynamic padding based on route to handle full-screen experiences better
  const spacingClass = (location.pathname === '/' || isSharedPage || isSchoolMode) ? '' : 'pt-20 md:pt-24';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {!isSharedPage && <Navbar />}
      
      <main className={`${!isSharedPage ? 'container mx-auto px-4 pb-12' : ''} ${spacingClass}`}>
        <div key={language} className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/cocktails" element={<Cocktails />} />
            <Route path="/distillates" element={<Distillates />} />
            <Route path="/distillates/:id" element={<DistillateDetail />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/shared/:id" element={<SharedCertificates />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {!isSharedPage && <Chatbot />}
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
