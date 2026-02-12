
import React from 'react';

interface Props {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content, className = '' }) => {
  if (!content) return null;
  
  const lines = content.split('\n');

  return (
    <div className={`space-y-3 ${className}`}>
      {lines.map((line, i) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return <div key={i} className="h-2" />;

        const isBullet = trimmedLine.startsWith('-');
        // Remove the bullet dash if present
        let cleanLine = isBullet ? trimmedLine.replace(/^-/, '').trim() : trimmedLine;
        
        // PARSING LOGIC:
        // We split by a regex that captures both **bold** and *italic* segments.
        // The regex looks for: (\*\*.*?\*\*)|(\*.*?\*)
        const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        
        const renderedLine = (
          <React.Fragment>
            {parts.map((part, j) => {
               // Handle Bold: **Text**
               if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={j} className="font-extrabold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
               }
               // Handle Italic: *Text*
               else if (part.startsWith('*') && part.endsWith('*')) {
                   // Ensure it's not a leftover single asterisk
                   if (part.length > 2) {
                       return <em key={j} className="italic text-brand-orange dark:text-night-azure font-medium">{part.slice(1, -1)}</em>;
                   }
                   return <span key={j}>{part}</span>;
               }
               // Normal Text
               return <span key={j}>{part}</span>;
            })}
          </React.Fragment>
        );

        if (isBullet) {
             return (
                 <div key={i} className="flex gap-3 items-start ml-1">
                     <span className="text-brand-orange dark:text-night-azure mt-2 w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                     <span className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">{renderedLine}</span>
                 </div>
             )
        }

        return (
          <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
