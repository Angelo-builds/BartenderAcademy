
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { Cocktail, TheorySection, Certificate } from '../types';
import { Plus, X, Edit, Trash2, LayoutList, BookOpen, Award, Share2, Copy, Check, Lock, ArrowRight, ShieldCheck, FileJson, Upload, Image as ImageIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const Admin: React.FC = () => {
  const { 
      isAdmin, login, logout, 
      addCocktail, updateCocktail, deleteCocktail, 
      data, 
      addTheory, updateTheory, deleteTheory,
      addCertificate, updateCertificate, deleteCertificate, createShareLink,
      t 
  } = useAppStore();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'cocktails' | 'theory' | 'certificates'>('cocktails');
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'bulk' | 'share'>('list');
  const [bulkJson, setBulkJson] = useState('');
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ref for auto-scrolling to form
  const formRef = useRef<HTMLDivElement>(null);

  // --- Form States ---
  const emptyCocktail: Partial<Cocktail> = {
      name: '', image: '', method: 'Build', glass: '', garnish: '', category: 'Long Drink', era: 'Modern', status: 'published', ingredients: [{ name: '', amount: '' }]
  };

  const emptyTheory: Partial<TheorySection> = {
      title: '', content: '', category: 'Basics', image: '', status: 'published'
  };
  
  const emptyCert: Partial<Certificate> = {
      title: '', section: 'Corsi', date: '', description: '', image: ''
  };

  const [cocktailForm, setCocktailForm] = useState<Partial<Cocktail>>(emptyCocktail);
  const [theoryForm, setTheoryForm] = useState<Partial<TheorySection>>(emptyTheory);
  const [certForm, setCertForm] = useState<Partial<Certificate>>(emptyCert);
  const [imageSource, setImageSource] = useState<'url' | 'file' | 'ai'>('url');

  // --- Share State ---
  const [selectedCertsForShare, setSelectedCertsForShare] = useState<string[]>([]);
  const [shareExpiration, setShareExpiration] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  // --- Image Generation State ---
  const [genSize, setGenSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
      if (location.state && (location.state as any).editCocktail) {
          setCocktailForm((location.state as any).editCocktail);
          setActiveTab('cocktails');
          setViewMode('edit');
          window.history.replaceState({}, document.title);
      }
  }, [location]);

  // Effect to scroll to form when viewMode changes to 'edit'
  useEffect(() => {
    if (viewMode === 'edit' && formRef.current) {
        setTimeout(() => {
            const yOffset = -140;
            const element = formRef.current;
            if (element) {
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 150);
    }
  }, [viewMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) { setError(''); } else { setError('Codice errato'); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cocktail' | 'theory' | 'cert') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'cocktail') setCocktailForm(prev => ({ ...prev, image: reader.result as string }));
        else if (type === 'theory') setTheoryForm(prev => ({ ...prev, image: reader.result as string }));
        else if (type === 'cert') setCertForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!cocktailForm.name) { alert("Please enter a cocktail name first."); return; }
    const aistudio = (window as any).aistudio;
    if (aistudio && !await aistudio.hasSelectedApiKey()) { await aistudio.openSelectKey(); }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsGenerating(true);
    try {
        const ingredientsList = cocktailForm.ingredients?.map(i => i.name).join(', ') || '';
        const prompt = `Professional commercial photography of a cocktail named "${cocktailForm.name}". Served in a ${cocktailForm.glass}. Visual ingredients: ${ingredientsList}. Garnish details: ${cocktailForm.garnish}. Style: ${cocktailForm.category}, ${cocktailForm.era} vibes. Lighting: Cinematic studio lighting, shallow depth of field, 8k resolution, photorealistic, elegant moody bar background, condensation on glass, high detail texture.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: '1:1', imageSize: genSize } }
        });
        let foundImage = false;
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
                    setCocktailForm(prev => ({ ...prev, image: imageUrl }));
                    foundImage = true;
                    break;
                }
            }
        }
        if (!foundImage) alert("No image generated.");
    } catch (e) { console.error(e); alert("Failed to generate image."); } finally { setIsGenerating(false); }
  };

  // --- Handlers ---
  const handleCocktailSubmit = (e: React.FormEvent) => {
      e.preventDefault(); if (!cocktailForm.name) return;
      const payload = { ...cocktailForm, ingredients: cocktailForm.ingredients?.filter(i => i.name !== '') || [] } as Cocktail;
      cocktailForm.id ? updateCocktail(payload) : addCocktail({ ...payload, id: Date.now().toString() });
      setViewMode('list'); setCocktailForm(emptyCocktail);
  };

  const handleTheorySubmit = (e: React.FormEvent) => {
      e.preventDefault(); if (!theoryForm.title) return;
      const payload = { ...theoryForm } as TheorySection;
      theoryForm.id ? updateTheory(payload) : addTheory({ ...payload, id: Date.now().toString() });
      setViewMode('list'); setTheoryForm(emptyTheory);
  };
  
  const handleCertSubmit = (e: React.FormEvent) => {
      e.preventDefault(); if (!certForm.title) return;
      const payload = { ...certForm } as Certificate;
      certForm.id ? updateCertificate(payload) : addCertificate({ ...payload, id: Date.now().toString() });
      setViewMode('list'); setCertForm(emptyCert);
  };

  const handleCreateShareLink = () => {
      if (selectedCertsForShare.length === 0) return;
      const name = `Link generato il ${new Date().toLocaleDateString()}`;
      const slug = createShareLink(selectedCertsForShare, shareExpiration ? shareExpiration : null, name);
      const url = `${window.location.origin}${window.location.pathname}#/shared/${slug}`;
      setGeneratedLink(url);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden -mt-12 md:-mt-0">
          {/* Abstract Ambient Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-orange/10 dark:bg-brand-orange/5 rounded-full blur-[100px] animate-pulse"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 w-full max-w-md px-4">
             <div className="bg-white/80 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl dark:shadow-black/50 p-8 md:p-12 transform transition-all hover:scale-[1.01] duration-500">
                {/* Header Icon */}
                <div className="text-center mb-10">
                    <div className="relative w-24 h-24 mx-auto mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-red-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-lg opacity-40"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-brand-orange to-red-600 rounded-3xl shadow-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                             <Lock className="text-white w-10 h-10" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                        {t.admin.loginTitle}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t.admin.loginSubtitle}</p>
                </div>
                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                         <div className="relative group">
                            <input 
                                type="password" 
                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:border-brand-orange/50 dark:focus:border-brand-orange/50 text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 font-bold text-center tracking-widest text-lg shadow-inner focus:bg-white dark:focus:bg-black/80" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="••••••••" 
                            />
                         </div>
                    </div>
                    {error && (
                        <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 py-2 rounded-xl animate-shake">
                            <ShieldCheck size={16} />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}
                    <button type="submit" className="w-full group relative overflow-hidden py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                        <span className="relative flex items-center justify-center gap-2">
                            {t.admin.loginButton} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </form>
             </div>
          </div>
      </div>
    );
  }

  // --- DATA GROUPING FOR CERTS ---
  const certsBySection = (data.certificates || []).reduce((acc, cert) => {
      (acc[cert.section] = acc[cert.section] || []).push(cert);
      return acc;
  }, {} as Record<string, Certificate[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
              <div>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t.admin.dashboard}</h1>
                  <p className="text-gray-500">{t.admin.manage}</p>
              </div>
              <button onClick={logout} className="mt-4 md:mt-0 px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-sm font-bold transition-colors">
                  {t.admin.logout}
              </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button 
                onClick={() => { setActiveTab('cocktails'); setViewMode('edit'); setCocktailForm(emptyCocktail); }}
                className="group p-6 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all text-left"
              >
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <LayoutList size={24} />
                  </div>
                  <h3 className="font-bold text-lg dark:text-white">Nuovo Cocktail</h3>
                  <p className="text-xs text-gray-400 mt-1">Aggiungi al ricettario</p>
              </button>

              <button 
                onClick={() => { setActiveTab('theory'); setViewMode('edit'); setTheoryForm(emptyTheory); }}
                className="group p-6 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left"
              >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                  </div>
                  <h3 className="font-bold text-lg dark:text-white">Nuova Sezione</h3>
                  <p className="text-xs text-gray-400 mt-1">Aggiungi teoria o distillato</p>
              </button>

              <button 
                onClick={() => { setActiveTab('certificates'); setViewMode('edit'); setCertForm(emptyCert); }}
                className="group p-6 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all text-left"
              >
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Award size={24} />
                  </div>
                  <h3 className="font-bold text-lg dark:text-white">Nuovo Certificato</h3>
                  <p className="text-xs text-gray-400 mt-1">Carica attestato</p>
              </button>
          </div>
      </div>

      {/* --- NAVIGATION PILLS --- */}
      <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-900 p-1.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm inline-flex items-center gap-1">
              {[
                  { id: 'cocktails', label: t.admin.tabs.recipes, icon: LayoutList },
                  { id: 'theory', label: t.admin.tabs.theory, icon: BookOpen },
                  { id: 'certificates', label: t.admin.tabs.certificates, icon: Award }
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); setViewMode('list'); }}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                      <tab.icon size={16} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col gap-8">
            
            {/* --- LIST VIEWS --- */}
            {viewMode === 'list' && (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[500px]">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                        {activeTab === 'cocktails' && (
                             <button onClick={() => { setBulkJson(JSON.stringify(data.cocktails, null, 2)); setViewMode('bulk'); }} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2">
                                 <FileJson size={14} /> JSON
                             </button>
                        )}
                        {activeTab === 'certificates' && (
                            <button onClick={() => { setViewMode('share'); setSelectedCertsForShare([]); setGeneratedLink(''); }} className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-2">
                                <Share2 size={14} /> Share
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* COCKTAILS LIST */}
                        {activeTab === 'cocktails' && data.cocktails.map(c => (
                            <div key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${c.status === 'coming_soon' ? 'bg-yellow-400' : 'bg-green-400'}`}></div><img src={c.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /><div><p className="font-bold text-gray-800 dark:text-gray-200">{c.name}</p><p className="text-xs text-gray-400">{c.category}</p></div></div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setCocktailForm(c); setViewMode('edit');}} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button><button onClick={() => {if(window.confirm('Delete?')) deleteCocktail(c.id)}} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button></div>
                            </div>
                        ))}
                        
                        {/* THEORY LIST */}
                        {activeTab === 'theory' && data.theory.map(t => (
                             <div key={t.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${t.status === 'draft' ? 'bg-gray-400' : 'bg-green-400'}`}></div><img src={t.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /><div><p className="font-bold text-gray-800 dark:text-gray-200">{t.title}</p><p className="text-xs text-gray-400">{t.category}</p></div></div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setTheoryForm(t); setViewMode('edit');}} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button><button onClick={() => {if(window.confirm('Delete?')) deleteTheory(t.id)}} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button></div>
                            </div>
                        ))}

                        {/* CERTIFICATES LIST */}
                        {activeTab === 'certificates' && (
                            Object.keys(certsBySection).length === 0 ? <p className="p-8 text-center text-gray-400">{t.admin.certs.noCerts}</p> :
                            Object.entries(certsBySection).map(([section, certs]) => (
                                <div key={section} className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold text-xs uppercase text-gray-500">{section}</div>
                                    {certs.map(cert => (
                                         <div key={cert.id} className="p-4 pl-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                            <div className="flex items-center gap-4"><img src={cert.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /><div><p className="font-bold text-gray-800 dark:text-gray-200">{cert.title}</p><p className="text-xs text-gray-400">{cert.date}</p></div></div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setCertForm(cert); setViewMode('edit');}} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button><button onClick={() => {if(window.confirm('Delete?')) deleteCertificate(cert.id)}} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button></div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* --- SHARE MODE (CERTS) --- */}
            {viewMode === 'share' && activeTab === 'certificates' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 animate-fadeIn">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                             <h2 className="text-2xl font-bold dark:text-white">{t.admin.certs.shareTitle}</h2>
                             <p className="text-gray-500 text-sm">{t.admin.certs.shareDesc}</p>
                        </div>
                        <button onClick={() => setViewMode('list')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={24} /></button>
                    </div>

                    {!generatedLink ? (
                        <>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {(data.certificates || []).map(cert => (
                                    <div 
                                        key={cert.id} 
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedCertsForShare.includes(cert.id) ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black'}`}
                                        onClick={() => {
                                            if (selectedCertsForShare.includes(cert.id)) setSelectedCertsForShare(prev => prev.filter(id => id !== cert.id));
                                            else setSelectedCertsForShare(prev => [...prev, cert.id]);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedCertsForShare.includes(cert.id) ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300'}`}>
                                                {selectedCertsForShare.includes(cert.id) && <Check size={12} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm dark:text-white">{cert.title}</p>
                                                <p className="text-xs text-gray-400">{cert.section}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-end gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                                <div className="w-full md:w-auto flex-grow">
                                     <label className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">{t.admin.certs.expires}</label>
                                     <input type="date" className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={shareExpiration} onChange={e => setShareExpiration(e.target.value)} />
                                </div>
                                <button onClick={handleCreateShareLink} disabled={selectedCertsForShare.length === 0} className="w-full md:w-auto px-8 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-red transition-colors">
                                    {t.admin.certs.generateLink}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Link Pronto!</h3>
                            <div className="flex items-center gap-2 max-w-xl mx-auto bg-gray-50 dark:bg-black rounded-xl p-2 border border-gray-200 dark:border-gray-800 mb-6">
                                <input readOnly value={generatedLink} className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-600 dark:text-gray-300" />
                                <button onClick={copyToClipboard} className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    {linkCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
                                </button>
                            </div>
                            <button onClick={() => { setGeneratedLink(''); setSelectedCertsForShare([]); }} className="text-brand-orange font-bold text-sm hover:underline">Genera un altro link</button>
                        </div>
                    )}
                </div>
            )}

             {/* EDIT FORMS */}
             {viewMode === 'edit' && (
                <div ref={formRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 animate-slideDown">
                   <div className="flex justify-between items-center mb-8">
                       <h2 className="text-2xl font-bold dark:text-white">
                           {activeTab === 'cocktails' ? (cocktailForm.id ? 'Modifica' : 'Nuovo') : 
                            activeTab === 'theory' ? (theoryForm.id ? 'Modifica' : 'Nuovo') : 
                            (certForm.id ? 'Modifica Certificato' : t.admin.certs.add)}
                       </h2>
                       <button onClick={() => setViewMode('list')}><X size={24} className="text-gray-400" /></button>
                   </div>
                   
                   {/* COCKTAIL FORM */}
                   {activeTab === 'cocktails' && (
                        <form onSubmit={handleCocktailSubmit} className="space-y-6">
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500">{t.admin.form.name}</label><input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={cocktailForm.name} onChange={e => setCocktailForm({...cocktailForm, name: e.target.value})} required /></div>
                            <div className="space-y-4">
                                <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-2"><button type="button" onClick={() => setImageSource('url')} className={`text-sm font-bold ${imageSource === 'url' ? 'text-brand-orange' : 'text-gray-400'}`}>URL</button><button type="button" onClick={() => setImageSource('file')} className={`text-sm font-bold ${imageSource === 'file' ? 'text-brand-orange' : 'text-gray-400'}`}>Upload</button><button type="button" onClick={() => setImageSource('ai')} className={`text-sm font-bold ${imageSource === 'ai' ? 'text-brand-orange' : 'text-gray-400'}`}>AI</button></div>
                                {imageSource === 'url' && <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={cocktailForm.image} onChange={e => setCocktailForm({...cocktailForm, image: e.target.value})} placeholder="https://..." />}
                                {imageSource === 'file' && <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}><input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'cocktail')} className="hidden" accept="image/*" /><ImageIcon className="mx-auto text-gray-400" /></div>}
                                {imageSource === 'ai' && <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl"><button type="button" onClick={handleGenerateImage} disabled={isGenerating} className="px-4 py-2 bg-black text-white rounded-lg text-sm">{isGenerating ? 'Generating...' : 'Generate AI Image'}</button></div>}
                            </div>
                            <button type="submit" className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold">{t.admin.form.save}</button>
                        </form>
                   )}

                   {/* THEORY FORM */}
                   {activeTab === 'theory' && (
                       <form onSubmit={handleTheorySubmit} className="space-y-6">
                            <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={theoryForm.title} onChange={e => setTheoryForm({...theoryForm, title: e.target.value})} placeholder="Titolo" required />
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500">Categoria</label><select className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={theoryForm.category} onChange={e => setTheoryForm({...theoryForm, category: e.target.value as any})}><option value="Basics">Basics</option><option value="Rules">Rules</option><option value="Distillates">Distillates</option></select></div>
                            <textarea className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white h-64 font-mono text-sm" value={theoryForm.content} onChange={e => setTheoryForm({...theoryForm, content: e.target.value})} placeholder="Markdown content..." />
                            <div className="space-y-4"><label className="text-xs font-bold uppercase text-gray-500">Immagine</label><div className="flex gap-4"><input className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={theoryForm.image || ''} onChange={e => setTheoryForm({...theoryForm, image: e.target.value})} placeholder="URL..." /><div className="relative"><input type="file" onChange={(e) => handleFileUpload(e, 'theory')} className="hidden" id="theoryFile" accept="image/*" /><label htmlFor="theoryFile" className="flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer"><Upload size={20} className="text-gray-600 dark:text-white" /></label></div></div></div>
                            <button type="submit" className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold">{t.admin.form.save}</button>
                       </form>
                   )}

                   {/* CERTIFICATES FORM */}
                   {activeTab === 'certificates' && (
                        <form onSubmit={handleCertSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.title}</label><input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} required /></div>
                                <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.section}</label><input list="sections" className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.section} onChange={e => setCertForm({...certForm, section: e.target.value})} placeholder="Corsi, Master..." /><datalist id="sections"><option value="Corsi" /><option value="Master" /><option value="Seminari" /></datalist></div>
                            </div>
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.date}</label><input type="text" className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.date} onChange={e => setCertForm({...certForm, date: e.target.value})} placeholder="Dicembre 2023" /></div>
                            <div className="space-y-4"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Immagine Certificato</label><div className="flex gap-4"><input className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.image || ''} onChange={e => setCertForm({...certForm, image: e.target.value})} placeholder="URL..." /><div className="relative"><input type="file" onChange={(e) => handleFileUpload(e, 'cert')} className="hidden" id="certFile" accept="image/*" /><label htmlFor="certFile" className="flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"><Upload size={20} className="text-gray-600 dark:text-white" /></label></div></div></div>
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.desc}</label><textarea className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white h-24" value={certForm.description} onChange={e => setCertForm({...certForm, description: e.target.value})} /></div>
                            <button type="submit" className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.01] transition-transform">{t.admin.form.save}</button>
                        </form>
                   )}
                </div>
             )}

      </div>
    </div>
  );
};

export default Admin;
