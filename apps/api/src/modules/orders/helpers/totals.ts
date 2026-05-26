import { Prisma } from '@prisma/client';

/**
 * Prisma `Decimal` → JS `number`. SDG amounts in this market sit well within
 * safe-integer precision; mirrors `cart.service.ts`'s private helper so the
 * two modules don't trip over each other on Decimal shapes.
 */
export function priceToNumber(price: Prisma.Decimal | number | string): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return Number(price);
  return price.toNumber();
}

export interface OrderTotalLine {
  product_id: string;
  unit_price: Prisma.Decimal;
  quantity: number;
}

export interface OrderTotals {
  subtotal: Prisma.Decimal;
  delivery_fee: Prisma.Decimal;
  discount: Prisma.Decimal;
  total: Prisma.Decimal;
}

/**
 * Computes order totals in `Prisma.Decimal` so DB writes preserve precision.
 * Callers convert to `number` at the response boundary via `priceToNumber`.
 */
export function computeOrderTotals(
  lines: OrderTotalLine[],
  deliveryFee: number,
  discount = 0,
): OrderTotals {
  const subtotal = lines.reduce<Prisma.Decimal>(
    (acc, line) => acc.add(line.unit_price.mul(line.quantity)),
    new Prisma.Decimal(0),
  );
  const fee = new Prisma.Decimal(deliveryFee);
  const disc = new Prisma.Decimal(discount);
  const total = subtotal.add(fee).sub(disc);
  return { subtotal, delivery_fee: fee, discount: disc, total };
}

/** `unit_price * quantity` as Prisma.Decimal — used when building OrderItem rows. */
export function lineTotal(unitPrice: Prisma.Decimal, quantity: number): Prisma.Decimal {
  return unitPrice.mul(quantity);
}
