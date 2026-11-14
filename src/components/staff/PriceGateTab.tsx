import React from 'react';
import { useStore } from '../../store/useStore';
import { PRICING_RULES } from '../../config/pricingRules';
import {
  calculatePrice,
  calculateRuleCap,
  getEffectiveCap,
  getCustomCapError,
  getApprovalBand,
  calculateWorstCaseLoss,
  isScheduleValid
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
    scheduleSale,
    forceLiveDemo
  } = useStore();

  const band = getApprovalBand(discountPct);
  const isInvalid = band === 'invalid';
  const isBlocked = band === 'blocked';
  const isBand2 = band === 'band_2';
  const isBand1 = band === 'band_1';
  const isNoDiscount = isBand1 && discountPct === 0;

  const price = isInvalid ? PRICING_RULES.LIST_PRICE : calculatePrice(discountPct);
  const ruleCap = calculateRuleCap(sharePct, budget);
  const effectiveCap = getEffectiveCap(sharePct, budget, customCap);
  const worstCase = calculateWorstCaseLoss(effectiveCap, price);
  const words = numberToWords(price);
  const belowLowestEver = Math.max(0, PRICING_RULES.LOWEST_EVER_SOLD - price);

  // Custom cap must be 1..ruleCap; anything else is rejected, never silently replaced by the rule cap
  const customCapMessage = getCustomCapError(customCap, ruleCap);
  const customCapError = customCapMessage !== null;
  const capIsZero = effectiveCap <= 0;
  const scheduleOk = isScheduleValid(scheduledTime);

  const formProblem = isInvalid
    ? 'Enter a discount between 0% and 100%.'
    : isNoDiscount
      ? '0% means no discount, so there is no sale to schedule.'
      : customCapError
        ? customCapMessage
        : capIsZero
          ? 'Sale-seat cap is 0 seats, so this sale cannot run. Raise the loss budget.'
          : !scheduleOk
            ? 'Flagship sales must start at least 24 hours from now.'
            : null;
  const canSubmit = formProblem === null;

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
              {discountPct}% discount ({formatMoney(price)}) is {formatMoney(belowLowestEver)} lower than this trip has ever sold for. Did you type a price instead of a percent?
            </p>
            <p className="text-[11px] text-[#E6E6E6]/80 font-chalk">
              Discounts over 60% cannot be scheduled from this screen. Finance lead and founder approval happens outside this screen.
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
                value={isNaN(discountPct) ? '' : discountPct}
                onChange={(e) => setDiscountPct(e.target.value === '' ? NaN : parseFloat(e.target.value))}
                aria-invalid={isInvalid}
                aria-describedby="discount-error"
                className={`w-full bg-[#141414] border ${isInvalid ? 'border-red-500' : 'border-[#E6E6E6]/40'} text-[#FFFFFF] font-mono font-black text-2xl px-3.5 py-2 rounded-xl text-right focus:outline-none focus:border-[#FF8C42] min-h-[46px]`}
              />
              <span className="font-mono font-bold text-xl text-[#FF8C42]">%</span>
            </div>
            {isInvalid && (
              <p id="discount-error" className="text-xs text-red-400 font-mono">
                ⚠ {isNaN(discountPct) ? 'Enter a discount.' : 'Discount must be between 0% and 100%.'}
              </p>
            )}
            {isNoDiscount && (
              <p className="text-xs text-[#E6E6E6]/70 font-chalk">0% = no discount (full $2,000 price).</p>
            )}
          </div>

          {/* Sized-up Calculated Price Display in Muted Orange (#FF8C42) */}
          <div className="md:col-span-7 sketch-dashed rounded-2xl p-4 text-center space-y-1 bg-[#1A1A1A]">
            <span className="text-[10px] font-mono tracking-widest text-[#E6E6E6]/60 uppercase block">
              Calculated Checkout Price (LIST × [1 - DISCOUNT%])
            </span>
            <div className="font-mono font-black text-4xl sm:text-5xl text-[#FF8C42] tracking-tight py-1">
              {isInvalid ? '—' : formatMoney(price)}
            </div>
            <div className="text-xs font-chalk text-[#E6E6E6]/90 italic">
              {isInvalid ? 'No price until the discount is valid' : `"${words}"`}
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
            <span className={isBand1 ? 'text-[#88D49E]' : isBand2 ? 'text-[#FF8C42]' : isInvalid ? 'text-[#E6E6E6]/50' : 'text-red-400'}>
              {isBand1
                ? (isNoDiscount ? 'Tier 1: No Discount' : 'Tier 1: Requester Alone')
                : isBand2
                  ? 'Tier 2: Second Person Required'
                  : isInvalid
                    ? 'Enter a valid discount'
                    : 'Tier 3: Blocked'}
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
              style={{ left: `${Math.max(1, Math.min(99, isNaN(discountPct) ? 0 : discountPct))}%` }}
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
            {customCapError ? (
              <span className="font-mono font-bold text-lg text-red-400">— Fix custom cap</span>
            ) : (
              <span className="font-mono font-bold text-lg text-[#88D49E]">{effectiveCap} Seats Allowed</span>
            )}
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
                = {Math.max(0, Math.floor(budget / PRICING_RULES.LOSS_PER_SEAT_AT_TYPO))} seats
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
                onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value, 10) || 0))}
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
                  setCustomCap(val !== null && !isNaN(val) ? val : null);
                }}
                aria-invalid={customCapError}
                className={`w-24 bg-[#141414] border ${customCapError ? 'border-red-500' : 'border-[#E6E6E6]/40'} font-mono text-right px-2.5 py-1 rounded-lg text-[#FFFFFF] text-xs font-bold focus:outline-none focus:border-[#FF8C42]`}
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
            {customCapError && (
              <p className="w-full text-xs text-red-400 font-mono">⚠ {customCapMessage}</p>
            )}
            {capIsZero && !customCapError && (
              <p className="w-full text-xs text-red-400 font-mono">⚠ Cap is 0 seats: the sale cannot run with this budget.</p>
            )}
          </div>
        </div>

        {/* Schedule & Historical Context Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30">
          <div>
            <label htmlFor="schedule-input" className="text-[10.5px] font-mono text-[#E6E6E6]/60 uppercase block font-bold">
              Sale Start (Flagship Rule: Min 24 Hours From Now)
            </label>
            <input
              id="schedule-input"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              aria-invalid={!scheduleOk}
              className={`w-full mt-1 bg-[#141414] border ${scheduleOk ? 'border-[#E6E6E6]/40' : 'border-red-500'} text-[#FFFFFF] font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#FF8C42] [color-scheme:dark]`}
            />
            {!scheduleOk && (
              <p className="text-xs text-red-400 font-mono mt-1">⚠ Pick a start time at least 24 hours from now.</p>
            )}
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-[#E6E6E6]/60 uppercase block font-bold">
              Recent Sales History on Dinosaur Walk
            </span>
            <p className="font-mono text-xs text-[#FFFFFF] mt-1.5">
              15% · 20% · 10% · 25% · 20% (Lowest ever sold: {formatMoney(PRICING_RULES.LOWEST_EVER_SOLD)})
            </p>
            <p className="text-[10.5px] text-[#E6E6E6]/60 font-chalk mt-0.5">
              Max potential loss at current settings: <strong className="text-[#FF8C42]">{customCapError ? '—' : formatMoney(worstCase)}</strong>
            </p>
          </div>
        </div>

        {/* Blocked State: no override from this screen */}
        {isBlocked && (
          <div className="bg-[#241714] border border-red-500 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Lock size={14} />
              Blocked: Over 60% Off
            </div>
            <p className="text-xs text-[#E6E6E6]/80 font-chalk">
              Finance lead + founder approval happens outside this screen. Nobody can put this price live from here.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {formProblem && !isBlocked && (
            <p className="text-xs text-red-400 font-mono text-center">⚠ {formProblem}</p>
          )}

          {(isBand1 || isInvalid) && (
            <button
              disabled={!canSubmit}
              onClick={scheduleSale}
              className={`sketch-btn-orange w-full py-3.5 text-sm rounded-full flex items-center justify-center gap-2 ${
                !canSubmit ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <Check size={16} />
              <span>{isInvalid || customCapError ? 'SCHEDULE SALE' : `SCHEDULE SALE · ${formatMoney(price)} (${effectiveCap} SEATS)`}</span>
            </button>
          )}

          {isBand2 && (
            <button
              disabled={!canSubmit}
              onClick={scheduleSale}
              className={`sketch-btn-orange w-full py-3.5 text-sm rounded-full flex items-center justify-center gap-2 ${
                !canSubmit ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <Send size={16} />
              <span>SUBMIT TO SECOND APPROVER ({discountPct}% OFF · {formatMoney(price)})</span>
            </button>
          )}

          {isBlocked && (
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-3.5 font-sketch font-bold text-sm rounded-full flex items-center justify-center gap-2 bg-[#2A2A2A] text-[#E6E6E6]/40 cursor-not-allowed border border-[#E6E6E6]/20"
              >
                <Lock size={16} />
                <span>BLOCKED · OVER 60% OFF</span>
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={forceLiveDemo}
                  className="test-only-btn text-xs px-4 py-1.5 rounded-full"
                  title="Prototype testing only: skips locks 1 and 2 so you can watch locks 3 and 4 work"
                >
                  Test only: skip locks 1–2
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
