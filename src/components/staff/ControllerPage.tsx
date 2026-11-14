import React from 'react';
import { StaffConsole } from './StaffConsole';
import { DemoControlsBar } from '../demo/DemoControlsBar';
import { useStore, isSaleOpen, ROLE_LABELS } from '../../store/useStore';
import { formatMoney } from '../../utils/formatters';

export const ControllerPage: React.FC = () => {
  const { liveSale, lock1CapEnabled, lock4BreakerEnabled, currentRole, switchRole } = useStore();

  const remaining = Math.max(0, liveSale.cap - liveSale.soldCount);
  const saleOpen = isSaleOpen({ liveSale, lock1CapEnabled });
  const saleOver = liveSale.isActive && !saleOpen;
  const totalBookings = liveSale.soldCount + liveSale.fullPriceCount;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center space-y-5 pb-24 select-none font-sketch text-[#E6E6E6]">
      {/* Hand-Drawn Floating Annotation above Console */}
      <div className="flex flex-wrap items-center justify-between w-full px-4 text-xs text-[#E6E6E6]/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-[#FF8C42] font-bold">
            ✎ PRICING CONTROL ROOM · FOUR-LOCK PRICE GATE
          </span>
          <span className="text-[#E6E6E6]/40 hidden sm:inline">|</span>
          <span className="text-[#88D49E] text-xs hidden sm:inline">
            Active Operator: <strong className="text-white">{ROLE_LABELS[currentRole]}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchRole()}
            className="sketch-btn-orange text-xs px-3.5 py-1 rounded-full shadow-xs"
          >
            Switch to {ROLE_LABELS[currentRole === 'analyst' ? 'approver' : 'analyst']}
          </button>
        </div>
      </div>

      {/* Quick Status Cards (Digital Sketchbook Style) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 px-2">
        <div className="sketch-card rounded-[22px] p-4 bg-[#202020] text-center relative overflow-hidden">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Active Sale Price</span>
          <span className="text-2xl font-mono font-bold text-[#FF8C42] mt-0.5 block">
            {saleOpen ? formatMoney(liveSale.price) : '$2,000'}
          </span>
          <span className={`text-[10px] font-chalk block mt-0.5 ${saleOver ? 'text-red-300' : 'text-[#88D49E]'}`}>
            {saleOpen
              ? (liveSale.isPaused ? `${liveSale.discountPct}% Sale · Paused` : `${liveSale.discountPct}% Discount Live`)
              : saleOver ? 'Sale over' : 'Standard Catalog'}
          </span>
        </div>

        <div className="sketch-card rounded-[22px] p-4 bg-[#202020] text-center relative overflow-hidden">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Sale Seats Left</span>
          <span className="text-2xl font-mono font-bold text-[#88D49E] mt-0.5 block">
            {remaining} / {liveSale.cap}
          </span>
          <span className="text-[10px] text-[#E6E6E6]/60 font-chalk block mt-0.5">
            {totalBookings} sold · {liveSale.soldCount} sale, {liveSale.fullPriceCount} at $2,000
          </span>
        </div>

        <div className="sketch-card rounded-[22px] p-4 bg-[#202020] text-center relative overflow-hidden">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Lock 3 (Sale-Seat Cap)</span>
          <span className={`text-xl font-sketch font-bold mt-0.5 block ${lock1CapEnabled ? 'text-[#88D49E]' : 'text-red-400'}`}>
            {lock1CapEnabled ? '✓ Enforced' : '⚠ Bypassed'}
          </span>
          <span className="text-[10px] text-[#E6E6E6]/60 font-chalk block mt-0.5">
            Max {liveSale.cap} sale seats
          </span>
        </div>

        <div className="sketch-card rounded-[22px] p-4 bg-[#202020] text-center relative overflow-hidden">
          <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Lock 4 (Speed Breaker)</span>
          <span className={`text-xl font-sketch font-bold mt-0.5 block ${lock4BreakerEnabled ? 'text-[#88D49E]' : 'text-red-400'}`}>
            {lock4BreakerEnabled ? '✓ Armed' : '⚠ Disarmed'}
          </span>
          <span className="text-[10px] text-[#E6E6E6]/60 font-chalk block mt-0.5">
            5× Rate Limit Threshold
          </span>
        </div>
      </div>

      {/* Main Staff Console Workstation */}
      <div className="w-full flex justify-center">
        <StaffConsole />
      </div>

      {/* Floating Demo Controls Bar at Bottom */}
      <DemoControlsBar />
    </div>
  );
};
