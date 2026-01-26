'use client';

import { useState } from 'react';

export default function ServiceImage({ 
  src, 
  alt, 
  className, 
  fallbackInitial,
  fallbackClassName,
  fallbackContent
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    if (fallbackContent) {
      return fallbackContent;
    }
    
    return (
      <div className={fallbackClassName || `${className} bg-gradient-to-br from-slate-blue via-[#7a8294] to-dark-charcoal flex items-center justify-center`}>
        <span className="text-white text-xs font-semibold">
          {fallbackInitial || '?'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}
