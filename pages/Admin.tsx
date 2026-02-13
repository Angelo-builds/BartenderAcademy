
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { Cocktail, TheorySection, SiteConfig } from '../types';
import { Plus, Minus, Save, Trash2, LayoutList, BookOpen, X, Edit, FileJson, Sparkles, Loader, Upload, Link as LinkIcon, Image as ImageIcon, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Admin: React.FC = () => {
  const { isAdmin, login, logout, addCocktail, updateCocktail, deleteCocktail, setCocktails, data, addTheory, updateTheory, deleteTheory, updateSiteConfig, t } = useAppStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'cocktails' | 'theory' | 'config'>('cocktails');
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'bulk'>('list');
  const [bulkJson, setBulkJson] = useState('');
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Form States ---
  const emptyCocktail: Partial<Cocktail> = {
      name: '',
      image: '',
      method: 'Build',
      glass: '',
      garnish: '',
      category: 'Long Drink',
      era: 'Modern',
      status: 'published',
      ingredients: [{ name: '', amount: '' }]
  };

  const emptyTheory: Partial<TheorySection> = {
      title: '',
      content: '',
      category: 'Basics',
      image: '',
      status: 'published'
  };

  const [cocktailForm, setCocktailForm] = useState<Partial<Cocktail>>(emptyCocktail);
  const [theoryForm, setTheoryForm] = useState<Partial<TheorySection>>(emptyTheory);
  const [siteConfigForm, setSiteConfigForm] = useState<SiteConfig>(data.siteConfig);
  const [imageSource, setImageSource] = useState<'url' | 'file' | 'ai'>('url');

  // --- Image Generation State ---
  const [genSize, setGenSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);

  // Check for navigation state (edit request from other pages)
  useEffect(() => {
      if (location.state && (location.state as any).editCocktail) {
          setCocktailForm((location.state as any).editCocktail);
          setActiveTab('cocktails');
          setViewMode('edit');
          // Clear state so refresh doesn't re-trigger
          window.history.replaceState({}, document.title);
      }
  }, [location]);

  // Sync site config form when data changes
  useEffect(() => {
    setSiteConfigForm(data.siteConfig);
  }, [data.siteConfig]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Password non valida');
    }
  };

  // --- File Upload Handler ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cocktail' | 'theory' | 'config') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'cocktail') {
             setCocktailForm(prev => ({ ...prev, image: reader.result as string }));
        } else if (type === 'theory') {
             setTheoryForm(prev => ({ ...prev, image: reader.result as string }));
        } else {
             setSiteConfigForm(prev => ({ ...prev, homeHeroImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Image Generation Handler ---
  const handleGenerateImage = async () => {
    if (!cocktailForm.name) {
        alert("Please enter a cocktail name first.");
        return;
    }

    const aistudio = (window as any).aistudio;
    if (aistudio && !await aistudio.hasSelectedApiKey()) {
        await aistudio.openSelectKey();
    }
    
    // Always create a new instance to ensure fresh API key usage
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    setIsGenerating(true);
    try {
        const ingredientsList = cocktailForm.ingredients?.map(i => i.name).join(', ') || '';
        
        // Enhanced prompt for better food photography results
        const prompt = `Professional commercial photography of a cocktail named "${cocktailForm.name}". 
        Served in a ${cocktailForm.glass}. 
        Visual ingredients: ${ingredientsList}. 
        Garnish details: ${cocktailForm.garnish}.
        Style: ${cocktailForm.category}, ${cocktailForm.era} vibes.
        Lighting: Cinematic studio lighting, shallow depth of field, 8k resolution, photorealistic, elegant moody bar background, condensation on glass, high detail texture.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: '1:1',
                    imageSize: genSize
                }
            }
        });

        let foundImage = false;
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64String = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    const imageUrl = `data:${mimeType};base64,${base64String}`;
                    setCocktailForm(prev => ({ ...prev, image: imageUrl }));
                    foundImage = true;
                    break;
                }
            }
        }
        
        if (!foundImage) {
            alert("No image generated. Please try again.");
        }

    } catch (e) {
        console.error(e);
        alert("Failed to generate image. Ensure you have a valid paid API key selected and try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  // --- Bulk Handlers ---
  const startBulkEdit = () => {
      setBulkJson(JSON.stringify(data.cocktails, null, 2));
      setViewMode('bulk');
  };

  const handleBulkSave = () => {
      try {
          const parsed = JSON.parse(bulkJson);
          if (Array.isArray(parsed)) {
              setCocktails(parsed);
              setViewMode('list');
          } else {
              alert('JSON must be an array');
          }
      } catch (e) {
          alert('Invalid JSON Syntax');
      }
  };

  // --- Cocktail Handlers ---
  const handleCocktailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cocktailForm.name) return;

      const cleanIngredients = cocktailForm.ingredients?.filter(i => i.name !== '') || [];
      const payload = { ...cocktailForm, ingredients: cleanIngredients } as Cocktail;

      if (cocktailForm.id) {
          updateCocktail(payload);
      } else {
          addCocktail({ ...payload, id: Date.now().toString() });
      }
      setViewMode('list');
      setCocktailForm(emptyCocktail);
  };

  const startEditCocktail = (c: Cocktail) => {
      setCocktailForm(c);
      // Reset image source based on content (if starts with data:, it's likely a file/generated, else url)
      if (c.image.startsWith('data:')) {
          setImageSource('file'); // Or AI, treated same as local data (base64)
      } else {
          setImageSource('url');
      }
      setViewMode('edit');
  };

  const handleDeleteCocktail = (id: string) => {
      if (window.confirm('Sei sicuro di voler eliminare questo cocktail?')) {
          deleteCocktail(id);
          if (cocktailForm.id === id) {
              setCocktailForm(emptyCocktail);
              setViewMode('list');
          }
      }
  };

  // --- Theory Handlers ---
  const handleTheorySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!theoryForm.title) return;

      const payload = { ...theoryForm } as TheorySection;

      if (theoryForm.id) {
          updateTheory(payload);
      } else {
          addTheory({ ...payload, id: Date.now().toString() });
      }
      setViewMode('list');
      setTheoryForm(emptyTheory);
  };

  const startEditTheory = (t: TheorySection) => {
      setTheoryForm(t);
      setViewMode('edit');
  };

  const handleDeleteTheory = (id: string) => {
       if (window.confirm('Sei sicuro di voler eliminare questa sezione?')) {
          deleteTheory(id);
          if (theoryForm.id === id) {
              setTheoryForm(emptyTheory);
              setViewMode('list');
          }
      }
  };

  // --- Site Config Handlers ---
  const handleSiteConfigSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateSiteConfig(siteConfigForm);
      alert('Configurazione salvata!');
  };

  // --- Ingredient Helpers ---
  const updateIngredient = (index: number, field: 'name' | 'amount', val: string) => {
      const newIngs = [...(cocktailForm.ingredients || [])];
      newIngs[index][field] = val;
      setCocktailForm({ ...cocktailForm, ingredients: newIngs });
  };

  const addIngField = () => {
      setCocktailForm({ ...cocktailForm, ingredients: [...(cocktailForm.ingredients || []), { name: '', amount: '' }] });
  };
  
  const removeIngField = (index: number) => {
      const newIngs = [...(cocktailForm.ingredients || [])];
      newIngs.splice(index, 1);
      setCocktailForm({ ...cocktailForm, ingredients: newIngs });
  };


  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
           <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Save className="text-brand-orange" size={24} />
                </div>
                <h2 className="text-2xl font-bold dark:text-white">{t.admin.loginTitle}</h2>
                <p className="text-gray-500 text-sm">{t.admin.loginSubtitle}</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.admin.passwordPlaceholder}
            />
            {error && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
            <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                {t.admin.loginButton}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Hint: admin123</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-12">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.admin.dashboard}</h1>
              <p className="text-gray-500 text-sm">{t.admin.manage}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <button onClick={logout} className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                  {t.admin.logout}
              </button>
              
              {activeTab === 'cocktails' && (
                  <button 
                    onClick={startBulkEdit} 
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-colors text-sm font-bold shadow-lg"
                  >
                      <FileJson size={18} /> {t.admin.bulkMode}
                  </button>
              )}

              {activeTab !== 'config' && (
                  <button 
                    onClick={() => { 
                        setViewMode('edit'); 
                        activeTab === 'cocktails' ? setCocktailForm(emptyCocktail) : setTheoryForm(emptyTheory);
                    }} 
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-orange text-white hover:bg-brand-red transition-colors text-sm font-bold shadow-lg shadow-brand-orange/20"
                  >
                      <Plus size={18} /> {t.admin.newItem}
                  </button>
              )}
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                <button 
                    onClick={() => { setActiveTab('cocktails'); setViewMode('list'); }}
                    className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-medium mb-1 ${activeTab === 'cocktails' ? 'bg-gray-100 dark:bg-gray-800 text-brand-orange dark:text-night-azure' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                    <LayoutList size={20} /> {t.admin.tabs.recipes}
                </button>
                <button 
                    onClick={() => { setActiveTab('theory'); setViewMode('list'); }}
                    className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-medium mb-1 ${activeTab === 'theory' ? 'bg-gray-100 dark:bg-gray-800 text-brand-orange dark:text-night-azure' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                    <BookOpen size={20} /> {t.admin.tabs.theory}
                </button>
                <button 
                    onClick={() => { setActiveTab('config'); setViewMode('edit'); }}
                    className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-medium ${activeTab === 'config' ? 'bg-gray-100 dark:bg-gray-800 text-brand-orange dark:text-night-azure' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                    <Settings size={20} /> Configurazione Sito
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
            {activeTab === 'config' && (
                 <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 animate-fadeIn">
                     <h2 className="text-2xl font-bold dark:text-white mb-6">Configurazione Home Page</h2>
                     <form onSubmit={handleSiteConfigSubmit} className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Titolo Hero</label>
                             <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                 value={siteConfigForm.homeTitle} onChange={e => setSiteConfigForm({...siteConfigForm, homeTitle: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Sottotitolo Hero</label>
                             <textarea className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white h-24"
                                 value={siteConfigForm.homeSubtitle} onChange={e => setSiteConfigForm({...siteConfigForm, homeSubtitle: e.target.value})} />
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Immagine Hero</label>
                             <div className="flex gap-4">
                                <input 
                                    className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={siteConfigForm.homeHeroImage || ''} 
                                    onChange={e => setSiteConfigForm({...siteConfigForm, homeHeroImage: e.target.value})} 
                                    placeholder="https://images.unsplash.com..." 
                                />
                                <div className="relative">
                                     <input type="file" onChange={(e) => handleFileUpload(e, 'config')} className="hidden" id="configHero" accept="image/*" />
                                     <label htmlFor="configHero" className="flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                                         <Upload size={20} className="text-gray-600 dark:text-white" />
                                     </label>
                                </div>
                            </div>
                            {siteConfigForm.homeHeroImage && (
                                 <div className="w-full h-40 bg-gray-100 dark:bg-black rounded-xl overflow-hidden relative">
                                     <img src={siteConfigForm.homeHeroImage} alt="Preview" className="w-full h-full object-cover" />
                                 </div>
                             )}
                        </div>

                         <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Citazione del Giorno</label>
                             <textarea className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white h-24"
                                 value={siteConfigForm.homeQuote} onChange={e => setSiteConfigForm({...siteConfigForm, homeQuote: e.target.value})} />
                        </div>

                        <button type="submit" className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-orange/30 hover:scale-[1.01] transition-transform">
                            Salva Configurazione
                        </button>
                     </form>
                 </div>
            )}

            {viewMode === 'bulk' && activeTab === 'cocktails' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 animate-fadeIn">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                                <FileJson size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold dark:text-white">{t.admin.bulk.title}</h2>
                                <p className="text-xs text-gray-500">{t.admin.bulk.desc}</p>
                            </div>
                        </div>
                        <button onClick={() => setViewMode('list')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={24} /></button>
                    </div>

                    <textarea
                        className="w-full h-[60vh] p-4 bg-gray-50 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-xs md:text-sm focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                        value={bulkJson}
                        onChange={(e) => setBulkJson(e.target.value)}
                        placeholder={t.admin.bulk.placeholder}
                    />
                    
                    <div className="mt-4 flex gap-4">
                        <button onClick={handleBulkSave} className="flex-1 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg shadow-brand-orange/30 hover:scale-[1.01] transition-transform">
                            {t.admin.bulk.save}
                        </button>
                        <button onClick={() => setViewMode('list')} className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                            {t.admin.bulk.cancel}
                        </button>
                    </div>
                </div>
            )}

            {viewMode === 'list' && activeTab !== 'config' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* List Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold dark:text-white capitalize">{activeTab === 'cocktails' ? t.admin.tabs.recipes : t.admin.tabs.theory}</h2>
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">
                            {activeTab === 'cocktails' ? data.cocktails.length : data.theory.length} items
                        </span>
                    </div>

                    {/* List Items */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[70vh] overflow-y-auto">
                        {activeTab === 'cocktails' ? (
                            data.cocktails.map(c => (
                                <div key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${c.status === 'coming_soon' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                                        <img src={c.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{c.name}</p>
                                            <p className="text-xs text-gray-400">{c.category} • {c.era}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditCocktail(c)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteCocktail(c.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            data.theory.map(t => (
                                <div key={t.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors">
                                    <div className="flex items-center gap-4">
                                         <div className={`w-2 h-2 rounded-full ${t.status === 'draft' ? 'bg-gray-400' : 'bg-green-400'}`}></div>
                                         <img src={t.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{t.title}</p>
                                            <p className="text-xs text-gray-400">{t.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditTheory(t)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteTheory(t.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Edit Forms */}
            {viewMode === 'edit' && activeTab === 'cocktails' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 animate-fadeIn">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold dark:text-white">{cocktailForm.id ? 'Modifica Cocktail' : 'Nuovo Cocktail'}</h2>
                        <button onClick={() => setViewMode('list')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={24} /></button>
                    </div>
                    
                    <form onSubmit={handleCocktailSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.name}</label>
                                <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={cocktailForm.name} onChange={e => setCocktailForm({...cocktailForm, name: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.status}</label>
                                <select className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={cocktailForm.status} onChange={e => setCocktailForm({...cocktailForm, status: e.target.value as any})}>
                                    <option value="published">{t.admin.form.published}</option>
                                    <option value="draft">{t.admin.form.draft}</option>
                                    <option value="coming_soon">{t.admin.form.comingSoon}</option>
                                </select>
                            </div>
                        </div>

                        {/* Image Selection Section */}
                        <div className="space-y-4">
                             <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                 <button type="button" onClick={() => setImageSource('url')} className={`flex items-center gap-2 pb-2 text-sm font-bold ${imageSource === 'url' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-400'}`}>
                                    <LinkIcon size={16} /> URL
                                 </button>
                                 <button type="button" onClick={() => setImageSource('file')} className={`flex items-center gap-2 pb-2 text-sm font-bold ${imageSource === 'file' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-400'}`}>
                                    <Upload size={16} /> Upload PC
                                 </button>
                                 <button type="button" onClick={() => setImageSource('ai')} className={`flex items-center gap-2 pb-2 text-sm font-bold ${imageSource === 'ai' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-400'}`}>
                                    <Sparkles size={16} /> AI Generate
                                 </button>
                             </div>

                             {imageSource === 'url' && (
                                <div className="space-y-2">
                                    <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                            value={cocktailForm.image} onChange={e => setCocktailForm({...cocktailForm, image: e.target.value})} placeholder="https://images.unsplash.com..." />
                                </div>
                             )}

                             {imageSource === 'file' && (
                                <div className="space-y-2 p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'cocktail')} className="hidden" accept="image/*" />
                                    <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload image</p>
                                    {cocktailForm.image && cocktailForm.image.startsWith('data:') && (
                                        <p className="text-xs text-brand-orange mt-2">Image loaded successfully</p>
                                    )}
                                </div>
                             )}

                             {imageSource === 'ai' && (
                                <div className="p-4 bg-gradient-to-r from-brand-orange/5 to-brand-red/5 rounded-2xl border border-brand-orange/20">
                                    <h3 className="text-sm font-bold mb-2 text-brand-orange">{t.admin.generator.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4">{t.admin.generator.desc}</p>
                                    <div className="flex gap-3 items-end">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-gray-500">{t.admin.generator.size}</span>
                                            <select 
                                                className="block px-3 py-2 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 text-sm outline-none dark:text-white"
                                                value={genSize}
                                                onChange={(e) => setGenSize(e.target.value as '1K' | '2K' | '4K')}
                                            >
                                                <option value="1K">1K (1024x1024)</option>
                                                <option value="2K">2K (2048x2048)</option>
                                                <option value="4K">4K (4096x4096)</option>
                                            </select>
                                        </div>
                                        
                                        <button 
                                            type="button"
                                            onClick={handleGenerateImage}
                                            disabled={isGenerating}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all mb-[1px]"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader className="animate-spin" size={14} />
                                                    {t.admin.generator.generating}
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={14} />
                                                    {t.admin.generator.generate}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                             )}

                             {cocktailForm.image && (
                                 <div className="w-full h-40 bg-gray-100 dark:bg-black rounded-xl overflow-hidden relative">
                                     <img src={cocktailForm.image} alt="Preview" className="w-full h-full object-cover" />
                                     <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs p-1 w-full text-center">Preview</div>
                                 </div>
                             )}
                        </div>

                        {/* ... Rest of form similar to previous ... */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.method}</label>
                                <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={cocktailForm.method} onChange={e => setCocktailForm({...cocktailForm, method: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.glass}</label>
                                <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={cocktailForm.glass} onChange={e => setCocktailForm({...cocktailForm, glass: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.category}</label>
                                <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={cocktailForm.category} onChange={e => setCocktailForm({...cocktailForm, category: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.era}</label>
                                <select className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={cocktailForm.era} onChange={e => setCocktailForm({...cocktailForm, era: e.target.value as any})}>
                                    <option value="Professional">Professional</option>
                                    <option value="Vintage">Vintage</option>
                                    <option value="Modern">Modern</option>
                                    <option value="Classic">Classic</option>
                                    <option value="Tiki">Tiki</option>
                                </select>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.garnish}</label>
                            <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                value={cocktailForm.garnish} onChange={e => setCocktailForm({...cocktailForm, garnish: e.target.value})} />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                             <div className="flex justify-between items-center mb-4">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.ingredients}</label>
                                <button type="button" onClick={addIngField} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white">
                                    {t.admin.form.addIngredient}
                                </button>
                             </div>
                             <div className="space-y-3">
                                {cocktailForm.ingredients?.map((ing, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input placeholder="Gin..." className="flex-1 p-3 bg-white dark:bg-black/20 rounded-lg border-none focus:ring-2 focus:ring-brand-orange outline-none dark:text-white text-sm"
                                            value={ing.name} onChange={e => updateIngredient(idx, 'name', e.target.value)} />
                                        <input placeholder="1 oz" className="w-24 p-3 bg-white dark:bg-black/20 rounded-lg border-none focus:ring-2 focus:ring-brand-orange outline-none dark:text-white text-sm"
                                            value={ing.amount} onChange={e => updateIngredient(idx, 'amount', e.target.value)} />
                                        <button type="button" onClick={() => removeIngField(idx)} className="text-red-400 hover:text-red-600"><Minus size={18} /></button>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-orange/30 hover:scale-[1.01] transition-transform">
                            {t.admin.form.save}
                        </button>
                    </form>
                </div>
            )}

             {viewMode === 'edit' && activeTab === 'theory' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 animate-fadeIn">
                     <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold dark:text-white">{theoryForm.id ? 'Modifica Articolo' : 'Nuovo Articolo'}</h2>
                        <button onClick={() => setViewMode('list')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleTheorySubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.title}</label>
                                <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={theoryForm.title} onChange={e => setTheoryForm({...theoryForm, title: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.category}</label>
                                <select className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={theoryForm.category} onChange={e => setTheoryForm({...theoryForm, category: e.target.value as any})}>
                                    <option value="Basics">Basics</option>
                                    <option value="Rules">Rules</option>
                                    <option value="Distillates">Distillates</option>
                                </select>
                            </div>
                        </div>

                        {/* New Image Input for Theory */}
                        <div className="space-y-4">
                            <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                <label className="text-sm font-bold text-gray-500">Image</label>
                            </div>
                            <div className="flex gap-4">
                                <input 
                                    className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white"
                                    value={theoryForm.image || ''} 
                                    onChange={e => setTheoryForm({...theoryForm, image: e.target.value})} 
                                    placeholder="https://images.unsplash.com..." 
                                />
                                <div className="relative">
                                     <input type="file" onChange={(e) => handleFileUpload(e, 'theory')} className="hidden" id="theoryFile" accept="image/*" />
                                     <label htmlFor="theoryFile" className="flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
                                         <Upload size={20} className="text-gray-600 dark:text-white" />
                                     </label>
                                </div>
                            </div>
                            {theoryForm.image && (
                                 <div className="w-full h-40 bg-gray-100 dark:bg-black rounded-xl overflow-hidden relative">
                                     <img src={theoryForm.image} alt="Preview" className="w-full h-full object-cover" />
                                 </div>
                             )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.content}</label>
                            <textarea className="w-full p-4 h-64 bg-gray-50 dark:bg-black/50 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-brand-orange outline-none dark:text-white font-mono text-sm leading-relaxed"
                                value={theoryForm.content} onChange={e => setTheoryForm({...theoryForm, content: e.target.value})} 
                                placeholder="Scrivi qui il contenuto..."
                            />
                        </div>

                         <div className="space-y-2">
                             <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.status}</label>
                             <div className="flex gap-4">
                                 <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="radio" checked={theoryForm.status === 'published'} onChange={() => setTheoryForm({...theoryForm, status: 'published'})} className="text-brand-orange focus:ring-brand-orange" />
                                     <span className="dark:text-white">{t.admin.form.published}</span>
                                 </label>
                                 <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="radio" checked={theoryForm.status === 'draft'} onChange={() => setTheoryForm({...theoryForm, status: 'draft'})} className="text-brand-orange focus:ring-brand-orange" />
                                     <span className="dark:text-white">{t.admin.form.draft}</span>
                                 </label>
                             </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-orange/30 hover:scale-[1.01] transition-transform">
                            {t.admin.form.save}
                        </button>
                    </form>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
