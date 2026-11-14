import React from 'react';
import { useStore } from '../../store/useStore';

export const WaitlistScreen: React.FC = () => {
  const { setCustomerScreen } = useStore();

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] p-6 text-center justify-center items-center space-y-5 text-[#E6E6E6] font-sketch select-none">
      <div className="w-18 h-18 rounded-full border-2 border-[#FF8C42] text-[#FF8C42] flex items-center justify-center text-2xl font-black bg-[#222222] shadow-[3px_4px_0px_#FF8C42]">
        ⌛
      </div>

      <div className="space-y-1">
        <h1 className="font-marker font-bold text-2xl text-[#FFFFFF] leading-tight">
          Priority Waitlist Reserved
        </h1>
        <p className="text-xs text-[#88D49E] font-chalk">
          Dinosaur Walk · Next Promotional Window
        </p>
      </div>

      <div className="sketch-dashed rounded-[24px] p-4 text-center text-xs space-y-2 w-full bg-[#202020]">
        <p className="text-[#E6E6E6]/80 font-chalk leading-relaxed">
          You are number 214 in line. We will notify you before the next capacity block unlocks.
        </p>
      </div>

      <button
        onClick={() => setCustomerScreen('explore')}
        className="sketch-btn-orange w-full py-3.5 text-sm rounded-full"
      >
        EXPLORE OTHER DESTINATIONS →
      </button>
    </div>
  );
};
