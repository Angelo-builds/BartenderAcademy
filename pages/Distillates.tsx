
import React from 'react';
import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets } from 'lucide-react';

const Distillates: React.FC = () => {
  const { data, t } = useAppStore();
  const distillates = data.theory.filter(t => t.category === 'Distillates' && t.status !== 'draft');

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4">
       {/* Hero / Header */}
       <div className="relative mb-16 py-12 px-6 rounded-[3rem] bg-gray-900 dark:bg-gray-900 overflow-hidden text-center md:text-left">
          <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=2000&q=80" alt="Background" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
             <div>
                <span className="inline-flex items-center gap-2 text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 bg-brand-orange/10 px-3 py-1 rounded-full">
                    <Droplets size={14} /> {t.distillates.encyclopedia}
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-4">
                    {t.distillates.title}
                </h1>
                <p className="text-gray-400 text-lg max-w-xl">
                    {t.distillates.subtitle}
                </p>
             </div>
             {/* Decorative Element */}
             <div className="hidden md:block w-32 h-32 border-[1px] border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
          </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[400px]">
        {distillates.map((item, index) => {
            // First item spans 2 cols and 2 rows for impact (Featured)
            // 5th item spans 2 cols wide
            const isFeatured = index === 0;
            const isWide = index === 4 || index === 8;
            
            let colSpan = 'col-span-1';
            let rowSpan = 'row-span-1';
            
            if (isFeatured) {
                colSpan = 'md:col-span-2 lg:col-span-2';
                rowSpan = 'md:row-span-2';
            } else if (isWide) {
                colSpan = 'md:col-span-2';
            }

            return (
                <Link 
                    key={item.id} 
                    to={`/distillates/${item.id}`} 
                    className={`group relative overflow-hidden rounded-[2rem] shadow-lg cursor-pointer ${colSpan} ${rowSpan}`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-gray-800">
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            loading="lazy"
                        />
                    </div>

                    {/* Gradient Overlay - Darker at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                    {/* Content Layer */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        
                        {/* Floating Category Badge */}
                        <div className="absolute top-6 left-6 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            <span className="backdrop-blur-md bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {item.category}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h2 className={`font-black text-white leading-none mb-2 ${isFeatured ? 'text-5xl md:text-6xl' : 'text-3xl'}`}>
                                {item.title}
                            </h2>
                            
                            {/* Animated Underline */}
                            <div className="w-12 h-1 bg-brand-orange rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>

                            {/* Button */}
                            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                                <span>{t.distillates.readMore}</span>
                                <div className="bg-white text-black rounded-full p-1.5 transform group-hover:rotate-45 transition-transform duration-300">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        })}
      </div>
    </div>
  );
};

export default Distillates;
