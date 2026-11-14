import React from 'react';
import { useStore } from '../../store/useStore';
import { Icons } from '../icons/Icons';
import { DialGauge } from './DialGauge';
import { SaleSpeedChart } from './SaleSpeedChart';
import { PRICING_RULES } from '../../config/pricingRules';
import { formatMoney } from '../../utils/formatters';

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

  const isSaleActive = liveSale.isActive && !liveSale.isEnded && (!lock1CapEnabled || liveSale.soldCount < liveSale.cap);
  const currentPrice = isSaleActive ? liveSale.price : PRICING_RULES.LIST_PRICE;

  const rolling5m = recentBookingCounts.reduce((a, b) => a + b, 0);
  const speedRatio = rolling5m / PRICING_RULES.DEMO_FORECAST_5MIN;
  const priceRatio = Math.round((currentPrice / PRICING_RULES.LIST_PRICE) * 100);

  const isPriceAlarm = priceRatio < 40;
  const isSpeedAlarm = speedRatio > 5.0;

  const currentExposure = liveSale.soldCount * Math.max(0, PRICING_RULES.LIST_PRICE - liveSale.price);

  return (
    <div className="space-y-4 p-4 text-staff-text overflow-y-auto">
      {/* Three Dials Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Dial 1: Bookings per slot */}
        <DialGauge
          label="BOOKINGS PER SLOT (MAX 1)"
          value="1"
          subtext="Dedicated slots: each departure window holds an exclusive return beacon."
          pct={100}
          isAlarm={false}
        />

        {/* Dial 2: Lowest price sold vs list */}
        <DialGauge
          label="LOWEST PRICE SOLD VS LIST"
          value={`${priceRatio}%`}
          subtext={`${formatMoney(currentPrice)} of $2,000. Alarm below 40%.`}
          pct={priceRatio}
          isAlarm={isPriceAlarm}
        />

        {/* Dial 3: Bookings last 5m vs forecast */}
        <DialGauge
          label="BOOKINGS, LAST 5 MIN VS FORECAST"
          value={`${speedRatio.toFixed(1)}x`}
          subtext={`Forecast: 6. Breaker trips above 5x.`}
          pct={Math.min(100, (speedRatio / 6) * 100)}
          isAlarm={isSpeedAlarm}
        />
      </div>

      {/* Sale Speed Bar Chart */}
      <SaleSpeedChart data={speedHistory} />

      {/* Timeline Desk Status Panel */}
      <div className="bg-staff-panel border border-staff-border rounded-2xl p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-staff-border text-xs">
          <div className="flex items-center gap-2">
            <Icons.Desk size={16} className="text-staff-brass" />
            <span className="font-mono font-bold uppercase tracking-wider text-staff-text">
              TIMELINE DESK · STATUS
            </span>
          </div>
          <span className={`font-mono text-xs font-black px-2.5 py-0.5 rounded ${
            liveSale.isPaused
              ? 'bg-staff-danger text-white animate-pulse'
              : liveSale.isEnded
              ? 'bg-staff-muted/30 text-staff-muted'
              : 'bg-staff-ok/20 text-staff-ok'
          }`}>
            {liveSale.isPaused ? 'PAUSED' : liveSale.isEnded ? 'SALE ENDED' : 'LIVE · SALE ON'}
          </span>
        </div>

        {/* Status Rows */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-dashed border-staff-border">
            <span className="text-staff-muted">Listing</span>
            <strong className={`font-mono font-bold ${liveSale.isPaused ? 'text-staff-danger' : 'text-staff-ok'}`}>
              {liveSale.isPaused ? 'PAUSED' : isSaleActive ? 'LIVE, sale on' : 'LIVE, standard price'}
            </strong>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-dashed border-staff-border">
            <span className="text-staff-muted">Sale seats sold</span>
            <strong className="font-mono text-staff-text">
              {Math.min(liveSale.soldCount, lock1CapEnabled ? liveSale.cap : liveSale.soldCount)}
              {lock1CapEnabled ? ` of ${liveSale.cap}` : ' (cap is off)'}
            </strong>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-staff-muted">Exposure so far</span>
            <strong className="font-mono text-staff-glow">
              {formatMoney(currentExposure)}
            </strong>
          </div>
        </div>

        {/* Buttons: Pause / Resume & End sale early */}
        <div className="flex flex-wrap gap-3 pt-2">
          {liveSale.isPaused ? (
            <button
              onClick={resumeListing}
              className="flex-1 py-3 px-4 bg-staff-ok text-staff-bg font-mono font-black text-xs rounded-xl hover:bg-[#5bb887] transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Icons.Play size={16} />
              Resume listing
            </button>
          ) : (
            <button
              onClick={() => pauseListing(true)}
              disabled={liveSale.isEnded}
              className="flex-1 py-3 px-4 bg-staff-danger hover:bg-[#A82520] text-white font-mono font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Icons.Pause size={16} />
              Pause listing
            </button>
          )}

          <button
            onClick={endSaleEarly}
            disabled={liveSale.isEnded}
            className="flex-1 py-3 px-4 bg-staff-panel hover:bg-[#1A2E26] border border-staff-border text-staff-text font-mono font-bold text-xs rounded-xl transition-colors min-h-[44px]"
          >
            End sale early
          </button>
        </div>
      </div>

      {/* What happened, newest first */}
      <div className="bg-staff-panel border border-staff-border rounded-2xl p-4 space-y-2 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-staff-border text-xs">
          <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-staff-muted">
            <Icons.Clock size={14} className="text-staff-brass" />
            WHAT HAPPENED, NEWEST FIRST
          </div>
          <span className="text-[10px] font-mono text-staff-muted">
            {eventLog.length} events
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
          {eventLog.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded-lg border flex items-start gap-2.5 text-[11px] leading-relaxed transition-all ${
                log.type === 'lock'
                  ? 'bg-[#18261E] border-staff-brass/50 text-staff-glow'
                  : log.type === 'alert'
                  ? 'bg-[#290D0B] border-staff-danger/60 text-staff-dangerLight'
                  : log.type === 'success'
                  ? 'bg-[#0E2019] border-staff-ok/40 text-staff-ok'
                  : 'bg-[#0A1612] border-staff-border/50 text-staff-text/90'
              }`}
            >
              <span className="text-[10px] text-staff-muted flex-shrink-0 pt-0.5">
                {log.timestamp}
              </span>
              <span className="flex-1">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
