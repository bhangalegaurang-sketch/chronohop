import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TRIPS_CATALOG } from '../../config/tripsData';
import { formatMoney, formatTimeCountdown } from '../../utils/formatters';

export const CheckoutScreen: React.FC = () => {
  const {
    selectedTripId,
    selectedSlot,
    checkoutHoldSeconds,
    checkoutPriceAtHold,
    liveSale,
    lock1CapEnabled,
    bookSeat,
    setCustomerScreen,
    setShowFairPriceSheet
  } = useStore();

  const [paymentConsentGiven, setPaymentConsentGiven] = useState(false);

  const trip = TRIPS_CATALOG[selectedTripId] || TRIPS_CATALOG.dino;
  const isFlagship = trip.isFlagship;

  const isSaleStillActive = isFlagship && liveSale.isActive && !liveSale.isEnded && (!lock1CapEnabled || liveSale.soldCount < liveSale.cap);
  const currentLivePrice = isSaleStillActive ? liveSale.price : trip.basePrice;

  const isHeldTimeActive = checkoutHoldSeconds > 0;
  const priceToPay = isHeldTimeActive ? checkoutPriceAtHold : currentLivePrice;
  const isPriceDifferent = currentLivePrice !== checkoutPriceAtHold;

  const handlePay = () => {
    const success = bookSeat(1);
    if (success) {
      setCustomerScreen('confirmation');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] p-4 visible-scrollbar-y justify-between space-y-4 text-[#E6E6E6] font-sketch select-none">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="font-marker font-bold text-2xl text-[#FFFFFF] tracking-tight">
            Review and Pay
          </h1>
          <button
            onClick={() => setCustomerScreen('trip')}
            className="text-xs text-[#FF8C42] hover:underline font-sketch"
          >
            ← Cancel
          </button>
        </div>

        {/* Boarding Pass Wireframe Ticket (Design Guide Style) */}
        <div className="sketch-card rounded-[24px] p-4 relative overflow-hidden bg-[#222222]">
          {/* Header held countdown */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]/20">
            <div>
              <span className="text-[10px] font-mono text-[#88D49E] uppercase tracking-wider block">
                Pod Slot Held
              </span>
              <span className="text-xs text-[#E6E6E6]/70">8-min reservation window</span>
            </div>
            <span className="font-mono text-sm font-bold text-[#FF8C42] bg-[#1A1A1A] border border-[#FF8C42]/50 px-2.5 py-0.5 rounded-full">
              {formatTimeCountdown(checkoutHoldSeconds)}
            </span>
          </div>

          {/* Dashed Perforation Line (Design Guide Section 5) */}
          <div className="w-full border-b-2 border-dashed border-[#E6E6E6]/30 my-3" />

          {/* Ticket Body */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#88D49E] uppercase">{trip.era}</span>
            <h2 className="font-marker font-bold text-xl text-[#FFFFFF] leading-tight">
              {trip.title}
            </h2>
            <p className="text-xs text-[#E6E6E6]/70 font-chalk">
              Single passenger pod · Saturday {selectedSlot}
            </p>
          </div>

          {/* Sized-up Price Highlight in Orange #FF8C42 (Design Guide Section 3) */}
          <div className="mt-4 pt-3 border-t border-[#E6E6E6]/20 flex items-baseline justify-between">
            <span className="text-xs text-[#E6E6E6]/60">Total Fare:</span>
            <div className="flex items-baseline gap-2">
              {priceToPay < trip.basePrice && (
                <span className="text-xs text-[#E6E6E6]/40 line-through font-mono">
                  {formatMoney(trip.basePrice)}
                </span>
              )}
              <span className="text-3xl font-black font-sketch text-[#FF8C42] tracking-tight">
                {formatMoney(priceToPay)}*
              </span>
            </div>
          </div>
        </div>

        {/* Sage Green Verification Shield Card (Design Guide Section 2 & 5) */}
        <div className="sketch-card rounded-[24px] p-3.5 border-[#88D49E]/40 bg-[#1D2621]">
          <div className="flex items-center justify-between text-xs text-[#88D49E] font-bold">
            <span>✓ 4-Locks Price Gate Verified</span>
            <button
              onClick={() => setShowFairPriceSheet(true)}
              className="text-xs underline text-[#E6E6E6] hover:text-[#FF8C42]"
            >
              Policy details
            </button>
          </div>
          <p className="text-[11px] text-[#E6E6E6]/80 font-chalk mt-1 leading-relaxed">
            The price you see is strictly guaranteed by the Four-Locks architecture. Zero hidden fees.
          </p>
        </div>

        {/* Mismatch Alert if Hold Expired */}
        {!isHeldTimeActive && isPriceDifferent && (
          <div className="sketch-dashed rounded-[20px] p-3 space-y-2 text-xs bg-[#241714] border-[#FF8C42]">
            <p className="font-bold text-[#FF8C42]">⚠ Hold expired: price updated to catalog standard</p>
            <p className="text-[#E6E6E6]/70">
              The 8-minute reservation window has ended. Current approved price is {formatMoney(currentLivePrice)}.
            </p>
            <label className="flex items-center gap-2 pt-1 font-sketch cursor-pointer">
              <input
                type="checkbox"
                checked={paymentConsentGiven}
                onChange={(e) => setPaymentConsentGiven(e.target.checked)}
                className="rounded accent-[#FF8C42]"
              />
              <span>I consent to proceed at {formatMoney(currentLivePrice)}</span>
            </label>
          </div>
        )}
      </div>

      {/* Pay CTA Button (Muted Orange #FF8C42) */}
      <div className="pt-2">
        <button
          onClick={handlePay}
          disabled={!isHeldTimeActive && isPriceDifferent && !paymentConsentGiven}
          className={`sketch-btn-orange w-full py-3.5 text-base rounded-full flex items-center justify-center gap-2 ${
            !isHeldTimeActive && isPriceDifferent && !paymentConsentGiven
              ? 'opacity-40 cursor-not-allowed'
              : ''
          }`}
        >
          <span>CONFIRM &amp; PAY {formatMoney(priceToPay)}</span>
        </button>
      </div>
    </div>
  );
};
