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
