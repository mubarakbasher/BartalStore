import { PrismaClient } from '@prisma/client';

export const REFUND_NUMBER_PREFIX = 'RFD';
export const REFUND_NUMBER_REGEX = /^RFD-(\d{4})-(\d{5,})$/;

export function generateRefundNumber(year: number, sequence: number): string {
  return `${REFUND_NUMBER_PREFIX}-${year}-${String(sequence).padStart(5, '0')}`;
}

/**
 * Generates the next sequential refund number for the year. Mirrors
 * `nextOrderNumber` — count-based; one retry on P2002 at the insert site
 * covers the race window.
 */
export async function nextRefundNumber(
  prisma: Pick<PrismaClient, 'refundRequest'>,
  date: Date = new Date(),
): Promise<string> {
  const year = date.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const count = await prisma.refundRequest.count({
    where: { created_at: { gte: start, lt: end } },
  });
  return generateRefundNumber(year, count + 1);
}
