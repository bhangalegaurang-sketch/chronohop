import React from 'react';
import { useStore } from '../../store/useStore';

export const NotificationScreen: React.FC = () => {
  const { setCustomerScreen, liveSale } = useStore();

  const notifications = [
    {
      id: '1',
      date: '10 Oct 2024',
      title: 'Last Minute Deals',
      description: 'Missed your chance? Grab last minute deals and enjoy additional discounts on holiday packages. Book now, save big!',
      action: () => setCustomerScreen('trip')
    },
    {
      id: '2',
      date: '10 Oct 2024',
      title: 'Europe 2025 (Victorian Era 1895)',
      description: 'Lets Grab Best Deals For Europe Tours. Experience historical Westminster with guaranteed temporal stability.',
      action: () => setCustomerScreen('explore')
    },
    {
      id: '3',
      date: '04 Oct 2024',
      title: 'Prehistoric Flash Sale: Dinosaur Walk',
      description: `Seats available starting from $${liveSale.price.toLocaleString()} (was $2,000). Limited promo strictly capped by temporal authority.`,
      action: () => setCustomerScreen('trip')
    },
    {
      id: '4',
      date: '28 Sep 2024',
      title: 'Temporal Weather Advisory',
      description: 'Clearance confirmed across Cretaceous & Victorian corridors. All beacons and atmospheric telemetry nominal.',
      action: () => setCustomerScreen('explore')
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-24 text-gray-900 select-none">
      {/* Top Title: Notification (Matching Screenshot 3) */}
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
          Notification
        </h1>
      </div>

      {/* Notifications List (Matching Screenshot 3 Divider and Typography) */}
      <div className="divide-y divide-gray-200/80 px-5">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={item.action}
            className="py-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
          >
            <span className="text-xs text-gray-400 font-sans block mb-1">
              {item.date}
            </span>
            <h2 className="text-base font-bold text-gray-900 group-hover:text-[#E31E24] transition-colors leading-snug">
              {item.title}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
