import React from 'react';
import { useStore, CustomerScreenType } from '../../store/useStore';
import { Compass, Globe2, Ticket, LucideIcon } from 'lucide-react';

interface NavItem {
  id: CustomerScreenType;
  label: string;
  icon: LucideIcon;
}

export const CustomerNavBar: React.FC = () => {
  const { customerScreen, setCustomerScreen } = useStore();

  const navItems: NavItem[] = [
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass
    },
    {
      id: 'search',
      label: 'Destinations',
      icon: Globe2
    },
    {
      id: 'profile',
      label: 'ChronoPass',
      icon: Ticket
    }
  ];

  const activeId = ['explore', 'search', 'profile'].includes(customerScreen)
    ? customerScreen
    : 'explore';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="absolute bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-[#E6E6E6]/15 px-3 pt-2 pb-2.5 flex items-center justify-around select-none text-[#E6E6E6] font-sketch shadow-[0_-4px_16px_rgba(0,0,0,0.4)]"
    >
      {navItems.map((item) => {
        const isActive = activeId === item.id;
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setCustomerScreen(item.id)}
            className={`flex flex-col items-center justify-center min-w-[90px] py-1 px-3 rounded-2xl transition-all duration-150 ${
              isActive
                ? 'bg-[#242424] border border-[#FF8C42]/50 text-[#FFFFFF] shadow-[1px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/60 hover:text-[#E6E6E6] hover:bg-white/5 active:scale-95'
            }`}
          >
            <IconComponent
              size={19}
              className={`transition-colors ${
                isActive ? 'text-[#FF8C42] stroke-[2.2]' : 'text-[#E6E6E6]/60 stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[11px] mt-0.5 tracking-wide ${
                isActive ? 'font-bold text-[#FFFFFF]' : 'font-normal text-[#E6E6E6]/70'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
