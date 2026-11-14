import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search } from 'lucide-react';
import dinoImg from '../../assets/dino.jpg';
import londonImg from '../../assets/london.jpg';
import pyrImg from '../../assets/pyramids.jpg';
import marsImg from '../../assets/mars.jpg';

export const SearchScreen: React.FC = () => {
  const { setCustomerScreen, setSelectedTripId } = useStore();
  const [query, setQuery] = useState('');

  const destinations = [
    {
      id: 'dino',
      era: '65M BCE',
      title: 'Cretaceous Valley',
      subtitle: 'Late Cretaceous Epoch · Dinosaur Walk',
      price: '$1,600',
      tag: 'FLAGSHIP PROMO',
      img: dinoImg
    },
    {
      id: 'london',
      era: '1895 CE',
      title: 'Victorian Westminster',
      subtitle: 'Gaslight Winter Walking Route & Thames Fog',
      price: '$900',
      tag: 'INDUSTRIAL REVOLUTION',
      img: londonImg
    },
    {
      id: 'giza',
      era: '2560 BCE',
      title: 'Giza Necropolis',
      subtitle: 'Old Kingdom Egypt · Khufu Pyramid Construction',
      price: '$1,400',
      tag: 'ANCIENT WONDER',
      img: pyrImg
    },
    {
      id: 'mars',
      era: '2154 CE',
      title: 'Mars Olympus Mons',
      subtitle: 'First Interplanetary Human Outpost & Solar Domes',
      price: '$2,400',
      tag: 'RED PLANET COLONY',
      img: marsImg
    }
  ];

  const handleSelectTrip = (id: string) => {
    setSelectedTripId(id);
    setCustomerScreen('trip');
  };

  const filtered = query.trim()
    ? destinations.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()) || d.era.toLowerCase().includes(query.toLowerCase()))
    : destinations;

  return (
    <div className="flex flex-col h-full visible-scrollbar-y pb-28 p-4 text-[#E6E6E6] font-sketch select-none relative z-10 space-y-4">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#E6E6E6]/15">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl text-[#FF8C42] font-black leading-none select-none">✳</span>
          <div className="flex flex-col">
            <span className="font-sketch font-black text-lg tracking-widest text-[#FFFFFF] uppercase block leading-none">
              CHRONOHOP
            </span>
            <span className="text-[10px] text-[#E6E6E6]/60 font-mono tracking-widest uppercase mt-0.5">
              TEMPORAL INDEX
            </span>
          </div>
        </div>
      </div>

      {/* Header & Search */}
      <div className="sketch-card rounded-[24px] p-4">
        <h1 className="text-2xl font-marker font-bold text-[#FFFFFF] tracking-tight">
          Destinations &amp; Chrono-Nodes
        </h1>
        <p className="text-xs text-[#E6E6E6]/80 font-chalk mt-0.5">
          Select any era to inspect telemetry, atmospheric parameters, and available pod slots.
        </p>

        {/* Chalkboard Search Bar */}
        <div className="mt-3 relative">
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#E6E6E6]/50 rounded-full px-3.5 py-2 shadow-xs focus-within:border-[#FF8C42]">
            <Search size={15} className="text-[#FF8C42]" />
            <input
              type="text"
              placeholder="Search Cretaceous, London 1895, Mars..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-xs text-[#E6E6E6] placeholder:text-[#E6E6E6]/40 focus:outline-none font-sketch"
            />
          </div>
        </div>
      </div>

      {/* Destinations List */}
      <div className="space-y-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectTrip(item.id)}
            className="sketch-card rounded-[24px] p-3.5 cursor-pointer group hover:border-[#FF8C42] transition-all"
          >
            {item.img && (
              <div 
                className="h-28 rounded-xl bg-cover bg-center mb-2.5 relative overflow-hidden border border-[#E6E6E6]/30"
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#88D49E] bg-[#1A1A1A]/80 border border-[#E6E6E6]/30 px-2 py-0.5 rounded-full">
                  {item.era}
                </span>
                {item.tag && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold font-sketch text-[#1A1A1A] bg-[#FF8C42] px-2 py-0.5 rounded-full shadow-xs">
                    {item.tag}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-marker font-bold text-[#FFFFFF] group-hover:text-[#FF8C42] transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-[#E6E6E6]/70 font-chalk mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              {/* Sized-up orange price */}
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-xl font-bold font-sketch text-[#FF8C42] block">
                  {item.price}
                </span>
                <span className="text-[10px] text-[#E6E6E6]/50">per pod</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#E6E6E6]/20 flex items-center justify-between text-xs">
              <span className="text-xs font-sketch text-[#E6E6E6]/60">Single pod slot</span>
              <button className="sketch-btn-orange text-xs px-3.5 py-1 rounded-full">
                INSPECT →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
