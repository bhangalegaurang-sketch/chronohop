import React from 'react';
import { useStore } from '../../store/useStore';
import { ChronoLogo, Icons } from '../icons/Icons';
import { FourLocksStrip } from './FourLocksStrip';
import { PriceGateTab } from './PriceGateTab';
import { ApprovalsTab } from './ApprovalsTab';
import { TimelineDeskTab } from './TimelineDeskTab';

export const StaffConsole: React.FC = () => {
  const { staffTab, setStaffTab, pendingApproval, currentRole, switchRole } = useStore();

  return (
    <div className="flex-1 flex flex-col h-[844px] bg-[#0A1612] border-2 border-staff-border rounded-[28px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] min-w-[340px] max-w-[900px]">
      {/* Console Top Navigation Bar */}
      <div className="bg-[#07110E] border-b border-[#1A3026] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <ChronoLogo size={28} />
          <span className="font-fraunces font-black text-xl tracking-tight text-staff-text">
            ChronoHop Control
          </span>
          <span className="text-[10px] font-digits px-2 py-0.5 rounded bg-[#0F221B] border border-[#224434] text-staff-brass font-bold">
            v2.4
          </span>
        </div>

        {/* Console Mode Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#050C09] p-1.5 rounded-xl border border-staff-border shadow-inner">
          <button
            onClick={() => setStaffTab('gate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-digits font-bold transition-all flex items-center gap-1.5 ${
              staffTab === 'gate'
                ? 'brass-btn font-black shadow-md'
                : 'text-staff-muted hover:text-staff-text hover:bg-[#0E2019]'
            }`}
          >
            <Icons.Gate size={14} />
            Price Gate
          </button>

          <button
            onClick={() => setStaffTab('approvals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-digits font-bold transition-all flex items-center gap-1.5 relative ${
              staffTab === 'approvals'
                ? 'brass-btn font-black shadow-md'
                : 'text-staff-muted hover:text-staff-text hover:bg-[#0E2019]'
            }`}
          >
            <Icons.Stamp size={14} />
            Approvals
            {pendingApproval && (
              <span className="bg-staff-danger text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow">
                1
              </span>
            )}
          </button>

          <button
            onClick={() => setStaffTab('desk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-digits font-bold transition-all flex items-center gap-1.5 ${
              staffTab === 'desk'
                ? 'brass-btn font-black shadow-md'
                : 'text-staff-muted hover:text-staff-text hover:bg-[#0E2019]'
            }`}
          >
            <Icons.Desk size={14} />
            Timeline Desk
          </button>
        </div>

        {/* Operator Badge Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => switchRole()}
            className="flex items-center gap-1.5 bg-[#0B1A14] border border-[#1F3D2F] hover:border-staff-brass px-3 py-1.5 rounded-lg text-staff-text text-[11px] font-digits transition-all shadow-sm"
            title="Toggle between Analyst and Approver accounts"
          >
            <Icons.User size={13} className="text-staff-brass" />
            <span className="font-bold">{currentRole === 'analyst' ? 'Asha (Analyst)' : 'Marcus (Approver)'}</span>
          </button>
        </div>
      </div>

      {/* Four Locks Status Strip */}
      <FourLocksStrip />

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto">
        {staffTab === 'gate' && <PriceGateTab />}
        {staffTab === 'approvals' && <ApprovalsTab />}
        {staffTab === 'desk' && <TimelineDeskTab />}
      </div>
    </div>
  );
};
