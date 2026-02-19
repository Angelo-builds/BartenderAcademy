
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { Cocktail, TheorySection, Certificate, Ingredient } from '../types';
import { X, Edit, Trash2, LayoutList, BookOpen, Award, Share2, Copy, Check, Lock, ArrowRight, ShieldCheck, FileJson, Upload, Image as ImageIcon, Mail, Loader, FileText, Plus, Minus, Save, RotateCcw, Download, FileUp, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Admin: React.FC = () => {
  const { 
      isAdmin, login, logout, 
      addCocktail, updateCocktail, deleteCocktail, 
      data, 
      addTheory, updateTheory, deleteTheory,
      addCertificate, updateCertificate, deleteCertificate, createShareLink,
      uploadImage,
      t 
  } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [activeTab, setActiveTab] = useState<'cocktails' | 'theory' | 'certificates'>('cocktails');
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'bulk' | 'share'>('list');
  const [bulkJson, setBulkJson] = useState('');
  const [bulkErrors, setBulkErrors] = useState<string[]>([]); // New state for validation errors
  
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonUploadRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // --- Form States ---
  const emptyCocktail: Partial<Cocktail> = {
      name: '', image: '', method: 'Build', glass: 'Tumbler Basso', garnish: '', category: 'Pre Dinner', era: 'Modern', status: 'published', ingredients: [{ name: '', amount: '' }]
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

  const [selectedCertsForShare, setSelectedCertsForShare] = useState<string[]>([]);
  const [shareExpiration, setShareExpiration] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Options for Dropdowns
  const glassOptions = ['Coppa Martini', 'Tumbler Basso', 'Tumbler Alto', 'Coppa Margarita', 'Flute', 'Old Fashioned', 'Highball', 'Hurricane', 'Mule Mug', 'Julep Cup', 'Tiki Mug', 'Shot Glass', 'Calice Vino'];
  const methodOptions = ['Build', 'Shake & Strain', 'Stir & Strain', 'Muddle', 'Blend', 'Throwing', 'Shake & Fine Strain', 'Dry Shake'];
  const categoryOptions = ['Pre Dinner', 'After Dinner', 'Long Drink', 'All Day', 'Sparkling', 'Hot Drink'];
  const eraOptions = ['Professional', 'Vintage', 'Modern', 'Classic', 'Tiki'];
  const statusOptions = ['published', 'draft', 'coming_soon'];

  useEffect(() => {
      if (location.state && (location.state as any).editCocktail) {
          setCocktailForm((location.state as any).editCocktail);
          setActiveTab('cocktails');
          setViewMode('edit');
          window.history.replaceState({}, document.title);
      }
  }, [location]);

  useEffect(() => {
    if (viewMode === 'edit' && formRef.current) {
        setTimeout(() => {
            const yOffset = -100;
            const element = formRef.current;
            if (element) {
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 150);
    }
  }, [viewMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const { error } = await login(email, password);
    
    if (error) {
        setError(error.message || 'Credenziali non valide');
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cocktail' | 'theory' | 'cert') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const publicUrl = await uploadImage(file);
    setIsUploading(false);

    if (publicUrl) {
        if (type === 'cocktail') setCocktailForm(prev => ({ ...prev, image: publicUrl }));
        else if (type === 'theory') setTheoryForm(prev => ({ ...prev, image: publicUrl }));
        else if (type === 'cert') setCertForm(prev => ({ ...prev, image: publicUrl }));
    }
  };

  const handleCocktailSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); if (!cocktailForm.name) return;
      const payload = { ...cocktailForm, ingredients: cocktailForm.ingredients?.filter(i => i.name !== '') || [] } as Cocktail;
      
      try {
          if (cocktailForm.id) {
              await updateCocktail(payload);
          } else {
              await addCocktail({ ...payload, id: crypto.randomUUID() });
          }
          setViewMode('list'); 
          setCocktailForm(emptyCocktail);
      } catch (err) {
          console.error("Errore salvataggio:", err);
      }
  };

  const handleTheorySubmit = async (e: React.FormEvent) => {
      e.preventDefault(); if (!theoryForm.title) return;
      const payload = { ...theoryForm } as TheorySection;
      
      try {
        if (theoryForm.id) {
             await updateTheory(payload);
        } else {
             await addTheory({ ...payload, id: crypto.randomUUID() });
        }
        setViewMode('list'); setTheoryForm(emptyTheory);
      } catch (err) { console.error(err); }
  };
  
  const handleCertSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); if (!certForm.title) return;
      const payload = { ...certForm } as Certificate;
      
      try {
        if (certForm.id) {
             await updateCertificate(payload);
        } else {
             await addCertificate({ ...payload, id: crypto.randomUUID() });
        }
        setViewMode('list'); setCertForm(emptyCert);
      } catch (err) { console.error(err); }
  };

  // --- VALIDATION LOGIC ---
  const validateBulkData = (items: any[]): string[] => {
      const errors: string[] = [];
      
      if (!Array.isArray(items)) {
          return ["Il formato radice deve essere un Array [...]"];
      }

      items.forEach((item, index) => {
          const row = index + 1;
          if (activeTab === 'cocktails') {
              if (!item.name) errors.push(`Riga ${row}: Manca il campo 'name'`);
              if (!item.ingredients) {
                  errors.push(`Riga ${row}: Manca l'array 'ingredients'`);
              } else if (!Array.isArray(item.ingredients)) {
                  errors.push(`Riga ${row}: 'ingredients' deve essere una lista`);
              }
              // Optional checks
              if (item.image && typeof item.image !== 'string') errors.push(`Riga ${row}: 'image' deve essere una stringa (URL)`);
          }
      });
      return errors;
  };

  const handleBulkSave = async () => {
    setBulkErrors([]);
    try {
        const parsed = JSON.parse(bulkJson);
        const validationErrors = validateBulkData(parsed);

        if (validationErrors.length > 0) {
            setBulkErrors(validationErrors);
            return;
        }

        if(!window.confirm(`Stai per importare ${parsed.length} elementi. Confermi?`)) return;

        // Loop and upsert
        for(const item of parsed) {
           if(activeTab === 'cocktails') await updateCocktail(item);
           // Not implementing others for safety/brevity
        }
        
        alert("Importazione completata con successo!");
        setViewMode('list');
    } catch(e: any) {
        setBulkErrors([`Errore di sintassi JSON: ${e.message}`]);
    }
  };

  const handleDownloadJSON = () => {
      const fileName = activeTab === 'cocktails' ? 'cocktails.json' : 'data.json';
      const blob = new Blob([bulkJson], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleUploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          if (event.target?.result) {
              setBulkJson(event.target.result as string);
              setBulkErrors([]); // Clear previous errors on new upload
          }
      };
      reader.readAsText(file);
  };

  // Ingredients Handlers
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
      const newIngredients = [...(cocktailForm.ingredients || [])];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      setCocktailForm({ ...cocktailForm, ingredients: newIngredients });
  };

  const addIngredient = () => {
      setCocktailForm({ ...cocktailForm, ingredients: [...(cocktailForm.ingredients || []), { name: '', amount: '' }] });
  };

  const removeIngredient = (index: number) => {
      const newIngredients = [...(cocktailForm.ingredients || [])];
      newIngredients.splice(index, 1);
      setCocktailForm({ ...cocktailForm, ingredients: newIngredients });
  };

  // Share Logic
  const handleCreateShareLink = async () => {
      if (selectedCertsForShare.length === 0) return;
      const name = `Link generato il ${new Date().toLocaleDateString()}`;
      const slug = await createShareLink(selectedCertsForShare, shareExpiration ? shareExpiration : null, name);
      const url = `${window.location.origin}${window.location.pathname}#/shared/${slug}`;
      setGeneratedLink(url);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
  };

  const certsBySection = (data.certificates || []).reduce((acc, cert) => {
      (acc[cert.section] = acc[cert.section] || []).push(cert);
      return acc;
  }, {} as Record<string, Certificate[]>);

  if (!isAdmin) {
      // Login Form
      return (
      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden -mt-12 md:-mt-0">
          <div className="relative z-10 w-full max-w-md px-4">
             <div className="bg-white/80 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl dark:shadow-black/50 p-8 md:p-12">
                <div className="text-center mb-10">
                    <div className="relative w-24 h-24 mx-auto mb-6 group">
                         <Lock className="text-brand-orange w-12 h-12 mx-auto" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{t.admin.loginTitle}</h2>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:border-brand-orange outline-none dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border-2 border-transparent focus:border-brand-orange outline-none dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    {error && <div className="text-red-500 text-center font-bold">{error}</div>}
                    <button type="submit" disabled={isLoading} className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-black hover:scale-[1.02] transition-transform">{isLoading ? '...' : t.admin.loginButton}</button>
                </form>
             </div>
          </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
              <div>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t.admin.dashboard}</h1>
                  <p className="text-gray-500">{t.admin.manage}</p>
              </div>
              <button onClick={logout} className="mt-4 md:mt-0 px-6 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 transition-colors">{t.admin.logout}</button>
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button onClick={() => { setActiveTab('cocktails'); setViewMode('edit'); setCocktailForm(emptyCocktail); }} className="group p-6 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 hover:border-brand-orange transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-4 shadow-lg"><LayoutList size={24} /></div>
                  <h3 className="font-bold text-lg dark:text-white">Nuovo Cocktail</h3>
              </button>
              <button onClick={() => { setActiveTab('theory'); setViewMode('edit'); setTheoryForm(emptyTheory); }} className="group p-6 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 hover:border-blue-500 transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg"><BookOpen size={24} /></div>
                  <h3 className="font-bold text-lg dark:text-white">Nuova Sezione</h3>
              </button>
              <button onClick={() => { setActiveTab('certificates'); setViewMode('edit'); setCertForm(emptyCert); }} className="group p-6 rounded-3xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 hover:border-purple-500 transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-lg"><Award size={24} /></div>
                  <h3 className="font-bold text-lg dark:text-white">Nuovo Certificato</h3>
              </button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-900 p-1.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm inline-flex items-center gap-1">
              {[{ id: 'cocktails', label: t.admin.tabs.recipes, icon: LayoutList }, { id: 'theory', label: t.admin.tabs.theory, icon: BookOpen }, { id: 'certificates', label: t.admin.tabs.certificates, icon: Award }].map((tab) => (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setViewMode('list'); }} className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}><tab.icon size={16} /> {tab.label}</button>
              ))}
          </div>
      </div>

      <div className="flex flex-col gap-8">
            {/* LIST VIEWS */}
            {viewMode === 'list' && (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[500px]">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                         {activeTab === 'cocktails' && (<button onClick={() => { setBulkJson(JSON.stringify(data.cocktails, null, 2)); setViewMode('bulk'); setBulkErrors([]); }} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"><FileJson size={14} /> JSON</button>)}
                         {activeTab === 'certificates' && (<button onClick={() => { setViewMode('share'); setSelectedCertsForShare([]); setGeneratedLink(''); }} className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-2"><Share2 size={14} /> Share</button>)}
                    </div>
                    
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {activeTab === 'cocktails' && data.cocktails.map(c => (
                            <div key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${c.status === 'coming_soon' ? 'bg-yellow-400' : 'bg-green-400'}`}></div><img src={c.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /><div><p className="font-bold text-gray-800 dark:text-gray-200">{c.name}</p><p className="text-xs text-gray-400">{c.category}</p></div></div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setCocktailForm(c); setViewMode('edit');}} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button><button onClick={() => {if(window.confirm('Delete?')) deleteCocktail(c.id)}} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button></div>
                            </div>
                        ))}
                        {activeTab === 'theory' && data.theory.map(t => (
                             <div key={t.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${t.status === 'draft' ? 'bg-gray-400' : 'bg-green-400'}`}></div><img src={t.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /><div><p className="font-bold text-gray-800 dark:text-gray-200">{t.title}</p><p className="text-xs text-gray-400">{t.category}</p></div></div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setTheoryForm(t); setViewMode('edit');}} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button><button onClick={() => {if(window.confirm('Delete?')) deleteTheory(t.id)}} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button></div>
                            </div>
                        ))}
                        {activeTab === 'certificates' && Object.entries(certsBySection).map(([section, certs]) => (
                             <div key={section} className="bg-gray-50/50 dark:bg-gray-900/50">
                                 <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold text-xs uppercase text-gray-500">{section}</div>
                                 {certs.map(cert => (
                                      <div key={cert.id} className="p-4 pl-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-between group transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                         <div className="flex items-center gap-4"><img src={cert.image || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-xl object-cover bg-gray-100" /><div><p className="font-bold text-gray-800 dark:text-gray-200">{cert.title}</p><p className="text-xs text-gray-400">{cert.date}</p></div></div>
                                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => {setCertForm(cert); setViewMode('edit');}} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={16} /></button><button onClick={() => {if(window.confirm('Delete?')) deleteCertificate(cert.id)}} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16} /></button></div>
                                     </div>
                                 ))}
                             </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* BULK JSON VIEW */}
            {viewMode === 'bulk' && (
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-lg p-8 animate-slideDown">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2"><FileJson /> Editor Massivo</h2>
                        <div className="flex gap-2">
                             <input type="file" ref={jsonUploadRef} onChange={handleUploadJSON} className="hidden" accept=".json" />
                             <button onClick={() => jsonUploadRef.current?.click()} className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"><FileUp size={16} /> Carica JSON</button>
                             <button onClick={handleDownloadJSON} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"><Download size={16} /> Scarica JSON</button>
                             <button onClick={() => setViewMode('list')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"><X size={24} /></button>
                        </div>
                    </div>
                    
                    {/* INFO BOX FOR IMAGES */}
                    <div className="mb-4 text-sm p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-200">
                        <strong>Gestione Immagini:</strong> Nel JSON puoi inserire un URL immagine (es. da Unsplash) nel campo <code>"image"</code>. Se non hai ancora la foto, lascia il campo vuoto <code>""</code>. Potrai caricarla in un secondo momento usando il tasto <strong>Edit</strong> (matita) nella lista cocktail.
                    </div>

                    {/* ERROR DISPLAY */}
                    {bulkErrors.length > 0 && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50 max-h-40 overflow-y-auto">
                            <h4 className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 mb-2"><AlertTriangle size={16} /> Errori trovati ({bulkErrors.length})</h4>
                            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-1">
                                {bulkErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {bulkErrors.length === 0 && (
                        <div className="mb-4 text-sm text-gray-500 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800/50">
                             Attenzione: Modificare direttamente il JSON può corrompere i dati se la sintassi non è corretta. Assicurati di mantenere la struttura dei campi.
                        </div>
                    )}

                    <textarea 
                        className={`w-full h-[450px] font-mono text-sm p-4 bg-gray-50 dark:bg-black rounded-xl border outline-none focus:border-brand-orange text-gray-800 dark:text-gray-300 resize-none ${bulkErrors.length > 0 ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-gray-800'}`}
                        value={bulkJson}
                        onChange={(e) => setBulkJson(e.target.value)}
                        placeholder='[ { "name": "...", ... } ]'
                    />
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setViewMode('list')} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"><RotateCcw size={18} /> Annulla</button>
                        <button onClick={handleBulkSave} className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-brand-red flex items-center gap-2"><Save size={18} /> Verifica & Salva</button>
                    </div>
                </div>
            )}

             {/* EDIT FORMS */}
             {viewMode === 'edit' && (
                <div ref={formRef} className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 animate-slideDown mb-20">
                   <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-bold dark:text-white">{activeTab === 'cocktails' ? (cocktailForm.id ? 'Modifica' : 'Nuovo') : activeTab === 'theory' ? (theoryForm.id ? 'Modifica' : 'Nuovo') : (certForm.id ? 'Modifica Certificato' : t.admin.certs.add)}</h2><button onClick={() => setViewMode('list')}><X size={24} className="text-gray-400" /></button></div>
                   
                   {/* COCKTAIL FORM */}
                   {activeTab === 'cocktails' && (
                        <form onSubmit={handleCocktailSubmit} className="space-y-8">
                            {/* Top Section: Name, Status, Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                     <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.name}</label>
                                        <input className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white border-2 border-transparent focus:border-brand-orange" value={cocktailForm.name} onChange={e => setCocktailForm({...cocktailForm, name: e.target.value})} required />
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Stato</label>
                                            <select className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" value={cocktailForm.status} onChange={e => setCocktailForm({...cocktailForm, status: e.target.value as any})}>
                                                {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.category}</label>
                                            <select className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" value={cocktailForm.category} onChange={e => setCocktailForm({...cocktailForm, category: e.target.value})}>
                                                {categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                         </div>
                                     </div>

                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Metodo</label>
                                            <select className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" value={cocktailForm.method} onChange={e => setCocktailForm({...cocktailForm, method: e.target.value})}>
                                                {methodOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Bicchiere</label>
                                            <select className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" value={cocktailForm.glass} onChange={e => setCocktailForm({...cocktailForm, glass: e.target.value})}>
                                                {glassOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                         </div>
                                     </div>
                                     
                                      <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Era / Classificazione</label>
                                        <select className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" value={cocktailForm.era} onChange={e => setCocktailForm({...cocktailForm, era: e.target.value as any})}>
                                            {eraOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                     </div>
                                </div>

                                <div className="space-y-4">
                                     <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Immagine Drink</label>
                                     <div className="bg-gray-50 dark:bg-black/50 rounded-2xl p-4 border-2 border-dashed border-gray-200 dark:border-gray-800">
                                          {cocktailForm.image && (
                                              <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-white dark:bg-gray-800">
                                                  <img src={cocktailForm.image} alt="Preview" className="w-full h-full object-cover" />
                                              </div>
                                          )}
                                          <div className="flex gap-2">
                                             <input className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl text-sm border border-gray-200 dark:border-gray-700 outline-none dark:text-white" value={cocktailForm.image || ''} onChange={e => setCocktailForm({...cocktailForm, image: e.target.value})} placeholder="URL Immagine..." />
                                             <div className="relative">
                                                <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'cocktail')} className="hidden" accept="image/*" disabled={isUploading} />
                                                <button type="button" onClick={() => !isUploading && fileInputRef.current?.click()} className="p-3 bg-brand-orange text-white rounded-xl hover:bg-brand-red transition-colors disabled:opacity-50">
                                                    {isUploading ? <Loader size={20} className="animate-spin" /> : <Upload size={20} />}
                                                </button>
                                             </div>
                                          </div>
                                     </div>
                                      <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.garnish}</label>
                                        <input className="w-full p-4 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={cocktailForm.garnish} onChange={e => setCocktailForm({...cocktailForm, garnish: e.target.value})} />
                                     </div>
                                </div>
                            </div>

                            {/* Ingredients Section */}
                            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex justify-between items-center">
                                    Ingredienti
                                    <button type="button" onClick={addIngredient} className="text-brand-orange flex items-center gap-1 hover:underline"><Plus size={14} /> Aggiungi</button>
                                </label>
                                
                                <div className="space-y-3">
                                    {cocktailForm.ingredients?.map((ing, idx) => (
                                        <div key={idx} className="flex gap-3 items-center group">
                                            <input 
                                                className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" 
                                                placeholder="Nome (es. Gin)"
                                                value={ing.name}
                                                onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                                            />
                                            <input 
                                                className="w-1/3 p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white text-center" 
                                                placeholder="Qt (es. 1 oz)"
                                                value={ing.amount}
                                                onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeIngredient(idx)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-50">
                                {t.admin.form.save}
                            </button>
                        </form>
                   )}
                   
                   {/* THEORY FORM */}
                   {activeTab === 'theory' && (
                       <form onSubmit={handleTheorySubmit} className="space-y-6">
                            <input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={theoryForm.title} onChange={e => setTheoryForm({...theoryForm, title: e.target.value})} placeholder="Titolo" required />
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500">Categoria</label><select className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={theoryForm.category} onChange={e => setTheoryForm({...theoryForm, category: e.target.value as any})}><option value="Basics">Basics</option><option value="Rules">Rules</option><option value="Distillates">Distillates</option></select></div>
                            <textarea className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white h-64 font-mono text-sm" value={theoryForm.content} onChange={e => setTheoryForm({...theoryForm, content: e.target.value})} placeholder="Markdown content..." />
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase text-gray-500">Immagine</label>
                                <div className="flex gap-4">
                                    <input className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" value={theoryForm.image || ''} onChange={e => setTheoryForm({...theoryForm, image: e.target.value})} placeholder="URL..." />
                                    <div className="relative">
                                        <input type="file" onChange={(e) => handleFileUpload(e, 'theory')} className="hidden" id="theoryFile" accept="image/*" disabled={isUploading} />
                                        <label htmlFor="theoryFile" className={`flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {isUploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} className="text-gray-600 dark:text-white" />}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={isUploading} className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold disabled:opacity-50">{t.admin.form.save}</button>
                       </form>
                   )}
                   
                   {/* CERT FORM */}
                   {activeTab === 'certificates' && (
                        <form onSubmit={handleCertSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.title}</label><input className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} required /></div><div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.section}</label><select className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white cursor-pointer" value={certForm.section} onChange={e => setCertForm({...certForm, section: e.target.value})}><option value="Corsi">Corsi</option><option value="Master">Master</option><option value="Seminari">Seminari</option><option value="Altro">Altro</option></select></div></div>
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.date}</label><input type="text" className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.date} onChange={e => setCertForm({...certForm, date: e.target.value})} placeholder="Dicembre 2023" /></div>
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Immagine Certificato</label>
                                <div className="flex gap-4">
                                    <input className="flex-1 p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={certForm.image || ''} onChange={e => setCertForm({...certForm, image: e.target.value})} placeholder="URL..." />
                                    <div className="relative">
                                        <input type="file" onChange={(e) => handleFileUpload(e, 'cert')} className="hidden" id="certFile" accept="image/*" disabled={isUploading} />
                                        <label htmlFor="certFile" className={`flex items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {isUploading ? <Loader className="animate-spin" size={20} /> : <Upload size={20} className="text-gray-600 dark:text-white" />}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{t.admin.form.desc}</label><textarea className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white h-24" value={certForm.description} onChange={e => setCertForm({...certForm, description: e.target.value})} /></div>
                            <button type="submit" disabled={isUploading} className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-50">{t.admin.form.save}</button>
                        </form>
                   )}
                </div>
             )}

             {viewMode === 'share' && activeTab === 'certificates' && (
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 animate-fadeIn">
                     <div className="flex justify-between items-center mb-8">
                        <div><h2 className="text-2xl font-bold dark:text-white">{t.admin.certs.shareTitle}</h2><p className="text-gray-500 text-sm">{t.admin.certs.shareDesc}</p></div>
                        <button onClick={() => setViewMode('list')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={24} /></button>
                    </div>
                    {!generatedLink ? (
                        <>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {(data.certificates || []).map(cert => (
                                    <div key={cert.id} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedCertsForShare.includes(cert.id) ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black'}`} onClick={() => {if (selectedCertsForShare.includes(cert.id)) setSelectedCertsForShare(prev => prev.filter(id => id !== cert.id)); else setSelectedCertsForShare(prev => [...prev, cert.id]);}}><div className="flex items-center gap-3"><div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedCertsForShare.includes(cert.id) ? 'bg-brand-orange border-brand-orange text-white' : 'border-gray-300'}`}>{selectedCertsForShare.includes(cert.id) && <Check size={12} />}</div><div><p className="font-bold text-sm dark:text-white">{cert.title}</p><p className="text-xs text-gray-400">{cert.section}</p></div></div></div>
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row items-end gap-4 border-t border-gray-100 dark:border-gray-800 pt-6"><div className="w-full md:w-auto flex-grow"><label className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2 block">{t.admin.certs.expires}</label><input type="date" className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl border-none outline-none dark:text-white" value={shareExpiration} onChange={e => setShareExpiration(e.target.value)} /></div><button onClick={handleCreateShareLink} disabled={selectedCertsForShare.length === 0} className="w-full md:w-auto px-8 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-red transition-colors">{t.admin.certs.generateLink}</button></div>
                        </>
                    ) : (
                        <div className="text-center py-12"><div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} /></div><h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Link Pronto!</h3><div className="flex items-center gap-2 max-w-xl mx-auto bg-gray-50 dark:bg-black rounded-xl p-2 border border-gray-200 dark:border-gray-800 mb-6"><input readOnly value={generatedLink} className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-600 dark:text-gray-300" /><button onClick={copyToClipboard} className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">{linkCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}</button></div><button onClick={() => { setGeneratedLink(''); setSelectedCertsForShare([]); }} className="text-brand-orange font-bold text-sm hover:underline">Genera un altro link</button></div>
                    )}
                </div>
            )}
      </div>
    </div>
  );
};

export default Admin;
