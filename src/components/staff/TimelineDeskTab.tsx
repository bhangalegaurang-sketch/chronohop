import React from 'react';
import { useStore, isSaleOpen } from '../../store/useStore';
import { DialGauge } from './DialGauge';
import { SaleSpeedChart } from './SaleSpeedChart';
import { PRICING_RULES } from '../../config/pricingRules';
import { formatMoney } from '../../utils/formatters';
import { calculateLossPerSeat, calculateWorstCaseLoss } from '../../utils/rules';
import { Play, Pause, XCircle } from 'lucide-react';

export const TimelineDeskTab: React.FC = () => {
  const {
    liveSale,
    recentBookingCounts,
    speedHistory,
    eventLog,
    lock1CapEnabled,
    pauseListing,
    resumeListing,
    endSaleEarly
  } = useStore();

  const saleOpen = isSaleOpen({ liveSale, lock1CapEnabled });
  const lowestSold = liveSale.lowestPriceSold;

  const rolling5m = recentBookingCounts.reduce((a, b) => a + b, 0);
  const speedRatio = rolling5m / PRICING_RULES.DEMO_FORECAST_5MIN;
  const priceRatio = Math.round((lowestSold / PRICING_RULES.LIST_PRICE) * 100);

  const isPriceAlarm = priceRatio < 40;
  const isSpeedAlarm = speedRatio > 5.0;

  // Exposure counts sale-price seats only; bookings past the cap pay $2,000
  const currentExposure = liveSale.soldCount * calculateLossPerSeat(liveSale.price);
  const maxExposure = calculateWorstCaseLoss(liveSale.cap, liveSale.price);

  return (
    <div className="space-y-4 p-4 text-[#E6E6E6] font-sketch select-none">
      {/* Three Dials Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Dial 1: Bookings per slot */}
        <DialGauge
          label="BOOKINGS PER SLOT (MAX 1)"
          value="1"
          subtext="Each 30-minute departure slot holds one traveller."
          pct={100}
          isAlarm={false}
        />

        {/* Dial 2: Lowest price sold vs list */}
        <DialGauge
          label="LOWEST PRICE SOLD VS LIST"
          value={`${priceRatio}%`}
          subtext={`${formatMoney(lowestSold)} of $2,000 (lowest actually sold). Alarm below 40%.`}
          pct={priceRatio}
          isAlarm={isPriceAlarm}
        />

        {/* Dial 3: Bookings last 5m vs forecast */}
        <DialGauge
          label="BOOKINGS (5 MIN VS FORECAST)"
          value={`${speedRatio.toFixed(1)}x`}
          subtext={`Forecast: 6. Circuit breaker trips above 5x velocity.`}
          pct={Math.min(100, (speedRatio / 6) * 100)}
          isAlarm={isSpeedAlarm}
        />
      </div>

      {/* Real-time Velocity Chart */}
      <SaleSpeedChart data={speedHistory} />

      {/* Listing Status & Emergency Actions */}
      <div className="sketch-card rounded-[24px] p-5 space-y-4 bg-[#202020]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6E6E6]/20">
          <div>
            <h3 className="font-marker font-bold text-xl text-[#FFFFFF] tracking-tight">
              Listing Operations &amp; Exposure Guard
            </h3>
            <p className="text-xs text-[#E6E6E6]/70 font-chalk">
              Live state controls, promotional exposure ledger, and instant kill switches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono">
              Total promo exposure: <strong className="text-[#FF8C42]">{formatMoney(currentExposure)}</strong>
              <span className="text-[#E6E6E6]/60"> of {formatMoney(maxExposure)} max</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              saleOpen ? 'bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/40' : 'bg-red-500/15 text-red-300 border-red-500/40'
            }`}>
              {saleOpen ? (liveSale.isPaused ? 'PAUSED' : 'SALE LIVE') : 'SALE OVER · $2,000'}
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {liveSale.isPaused ? (
            <button
              onClick={resumeListing}
              className="sketch-btn-orange py-3 px-4 rounded-full text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Play size={15} />
              <span>RESUME LISTING (1-CLICK ON-CALL CLEARANCE)</span>
            </button>
          ) : (
            <button
              onClick={() => pauseListing()}
              className="py-3 px-4 rounded-full border border-red-500 text-red-300 bg-red-950/40 hover:bg-red-900/60 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Pause size={15} />
              <span>EMERGENCY PAUSE LISTING</span>
            </button>
          )}

          <button
            onClick={endSaleEarly}
            disabled={!saleOpen}
            className="py-3 px-4 rounded-full border border-[#E6E6E6]/30 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-xs text-[#E6E6E6] font-bold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <XCircle size={15} className="text-[#FF8C42]" />
            <span>END PROMO EARLY (RESTORE $2,000 LIST)</span>
          </button>
        </div>
      </div>

      {/* Event Audit Ledger */}
      <div className="sketch-dashed rounded-[24px] p-4 space-y-2 bg-[#1A1A1A]">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#E6E6E6]/15">
          <span className="font-bold uppercase tracking-wider text-[#FF8C42]">
            Live Event Audit Trail
          </span>
          <span className="text-[10px] font-mono text-[#E6E6E6]/50">
            {eventLog.length} events recorded
          </span>
        </div>

        <div className="space-y-1.5 max-h-40 overflow-y-auto visible-scrollbar-y pr-1">
          {eventLog.length === 0 ? (
            <p className="text-xs text-[#E6E6E6]/50 font-chalk italic py-2 text-center">
              No audit events recorded yet.
            </p>
          ) : (
            eventLog.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between text-xs font-mono py-1 border-b border-[#E6E6E6]/10 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    entry.type === 'alert' ? 'bg-red-400' : entry.type === 'lock' ? 'bg-[#FF8C42]' : entry.type === 'success' ? 'bg-[#88D49E]' : 'bg-gray-400'
                  }`} />
                  <span className="text-[#FFFFFF]">{entry.message}</span>
                </div>
                <span className="text-[10px] text-[#E6E6E6]/50 flex-shrink-0 ml-2">
                  {entry.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
