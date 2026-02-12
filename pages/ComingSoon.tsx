
import React from 'react';
import { Clock, Coffee, Beaker, Bell, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';

const ComingSoon: React.FC = () => {
  const { t } = useAppStore();

  return (
    <div className="min-h-screen -mt-8 -mx-4 md:-mx-8 lg:-mx-12 overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white relative transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=2000&q=80" 
            alt="Lab Background" 
            className="w-full h-full object-cover"
          />
          {/* Light Mode Overlay (White fade) */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/95 via-gray-50/90 to-gray-50 dark:hidden"></div>
          {/* Dark Mode Overlay (Black fade) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black hidden dark:block"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-20 animate-fadeIn">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-bold text-xs uppercase tracking-[0.2em] mb-6 shadow-sm dark:shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Sparkles size={12} /> {t.comingSoonPage.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-gray-200 dark:to-gray-500">
                {t.comingSoonPage.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                {t.comingSoonPage.subtitle}
            </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            <ModuleCard 
                icon={<Beaker size={40} />}
                title={t.comingSoonPage.cards.molecular.title}
                subtitle={t.comingSoonPage.cards.molecular.sub}
                desc={t.comingSoonPage.cards.molecular.desc}
                tag={t.comingSoonPage.planned}
                color="text-blue-500 dark:text-blue-400"
                borderColor="group-hover:border-blue-500/50"
                glowColor="group-hover:shadow-blue-500/20"
                bgImage="https://images.unsplash.com/photo-1532634993-15f421e42ec0?auto=format&fit=crop&w=800&q=80"
            />
            
            <ModuleCard 
                icon={<Clock size={40} />}
                title={t.comingSoonPage.cards.vintage.title}
                subtitle={t.comingSoonPage.cards.vintage.sub}
                desc={t.comingSoonPage.cards.vintage.desc}
                tag={t.comingSoonPage.planned}
                color="text-brand-orange"
                borderColor="group-hover:border-brand-orange/50"
                glowColor="group-hover:shadow-brand-orange/20"
                bgImage="https://images.unsplash.com/photo-1563229618-f29a0082f489?auto=format&fit=crop&w=800&q=80"
            />

            <ModuleCard 
                icon={<Coffee size={40} />}
                title={t.comingSoonPage.cards.coffee.title}
                subtitle={t.comingSoonPage.cards.coffee.sub}
                desc={t.comingSoonPage.cards.coffee.desc}
                tag={t.comingSoonPage.planned}
                color="text-amber-500"
                borderColor="group-hover:border-amber-500/50"
                glowColor="group-hover:shadow-amber-500/20"
                bgImage="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
            />
        </div>

        {/* Newsletter / Notify Mock */}
        <div className="mt-24 w-full max-w-xl text-center">
            <h3 className="text-gray-900 dark:text-white font-bold mb-4 flex items-center justify-center gap-2">
                <Bell size={18} /> {t.comingSoonPage.newsletter.title}
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
                <input 
                    type="email" 
                    placeholder={t.comingSoonPage.newsletter.placeholder} 
                    className="flex-grow px-6 py-4 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all text-sm shadow-sm"
                />
                <button className="px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                    {t.comingSoonPage.newsletter.button} <ArrowRight size={16} />
                </button>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-600">
                {t.comingSoonPage.newsletter.disclaimer}
            </p>
        </div>

      </div>
    </div>
  );
};

interface CardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    desc: string;
    tag: string;
    color: string;
    borderColor: string;
    glowColor: string;
    bgImage: string;
}

const ModuleCard: React.FC<CardProps> = ({ icon, title, subtitle, desc, tag, color, borderColor, glowColor, bgImage }) => {
    return (
        <div className={`group relative h-96 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-xl dark:shadow-none backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${borderColor} ${glowColor}`}>
            
            {/* Background Image on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-700">
                <img src={bgImage} alt={title} className="w-full h-full object-cover grayscale" />
            </div>

            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 ${color} transition-transform duration-500 group-hover:scale-110 shadow-sm dark:shadow-none`}>
                        {icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        {tag}
                    </span>
                </div>

                <div>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 block opacity-80 ${color}`}>
                        {subtitle}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-orange dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-white dark:group-hover:to-gray-400 transition-all">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-300">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;
