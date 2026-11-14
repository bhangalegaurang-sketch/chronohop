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

  const [activeTab, setActiveTab] = useState<'telemetry' | 'specs' | 'observations'>('telemetry');

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
            {trip.era} · Field Telemetry
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
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-1 rounded-full text-center transition-all ${
              activeTab === 'telemetry'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] font-bold shadow-[1px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white'
            }`}
          >
            1. TELEMETRY
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
        {/* TAB 1: TELEMETRY (Chalkboard Telemetry Sheet) */}
        {activeTab === 'telemetry' && (
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

            {/* Hand-Drawn Telemetry Wireframe Table with Thin White Outlines */}
            <div className="sketch-card rounded-[24px] p-4 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15 text-xs font-sketch">
                <span className="text-[#E6E6E6]/60">Designation</span>
                <span className="font-bold text-[#FFFFFF]">{trip.telemetry.adjectives}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15 text-xs font-sketch">
                <span className="text-[#E6E6E6]/60">Distance</span>
                <span className="font-mono text-[#FF8C42] font-bold">{trip.telemetry.distance}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15 text-xs font-sketch">
                <span className="text-[#E6E6E6]/60">Eccentricity</span>
                <span className="font-mono text-[#E6E6E6]">{trip.telemetry.eccentricity}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15 text-xs font-sketch">
                <span className="text-[#E6E6E6]/60">Timeline Inclination</span>
                <span className="font-mono text-[#E6E6E6]">{trip.telemetry.inclination}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15 text-xs font-sketch">
                <span className="text-[#E6E6E6]/60">Chrono-Coordinates</span>
                <span className="font-mono text-[#88D49E] font-bold">{trip.telemetry.coordinates}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-sketch">
                <span className="text-[#E6E6E6]/60">Atmosphere</span>
                <span className="text-[#E6E6E6] font-bold">{trip.telemetry.atmosphere}</span>
              </div>
            </div>

            {/* Floating pointer annotation (Design Guide Section 5) */}
            <div className="sketch-dashed rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-[#FF8C42] rotate-1">
                ↷ Next: Select pod slot &amp; view pricing
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

        {/* TAB 2: SPECS & BOOKING (Pricing Gate, Axial Tilt, Slots) */}
        {activeTab === 'specs' && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight">
                Departure Specifications
              </h2>
            </div>

            {/* Axial Tilt Hand-Drawn Curved Visual (Design Guide Section 4) */}
            <div className="sketch-card rounded-[24px] p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#E6E6E6]/60 font-sketch block">Axial Precession</span>
                <span className="text-sm font-bold font-sketch text-[#FFFFFF] block mt-0.5">{trip.telemetry.axialTilt}</span>
                <span className="text-[11px] text-[#88D49E] font-mono block mt-1">✓ Escape vel: {trip.telemetry.escapeVelocity}</span>
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

              {/* Flagship Price Gate Seat Bar */}
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
            </div>

            {/* Departure Slot Selector */}
            <div className="sketch-card rounded-[24px] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-sketch text-[#FFFFFF] flex items-center gap-1.5">
                  <Clock size={13} className="text-[#FF8C42]" />
                  Departure Slots (Saturday)
                </span>
                <span className="text-[11px] text-[#88D49E] font-sketch">Single Pod Mk IV</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
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
                <span>Safety Rules</span>
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
                Related Historical Nodes &amp; Instruments
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

            {/* Supplementary notes grouped in dashed bounding box (Design Guide Section 5) */}
            <div className="sketch-dashed rounded-[24px] p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#88D49E]">
                <span className="font-bold font-sketch">✓ Certified Return Beacon Guarantee</span>
                <span className="font-mono text-[11px]">$100k Coverage</span>
              </div>
              <p className="text-[#E6E6E6]/70 font-chalk">
                All expeditions are secured by ChronoHop's 4-Locks Fair Price Gate, dual return beacons, and licensed chrononavigators. Full refund if departure window shifts by more than 15 minutes.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-1">
              <button
                onClick={() => setActiveTab('specs')}
                className="sketch-btn-orange w-full py-3.5 text-xs rounded-full"
              >
                PROCEED TO POD RESERVATION →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
