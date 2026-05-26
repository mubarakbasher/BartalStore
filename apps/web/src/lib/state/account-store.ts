'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@bartal/shared';

const DEMO_USER: UserProfile = {
  id: 'usr_mohammed_osman',
  firstName: 'Mohammed',
  lastName: 'Osman Ahmed',
  phone: '+249 91 234 5678',
  email: 'm.osman@example.sd',
  dob: '1992-03-15',
  gender: 'male',
  memberSince: '2025-02-01',
  ordersCount: 42,
  lifetimeSpend: 1_400_000,
  loyaltyPoints: 840,
  verifications: {
    phone: 'verified',
    email: 'verified',
    nationalId: 'pending',
  },
};

interface AccountState {
  user: UserProfile;
  update: (patch: Partial<UserProfile>) => void;
}

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: DEMO_USER,
      update: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
    }),
    { name: 'bartal-account', version: 1 },
  ),
);
