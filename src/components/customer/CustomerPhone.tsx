import React from 'react';
import { useStore } from '../../store/useStore';
import { ExploreScreen } from './ExploreScreen';
import { TripScreen } from './TripScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { ConfirmationScreen } from './ConfirmationScreen';
import { WaitlistScreen } from './WaitlistScreen';
import { SearchScreen } from './SearchScreen';
import { ProfileScreen } from './ProfileScreen';
import { CustomerNavBar } from './CustomerNavBar';
import { FairPricePolicySheet } from './FairPricePolicySheet';
import { PhoneTimeTravelBackground } from './PhoneTimeTravelBackground';

export const CustomerPhone: React.FC = () => {
  const {
    customerScreen,
    showFairPriceSheet,
    setShowFairPriceSheet,
    liveSale
  } = useStore();

  const isTabScreen = ['explore', 'search', 'profile'].includes(customerScreen);

  return (
    <div className="flex flex-col items-center">
      {/* Hand-drawn Floating Annotation above Phone (Design Guide Section 5) */}
      <div className="mb-2 flex items-center justify-between w-[390px] px-2 text-xs font-sketch text-[#E6E6E6]/70">
        <span className="flex items-center gap-1.5 text-[13px] text-[#FF8C42]">
          ✎ wireframe prototype (390×844)
        </span>
        <span className="text-[12px] text-[#88D49E] flex items-center gap-1">
          ✓ digital chalkboard aesthetic
        </span>
      </div>

      {/* 390x844 Minimal Hand-Drawn Wireframe Phone with Thin White Outline (Design Guide Section 4) */}
      <div 
        className="w-[390px] h-[844px] bg-[#1A1A1A] border-2 border-[#E6E6E6]/70 rounded-[44px] shadow-[6px_8px_0px_rgba(230,230,230,0.08)] flex flex-col relative overflow-hidden flex-shrink-0 select-none"
      >
        {/* Digital Chalkboard Time Travel Canvas INSIDE Phone */}
        <PhoneTimeTravelBackground />

        {/* Minimal Hand-Drawn Dynamic Island Wireframe */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#141414] border border-[#E6E6E6]/30 rounded-full z-50 flex items-center justify-end px-2.5 shadow-xs">
          <div className="w-2 h-2 rounded-full bg-[#E6E6E6]/40" />
        </div>

        {/* Chalk-White Status Bar */}
        <div className="relative z-40 pt-3 px-7 pb-1 flex items-center justify-between text-[11px] font-chalk text-[#E6E6E6] bg-transparent select-none">
          <span className="font-sketch font-bold text-[12px] tracking-wide">9:41</span>
          <div className="flex items-center gap-1.5 text-[#E6E6E6]">
            {/* Minimal Sketchy Cellular Bars */}
            <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
              <rect x="4" y="6" width="2.5" height="6" rx="0.5" />
              <rect x="8" y="3" width="2.5" height="9" rx="0.5" />
              <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
            </svg>
            {/* Wi-Fi */}
            <svg className="w-3.5 h-3" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4.2-3a5.9 5.9 0 0 1 8.4 0 .8.8 0 0 0 1.1-1.1 7.5 7.5 0 0 0-10.6 0 .8.8 0 0 0 1.1 1.1zm-2.8-2.8a9.9 9.9 0 0 1 14 0 .8.8 0 0 0 1.1-1.1 11.5 11.5 0 0 0-16.2 0 .8.8 0 0 0 1.1 1.1z" />
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 border border-[#E6E6E6] rounded-xs p-[1px] flex items-center">
              <div className="h-full w-full bg-[#E6E6E6] rounded-xs" />
            </div>
          </div>
        </div>

        {/* Paused Calibration Banner (With Diagonal Scribbles / Hatching as per Design Guide) */}
        {liveSale.isPaused && (
          <div className="hatch-orange bg-[#1A1A1A] text-[#FF8C42] border-y border-[#FF8C42]/50 text-[11px] font-sketch font-bold py-1 px-4 text-center z-30 shadow-xs flex items-center justify-center gap-1.5">
            <span>⚠ PAUSED FOR TEMPORAL RE-CALIBRATION ⚠</span>
          </div>
        )}

        {/* Active Customer Screen */}
        <main className="relative z-10 flex-1 overflow-hidden flex flex-col text-[#E6E6E6]">
          {customerScreen === 'explore' && <ExploreScreen />}
          {customerScreen === 'search' && <SearchScreen />}
          {customerScreen === 'profile' && <ProfileScreen />}
          {customerScreen === 'trip' && <TripScreen />}
          {customerScreen === 'checkout' && <CheckoutScreen />}
          {customerScreen === 'confirmation' && <ConfirmationScreen />}
          {customerScreen === 'waitlist' && <WaitlistScreen />}

          {/* Floating Mobile Bottom Navigation Dock */}
          {isTabScreen && <CustomerNavBar />}

          {/* Fair Price Policy Bottom Sheet */}
          <FairPricePolicySheet
            isOpen={showFairPriceSheet}
            onClose={() => setShowFairPriceSheet(false)}
          />
        </main>

        {/* Hand-Drawn iOS Home Indicator Bar */}
        <div className="relative z-20 w-full h-4 flex items-center justify-center bg-transparent flex-shrink-0">
          <div className="w-32 h-1 bg-[#E6E6E6]/40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
