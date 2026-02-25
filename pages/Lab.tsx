import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Utensils, RefreshCw, ChefHat, ArrowRight, Zap, Repeat, Search, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';

type LabMode = 'create' | 'twist' | 'pair';

const Lab: React.FC = () => {
    const { isDarkMode, t, data, language } = useAppStore();
    const [activeMode, setActiveMode] = useState<LabMode>('create');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{title: string, content: string, extra?: string} | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Inputs for Creator
    const [baseSpirit, setBaseSpirit] = useState('Gin');
    const [mood, setMood] = useState('Rinfrescante');
    const [drinkType, setDrinkType] = useState('Cocktail'); 
    const [ingredients, setIngredients] = useState('');

    // Inputs for Twist
    const [selectedClassic, setSelectedClassic] = useState('');

    // Inputs for Pairing
    const [pairingMode, setPairingMode] = useState<'foodToDrink' | 'drinkToFood'>('foodToDrink');
    const [pairingInput, setPairingInput] = useState('');

    // CONFIGURAZIONE OLLAMA (URL relativo per funzionare via NPM)
    const OLLAMA_URL = '/api/chat';
    const OLLAMA_MODEL = 'mixologist'; 

    const generate = async () => {
        setIsLoading(true);
        setResult(null);
        setErrorMsg(null);
        
        try {
            let userPrompt = '';
            let systemPrompt = `Sei un mixologist di fama mondiale ed esperto sommelier. 
            Rispondi in ${language === 'it' ? 'Italiano' : 'Inglese'}.
            Devi rispondere ESCLUSIVAMENTE in formato JSON valido.
            Il JSON deve avere questa struttura esatta:
            {
                "title": "Titolo breve",
                "content": "Descrizione dettagliata o ricetta usando Markdown per liste",
                "extra": "Un consiglio o curiosità breve"
            }`;

            if (activeMode === 'create') {
                userPrompt = `Crea un nuovo drink di tipo ${drinkType}. Base spirit: ${baseSpirit}. Mood: ${mood}. Ingredienti aggiuntivi: ${ingredients}.
                Nel campo "content" scrivi la ricetta (Ingredienti e Metodo) ben formattata.`;
            } else if (activeMode === 'twist') {
                const classic = data.cocktails.find(c => c.name === selectedClassic);
                const classicContext = classic ? `(Ingredienti originali: ${classic.ingredients.map(i => i.name).join(', ')})` : '';
                userPrompt = `Proponi 3 variazioni innovative per il cocktail ${selectedClassic}. ${classicContext}
                Nel campo "content" usa un elenco puntato Markdown per descrivere i 3 twist.`;
            } else if (activeMode === 'pair') {
                const direction = pairingMode === 'foodToDrink' ? `Piatto: "${pairingInput}".` : `Drink: "${pairingInput}".`;
                userPrompt = `${direction} Consiglia l'abbinamento perfetto spiegando il motivo (contrasto o concordanza).`;
            }

            const response = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    format: "json",
                    stream: false,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ]
                })
            });

            if (!response.ok) throw new Error("Errore di connessione con Ollama.");

            const dataResponse = await response.json();
            const rawContent = dataResponse.message?.content;

            if (rawContent) {
                try {
                    let parsed = JSON.parse(rawContent);
                    
                    // CORREZIONE ERRORE #31: Se content è un oggetto, lo trasformiamo in stringa
                    if (typeof parsed.content === 'object' && parsed.content !== null) {
                        parsed.content = Object.entries(parsed.content)
                            .map(([key, value]) => `**${key.toUpperCase()}**:\n${value}`)
                            .join('\n\n');
                    }

                    setResult(parsed);
                } catch (jsonError) {
                    setResult({
                        title: "Risultato",
                        content: rawContent,
                        extra: "Nota: L'AI ha risposto in formato testuale."
                    });
                }
            }
        } catch (e: any) {
            setErrorMsg(`Il barman è occupato. Verifica che Ollama sia attivo.`);
        } finally {
            setIsLoading(false);
        }
    };

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

            <div className="grid grid-cols-3 gap-4 mb-12 bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <button onClick={() => { setActiveMode('create'); setResult(null); }} className={`py-3 px-4 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${activeMode === 'create' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Zap size={20} /> <span className="text-xs md:text-sm">{t.lab.tabs.create}</span>
                </button>
                <button onClick={() => { setActiveMode('twist'); setResult(null); }} className={`py-3 px-4 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${activeMode === 'twist' ? 'bg-brand-orange text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Repeat size={20} /> <span className="text-xs md:text-sm">{t.lab.tabs.twist}</span>
                </button>
                <button onClick={() => { setActiveMode('pair'); setResult(null); }} className={`py-3 px-4 rounded-xl font-bold flex flex-col md:flex-row items-center justify-center gap-2 transition-all ${activeMode === 'pair' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <Utensils size={20} /> <span className="text-xs md:text-sm">{t.lab.tabs.pair}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Panel Sinistro: Input */}
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                    {activeMode === 'create' && (
                        <div className="space-y-6">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lab.create.type}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Cocktail', 'Shot', 'Mocktail'].map(v => (
                                        <button key={v} onClick={() => setDrinkType(v)} className={`py-2 rounded-lg text-sm font-bold border ${drinkType === v ? 'bg-gray-900 text-white dark:bg-white dark:text-black' : 'text-gray-500 border-gray-200 dark:border-gray-700'}`}>{v}</button>
                                    ))}
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lab.create.base}</label>
                                <select value={baseSpirit} onChange={(e) => setBaseSpirit(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl dark:text-white">
                                    {['Gin', 'Vodka', 'Rum', 'Whisky', 'Tequila', 'Mezcal', 'Amaro'].map(s => <option key={s}>{s}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mood</label>
                                <input value={mood} onChange={(e) => setMood(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl dark:text-white" placeholder="Es. Tropicale, Notturno..." />
                             </div>
                             <button onClick={generate} disabled={isLoading} className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30">
                                {isLoading ? 'Agitando...' : t.lab.create.btn}
                             </button>
                        </div>
                    )}

                    {activeMode === 'twist' && (
                         <div className="space-y-6">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.lab.twist.select}</label>
                             <select value={selectedClassic} onChange={(e) => setSelectedClassic(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl dark:text-white">
                                <option value="">-- Seleziona --</option>
                                {data.cocktails.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                             </select>
                             <button onClick={generate} disabled={isLoading || !selectedClassic} className="w-full py-4 bg-brand-orange text-white rounded-xl font-bold">
                                {isLoading ? 'Studiando...' : t.lab.twist.btn}
                             </button>
                         </div>
                    )}

                    {activeMode === 'pair' && (
                        <div className="space-y-6">
                            <div className="flex bg-gray-100 dark:bg-black/50 p-1 rounded-xl">
                                <button onClick={() => setPairingMode('foodToDrink')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${pairingMode === 'foodToDrink' ? 'bg-white dark:bg-gray-800' : 'text-gray-500'}`}>Cerca Drink</button>
                                <button onClick={() => setPairingMode('drinkToFood')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${pairingMode === 'drinkToFood' ? 'bg-white dark:bg-gray-800' : 'text-gray-500'}`}>Cerca Piatto</button>
                            </div>
                            <textarea value={pairingInput} onChange={(e) => setPairingInput(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-black/50 rounded-xl dark:text-white h-32 resize-none" placeholder="Inserisci cosa stai mangiando o bevendo..." />
                            <button onClick={generate} disabled={isLoading || !pairingInput} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold">
                                {isLoading ? 'Abbinando...' : t.lab.pair.btn}
                            </button>
                        </div>
                    )}
                </div>

                {/* Panel Destro: Output */}
                <div className="relative min-h-[400px]">
                    {errorMsg && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 text-center">
                            <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                            <p className="text-sm text-red-600">{errorMsg}</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <RefreshCw className="w-12 h-12 text-brand-orange animate-spin mb-4" />
                            <h3 className="text-xl font-bold dark:text-white">Il Mixologist sta pensando...</h3>
                        </div>
                    ) : result ? (
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{result.title}</h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                                <div className="text-lg text-gray-700 dark:text-gray-300">
                                    <ReactMarkdown>{String(result.content)}</ReactMarkdown>
                                </div>
                            </div>
                            {result.extra && (
                                <div className="p-6 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-gray-800 italic text-gray-600 dark:text-gray-400">
                                    <Sparkles size={14} className="text-brand-orange mb-1" /> "{result.extra}"
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[3rem] opacity-50">
                            <ChefHat size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500">Configura i parametri a sinistra per iniziare.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Lab;
