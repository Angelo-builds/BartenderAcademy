
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Pencil } from 'lucide-react';
import EditModal, { EditField } from '../components/EditModal';
import { TheorySection } from '../types';

const Distillates: React.FC = () => {
  const { data, t, isAdmin, updateSiteConfig, updateTheory, language } = useAppStore();
  const distillates = data.theory.filter(t => t.category === 'Distillates' && t.status !== 'draft');
  const { siteConfig } = data;

  // --- EDIT MODAL STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<'hero' | 'distillate' | null>(null);
  const [currentDistillate, setCurrentDistillate] = useState<TheorySection | null>(null);
  const [editFormState, setEditFormState] = useState<any>({});

   // Handle Opening Modal
  const openEditHero = () => {
      setEditingType('hero');
      setEditFormState({
          distillatesTitle: siteConfig.distillatesTitle || t.distillates.title,
          distillatesSubtitle: siteConfig.distillatesSubtitle || t.distillates.subtitle,
          distillatesHeroImage: siteConfig.distillatesHeroImage
      });
      setIsEditModalOpen(true);
  };

  const openEditDistillate = (e: React.MouseEvent, item: TheorySection) => {
      e.preventDefault(); // Prevent Link navigation
      e.stopPropagation();
      setEditingType('distillate');
      setCurrentDistillate(item);
      setEditFormState({
          title: item.title,
          image: item.image || ''
      });
      setIsEditModalOpen(true);
  };

  const handleSave = (newData: Record<string, string>) => {
      if (editingType === 'hero') {
          updateSiteConfig({
              ...siteConfig,
              distillatesTitle: newData.distillatesTitle,
              distillatesSubtitle: newData.distillatesSubtitle,
              distillatesHeroImage: newData.distillatesHeroImage
          });
      } else if (editingType === 'distillate' && currentDistillate) {
          updateTheory({
              ...currentDistillate,
              title: newData.title,
              image: newData.image
          });
      }
      setIsEditModalOpen(false);
      setEditingType(null);
  };

  const getEditFields = (): EditField[] => {
      if (editingType === 'hero') {
          return [
              { key: 'distillatesTitle', label: 'Page Title', type: 'text', value: editFormState.distillatesTitle },
              { key: 'distillatesSubtitle', label: 'Page Subtitle', type: 'textarea', value: editFormState.distillatesSubtitle },
              { key: 'distillatesHeroImage', label: 'Hero Image', type: 'image', value: editFormState.distillatesHeroImage },
          ];
      } else {
          return [
              { key: 'title', label: 'Distillate Name', type: 'text', value: editFormState.title },
              { key: 'image', label: 'Card Image', type: 'image', value: editFormState.image },
          ];
      }
  };

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4">
       
       <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        title={editingType === 'hero' ? 'Edit Distillates Header' : `Edit Card (${language.toUpperCase()})`}
        fields={getEditFields()}
        onChange={(key, val) => setEditFormState(prev => ({ ...prev, [key]: val }))}
      />

       {/* Hero / Header */}
       <div className="relative mb-16 py-12 px-6 rounded-[3rem] bg-gray-900 dark:bg-gray-900 overflow-hidden text-center md:text-left group shadow-2xl">
          
          {isAdmin && (
              <button 
                onClick={openEditHero}
                className="absolute top-8 right-8 z-50 p-3 bg-brand-orange text-white rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white"
              >
                  <Pencil size={24} />
              </button>
          )}

          <div className="absolute inset-0 opacity-30">
              <img 
                src={siteConfig.distillatesHeroImage || "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=2000&q=80"} 
                alt="Background" 
                className="w-full h-full object-cover grayscale" 
              />
               <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
             <div>
                <span className="inline-flex items-center gap-2 text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                    <Droplets size={14} /> {t.distillates.encyclopedia}
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-4">
                    {siteConfig.distillatesTitle || t.distillates.title}
                </h1>
                <p className="text-gray-300 text-lg max-w-xl font-light">
                    {siteConfig.distillatesSubtitle || t.distillates.subtitle}
                </p>
             </div>
             {/* Decorative Element */}
             <div className="hidden md:block w-32 h-32 border-[1px] border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
          </div>
      </div>

      {/* Modern Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {distillates.map((item) => (
            <Link 
                key={item.id} 
                to={`/distillates/${item.id}`} 
                className="group relative overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl cursor-pointer h-[28rem] transition-all duration-500 hover:-translate-y-2 border border-transparent dark:border-gray-800"
            >
                {isAdmin && (
                    <button 
                        onClick={(e) => openEditDistillate(e, item)}
                        className="absolute top-4 right-4 z-50 p-2.5 bg-brand-orange text-white rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                    >
                        <Pencil size={18} />
                    </button>
                )}

import SmartImage from '../components/SmartImage';

// ... inside Distillates component ...

                {/* Background Image */}
                <div className="absolute inset-0 bg-gray-800">
                    <SmartImage 
                        src={item.image} 
                        alt={item.title} 
                        nameForSlug={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-60"
                        loading="lazy"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-300"></div>

                {/* Content Layer */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                        <span className="backdrop-blur-md bg-white/10 border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                            {item.category}
                        </span>
                            <div className="bg-white text-black rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-top-right shadow-lg">
                            <ArrowRight size={20} />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-white leading-none mb-3 tracking-tight">
                            {item.title}
                        </h2>
                        <div className="h-1.5 w-0 bg-brand-orange group-hover:w-16 transition-all duration-500 rounded-full"></div>
                    </div>
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default Distillates;
