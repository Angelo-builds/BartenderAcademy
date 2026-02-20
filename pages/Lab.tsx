
import React, { useState } from 'react';
import { Sparkles, Utensils, RefreshCw, ChefHat, ArrowRight, Zap, Repeat, Search, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';

type LabMode = 'create' | 'twist' | 'pair';

const Lab: React.FC = () => {
    const { isDarkMode, t, data } = useAppStore();
    const [activeMode, setActiveMode] = useState<LabMode>('create');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{title: string, content: string, extra?: string} | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Inputs for Creator
    const [baseSpirit, setBaseSpirit] = useState('Gin');
    const [mood, setMood] = useState('Rinfrescante');
    const [drinkType, setDrinkType] = useState('Cocktail'); // Shot, Long Drink, etc.
    const [ingredients, setIngredients] = useState('');

    // Inputs for Twist
    const [selectedClassic, setSelectedClassic] = useState('');

    // Inputs for Pairing
    const [pairingMode, setPairingMode] = useState<'foodToDrink' | 'drinkToFood'>('foodToDrink');
    const [pairingInput, setPairingInput] = useState('');

    const generate = async () => {
        setIsLoading(true);
        setResult(null);
        setErrorMsg(null);
        
        // CONFIGURAZIONE OLLAMA
        const OLLAMA_URL = data.siteConfig.ollamaUrl || 'http://localhost:11434/api/chat';
        const OLLAMA_MODEL = 'llama3'; 

        try {
            let userPrompt = '';
            let systemPrompt = `Sei un mixologist di fama mondiale ed esperto sommelier. 
            Devi rispondere ESCLUSIVAMENTE in formato JSON valido. Non aggiungere testo prima o dopo il JSON.
            Il JSON deve avere questa struttura esatta:
            {
                "title": "Titolo breve",
                "content": "Descrizione dettagliata o ricetta",
                "extra": "Un consiglio o curiosità breve"
            }`;

            if (activeMode === 'create') {
                userPrompt = `Crea un nuovo drink.
                Tipo: ${drinkType}. Base: ${baseSpirit}. Mood: ${mood}. Extra: ${ingredients}.
                
                Nel campo "content" metti la ricetta completa (Ingredienti e Metodo) e descrizione del sapore.`;
            } else if (activeMode === 'twist') {
                 // Get classic recipe details from DB if possible
                const classic = data.cocktails.find(c => c.name === selectedClassic);
                const classicContext = classic ? `(Ricetta originale: ${classic.ingredients.map(i => i.name).join(', ')})` : '';

                userPrompt = `Proponi 3 variazioni (twist) innovative per il cocktail: ${selectedClassic} ${classicContext}.
                Nel campo "title" scrivi "3 Twist su ${selectedClassic}".
                Nel campo "content" fai un elenco puntato delle 3 varianti.
                Nel campo "extra" scrivi quale delle 3 è la più moderna.`;
            } else if (activeMode === 'pair') {
                const direction = pairingMode === 'foodToDrink' ? `Ho questo piatto: "${pairingInput}". Consigliami il drink perfetto.` : `Ho questo drink: "${pairingInput}". Consigliami il piatto perfetto.`;
                userPrompt = `${direction} Spiega il perché dell'abbinamento (contrasto o concordanza).`;
            }

            // Chiamata a Ollama
            const response = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    format: "json", // Forza output JSON (supportato da Llama3)
                    stream: false,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error("Errore di connessione con Ollama.");
            }

            const dataResponse = await response.json();
            const rawContent = dataResponse.message?.content;

            if (rawContent) {
                try {
                    const parsed = JSON.parse(rawContent);
                    setResult(parsed);
                } catch (jsonError) {
                    console.error("JSON Parsing Error:", jsonError);
                    // Fallback se il JSON è rotto
                    setResult({
                        title: "Risultato Grezzo",
                        content: rawContent,
                        extra: "L'AI non ha formattato perfettamente il JSON."
                    });
                }
            } else {
                throw new Error("Nessuna risposta dal modello.");
            }

        } catch (e: any) {
            console.error(e);
            setErrorMsg(`Errore: ${e.message}. Assicurati che Ollama sia attivo su ${OLLAMA_URL} e configurato con OLLAMA_ORIGINS="*"`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderModeSelector = () => (
        <div className="grid grid-cols-3 gap-4 mb-12 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <button 
                onClick={() => { setActiveMode('create'); setResult(null); setErrorMsg(null); }}
                className={`py-3 px-4 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${activeMode === 'create' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Zap size={20} /> <span className="text-xs md:text-sm">{t.lab.tabs.create}</span>
            </button>
            <button 
                onClick={() => { setActiveMode('twist'); setResult(null); setErrorMsg(null); }}
                className={`py-3 px-4 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${activeMode === 'twist' ? 'bg-brand-orange text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Repeat size={20} /> <span className="text-xs md:text-sm">{t.lab.tabs.twist}</span>
            </button>
            <button 
                onClick={() => { setActiveMode('pair'); setResult(null); setErrorMsg(null); }}
                className={`py-3 px-4 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${activeMode === 'pair' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
                <Utensils size={20} /> <span className="text-xs md:text-sm">{t.lab.tabs.pair}</span>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 font-bold text-xs uppercase tracking-[0.2em] mb-6">
                    <Sparkles size={14} /> {t.nav.lab}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                    {t.lab.title}
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    {t.lab.subtitle}
                </p>
            </div>

            {renderModeSelector()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* Controls Panel */}
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
                    
                    {activeMode === 'create' && (
                        <div className="space-y-6 animate-fadeIn">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.lab.create.type}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Cocktail', 'Shot', 'Mocktail'].map(t => (
                                        <button key={t} onClick={() => setDrinkType(t)} className={`py-2 rounded-lg text-sm font-bold border ${drinkType === t ? 'bg-gray-900 text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>{t}</button>
                                    ))}
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.lab.create.base}</label>
                                <select value={baseSpirit} onChange={(e) => setBaseSpirit(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white border-r-[16px] border-transparent">
                                    {['Gin', 'Vodka', 'Rum', 'Whisky', 'Tequila', 'Mezcal', 'Cognac', 'Amaro'].map(s => <option key={s}>{s}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.lab.create.mood}</label>
                                <input value={mood} onChange={(e) => setMood(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" placeholder="Es. Estivo, Speziato..." />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.lab.create.extra}</label>
                                <input value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white" placeholder="Es. Basilico, Peperoncino..." />
                             </div>
                             <button onClick={generate} disabled={isLoading} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">{isLoading ? '...' : t.lab.create.btn}</button>
                        </div>
                    )}

                    {activeMode === 'twist' && (
                         <div className="space-y-6 animate-fadeIn">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.lab.twist.select}</label>
                                <select value={selectedClassic} onChange={(e) => setSelectedClassic(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white border-r-[16px] border-transparent">
                                    <option value="">-- Seleziona --</option>
                                    {data.cocktails.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                             </div>
                             <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm text-orange-800 dark:text-orange-200">
                                 L'AI analizzerà la struttura del classico selezionato e proporrà 3 varianti bilanciate modificando base, modificatore o parte aromatica.
                             </div>
                             <button onClick={generate} disabled={isLoading || !selectedClassic} className="w-full py-4 bg-brand-orange hover:bg-brand-red text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">{isLoading ? '...' : t.lab.twist.btn}</button>
                         </div>
                    )}

                    {activeMode === 'pair' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex bg-gray-100 dark:bg-black/50 p-1 rounded-xl">
                                <button onClick={() => setPairingMode('foodToDrink')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${pairingMode === 'foodToDrink' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}>{t.lab.pair.foodToDrink}</button>
                                <button onClick={() => setPairingMode('drinkToFood')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${pairingMode === 'drinkToFood' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}>{t.lab.pair.drinkToFood}</button>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{pairingMode === 'foodToDrink' ? 'Piatto' : 'Drink'}</label>
                                <textarea 
                                    value={pairingInput} 
                                    onChange={(e) => setPairingInput(e.target.value)} 
                                    className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl outline-none dark:text-white h-32 resize-none" 
                                    placeholder={pairingMode === 'foodToDrink' ? t.lab.pair.inputFood : t.lab.pair.inputDrink}
                                />
                            </div>
                            <button onClick={generate} disabled={isLoading || !pairingInput} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2">{isLoading ? '...' : t.lab.pair.btn}</button>
                        </div>
                    )}

                </div>

                {/* Output Panel */}
                <div className={`relative min-h-[500px] flex flex-col ${!result && !isLoading && !errorMsg ? 'justify-center items-center opacity-50' : ''}`}>
                    
                    {errorMsg && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 text-center animate-slideDown w-full">
                            <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                            <h3 className="text-red-700 dark:text-red-300 font-bold mb-1">Errore AI</h3>
                            <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                            <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <RefreshCw className="w-10 h-10 text-brand-orange animate-spin" />
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white">Ollama sta shakerando...</h3>
                            <p className="text-gray-500">Generazione in corso (Llama 3)</p>
                        </div>
                    ) : result ? (
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in relative overflow-hidden">
                             <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-20 ${activeMode === 'create' ? 'bg-purple-500' : activeMode === 'twist' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                    {result.title}
                                </h2>

                                <div className="space-y-6">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line text-lg text-gray-700 dark:text-gray-300 font-medium">{result.content}</p>
                                    </div>

                                    {result.extra && (
                                        <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-gray-800">
                                            <h3 className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs mb-2">
                                                <Sparkles size={14} /> Tip dell'esperto
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 italic">
                                                "{result.extra}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : !errorMsg && (
                        <div className="text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem] w-full h-full flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                {activeMode === 'create' ? <Zap size={32} /> : activeMode === 'twist' ? <Repeat size={32} /> : <Utensils size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pronto a iniziare?</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                Configura i parametri a sinistra e lascia che l'AI faccia la magia.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lab;
