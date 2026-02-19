
import React, { useState } from 'react';
import { RefreshCw, Timer, Droplets, GlassWater, Activity, Calculator } from 'lucide-react';

const Tools: React.FC = () => {
    // Base unit is always OZ for calculations
    const [oz, setOz] = useState<string>('');
    const [ml, setMl] = useState<string>('');
    const [cl, setCl] = useState<string>('');
    
    // Bar Units
    const [counts, setCounts] = useState<string>(''); // Metal Pour (1oz = 4 tempi)
    const [splashes, setSplashes] = useState<string>(''); // 1 splash = 1/2 oz
    const [dashes, setDashes] = useState<string>(''); // 1 dash = 1/8 oz

    const [bpmActive, setBpmActive] = useState(false);

    // --- CALCULATION LOGIC ---
    const updateFromOz = (val: string) => {
        setOz(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setMl((num * 29.5735).toFixed(1));
            setCl((num * 2.95735).toFixed(2));
            setCounts((num * 4).toFixed(1));      // 1 oz = 4 counts
            setSplashes((num * 2).toFixed(1));    // 1 oz = 2 splashes
            setDashes((num * 8).toFixed(1));      // 1 oz = 8 dashes
        } else {
            clearAll();
        }
    };

    const updateFromMl = (val: string) => {
        setMl(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            const ozVal = num / 29.5735;
            setOz(ozVal.toFixed(2));
            setCl((num / 10).toFixed(2));
            setCounts((ozVal * 4).toFixed(1));
            setSplashes((ozVal * 2).toFixed(1));
            setDashes((ozVal * 8).toFixed(1));
        } else {
            clearAll(false); // keep ml
        }
    };

    const updateFromCl = (val: string) => {
        setCl(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            const ozVal = num / 2.95735;
            setOz(ozVal.toFixed(2));
            setMl((num * 10).toFixed(1));
            setCounts((ozVal * 4).toFixed(1));
            setSplashes((ozVal * 2).toFixed(1));
            setDashes((ozVal * 8).toFixed(1));
        } else {
            clearAll(false); // keep cl
        }
    };

    const updateFromCounts = (val: string) => {
        setCounts(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            // 1 count = 0.25 oz
            const ozVal = num * 0.25;
            setOz(ozVal.toFixed(2));
            setMl((ozVal * 29.5735).toFixed(1));
            setCl((ozVal * 2.95735).toFixed(2));
            setSplashes((ozVal * 2).toFixed(1));
            setDashes((ozVal * 8).toFixed(1));
        } else {
            clearAll(false);
        }
    };

    const clearAll = (clearSource = true) => {
        if(clearSource) {
            setOz(''); setMl(''); setCl(''); setCounts(''); setSplashes(''); setDashes('');
        }
    };

    const reset = () => {
        setOz(''); setMl(''); setCl(''); setCounts(''); setSplashes(''); setDashes('');
        setBpmActive(false);
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
             <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-bold text-xs uppercase tracking-[0.2em] mb-6">
                    <Calculator size={14} /> Utility
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                    Bar Tools
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Convertitore universale per Barman. Calcola dosaggi, free pouring e unità di misura in tempo reale.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 animate-fadeIn">
                
                {/* STANDARD UNITS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider text-center block">Oz (Oncia)</label>
                        <input 
                            type="number" 
                            value={oz} 
                            onChange={(e) => updateFromOz(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center text-3xl font-black text-gray-900 dark:text-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>
                        <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider text-center block">Ml (Millilitri)</label>
                        <input 
                            type="number" 
                            value={ml} 
                            onChange={(e) => updateFromMl(e.target.value)}
                            className="w-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 text-center text-3xl font-black text-blue-600 dark:text-blue-400 focus:border-blue-500 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>
                        <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500 tracking-wider text-center block">Cl (Centilitri)</label>
                        <input 
                            type="number" 
                            value={cl} 
                            onChange={(e) => updateFromCl(e.target.value)}
                            className="w-full bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 text-center text-3xl font-black text-purple-600 dark:text-purple-400 focus:border-purple-500 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-12"></div>

                {/* BARMAN UNITS */}
                <div className="space-y-8">
                    
                    {/* Metal Pour / Counts */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-brand-orange font-bold uppercase text-sm tracking-wider mb-1">
                                    <Activity size={18} /> Metal Pour (Tempi)
                                </label>
                                <span className="text-xs text-gray-400">Calibrato su Metal Pour standard (1 Tempo = 1/4 oz)</span>
                            </div>
                            <button 
                                onClick={() => setBpmActive(!bpmActive)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2 ${bpmActive ? 'bg-brand-orange text-white border-brand-orange shadow-lg animate-pulse' : 'bg-white dark:bg-black text-gray-500 border-gray-200 dark:border-gray-600 hover:border-gray-400'}`}
                            >
                                <Timer size={14} />
                                {bpmActive ? 'METRONOMO ATTIVO (157 BPM)' : 'AVVIA METRONOMO (157 BPM)'}
                            </button>
                            </div>
                            
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={counts} 
                                    onChange={(e) => updateFromCounts(e.target.value)}
                                    className="w-full bg-transparent text-6xl md:text-8xl font-black text-gray-900 dark:text-white outline-none placeholder-gray-200 dark:placeholder-gray-700"
                                    placeholder="0"
                                />
                                <span className="absolute top-1/2 -translate-y-1/2 right-0 text-xl font-bold text-gray-300 dark:text-gray-600 pointer-events-none">COUNTS</span>
                            </div>
                            
                            {/* BPM Visualizer */}
                            <div className="absolute bottom-0 left-0 h-1.5 bg-brand-orange transition-all duration-[382ms] ease-in-out" style={{ width: bpmActive ? '100%' : '0%', opacity: bpmActive ? 1 : 0, animation: bpmActive ? 'pulseWidth 0.382s infinite' : 'none' }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Speed Bottle */}
                        <div className="bg-white dark:bg-gray-800/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <label className="flex items-center gap-2 text-blue-500 font-bold uppercase text-xs tracking-wider">
                                    <GlassWater size={16} /> Splash
                                </label>
                            </div>
                            <div className="text-4xl font-black text-gray-900 dark:text-white">
                                {splashes || '0'} <span className="text-lg text-gray-400 font-medium">/ ½ oz</span>
                            </div>
                        </div>

                        {/* Squeezer */}
                        <div className="bg-white dark:bg-gray-800/30 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <label className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs tracking-wider">
                                    <Droplets size={16} /> Dash
                                </label>
                            </div>
                            <div className="text-4xl font-black text-gray-900 dark:text-white">
                                {dashes || '0'} <span className="text-lg text-gray-400 font-medium">/ 1/8 oz</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-12">
                    <button onClick={reset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-orange transition-colors font-bold px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <RefreshCw size={16} /> Reset Valori
                    </button>
                </div>

            </div>
            
            <style>{`
                @keyframes pulseWidth {
                    0% { width: 0%; opacity: 0.8; }
                    50% { width: 100%; opacity: 1; }
                    100% { width: 0%; opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default Tools;
