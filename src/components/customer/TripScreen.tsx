import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TRIPS_CATALOG } from '../../config/tripsData';
import { SeatTickBar } from './SeatTickBar';
import { formatMoney } from '../../utils/formatters';
import { 
  X, 
  ExternalLink, 
  Clock
} from 'lucide-react';

const TIME_SLOTS = ['06:00', '06:30', '07:00', '07:30'];

export const TripScreen: React.FC = () => {
  const {
    selectedTripId,
    liveSale,
    lock1CapEnabled,
    selectedSlot,
    setSelectedSlot,
    setCustomerScreen,
    setShowFairPriceSheet
  } = useStore();

  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'observations'>('details');

  const trip = TRIPS_CATALOG[selectedTripId] || TRIPS_CATALOG.dino;
  const isFlagship = trip.isFlagship;

  const isSaleActive = isFlagship && liveSale.isActive && !liveSale.isEnded && (!lock1CapEnabled || liveSale.soldCount < liveSale.cap);
  const remainingSeats = isFlagship ? Math.max(0, liveSale.cap - liveSale.soldCount) : 0;
  const currentPrice = isSaleActive ? liveSale.price : trip.basePrice;
  const isPaused = isFlagship && liveSale.isPaused;
  const seatsGone = isFlagship && !isSaleActive && !isPaused;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-[#E6E6E6] font-sketch overflow-hidden select-none relative z-10">
      {/* Background with subtle chalkboard texture and faint photo overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 opacity-25 pointer-events-none"
        style={{ backgroundImage: `url(${trip.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/90 via-[#1A1A1A]/95 to-[#1A1A1A]" />
      </div>

      {/* Top Header: Chalk Wireframe with Close (X) */}
      <div className="relative z-30 pt-3 px-5 pb-2 flex items-center justify-between border-b border-[#E6E6E6]/15">
        <div className="flex items-center gap-1.5">
          <span className="text-[#FF8C42] text-lg">✳</span>
          <span className="font-sketch font-bold text-xs uppercase tracking-wider text-[#E6E6E6]">
            {trip.era} · Trip Details
          </span>
        </div>

        {/* Minimal sketchy close button */}
        <button
          onClick={() => setCustomerScreen('explore')}
          className="w-7 h-7 rounded-full border border-[#E6E6E6]/40 text-[#E6E6E6] flex items-center justify-center hover:bg-[#E6E6E6]/10 active:scale-95 transition-all text-xs font-sketch"
          aria-label="Back to explore"
        >
          <X size={15} />
        </button>
      </div>

      {/* Breadcrumb / Navigation System (Design Guide Section 5) */}
      <div className="relative z-30 px-5 pt-2 pb-2">
        <div className="flex items-center justify-between bg-[#222222] border border-[#E6E6E6]/30 p-1 rounded-full text-xs font-sketch">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-1 rounded-full text-center transition-all ${
              activeTab === 'details'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] font-bold shadow-[1px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white'
            }`}
          >
            1. DETAILS
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-1 rounded-full text-center transition-all ${
              activeTab === 'specs'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] font-bold shadow-[1px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white'
            }`}
          >
            2. SPECS &amp; BOOK
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`flex-1 py-1 rounded-full text-center transition-all ${
              activeTab === 'observations'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] font-bold shadow-[1px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white'
            }`}
          >
            3. FIELD NOTES
          </button>
        </div>
      </div>

      {/* Main Tab Content Body (Scrollable) */}
      <div className="relative z-20 flex-1 visible-scrollbar-y px-5 pb-28 space-y-4">
        {/* TAB 1: TRIP DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            {/* Bold Handwritten Headline */}
            <div>
              <h1 className="text-2xl font-marker font-bold leading-tight text-[#FFFFFF] tracking-tight">
                {trip.heroHeadline}
              </h1>
              <p className="text-xs text-[#E6E6E6]/80 font-chalk mt-1 leading-relaxed">
                {trip.subtitle}
              </p>
            </div>

            {/* Hand-Drawn Trip Details Table with Thin White Outlines */}
            <div className="sketch-card rounded-[24px] p-4 space-y-2.5">
              {[
                ['Era', trip.details.period],
                ['How far back', trip.details.howFarBack],
                ['Trip length', trip.details.tripLength],
                ["What you'll see", trip.details.whatYoullSee],
                ['Weather', trip.details.climate],
              ].map(([label, value], idx, rows) => (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-3 text-xs font-sketch ${idx < rows.length - 1 ? 'pb-2 border-b border-[#E6E6E6]/15' : ''}`}
                >
                  <span className="text-[#E6E6E6]/60 flex-shrink-0">{label}</span>
                  <span className={`text-right ${idx === 1 ? 'font-mono text-[#FF8C42] font-bold' : 'font-bold text-[#FFFFFF]'}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Floating pointer annotation (Design Guide Section 5) */}
            <div className="sketch-dashed rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-[#FF8C42] rotate-1">
                ↷ Next: Pick a time slot &amp; see the price
              </span>
              <button
                onClick={() => setActiveTab('specs')}
                className="sketch-btn-orange text-xs px-4 py-1.5 rounded-full"
              >
                PROCEED TO BOOKING →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SPECS & BOOKING (Pricing Gate, Trip Length, Slots) */}
        {activeTab === 'specs' && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight">
                Departure Specifications
              </h2>
            </div>

            {/* Trip Length Hand-Drawn Curved Visual (Design Guide Section 4) */}
            <div className="sketch-card rounded-[24px] p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#E6E6E6]/60 font-sketch block">Trip Length</span>
                <span className="text-sm font-bold font-sketch text-[#FFFFFF] block mt-0.5">{trip.details.tripLength}</span>
                <span className="text-[11px] text-[#88D49E] font-mono block mt-1">✓ {trip.details.pace}</span>
              </div>

              {/* Hand-drawn sketchy concentric loops */}
              <div className="w-14 h-14 relative flex items-center justify-center flex-shrink-0">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#E6E6E6]/40 absolute" />
                <div className="w-9 h-9 rounded-full border-2 border-[#FF8C42]/60 absolute" />
                <div className="w-4 h-4 rounded-full bg-[#88D49E] shadow-xs" />
              </div>
            </div>

            {/* Pricing Section (Emphasizing key data points with Sized Up Orange #FF8C42) */}
            <div className="sketch-card rounded-[24px] p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#E6E6E6]/60 font-sketch block">
                    Expedition Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    {/* Sized-up number in orange accent color (#FF8C42) */}
                    <span className="text-3xl font-black font-sketch text-[#FF8C42] tracking-tight">
                      {formatMoney(currentPrice)}
                    </span>
                    {isSaleActive && (
                      <span className="text-xs text-[#E6E6E6]/50 line-through font-mono">
                        $2,000
                      </span>
                    )}
                  </div>
                </div>

                {isSaleActive && (
                  <span className="hatch-orange text-[#FF8C42] border border-[#FF8C42]/50 text-xs font-bold font-sketch px-3 py-1 rounded-full shadow-xs">
                    {liveSale.discountPct}% OFF PROMO
                  </span>
                )}
              </div>

              {/* Flagship Promotional Seat Bar */}
              {isFlagship && !isPaused && !seatsGone && (
                <div className="mt-3 pt-3 border-t border-[#E6E6E6]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#E6E6E6]/80 font-sketch">
                    <span>
                      <strong className="text-[#FF8C42]">{remainingSeats} of {liveSale.cap}</strong> sale seats remaining
                    </span>
                    <span className="text-[11px] font-mono text-[#88D49E]">
                      {Math.round((remainingSeats / liveSale.cap) * 100)}% left
                    </span>
                  </div>
                  <SeatTickBar total={liveSale.cap} remaining={remainingSeats} />
                </div>
              )}

              {/* Priority 5.1: Sale seats gone screen */}
              {isFlagship && seatsGone && (
                <div className="mt-3 pt-3 border-t border-[#E6E6E6]/20 flex items-center justify-between gap-2">
                  <span className="text-xs font-sketch text-[#FF8C42]">
                    Sale seats gone: back to $2,000
                  </span>
                  <button
                    onClick={() => setCustomerScreen('waitlist')}
                    className="sketch-btn px-3 py-1.5 rounded-full text-xs font-sketch border border-[#88D49E] text-[#88D49E] hover:bg-[#88D49E]/10 flex-shrink-0"
                  >
                    Join the next sale
                  </button>
                </div>
              )}
            </div>

            {/* Departure Slot Selector */}
            <div className="sketch-card rounded-[24px] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-sketch text-[#FFFFFF] flex items-center gap-1.5">
                  <Clock size={13} className="text-[#FF8C42]" />
                  Departure Slots (Saturday)
                </span>
                <span className="text-[11px] text-[#88D49E] font-sketch">One traveller per slot</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isTaken = slot === '06:30';
                  const isSelected = selectedSlot === slot && !isTaken;
                  if (isTaken) {
                    return (
                      <button
                        key={slot}
                        disabled
                        className="py-1 px-1 text-center rounded-xl border border-dashed border-[#E6E6E6]/20 bg-[#151515] text-[#E6E6E6]/30 text-xs font-mono min-h-[42px] cursor-not-allowed flex flex-col items-center justify-center"
                      >
                        <span className="line-through text-[11px]">{slot}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[#FF8C42]/70 font-sketch">Taken</span>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={slot}
                      disabled={isPaused}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-mono font-bold transition-all min-h-[42px] ${
                        isSelected
                          ? 'bg-[#FF8C42] text-[#1A1A1A] border-[#E6E6E6] shadow-[2px_2px_0px_#E6E6E6] font-black'
                          : 'bg-[#1A1A1A] text-[#E6E6E6] border-[#E6E6E6]/30 hover:border-[#FF8C42]'
                      } ${isPaused ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Orange "BOOK" Button (Design Guide Section 2 & 3) */}
            <div className="pt-2">
              <button
                onClick={() => setCustomerScreen('checkout')}
                className="sketch-btn-orange w-full py-3.5 px-4 text-base rounded-full flex items-center justify-center gap-2"
              >
                <span>BOOK · {selectedSlot}</span>
                <span className="text-xs font-mono opacity-90">({formatMoney(currentPrice)})</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: OBSERVATIONS & FIELD NOTES */}
        {activeTab === 'observations' && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#88D49E] uppercase tracking-wider block">
                  Field Guide Archive
                </span>
                <h3 className="text-xl font-marker font-bold text-[#FFFFFF] mt-0.5">
                  Temporal Field Notes
                </h3>
              </div>
              <button 
                onClick={() => setShowFairPriceSheet(true)}
                className="text-xs font-sketch text-[#FF8C42] hover:underline flex items-center gap-1"
              >
                <span>Fair price policy</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* Field Notes Handwritten Paragraph */}
            <div className="sketch-card rounded-[24px] p-4 text-xs text-[#E6E6E6]/90 font-chalk leading-relaxed">
              <p>{trip.observations}</p>
            </div>

            {/* "See also" Tag Cloud with Minimalist Sketchy Boxes */}
            <div className="sketch-card rounded-[24px] p-4 space-y-2">
              <span className="text-xs font-sketch text-[#E6E6E6]/70 block">
                Related Topics
              </span>
              <div className="flex flex-wrap gap-2">
                {trip.seeAlso.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-sketch text-[#E6E6E6] bg-[#1A1A1A] border border-[#E6E6E6]/40 px-3 py-1 rounded-full cursor-pointer hover:border-[#FF8C42] hover:text-[#FF8C42] transition-colors"
                  >
                    ✎ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Supplementary notes grouped in dashed bounding box */}
            <div className="sketch-dashed rounded-[24px] p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#88D49E]">
                <span className="font-bold font-sketch">✓ Trained guide on every trip</span>
                <span className="font-mono text-[11px] text-[#88D49E]">Included</span>
              </div>
              <p className="text-[#E6E6E6]/70 font-chalk">
                Every trip has a trained guide and a set departure and return time.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-1">
              <button
                onClick={() => setActiveTab('specs')}
                className="sketch-btn-orange w-full py-3.5 text-xs rounded-full"
              >
                PROCEED TO BOOKING →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
