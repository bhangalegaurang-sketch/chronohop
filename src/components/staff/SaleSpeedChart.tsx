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
    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30 space-y-2 font-sketch">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-bold text-[#E6E6E6]/80 uppercase tracking-wider">
          Sale Speed Monitor (Rolling 5-Min Bookings)
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-[#88D49E]">
            <span className="w-2.5 h-0.5 bg-[#88D49E] inline-block" /> Forecast: 6
          </span>
          <span className="flex items-center gap-1 text-[#FF8C42]">
            <span className="w-2.5 h-0.5 bg-[#FF8C42] inline-block border-b border-dashed" /> Breaker: 30
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative h-28 w-full pt-4 pb-6 px-2 flex items-end justify-between gap-3 border-b border-[#E6E6E6]/20">
        {/* Forecast Horizontal Guideline */}
        <div
          className="absolute left-0 right-0 border-b border-dashed border-[#88D49E]/50 pointer-events-none"
          style={{ bottom: `${forecastY}%` }}
        >
          <span className="absolute right-1 -top-3 text-[9px] font-mono text-[#88D49E]">
            fcst (6)
          </span>
        </div>

        {/* Breaker 5x Guideline */}
        <div
          className="absolute left-0 right-0 border-b-2 border-dashed border-[#FF8C42]/80 pointer-events-none z-10"
          style={{ bottom: `${breakerY}%` }}
        >
          <span className="absolute right-1 -top-3 text-[9px] font-mono text-[#FF8C42] font-bold">
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
              <div className="absolute -top-6 bg-black/90 text-white font-mono text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-md">
                {item.bookings} bookings ({item.label})
              </div>

              {/* Bar element */}
              <div
                className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                  isBreached
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(229,72,77,0.5)]'
                    : 'bg-[#FF8C42] hover:bg-[#FFA86E]'
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* Time Label */}
              <span className="text-[9px] font-mono text-[#E6E6E6]/50 mt-1">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
