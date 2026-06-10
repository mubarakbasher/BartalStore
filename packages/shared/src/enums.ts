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

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const VerificationStatus = {
  UNVERIFIED: 'UNVERIFIED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

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

export const ReviewModerationStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type ReviewModerationStatus =
  (typeof ReviewModerationStatus)[keyof typeof ReviewModerationStatus];

export const InventoryMovementType = {
  SALE: 'SALE',
  RETURN: 'RETURN',
  RESTOCK: 'RESTOCK',
  ADJUST: 'ADJUST',
} as const;
export type InventoryMovementType =
  (typeof InventoryMovementType)[keyof typeof InventoryMovementType];

export const RefundStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus];

export const PromoType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const;
export type PromoType = (typeof PromoType)[keyof typeof PromoType];

export const BannerStatus = {
  DRAFT: 'DRAFT',
  LIVE: 'LIVE',
} as const;
export type BannerStatus = (typeof BannerStatus)[keyof typeof BannerStatus];
