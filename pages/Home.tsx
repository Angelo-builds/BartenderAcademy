
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Martini, FlaskConical, Users, ArrowRight, Star, Quote, Pencil } from 'lucide-react';
import { useAppStore } from '../store';
import { Cocktail, SiteConfig } from '../types';
import EditModal, { EditField } from '../components/EditModal';
import { translations } from '../translations';
import SmartImage from '../components/SmartImage';

const Home: React.FC = () => {
  const { t, data, isAdmin, updateSiteConfig, language } = useAppStore();
  const [featuredCocktail, setFeaturedCocktail] = useState<Cocktail | null>(null);
  const [randomQuote, setRandomQuote] = useState(t.home.quotes[0]);

  // Edit Mode State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormState, setEditFormState] = useState<SiteConfig>(data.siteConfig);

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

  // Update quote when language changes
  useEffect(() => {
      const quotes = t.home.quotes;
      if (quotes && quotes.length > 0) {
          setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }
  }, [language, t]);

  useEffect(() => {
    setEditFormState(data.siteConfig);
  }, [data.siteConfig, isEditModalOpen]);

  // Handle Edit Save
  const handleConfigSave = (newData: Record<string, string>) => {
      const updatedConfig: SiteConfig = {
          homeHeroImage: newData.homeHeroImage,
          homeTitle: newData.homeTitle,
          homeSubtitle: newData.homeSubtitle,
          homeSubtitleEn: newData.homeSubtitleEn,
          homeQuote: newData.homeQuote
      };
      updateSiteConfig(updatedConfig);
      setIsEditModalOpen(false);
  };

  const handleEditChange = (key: string, val: string) => {
      setEditFormState(prev => ({ ...prev, [key]: val }));
  };

  const editFields: EditField[] = [
      { key: 'homeTitle', label: t.admin.config.heroTitle, type: 'text', value: editFormState.homeTitle },
      { key: 'homeSubtitle', label: t.admin.config.heroSubtitle + ' (IT)', type: 'textarea', value: editFormState.homeSubtitle },
      { key: 'homeSubtitleEn', label: 'Subtitle (EN)', type: 'textarea', value: editFormState.homeSubtitleEn || '' },
      { key: 'homeHeroImage', label: t.admin.config.heroImage, type: 'image', value: editFormState.homeHeroImage },
  ];

  // DISPLAY LOGIC:
  // If language is Italian, show homeSubtitle.
  // If language is English, show homeSubtitleEn (from DB) OR fall back to standard Italian subtitle if empty.
  const displaySubtitle = language === 'it' 
      ? siteConfig.homeSubtitle 
      : (siteConfig.homeSubtitleEn || siteConfig.homeSubtitle);
  
  return (
    <div className="flex flex-col gap-0 -mt-8">
      
      {/* Edit Modal */}
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleConfigSave}
        title={`${t.admin.config.title}`}
        fields={editFields}
        onChange={handleEditChange}
      />

      {/* Hero Section */}
      <div className="relative min-h-[85vh] w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] rounded-b-[3rem] overflow-hidden z-10 flex flex-col group">
          {/* Admin Edit Button for Hero */}
          {isAdmin && (
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-24 right-8 z-50 p-3 bg-brand-orange dark:bg-night-blue text-white rounded-full shadow-lg hover:scale-110 transition-transform animate-fadeIn border-2 border-white"
                title="Edit Home Content"
              >
                  <Pencil size={24} />
              </button>
          )}

          <img 
            src={siteConfig.homeHeroImage || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80"} 
            alt="Bar Atmosphere" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
          
          <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto pt-32 pb-20">
            {/* UPDATED: dark:bg-night-blue */}
            <span className="inline-block py-2 px-4 rounded-full bg-brand-orange dark:bg-night-blue text-white font-bold text-xs uppercase tracking-[0.2em] mb-6 animate-fadeIn">
                {t.home.welcome}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-tight drop-shadow-2xl">
              {siteConfig.homeTitle || t.home.title} 
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              {displaySubtitle}
            </p>
             <div className="flex flex-col sm:flex-row gap-4 z-20 w-full justify-center">
                {/* UPDATED: dark:bg-night-blue dark:hover:bg-blue-800 */}
                <Link to={`/${language}/cocktails`} className="px-8 py-4 bg-brand-orange dark:bg-night-blue text-white rounded-full font-bold text-lg hover:bg-brand-red dark:hover:bg-blue-800 transition-all shadow-lg shadow-brand-orange/40 dark:shadow-blue-900/40 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 duration-300 min-w-[200px]">
                    {t.home.exploreRecipes} <ArrowRight size={20} />
                </Link>
                <Link to={`/${language}/theory`} className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center transform hover:scale-105 active:scale-95 duration-300 min-w-[200px]">
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
               {/* UPDATED: dark:text-night-azure */}
               <Quote size={48} className="text-brand-orange dark:text-night-azure mb-8 opacity-80" />
               <p className="font-serif text-3xl md:text-5xl italic leading-tight max-w-4xl mx-auto animate-fadeIn">
                  "{randomQuote}"
               </p>
               {/* UPDATED: dark:via-night-azure */}
               <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-brand-orange dark:via-night-azure to-transparent opacity-50"></div>
           </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Featured Cocktail (Large Card) */}
              {featuredCocktail && (
                  <div className="md:col-span-2 relative h-96 group overflow-hidden rounded-3xl cursor-pointer">
                      <Link to={`/${language}/cocktails`}>
                        <SmartImage 
                            src={featuredCocktail.image} 
                            alt={featuredCocktail.name} 
                            nameForSlug={featuredCocktail.slug || featuredCocktail.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            {/* UPDATED: dark:text-night-azure */}
                            <div className="flex items-center gap-2 text-brand-orange dark:text-night-azure font-bold text-xs uppercase tracking-widest mb-2">
                                <Star size={14} fill="currentColor" /> {t.home.featured}
                            </div>
                            <h2 className="text-4xl font-black mb-2">{featuredCocktail.name}</h2>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{featuredCocktail.category} • {featuredCocktail.era}</p>
                            {/* UPDATED: dark:border-night-azure */}
                            <span className="inline-flex items-center gap-2 text-sm font-bold border-b border-brand-orange dark:border-night-azure pb-0.5">
                                {t.home.viewRecipe} <ArrowRight size={14} />
                            </span>
                        </div>
                      </Link>
                  </div>
              )}

              {/* Distillates Card */}
              <Link to={`/${language}/distillates`} className="md:col-span-1 bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 flex flex-col justify-between hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors group">
                  <div className="p-4 bg-blue-500/20 rounded-2xl w-fit text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FlaskConical size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t.home.cards.distillates.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{t.home.cards.distillates.desc}</p>
                  </div>
              </Link>

              {/* Theory Card */}
              <Link to={`/${language}/theory`} className="md:col-span-1 bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 flex flex-col justify-between hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm hover:shadow-xl group border border-gray-200 dark:border-gray-800">
                   {/* UPDATED: dark:bg-night-azure/10 dark:text-night-azure */}
                   <div className="p-4 bg-brand-orange/10 dark:bg-night-azure/10 rounded-2xl w-fit text-brand-orange dark:text-night-azure group-hover:bg-brand-orange dark:group-hover:bg-night-azure group-hover:text-white transition-colors">
                      <BookOpen size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.home.cards.theory.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t.home.cards.theory.desc}</p>
                  </div>
              </Link>

              {/* Admin Card (Wide) */}
              <Link to={`/${language}/admin`} className="md:col-span-2 bg-black dark:bg-white text-white dark:text-black rounded-3xl p-8 flex items-center justify-between hover:scale-[1.01] transition-transform">
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
