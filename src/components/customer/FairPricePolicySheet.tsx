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
              Fair Price &amp; Traveler Guarantee
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
            Every single ticket is cross-verified by our 4-Locks Price Gate before your card is charged.
          </p>
          <p className="text-[#E6E6E6]/80 font-chalk">
            If we ever publish a typo price, we notify you within 60 minutes, refund in full automatically, and give you priority access to the next window.
          </p>
          <div className="sketch-dashed p-3 rounded-2xl space-y-1 text-[11px] bg-[#1A1A1A]">
            <p className="font-bold text-[#88D49E]">✓ Checkout 8-Minute Hold Guarantee</p>
            <p className="text-[#E6E6E6]/70 font-chalk">
              If promotional seats expire while you are in checkout, your price is locked for the full 8-minute countdown. You never pay more without explicit consent.
            </p>
          </div>
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
