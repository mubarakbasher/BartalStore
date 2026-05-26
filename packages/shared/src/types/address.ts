/**
 * Customer-facing address shape. Mirrors prisma `Address` (camelCase here).
 * The PRD requires `landmark` to be non-empty — enforced via zod in `schemas/address`.
 */
export type AddressLabel = 'home' | 'work' | 'parents' | 'other';

export interface Address {
  id: string;
  label: AddressLabel;
  /** Free-text label override (used when label === 'other'). */
  labelText?: string;
  name: string;
  phone: string;
  /** Optional secondary phone, useful when the recipient is not the buyer. */
  secondaryPhone?: string;
  /** First address line — district, block, house, etc. */
  line_ar: string;
  line_en: string;
  city_ar: string;
  city_en: string;
  /** Sudan delivery zone code (Zone A / B / C / D). */
  zone: 'A' | 'B' | 'C' | 'D';
  /** Required landmark per PRD Sudan constraints. */
  landmark_ar: string;
  landmark_en: string;
  /** Driver instructions, gate color, doorbell label, etc. */
  deliveryNotes?: string;
  isDefault?: boolean;
}
