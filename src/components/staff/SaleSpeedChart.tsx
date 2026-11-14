import React from 'react';
import { SpeedDataPoint } from '../../store/useStore';
import { PRICING_RULES } from '../../config/pricingRules';

interface SaleSpeedChartProps {
  data: SpeedDataPoint[];
}

export const SaleSpeedChart: React.FC<SaleSpeedChartProps> = ({ data }) => {
  const maxVal = Math.max(40, ...data.map((d) => d.bookings));
  const forecastY = (PRICING_RULES.DEMO_FORECAST_5MIN / maxVal) * 100;
  const breakerY = (PRICING_RULES.DEMO_BREAKER_THRESHOLD / maxVal) * 100;

  return (
    <div className="bg-[#0A1612] p-3.5 rounded-xl border border-staff-border space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-bold text-staff-muted uppercase tracking-wider">
          Sale Speed Monitor (Rolling 5-Min Bookings)
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-staff-muted">
            <span className="w-2.5 h-0.5 bg-staff-muted inline-block" /> Forecast: 6
          </span>
          <span className="flex items-center gap-1 text-staff-dangerLight">
            <span className="w-2.5 h-0.5 bg-staff-danger inline-block border-b border-dashed" /> Breaker: 30
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-28 w-full pt-4 pb-6 px-2 flex items-end justify-between gap-3 border-b border-staff-border/40">
        {/* Forecast Horizontal Guideline */}
        <div
          className="absolute left-0 right-0 border-b border-dashed border-staff-muted/50 pointer-events-none"
          style={{ bottom: `${forecastY}%` }}
        >
          <span className="absolute right-1 -top-3 text-[9px] font-mono text-staff-muted">
            fcst (6)
          </span>
        </div>

        {/* Breaker 5x Guideline */}
        <div
          className="absolute left-0 right-0 border-b-2 border-dashed border-staff-danger/80 pointer-events-none z-10"
          style={{ bottom: `${breakerY}%` }}
        >
          <span className="absolute right-1 -top-3 text-[9px] font-mono text-staff-danger font-bold">
            breaker 5x (30)
          </span>
        </div>

        {/* Dynamic Bars */}
        {data.map((item) => {
          const heightPct = Math.min(100, Math.max(8, (item.bookings / maxVal) * 100));
          const isBreached = item.bookings > PRICING_RULES.DEMO_BREAKER_THRESHOLD;

          return (
            <div key={item.id} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-6 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {item.bookings} bkgs
              </div>

              {/* Bar */}
              <div
                className={`w-full max-w-[36px] rounded-t transition-all duration-300 ${
                  isBreached
                    ? 'bg-staff-danger shadow-[0_0_10px_rgba(196,48,43,0.8)] animate-pulse'
                    : item.bookings > 15
                    ? 'bg-staff-brass'
                    : 'bg-staff-ok/70'
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* X Axis Label */}
              <span className="absolute -bottom-5 text-[10px] font-mono text-staff-muted">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
