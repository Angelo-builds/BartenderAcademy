
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ChevronDown, Book, Bookmark, Layers, Pencil } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import EditModal, { EditField } from '../components/EditModal';
import { TheorySection, SiteConfig } from '../types';
import SmartImage from '../components/SmartImage';

const Theory: React.FC = () => {
  const { data, t, isAdmin, updateTheory, updateSiteConfig, language } = useAppStore();
  const theoryItems = data.theory.filter(t => t.category !== 'Distillates' && t.status !== 'draft');
  const { siteConfig } = data;

  // --- EDIT MODAL STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<'hero' | 'section' | null>(null);
  const [currentSection, setCurrentSection] = useState<TheorySection | null>(null);
  const [editFormState, setEditFormState] = useState<any>({});

  // Handle Opening Modal
  const openEditHero = () => {
      setEditingType('hero');
      setEditFormState({
          theoryTitle: siteConfig.theoryTitle || t.theory.title,
          theorySubtitle: siteConfig.theorySubtitle || t.theory.subtitle,
          theoryHeroImage: siteConfig.theoryHeroImage
      });
      setIsEditModalOpen(true);
  };

  const openEditSection = (e: React.MouseEvent, section: TheorySection) => {
      e.stopPropagation();
      setEditingType('section');
      setCurrentSection(section);
      setEditFormState({
          title: section.title,
          content: section.content,
          image: section.image || ''
      });
      setIsEditModalOpen(true);
  };

  // Handle Saving Changes
  const handleSave = (newData: Record<string, string>) => {
      if (editingType === 'hero') {
          updateSiteConfig({
              ...siteConfig,
              theoryTitle: newData.theoryTitle,
              theorySubtitle: newData.theorySubtitle,
              theoryHeroImage: newData.theoryHeroImage
          });
      } else if (editingType === 'section' && currentSection) {
          updateTheory({
              ...currentSection,
              title: newData.title,
              content: newData.content,
              image: newData.image
          });
      }
      setIsEditModalOpen(false);
      setEditingType(null);
  };

  // Define Fields based on type
  const getEditFields = (): EditField[] => {
      if (editingType === 'hero') {
          return [
              { key: 'theoryTitle', label: 'Page Title', type: 'text', value: editFormState.theoryTitle },
              { key: 'theorySubtitle', label: 'Page Subtitle', type: 'textarea', value: editFormState.theorySubtitle },
              { key: 'theoryHeroImage', label: 'Background Image', type: 'image', value: editFormState.theoryHeroImage },
          ];
      } else {
          return [
              { key: 'title', label: 'Section Title', type: 'text', value: editFormState.title },
              { key: 'image', label: 'Sidebar Image', type: 'image', value: editFormState.image },
              { key: 'content', label: 'Content (Markdown)', type: 'textarea', value: editFormState.content },
          ];
      }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      {/* Edit Modal */}
      <EditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        title={editingType === 'hero' ? 'Edit Theory Page Header' : `Edit Section (${language.toUpperCase()})`}
        fields={getEditFields()}
        onChange={(key, val) => setEditFormState(prev => ({ ...prev, [key]: val }))}
      />

      {/* Hero Section */}
      <div className="relative mb-12 py-16 px-8 rounded-[3rem] bg-gray-900 dark:bg-gray-900 overflow-hidden shadow-2xl group">
          
          {isAdmin && (
              <button 
                onClick={openEditHero}
                className="absolute top-8 right-8 z-50 p-3 bg-brand-orange text-white rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-white"
                title="Edit Header"
              >
                  <Pencil size={24} />
              </button>
          )}

          <div className="absolute inset-0 opacity-40">
             <img 
                src={siteConfig.theoryHeroImage || "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=2000&q=80"} 
                alt="Theory Background" 
                className="w-full h-full object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl">
              <span className="text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-2 block animate-fadeIn">
                 {t.home.school}
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                {siteConfig.theoryTitle || t.theory.title}
              </h1>
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                {siteConfig.theorySubtitle || t.theory.subtitle}
              </p>
          </div>
      </div>
      
      {/* Chapters List */}
      <div className="space-y-6">
        {theoryItems.map((item, index) => (
          <SectionAccordion 
            key={item.id} 
            item={item} 
            index={index + 1} 
            isAdmin={isAdmin} 
            onEdit={(e) => openEditSection(e, item)}
          />
        ))}
      </div>
    </div>
  );
};

const SectionAccordion: React.FC<{ item: TheorySection, index: number, isAdmin: boolean, onEdit: (e: React.MouseEvent) => void }> = ({ item, index, isAdmin, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-3xl overflow-hidden transition-all duration-500 border border-gray-100 dark:border-gray-800 ${isOpen ? 'shadow-2xl ring-1 ring-brand-orange/20' : 'shadow-sm hover:shadow-lg'}`}>
      
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-stretch text-left focus:outline-none bg-transparent group relative"
      >
        {/* Number / Side Strip */}
        <div className={`w-2 md:w-3 transition-colors duration-300 ${isOpen ? 'bg-brand-orange' : 'bg-gray-200 dark:bg-gray-800 group-hover:bg-brand-orange/50'}`}></div>

        <div className="flex-1 p-6 md:p-8 flex justify-between items-center">
            <div className="flex items-start md:items-center gap-6">
                <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 font-black text-2xl">
                    {index.toString().padStart(2, '0')}
                </div>
                
                <div>
                     <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                        <Layers size={12} /> {item.category}
                     </span>
                     <h2 className={`text-2xl md:text-3xl font-bold transition-colors ${isOpen ? 'text-brand-orange' : 'text-gray-900 dark:text-white'}`}>
                        {item.title}
                     </h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isAdmin && (
                    <div 
                        onClick={onEdit} 
                        className="p-2 bg-brand-orange text-white rounded-full hover:scale-110 transition-transform shadow-md z-20"
                    >
                        <Pencil size={16} />
                    </div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-brand-orange text-white rotate-180' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                     <ChevronDown size={20} />
                </div>
            </div>
        </div>
      </button>
      
      {/* Content Area */}
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 md:px-12 pb-12 pt-4">
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Content Text */}
                <div className="flex-1 prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownRenderer content={item.content} />
                </div>

                {/* Optional Image or Sidebar */}
                {item.image && (
                    <div className="xl:w-1/3">
                        <div className="sticky top-24 rounded-2xl overflow-hidden shadow-xl">
                             <SmartImage 
                                src={item.image} 
                                alt={item.title} 
                                nameForSlug={item.title}
                                className="w-full h-auto object-cover" 
                             />
                             <div className="bg-gray-50 dark:bg-gray-800 p-4">
                                 <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                                     <Bookmark size={14} className="text-brand-orange" />
                                     Key Visual
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Theory;
