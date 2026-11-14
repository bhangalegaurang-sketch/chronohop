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
  // SVG semi-circle gauge calculations (-120deg to +120deg, total 240deg)
  const radius = 38;
  const stroke = 6;
  const normalizedPct = Math.max(0, Math.min(100, pct));
  const arcLength = 2 * Math.PI * radius * (240 / 360);
  const strokeDashoffset = arcLength * (1 - normalizedPct / 100);

  return (
    <div
      className={`relative flex-1 min-w-[170px] p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isAlarm
          ? 'bg-gradient-to-b from-[#2A0E0C] to-[#1A0706] border-staff-danger shadow-[0_0_20px_rgba(196,48,43,0.35)] ring-1 ring-staff-danger/50'
          : 'bg-gradient-to-b from-[#0F1F19] to-[#0A1612] border-staff-border shadow-inner'
      }`}
    >
      {/* Background radial accent glow */}
      <div 
        className={`absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none blur-2xl ${
          isAlarm ? 'bg-staff-danger/15' : 'bg-staff-glow/5'
        }`} 
      />

      {/* Label */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-staff-muted truncate">
          {label}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full ${isAlarm ? 'bg-staff-danger animate-ping' : 'bg-staff-ok/60'}`} />
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
              stroke="#1B3329"
              strokeWidth={stroke}
              strokeDasharray={`${arcLength} 300`}
              strokeLinecap="round"
            />
            {/* Active Filled Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={isAlarm ? '#FF8A7A' : '#E3A93B'}
              strokeWidth={stroke}
              strokeDasharray={`${arcLength} 300`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Subtle Dial Center Pin */}
          <div className={`absolute w-2 h-2 rounded-full ${isAlarm ? 'bg-staff-dangerLight' : 'bg-staff-glow'} shadow-[0_0_6px_currentColor]`} />
        </div>

        {/* Big Number Readout */}
        <div className="flex-1 min-w-0">
          <div
            className={`font-mono font-black text-2xl sm:text-3xl tracking-tight leading-none ${
              isAlarm
                ? 'text-[#FF8A7A] drop-shadow-[0_0_10px_rgba(255,138,122,0.8)]'
                : 'text-staff-glow drop-shadow-[0_0_8px_rgba(241,196,107,0.4)]'
            }`}
          >
            {value}
          </div>
        </div>
      </div>

      {/* Subtext */}
      <div className="text-[10.5px] text-staff-muted leading-tight truncate z-10 border-t border-staff-border/40 pt-1.5" title={subtext}>
        {subtext}
      </div>
    </div>
  );
};
