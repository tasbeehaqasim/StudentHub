import React from 'react';
import { UtensilsCrossed, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-stone-200 bg-white/70 backdrop-blur-xs py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-2 font-medium">
          <UtensilsCrossed className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-stone-700">Student Hub</span>
          <span className="text-stone-300">•</span>
          <span>University Cafeteria Pre-Order & Management System</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Campus Node
          </span>
          <span>Built for Fast Queueless Pickup</span>
        </div>
      </div>
    </footer>
  );
};
