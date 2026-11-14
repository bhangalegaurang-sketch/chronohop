import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, ROLE_LABELS } from '../../store/useStore';
import { UserCheck, Zap, Play, User, RotateCcw, Lock } from 'lucide-react';

interface CursorPosition {
  left: number;
  top: number;
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
    top: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <footer className="sm:sticky bottom-3 z-40 px-0 sm:px-4 py-2 w-full flex justify-center pointer-events-none select-none font-sketch">
      {/* Floating Bottom Chin Island Bar: wraps onto extra rows instead of clipping */}
      <div className="pointer-events-auto max-w-6xl w-full bg-[#181818]/95 backdrop-blur-md border border-[#E6E6E6]/30 rounded-2xl px-4 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#E6E6E6]">
        {/* Left: Section Brand / Status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-sketch font-bold uppercase tracking-wider text-[#FF8C42] flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span>✳</span>
            <span>SIMULATOR</span>
          </span>
          {isRushActive && (
            <span className="bg-red-500 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full animate-pulse shadow-xs">
              RUSH ACTIVE
            </span>
          )}
        </div>

        {/* Center: Magnetic Sliding Cursor Floating Tab Group */}
        <ul
          className="relative flex flex-wrap items-center justify-center gap-1 py-1"
          onMouseLeave={() => setCursorPosition((prev) => ({ ...prev, opacity: 0 }))}
        >
          {/* Animated Magnetic Cursor */}
          <motion.li
            animate={{
              left: cursorPosition.left,
              top: cursorPosition.top,
              width: cursorPosition.width,
              opacity: cursorPosition.opacity,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="absolute z-0 h-8 rounded-full bg-[#FF8C42]/20 border border-[#FF8C42]/50 shadow-xs pointer-events-none"
          />

          {/* Tab 1: One customer books */}
          <InteractiveTab
            disabled={liveSale.isPaused}
            setCursorPosition={setCursorPosition}
            onClick={() => bookSeat(1)}
            title="Simulate 1 customer completing purchase"
          >
            <span className="flex items-center gap-1.5 text-[#E6E6E6] hover:text-[#FFFFFF] whitespace-nowrap">
              <UserCheck size={14} className="text-[#88D49E]" />
              Simulate Booking
            </span>
          </InteractiveTab>

          {/* Tab 2: Deal-site rush */}
          <InteractiveTab
            disabled={liveSale.isPaused || isRushActive}
            setCursorPosition={setCursorPosition}
            onClick={triggerRush}
            title="Simulate rapid booking surge from deal aggregator"
          >
            <span className="flex items-center gap-1.5 text-[#E6E6E6] hover:text-[#FFFFFF] whitespace-nowrap">
              <Zap size={14} className="text-[#FF8C42]" />
              Deal-site Rush
            </span>
          </InteractiveTab>

          {/* Tab 3: Test-only shortcut that skips locks 1-2 */}
          <InteractiveTab
            setCursorPosition={setCursorPosition}
            onClick={forceLiveDemo}
            title="Prototype testing only: puts the current discount live without locks 1 and 2"
            testOnly
          >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Play size={14} />
              Test only: skip locks 1–2
            </span>
          </InteractiveTab>

          {/* Tab 4: Switch role */}
          <InteractiveTab
            setCursorPosition={setCursorPosition}
            onClick={() => switchRole()}
            title="Switch operator role (Analyst / Approver)"
          >
            <span className="flex items-center gap-1.5 text-[#88D49E] hover:text-white whitespace-nowrap">
              <User size={14} />
              Role: {ROLE_LABELS[currentRole]}
            </span>
          </InteractiveTab>

          {/* Tab 5: Reset */}
          <InteractiveTab
            setCursorPosition={setCursorPosition}
            onClick={resetAll}
            title="Reset system to clean prototype state"
          >
            <span className="flex items-center gap-1.5 text-red-300 hover:text-white whitespace-nowrap">
              <RotateCcw size={14} />
              Reset State
            </span>
          </InteractiveTab>
        </ul>

        {/* Right: Lock Armed Toggles */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleLock1}
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors flex items-center gap-1 whitespace-nowrap ${
              lock1CapEnabled
                ? 'bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/50'
                : 'bg-red-500/15 text-red-300 border-red-500/50'
            }`}
            title="Toggle Lock 3: Sale-Seat Cap enforcement"
          >
            <Lock size={11} />
            <span>Lock 3: {lock1CapEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={toggleLock4}
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors flex items-center gap-1 whitespace-nowrap ${
              lock4BreakerEnabled
                ? 'bg-[#88D49E]/15 text-[#88D49E] border-[#88D49E]/50'
                : 'bg-red-500/15 text-red-300 border-red-500/50'
            }`}
            title="Toggle Lock 4: Speed Breaker rate limiter"
          >
            <Lock size={11} />
            <span>Lock 4: {lock4BreakerEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

interface InteractiveTabProps {
  children: React.ReactNode;
  setCursorPosition: React.Dispatch<React.SetStateAction<CursorPosition>>;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  testOnly?: boolean;
}

const InteractiveTab: React.FC<InteractiveTabProps> = ({
  children,
  setCursorPosition,
  onClick,
  disabled = false,
  title,
  testOnly = false,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current || disabled) return;
        const { width } = ref.current.getBoundingClientRect();
        setCursorPosition({
          left: ref.current.offsetLeft,
          top: ref.current.offsetTop + (ref.current.offsetHeight - 32) / 2,
          width,
          opacity: 1,
        });
      }}
      className={`relative z-10 block cursor-pointer px-2.5 py-1.5 text-xs font-sketch transition-colors ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'
      } ${testOnly ? 'test-only-btn rounded-full' : ''}`}
    >
      <button
        disabled={disabled}
        onClick={onClick}
        title={title}
        className="flex items-center gap-1 focus:outline-none"
      >
        {children}
      </button>
    </li>
  );
};
