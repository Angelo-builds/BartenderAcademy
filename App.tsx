
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Theory from './pages/Theory';
import Cocktails from './pages/Cocktails';
import Distillates from './pages/Distillates';
import DistillateDetail from './pages/DistillateDetail';
import Admin from './pages/Admin';
import ComingSoon from './pages/ComingSoon';
import { AppProvider, useAppStore } from './store';

// Separated layout component to access the context
const MainLayout: React.FC = () => {
  const { language } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <Navbar />
      {/* Key prop triggers re-render animation when language changes */}
      <main className="container mx-auto px-4 py-8">
        <div key={language} className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/cocktails" element={<Cocktails />} />
            <Route path="/distillates" element={<Distillates />} />
            <Route path="/distillates/:id" element={<DistillateDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
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
