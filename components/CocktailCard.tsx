
import React, { useState, useEffect } from 'react';
import { Cocktail } from '../types';
import { Wine, Pencil, Heart, Martini, GlassWater, Beer, Coffee } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface Props {
  cocktail: Cocktail;
}

const CocktailCard: React.FC<Props> = ({ cocktail }) => {
  const { isAdmin, t, favorites, toggleFavorite } = useAppStore();
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(cocktail.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isFav = favorites.includes(cocktail.id);

  useEffect(() => {
      // Try local image first based on naming convention (slug)
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      const filename = normalize(cocktail.name).toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
      const localPath = `/images/${filename}.jpg`;
      
      setImgSrc(localPath);
      setImageLoaded(false);
      setImageError(false);
  }, [cocktail.image, cocktail.name]);

  const handleEdit = (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      navigate('/admin', { state: { editCocktail: cocktail } });
  };

  const handleImageError = () => {
      // If local path failed, try the DB image (if different and valid)
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
      const filename = normalize(cocktail.name).toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
      const localPath = `/images/${filename}.jpg`;

      if (imgSrc === localPath && cocktail.image && cocktail.image !== localPath && cocktail.image.startsWith('http')) {
          setImgSrc(cocktail.image);
      } else {
          setImageError(true);
      }
  };

  // Helper to get dynamic icon and color based on glass type
  const getPlaceholderVisuals = (glassType: string) => {
      const lower = glassType.toLowerCase();
      
      if (lower.includes('martini') || lower.includes('coppa') || lower.includes('coupe') || lower.includes('margarita')) {
          return { 
              icon: <Martini size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90" />, 
              bg: 'bg-gradient-to-br from-purple-500 to-indigo-600' 
          };
      }
      if (lower.includes('highball') || lower.includes('collins') || lower.includes('alto') || lower.includes('hurricane')) {
          return { 
              icon: <GlassWater size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90 scale-y-125" />, 
              bg: 'bg-gradient-to-br from-blue-400 to-cyan-600' 
          };
      }
      if (lower.includes('old') || lower.includes('basso') || lower.includes('rock') || lower.includes('whiskey')) {
          return { 
              icon: <GlassWater size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90" />, 
              bg: 'bg-gradient-to-br from-orange-400 to-amber-600' 
          };
      }
      if (lower.includes('mule') || lower.includes('mug') || lower.includes('tiki')) {
          return { 
              icon: <Beer size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90" />, 
              bg: 'bg-gradient-to-br from-emerald-500 to-teal-700' 
          };
      }
      if (lower.includes('flute') || lower.includes('wine') || lower.includes('vino') || lower.includes('calice')) {
          return { 
              icon: <Wine size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90" />, 
              bg: 'bg-gradient-to-br from-rose-400 to-pink-600' 
          };
      }
      if (lower.includes('coffee') || lower.includes('hot') || lower.includes('irish')) {
           return { 
              icon: <Coffee size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90" />, 
              bg: 'bg-gradient-to-br from-stone-500 to-stone-700' 
          };
      }
      
      // Default
      return { 
          icon: <GlassWater size={80} strokeWidth={1} className="drop-shadow-lg text-white opacity-90" />, 
          bg: 'bg-gradient-to-br from-slate-400 to-slate-600' 
      };
  };

  const placeholder = getPlaceholderVisuals(cocktail.glass);

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className={`relative h-64 overflow-hidden ${!cocktail.image || imageError ? placeholder.bg : 'bg-gray-100 dark:bg-gray-800'}`}>
          
          {/* Loading State */}
          {!imageLoaded && !imageError && cocktail.image && (
              <div className="absolute inset-0 flex items-center justify-center z-0 bg-gray-200 dark:bg-gray-800 animate-pulse">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
              </div>
          )}

          {/* Actual Image or Fallback Icon */}
          {(!cocktail.image || imageError) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-transform duration-700 group-hover:scale-110">
                  {placeholder.icon}
                  <span className="mt-4 text-white/80 text-xs font-bold uppercase tracking-widest border border-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                      {cocktail.glass}
                  </span>
              </div>
          ) : (
              <img 
                src={imgSrc} 
                alt={cocktail.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out z-10 relative" 
                onLoad={() => setImageLoaded(true)} 
                onError={handleImageError} 
                loading="lazy" 
                referrerPolicy="no-referrer" 
              />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 z-20 pointer-events-none"></div>
          
          {cocktail.status === 'coming_soon' && <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full z-30 shadow-lg">{t.common.comingSoon}</div>}
          
          {/* Action Buttons */}
          <div className="absolute top-4 left-4 z-40 flex gap-2">
            {isAdmin && (
                <button onClick={handleEdit} className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors border border-white/20"><Pencil size={16} /></button>
            )}
          </div>
          
          {/* Favorite Button */}
          <button 
            onClick={() => toggleFavorite(cocktail.id)}
            className="absolute top-4 right-4 z-40 p-2.5 rounded-full transition-all shadow-lg border border-white/20 hover:scale-110 bg-white/20 backdrop-blur-md"
          >
              <Heart size={18} className={isFav ? "fill-red-500 text-red-500" : "text-white"} />
          </button>


          <div className="absolute bottom-4 left-4 right-4 text-white z-30 pointer-events-none">
              <h3 className="text-2xl font-bold tracking-tight text-shadow-sm">{cocktail.name}</h3>
              <p className="text-white/80 text-sm font-medium mt-1">{cocktail.category}</p>
          </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* UPDATED: dark:text-night-azure */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-brand-orange dark:text-night-azure">
          <Wine size={14} /><span>{cocktail.glass}</span><span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span><span>{cocktail.method}</span>
        </div>
        <div className="flex-grow"><ul className="space-y-3">{cocktail.ingredients.map((ing, idx) => (<li key={idx} className="flex justify-between items-baseline text-sm border-b border-gray-50 dark:border-gray-800/50 pb-2 last:border-0"><span className="font-semibold text-gray-700 dark:text-gray-200">{ing.name}</span><span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{ing.amount}</span></li>))}</ul></div>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800"><p className="text-xs text-center text-gray-400 dark:text-gray-500 italic">{cocktail.garnish}</p></div>
      </div>
    </div>
  );
};

export default CocktailCard;
