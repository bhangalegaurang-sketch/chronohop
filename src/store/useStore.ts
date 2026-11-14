import { create } from 'zustand';
import { PRICING_RULES } from '../config/pricingRules';
import { TRIPS_CATALOG } from '../config/tripsData';
import {
  calculatePrice,
  getEffectiveCap,
  getApprovalBand,
  checkBreakerTriggered,
  verifyRetypedPrice,
  calculateWorstCaseLoss,
  isScheduleValid
} from '../utils/rules';
import { formatMoney } from '../utils/formatters';

export type UserRole = 'analyst' | 'approver';
export type CustomerScreenType = 
  | 'explore' 
  | 'search' 
  | 'notifications' 
  | 'profile' 
  | 'trip' 
  | 'checkout' 
  | 'confirmation' 
  | 'waitlist';
export type StaffTabType = 'gate' | 'approvals' | 'desk';

export const ROLE_LABELS: Record<UserRole, string> = {
  analyst: 'Asha (Analyst)',
  approver: 'Marcus (Approver)',
};

export interface PendingApproval {
  id: string;
  tripName: string;
  requester: string;
  requestedBy: UserRole;
  discountPct: number;
  price: number;
  cap: number;
  worstCaseLoss: number;
  submittedAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'normal' | 'lock' | 'alert' | 'success';
}

export interface SpeedDataPoint {
  id: string;
  label: string;
  bookings: number;
  forecast: number;
  threshold: number;
}

export interface AppStore {
  // Navigation & Role
  currentRole: UserRole;
  customerScreen: CustomerScreenType;
  staffTab: StaffTabType;
  selectedSlot: string;
  selectedTripId: string;
  showFairPriceSheet: boolean;

  // Pricing Form State (Staff)
  discountPct: number;
  sharePct: number;
  budget: number;
  customCap: number | null;
  scheduledTime: string;

  // Live Sale State
  liveSale: {
    isActive: boolean;
    discountPct: number;
    price: number;
    cap: number;
    soldCount: number; // sale-price seats only
    fullPriceCount: number; // bookings at $2,000 after the cap was hit or the sale ended
    lowestPriceSold: number;
    isPaused: boolean;
    isEnded: boolean;
    capHit: boolean;
  };

  // Rush state tracking
  recentBookingCounts: number[];
  speedHistory: SpeedDataPoint[];

  // Pending Approvals
  pendingApproval: PendingApproval | null;
  retypeInput: string;
  retypeAttemptsRemaining: number;
  retypeError: string | null;

  // Customer Checkout
  checkoutHoldSeconds: number;
  checkoutPriceAtHold: number;
  customerSaleSeatsBooked: number;
  mismatchAcknowledged: boolean;

  // Demo Controls & Locks
  lock1CapEnabled: boolean;
  lock4BreakerEnabled: boolean;
  isRushActive: boolean;

  // Timeline Event Log
  eventLog: LogEntry[];

  // Actions
  setCustomerScreen: (screen: CustomerScreenType) => void;
  setStaffTab: (tab: StaffTabType) => void;
  setSelectedSlot: (slot: string) => void;
  setSelectedTripId: (tripId: string) => void;
  setShowFairPriceSheet: (show: boolean) => void;
  setDiscountPct: (pct: number) => void;
  setSharePct: (share: number) => void;
  setBudget: (budget: number) => void;
  setCustomCap: (cap: number | null) => void;
  setScheduledTime: (time: string) => void;
  switchRole: (role?: UserRole) => void;

  // Pricing Gate Actions
  scheduleSale: () => void;
  sendToApprover: () => void;
  forceLiveDemo: () => void;

  // Approver Actions
  setRetypeInput: (val: string) => void;
  submitApprovalRetype: () => boolean;
  rejectApproval: () => void;

  // Sale Operations
  pauseListing: (manual?: boolean) => void;
  resumeListing: () => void;
  endSaleEarly: () => void;

  // Customer Booking Actions
  bookSeat: (count?: number) => boolean;
  incrementCustomerSaleSeatsBooked: () => void;
  setCheckoutPriceAtHold: (price: number) => void;
  triggerRush: () => void;
  stopRush: () => void;
  acknowledgeMismatch: () => void;

  // Demo Actions
  resetAll: () => void;
  toggleLock1: () => void;
  toggleLock4: () => void;
  tickTimer: () => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
}

// datetime-local value 25 hours from now, so the default passes the 24h flagship rule
export const getDefaultScheduleTime = (): string => {
  const d = new Date(Date.now() + 25 * 60 * 60 * 1000);
  d.setSeconds(0, 0);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const newLiveSale = (discountPct: number, price: number, cap: number): AppStore['liveSale'] => ({
  isActive: true,
  discountPct,
  price,
  cap,
  soldCount: 0,
  fullPriceCount: 0,
  lowestPriceSold: PRICING_RULES.LIST_PRICE,
  isPaused: false,
  isEnded: false,
  capHit: false,
});

const getSeededLiveSale = (): AppStore['liveSale'] => ({
  ...newLiveSale(20, 1600, 33),
  soldCount: 12,
  lowestPriceSold: 1600,
});

/**
 * True while sale-price seats can still be sold: the sale is live, not ended,
 * and (when Lock 3 is on) seats remain under the cap.
 */
export const isSaleOpen = (s: Pick<AppStore, 'liveSale' | 'lock1CapEnabled'>): boolean =>
  s.liveSale.isActive && !s.liveSale.isEnded && (!s.lock1CapEnabled || s.liveSale.soldCount < s.liveSale.cap);

const getNowTime = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

const getInitialSpeedHistory = (): SpeedDataPoint[] => [
  { id: '1', label: '-20m', bookings: 5, forecast: 6, threshold: 30 },
  { id: '2', label: '-15m', bookings: 7, forecast: 6, threshold: 30 },
  { id: '3', label: '-10m', bookings: 6, forecast: 6, threshold: 30 },
  { id: '4', label: '-5m', bookings: 8, forecast: 6, threshold: 30 },
  { id: '5', label: 'Now', bookings: 12, forecast: 6, threshold: 30 },
];

export const useStore = create<AppStore>((set, get) => ({
  currentRole: 'analyst',
  customerScreen: 'explore',
  staffTab: 'gate',
  selectedSlot: '06:00',
  selectedTripId: 'dino',
  showFairPriceSheet: false,

  discountPct: 20,
  sharePct: 10,
  budget: 100000,
  customCap: null,
  scheduledTime: getDefaultScheduleTime(),

  liveSale: getSeededLiveSale(),

  recentBookingCounts: [2, 3, 3, 2, 2],
  speedHistory: getInitialSpeedHistory(),

  pendingApproval: null,
  retypeInput: '',
  retypeAttemptsRemaining: PRICING_RULES.MAX_RETYPE_ATTEMPTS,
  retypeError: null,

  checkoutHoldSeconds: PRICING_RULES.CHECKOUT_HOLD_SECONDS,
  checkoutPriceAtHold: 1600,
  customerSaleSeatsBooked: 0,
  mismatchAcknowledged: false,

  lock1CapEnabled: true,
  lock4BreakerEnabled: true,
  isRushActive: false,

  eventLog: [
    {
      id: 'init-1',
      timestamp: '07:40:00',
      message: 'Sale scheduled: Dinosaur Walk at 20% off ($1,600). Cap rule: 33 seats.',
      type: 'normal',
    },
    {
      id: 'init-2',
      timestamp: '07:40:02',
      message: 'Lock 1 (Percent Entry), Lock 2 (Second Look), Lock 3 (Seat Cap) and Lock 4 (Speed Breaker) armed.',
      type: 'lock',
    }
  ],

  addLog: (message: string, type: LogEntry['type'] = 'normal') => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: getNowTime(),
      message,
      type,
    };
    set((state) => ({
      eventLog: [newEntry, ...state.eventLog].slice(0, 50),
    }));
  },

  setCustomerScreen: (screen) => {
    const state = get();
    // If entering checkout, lock the current displayed price and reset 5-minute hold
    if (screen === 'checkout') {
      const trip = TRIPS_CATALOG[state.selectedTripId] || TRIPS_CATALOG.dino;
      const isFlagship = Boolean(trip.isFlagship);
      const isSaleValid = isFlagship && isSaleOpen(state);
      const heldPrice = isSaleValid ? state.liveSale.price : trip.basePrice;
      set({
        customerScreen: screen,
        checkoutHoldSeconds: PRICING_RULES.CHECKOUT_HOLD_SECONDS,
        checkoutPriceAtHold: heldPrice,
        mismatchAcknowledged: false,
      });
    } else {
      set({ customerScreen: screen });
    }
  },

  setStaffTab: (tab) => set({ staffTab: tab }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setSelectedTripId: (tripId) => set({ selectedTripId: tripId }),
  setShowFairPriceSheet: (show) => set({ showFairPriceSheet: show }),

  setDiscountPct: (pct) => set({ discountPct: isNaN(pct) ? NaN : Math.round(pct * 10) / 10 }),
  setSharePct: (share) => set({ sharePct: share }),
  setBudget: (budget) => set({ budget }),
  setCustomCap: (cap) => set({ customCap: cap }),
  setScheduledTime: (time) => set({ scheduledTime: time }),

  switchRole: (role) => {
    const nextRole = role || (get().currentRole === 'analyst' ? 'approver' : 'analyst');
    set({ currentRole: nextRole });
    get().addLog(`Switched active staff account to ${ROLE_LABELS[nextRole]}.`);
  },

  scheduleSale: () => {
    const state = get();
    const band = getApprovalBand(state.discountPct);
    const salePrice = calculatePrice(state.discountPct);
    const cap = getEffectiveCap(state.sharePct, state.budget, state.customCap);

    if (band === 'invalid') {
      get().addLog('REJECTED: Discount must be between 0% and 100%.', 'alert');
      return;
    }

    if (band === 'blocked') {
      get().addLog(`BLOCKED: ${state.discountPct}% off needs finance lead + founder approval outside this screen.`, 'alert');
      return;
    }

    if (cap <= 0) {
      get().addLog('REJECTED: Sale-seat cap is 0, so the sale cannot run.', 'alert');
      return;
    }

    if (!isScheduleValid(state.scheduledTime)) {
      get().addLog('REJECTED: Flagship sales must be scheduled at least 24 hours ahead.', 'alert');
      return;
    }

    if (band === 'band_2') {
      get().sendToApprover();
      return;
    }

    // Schedule sale (the prototype fast-forwards to the start time)
    set({
      liveSale: newLiveSale(state.discountPct, salePrice, cap),
      staffTab: 'desk',
    });

    get().addLog(`Sale scheduled for ${new Date(state.scheduledTime).toLocaleString('en-US')}: ${state.discountPct}% off (${formatMoney(salePrice)}). Cap: ${cap} sale seats. Prototype starts it now.`, 'success');
  },

  sendToApprover: () => {
    const state = get();
    const salePrice = calculatePrice(state.discountPct);
    const cap = getEffectiveCap(state.sharePct, state.budget, state.customCap);
    const worstCase = calculateWorstCaseLoss(cap, salePrice);

    set({
      pendingApproval: {
        id: Math.random().toString(36).substring(2, 7),
        tripName: PRICING_RULES.TRIP_NAME,
        requester: ROLE_LABELS[state.currentRole],
        requestedBy: state.currentRole,
        discountPct: state.discountPct,
        price: salePrice,
        cap,
        worstCaseLoss: worstCase,
        submittedAt: getNowTime(),
      },
      retypeInput: '',
      retypeAttemptsRemaining: PRICING_RULES.MAX_RETYPE_ATTEMPTS,
      retypeError: null,
      staffTab: 'approvals',
    });

    get().addLog(`${ROLE_LABELS[state.currentRole]} sent ${state.discountPct}% off (${formatMoney(salePrice)}) for a second look. Worst case: ${formatMoney(worstCase)}.`, 'normal');
  },

  forceLiveDemo: () => {
    const state = get();
    const salePrice = calculatePrice(state.discountPct);
    const cap = getEffectiveCap(state.sharePct, state.budget, state.customCap);

    if (getApprovalBand(state.discountPct) === 'invalid') {
      get().addLog('TEST ONLY: Enter a discount between 0% and 100% first.', 'alert');
      return;
    }

    set({
      liveSale: newLiveSale(state.discountPct, salePrice, cap),
      customerScreen: 'trip',
      staffTab: 'desk',
    });

    get().addLog(`TEST ONLY: Locks 1 and 2 skipped. Live at ${state.discountPct}% off (${formatMoney(salePrice)}). Cap: ${cap} seats.`, 'alert');
  },

  setRetypeInput: (val) => set({ retypeInput: val, retypeError: null }),

  submitApprovalRetype: () => {
    const state = get();
    if (!state.pendingApproval) return false;

    // Check account identity (approver must be a different person from the requester)
    if (state.currentRole === state.pendingApproval.requestedBy) {
      set({ retypeError: 'You sent this request, so you cannot approve it. A different account must approve.' });
      get().addLog('REJECTED: Requester attempted self-approval. Different account mandatory.', 'alert');
      return false;
    }

    const matches = verifyRetypedPrice(state.retypeInput, state.pendingApproval.price);
    if (!matches) {
      const remaining = state.retypeAttemptsRemaining - 1;
      if (remaining <= 0) {
        set({
          pendingApproval: null,
          retypeInput: '',
          retypeAttemptsRemaining: PRICING_RULES.MAX_RETYPE_ATTEMPTS,
          retypeError: '3 incorrect price entries. Approval request has been cancelled.',
        });
        get().addLog('LOCK 2: 3 wrong retype tries. Price request cancelled.', 'alert');
        return false;
      }

      set({
        retypeAttemptsRemaining: remaining,
        retypeError: `Retyped price does not match ${formatMoney(state.pendingApproval.price)}. ${remaining} attempts remaining.`,
      });
      return false;
    }

    // Success! Schedule sale
    const approved = state.pendingApproval;
    set({
      liveSale: newLiveSale(approved.discountPct, approved.price, approved.cap),
      pendingApproval: null,
      retypeInput: '',
      retypeAttemptsRemaining: PRICING_RULES.MAX_RETYPE_ATTEMPTS,
      retypeError: null,
      staffTab: 'desk',
    });

    get().addLog(`${ROLE_LABELS[state.currentRole]} approved ${approved.tripName} at ${approved.discountPct}% off (${formatMoney(approved.price)}), requested by ${approved.requester}. Cap: ${approved.cap}.`, 'success');
    return true;
  },

  rejectApproval: () => {
    const req = get().pendingApproval;
    set({
      pendingApproval: null,
      retypeInput: '',
      retypeAttemptsRemaining: PRICING_RULES.MAX_RETYPE_ATTEMPTS,
      retypeError: null,
    });
    get().addLog(`Approval request rejected for ${req?.discountPct}% off.`, 'normal');
  },

  pauseListing: (manual = true) => {
    set((state) => ({
      liveSale: { ...state.liveSale, isPaused: true },
    }));
    get().addLog(manual ? 'Listing paused by Timeline Desk operator.' : 'Listing auto-paused by speed breaker.', 'alert');
  },

  resumeListing: () => {
    set((state) => ({
      liveSale: { ...state.liveSale, isPaused: false },
    }));
    get().addLog('Listing resumed by on-call owner.', 'success');
  },

  endSaleEarly: () => {
    set((state) => ({
      liveSale: { ...state.liveSale, isEnded: true, isPaused: false },
    }));
    get().addLog('Sale ended early by staff. Price returned to $2,000.', 'normal');
  },

  bookSeat: (count = 1) => {
    const state = get();
    if (state.liveSale.isPaused) {
      get().addLog('Booking attempt rejected: Listing is currently paused.', 'alert');
      return false;
    }

    const { cap, price } = state.liveSale;
    const currentSold = state.liveSale.soldCount;

    // Split the burst: sale seats up to the cap (Lock 3), the rest at full price
    let saleSeats = 0;
    if (isSaleOpen(state)) {
      saleSeats = state.lock1CapEnabled ? Math.min(count, Math.max(0, cap - currentSold)) : count;
    }
    const fullPriceSeats = count - saleSeats;
    const newSaleSold = currentSold + saleSeats;

    // Check Lock 3 Cap
    const capJustHit = state.lock1CapEnabled && newSaleSold >= cap && !state.liveSale.capHit && state.liveSale.isActive && !state.liveSale.isEnded;

    // Update rolling bookings
    const newRecent = [...state.recentBookingCounts.slice(-4), count];
    const rolling5Min = newRecent.reduce((sum, c) => sum + c, 0);

    // Update speed history for chart
    const currentHist = [...state.speedHistory];
    currentHist[currentHist.length - 1] = {
      ...currentHist[currentHist.length - 1],
      bookings: rolling5Min,
    };

    set((s) => ({
      liveSale: {
        ...s.liveSale,
        soldCount: newSaleSold,
        fullPriceCount: s.liveSale.fullPriceCount + fullPriceSeats,
        lowestPriceSold: saleSeats > 0 ? Math.min(s.liveSale.lowestPriceSold, price) : s.liveSale.lowestPriceSold,
        capHit: s.liveSale.capHit || capJustHit,
      },
      recentBookingCounts: newRecent,
      speedHistory: currentHist,
    }));

    // Trigger Lock 3 notification
    if (capJustHit) {
      const maxLoss = calculateWorstCaseLoss(cap, price);
      get().addLog(`LOCK 3: All ${cap} sale seats sold! Price returns to $2,000. Maximum loss capped at ${formatMoney(maxLoss)}.`, 'lock');
    }
    if (fullPriceSeats > 0) {
      get().addLog(`${fullPriceSeats} booking${fullPriceSeats === 1 ? '' : 's'} charged at full price ($2,000): sale is over.`, 'normal');
    }

    // Check Lock 4 Speed Breaker
    if (state.lock4BreakerEnabled && checkBreakerTriggered(rolling5Min, PRICING_RULES.DEMO_FORECAST_5MIN)) {
      if (!state.liveSale.isPaused) {
        get().pauseListing(false);
        get().addLog(`LOCK 4 BREAKER TRIPPED: ${rolling5Min} bookings in 5 min exceeds 5x forecast (30). Listing paused! On-call paged.`, 'lock');
      }
    }

    return true;
  },

  incrementCustomerSaleSeatsBooked: () => {
    set((s) => ({ customerSaleSeatsBooked: s.customerSaleSeatsBooked + 1 }));
  },

  setCheckoutPriceAtHold: (price: number) => {
    set({ checkoutPriceAtHold: price });
  },

  triggerRush: () => {
    get().stopRush();
    get().addLog('A deal site shared the sale link! Deal-site rush started...', 'alert');
    set({ isRushActive: true });

    let step = 0;
    const interval = setInterval(() => {
      const state = useStore.getState();
      step++;
      const burstCount = Math.round(2 * Math.pow(2.2, step));

      if (state.liveSale.isPaused || !state.isRushActive || step > 7) {
        clearInterval(interval);
        useStore.setState({ isRushActive: false });
        return;
      }

      state.bookSeat(burstCount);
    }, 700);
  },

  stopRush: () => {
    set({ isRushActive: false });
  },

  acknowledgeMismatch: () => {
    set({ mismatchAcknowledged: true });
    get().addLog('Customer consented to updated price at checkout.', 'normal');
  },

  resetAll: () => {
    get().stopRush();
    set({
      currentRole: 'analyst',
      customerScreen: 'explore',
      staffTab: 'gate',
      selectedSlot: '06:00',
      selectedTripId: 'dino',
      showFairPriceSheet: false,
      discountPct: 20,
      sharePct: 10,
      budget: 100000,
      customCap: null,
      scheduledTime: getDefaultScheduleTime(),
      liveSale: getSeededLiveSale(),
      recentBookingCounts: [2, 3, 3, 2, 2],
      speedHistory: getInitialSpeedHistory(),
      pendingApproval: null,
      retypeInput: '',
      retypeAttemptsRemaining: PRICING_RULES.MAX_RETYPE_ATTEMPTS,
      retypeError: null,
      checkoutHoldSeconds: PRICING_RULES.CHECKOUT_HOLD_SECONDS,
      checkoutPriceAtHold: 1600,
      customerSaleSeatsBooked: 0,
      mismatchAcknowledged: false,
      lock1CapEnabled: true,
      lock4BreakerEnabled: true,
      isRushActive: false,
    });
    get().addLog('System state reset to baseline (Dinosaur Walk 20% off, 33 seats, locks active).');
  },

  toggleLock1: () => {
    const nextVal = !get().lock1CapEnabled;
    set({ lock1CapEnabled: nextVal });
    get().addLog(`DEMO TOGGLE: Lock 3 (Seat Cap) set to ${nextVal ? 'ON (active)' : 'OFF (unprotected)'}.`, 'lock');
  },

  toggleLock4: () => {
    const nextVal = !get().lock4BreakerEnabled;
    set({ lock4BreakerEnabled: nextVal });
    get().addLog(`DEMO TOGGLE: Lock 4 (Speed Breaker) set to ${nextVal ? 'ON (active)' : 'OFF (unprotected)'}.`, 'lock');
  },

  tickTimer: () => {
    const state = get();
    if (state.customerScreen === 'checkout' && state.checkoutHoldSeconds > 0) {
      set({ checkoutHoldSeconds: state.checkoutHoldSeconds - 1 });
    }
  },
}));
