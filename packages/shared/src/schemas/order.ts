import { z } from 'zod';
import { PaymentMethod } from '../enums';

export const createOrderItemSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().int().positive().max(99),
  variant_id: z.string().min(1).optional(),
});

export const createOrderSchema = z.object({
  address_id: z.string().min(1),
  payment_method: z.nativeEnum(PaymentMethod),
  notes: z.string().trim().max(500).optional(),
  items: z.array(createOrderItemSchema).min(1, 'Order must contain at least one item'),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const uploadReceiptSchema = z.object({
  receipt_url: z.string().url(),
});
export type UploadReceiptInput = z.infer<typeof uploadReceiptSchema>;

export const cancelOrderSchema = z.object({
  reason: z.string().trim().min(3).max(300).optional(),
});
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
