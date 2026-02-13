
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Martini, FlaskConical, Users, ArrowRight, Star, Quote } from 'lucide-react';
import { useAppStore } from '../store';
import { Cocktail } from '../types';

const Home: React.FC = () => {
  const { t, data } = useAppStore();
  const [featuredCocktail, setFeaturedCocktail] = useState<Cocktail | null>(null);

  // Use dynamic config if available, fallback to translations/defaults
  const { siteConfig } = data;

  useEffect(() => {
    // Select a random cocktail as featured
    const publishedCocktails = data.cocktails.filter(c => c.status !== 'draft' && c.status !== 'coming_soon');
    if (publishedCocktails.length > 0) {
        const randomC = publishedCocktails[Math.floor(Math.random() * publishedCocktails.length)];
        setFeaturedCocktail(randomC);
    }
  }, [data.cocktails]);
  
  return (
    <div className="flex flex-col gap-0 -mt-8">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full rounded-b-[3rem] overflow-hidden -mx-4 md:-mx-8 lg:-mx-12 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)] z-10">
          <img 
            src={siteConfig.homeHeroImage || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80"} 
            alt="Bar Atmosphere" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto pt-20">
            <span className="inline-block py-2 px-4 rounded-full bg-brand-orange text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 animate-fadeIn">
                {t.home.welcome}
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-tight drop-shadow-2xl">
              {siteConfig.homeTitle || t.home.title} 
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              {siteConfig.homeSubtitle || t.home.subtitle}
            </p>
             <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/cocktails" className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-brand-orange hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                    {t.home.exploreRecipes} <ArrowRight size={20} />
                </Link>
                <Link to="/theory" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-colors">
                    {t.home.studyTheory}
                </Link>
            </div>
          </div>
      </div>

      {/* Cinematic Quote Section */}
      <section className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] py-24 bg-gray-900 dark:bg-black text-white overflow-hidden my-12">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
               <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover grayscale" alt="" />
           </div>
           <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
               <Quote size={48} className="text-brand-orange mb-8 opacity-80" />
               <p className="font-serif text-3xl md:text-5xl italic leading-tight max-w-4xl mx-auto">
                  "{siteConfig.homeQuote || t.home.quotes[0]}"
               </p>
               <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"></div>
           </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Featured Cocktail (Large Card) */}
              {featuredCocktail && (
                  <div className="md:col-span-2 relative h-96 group overflow-hidden rounded-3xl cursor-pointer">
                      <Link to="/cocktails">
                        <img 
                            src={featuredCocktail.image} 
                            alt={featuredCocktail.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-widest mb-2">
                                <Star size={14} fill="currentColor" /> {t.home.featured}
                            </div>
                            <h2 className="text-4xl font-black mb-2">{featuredCocktail.name}</h2>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{featuredCocktail.category} • {featuredCocktail.era}</p>
                            <span className="inline-flex items-center gap-2 text-sm font-bold border-b border-brand-orange pb-0.5">
                                {t.home.viewRecipe} <ArrowRight size={14} />
                            </span>
                        </div>
                      </Link>
                  </div>
              )}

              {/* Distillates Card */}
              <Link to="/distillates" className="md:col-span-1 bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 flex flex-col justify-between hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors group">
                  <div className="p-4 bg-blue-500/20 rounded-2xl w-fit text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FlaskConical size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t.home.cards.distillates.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{t.home.cards.distillates.desc}</p>
                  </div>
              </Link>

              {/* Theory Card */}
              <Link to="/theory" className="md:col-span-1 bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 flex flex-col justify-between hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm hover:shadow-xl group border border-gray-200 dark:border-gray-800">
                   <div className="p-4 bg-brand-orange/10 rounded-2xl w-fit text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <BookOpen size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.home.cards.theory.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t.home.cards.theory.desc}</p>
                  </div>
              </Link>

              {/* Admin Card (Wide) */}
              <Link to="/admin" className="md:col-span-2 bg-black dark:bg-white text-white dark:text-black rounded-3xl p-8 flex items-center justify-between hover:scale-[1.01] transition-transform">
                  <div>
                      <h3 className="text-2xl font-bold mb-2">{t.home.cards.admin.title}</h3>
                      <p className="text-sm opacity-70 max-w-md">{t.home.cards.admin.desc}</p>
                  </div>
                  <div className="p-4 bg-white/10 dark:bg-black/10 rounded-full">
                      <Users size={32} />
                  </div>
              </Link>
          </div>
      </div>
    </div>
  );
};

export default Home;
