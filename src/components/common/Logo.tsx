import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-14 h-14 p-3'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div
      id="studenthub-logo"
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="relative">
        <div
          className={`${iconSizes[size]} bg-gradient-to-tr from-amber-600 to-orange-500 text-white rounded-xl shadow-md flex items-center justify-center transition-transform hover:scale-105`}
        >
          <UtensilsCrossed className="w-full h-full" strokeWidth={2.5} />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-stone-900 ${textSizes[size]} font-['Outfit']`}>
            Student <span className="text-amber-600">Hub</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            Smart Cafeteria
          </span>
        </div>
        {showTagline && (
          <span className="text-xs text-stone-500 font-medium tracking-normal mt-0.5">
            Pre-order your meal. Skip the queue. Pick it up on time.
          </span>
        )}
      </div>
    </div>
  );
};
