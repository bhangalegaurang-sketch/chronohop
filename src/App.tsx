import React, { useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CustomerPhone } from './components/customer/CustomerPhone';
import { useStore } from './store/useStore';

export const App: React.FC = () => {
  const tickTimer = useStore((state) => state.tickTimer);

  // Set up 1-second timer tick for customer hold countdown
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E6E6E6] flex flex-col font-sketch selection:bg-[#FF8C42] selection:text-[#1A1A1A] relative overflow-x-hidden">
      {/* Subtle Sketchbook Ambient Spotlight on the Wireframe Showcase */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8C42]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#88D49E]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Banner Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Main Showcase View: Centered Hand-Drawn Wireframe Phone */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <section aria-label="ChronoHop Digital Sketchbook" className="flex-shrink-0 my-3">
          <CustomerPhone />
        </section>
      </main>

      {/* Footer with Design Guide Palette & Credits */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default App;
