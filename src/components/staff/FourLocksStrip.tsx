import React from 'react';
import { useStore } from '../../store/useStore';

export const FourLocksStrip: React.FC = () => {
  const { lock1CapEnabled, lock4BreakerEnabled, liveSale, pendingApproval } = useStore();

  const lock1Active = lock1CapEnabled;
  const lock3Active = lock1CapEnabled && liveSale.capHit;
  const lock4Active = lock4BreakerEnabled;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-[#07110E] border-b border-[#1A3026]">
      {/* Lock 1: Promotional Seat Cap */}
      <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 shadow-sm ${
        lock1Active 
          ? 'bg-gradient-to-b from-[#0E221A] to-[#0A1612] border-[#224434]' 
          : 'bg-gradient-to-b from-[#1C0F0E] to-[#120A09] border-[#4A201A]'
      }`}>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-staff-text">
            <span className={`w-2.5 h-2.5 rounded-full ${lock1Active ? 'bg-staff-ok shadow-[0_0_8px_#6FD3A0]' : 'bg-staff-danger'}`} />
            Lock 1: Seat Cap
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            lock1Active 
              ? 'bg-staff-ok/15 text-staff-ok border-staff-ok/30' 
              : 'bg-staff-danger/15 text-staff-dangerLight border-staff-danger/40'
          }`}>
            {lock1Active ? 'ACTIVE' : 'BYPASS'}
          </span>
        </div>
        <p className="text-[11px] text-staff-muted mt-2 leading-snug">
          Caps promo capacity at 33 seats (10% of window or $100k budget).
        </p>
      </div>

      {/* Lock 2: Dual Approval & Retype */}
      <div className="p-3 rounded-xl border bg-gradient-to-b from-[#0E221A] to-[#0A1612] border-[#224434] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-staff-text">
            <span className={`w-2.5 h-2.5 rounded-full ${pendingApproval ? 'bg-staff-brass shadow-[0_0_8px_#E3A93B] animate-pulse' : 'bg-staff-ok shadow-[0_0_8px_#6FD3A0]'}`} />
            Lock 2: Dual Approval
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            pendingApproval 
              ? 'bg-staff-brass/20 text-staff-brass border-staff-brass/40 animate-pulse' 
              : 'bg-staff-ok/15 text-staff-ok border-staff-ok/30'
          }`}>
            {pendingApproval ? 'PENDING' : 'READY'}
          </span>
        </div>
        <p className="text-[11px] text-staff-muted mt-2 leading-snug">
          Discounts over 30% require a second person to retype the exact price.
        </p>
      </div>

      {/* Lock 3: Automatic Price Reversion */}
      <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 shadow-sm ${
        lock3Active 
          ? 'bg-gradient-to-b from-[#2E180A] to-[#1A0D05] border-staff-brass ring-1 ring-staff-brass/60' 
          : 'bg-gradient-to-b from-[#0E221A] to-[#0A1612] border-[#224434]'
      }`}>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-staff-text">
            <span className={`w-2.5 h-2.5 rounded-full ${lock3Active ? 'bg-staff-brass shadow-[0_0_8px_#E3A93B] animate-ping' : 'bg-staff-ok shadow-[0_0_8px_#6FD3A0]'}`} />
            Lock 3: Auto-Revert
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            lock3Active 
              ? 'bg-staff-brass text-black border-staff-brass font-black' 
              : 'bg-staff-ok/15 text-staff-ok border-staff-ok/30'
          }`}>
            {lock3Active ? 'TRIGGERED' : 'ARMED'}
          </span>
        </div>
        <p className="text-[11px] text-staff-muted mt-2 leading-snug">
          Returns price to $2,000 list price immediately once 33 seats sell.
        </p>
      </div>

      {/* Lock 4: Speed Breaker Circuit */}
      <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 shadow-sm ${
        liveSale.isPaused
          ? 'bg-gradient-to-b from-[#330F0C] to-[#1A0706] border-staff-danger ring-1 ring-staff-danger'
          : lock4Active
          ? 'bg-gradient-to-b from-[#0E221A] to-[#0A1612] border-[#224434]'
          : 'bg-gradient-to-b from-[#1C0F0E] to-[#120A09] border-[#4A201A]'
      }`}>
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-staff-text">
            <span className={`w-2.5 h-2.5 rounded-full ${liveSale.isPaused ? 'bg-staff-danger shadow-[0_0_8px_#C4302B] animate-ping' : 'bg-staff-ok shadow-[0_0_8px_#6FD3A0]'}`} />
            Lock 4: Speed Breaker
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            liveSale.isPaused
              ? 'bg-staff-danger text-white border-staff-danger font-black animate-pulse'
              : lock4Active
              ? 'bg-staff-ok/15 text-staff-ok border-staff-ok/30'
              : 'bg-staff-danger/15 text-staff-dangerLight border-staff-danger/40'
          }`}>
            {liveSale.isPaused ? 'PAUSED' : lock4Active ? 'ARMED' : 'OFF'}
          </span>
        </div>
        <p className="text-[11px] text-staff-muted mt-2 leading-snug">
          Auto-pauses sales if velocity exceeds 5× forecast (30 bookings in 5 min).
        </p>
      </div>
    </div>
  );
};
