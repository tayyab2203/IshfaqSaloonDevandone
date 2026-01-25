'use client';

import { useState } from 'react';

export default function EmployeeImage({ 
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
      <div className={fallbackClassName || `${className} bg-light-grey border border-medium-grey flex items-center justify-center`}>
        <span className="text-slate-blue text-xs font-semibold">
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
