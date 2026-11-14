import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#1A1A1A] border-b border-[#E6E6E6]/20 px-6 py-2.5 select-none font-sketch text-[#E6E6E6]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#FF8C42] leading-none">✳</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-marker font-bold text-xl text-[#FFFFFF] tracking-tight">
                ChronoHop
              </span>
              <span className="text-xs font-sketch px-2.5 py-0.5 rounded-full bg-[#2A2A2A] border border-[#FF8C42]/50 text-[#FF8C42]">
                DIGITAL SKETCHBOOK
              </span>
            </div>
            <p className="text-xs text-[#E6E6E6]/70 font-chalk">
              Style guide reproduction · Hand-drawn chalkboard aesthetic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-[#222222] border border-[#88D49E]/50 text-[#88D49E] flex items-center gap-1.5 shadow-xs">
            ✓ 4-Locks Price Gate Active
          </span>
        </div>
      </div>
    </header>
  );
};
