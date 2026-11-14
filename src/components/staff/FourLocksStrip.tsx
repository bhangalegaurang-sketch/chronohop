import React from 'react';
import { useStore } from '../../store/useStore';

export const FourLocksStrip: React.FC = () => {
  const { lock1CapEnabled, lock4BreakerEnabled, liveSale, pendingApproval } = useStore();

  const lock1Active = lock1CapEnabled;
  const lock3Active = lock1CapEnabled && liveSale.capHit;
  const lock4Active = lock4BreakerEnabled;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#181818] border-b border-[#E6E6E6]/15 font-sketch">
      {/* Lock 1: Percent Entry */}
      <div className="p-3.5 rounded-2xl border bg-[#222222] border-[#88D49E]/50 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-bold text-[#FFFFFF]">
            <span className="w-2 h-2 rounded-full bg-[#88D49E] shadow-[0_0_8px_#88D49E]" />
            Lock 1: Percent Entry
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/40">
            ENFORCED
          </span>
        </div>
        <p className="text-[11px] text-[#E6E6E6]/70 font-chalk mt-2 leading-relaxed">
          Staff enter a %, never a raw price. Eliminates accidental $2 typo entries.
        </p>
      </div>

      {/* Lock 2: Second Look */}
      <div className="p-3.5 rounded-2xl border bg-[#222222] border-[#88D49E]/50 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-bold text-[#FFFFFF]">
            <span className={`w-2 h-2 rounded-full ${pendingApproval ? 'bg-[#FF8C42] shadow-[0_0_8px_#FF8C42] animate-pulse' : 'bg-[#88D49E] shadow-[0_0_8px_#88D49E]'}`} />
            Lock 2: Second Look
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            pendingApproval 
              ? 'bg-[#FF8C42]/20 text-[#FF8C42] border-[#FF8C42]/50 animate-pulse' 
              : 'bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/40'
          }`}>
            {pendingApproval ? 'PENDING' : 'READY'}
          </span>
        </div>
        <p className="text-[11px] text-[#E6E6E6]/70 font-chalk mt-2 leading-relaxed">
          Over 30% off requires a second person who retypes the exact price; &gt;60% blocked.
        </p>
      </div>

      {/* Lock 3: Sale-Seat Cap */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs ${
        lock3Active 
          ? 'bg-[#2A1E14] border-[#FF8C42] ring-1 ring-[#FF8C42]/60' 
          : lock1Active
            ? 'bg-[#222222] border-[#88D49E]/50'
            : 'bg-[#251A1A] border-red-500/50'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-bold text-[#FFFFFF]">
            <span className={`w-2 h-2 rounded-full ${lock3Active ? 'bg-[#FF8C42] shadow-[0_0_8px_#FF8C42] animate-pulse' : lock1Active ? 'bg-[#88D49E] shadow-[0_0_8px_#88D49E]' : 'bg-red-400'}`} />
            Lock 3: Sale-Seat Cap
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            lock3Active 
              ? 'bg-[#FF8C42]/20 text-[#FF8C42] border-[#FF8C42]/50' 
              : lock1Active
                ? 'bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/40'
                : 'bg-red-500/15 text-red-300 border-red-500/40'
          }`}>
            {lock3Active ? 'REVERTED' : lock1Active ? 'ACTIVE' : 'BYPASS'}
          </span>
        </div>
        <p className="text-[11px] text-[#E6E6E6]/70 font-chalk mt-2 leading-relaxed">
          Caps promo at 33 seats (min of 10% window and $100k budget). Auto-reverts to list.
        </p>
      </div>

      {/* Lock 4: Speed Breaker */}
      <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-xs ${
        liveSale.isPaused
          ? 'hatch-orange bg-[#241A14] border-[#FF8C42] ring-2 ring-[#FF8C42]/60'
          : lock4Active
            ? 'bg-[#222222] border-[#88D49E]/50'
            : 'bg-[#251A1A] border-red-500/50'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-bold text-[#FFFFFF]">
            <span className={`w-2 h-2 rounded-full ${
              liveSale.isPaused 
                ? 'bg-[#FF8C42] shadow-[0_0_8px_#FF8C42] animate-ping' 
                : lock4Active 
                  ? 'bg-[#88D49E] shadow-[0_0_8px_#88D49E]' 
                  : 'bg-red-400'
            }`} />
            Lock 4: Speed Breaker
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            liveSale.isPaused
              ? 'bg-[#FF8C42] text-[#1A1A1A] border-[#FF8C42] font-black animate-pulse'
              : lock4Active
                ? 'bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/40'
                : 'bg-red-500/15 text-red-300 border-red-500/40'
          }`}>
            {liveSale.isPaused ? 'TRIPPED' : lock4Active ? 'ARMED' : 'BYPASS'}
          </span>
        </div>
        <p className="text-[11px] text-[#E6E6E6]/70 font-chalk mt-2 leading-relaxed">
          {liveSale.isPaused
            ? '⚠ Paused: velocity exceeded 5x forecast in 5 minutes.'
            : 'Bookings over 5× forecast in 5 minutes pause the listing automatically.'}
        </p>
      </div>
    </div>
  );
};
