/**
 * Order number format per PRD §6.1 + §10: `BRT-YYYY-NNNNN`
 * Sequence is 1-indexed and zero-padded to 5 digits, resetting each year.
 */
export const ORDER_NUMBER_PREFIX = 'BRT';
export const ORDER_NUMBER_REGEX = /^BRT-(\d{4})-(\d{5,})$/;

export function generateOrderNumber(year: number, sequence: number): string {
  if (!Number.isInteger(year) || year < 2026) {
    throw new RangeError(`Invalid year for order number: ${year}`);
  }
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new RangeError(`Invalid sequence for order number: ${sequence}`);
  }
  return `${ORDER_NUMBER_PREFIX}-${year}-${String(sequence).padStart(5, '0')}`;
}

export function parseOrderNumber(orderNumber: string): { year: number; sequence: number } | null {
  const match = ORDER_NUMBER_REGEX.exec(orderNumber);
  if (!match) return null;
  return { year: Number(match[1]), sequence: Number(match[2]) };
}
