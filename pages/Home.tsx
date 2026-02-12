import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Martini, FlaskConical, Users, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';

const Home: React.FC = () => {
  const { t } = useAppStore();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Select a random quote on mount or language change
    const quotes = t.home.quotes;
    if (quotes && quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }
  }, [t]);
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20 animate-fadeIn">
        <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-xs uppercase tracking-widest mb-6">
            {t.home.welcome}
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tighter mb-8 leading-tight">
          {t.home.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">{t.home.school}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t.home.subtitle}
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/cocktails" className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2">
                {t.home.exploreRecipes} <ArrowRight size={20} />
            </Link>
            <Link to="/theory" className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {t.home.studyTheory}
            </Link>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        <FeatureCard 
          to="/theory" 
          icon={<BookOpen size={32} />} 
          title={t.home.cards.theory.title} 
          desc={t.home.cards.theory.desc}
          className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          iconColor="text-brand-red"
        />
        <FeatureCard 
          to="/distillates" 
          icon={<FlaskConical size={32} />} 
          title={t.home.cards.distillates.title} 
          desc={t.home.cards.distillates.desc}
          className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          iconColor="text-blue-500"
        />
         <FeatureCard 
          to="/cocktails" 
          icon={<Martini size={32} />} 
          title={t.home.cards.recipes.title} 
          desc={t.home.cards.recipes.desc}
          className="bg-brand-orange text-white"
          iconColor="text-white"
        />
        <FeatureCard 
          to="/admin" 
          icon={<Users size={32} />} 
          title={t.home.cards.admin.title} 
          desc={t.home.cards.admin.desc}
          className="bg-gray-900 dark:bg-black text-white"
          iconColor="text-gray-400"
        />
      </div>

      {/* Quote Section */}
      <div className="mt-24 max-w-3xl text-center">
        <blockquote className="text-2xl font-serif italic text-gray-400 dark:text-gray-500 animate-fadeIn">
          {quote}
        </blockquote>
        <div className="mt-4 w-16 h-1 bg-brand-orange mx-auto rounded-full"></div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ to: string; icon: React.ReactNode; title: string; desc: string; className: string; iconColor: string }> = ({ to, icon, title, desc, className, iconColor }) => (
  <Link to={to} className={`block p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
    <div className={`mb-6 ${iconColor}`}>{icon}</div>
    <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
    <p className="opacity-80 leading-relaxed text-sm">{desc}</p>
  </Link>
);

export default Home;