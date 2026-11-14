import React, { useEffect, useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CustomerPhone } from './components/customer/CustomerPhone';
import { ControllerPage } from './components/staff/ControllerPage';
import { useStore } from './store/useStore';

export const App: React.FC = () => {
  const tickTimer = useStore((state) => state.tickTimer);
  const [currentPage, setCurrentPage] = useState<'customer' | 'controller'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('control') || search.includes('control')) {
        return 'controller';
      }
    }
    return 'customer';
  });

  // Set up 1-second timer tick for customer hold countdown
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickTimer]);

  // Sync with browser URL hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('control') || search.includes('control')) {
        setCurrentPage('controller');
      } else if (hash.includes('app') || hash.includes('customer') || hash === '' || hash === '#/') {
        setCurrentPage('customer');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: 'customer' | 'controller') => {
    setCurrentPage(page);
    window.location.hash = page === 'controller' ? '#/controller' : '#/app';
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E6E6E6] flex flex-col font-sketch selection:bg-[#FF8C42] selection:text-[#1A1A1A] relative overflow-x-hidden">
      {/* Subtle Sketchbook Ambient Spotlight on the Showcase */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8C42]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#88D49E]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Banner Header with Page Navigation (hidden on mobile phone screens < 500px) */}
      <div className="relative z-10 hidden sm:block">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Main Showcase View: Customer Phone or Staff Controller */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto p-0 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        {currentPage === 'customer' ? (
          <section aria-label="ChronoHop Showcase" className="flex-shrink-0 my-0 sm:my-3 w-full sm:w-auto flex justify-center">
            <CustomerPhone />
          </section>
        ) : (
          <section aria-label="ChronoHop Mission Control" className="w-full my-3 p-4 sm:p-0">
            <ControllerPage />
          </section>
        )}
      </main>

      {/* Footer with Credits (hidden on mobile phone screens < 500px) */}
      <div className="relative z-10 hidden sm:block">
        <Footer />
      </div>
    </div>
  );
};

export default App;
