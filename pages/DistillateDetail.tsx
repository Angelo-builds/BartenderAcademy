
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ArrowLeft, Share2 } from 'lucide-react';
import SmartImage from '../components/SmartImage';

const DistillateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useAppStore();
  
  const item = data.theory.find(t => t.id === id);

  if (!item) {
      return <Navigate to="/distillates" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black fixed inset-0 z-50 overflow-y-auto">
        <div className="flex flex-col lg:flex-row min-h-screen">
            
            {/* Left Side - Image (Sticky on Desktop) */}
            <div className="lg:w-1/2 relative h-[50vh] lg:h-screen lg:sticky lg:top-0">
                <SmartImage 
                    src={item.image} 
                    alt={item.title}
                    nameForSlug={item.slug || item.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                
                <Link to="/distillates" className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-all z-10">
                    <ArrowLeft size={24} />
                </Link>

                <div className="absolute bottom-12 left-8 lg:left-12 right-8">
                    <span className="inline-block px-3 py-1 bg-brand-orange text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        {item.category}
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tighter shadow-black drop-shadow-lg">
                        {item.title}
                    </h1>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="lg:w-1/2 p-8 lg:p-20 bg-white dark:bg-gray-900">
                <div className="max-w-2xl mx-auto animate-fadeIn">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
                         <div className="text-sm font-mono text-gray-400">
                             Knowledge Base ID: {item.id.toUpperCase()}
                         </div>
                         <button className="text-gray-400 hover:text-brand-orange transition-colors">
                             <Share2 size={20} />
                         </button>
                    </div>

                    <div className="prose prose-lg dark:prose-invert">
                        <MarkdownRenderer content={item.content} />
                    </div>

                    {/* Footer / Suggestion */}
                    <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Did you know?</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Mastering {item.title} is essential for creating balanced cocktails. 
                            Check out our recipe section to find drinks using this spirit.
                        </p>
                        <Link to="/cocktails" className="inline-block mt-4 text-brand-orange font-bold text-sm hover:underline">
                            Browse Cocktails →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DistillateDetail;
