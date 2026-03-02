
import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../store';
import { Brain, Layers, Check, X, ChevronRight, ChevronLeft, HelpCircle, RotateCw, Trophy, ArrowLeft } from 'lucide-react';
import SmartImage from '../components/SmartImage';

const Academy: React.FC = () => {
    const { data, t } = useAppStore();
    const [mode, setMode] = useState<'menu' | 'flashcards' | 'quiz'>('menu');
    const [filterCategory, setFilterCategory] = useState<string>('All');
    
    // --- GAMIFICATION STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false); // For Flashcards
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    // Filter Items based on selection
    const studyItems = useMemo(() => {
        let items = data.cocktails.filter(c => c.status === 'published');
        if (filterCategory !== 'All') {
            items = items.filter(c => c.category === filterCategory || c.era === filterCategory);
        }
        // Shuffle items for randomness on mount/filter change
        return items.sort(() => Math.random() - 0.5);
    }, [data.cocktails, filterCategory]);

    // Quiz Options Generator
    const quizOptions = useMemo(() => {
        if (!studyItems.length || quizFinished) return [];
        const currentItem = studyItems[currentIndex];

        // Find distractors (wrong answers)
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
        setSelectedAnswer(null);
        setShowResult(false);
    };

    const handleQuizAnswer = (isCorrect: boolean, id: string) => {
        if (showResult) return; // Prevent multiple clicks
        setSelectedAnswer(id);
        setShowResult(true);
        
        if (isCorrect) setScore(s => s + 1);

        setTimeout(() => {
            if (currentIndex < studyItems.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                setQuizFinished(true);
            }
        }, 1500);
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(prev => Math.min(studyItems.length - 1, prev + 1));
        }, 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(prev => Math.max(0, prev - 1));
        }, 200);
    };

    // --- RENDERERS ---

    const renderMenu = () => (
        <div className="max-w-5xl mx-auto py-12 px-4 animate-fadeIn">
            <div className="text-center mb-16">
                <span className="text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4 block">{t.academy.gymArea}</span>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">{t.academy.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t.academy.subtitle}
                </p>
            </div>

            <div className="mb-12 flex justify-center">
                <div className="relative inline-block w-72">
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full appearance-none px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all cursor-pointer"
                    >
                        {categories.map(c => <option key={c} value={c}>{c === 'All' ? t.academy.filterAll : c}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Flashcards Card */}
                <button 
                    onClick={() => startSession('flashcards')}
                    className="group relative h-96 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-800 p-10 text-left transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Layers size={120} className="text-blue-500" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <Layers size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">{t.academy.flashcards.title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                {t.academy.flashcards.desc}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                            {t.academy.flashcards.start} <ChevronRight size={20} />
                        </div>
                    </div>
                </button>

                {/* Quiz Card */}
                <button 
                    onClick={() => startSession('quiz')}
                    className="group relative h-96 rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-800 p-10 text-left transition-all hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <HelpCircle size={120} className="text-brand-orange" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-brand-orange mb-6">
                                <HelpCircle size={32} />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">{t.academy.quiz.title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                {t.academy.quiz.desc}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-brand-orange font-bold">
                            {t.academy.quiz.start} <ChevronRight size={20} />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderFlashcard = () => {
        const item = studyItems[currentIndex];
        if (!item) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Nessun drink trovato con questi filtri.</div>;

        return (
            <div className="max-w-2xl mx-auto py-8 px-4 min-h-screen flex flex-col">
                 <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => setMode('menu')} 
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} /> Esci
                    </button>
                    <span className="font-mono text-sm font-bold text-gray-400">{currentIndex + 1} / {studyItems.length}</span>
                </div>

                <div className="flex-grow flex flex-col justify-center perspective-1000">
                    <div 
                        className="relative w-full aspect-[3/4] md:aspect-[4/3] cursor-pointer group"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ perspective: '1000px' }}
                    >
                        <div 
                            className="relative w-full h-full transition-all duration-700"
                            style={{ 
                                transformStyle: 'preserve-3d',
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                        >
                            
                            {/* FRONT CARD */}
                            <div 
                                className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-8 text-center"
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                            >
                                 <div className="w-32 h-32 mb-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-inner">
                                     {item.image ? (
                                         <SmartImage 
                                            src={item.image} 
                                            alt={item.name} 
                                            nameForSlug={item.slug || item.name}
                                            className="w-full h-full object-cover" 
                                         />
                                     ) : (
                                         <Brain size={48} className="text-gray-300 dark:text-gray-600" />
                                     )}
                                 </div>
                                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">{item.name}</h2>
                                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest">
                                     {item.category}
                                 </div>
                                 <div className="mt-auto pt-8 text-gray-400 dark:text-gray-500 flex items-center gap-2 text-sm font-medium animate-pulse">
                                     <RotateCw size={16} /> Clicca per girare
                                 </div>
                            </div>

                            {/* BACK CARD */}
                            <div 
                                className="absolute inset-0 w-full h-full bg-gray-900 dark:bg-white rounded-[3rem] shadow-2xl flex flex-col items-center p-8 text-center overflow-hidden"
                                style={{ 
                                    backfaceVisibility: 'hidden', 
                                    WebkitBackfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)' 
                                }}
                            >
                                 <h3 className="text-brand-orange dark:text-brand-orange text-sm font-bold uppercase tracking-widest mb-4 shrink-0">Ricetta</h3>
                                 
                                 <div className="w-full max-w-xs mx-auto flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6">
                                     <ul className="space-y-3">
                                         {item.ingredients.map((ing, i) => (
                                             <li key={i} className="flex justify-between items-baseline text-lg text-white dark:text-gray-900 border-b border-white/10 dark:border-gray-200 pb-2">
                                                 <span className="font-medium text-left">{ing.name}</span>
                                                 <span className="font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">{ing.amount}</span>
                                             </li>
                                         ))}
                                     </ul>

                                     <div className="bg-white/10 dark:bg-gray-100 rounded-2xl p-5 w-full">
                                         <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Metodo</div>
                                         <div className="text-white dark:text-gray-900 font-medium">{item.method}</div>
                                     </div>
                                 </div>

                                 <div className="pt-4 mt-2 text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm font-medium shrink-0 cursor-pointer hover:text-white dark:hover:text-black transition-colors">
                                     <RotateCw size={16} /> Clicca per tornare
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                     <button 
                        onClick={prevCard} 
                        disabled={currentIndex === 0} 
                        className="p-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg disabled:opacity-50 hover:scale-110 transition-transform"
                     >
                         <ChevronLeft size={24} />
                     </button>
                     <button 
                        onClick={nextCard} 
                        disabled={currentIndex === studyItems.length - 1} 
                        className="p-4 rounded-full bg-brand-orange text-white shadow-lg shadow-orange-500/30 disabled:opacity-50 hover:scale-110 transition-transform"
                     >
                         <ChevronRight size={24} />
                     </button>
                </div>
            </div>
        );
    };

    const renderQuiz = () => {
        if (quizFinished) {
            return (
                <div className="max-w-md mx-auto py-20 px-4 text-center min-h-screen flex flex-col justify-center">
                    <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Trophy size={48} className="text-yellow-900" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Quiz Completato!</h2>
                    <div className="text-8xl font-black text-brand-orange mb-4">
                        {score} <span className="text-4xl text-gray-400">/ {studyItems.length}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-12 text-lg">
                        {score === studyItems.length ? 'Perfetto! Sei un maestro.' : 'Ottimo lavoro, continua ad allenarti!'}
                    </p>
                    <button 
                        onClick={() => setMode('menu')} 
                        className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                    >
                        Torna al Menu
                    </button>
                </div>
            )
        }

        const item = studyItems[currentIndex];
        
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 min-h-screen flex flex-col">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                        <Trophy size={16} className="text-brand-orange" />
                        <span className="font-bold text-gray-900 dark:text-white">{score}</span>
                    </div>
                    <button onClick={() => setMode('menu')} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow flex flex-col justify-center">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                            Domanda {currentIndex + 1} di {studyItems.length}
                        </span>
                        <h2 className="text-gray-500 dark:text-gray-400 text-lg mb-4">Quali sono gli ingredienti per il</h2>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">{item.name}?</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {quizOptions.map((opt, idx) => {
                             let btnClass = "p-6 rounded-2xl text-left border-2 transition-all relative overflow-hidden group ";
                             
                             if (showResult) {
                                 if (opt.isCorrect) {
                                     btnClass += "bg-green-500 border-green-500 text-white shadow-lg scale-[1.02]";
                                 } else if (selectedAnswer === opt.id) {
                                     btnClass += "bg-red-500 border-red-500 text-white opacity-50";
                                 } else {
                                     btnClass += "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-600 opacity-50";
                                 }
                             } else {
                                 btnClass += "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-brand-orange dark:hover:border-brand-orange hover:shadow-lg hover:-translate-y-1";
                             }

                             return (
                                <button 
                                    key={idx}
                                    onClick={() => handleQuizAnswer(opt.isCorrect, opt.id)} 
                                    disabled={showResult}
                                    className={btnClass}
                                >
                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className="font-medium text-lg">{opt.text}</span>
                                        {showResult && opt.isCorrect && <Check size={24} />}
                                        {showResult && selectedAnswer === opt.id && !opt.isCorrect && <X size={24} />}
                                    </div>
                                </button>
                             );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
            {mode === 'menu' && renderMenu()}
            {mode === 'flashcards' && renderFlashcard()}
            {mode === 'quiz' && renderQuiz()}
        </div>
    );
};

export default Academy;
