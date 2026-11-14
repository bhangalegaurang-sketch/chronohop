import React from 'react';

interface DialGaugeProps {
  label: string;
  value: string | number;
  subtext: string;
  isAlarm?: boolean;
  pct?: number; // 0 to 100 for gauge arc
  alarmThresholdPct?: number;
}

export const DialGauge: React.FC<DialGaugeProps> = ({
  label,
  value,
  subtext,
  isAlarm = false,
  pct = 50,
}) => {
  const radius = 38;
  const stroke = 6;
  const normalizedPct = Math.max(0, Math.min(100, pct));
  const arcLength = 2 * Math.PI * radius * (240 / 360);
  const strokeDashoffset = arcLength * (1 - normalizedPct / 100);

  return (
    <div
      className={`relative flex-1 min-w-[170px] p-4 rounded-[24px] border transition-all duration-300 flex flex-col justify-between overflow-hidden font-sketch ${
        isAlarm
          ? 'bg-[#261614] border-red-500 shadow-[0_0_15px_rgba(229,72,77,0.3)] ring-1 ring-red-500/50'
          : 'sketch-card bg-[#202020]'
      }`}
    >
      {/* Background scribble accent */}
      {isAlarm && (
        <div className="absolute top-0 right-0 w-24 h-24 hatch-pattern opacity-30 rounded-bl-[40px] pointer-events-none" />
      )}

      {/* Label */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#E6E6E6]/70 truncate">
          {label}
        </span>
        <span className={`w-2 h-2 rounded-full ${isAlarm ? 'bg-red-500 animate-ping' : 'bg-[#88D49E]'}`} />
      </div>

      {/* Gauge Visualization & Value */}
      <div className="flex items-center gap-3 my-2 z-10">
        {/* SVG Arc Gauge */}
        <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-[210deg] transform" viewBox="0 0 100 100">
            {/* Background Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#333333"
              strokeWidth={stroke}
              strokeDasharray={arcLength}
              strokeLinecap="round"
            />
            {/* Foreground Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={isAlarm ? '#E5484D' : '#FF8C42'}
              strokeWidth={stroke + 1}
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-2 h-2 rounded-full ${isAlarm ? 'bg-red-400' : 'bg-[#88D49E]'}`} />
          </div>
        </div>

        {/* Big Value Readout */}
        <div className="flex flex-col">
          <span className={`text-2xl font-mono font-black tracking-tight ${isAlarm ? 'text-red-400' : 'text-[#FF8C42]'}`}>
            {value}
          </span>
          <span className="text-[10px] text-[#E6E6E6]/50 font-mono uppercase">
            {isAlarm ? '⚠ EXCEEDS THRESHOLD' : '✓ NOMINAL FLOW'}
          </span>
        </div>
      </div>

      {/* Subtext */}
      <p className="text-[11px] text-[#E6E6E6]/70 font-chalk z-10 leading-snug">
        {subtext}
      </p>
    </div>
  );
};
