import React from 'react';
import { useStore } from '../../store/useStore';
import { formatMoney } from '../../utils/formatters';
import { verifyRetypedPrice } from '../../utils/rules';
import { Check, User, Stamp, Lock } from 'lucide-react';

export const ApprovalsTab: React.FC = () => {
  const {
    currentRole,
    switchRole,
    pendingApproval,
    retypeInput,
    setRetypeInput,
    retypeAttemptsRemaining,
    retypeError,
    submitApprovalRetype,
    rejectApproval,
    setStaffTab
  } = useStore();

  if (!pendingApproval) {
    return (
      <div className="p-8 text-center text-[#E6E6E6] space-y-4 font-sketch">
        <div className="w-16 h-16 rounded-full bg-[#202020] text-[#88D49E] flex items-center justify-center mx-auto border border-[#88D49E]/40 shadow-xs">
          <Check size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="font-marker font-bold text-2xl text-[#FFFFFF]">No requests waiting</h2>
          <p className="text-xs text-[#E6E6E6]/70 font-chalk max-w-sm mx-auto">
            In the Price Gate, enter a discount between 30% and 60% to submit a dual-approval request here.
          </p>
        </div>
        <button
          onClick={() => setStaffTab('gate')}
          className="sketch-btn-orange px-5 py-2 text-xs rounded-full inline-flex items-center gap-1.5"
        >
          <span>RETURN TO PRICE GATE</span>
        </button>
      </div>
    );
  }

  const isMatched = verifyRetypedPrice(retypeInput, pendingApproval.price);
  const isDifferentAccount = currentRole === 'approver';

  return (
    <div className="space-y-4 p-4 text-[#E6E6E6] font-sketch select-none">
      {/* Account Identity Switcher Notice */}
      <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
        isDifferentAccount
          ? 'bg-[#1E2822] border-[#88D49E]/50 text-[#88D49E]'
          : 'bg-[#2A1E14] border-[#FF8C42]/50 text-[#FF8C42]'
      }`}>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>
            Signed in as: <strong className="text-white">{currentRole === 'approver' ? 'Marcus (Approver)' : 'Asha (Pricing Analyst)'}</strong>
          </span>
        </div>
        {!isDifferentAccount ? (
          <button
            onClick={() => switchRole('approver')}
            className="sketch-btn-orange px-3 py-1 rounded-full text-xs"
          >
            Switch to Approver Account
          </button>
        ) : (
          <span className="font-mono text-xs text-[#88D49E] font-bold">✓ Dual-Account Policy Satisfied</span>
        )}
      </div>

      {/* Main Approval Request Card */}
      <div className="sketch-card rounded-[24px] p-5 space-y-4 bg-[#202020]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]/20 text-xs">
          <div className="flex items-center gap-2">
            <Stamp size={18} className="text-[#FF8C42]" />
            <span className="font-marker font-bold text-xl text-[#FFFFFF]">
              Approval Needed · 30% to 60% Below List
            </span>
          </div>
          <span className="font-mono text-[#88D49E] text-xs font-bold">
            Flagship: Dinosaur Walk
          </span>
        </div>

        {/* List Price, New Price, and Drop side by side */}
        <div className="grid grid-cols-3 gap-3 bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30 text-center">
          <div>
            <span className="text-[10px] font-bold text-[#E6E6E6]/60 uppercase tracking-wider block">
              Standard List Price
            </span>
            <span className="font-mono font-bold text-xl text-[#FFFFFF] sm:text-2xl">$2,000</span>
          </div>
          <div className="border-x border-[#E6E6E6]/20">
            <span className="text-[10px] font-bold text-[#E6E6E6]/60 uppercase tracking-wider block">
              Requested Price
            </span>
            <span className="font-mono font-black text-xl text-[#FF8C42] sm:text-2xl">
              {formatMoney(pendingApproval.price)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#E6E6E6]/60 uppercase tracking-wider block">
              Discount
            </span>
            <span className="font-mono font-bold text-xl text-[#88D49E] sm:text-2xl">
              {pendingApproval.discountPct}%
            </span>
          </div>
        </div>

        {/* Retype the final price */}
        <div className="space-y-2 bg-[#1A1A1A] p-4 rounded-2xl border border-[#E6E6E6]/30">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="retype-input" className="font-bold text-[#E6E6E6]/80 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Lock size={13} className="text-[#FF8C42]" />
              To approve, retype the exact price yourself:
            </label>
            <span className={`font-mono text-[11px] font-bold ${
              retypeAttemptsRemaining < 3 ? 'text-red-400' : 'text-[#E6E6E6]/60'
            }`}>
              {retypeAttemptsRemaining} of 3 attempts remaining
            </span>
          </div>

          <div className="relative">
            <input
              id="retype-input"
              type="text"
              placeholder={`Type exact price (e.g. ${formatMoney(pendingApproval.price)})`}
              value={retypeInput}
              disabled={!isDifferentAccount || retypeAttemptsRemaining === 0}
              onChange={(e) => setRetypeInput(e.target.value)}
              className="w-full bg-[#141414] border border-[#E6E6E6]/40 font-mono text-base px-3.5 py-2.5 rounded-xl text-[#FFFFFF] focus:outline-none focus:border-[#FF8C42] disabled:opacity-50"
            />
          </div>

          {retypeError && (
            <p className="text-xs text-red-400 font-mono flex items-center gap-1">
              <span>⚠</span>
              <span>{retypeError}</span>
            </p>
          )}

          {!isDifferentAccount && (
            <p className="text-xs text-[#FF8C42] font-chalk">
              ⚠ Lock 2 requires a DIFFERENT logged-in operator to approve. Switch account to Marcus above.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={rejectApproval}
            className="px-4 py-2 rounded-full border border-[#E6E6E6]/30 text-xs text-[#E6E6E6]/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Reject &amp; Return to Desk
          </button>

          <button
            disabled={!isDifferentAccount || !isMatched || retypeAttemptsRemaining === 0}
            onClick={submitApprovalRetype}
            className={`sketch-btn-orange px-6 py-2.5 text-xs rounded-full flex items-center gap-1.5 ${
              !isDifferentAccount || !isMatched || retypeAttemptsRemaining === 0
                ? 'opacity-40 cursor-not-allowed'
                : ''
            }`}
          >
            <Check size={14} />
            <span>CONFIRM &amp; AUTHORIZE PROMO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
