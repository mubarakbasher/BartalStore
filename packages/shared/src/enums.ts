// Mirror of Prisma enums in apps/api/prisma/schema.prisma — keep in sync with PRD §9.

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Language = {
  AR: 'AR',
  EN: 'EN',
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export const DeliveryZone = {
  ZONE_A: 'ZONE_A',
  ZONE_B: 'ZONE_B',
  ZONE_C: 'ZONE_C',
  ZONE_D: 'ZONE_D',
} as const;
export type DeliveryZone = (typeof DeliveryZone)[keyof typeof DeliveryZone];

export const OtpPurpose = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
  PASSWORD_RESET: 'PASSWORD_RESET',
} as const;
export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose];

export const OrderStatus = {
  PENDING: 'PENDING',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  RECEIPT_UPLOADED: 'RECEIPT_UPLOADED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  PAYMENT_REJECTED: 'PAYMENT_REJECTED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
