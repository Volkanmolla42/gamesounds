'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageWithFallback({ src, alt, fallbackSrc = '/images/placeholder.jpg', ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative ${props.className || ''}`} style={{ width: props.width, height: props.height }}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setHasError(true);
          setIsLoading(false);
        }}
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
}
