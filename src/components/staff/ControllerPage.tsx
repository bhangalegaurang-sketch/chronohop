import React from 'react';
import { StaffConsole } from './StaffConsole';
import { DemoControlsBar } from '../demo/DemoControlsBar';
import { useStore } from '../../store/useStore';
import { formatMoney } from '../../utils/formatters';

export const ControllerPage: React.FC = () => {
  const { liveSale, lock1CapEnabled, lock4BreakerEnabled, currentRole, switchRole } = useStore();

  const remaining = Math.max(0, liveSale.cap - liveSale.soldCount);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-4 pb-20 select-none">
      {/* Hand-Drawn Floating Annotation above Console */}
      <div className="flex flex-wrap items-center justify-between w-full px-4 text-xs font-sketch text-[#E6E6E6]/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-[#FF8C42] font-bold">
            ✎ MISSION CONTROL · PRICE GATE WORKSTATION
          </span>
          <span className="text-[#E6E6E6]/40 hidden sm:inline">|</span>
          <span className="text-[#88D49E] text-xs hidden sm:inline">
            Active User: <strong className="text-white">{currentRole === 'analyst' ? 'Asha (Pricing Analyst)' : 'Marcus (Finance Approver)'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole()}
            className="sketch-btn-orange text-[11px] px-3 py-1 rounded-full shadow-xs"
          >
            Switch to {currentRole === 'analyst' ? 'Marcus (Approver)' : 'Asha (Analyst)'}
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-2">
        <div className="sketch-card rounded-2xl p-3 bg-[#202020] text-center">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Active Sale Price</span>
          <span className="text-xl font-mono font-bold text-[#FF8C42]">
            {liveSale.isActive ? formatMoney(liveSale.price) : '$2,000 (Standard)'}
          </span>
        </div>

        <div className="sketch-card rounded-2xl p-3 bg-[#202020] text-center">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Seats Remaining</span>
          <span className="text-xl font-mono font-bold text-[#88D49E]">
            {remaining} / {liveSale.cap}
          </span>
        </div>

        <div className="sketch-card rounded-2xl p-3 bg-[#202020] text-center">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Lock 1 (Cap Bound)</span>
          <span className={`text-base font-sketch font-bold ${lock1CapEnabled ? 'text-[#88D49E]' : 'text-red-400'}`}>
            {lock1CapEnabled ? '✓ Enforced' : '⚠ Bypassed'}
          </span>
        </div>

        <div className="sketch-card rounded-2xl p-3 bg-[#202020] text-center">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Lock 4 (Speed Breaker)</span>
          <span className={`text-base font-sketch font-bold ${lock4BreakerEnabled ? 'text-[#88D49E]' : 'text-red-400'}`}>
            {lock4BreakerEnabled ? '✓ Armed (5× Rate)' : '⚠ Disarmed'}
          </span>
        </div>
      </div>

      {/* Main Staff Console Component */}
      <div className="w-full flex justify-center">
        <StaffConsole />
      </div>

      {/* Floating Demo Controls Bar at Bottom */}
      <DemoControlsBar />
    </div>
  );
};
