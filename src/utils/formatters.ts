/**
 * Formatter utilities for currency, words, and numbers
 */

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

function helperWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + helperWords(n % 100) : '');
  if (n < 1000000) return helperWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + helperWords(n % 1000) : '');
  return helperWords(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + helperWords(n % 1000000) : '');
}

/**
 * Converts a dollar amount into spoken words (e.g. 1600 -> "One thousand six hundred dollars")
 */
export function numberToWords(amount: number): string {
  const d = Math.floor(amount);
  const c = Math.round((amount - d) * 100);

  const dollarWord = d === 0 ? 'zero' : helperWords(d);
  const dollarUnit = d === 1 ? 'dollar' : 'dollars';
  
  let res = `${dollarWord} ${dollarUnit}`;
  if (c > 0) {
    const centWord = helperWords(c);
    const centUnit = c === 1 ? 'cent' : 'cents';
    res += ` and ${centWord} ${centUnit}`;
  }

  // Capitalize first letter
  return res.charAt(0).toUpperCase() + res.slice(1);
}

/**
 * Format currency with commas and decimals if applicable
 */
export function formatMoney(amount: number): string {
  if (amount == null || isNaN(amount)) return '$0';
  if (amount % 1 !== 0 || amount < 10) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '$' + amount.toLocaleString('en-US');
}

/**
 * Format countdown seconds into mm:ss
 */
export function formatTimeCountdown(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.floor(Math.max(0, seconds) % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
