import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TRIPS_CATALOG } from '../../config/tripsData';
import { formatMoney, formatTimeCountdown } from '../../utils/formatters';
import { PRICING_RULES } from '../../config/pricingRules';

export const CheckoutScreen: React.FC = () => {
  const {
    selectedTripId,
    selectedSlot,
    checkoutHoldSeconds,
    checkoutPriceAtHold,
    setCheckoutPriceAtHold,
    customerSaleSeatsBooked,
    incrementCustomerSaleSeatsBooked,
    liveSale,
    lock1CapEnabled,
    bookSeat,
    setCustomerScreen,
    setShowFairPriceSheet
  } = useStore();

  const [paymentConsentGiven, setPaymentConsentGiven] = useState(false);
  const [soldOutNotice, setSoldOutNotice] = useState(false);
  const [pausedNotice, setPausedNotice] = useState(false);
  const [customerLimitNotice, setCustomerLimitNotice] = useState<string | null>(null);

  const trip = TRIPS_CATALOG[selectedTripId] || TRIPS_CATALOG.dino;
  const isFlagship = Boolean(trip.isFlagship);

  const isSaleStillActive = isFlagship && liveSale.isActive && !liveSale.isEnded && (!lock1CapEnabled || liveSale.soldCount < liveSale.cap);
  const currentLivePrice = isSaleStillActive ? liveSale.price : trip.basePrice;

  const isHeldTimeActive = checkoutHoldSeconds > 0;
  const priceToPay = isFlagship ? (isHeldTimeActive ? checkoutPriceAtHold : currentLivePrice) : trip.basePrice;
  const isPriceDifferent = isFlagship && currentLivePrice !== checkoutPriceAtHold;

  const handlePay = () => {
    // Clear any previous notices
    setCustomerLimitNotice(null);
    setPausedNotice(false);

    // Non-flagship trips or full price trips never consume sale seats
    const isPayingSalePrice = isFlagship && priceToPay < trip.basePrice;

    if (!isPayingSalePrice) {
      setCustomerScreen('confirmation');
      return;
    }

    // 1. Check per-customer limit (Priority 5.3)
    if (customerSaleSeatsBooked >= PRICING_RULES.MAX_SEATS_PER_CUSTOMER) {
      setCustomerLimitNotice('Sale seats are limited to 2 per customer.');
      return;
    }

    // 2. Check if listing is paused (Priority 4 & Lock 4)
    if (liveSale.isPaused) {
      setPausedNotice(true);
      return;
    }

    // 3. Priority 4: Checkout hold reserves the SLOT, not the sale price.
    // If cap reached or sale ended at payment time, do NOT sell at sale price!
    if (liveSale.soldCount >= liveSale.cap || liveSale.isEnded || !isSaleStillActive) {
      setSoldOutNotice(true);
      return;
    }

    // Book the sale seat
    const success = bookSeat(1);
    if (success) {
      incrementCustomerSaleSeatsBooked();
      setCustomerScreen('confirmation');
    }
  };

  const handleBookAtFullPrice = () => {
    setCheckoutPriceAtHold(trip.basePrice);
    setSoldOutNotice(false);
    setCustomerScreen('confirmation');
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] p-4 visible-scrollbar-y space-y-3.5 text-[#E6E6E6] font-sketch select-none">
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
              Time Slot Held
            </span>
            <span className="text-xs text-[#E6E6E6]/70">5-min reservation window</span>
          </div>
          <span className="font-mono text-sm font-bold text-[#FF8C42] bg-[#1A1A1A] border border-[#FF8C42]/50 px-2.5 py-0.5 rounded-full">
            {formatTimeCountdown(checkoutHoldSeconds)}
          </span>
        </div>

        {/* Dashed Perforation Line */}
        <div className="w-full border-b-2 border-dashed border-[#E6E6E6]/30 my-3" />

        {/* Ticket Body */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[#88D49E] uppercase">{trip.era}</span>
          <h2 className="font-marker font-bold text-xl text-[#FFFFFF] leading-tight">
            {trip.title}
          </h2>
          <p className="text-xs text-[#E6E6E6]/70 font-chalk">
            One traveller · Saturday {selectedSlot}
          </p>
        </div>

        {/* Sized-up Price Highlight */}
        <div className="mt-4 pt-3 border-t border-[#E6E6E6]/20 flex items-baseline justify-between">
          <span className="text-xs text-[#E6E6E6]/60">Total Fare:</span>
          <div className="flex items-baseline gap-2">
            {isFlagship && priceToPay < trip.basePrice && (
              <span className="text-xs text-[#E6E6E6]/40 line-through font-mono">
                {formatMoney(trip.basePrice)}
              </span>
            )}
            <span className="text-3xl font-black font-sketch text-[#FF8C42] tracking-tight">
              {formatMoney(priceToPay)}
            </span>
          </div>
        </div>
      </div>

      {/* Sage Green Verification Shield Card (Ground Rules: "Price checked", "The price you see is the price you pay") */}
      <div className="sketch-card rounded-[24px] p-3.5 border-[#88D49E]/40 bg-[#1D2621]">
        <div className="flex items-center justify-between text-xs text-[#88D49E] font-bold">
          <span>✓ Price checked</span>
          <button
            onClick={() => setShowFairPriceSheet(true)}
            className="text-xs underline text-[#E6E6E6] hover:text-[#FF8C42]"
          >
            Policy details
          </button>
        </div>
        <p className="text-[11px] text-[#E6E6E6]/80 font-chalk mt-1 leading-relaxed">
          The price you see is the price you pay. No hidden fees.
        </p>
      </div>

      {/* Priority 5.3: Per-customer limit alert */}
      {customerLimitNotice && (
        <div className="sketch-dashed rounded-[20px] p-3 space-y-1 text-xs bg-[#241714] border-[#FF8C42]">
          <p className="font-bold text-[#FF8C42]">⚠ Booking Limit Reached</p>
          <p className="text-[#E6E6E6]/80 font-chalk">{customerLimitNotice}</p>
        </div>
      )}

      {/* Priority 4: Sale seats sold out notice at payment time */}
      {soldOutNotice && (
        <div className="sketch-dashed rounded-[20px] p-3.5 space-y-2.5 text-xs bg-[#241714] border-[#FF8C42]">
          <p className="font-bold text-[#FF8C42]">
            The sale seats have just sold out. This trip is now $2,000. Nothing has been charged.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleBookAtFullPrice}
              className="sketch-btn-orange flex-1 py-2 rounded-xl text-xs font-sketch font-bold"
            >
              Book at $2,000
            </button>
            <button
              onClick={() => setCustomerScreen('waitlist')}
              className="sketch-btn flex-1 py-2 rounded-xl text-xs font-sketch border border-[#88D49E] text-[#88D49E] hover:bg-[#88D49E]/10"
            >
              Join the next sale
            </button>
          </div>
        </div>
      )}

      {/* Listing Paused Alert */}
      {pausedNotice && (
        <div className="sketch-dashed rounded-[20px] p-3 space-y-1 text-xs bg-[#241714] border-[#FF8C42]">
          <p className="font-bold text-[#FF8C42]">⚠ Bookings Temporarily Paused</p>
          <p className="text-[#E6E6E6]/80 font-chalk">
            Bookings for this trip are paused for a few minutes while we check something. Your place is saved. Nothing has been charged.
          </p>
        </div>
      )}

      {/* Mismatch Alert if Hold Expired */}
      {isFlagship && !isHeldTimeActive && isPriceDifferent && !soldOutNotice && (
        <div className="sketch-dashed rounded-[20px] p-3 space-y-2 text-xs bg-[#241714] border-[#FF8C42]">
          <p className="font-bold text-[#FF8C42]">⚠ Hold expired: price updated to catalog standard</p>
          <p className="text-[#E6E6E6]/70">
            The 5-minute reservation window has ended. Current approved price is {formatMoney(currentLivePrice)}.
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

      {/* Slot Hold Explanation Note */}
      <div className="sketch-card rounded-[20px] p-3 text-[11px] text-[#E6E6E6]/60 font-chalk space-y-1">
        <p>• Slot {selectedSlot} is reserved for 5 minutes while you review details.</p>
        <p>• Your card is charged only after you confirm and pay.</p>
      </div>

      {/* Pay CTA Button */}
      <div className="pt-1">
        <button
          onClick={handlePay}
          disabled={isFlagship && !isHeldTimeActive && isPriceDifferent && !paymentConsentGiven}
          className={`sketch-btn-orange w-full py-3.5 text-base rounded-full flex items-center justify-center gap-2 ${
            isFlagship && !isHeldTimeActive && isPriceDifferent && !paymentConsentGiven
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
