import { describe, it, expect } from 'vitest';
import {
  calculatePrice,
  calculateRuleCap,
  getEffectiveCap,
  getApprovalBand,
  checkBreakerTriggered,
  verifyRetypedPrice,
  calculateWorstCaseLoss
} from '../utils/rules';
import { numberToWords, formatMoney } from '../utils/formatters';

describe('ChronoHop Price Gate Business Rules', () => {
  describe('Cap Rules', () => {
    it('calculates the default cap as 33 (10% share, $100k budget, 336 window seats, 1940 loss/seat)', () => {
      // 10% of 336 = 33.6 -> 33
      // 100,000 / 1940 = 51.54 -> 51
      // min(33, 51) = 33
      const cap = calculateRuleCap(10, 100000);
      expect(cap).toBe(33);
    });

    it('handles share slider extremes: 5% and 20%', () => {
      // 5% of 336 = 16.8 -> 16
      expect(calculateRuleCap(5, 100000)).toBe(16);

      // 20% of 336 = 67.2 -> 67; min(67, 51) = 51
      expect(calculateRuleCap(20, 100000)).toBe(51);
    });

    it('respects budget constraint when budget is lower', () => {
      // $50,000 / 1940 = 25.77 -> 25; min(33, 25) = 25
      expect(calculateRuleCap(10, 50000)).toBe(25);
    });

    it('allows staff to lower the cap but never raise it above the rule cap', () => {
      const ruleCap = calculateRuleCap(10, 100000); // 33
      expect(ruleCap).toBe(33);
      // Staff lowers to 20
      expect(getEffectiveCap(10, 100000, 20)).toBe(20);
      // Staff tries to raise to 50, but rule caps it at 33
      expect(getEffectiveCap(10, 100000, 50)).toBe(ruleCap);
    });
  });

  describe('Approval Bands', () => {
    it('allows 0% to 30% for requester alone (band_1)', () => {
      expect(getApprovalBand(5)).toBe('band_1');
      expect(getApprovalBand(20)).toBe('band_1');
      expect(getApprovalBand(30)).toBe('band_1');
    });

    it('requires second approver for >30% to 60% (band_2)', () => {
      expect(getApprovalBand(30.1)).toBe('band_2');
      expect(getApprovalBand(40)).toBe('band_2');
      expect(getApprovalBand(60)).toBe('band_2');
    });

    it('blocks discounts over 60% without founder/finance approval', () => {
      expect(getApprovalBand(60.1)).toBe('blocked');
      expect(getApprovalBand(99.9)).toBe('blocked');
      expect(getApprovalBand(100)).toBe('blocked');
    });

    it('blocks prices above list price or negative discount', () => {
      expect(getApprovalBand(0)).toBe('blocked');
      expect(getApprovalBand(-10)).toBe('blocked');
      expect(getApprovalBand(105)).toBe('blocked');
    });
  });

  describe('Speed Breaker Logic', () => {
    it('does not trip when rolling bookings <= 30 (for 6 forecast/5min)', () => {
      expect(checkBreakerTriggered(20, 6)).toBe(false);
      expect(checkBreakerTriggered(30, 6)).toBe(false);
    });

    it('trips when rolling bookings > 30 (5x 6 forecast = 30)', () => {
      expect(checkBreakerTriggered(31, 6)).toBe(true);
      expect(checkBreakerTriggered(45, 6)).toBe(true);
    });

    it('respects minimum floor of 10 bookings if forecast is very low or 0', () => {
      // 5 * 1 = 5, but floor is 10, so 8 should not trip
      expect(checkBreakerTriggered(8, 1)).toBe(false);
      expect(checkBreakerTriggered(10, 1)).toBe(false);
      expect(checkBreakerTriggered(11, 1)).toBe(true);
    });
  });

  describe('Price & Retype Verification', () => {
    it('calculates price correctly from percent', () => {
      expect(calculatePrice(20)).toBe(1600);
      expect(calculatePrice(40)).toBe(1200);
      expect(calculatePrice(99.9)).toBe(2);
    });

    it('verifies exact retyped price', () => {
      expect(verifyRetypedPrice('1200', 1200)).toBe(true);
      expect(verifyRetypedPrice('$1,200', 1200)).toBe(true);
      expect(verifyRetypedPrice('$1200.00', 1200)).toBe(true);
      expect(verifyRetypedPrice('1200.00', 1200)).toBe(true);

      // Mismatches
      expect(verifyRetypedPrice('1600', 1200)).toBe(false);
      expect(verifyRetypedPrice('120', 1200)).toBe(false);
      expect(verifyRetypedPrice('abc', 1200)).toBe(false);
    });
  });

  describe('Words and Money Formatting', () => {
    it('formats numbers into words properly', () => {
      expect(numberToWords(1600)).toBe('One thousand six hundred dollars');
      expect(numberToWords(1200)).toBe('One thousand two hundred dollars');
      expect(numberToWords(2)).toBe('Two dollars');
      expect(numberToWords(2.5)).toBe('Two dollars and fifty cents');
    });

    it('formats money properly', () => {
      expect(formatMoney(2000)).toBe('$2,000');
      expect(formatMoney(1600)).toBe('$1,600');
      expect(formatMoney(2)).toBe('$2.00');
    });

    it('calculates worst-case loss properly', () => {
      // 33 seats * ($2000 - $1600 = $400) = $13,200
      expect(calculateWorstCaseLoss(33, 1600)).toBe(13200);
    });
  });
});
