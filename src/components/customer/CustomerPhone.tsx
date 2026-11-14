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
    liveSale,
    triggerRush,
    resetAll
  } = useStore();

  const isTabScreen = ['explore', 'search', 'profile'].includes(customerScreen);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Phone container: full screen on mobile (<500px), framed 390x844 on desktop */}
      <div 
        className="w-full max-w-[500px] h-[100dvh] sm:w-[390px] sm:h-[844px] bg-[#1A1A1A] border-0 sm:border-2 border-[#E6E6E6]/70 sm:rounded-[44px] sm:shadow-[6px_8px_0px_rgba(230,230,230,0.08)] flex flex-col relative overflow-hidden flex-shrink-0 select-none"
      >
        {/* Digital Chalkboard Time Travel Canvas INSIDE Phone */}
        <PhoneTimeTravelBackground />

        {/* Minimal Hand-Drawn Dynamic Island Wireframe */}
        <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#141414] border border-[#E6E6E6]/30 rounded-full z-50 items-center justify-end px-2.5 shadow-xs">
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

        {/* Priority 5.2: Paused Breaker Banner */}
        {liveSale.isPaused && (
          <div className="hatch-orange bg-[#1A1A1A] text-[#FF8C42] border-y border-[#FF8C42]/50 text-[11px] font-sketch font-bold py-1.5 px-3 text-center z-30 shadow-xs flex items-center justify-center gap-1.5 leading-snug">
            <span>Bookings for this trip are paused for a few minutes while we check something. Your place is saved. Nothing has been charged.</span>
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

      {/* Priority 5.2: Unobtrusive Demo control outside phone */}
      <div className="mt-2.5 flex items-center gap-2 text-xs font-sketch z-20">
        <button
          onClick={triggerRush}
          className="sketch-btn px-3.5 py-1.5 rounded-full border border-[#FF8C42]/60 text-[#FF8C42] hover:bg-[#FF8C42]/10 transition-colors flex items-center gap-1.5"
        >
          <span>⚡ Simulate a deal-site rush</span>
        </button>
        <button
          onClick={resetAll}
          className="sketch-btn px-3 py-1.5 rounded-full border border-[#E6E6E6]/40 text-[#E6E6E6]/80 hover:text-white hover:bg-white/5 transition-colors"
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
};
