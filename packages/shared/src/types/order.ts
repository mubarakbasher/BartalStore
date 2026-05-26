import type { Address } from './address';

export type { Address };

/**
 * Demo-facing order status. Maps onto the backend `OrderStatus` enum but uses
 * the friendlier groupings the design surfaces ("review" = awaiting receipt
 * verification, "shipped" = on the way).
 */
export type DemoOrderStatus =
  | 'placed'
  | 'review'
  | 'verified'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  slug: string;
  name_ar: string;
  name_en: string;
  brand: string;
  hue: string;
  imageUrl: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderStatusEvent {
  status: DemoOrderStatus;
  /** ISO timestamp — undefined while pending. */
  at?: string;
}

export interface PaymentReceipt {
  bank_ar: string;
  bank_en: string;
  amount: number;
  reference: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Order {
  id: string;
  /** BRT-YYYY-NNNNN order number. */
  number: string;
  placedAt: string;
  status: DemoOrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingAddress: Address;
  payment: {
    method: 'bank_transfer' | 'cod';
    bankId?: string;
    receipt?: PaymentReceipt;
  };
  timeline: OrderStatusEvent[];
}
