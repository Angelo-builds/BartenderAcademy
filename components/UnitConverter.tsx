
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Timer, Droplets, GlassWater, Activity } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const UnitConverter: React.FC<Props> = ({ isOpen, onClose }) => {
    // Base unit is always OZ for calculations
    const [oz, setOz] = useState<string>('');
    const [ml, setMl] = useState<string>('');
    const [cl, setCl] = useState<string>('');
    
    // Bar Units
    const [counts, setCounts] = useState<string>(''); // Metal Pour (1oz = 4 tempi)
    const [splashes, setSplashes] = useState<string>(''); // 1 splash = 1/2 oz
    const [dashes, setDashes] = useState<string>(''); // 1 dash = 1/8 oz

    const [bpmActive, setBpmActive] = useState(false);

    if (!isOpen) return null;

    // --- CALCULATION LOGIC ---
    // 1 oz = 29.5735 ml
    // 1 count (tempo) = 1/4 oz (0.25)
    // 1 splash = 1/2 oz (0.5)
    // 1 dash = 1/8 oz (0.125)

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
        } else {
           // Helper to clear others if needed, simplified for now
        }
    };

    const reset = () => {
        setOz(''); setMl(''); setCl(''); setCounts(''); setSplashes(''); setDashes('');
        setBpmActive(false);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative bg-gray-900 border border-gray-700 w-full max-w-lg rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
                
                {/* Header */}
                <div className="bg-brand-orange px-8 py-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-white flex items-center gap-2">
                            <Timer size={24} /> Bar Tool
                        </h3>
                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Free Pour Calculator</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    
                    {/* STANDARD UNITS */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider text-center block">Oz</label>
                            <input 
                                type="number" 
                                value={oz} 
                                onChange={(e) => updateFromOz(e.target.value)}
                                className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 text-center text-xl font-bold text-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
                                placeholder="0"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider text-center block">Ml</label>
                            <input 
                                type="number" 
                                value={ml} 
                                onChange={(e) => updateFromMl(e.target.value)}
                                className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 text-center text-xl font-bold text-blue-400 focus:border-blue-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider text-center block">Cl</label>
                            <input 
                                type="number" 
                                value={cl} 
                                onChange={(e) => updateFromCl(e.target.value)}
                                className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 text-center text-xl font-bold text-purple-400 focus:border-purple-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-800"></div>

                    {/* BARMAN UNITS */}
                    <div className="space-y-6">
                        
                        {/* Metal Pour / Counts */}
                        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700 relative overflow-hidden group">
                             <div className="flex justify-between items-center mb-2">
                                <label className="flex items-center gap-2 text-brand-orange font-bold uppercase text-xs tracking-wider">
                                    <Activity size={14} /> Metal Pour (Tempi)
                                </label>
                                <span className="text-[10px] text-gray-500">1 Tempo = 1/4 oz</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <input 
                                    type="number" 
                                    value={counts} 
                                    onChange={(e) => updateFromCounts(e.target.value)}
                                    className="flex-1 bg-transparent text-4xl font-black text-white outline-none placeholder-gray-700"
                                    placeholder="0"
                                />
                                <button 
                                    onClick={() => setBpmActive(!bpmActive)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${bpmActive ? 'bg-brand-orange text-white border-brand-orange animate-pulse' : 'bg-transparent text-gray-500 border-gray-600 hover:border-gray-400'}`}
                                >
                                    {bpmActive ? '157 BPM ON' : '157 BPM'}
                                </button>
                             </div>
                             {/* BPM Visualizer */}
                             <div className="absolute bottom-0 left-0 h-1 bg-brand-orange transition-all duration-[382ms] ease-in-out" style={{ width: bpmActive ? '100%' : '0%', opacity: bpmActive ? 1 : 0, animation: bpmActive ? 'pulseWidth 0.382s infinite' : 'none' }}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Speed Bottle */}
                            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-wider">
                                        <GlassWater size={14} /> Splash
                                    </label>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {splashes || '0'} <span className="text-sm text-gray-500 font-normal">/ ½ oz</span>
                                </div>
                            </div>

                            {/* Squeezer */}
                            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="flex items-center gap-2 text-green-400 font-bold uppercase text-xs tracking-wider">
                                        <Droplets size={14} /> Dash
                                    </label>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {dashes || '0'} <span className="text-sm text-gray-500 font-normal">/ 1/8 oz</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-center">
                        <button onClick={reset} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors font-bold px-4 py-2 hover:bg-gray-800 rounded-full">
                            <RefreshCw size={14} /> Reset all
                        </button>
                    </div>

                </div>
            </div>
            
            <style>{`
                @keyframes pulseWidth {
                    0% { width: 0%; opacity: 0.5; }
                    50% { width: 100%; opacity: 1; }
                    100% { width: 0%; opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default UnitConverter;
