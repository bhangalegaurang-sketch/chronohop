/**
 * ChronoHop Price Gate Business Rules & PRD Assumptions
 * 
 * Source of truth: PRD — ChronoHop Price Gate (Draft Nov 13, 2026)
 * All thresholds below are documented assumptions to be tuned with real data.
 */

export const PRICING_RULES = {
  // Trip & Inventory
  TRIP_NAME: 'Dinosaur Walk (Flagship)',
  LIST_PRICE: 2000,
  DAYS_IN_WINDOW: 7,
  SLOTS_PER_DAY: 48, // 30-minute slots per day
  WINDOW_SEATS: 336, // 7 days * 48 slots = 336 seats
  LOSS_PER_SEAT_AT_TYPO: 1940, // Base loss per seat if typed as $2 or extreme typo ($2,000 - $60 floor)
  MAX_SEATS_PER_CUSTOMER: 2, // 2 sale seats per account and card per sale

  // Cap Rule Parameters
  DEFAULT_SHARE_PCT: 10, // 10% default
  MIN_SHARE_PCT: 5,
  MAX_SHARE_PCT: 20,
  DEFAULT_BUDGET: 100000, // $100,000 max loss budget
  DEFAULT_CAP: 33, // min(floor(10% * 336), floor(100,000 / 1940)) = min(33, 51) = 33

  // Approval Bands
  BAND_1_MAX_PCT: 30.0, // 0 to 30%: 1 person (requester alone)
  BAND_2_MAX_PCT: 60.0, // >30% to 60%: 2 people (requires second approver)
  // Over 60%: Blocked unless Finance Lead & Founder both approve with written reason
  // Negative percent or price above list: Blocked the same way

  // Scheduling & Approvals
  FLAGSHIP_MIN_SCHEDULE_HOURS: 24, // Minimum 24 hours after approval for flagship trips
  MAX_RETYPE_ATTEMPTS: 3, // 3 wrong tries cancels the request

  // Speed Breaker
  BREAKER_MULTIPLIER: 5, // Trips when bookings in rolling 5 mins > 5x forecast
  BREAKER_FLOOR: 10, // Minimum floor for breaker trigger if forecast missing or low
  DEMO_FORECAST_5MIN: 6, // Demo forecast: 6 bookings per 5 minutes (threshold = 30 bookings)
  DEMO_BREAKER_THRESHOLD: 30, // 5 * 6 = 30 bookings

  // Customer Checkout
  CHECKOUT_HOLD_SECONDS: 480, // 8 minutes slot hold
  PRICE_CHECK_PROMISE_HOURS: 1, // Informed within 1 hour if mistake
} as const;

export type PricingRules = typeof PRICING_RULES;
