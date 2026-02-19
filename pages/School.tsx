
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Brain, Layers, Check, X, ChevronRight, HelpCircle } from 'lucide-react';

const School: React.FC = () => {
    const { data } = useAppStore();
    const [mode, setMode] = useState<'menu' | 'flashcards' | 'quiz'>('menu');
    const [filterCategory, setFilterCategory] = useState<string>('All');
    
    // --- GAMIFICATION STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false); // For Flashcards
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    // Filter Items based on selection
    const studyItems = useMemo(() => {
        let items = data.cocktails.filter(c => c.status === 'published');
        if (filterCategory !== 'All') {
            items = items.filter(c => c.category === filterCategory || c.era === filterCategory);
        }
        // Shuffle items for randomness
        return items.sort(() => Math.random() - 0.5);
    }, [data.cocktails, filterCategory]);

    // Quiz Options Generator
    const quizOptions = useMemo(() => {
        if (!studyItems.length || quizFinished) return [];
        const currentItem = studyItems[currentIndex];

        // Find distractors (wrong answers)
        // Try to find cocktails from same category for difficulty, else random
        let distractors = data.cocktails.filter(c => c.id !== currentItem.id);
        
        // Shuffle and pick 2
        distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 2);

        // Create options array
        const options = [
            { id: 'correct', text: currentItem.ingredients.map(i => i.name).join(', '), isCorrect: true },
            ...distractors.map(d => ({ id: d.id, text: d.ingredients.map(i => i.name).join(', '), isCorrect: false }))
        ];

        // Shuffle options
        return options.sort(() => 0.5 - Math.random());
    }, [currentIndex, studyItems, quizFinished, data.cocktails]);


    // Categories for filter
    const categories = ['All', ...Array.from(new Set(data.cocktails.map(c => c.category)))].sort();

    const startSession = (selectedMode: 'flashcards' | 'quiz') => {
        setMode(selectedMode);
        setCurrentIndex(0);
        setIsFlipped(false);
        setScore(0);
        setQuizFinished(false);
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore(s => s + 1);
        if (currentIndex < studyItems.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    // --- RENDERERS ---

    const renderMenu = () => (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-fadeIn">
            <div className="text-center mb-16">
                <span className="text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Gym Area</span>
                <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6">Bartender Academy</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Scegli la tua modalità di allenamento e affina le tue conoscenze.</p>
            </div>

            <div className="mb-12 flex justify-center">
                <div className="relative inline-block w-64">
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full appearance-none px-6 py-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-brand-orange"
                    >
                        {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'Tutto il Database' : c}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button 
                    onClick={() => startSession('flashcards')}
                    className="group relative h-80 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 text-left transition-transform hover:scale-[1.02] shadow-2xl shadow-blue-500/30"
                >
                    <Layers size={48} className="mb-6 opacity-80" />
                    <h2 className="text-4xl font-black mb-4">Flashcards</h2>
                    <p className="text-blue-100 text-lg opacity-90">Memorizza ricette, ingredienti e bicchieri girando le carte.</p>
                    <div className="absolute bottom-10 right-10 p-3 bg-white/20 backdrop-blur-md rounded-full group-hover:bg-white group-hover:text-blue-600 transition-colors">
                        <ChevronRight size={24} />
                    </div>
                </button>

                <button 
                    onClick={() => startSession('quiz')}
                    className="group relative h-80 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand-orange to-red-600 text-white p-10 text-left transition-transform hover:scale-[1.02] shadow-2xl shadow-orange-500/30"
                >
                    <HelpCircle size={48} className="mb-6 opacity-80" />
                    <h2 className="text-4xl font-black mb-4">Speed Quiz</h2>
                    <p className="text-orange-100 text-lg opacity-90">Mettiti alla prova. Indovina gli ingredienti corretti per ogni drink.</p>
                    <div className="absolute bottom-10 right-10 p-3 bg-white/20 backdrop-blur-md rounded-full group-hover:bg-white group-hover:text-brand-orange transition-colors">
                        <ChevronRight size={24} />
                    </div>
                </button>
            </div>
        </div>
    );

    const renderFlashcard = () => {
        const item = studyItems[currentIndex];
        if (!item) return <div className="text-center py-20 text-gray-500">Nessun drink trovato con questi filtri.</div>;

        return (
            <div className="max-w-md mx-auto py-12 px-4 h-[80vh] flex flex-col justify-center">
                 <div className="flex justify-between items-center mb-8">
                    <button onClick={() => setMode('menu')} className="text-gray-400 hover:text-white transition-colors">Esci</button>
                    <span className="font-mono text-sm text-gray-500">{currentIndex + 1} / {studyItems.length}</span>
                </div>

                <div 
                    className="flex-grow relative perspective-1000 cursor-pointer group"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        
                        {/* FRONT */}
                        <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 border border-gray-100 dark:border-gray-800">
                             <div className="w-32 h-32 mb-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                 <Brain size={48} />
                             </div>
                             <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-4">{item.name}</h2>
                             <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">{item.category}</p>
                             <p className="mt-8 text-sm text-gray-400 animate-pulse">Clicca per girare</p>
                        </div>

                        {/* BACK */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8">
                             <h3 className="text-2xl font-bold mb-6 underline decoration-brand-orange">Ricetta</h3>
                             <ul className="space-y-4 text-center">
                                 {item.ingredients.map((ing, i) => (
                                     <li key={i} className="text-lg">
                                         <span className="font-bold">{ing.amount}</span> {ing.name}
                                     </li>
                                 ))}
                             </ul>
                             <div className="mt-8 pt-4 border-t border-white/20 dark:border-black/10">
                                 <p className="text-sm opacity-70 italic">{item.glass} • {item.method}</p>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                     <button onClick={() => { setIsFlipped(false); setCurrentIndex(prev => Math.max(0, prev - 1)); }} disabled={currentIndex === 0} className="p-4 rounded-full bg-gray-200 dark:bg-gray-800 disabled:opacity-50"><ChevronRight className="rotate-180" /></button>
                     <button onClick={() => { setIsFlipped(false); setCurrentIndex(prev => Math.min(studyItems.length - 1, prev + 1)); }} disabled={currentIndex === studyItems.length - 1} className="p-4 rounded-full bg-brand-orange text-white disabled:opacity-50"><ChevronRight /></button>
                </div>
            </div>
        );
    };

    const renderQuiz = () => {
        if (quizFinished) {
            return (
                <div className="max-w-md mx-auto py-20 px-4 text-center">
                    <h2 className="text-4xl font-black text-white mb-6">Quiz Completato!</h2>
                    <div className="text-8xl font-black text-brand-orange mb-4">{score} <span className="text-4xl text-gray-500">/ {studyItems.length}</span></div>
                    <p className="text-gray-400 mb-12">Ottimo lavoro!</p>
                    <button onClick={() => setMode('menu')} className="px-8 py-4 bg-white text-black rounded-full font-bold">Torna al Menu</button>
                </div>
            )
        }

        const item = studyItems[currentIndex];
        
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 min-h-screen flex flex-col">
                <div className="flex justify-between items-center mb-12">
                    <span className="font-mono text-brand-orange">Punteggio: {score}</span>
                    <button onClick={() => setMode('menu')}><X /></button>
                </div>

                <div className="flex-grow flex flex-col justify-center">
                    <h2 className="text-center text-gray-400 text-sm uppercase tracking-widest mb-4">Quali sono gli ingredienti corretti?</h2>
                    <h1 className="text-center text-5xl font-black text-white mb-12">{item.name}</h1>

                    <div className="grid grid-cols-1 gap-4">
                        {quizOptions.map((opt, idx) => (
                             <button 
                                key={idx}
                                onClick={() => handleQuizAnswer(opt.isCorrect)} 
                                className="p-6 bg-gray-800 hover:bg-gray-700 rounded-2xl text-left border border-gray-700 hover:border-brand-orange transition-all"
                             >
                                 {opt.text}
                             </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {mode === 'menu' && renderMenu()}
            {mode === 'flashcards' && renderFlashcard()}
            {mode === 'quiz' && renderQuiz()}
        </div>
    );
};

export default School;
