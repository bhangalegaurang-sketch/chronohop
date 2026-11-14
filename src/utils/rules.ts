import { PRICING_RULES } from '../config/pricingRules';

export type ApprovalBand = 'band_1' | 'band_2' | 'blocked' | 'invalid';

/**
 * Calculate the sale price from a discount percentage.
 * Price = LIST x (1 - pct/100)
 */
export function calculatePrice(discountPct: number, listPrice = PRICING_RULES.LIST_PRICE): number {
  if (discountPct == null || isNaN(discountPct)) return listPrice;
  const price = listPrice * (1 - discountPct / 100);
  return Math.round(price * 100) / 100;
}

/**
 * Calculate maximum allowable sale seat cap:
 * Cap = min(floor(share% x 336), floor(budget / 1940))
 * Staff can lower the cap, never raise it above the rule.
 */
export function calculateRuleCap(
  sharePct: number = PRICING_RULES.DEFAULT_SHARE_PCT,
  budget: number = PRICING_RULES.DEFAULT_BUDGET
): number {
  const shareSeats = Math.floor((sharePct / 100) * PRICING_RULES.WINDOW_SEATS);
  const budgetSeats = Math.floor(budget / PRICING_RULES.LOSS_PER_SEAT_AT_TYPO);
  return Math.max(0, Math.min(shareSeats, budgetSeats));
}

/**
 * Returns effective cap considering optional staff override (staff can lower, never raise)
 */
export function getEffectiveCap(
  sharePct: number,
  budget: number,
  customCap: number | null
): number {
  const ruleLimit = calculateRuleCap(sharePct, budget);
  if (customCap != null && customCap > 0) {
    return Math.min(customCap, ruleLimit);
  }
  return ruleLimit;
}

/**
 * Determine approval band:
 * - 0 to 30%: band_1 (requester alone; 0% means no discount)
 * - Over 30 to 60%: band_2 (second approver)
 * - Over 60%: blocked (finance lead + founder approve outside this screen)
 * - Empty, below 0% or above 100%: invalid input
 */
export function getApprovalBand(discountPct: number): ApprovalBand {
  if (discountPct == null || isNaN(discountPct) || discountPct < 0 || discountPct > 100) {
    return 'invalid';
  }
  if (discountPct <= PRICING_RULES.BAND_1_MAX_PCT) {
    return 'band_1';
  }
  if (discountPct <= PRICING_RULES.BAND_2_MAX_PCT) {
    return 'band_2';
  }
  return 'blocked';
}

/**
 * Check if rolling 5-minute bookings exceed speed breaker threshold:
 * Trips when bookings in rolling 5 mins > 5 * forecast (floor of 10 bookings).
 */
export function checkBreakerTriggered(
  rollingBookings: number,
  forecast: number = PRICING_RULES.DEMO_FORECAST_5MIN
): boolean {
  const threshold = Math.max(PRICING_RULES.BREAKER_FLOOR, forecast * PRICING_RULES.BREAKER_MULTIPLIER);
  return rollingBookings > threshold;
}

/**
 * Verify retyped price against expected price
 * Strips currency symbols, commas, and whitespace.
 */
export function verifyRetypedPrice(input: string, expectedPrice: number): boolean {
  if (!input) return false;
  const cleanInput = input.replace(/[$,\s]/g, '');
  const numericInput = parseFloat(cleanInput);
  if (isNaN(numericInput)) return false;
  return Math.abs(numericInput - expectedPrice) < 0.009;
}

/**
 * Loss per sale seat, net of the card fee we no longer pay on the lost revenue.
 * Loss = (LIST - Price) x (1 - 2.9%). At $2 this is $1,940.
 */
export function calculateLossPerSeat(
  salePrice: number,
  listPrice = PRICING_RULES.LIST_PRICE
): number {
  return Math.max(0, Math.round((listPrice - salePrice) * (1 - PRICING_RULES.CARD_FEE_PCT / 100)));
}

/**
 * Estimate worst-case loss if this price is wrong
 * Exposure = Cap * loss per seat
 */
export function calculateWorstCaseLoss(
  cap: number,
  salePrice: number,
  listPrice = PRICING_RULES.LIST_PRICE
): number {
  return Math.max(0, cap * calculateLossPerSeat(salePrice, listPrice));
}

/**
 * Flagship rule: a sale must start at least 24 hours from now.
 */
export function isScheduleValid(scheduledTime: string, now: Date = new Date()): boolean {
  const when = new Date(scheduledTime).getTime();
  if (isNaN(when)) return false;
  return when - now.getTime() >= PRICING_RULES.FLAGSHIP_MIN_SCHEDULE_HOURS * 60 * 60 * 1000;
}
