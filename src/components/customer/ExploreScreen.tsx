import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatMoney } from '../../utils/formatters';
import dinoImg from '../../assets/dino.jpg';
import londonImg from '../../assets/london.jpg';
import pyrImg from '../../assets/pyramids.jpg';
import marsImg from '../../assets/mars.jpg';

export const ExploreScreen: React.FC = () => {
  const { liveSale, lock1CapEnabled, setCustomerScreen, setSelectedTripId } = useStore();
  const [activeEraFilter, setActiveEraFilter] = useState('all');

  const isSaleActive = liveSale.isActive && !liveSale.isEnded && (!lock1CapEnabled || liveSale.soldCount < liveSale.cap);
  const remainingSeats = Math.max(0, liveSale.cap - liveSale.soldCount);
  const dinoPrice = isSaleActive ? liveSale.price : 2000;

  const eraFilters = [
    { id: 'all', label: 'All' },
    { id: 'prehistoric', label: 'Prehistoric' },
    { id: 'victorian', label: 'Victorian 1895' },
    { id: 'antiquity', label: 'Ancient Giza' },
    { id: 'mars', label: 'Mars 2154' },
  ];

  const handleOpenTrip = (tripId: string) => {
    setSelectedTripId(tripId);
    setCustomerScreen('trip');
  };

  return (
    <div className="h-full visible-scrollbar-y pb-28 text-[#E6E6E6] font-sketch select-none relative z-10 p-4 space-y-4">
      {/* 1. TOP BRAND LOGO (Clean Editorial Header) */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#E6E6E6]/15">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl text-[#FF8C42] font-black leading-none select-none">✳</span>
          <div className="flex flex-col">
            <span className="font-sketch font-black text-lg tracking-widest text-[#FFFFFF] uppercase block leading-none">
              CHRONOHOP
            </span>
            <span className="text-[10px] text-[#E6E6E6]/60 font-mono tracking-widest uppercase mt-0.5">
              TEMPORAL EXPEDITIONS
            </span>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL HERO (Travel Time Clean Typography) */}
      <div className="pt-2 pb-1 space-y-1.5">
        <h1 className="text-3xl font-marker font-bold leading-tight text-[#FFFFFF] tracking-tight">
          Travel <span className="text-[#FF8C42]">Time</span>
        </h1>
        <p className="text-xs text-[#E6E6E6]/85 font-chalk leading-relaxed">
          Curated departures across prehistoric and human history. Enclosed pressurized observation pods, licensed chrononavigators, and synchronized return beacons.
        </p>
      </div>

      {/* 3. ERA FILTER NODES (Horizontal Flow with VISIBLE SCROLLBAR) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#E6E6E6]/60">
            Select Historical Epoch
          </span>
          <span className="text-[10px] font-sketch text-[#FF8C42]">
            scroll sideways →
          </span>
        </div>
        <div className="flex items-center gap-2 visible-scrollbar-x pb-2 pt-1">
          {eraFilters.map((era) => (
            <button
              key={era.id}
              onClick={() => setActiveEraFilter(era.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sketch whitespace-nowrap transition-all ${
                activeEraFilter === era.id
                  ? 'bg-[#E6E6E6] text-[#1A1A1A] font-bold shadow-[2px_2px_0px_#FF8C42]'
                  : 'bg-[#222222] text-[#E6E6E6]/80 hover:text-white border border-[#E6E6E6]/30'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. DESTINATIONS WIREFRAME CARDS (Design Guide Color & Layout Rules) */}
      <div className="space-y-4">
        {/* CARD 1: Flagship Cretaceous / Dinosaur Walk */}
        {(activeEraFilter === 'all' || activeEraFilter === 'prehistoric') && (
          <div
            onClick={() => handleOpenTrip('dino')}
            className="sketch-card rounded-[28px] p-4 relative cursor-pointer group transition-all"
          >
            {/* Floating pointer annotation */}
            {isSaleActive && remainingSeats > 0 ? (
              <div className="absolute -top-2.5 right-6 bg-[#1A1A1A] border border-[#FF8C42] text-[#FF8C42] text-[11px] font-sketch px-2.5 py-0.5 rounded-full shadow-xs -rotate-2">
                ★ Flagship Promo · {remainingSeats} seats
              </div>
            ) : (
              <div className="absolute -top-2.5 right-4 bg-[#2A1E14] border border-[#FF8C42] text-[#FF8C42] text-[11px] font-sketch px-2.5 py-0.5 rounded-full shadow-xs">
                Sale seats gone: back to $2,000
              </div>
            )}

            <div className="flex items-start justify-between mt-1">
              <div>
                <h2 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight group-hover:text-[#FF8C42] transition-colors">
                  Dinosaur Walk
                </h2>
              </div>

              {/* Sized-Up Key Data Point in Muted Orange (#FF8C42) */}
              <div className="text-right">
                <span className="text-2xl font-bold font-sketch text-[#FF8C42] block leading-tight">
                  {formatMoney(dinoPrice)}
                </span>
                {isSaleActive && remainingSeats > 0 && (
                  <span className="text-[11px] text-[#E6E6E6]/50 line-through font-mono">
                    $2,000
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#E6E6E6]/80 font-chalk mt-1">
              Walk among living Tyrannosaurus and Triceratops herds on the Cretaceous savannah.
            </p>

            {/* Hand-Drawn Minimal Wireframe Image Container */}
            <div 
              className="h-40 rounded-2xl bg-cover bg-center mt-3 relative overflow-hidden border border-[#E6E6E6]/30"
              style={{ backgroundImage: `url(${dinoImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-sketch text-[#E6E6E6]">
                <span className="bg-[#1A1A1A]/80 border border-[#E6E6E6]/40 px-2 py-0.5 rounded-full text-[10px]">
                  Pod Mk IV Guided Loop
                </span>
              </div>
            </div>

            {/* Action Bar with Orange BOOK button */}
            <div className="mt-3 pt-2.5 border-t border-[#E6E6E6]/20 flex items-center justify-between">
              <span className="text-xs font-sketch text-[#E6E6E6]/70">
                Single traveller pod · 30-min window
              </span>
              <div className="flex items-center gap-2">
                {(!isSaleActive || remainingSeats <= 0) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerScreen('waitlist');
                    }}
                    className="sketch-btn px-3 py-1.5 rounded-full text-xs font-sketch border border-[#88D49E]/70 text-[#88D49E] hover:bg-[#88D49E]/10"
                  >
                    Join the next sale
                  </button>
                )}
                <button className="sketch-btn-orange text-xs px-5 py-1.5 rounded-full flex items-center gap-1">
                  <span>BOOK</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARD 2: Victorian London 1895 */}
        {(activeEraFilter === 'all' || activeEraFilter === 'victorian') && (
          <div
            onClick={() => handleOpenTrip('london')}
            className="sketch-card rounded-[28px] p-4 relative cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight group-hover:text-[#FF8C42] transition-colors">
                  Victorian London Gaslight
                </h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-sketch text-[#FF8C42] block leading-tight">
                  $900
                </span>
                <span className="text-[10px] text-[#E6E6E6]/50 font-sketch">per pod</span>
              </div>
            </div>

            <p className="text-xs text-[#E6E6E6]/80 font-chalk mt-1">
              Thames embankment shrouded in gaslight fog, Big Ben, and wet cobblestone streets.
            </p>

            <div 
              className="h-40 rounded-2xl bg-cover bg-center mt-3 relative overflow-hidden border border-[#E6E6E6]/30"
              style={{ backgroundImage: `url(${londonImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-sketch text-[#E6E6E6]">
                <span className="bg-[#1A1A1A]/80 border border-[#E6E6E6]/40 px-2 py-0.5 rounded-full text-[10px]">
                  Westminster River Walk
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E6E6E6]/20 flex items-center justify-between">
              <span className="text-xs font-sketch text-[#E6E6E6]/70">
                45-min historical route
              </span>
              <button className="sketch-btn-orange text-xs px-5 py-1.5 rounded-full flex items-center gap-1">
                <span>BOOK</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* CARD 3: Ancient Giza Pyramids */}
        {(activeEraFilter === 'all' || activeEraFilter === 'antiquity') && (
          <div
            onClick={() => handleOpenTrip('giza')}
            className="sketch-card rounded-[28px] p-4 relative cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight group-hover:text-[#FF8C42] transition-colors">
                  Giza Pyramids Construction
                </h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-sketch text-[#FF8C42] block leading-tight">
                  $1,400
                </span>
                <span className="text-[10px] text-[#E6E6E6]/50 font-sketch">per pod</span>
              </div>
            </div>

            <p className="text-xs text-[#E6E6E6]/80 font-chalk mt-1">
              Pharaoh Khufu's stonemasons maneuvering 2.5-ton limestone blocks under the Nile sun.
            </p>

            <div 
              className="h-40 rounded-2xl bg-cover bg-center mt-3 relative overflow-hidden border border-[#E6E6E6]/30"
              style={{ backgroundImage: `url(${pyrImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-sketch text-[#E6E6E6]">
                <span className="bg-[#1A1A1A]/80 border border-[#E6E6E6]/40 px-2 py-0.5 rounded-full text-[10px]">
                  Architectural Survey
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E6E6E6]/20 flex items-center justify-between">
              <span className="text-xs font-sketch text-[#E6E6E6]/70">
                45-min Nile plateau survey
              </span>
              <button className="sketch-btn-orange text-xs px-5 py-1.5 rounded-full flex items-center gap-1">
                <span>BOOK</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* CARD 4: Mars Olympus Outpost 2154 */}
        {(activeEraFilter === 'all' || activeEraFilter === 'mars') && (
          <div
            onClick={() => handleOpenTrip('mars')}
            className="sketch-card rounded-[28px] p-4 relative cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight group-hover:text-[#FF8C42] transition-colors">
                  Mars Olympus Outpost
                </h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-sketch text-[#FF8C42] block leading-tight">
                  $2,400
                </span>
                <span className="text-[10px] text-[#E6E6E6]/50 font-sketch">deep space pod</span>
              </div>
            </div>

            <p className="text-xs text-[#E6E6E6]/80 font-chalk mt-1">
              Humanity’s first red planet research colony nestled inside volcanic shield walls of Olympus Mons.
            </p>

            <div 
              className="h-40 rounded-2xl bg-cover bg-center mt-3 relative overflow-hidden border border-[#E6E6E6]/30"
              style={{ backgroundImage: `url(${marsImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-sketch text-[#E6E6E6]">
                <span className="bg-[#1A1A1A]/80 border border-[#E6E6E6]/40 px-2 py-0.5 rounded-full text-[10px]">
                  22nd Century Frontier
                </span>
                <span className="text-[10px] font-mono text-[#88D49E]">
                  0.38 G Low Gravity
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E6E6E6]/20 flex items-center justify-between">
              <span className="text-xs font-sketch text-[#E6E6E6]/70">
                120-min Caldera excursion
              </span>
              <button className="sketch-btn-orange text-xs px-5 py-1.5 rounded-full flex items-center gap-1">
                <span>BOOK</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
