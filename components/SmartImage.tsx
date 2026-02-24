import React, { useState, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string; // Optional fallback if everything fails (e.g. a placeholder URL)
  nameForSlug?: string; // The name to derive the slug from (e.g. "Gin Fizz")
}

const SmartImage: React.FC<SmartImageProps> = ({ src, alt, nameForSlug, fallbackSrc, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  // 0: local .jpg, 1: local .jpeg, 2: local .png, 3: DB URL, 4: Error
  const [loadAttempt, setLoadAttempt] = useState(0);

  const getSlug = (name: string) => {
      return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
  };

  useEffect(() => {
      // Reset state when src or name changes
      setLoadAttempt(0);
      
      if (nameForSlug) {
          const slug = getSlug(nameForSlug);
          setImgSrc(`/images/${slug}.jpg`);
      } else {
          // If no name provided for slug, just try the provided src
          setImgSrc(src);
          setLoadAttempt(3); // Skip local checks
      }
  }, [src, nameForSlug]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!nameForSlug) {
          // If we are not doing slug-based lookup, just fail
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
          // Try DB Image (if it exists and is not the same as what we just tried)
          // Note: If src IS one of the local paths, we skip to error to avoid loop
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
      
      // If props.onError exists, call it? Maybe not needed if we handle it internally.
  };

  return (
    <img 
      src={imgSrc || fallbackSrc || src} 
      alt={alt} 
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SmartImage;
