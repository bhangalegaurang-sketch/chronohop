import React, { useState } from 'react';

export const ProfileScreen: React.FC = () => {
  const [chronoId, setChronoId] = useState('CH-88219-VR');
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="h-full visible-scrollbar-y pb-28 p-4 text-[#E6E6E6] font-sketch select-none relative z-10 space-y-4">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#E6E6E6]/15">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl text-[#FF8C42] font-black leading-none select-none">✳</span>
          <div className="flex flex-col">
            <span className="font-sketch font-black text-lg tracking-widest text-[#FFFFFF] uppercase block leading-none">
              CHRONOHOP
            </span>
            <span className="text-[10px] text-[#E6E6E6]/60 font-mono tracking-widest uppercase mt-0.5">
              TRAVELER CLEARANCE
            </span>
          </div>
        </div>
      </div>

      {/* Traveler Pass Sketchbook Header */}
      <div className="sketch-card rounded-[28px] p-5 relative overflow-hidden bg-[#222222]">
        <div className="absolute top-0 right-0 w-28 h-28 hatch-green opacity-40 rounded-bl-[40px] pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight">
              Voyager ChronoPass
            </h1>
          </div>

          {/* Minimalist smiling mascot face (as per Design Guide Section 4) */}
          <div className="w-9 h-9 rounded-full border-2 border-[#88D49E] text-[#88D49E] flex items-center justify-center font-bold text-sm bg-[#1A1A1A] shadow-xs">
            :)
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E6E6E6]/20 relative z-10 flex items-baseline justify-between text-xs">
          <div>
            <span className="text-[#E6E6E6]/60 text-[10px] uppercase block">Chrono-ID</span>
            <span className="font-mono font-bold text-[#FF8C42] text-sm">{chronoId}</span>
          </div>
          <div className="text-right">
            <span className="text-[#E6E6E6]/60 text-[10px] uppercase block">Clearance</span>
            <span className="text-[#88D49E] font-bold">✓ Class-A Archival Verified</span>
          </div>
        </div>
      </div>

      {/* Identity Input Box with Chalkboard Buttons */}
      <div className="sketch-card rounded-[28px] p-4 space-y-3">
        <div>
          <label className="block text-xs font-sketch text-[#E6E6E6]/80 mb-1">
            ✎ Enter Time-Traveler Identifier
          </label>
          <input
            type="text"
            value={chronoId}
            onChange={(e) => {
              setChronoId(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Enter Chrono-ID"
            className="w-full px-3.5 py-2.5 bg-[#1A1A1A] border border-[#E6E6E6]/40 rounded-xl text-xs font-mono font-bold text-[#E6E6E6] focus:outline-none focus:border-[#FF8C42]"
          />
        </div>

        <button
          onClick={() => setIsSaved(true)}
          className="sketch-btn-orange w-full py-2.5 text-xs rounded-full flex items-center justify-center gap-1.5"
        >
          {isSaved ? '✓ CHRONO-ID SYNCHRONIZED' : 'SAVE & VERIFY CHRONO-ID'}
        </button>
      </div>

      {/* Supplementary notes grouped in dashed bounding boxes (Design Guide Section 5) */}
      <div className="sketch-dashed rounded-[24px] p-4 space-y-3 text-xs">
        <h2 className="text-xs font-sketch text-[#FF8C42] uppercase tracking-wider">
          Safety Protocols &amp; Guarantees
        </h2>

        <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15">
          <span className="text-[#E6E6E6]">✓ Dual Return Beacon Mesh</span>
          <span className="font-bold text-[#88D49E]">Locked &amp; Active</span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-[#E6E6E6]/15">
          <span className="text-[#E6E6E6]">✓ Comprehensive Travel Insurance</span>
          <span className="font-bold text-[#88D49E]">$100,000 Included</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#E6E6E6]">✓ Recovery Window Guarantee</span>
          <span className="font-bold text-[#FF8C42]">30-Min Return Anchor</span>
        </div>
      </div>
    </div>
  );
};
