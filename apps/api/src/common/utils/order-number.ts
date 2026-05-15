import { generateOrderNumber } from '@bartal/shared';
import { PrismaClient } from '@prisma/client';

/**
 * Generates the next sequential order number for a given year.
 * Uses a count-based approach for the initial sprint; replace with a
 * dedicated sequence table (or `AppSetting.order_seq_YYYY`) if collisions
 * appear under concurrency.
 */
export async function nextOrderNumber(
  prisma: Pick<PrismaClient, 'order'>,
  date: Date = new Date(),
): Promise<string> {
  const year = date.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const count = await prisma.order.count({
    where: { created_at: { gte: start, lt: end } },
  });
  return generateOrderNumber(year, count + 1);
}
