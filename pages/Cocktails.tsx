import React, { useState } from 'react';
import { useAppStore } from '../store';
import CocktailCard from '../components/CocktailCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Cocktails: React.FC = () => {
  const { data, t } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEra, setFilterEra] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Basic filtering logic
  const filteredCocktails = data.cocktails.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.ingredients.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEra = filterEra === 'All' || c.era === filterEra;
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const isVisible = c.status !== 'draft'; // Hide drafts from public view
    return matchesSearch && matchesEra && matchesCategory && isVisible;
  });

  const eras = ['All', ...Array.from(new Set(data.cocktails.map(c => c.era)))].sort();
  const categories = ['All', ...Array.from(new Set(data.cocktails.map(c => c.category)))].sort();

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {t.cocktails.title}
        </h1>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder={t.cocktails.searchPlaceholder} 
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-black/50 border-none focus:ring-2 focus:ring-brand-orange/50 dark:text-white placeholder-gray-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <div className="relative min-w-[140px]">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl bg-gray-50 dark:bg-black/50 border-none text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-brand-orange/50 cursor-pointer"
                            value={filterEra}
                            onChange={(e) => setFilterEra(e.target.value)}
                        >
                            {eras.map(era => <option key={era} value={era}>{era === 'All' ? t.cocktails.filters.allEras : era}</option>)}
                        </select>
                        <SlidersHorizontal size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative min-w-[140px]">
                        <select
                            className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl bg-gray-50 dark:bg-black/50 border-none text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-brand-orange/50 cursor-pointer"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? t.cocktails.filters.allCategories : cat}</option>)}
                        </select>
                         <Filter size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      {filteredCocktails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCocktails.map(cocktail => (
            <CocktailCard key={cocktail.id} cocktail={cocktail} />
            ))}
        </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg">{t.cocktails.noResults}</p>
          </div>
      )}
    </div>
  );
};

export default Cocktails;