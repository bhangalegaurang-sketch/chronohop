import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#E6E6E6]/20 px-6 py-4 text-xs font-sketch text-[#E6E6E6]/70 select-none">
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-bold text-[#FFFFFF]">
            ChronoHop
          </p>
          <span className="font-mono text-xs text-[#FF8C42]">
            PRD Rules: 336 seats · $100k Budget · 33 Max Sale Seats
          </span>
        </div>

        <div className="text-[11px] text-[#E6E6E6]/60 leading-relaxed pt-2 border-t border-[#E6E6E6]/10 space-y-0.5 font-chalk">
          <p>
            Image Credits: Triceratops model by Martinvl and Sunset at the Pyramids by Spottedviper, CC BY-SA 4.0, via Wikimedia Commons. Victorian London is AI-generated.
          </p>
        </div>
      </div>
    </footer>
  );
};
