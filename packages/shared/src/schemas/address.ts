import { z } from 'zod';
import { DeliveryZone } from '../enums';
import { SUDAN_PHONE_REGEX } from '../constants/phone';

/**
 * Sudan has no postal code system — `landmark` is REQUIRED, not optional.
 * Per PRD §3.1 + §9 Address model.
 */
export const addressSchema = z.object({
  label: z.string().trim().min(1).max(40),
  full_name: z.string().trim().min(2).max(80),
  phone: z.string().regex(SUDAN_PHONE_REGEX),
  secondary_phone: z.string().regex(SUDAN_PHONE_REGEX).optional(),
  district: z.string().trim().min(2).max(80),
  street: z.string().trim().max(200).optional(),
  landmark: z
    .string()
    .trim()
    .min(3, 'Landmark is required (e.g. nearest mosque, school, or market)')
    .max(200),
  delivery_notes: z.string().trim().max(500).optional(),
  zone: z.nativeEnum(DeliveryZone),
  is_default: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;
