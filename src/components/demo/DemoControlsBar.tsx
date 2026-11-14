import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Icons } from '../icons/Icons';

interface CursorPosition {
  left: number;
  width: number;
  opacity: number;
}

export const DemoControlsBar: React.FC = () => {
  const {
    bookSeat,
    triggerRush,
    isRushActive,
    forceLiveDemo,
    switchRole,
    currentRole,
    resetAll,
    lock1CapEnabled,
    toggleLock1,
    lock4BreakerEnabled,
    toggleLock4,
    liveSale
  } = useStore();

  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <footer className="sticky bottom-3 z-40 px-4 py-2 w-full flex justify-center pointer-events-none select-none">
      {/* Floating Bottom Chin Island Bar */}
      <div className="pointer-events-auto max-w-6xl w-full bg-[#07110E]/95 backdrop-blur-md border-2 border-[#1E362A] rounded-full p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Section Brand / Status */}
        <div className="flex items-center gap-2 pl-3">
          <span className="font-digits font-bold uppercase tracking-wider text-staff-brass flex items-center gap-1.5 text-[11px]">
            <Icons.Bolt size={14} />
            Demo controls
          </span>
          {isRushActive && (
            <span className="bg-staff-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow">
              Rush active
            </span>
          )}
        </div>

        {/* Center: Magnetic Sliding Cursor Floating Tab Group */}
        <ul
          className="relative flex items-center flex-wrap gap-1 rounded-full p-1"
          onMouseLeave={() => setCursorPosition((prev) => ({ ...prev, opacity: 0 }))}
        >
          {/* Animated Magnetic Cursor */}
          <motion.li
            animate={{
              left: cursorPosition.left,
              width: cursorPosition.width,
              opacity: cursorPosition.opacity,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="absolute z-0 h-9 rounded-full brass-gradient shadow-md pointer-events-none"
          />

          {/* Tab 1: One customer books */}
          <InteractiveTab
            disabled={liveSale.isPaused}
            setCursorPosition={setCursorPosition}
            onClick={() => bookSeat(1)}
            title="Simulate 1 customer completing purchase"
          >
            <span className="flex items-center gap-1.5">
              <Icons.User size={13} className="text-staff-ok group-hover:text-cust-ink transition-colors" />
              One customer books
            </span>
          </InteractiveTab>

          {/* Tab 2: Deal-site rush */}
          <InteractiveTab
            disabled={liveSale.isPaused || isRushActive}
            setCursorPosition={setCursorPosition}
            onClick={triggerRush}
            title="Simulate rapid booking surge from deal aggregator"
          >
            <span className="flex items-center gap-1.5">
              <Icons.Bolt size={13} className="text-staff-dangerLight group-hover:text-cust-ink transition-colors" />
              Deal-site rush
            </span>
          </InteractiveTab>

          {/* Tab 3: Go live now */}
          <InteractiveTab
            setCursorPosition={setCursorPosition}
            onClick={forceLiveDemo}
            title="Fast forward schedule & publish immediately"
          >
            <span className="flex items-center gap-1.5 text-staff-brass group-hover:text-cust-ink transition-colors">
              <Icons.Play size={13} />
              Go live now
            </span>
          </InteractiveTab>

          {/* Tab 4: Switch role */}
          <InteractiveTab
            setCursorPosition={setCursorPosition}
            onClick={() => switchRole()}
            title="Switch operator role (Analyst / Approver)"
          >
            <span className="flex items-center gap-1.5 text-staff-glow group-hover:text-cust-ink transition-colors">
              <Icons.User size={13} />
              Switch role ({currentRole === 'analyst' ? 'analyst' : 'approver'})
            </span>
          </InteractiveTab>

          {/* Tab 5: Reset */}
          <InteractiveTab
            setCursorPosition={setCursorPosition}
            onClick={resetAll}
            title="Reset prototype state"
          >
            <span className="flex items-center gap-1.5 text-staff-dangerLight group-hover:text-cust-ink transition-colors">
              <Icons.RotateCcw size={13} />
              Reset
            </span>
          </InteractiveTab>
        </ul>

        {/* Right: Lock Toggles */}
        <div className="flex items-center gap-3 bg-[#050C09] px-3.5 py-1.5 rounded-full border border-staff-border pr-4">
          {/* Lock 1 Cap Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-staff-text select-none group">
            <input
              type="checkbox"
              checked={lock1CapEnabled}
              onChange={toggleLock1}
              className="rounded bg-[#07110E] border-staff-border text-staff-brass focus:ring-staff-brass w-3.5 h-3.5 cursor-pointer"
            />
            <span className="font-digits text-[10.5px] font-semibold group-hover:text-staff-brass transition-colors">
              Lock 1 (Cap) <strong className={lock1CapEnabled ? 'text-staff-ok' : 'text-staff-danger'}>{lock1CapEnabled ? 'ON' : 'OFF'}</strong>
            </span>
          </label>

          <span className="text-staff-border">|</span>

          {/* Lock 4 Breaker Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-staff-text select-none group">
            <input
              type="checkbox"
              checked={lock4BreakerEnabled}
              onChange={toggleLock4}
              className="rounded bg-[#07110E] border-staff-border text-staff-brass focus:ring-staff-brass w-3.5 h-3.5 cursor-pointer"
            />
            <span className="font-digits text-[10.5px] font-semibold group-hover:text-staff-brass transition-colors">
              Lock 4 (Breaker) <strong className={lock4BreakerEnabled ? 'text-staff-ok' : 'text-staff-danger'}>{lock4BreakerEnabled ? 'ON' : 'OFF'}</strong>
            </span>
          </label>
        </div>
      </div>
    </footer>
  );
};

interface InteractiveTabProps {
  children: React.ReactNode;
  onClick: () => void;
  setCursorPosition: React.Dispatch<React.SetStateAction<CursorPosition>>;
  disabled?: boolean;
  title?: string;
}

const InteractiveTab: React.FC<InteractiveTabProps> = ({
  children,
  onClick,
  setCursorPosition,
  disabled = false,
  title,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      title={title}
      onMouseEnter={() => {
        if (!ref.current || disabled) return;
        const { width } = ref.current.getBoundingClientRect();
        setCursorPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className={`group relative z-10 block cursor-pointer px-3 py-1.5 text-[11px] font-digits font-bold rounded-full transition-colors duration-150 min-h-[38px] flex items-center select-none ${
        disabled
          ? 'opacity-35 cursor-not-allowed text-staff-muted'
          : 'text-staff-text hover:text-cust-ink'
      }`}
    >
      {children}
    </li>
  );
};
