import React, { useState, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string; // Optional fallback if everything fails (e.g. a placeholder URL)
  nameForSlug?: string; // The name to derive the slug from (e.g. "Gin Fizz")
}

const getSlug = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const SmartImage: React.FC<SmartImageProps> = ({ src, alt, nameForSlug, fallbackSrc, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
      if (nameForSlug) {
          const slug = getSlug(nameForSlug);
          return `/images/${slug}.jpg`;
      }
      return src || '';
  });
  
  // 0: local .jpg, 1: local .jpeg, 2: local .png, 3: DB URL, 4: Error
  const [loadAttempt, setLoadAttempt] = useState(() => {
      return nameForSlug ? 0 : 3;
  });

  useEffect(() => {
      // Reset state when src or name changes
      if (nameForSlug) {
          const slug = getSlug(nameForSlug);
          setImgSrc(`/images/${slug}.jpg`);
          setLoadAttempt(0);
      } else {
          setImgSrc(src || '');
          setLoadAttempt(3);
      }
  }, [src, nameForSlug]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!nameForSlug) {
          if (fallbackSrc && imgSrc !== fallbackSrc) {
              setImgSrc(fallbackSrc);
          }
          return;
      }

      const slug = getSlug(nameForSlug);
      
      if (loadAttempt === 0) {
          // Try .jpeg
          setLoadAttempt(1);
          setImgSrc(`/images/${slug}.jpeg`);
      } else if (loadAttempt === 1) {
          // Try .png
          setLoadAttempt(2);
          setImgSrc(`/images/${slug}.png`);
      } else if (loadAttempt === 2) {
          // Try DB Image
          if (src && !src.includes(`/images/${slug}`)) {
              setLoadAttempt(3);
              setImgSrc(src);
          } else {
              setLoadAttempt(4);
              if (fallbackSrc) setImgSrc(fallbackSrc);
          }
      } else if (loadAttempt === 3) {
           // DB image failed
           setLoadAttempt(4);
           if (fallbackSrc) setImgSrc(fallbackSrc);
      }
  };

  const finalSrc = imgSrc || fallbackSrc || src;

  if (!finalSrc) return null;

  return (
    <img 
      src={finalSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SmartImage;
