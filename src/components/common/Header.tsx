import React from 'react';

interface HeaderProps {
  currentPage?: 'customer' | 'controller';
  onNavigate?: (page: 'customer' | 'controller') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage = 'customer', onNavigate }) => {
  return (
    <header className="bg-[#1A1A1A] border-b border-[#E6E6E6]/20 px-4 sm:px-6 py-2.5 select-none font-sketch text-[#E6E6E6]">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#FF8C42] leading-none select-none">✳</span>
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
          {/* Page Switcher Navigation */}
          {onNavigate && (
            <div className="flex items-center gap-1.5 bg-[#252525] p-1 rounded-2xl border border-white/15 shadow-inner">
              <button
                onClick={() => onNavigate('customer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sketch flex items-center gap-1.5 transition-all ${
                  currentPage === 'customer'
                    ? 'bg-[#E6E6E6] text-[#1A1A1A] font-bold shadow-[2px_2px_0px_#FF8C42]'
                    : 'text-[#E6E6E6]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>📱</span>
                <span>Traveler App</span>
              </button>
              <button
                onClick={() => onNavigate('controller')}
                className={`px-3 py-1.5 rounded-xl text-xs font-sketch flex items-center gap-1.5 transition-all ${
                  currentPage === 'controller'
                    ? 'bg-[#FF8C42] text-[#1A1A1A] font-bold shadow-[2px_2px_0px_rgba(255,255,255,0.4)]'
                    : 'text-[#E6E6E6]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>⚙️</span>
                <span>Price Gate Controller</span>
              </button>
            </div>
          )}

          <span className="hidden md:flex px-3 py-1 rounded-full bg-[#222222] border border-[#88D49E]/50 text-[#88D49E] items-center gap-1.5 shadow-xs">
            ✓ 4-Locks Price Gate Active
          </span>
        </div>
      </div>
    </header>
  );
};
