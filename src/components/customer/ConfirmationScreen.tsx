import React from 'react';
import { useStore } from '../../store/useStore';
import { TRIPS_CATALOG } from '../../config/tripsData';

export const ConfirmationScreen: React.FC = () => {
  const { selectedTripId, selectedSlot, setCustomerScreen } = useStore();
  const trip = TRIPS_CATALOG[selectedTripId] || TRIPS_CATALOG.dino;

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] p-6 text-center justify-center items-center space-y-5 text-[#E6E6E6] font-sketch select-none">
      {/* Tick Icon Checkmark */}
      <div className="w-20 h-20 rounded-full border-2 border-[#88D49E] text-[#88D49E] flex items-center justify-center text-4xl font-black bg-[#222222] shadow-[3px_4px_0px_#88D49E]">
        ✓
      </div>

      <div className="space-y-1">
        <h1 className="font-marker font-bold text-2xl text-[#FFFFFF] leading-tight">
          {trip.id === 'dino' ? "You're going to the Cretaceous!" : `You're going to ${trip.shortTitle}!`}
        </h1>
        <p className="text-xs text-[#88D49E] font-mono">
          ✓ Saturday {selectedSlot} · Single Pod Mk IV
        </p>
      </div>

      <div className="sketch-dashed rounded-[24px] p-4 text-left text-xs space-y-2 w-full bg-[#202020]">
        <div className="text-[#88D49E] font-bold">
          ✓ Booking Confirmed &amp; Temporal Anchor Locked
        </div>
        <p className="text-[#E6E6E6]/80 font-chalk leading-relaxed">
          Your digital boarding pass has been archived. Licensed chrono-navigator assignment and dual return beacon mesh are locked in.
        </p>
      </div>

      <button
        onClick={() => setCustomerScreen('explore')}
        className="sketch-btn-orange w-full py-3.5 text-sm rounded-full"
      >
        EXPLORE MORE DESTINATIONS →
      </button>
    </div>
  );
};
