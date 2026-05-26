import { OrderStatus } from '@bartal/shared';

/**
 * PRD §11.3 — allowed `OrderStatus` transitions. Pure data; no Prisma access.
 * `CANCELLED` and `REFUNDED` are terminal — they appear as keys with an empty
 * set so `canTransition` returns false for any onward move.
 */
const TRANSITIONS: Record<OrderStatus, ReadonlySet<OrderStatus>> = {
  PENDING: new Set<OrderStatus>(['PROCESSING', 'CANCELLED']),
  AWAITING_PAYMENT: new Set<OrderStatus>(['RECEIPT_UPLOADED', 'CANCELLED']),
  RECEIPT_UPLOADED: new Set<OrderStatus>([
    'PAYMENT_CONFIRMED',
    'PAYMENT_REJECTED',
    'CANCELLED',
  ]),
  PAYMENT_CONFIRMED: new Set<OrderStatus>(['PROCESSING', 'REFUNDED']),
  PAYMENT_REJECTED: new Set<OrderStatus>(['RECEIPT_UPLOADED', 'CANCELLED']),
  PROCESSING: new Set<OrderStatus>(['SHIPPED', 'CANCELLED', 'REFUNDED']),
  SHIPPED: new Set<OrderStatus>(['DELIVERED', 'CANCELLED', 'REFUNDED']),
  DELIVERED: new Set<OrderStatus>(['REFUNDED']),
  CANCELLED: new Set<OrderStatus>(['REFUNDED']),
  REFUNDED: new Set<OrderStatus>(),
};

/**
 * Order statuses from which a refund row can be CREATED (not approved —
 * approval is what does the transition). Payment must have been received
 * (Order.payment_status = PAID) for the order to qualify.
 */
export const refundEligibleStatuses: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]);

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.has(to) ?? false;
}

/** Statuses from which a customer is allowed to cancel their own order. */
export const cancellableStatuses: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  'PENDING',
  'AWAITING_PAYMENT',
  'RECEIPT_UPLOADED',
]);

/** Statuses from which a customer may (re-)upload a bank-transfer receipt. */
export const receiptUploadableStatuses: ReadonlySet<OrderStatus> = new Set<OrderStatus>([
  'AWAITING_PAYMENT',
  'PAYMENT_REJECTED',
]);
