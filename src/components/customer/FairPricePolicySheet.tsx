import React from 'react';
import { Icons } from '../icons/Icons';

interface FairPricePolicySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairPricePolicySheet: React.FC<FairPricePolicySheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-xs flex items-end justify-center p-3 transition-opacity duration-200">
      <div 
        className="w-full bg-[#222222] border-2 border-[#E6E6E6]/60 rounded-[28px] p-5 shadow-[4px_6px_0px_rgba(230,230,230,0.15)] space-y-4 font-sketch text-[#E6E6E6] animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-title"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/20">
          <div className="flex items-center gap-2">
            <div className="text-[#88D49E]">
              <Icons.Shield size={20} />
            </div>
            <h3 id="policy-title" className="font-marker font-bold text-xl text-[#FFFFFF]">
              Fair Price Policy
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[#E6E6E6]/40 text-[#E6E6E6] flex items-center justify-center hover:bg-[#E6E6E6]/10"
            aria-label="Close fair price policy"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <p className="font-bold text-[#FFFFFF]">
            We check every price before it goes on sale, and again before your card is charged.
          </p>
          <p className="text-[#E6E6E6]/80 font-chalk">
            If we ever list a wrong price, everyone affected gets the same: a same-day refund of what you paid, a $100 credit on any trip of $1,000 or more, and first access to our next sale.
          </p>
        </div>

        <button
          onClick={onClose}
          className="sketch-btn-orange w-full py-2.5 rounded-full text-xs"
        >
          I UNDERSTAND
        </button>
      </div>
    </div>
  );
};
