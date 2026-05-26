'use client';
import { create } from 'zustand';
import { useAddresses } from './addresses-store';
import type { Address } from '@bartal/shared';

// Re-export for legacy import paths used by checkout pages.
export type { Address as CheckoutAddress } from '@bartal/shared';
export type AddressLabel = Address['label'];

interface CheckoutState {
  selectedAddressId: string | null;
  selectedZoneIdx: number;
  selectedBankId: string;
  agreedToTerms: boolean;
  setAddressId: (id: string) => void;
  setZoneIdx: (idx: number) => void;
  setBankId: (id: string) => void;
  setAgreedToTerms: (v: boolean) => void;
}

const baseStore = create<CheckoutState>((set) => ({
  selectedAddressId: null,
  selectedZoneIdx: 1,
  selectedBankId: 'faisal',
  agreedToTerms: true,
  setAddressId: (id) => set({ selectedAddressId: id }),
  setZoneIdx: (idx) => set({ selectedZoneIdx: idx }),
  setBankId: (id) => set({ selectedBankId: id }),
  setAgreedToTerms: (v) => set({ agreedToTerms: v }),
}));

/**
 * Checkout selector. The `addresses` list and the resolved active address are
 * derived from the shared addresses store so /checkout, /account/addresses, and
 * /orders/[id] all stay in sync.
 */
export function useCheckout<T>(selector: (state: CheckoutComputed) => T): T;
export function useCheckout(): CheckoutComputed;
export function useCheckout<T>(selector?: (state: CheckoutComputed) => T): T | CheckoutComputed {
  const checkout = baseStore();
  const addresses = useAddresses((s) => s.addresses);
  const computed: CheckoutComputed = {
    ...checkout,
    addresses,
    selectedAddress:
      addresses.find((a) => a.id === checkout.selectedAddressId) ??
      addresses.find((a) => a.isDefault) ??
      addresses[0],
  };
  return selector ? selector(computed) : computed;
}

interface CheckoutComputed extends CheckoutState {
  addresses: Address[];
  selectedAddress: Address | undefined;
}

/** Direct setter access for components that only need to write. */
export const checkoutActions = {
  setAddressId: (id: string) => baseStore.getState().setAddressId(id),
  setZoneIdx: (idx: number) => baseStore.getState().setZoneIdx(idx),
  setBankId: (id: string) => baseStore.getState().setBankId(id),
  setAgreedToTerms: (v: boolean) => baseStore.getState().setAgreedToTerms(v),
};
