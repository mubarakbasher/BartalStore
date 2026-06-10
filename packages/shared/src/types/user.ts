import type { Gender, Language, UserRole, VerificationStatus } from '../enums';

export type VerificationState = 'verified' | 'pending' | 'unverified';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** ISO date (YYYY-MM-DD). */
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  /** ISO date — when the account was created. */
  memberSince: string;
  /** Lifetime order count, surfaced on the account hub. */
  ordersCount: number;
  /** Lifetime total spend in SDG, surfaced on the account hub. */
  lifetimeSpend: number;
  loyaltyPoints: number;
  verifications: {
    phone: VerificationState;
    email: VerificationState;
    nationalId: VerificationState;
  };
}

/**
 * Wire format of `GET /users/me` — the JSON-serialized API response
 * (dates are ISO strings). Distinct from `UserProfile` above, which is
 * the UI-shaped model used by the web account screens.
 */
export interface UserProfileView {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: UserRole;
  language: Language;
  is_verified: boolean;
  email_verified: boolean;
  national_id_status: VerificationStatus;
  date_of_birth: string | null;
  gender: Gender | null;
  loyalty_points: number;
  orders_count: number;
  lifetime_spend: number;
  created_at: string;
}
