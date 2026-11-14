import React from 'react';

interface SeatTickBarProps {
  total: number;
  remaining: number;
}

export const SeatTickBar: React.FC<SeatTickBarProps> = ({ total, remaining }) => {
  const safeTotal = Math.max(1, total);
  const safeRemaining = Math.max(0, Math.min(remaining, safeTotal));
  const sold = safeTotal - safeRemaining;

  return (
    <div className="w-full space-y-1.5" role="progressbar" aria-valuenow={safeRemaining} aria-valuemin={0} aria-valuemax={safeTotal} aria-label={`${safeRemaining} of ${safeTotal} sale seats remaining`}>
      {/* Hand-drawn sketchy tick track */}
      <div className="flex items-center gap-[2.5px] h-4 bg-[#141414] p-[2px] rounded-lg border border-[#E6E6E6]/40 shadow-inner overflow-hidden">
        {Array.from({ length: safeTotal }).map((_, i) => {
          const isAvailable = i >= sold;
          return (
            <div
              key={i}
              className={`flex-1 h-full rounded-[1px] transition-all duration-200 ${
                isAvailable
                  ? 'bg-[#88D49E] shadow-[0_0_2px_#88D49E]'
                  : 'hatch-pattern bg-[#2A2A2A] opacity-40'
              }`}
              title={`Seat ${i + 1}: ${isAvailable ? 'Available' : 'Claimed'}`}
            />
          );
        })}
      </div>

      {/* Graduation numbers in chalk font */}
      <div className="flex justify-between text-[10px] font-sketch text-[#E6E6E6]/60 px-0.5 select-none">
        <span>0</span>
        <span>10</span>
        <span>20</span>
        <span>30</span>
        <span>{safeTotal} seats</span>
      </div>
    </div>
  );
};
