import React from 'react';
import { useStore } from '../../store/useStore';
import { PRICING_RULES } from '../../config/pricingRules';
import {
  calculatePrice,
  calculateRuleCap,
  getEffectiveCap,
  getApprovalBand,
  calculateWorstCaseLoss
} from '../../utils/rules';
import { formatMoney, numberToWords } from '../../utils/formatters';
import { Shield, AlertTriangle, Lock, Check, Send } from 'lucide-react';

export const PriceGateTab: React.FC = () => {
  const {
    discountPct,
    setDiscountPct,
    sharePct,
    setSharePct,
    budget,
    setBudget,
    customCap,
    setCustomCap,
    scheduledTime,
    setScheduledTime,
    overrideReason,
    setOverrideReason,
    financeLeadApproved,
    toggleFinanceLeadApproved,
    founderApproved,
    toggleFounderApproved,
    scheduleSale,
    sendToApprover,
    forceLiveDemo
  } = useStore();

  const price = calculatePrice(discountPct);
  const ruleCap = calculateRuleCap(sharePct, budget);
  const effectiveCap = getEffectiveCap(sharePct, budget, customCap);
  const band = getApprovalBand(discountPct);
  const worstCase = calculateWorstCaseLoss(effectiveCap, price);
  const words = numberToWords(price);

  const isBlocked = band === 'blocked';
  const isBand2 = band === 'band_2';
  const isBand1 = band === 'band_1';

  const canOverride = overrideReason.trim().length > 5 && financeLeadApproved && founderApproved;

  return (
    <div className="space-y-4 p-4 text-[#E6E6E6] font-sketch select-none">
      {/* Red STOP Banner when Discount Exceeds 60% */}
      {isBlocked && (
        <div 
          className="hatch-pattern bg-[#2A1414] text-white rounded-2xl p-4 shadow-md border-2 border-[#E5484D] flex items-start gap-4 animate-pulse"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h2 className="font-mono font-black text-lg tracking-wider uppercase text-red-400">
              STOP. THIS PRICE IS BLOCKED.
            </h2>
            <p className="text-xs font-chalk leading-relaxed text-white/95">
              {discountPct}% discount ({formatMoney(price)}) is {formatMoney(1500 - price)} lower than this trip has ever sold for. Did you type a price instead of a percent?
            </p>
            <p className="text-[11px] text-[#E6E6E6]/80 font-chalk">
              Discounts over 60% require written justification, Finance Lead sign-off, and Founder authorization.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: Price Definition & Approval Governance */}
      <div className="sketch-card rounded-[24px] p-5 space-y-4 bg-[#202020]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]/20">
          <div>
            <h2 className="font-marker font-bold text-xl text-[#FFFFFF] tracking-tight flex items-center gap-2">
              <span className="text-[#FF8C42]">✳</span>
              1. Price Definition · Dinosaur Walk (Flagship Expedition)
            </h2>
            <p className="text-xs text-[#E6E6E6]/70 font-chalk mt-0.5">
              Promotional discounts are entered as a percentage only (0% to 100%, 1 decimal place).
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Standard Catalog List</span>
            <span className="font-mono font-bold text-base text-[#FFFFFF]">$2,000.00</span>
          </div>
        </div>

        {/* Input & Live Readout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Discount Percentage Input */}
          <div className="md:col-span-5 bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="discount-pct" className="font-bold text-[#E6E6E6]/80 uppercase tracking-wider text-[11px]">
                ✎ Discount Percentage
              </label>
              <span className="text-[#FF8C42] text-[11px] font-mono font-bold">0.0% – 100.0%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="discount-pct"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={discountPct}
                onChange={(e) => setDiscountPct(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141414] border border-[#E6E6E6]/40 text-[#FFFFFF] font-mono font-black text-2xl px-3.5 py-2 rounded-xl text-right focus:outline-none focus:border-[#FF8C42] min-h-[46px]"
              />
              <span className="font-mono font-bold text-xl text-[#FF8C42]">%</span>
            </div>
          </div>

          {/* Sized-up Calculated Price Display in Muted Orange (#FF8C42) */}
          <div className="md:col-span-7 sketch-dashed rounded-2xl p-4 text-center space-y-1 bg-[#1A1A1A]">
            <span className="text-[10px] font-mono tracking-widest text-[#E6E6E6]/60 uppercase block">
              Calculated Checkout Price (LIST × [1 - DISCOUNT%])
            </span>
            <div className="font-mono font-black text-4xl sm:text-5xl text-[#FF8C42] tracking-tight py-1">
              {formatMoney(price)}
            </div>
            <div className="text-xs font-chalk text-[#E6E6E6]/90 italic">
              "{words}"
            </div>
          </div>
        </div>

        {/* Approval Tier Band Bar */}
        <div className="space-y-2 bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-[#E6E6E6]/80 uppercase tracking-wider flex items-center gap-1.5 font-sketch">
              <Shield size={14} className="text-[#FF8C42]" />
              Approval Tier Governance
            </span>
            <span className={isBand1 ? 'text-[#88D49E]' : isBand2 ? 'text-[#FF8C42]' : 'text-red-400'}>
              {isBand1 ? 'Tier 1: Requester Alone' : isBand2 ? 'Tier 2: Dual Approval Required' : 'Tier 3: Blocked (Executive Override)'}
            </span>
          </div>

          {/* Segmented Visual Slider Track */}
          <div className="relative pt-2 pb-1">
            <div className="h-4 w-full rounded-full flex overflow-hidden border border-[#E6E6E6]/30 bg-[#141414]">
              <div className="w-[30%] bg-[#88D49E]/40" title="0–30%: 1-person approval" />
              <div className="w-[30%] bg-[#FF8C42]/40 border-l border-[#E6E6E6]/20" title="30–60%: 2-person dual approval" />
              <div className="w-[40%] bg-red-500/40 border-l border-[#E6E6E6]/20" title="Over 60%: Blocked" />
            </div>

            {/* Pointer */}
            <div
              className="absolute top-1 w-2.5 h-6 bg-[#FFFFFF] border border-[#1A1A1A] rounded shadow-[0_0_8px_rgba(255,255,255,0.9)] -translate-x-1/2 pointer-events-none transition-all duration-150"
              style={{ left: `${Math.max(1, Math.min(99, discountPct))}%` }}
            />

            <div className="flex justify-between text-[11px] font-mono mt-2 font-medium">
              <span className="w-[30%] text-left text-[#88D49E]">0–30% (One Person)</span>
              <span className="w-[30%] text-center text-[#FF8C42]">30–60% (Two People)</span>
              <span className="w-[40%] text-right text-red-400">&gt;60% (Blocked)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Capacity Guardrails & Cap Limits */}
      <div className="sketch-card rounded-[24px] p-5 space-y-4 bg-[#202020]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]/20">
          <div>
            <h2 className="font-marker font-bold text-xl text-[#FFFFFF] tracking-tight flex items-center gap-2">
              <Lock size={18} className="text-[#FF8C42]" />
              2. Capacity Guardrails &amp; Cap Limits
            </h2>
            <p className="text-xs text-[#E6E6E6]/70 font-chalk mt-0.5">
              Rule formula: Cap = min(floor(Share% × 336 window slots), floor(Loss Budget ÷ $1,940 loss/seat)).
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#E6E6E6]/60 uppercase block">Rule Cap: {ruleCap} Seats</span>
            <span className="font-mono font-bold text-lg text-[#88D49E]">{effectiveCap} Seats Allowed</span>
          </div>
        </div>

        {/* 2-Column Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Capacity Share Slider */}
          <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30 space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="share-slider" className="font-bold text-[#E6E6E6]/80 uppercase tracking-wider text-[11px]">
                Capacity Share (7-Day Window)
              </label>
              <span className="font-mono font-bold text-[#FFFFFF] text-sm">
                {sharePct}% ({Math.floor((sharePct / 100) * PRICING_RULES.WINDOW_SEATS)} seats)
              </span>
            </div>
            <input
              id="share-slider"
              type="range"
              min="5"
              max="20"
              step="1"
              value={sharePct}
              onChange={(e) => setSharePct(parseInt(e.target.value, 10))}
              className="w-full accent-[#FF8C42] h-2 bg-[#141414] rounded-lg cursor-pointer"
            />
            <p className="text-[10.5px] text-[#E6E6E6]/60 font-chalk">
              Adjustable from 5% to 20% of the 336 available slots (7 days × 48 slots).
            </p>
          </div>

          {/* Loss Budget Ceiling */}
          <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30 space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="budget-input" className="font-bold text-[#E6E6E6]/80 uppercase tracking-wider text-[11px]">
                Max Accepted Loss Budget
              </label>
              <span className="font-mono text-[#E6E6E6]/60 text-[11px]">
                = {Math.floor(budget / PRICING_RULES.LOSS_PER_SEAT_AT_TYPO)} seats
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[#E6E6E6]/60 text-sm">$</span>
              <input
                id="budget-input"
                type="number"
                step="10000"
                min="10000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#141414] border border-[#E6E6E6]/40 font-mono text-right px-3 py-1.5 rounded-xl text-[#FFFFFF] text-sm font-bold focus:outline-none focus:border-[#FF8C42]"
              />
            </div>
            <p className="text-[10.5px] text-[#E6E6E6]/60 font-chalk">
              Divides total loss budget by $1,940 baseline loss per seat to establish safety ceiling.
            </p>
          </div>

          {/* Staff Can Lower Cap Rule */}
          <div className="md:col-span-2 bg-[#1A1A1A] p-3.5 rounded-2xl border border-[#E6E6E6]/30 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#E6E6E6]/80 uppercase tracking-wider text-[11px] block">
                Manual Cap Ceiling (Lower Only)
              </span>
              <p className="text-[10.5px] text-[#E6E6E6]/60 font-chalk">
                Staff can lower the cap below {ruleCap}, but can never raise it above the rule cap.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="custom-cap-input" className="text-[#E6E6E6]/70 text-xs font-mono">Custom cap:</label>
              <input
                id="custom-cap-input"
                type="number"
                min="1"
                max={ruleCap}
                placeholder={`Auto (${ruleCap})`}
                value={customCap ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                  setCustomCap(val !== null && !isNaN(val) ? Math.min(val, ruleCap) : null);
                }}
                className="w-24 bg-[#141414] border border-[#E6E6E6]/40 font-mono text-right px-2.5 py-1 rounded-lg text-[#FFFFFF] text-xs font-bold focus:outline-none focus:border-[#FF8C42]"
              />
              {customCap !== null && (
                <button
                  type="button"
                  onClick={() => setCustomCap(null)}
                  className="text-[10.5px] font-mono text-[#FF8C42] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Schedule & Historical Context Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30">
          <div>
            <span className="text-[10.5px] font-mono text-[#E6E6E6]/60 uppercase block font-bold">
              Publication Schedule (Flagship Rule: Min 24 Hours)
            </span>
            <input
              type="text"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full mt-1 bg-[#141414] border border-[#E6E6E6]/40 text-[#FFFFFF] font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#FF8C42]"
            />
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#E6E6E6]/60 uppercase block font-bold">
              Recent Sales History on Dinosaur Walk
            </span>
            <p className="font-mono text-xs text-[#FFFFFF] mt-1.5">
              15% · 20% · 10% · 25% · 20% (Lowest ever sold: $1,500)
            </p>
            <p className="text-[10.5px] text-[#E6E6E6]/60 font-chalk mt-0.5">
              Max potential loss at current settings: <strong className="text-[#FF8C42]">{formatMoney(worstCase)}</strong>
            </p>
          </div>
        </div>

        {/* Blocked State Executive Override Panel */}
        {isBlocked && (
          <div className="bg-[#241714] border border-red-500 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Lock size={14} />
              Executive Dual-Authorization Required
            </div>

            <div className="space-y-1">
              <label htmlFor="override-reason" className="text-xs text-[#E6E6E6]/80 font-medium">
                Mandatory Written Justification:
              </label>
              <textarea
                id="override-reason"
                rows={2}
                placeholder="Document commercial rationale for discount exceeding 60%..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full bg-[#141414] border border-[#E6E6E6]/30 text-[#FFFFFF] text-xs p-2.5 rounded-xl focus:outline-none focus:border-red-500 font-chalk"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1A1A1A] border border-[#E6E6E6]/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={financeLeadApproved}
                  onChange={toggleFinanceLeadApproved}
                  className="rounded accent-red-500"
                />
                <span className="text-xs font-semibold text-[#FFFFFF]">
                  Finance Lead Sign-off
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1A1A1A] border border-[#E6E6E6]/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={founderApproved}
                  onChange={toggleFounderApproved}
                  className="rounded accent-red-500"
                />
                <span className="text-xs font-semibold text-[#FFFFFF]">
                  Founder Sign-off
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2">
          {isBand1 && (
            <button
              onClick={scheduleSale}
              className="sketch-btn-orange w-full py-3.5 text-sm rounded-full flex items-center justify-center gap-2"
            >
              <Check size={16} />
              <span>SCHEDULE SALE · {formatMoney(price)} ({effectiveCap} SEATS)</span>
            </button>
          )}

          {isBand2 && (
            <button
              onClick={sendToApprover}
              className="sketch-btn-orange w-full py-3.5 text-sm rounded-full flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>SUBMIT TO SECOND APPROVER ({discountPct}% OFF · {formatMoney(price)})</span>
            </button>
          )}

          {isBlocked && (
            <div className="space-y-2">
              <button
                disabled={!canOverride}
                onClick={scheduleSale}
                className={`w-full py-3.5 font-sketch font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 ${
                  canOverride
                    ? 'bg-[#E5484D] text-white hover:bg-red-600 shadow-md'
                    : 'bg-[#2A2A2A] text-[#E6E6E6]/40 cursor-not-allowed border border-[#E6E6E6]/20'
                }`}
              >
                <Lock size={16} />
                <span>{canOverride ? 'EXECUTIVE OVERRIDE & SCHEDULE' : 'SCHEDULE SALE (BLOCKED - DUAL SIGN-OFF REQUIRED)'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={forceLiveDemo}
                  className="text-xs text-[#FF8C42] hover:underline font-sketch transition-colors"
                >
                  Demo override: bypass locks 1 and 2 to test fail-safes →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
