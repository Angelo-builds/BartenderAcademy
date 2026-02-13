
import React, { useState, useEffect } from 'react';
import { Cocktail } from '../types';
import { Wine, Edit, ImageOff, Pencil } from 'lucide-react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface Props {
  cocktail: Cocktail;
}

const CocktailCard: React.FC<Props> = ({ cocktail }) => {
  const { isAdmin, t } = useAppStore();
  const navigate = useNavigate();
  
  // State for the current image source (starts with remote URL, falls back to local)
  const [imgSrc, setImgSrc] = useState(cocktail.image);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset state when the cocktail prop changes (e.g. filtering)
  useEffect(() => {
      setImgSrc(cocktail.image);
      setImageLoaded(false);
      setImageError(false);
  }, [cocktail.image]);

  const handleEdit = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate('/admin', { state: { editCocktail: cocktail } });
  };

  const handleImageError = () => {
      // 1. Calculate the expected local filename
      const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
      const filename = normalize(cocktail.name).toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
      const fallbackPath = `/images/${filename}.jpg`;

      // 2. If we haven't tried the fallback yet, try it
      if (imgSrc !== fallbackPath) {
          setImgSrc(fallbackPath);
      } else {
          setImageError(true);
      }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      {/* Cocktail Image Cover */}
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center z-0 bg-gray-200 dark:bg-gray-800 animate-pulse">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
              </div>
          )}
          
          {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                  <ImageOff size={32} className="mb-2" />
                  <span className="text-xs">No Image</span>
              </div>
          ) : (
              <img 
                src={imgSrc} 
                alt={cocktail.name} 
                className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out z-10 relative`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 z-20"></div>
          
          {/* Status Badge */}
          {cocktail.status === 'coming_soon' && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full z-30 shadow-lg">
                {t.common.comingSoon}
            </div>
          )}

          {/* Edit Button for Admin */}
          {isAdmin && (
            <button 
                onClick={handleEdit}
                className="absolute top-4 left-4 z-40 p-2.5 bg-brand-orange text-white rounded-full shadow-lg hover:scale-110 transition-transform border border-white/20"
                title="Edit Cocktail"
            >
                <Pencil size={16} />
            </button>
          )}

          {/* Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-30">
              <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-bold tracking-tight text-shadow-sm">
                      {cocktail.name}
                  </h3>
              </div>
              <p className="text-white/80 text-sm font-medium mt-1">{cocktail.category}</p>
          </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider text-brand-orange dark:text-night-azure">
          <Wine size={14} />
          <span>{cocktail.glass}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span>{cocktail.method}</span>
        </div>

        <div className="flex-grow">
          <ul className="space-y-3">
            {cocktail.ingredients.map((ing, idx) => (
              <li key={idx} className="flex justify-between items-baseline text-sm border-b border-gray-50 dark:border-gray-800/50 pb-2 last:border-0">
                <span className="font-semibold text-gray-700 dark:text-gray-200">{ing.name}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
           <p className="text-xs text-center text-gray-400 dark:text-gray-500 italic">
              {cocktail.garnish}
           </p>
        </div>
      </div>
    </div>
  );
};

export default CocktailCard;
