import React from 'react';
import { useStore } from '../../store/useStore';
import { FourLocksStrip } from './FourLocksStrip';
import { PriceGateTab } from './PriceGateTab';
import { ApprovalsTab } from './ApprovalsTab';
import { TimelineDeskTab } from './TimelineDeskTab';
import { Shield, CheckSquare, Activity, User } from 'lucide-react';

export const StaffConsole: React.FC = () => {
  const { staffTab, setStaffTab, pendingApproval, currentRole, switchRole } = useStore();

  return (
    <div className="flex-1 flex flex-col h-[844px] bg-[#1E1E1E] border-2 border-[#E6E6E6]/40 rounded-[28px] overflow-hidden shadow-[4px_6px_0px_rgba(230,230,230,0.12)] min-w-[340px] max-w-[960px] font-sketch select-none text-[#E6E6E6]">
      {/* Console Top Navigation Bar */}
      <div className="bg-[#181818] border-b border-[#E6E6E6]/20 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl text-[#FF8C42] font-black leading-none">✳</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-marker font-bold text-xl text-[#FFFFFF] tracking-tight">
                ChronoHop Control
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2A2A2A] border border-[#FF8C42]/40 text-[#FF8C42] font-bold">
                FOUR-LOCKS v2.4
              </span>
            </div>
          </div>
        </div>

        {/* Console Mode Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#252525] p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setStaffTab('gate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-sketch font-bold transition-all flex items-center gap-1.5 ${
              staffTab === 'gate'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] shadow-[2px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield size={14} className={staffTab === 'gate' ? 'text-[#FF8C42]' : 'text-[#88D49E]'} />
            Price Gate
          </button>

          <button
            onClick={() => setStaffTab('approvals')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-sketch font-bold transition-all flex items-center gap-1.5 relative ${
              staffTab === 'approvals'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] shadow-[2px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckSquare size={14} className={staffTab === 'approvals' ? 'text-[#FF8C42]' : 'text-[#88D49E]'} />
            Approvals
            {pendingApproval && (
              <span className="bg-[#E5484D] text-white text-[10px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                1
              </span>
            )}
          </button>

          <button
            onClick={() => setStaffTab('desk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-sketch font-bold transition-all flex items-center gap-1.5 ${
              staffTab === 'desk'
                ? 'bg-[#E6E6E6] text-[#1A1A1A] shadow-[2px_2px_0px_#FF8C42]'
                : 'text-[#E6E6E6]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity size={14} className={staffTab === 'desk' ? 'text-[#FF8C42]' : 'text-[#88D49E]'} />
            Timeline Desk
          </button>
        </div>

        {/* Operator Role Badge Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => switchRole()}
            className="flex items-center gap-1.5 bg-[#252525] border border-[#FF8C42]/50 hover:border-[#FF8C42] px-3 py-1.5 rounded-xl text-[#E6E6E6] text-xs font-sketch transition-all shadow-xs"
            title="Toggle between Analyst and Approver accounts"
          >
            <User size={13} className="text-[#FF8C42]" />
            <span className="font-bold">
              {currentRole === 'analyst' ? 'Asha (Analyst)' : 'Marcus (Approver)'}
            </span>
          </button>
        </div>
      </div>

      {/* Four Locks Status Strip */}
      <FourLocksStrip />

      {/* Tab Panels */}
      <div className="flex-1 visible-scrollbar-y p-2">
        {staffTab === 'gate' && <PriceGateTab />}
        {staffTab === 'approvals' && <ApprovalsTab />}
        {staffTab === 'desk' && <TimelineDeskTab />}
      </div>
    </div>
  );
};
