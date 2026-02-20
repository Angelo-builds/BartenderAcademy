
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, WifiOff } from 'lucide-react';
import { useAppStore } from '../store';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, t, language } = useAppStore();
    
    // Initialize messages state
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    
    // Update welcome message when language changes or on first mount
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: 'model', text: t.chatbot.welcome }]);
        }
    }, [t.chatbot.welcome]);

    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // CONFIGURAZIONE OLLAMA (Dinamica)
    const OLLAMA_URL = data.siteConfig.ollamaUrl || 'http://localhost:11434/api/chat';
    const OLLAMA_MODEL = 'llama3'; // Cambia con 'mistral', 'gemma:2b', etc.

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsThinking(true);

        try {
            // 1. Costruiamo il contesto dai dati locali del sito
            const cocktailNames = data.cocktails.map(c => c.name).join(', ');
            
            const systemPrompt = `Sei un esperto mixologist e bartender insegnante (Bartender AI). 
            Il database della scuola contiene questi drink: ${cocktailNames}.
            Rispondi in modo professionale, amichevole e conciso. 
            IMPORTANTE: Rispondi nella lingua dell'utente (Italiano o Inglese) in base alla domanda.
            Se chiedono un drink specifico, descrivilo. Se chiedono abbinamenti, sii creativo.`;

            // 2. Chiamata Fetch a Ollama Locale
            const response = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages.map(m => ({ 
                            role: m.role === 'model' ? 'assistant' : 'user', 
                            content: m.text 
                        })),
                        { role: 'user', content: userMsg }
                    ],
                    stream: false // Per semplicità, disabilitiamo lo streaming per ora
                })
            });

            if (!response.ok) {
                throw new Error("Ollama non risponde. Assicurati che l'URL nelle impostazioni Admin sia corretto e raggiungibile.");
            }

            const dataResponse = await response.json();
            const text = dataResponse.message?.content || "Scusa, il modello non ha restituito testo.";
            
            setMessages(prev => [...prev, { role: 'model', text }]);

        } catch (error) {
            console.error("Errore Ollama:", error);
            setMessages(prev => [...prev, { role: 'model', text: `Errore: Impossibile contattare Ollama su ${OLLAMA_URL}. Controlla la configurazione in Admin.` }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[60] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-gray-900 text-white dark:bg-white dark:text-black rotate-90' : 'bg-green-600 text-white'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 left-4 md:left-auto md:right-6 md:w-96 h-[500px] max-h-[calc(100vh-140px)] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[60] flex flex-col animate-scale-in overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-green-600 text-white flex items-center gap-3 shrink-0">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold">Bartender AI</h3>
                            <p className="text-xs text-white/80">Virtual Assistant</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-green-600 text-white'}`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tr-none' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none shadow-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex gap-3">
                                 <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0"><Bot size={14} /></div>
                                 <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 shadow-sm">
                                     <div className="flex gap-1">
                                         <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                                         <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></span>
                                         <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></span>
                                     </div>
                                 </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t.chatbot.placeholder}
                                className="flex-1 bg-gray-100 dark:bg-black rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 dark:text-white"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className="p-2 bg-green-600 text-white rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
