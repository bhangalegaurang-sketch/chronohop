import React from 'react';
import { useStore } from '../../store/useStore';
import { Icons } from '../icons/Icons';
import { PRICING_RULES } from '../../config/pricingRules';
import {
  calculatePrice,
  calculateRuleCap,
  getEffectiveCap,
  getApprovalBand,
  calculateWorstCaseLoss
} from '../../utils/rules';
import { formatMoney, numberToWords } from '../../utils/formatters';

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
    <div className="space-y-4 p-5 text-staff-text overflow-y-auto">
      {/* Red STOP Banner when Discount Exceeds 60% */}
      {isBlocked && (
        <div 
          className="danger-hazard-banner text-white rounded-2xl p-4 shadow-xl border-2 border-[#FF8A7A] flex items-start gap-4 animate-pulse"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
            <Icons.Alert size={26} />
          </div>
          <div className="space-y-1">
            <h2 className="font-mono font-black text-lg tracking-wider uppercase text-white drop-shadow">
              STOP. THIS PRICE IS BLOCKED.
            </h2>
            <p className="text-xs font-medium leading-relaxed text-white/95">
              {discountPct}% discount ($ {formatMoney(price)}) is {formatMoney(1500 - price)} lower than this trip has ever sold for. Did you type a price instead of a percent?
            </p>
            <p className="text-[11px] text-white/80">
              Discounts over 60% require written justification, Finance Lead sign-off, and Founder authorization.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 1: Price Definition & Approval Governance */}
      <div className="panel-bezel rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-staff-border/80">
          <div>
            <h2 className="font-mono font-bold text-sm tracking-wide text-staff-text uppercase flex items-center gap-2">
              <Icons.Tag size={16} className="text-staff-brass" />
              1. Price Definition · Dinosaur Walk (Flagship Expedition)
            </h2>
            <p className="text-xs text-staff-muted mt-0.5">
              Promotional discounts are entered as a percentage only (0% to 100%, 1 decimal place).
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-staff-muted uppercase block">Standard Catalog List</span>
            <span className="font-mono font-bold text-base text-staff-text">$2,000.00</span>
          </div>
        </div>

        {/* Input & Live Readout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Discount Percentage Input */}
          <div className="md:col-span-5 bg-[#07110E] p-4 rounded-xl border border-staff-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="discount-pct" className="font-bold text-staff-muted uppercase tracking-wider text-[11px]">
                Discount Percentage
              </label>
              <span className="text-staff-brass text-[11px] font-mono">0.0% – 100.0%</span>
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
                className="w-full bg-[#050B08] border border-staff-border text-staff-text font-mono font-black text-2xl px-3.5 py-2 rounded-lg text-right focus:outline-none focus:border-staff-brass min-h-[46px]"
              />
              <span className="font-mono font-bold text-xl text-staff-brass">%</span>
            </div>
          </div>

          {/* Recessed VFD Output Display */}
          <div className="md:col-span-7 vfd-recessed rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-staff-muted uppercase block">
              Calculated Checkout Price (LIST × [1 - DISCOUNT%])
            </span>
            <div className="font-mono font-black text-4xl sm:text-5xl vfd-glow tracking-tight py-1">
              {formatMoney(price)}
            </div>
            <div className="text-xs font-serif italic text-[#EDE6D4]/90">
              "{words}"
            </div>
          </div>
        </div>

        {/* Approval Tier Band Bar */}
        <div className="space-y-2 bg-[#07110E] p-4 rounded-xl border border-staff-border">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-staff-muted uppercase tracking-wider flex items-center gap-1.5">
              <Icons.Shield size={14} className="text-staff-brass" />
              Approval Tier Governance
            </span>
            <span className={isBand1 ? 'text-staff-ok' : isBand2 ? 'text-staff-brass' : 'text-staff-dangerLight'}>
              {isBand1 ? 'Tier 1: Requester Alone' : isBand2 ? 'Tier 2: Dual Approval Required' : 'Tier 3: Blocked (Executive Override)'}
            </span>
          </div>

          {/* Segmented Visual Slider Track */}
          <div className="relative pt-2 pb-1">
            <div className="h-4 w-full rounded-full flex overflow-hidden border border-staff-border bg-[#050B08]">
              <div className="w-[30%] bg-staff-ok/40" title="0–30%: 1-person approval" />
              <div className="w-[30%] bg-staff-brass/40 border-l border-staff-border" title="30–60%: 2-person dual approval" />
              <div className="w-[40%] bg-staff-danger/50 border-l border-staff-border" title="Over 60%: Blocked" />
            </div>

            {/* Pointer */}
            <div
              className="absolute top-1 w-2.5 h-6 bg-white border border-black rounded shadow-[0_0_8px_rgba(255,255,255,0.9)] -translate-x-1/2 pointer-events-none transition-all duration-150"
              style={{ left: `${Math.max(1, Math.min(99, discountPct))}%` }}
            />

            <div className="flex justify-between text-[11px] font-mono mt-2 text-staff-muted font-medium">
              <span className="w-[30%] text-left text-staff-ok">0–30% (One Person)</span>
              <span className="w-[30%] text-center text-staff-brass">30–60% (Two People)</span>
              <span className="w-[40%] text-right text-staff-dangerLight">&gt;60% (Blocked)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Capacity Guardrails & Publish Controls */}
      <div className="panel-bezel rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-staff-border/80">
          <div>
            <h2 className="font-mono font-bold text-sm tracking-wide text-staff-text uppercase flex items-center gap-2">
              <Icons.Lock size={16} className="text-staff-brass" />
              2. Capacity Guardrails & Cap Limits
            </h2>
            <p className="text-xs text-staff-muted mt-0.5">
              Rule formula: Cap = min(floor(Share% × 336 window slots), floor(Loss Budget ÷ $1,940 loss/seat)).
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-staff-muted uppercase block">Rule Cap: {ruleCap} Seats</span>
            <span className="font-mono font-bold text-base text-staff-glow">{effectiveCap} Seats Allowed</span>
          </div>
        </div>

        {/* 2-Column Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Capacity Share Slider */}
          <div className="bg-[#07110E] p-3.5 rounded-xl border border-staff-border space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="share-slider" className="font-bold text-staff-muted uppercase tracking-wider text-[11px]">
                Capacity Share (7-Day Window)
              </label>
              <span className="font-mono font-bold text-staff-text text-sm">
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
              className="w-full accent-staff-brass h-2 bg-[#050B08] rounded-lg cursor-pointer"
            />
            <p className="text-[10.5px] text-staff-muted">
              Adjustable from 5% to 20% of the 336 available slots (7 days × 48 slots).
            </p>
          </div>

          {/* Loss Budget Ceiling */}
          <div className="bg-[#07110E] p-3.5 rounded-xl border border-staff-border space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="budget-input" className="font-bold text-staff-muted uppercase tracking-wider text-[11px]">
                Max Accepted Loss Budget
              </label>
              <span className="font-mono text-staff-muted text-[11px]">
                = {Math.floor(budget / PRICING_RULES.LOSS_PER_SEAT_AT_TYPO)} seats
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-staff-muted text-sm">$</span>
              <input
                id="budget-input"
                type="number"
                step="10000"
                min="10000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#050B08] border border-staff-border font-mono text-right px-3 py-1.5 rounded text-staff-text text-sm font-bold focus:outline-none focus:border-staff-brass"
              />
            </div>
            <p className="text-[10.5px] text-staff-muted">
              Divides total loss budget by $1,940 baseline loss per seat to establish safety ceiling.
            </p>
          </div>

          {/* Staff Can Lower Cap Rule */}
          <div className="md:col-span-2 bg-[#07110E] p-3 rounded-xl border border-staff-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-staff-muted uppercase tracking-wider text-[11px] block">
                Manual Cap Ceiling (Lower Only)
              </span>
              <p className="text-[10.5px] text-staff-muted">
                Staff can lower the cap below {ruleCap}, but can never raise it above the rule cap.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="custom-cap-input" className="text-staff-muted text-xs font-mono">Custom cap:</label>
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
                className="w-24 bg-[#050B08] border border-staff-border font-mono text-right px-2.5 py-1 rounded text-staff-text text-xs font-bold focus:outline-none focus:border-staff-brass"
              />
              {customCap !== null && (
                <button
                  type="button"
                  onClick={() => setCustomCap(null)}
                  className="text-[10.5px] font-mono text-staff-brass hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Schedule & Historical Context Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#07110E] p-3.5 rounded-xl border border-staff-border">
          <div>
            <span className="text-[10.5px] font-mono text-staff-muted uppercase block font-bold">
              Publication Schedule (Flagship Rule: Min 24 Hours)
            </span>
            <input
              type="text"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full mt-1 bg-[#050B08] border border-staff-border text-staff-text font-mono text-xs px-3 py-1.5 rounded focus:outline-none focus:border-staff-brass"
            />
          </div>
          <div>
            <span className="text-[10.5px] font-mono text-staff-muted uppercase block font-bold">
              Recent Sales History on Dinosaur Walk
            </span>
            <p className="font-mono text-xs text-staff-text mt-1.5">
              15% · 20% · 10% · 25% · 20% (Lowest ever sold: $1,500)
            </p>
            <p className="text-[10.5px] text-staff-muted mt-0.5">
              Max potential loss at current settings: <strong>{formatMoney(worstCase)}</strong>
            </p>
          </div>
        </div>

        {/* Blocked State Executive Override Panel */}
        {isBlocked && (
          <div className="bg-[#180A09] border border-staff-danger rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-staff-dangerLight text-xs font-bold uppercase tracking-wider font-mono">
              <Icons.Lock size={14} />
              Executive Dual-Authorization Required
            </div>

            <div className="space-y-1">
              <label htmlFor="override-reason" className="text-xs text-staff-muted font-medium">
                Mandatory Written Justification:
              </label>
              <textarea
                id="override-reason"
                rows={2}
                placeholder="Document commercial rationale for discount exceeding 60%..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full bg-[#07110E] border border-staff-border text-staff-text text-xs p-2.5 rounded-lg focus:outline-none focus:border-staff-danger"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#07110E] border border-staff-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={financeLeadApproved}
                  onChange={toggleFinanceLeadApproved}
                  className="rounded text-staff-danger focus:ring-staff-danger"
                />
                <span className="text-xs font-semibold text-staff-text">
                  Finance Lead Sign-off
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#07110E] border border-staff-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={founderApproved}
                  onChange={toggleFounderApproved}
                  className="rounded text-staff-danger focus:ring-staff-danger"
                />
                <span className="text-xs font-semibold text-staff-text">
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
              className="w-full py-3.5 brass-btn font-mono font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Icons.Check size={16} />
              Schedule Sale · {formatMoney(price)} ({effectiveCap} Seats)
            </button>
          )}

          {isBand2 && (
            <button
              onClick={sendToApprover}
              className="w-full py-3.5 brass-btn font-mono font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Icons.Stamp size={16} />
              Submit to Second Approver ({discountPct}% Off · {formatMoney(price)})
            </button>
          )}

          {isBlocked && (
            <div className="space-y-2">
              <button
                disabled={!canOverride}
                onClick={scheduleSale}
                className={`w-full py-3.5 font-mono font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 min-h-[46px] ${
                  canOverride
                    ? 'bg-staff-danger text-white hover:bg-[#B3261E] shadow-lg'
                    : 'bg-[#15231C] text-staff-muted cursor-not-allowed border border-staff-border'
                }`}
              >
                <Icons.Lock size={16} />
                {canOverride ? 'Executive Override & Schedule' : 'Schedule Sale (Blocked - Dual Sign-off Required)'}
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={forceLiveDemo}
                  className="text-xs text-staff-dangerLight hover:text-white underline font-mono transition-colors"
                >
                  Demo override: bypass locks 1 and 2 to test fail-safes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
