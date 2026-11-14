import React from 'react';
import { useStore } from '../../store/useStore';
import { Icons } from '../icons/Icons';
import { formatMoney } from '../../utils/formatters';
import { verifyRetypedPrice } from '../../utils/rules';

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
      <div className="p-8 text-center text-staff-text space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#0E2019] text-staff-ok flex items-center justify-center mx-auto border border-staff-border">
          <Icons.Check size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="font-mono font-bold text-lg text-staff-text">No requests waiting</h2>
          <p className="text-xs text-staff-muted max-w-sm mx-auto">
            In the Price Gate, type a discount between 30 and 60 percent to send one here.
          </p>
        </div>
        <button
          onClick={() => setStaffTab('gate')}
          className="px-4 py-2 bg-staff-panel border border-staff-border text-xs font-semibold rounded-lg hover:border-staff-brass transition-colors"
        >
          Return to Price Gate
        </button>
      </div>
    );
  }

  const isMatched = verifyRetypedPrice(retypeInput, pendingApproval.price);
  const isDifferentAccount = currentRole === 'approver';

  return (
    <div className="space-y-4 p-4 text-staff-text overflow-y-auto">
      {/* Account Identity Switcher Notice */}
      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
        isDifferentAccount
          ? 'bg-[#0E2019] border-staff-ok/40 text-staff-ok'
          : 'bg-[#2A1810] border-staff-brass/50 text-staff-brass'
      }`}>
        <div className="flex items-center gap-2">
          <Icons.User size={16} />
          <span>
            Signed in as: <strong>{currentRole === 'approver' ? 'Marcus (Approver)' : 'Asha (Pricing Analyst)'}</strong>
          </span>
        </div>
        {!isDifferentAccount ? (
          <button
            onClick={() => switchRole('approver')}
            className="px-2.5 py-1 bg-staff-brass text-staff-bg font-bold rounded text-[11px] hover:bg-[#D49826] transition-colors"
          >
            Switch account to Approver
          </button>
        ) : (
          <span className="font-mono text-[10.5px] text-staff-ok font-semibold">Different account verified</span>
        )}
      </div>

      {/* Main Approval Request Card */}
      <div className="bg-staff-panel border border-staff-border rounded-2xl p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-staff-border text-xs">
          <div className="flex items-center gap-2">
            <Icons.Stamp size={16} className="text-staff-brass" />
            <span className="font-mono font-bold uppercase tracking-wider text-staff-text">
              APPROVAL NEEDED · 30 TO 60% BELOW LIST
            </span>
          </div>
          <span className="font-mono text-staff-muted text-[11px]">
            Trip: Dinosaur Walk (flagship)
          </span>
        </div>

        {/* List Price, New Price, and Drop side by side */}
        <div className="grid grid-cols-3 gap-3 bg-[#0A1612] p-4 rounded-xl border border-staff-border text-center">
          <div>
            <span className="text-[10px] font-bold text-staff-muted uppercase tracking-wider block">
              List price
            </span>
            <span className="font-mono font-bold text-xl text-staff-text sm:text-2xl">$2,000</span>
          </div>
          <div className="border-x border-staff-border">
            <span className="text-[10px] font-bold text-staff-muted uppercase tracking-wider block">
              New price
            </span>
            <span className="font-mono font-black text-xl text-staff-glow sm:text-2xl">
              {formatMoney(pendingApproval.price)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-staff-muted uppercase tracking-wider block">
              Drop
            </span>
            <span className="font-mono font-bold text-xl text-staff-brass sm:text-2xl">
              {pendingApproval.discountPct}%
            </span>
          </div>
        </div>

        {/* Retype the final price */}
        <div className="space-y-2 bg-[#0A1612] p-4 rounded-xl border border-staff-border">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="retype-input" className="font-bold text-staff-muted uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Icons.Lock size={13} className="text-staff-brass" />
              To approve, type the new price yourself
            </label>
            <span className={`font-mono text-[11px] font-bold ${
              retypeAttemptsRemaining < 3 ? 'text-staff-danger' : 'text-staff-muted'
            }`}>
              {retypeAttemptsRemaining} tries left
            </span>
          </div>

          <div className="relative">
            <input
              id="retype-input"
              type="text"
              placeholder={`$ (expected: ${formatMoney(pendingApproval.price)})`}
              value={retypeInput}
              onChange={(e) => setRetypeInput(e.target.value)}
              className="w-full bg-staff-panel border border-staff-border text-staff-text font-mono text-base px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-staff-brass"
            />
            {isMatched && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-staff-ok flex items-center gap-1 text-xs font-bold font-mono">
                <Icons.Check size={16} /> MATCH
              </span>
            )}
          </div>

          {retypeError ? (
            <div className="text-xs text-staff-dangerLight bg-staff-danger/10 border border-staff-danger/30 p-2.5 rounded-lg flex items-center gap-2">
              <Icons.Alert size={14} />
              <span>{retypeError}</span>
            </div>
          ) : isMatched ? (
            <div className="text-xs text-staff-ok bg-staff-ok/10 border border-staff-ok/30 p-2.5 rounded-lg flex items-center gap-2">
              <Icons.Check size={14} />
              <span>Your typed price matches. You are signed in as a different person from the requester.</span>
            </div>
          ) : (
            <p className="text-[11px] text-staff-muted leading-relaxed">
              Retyping stops an approver clicking yes without reading. 3 wrong tries cancels the request.
            </p>
          )}
        </div>

        {/* Worst Case If Wrong Panel */}
        <div className="bg-[#0A1612] p-4 rounded-xl border border-staff-border space-y-2 text-xs">
          <span className="text-[11px] font-bold text-staff-muted uppercase tracking-wider flex items-center gap-1.5">
            <Icons.Shield size={13} className="text-staff-brass" />
            Worst case if this price is wrong
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex justify-between p-2 rounded bg-staff-panel border border-staff-border">
              <span className="text-staff-muted">Sale seats at this price:</span>
              <strong className="font-mono text-staff-text">{pendingApproval.cap}</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-staff-panel border border-staff-border">
              <span className="text-staff-muted">Most this sale can lose:</span>
              <strong className="font-mono text-staff-glow">about {formatMoney(pendingApproval.worstCaseLoss)}</strong>
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-staff-muted pt-1">
            <span>Speed breaker:</span>
            <strong className="text-staff-text">pauses at 5x forecast in 5 min</strong>
          </div>
        </div>

        {/* Audit Panel */}
        <div className="bg-[#08120E] p-3 rounded-xl border border-staff-border text-xs flex items-center justify-between text-staff-muted">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-staff-brass block">Audit Record:</span>
            <span>Requester: <strong>{pendingApproval.requester}</strong> · Discount: <strong>{pendingApproval.discountPct}%</strong></span>
          </div>
          <span className="font-mono text-[11px] text-staff-muted">{pendingApproval.submittedAt}</span>
        </div>

        {/* Actions Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={rejectApproval}
            className="flex-1 py-3 px-4 bg-staff-panel hover:bg-[#1A2E26] border border-staff-border text-staff-text font-bold text-xs rounded-xl transition-colors min-h-[44px]"
          >
            Reject request
          </button>

          <button
            onClick={submitApprovalRetype}
            disabled={!isMatched || !isDifferentAccount}
            className={`flex-1 py-3 px-4 font-mono font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px] ${
              isMatched && isDifferentAccount
                ? 'bg-staff-brass text-staff-bg hover:bg-[#D49826]'
                : 'bg-[#1C2822] text-staff-muted cursor-not-allowed border border-staff-border'
            }`}
          >
            <Icons.Check size={16} />
            Approve and schedule
          </button>
        </div>
      </div>
    </div>
  );
};
