import React from 'react';
import { COLORS } from '../data/constants';

const getPlaceholderColor = (text) => {
  const charCode = (text || '?').charCodeAt(0);
  return COLORS[charCode % COLORS.length];
};

export const Avatar = ({ src, name, size = "9", className = "", online = false, onClick }) => {
  const sizeClasses = { "8": "w-8 h-8", "9": "w-9 h-9", "20": "w-20 h-20" };
  const textSizeClasses = { "8": "text-[10px]", "9": "text-[12px]", "20": "text-[24px]" };

  if (src) {
    return (
      <div className="relative">
        <img src={src} className={`${sizeClasses[size] || 'w-9 h-9'} rounded-full object-cover ${className} ${onClick ? 'cursor-pointer' : ''}`} alt={name} onClick={onClick} />
        {online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
      </div>
    );
  }

  const color = getPlaceholderColor(name);
  const initials = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative">
      <div className={`${sizeClasses[size] || 'w-9 h-9'} ${color} rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm ${className} ${textSizeClasses[size]} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        {initials}
      </div>
      {online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
    </div>
  );
};