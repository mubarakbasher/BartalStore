'use client';
import { create } from 'zustand';
import type { Address } from '@bartal/shared';
import type { Locale } from '@/lib/i18n/config';
import type { CreateAddressDto } from '@/lib/api/types';
import type { ActionResult } from '@/lib/api/action-result';
import {
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from '@/lib/addresses/actions';

interface AddressesState {
  addresses: Address[];
  hydrated: boolean;
  /** Seed the cache from a server fetch (Server Component → client). */
  hydrate: (items: Address[]) => void;
  create: (dto: CreateAddressDto, locale: Locale) => Promise<ActionResult<Address>>;
  update: (
    id: string,
    dto: Partial<CreateAddressDto>,
    locale: Locale,
  ) => Promise<ActionResult<Address>>;
  remove: (id: string, locale: Locale) => Promise<ActionResult<{ success: true }>>;
  setDefault: (id: string, locale: Locale) => Promise<ActionResult<Address>>;
}

export const useAddresses = create<AddressesState>()((set) => ({
  addresses: [],
  hydrated: false,
  hydrate: (items) => set({ addresses: items, hydrated: true }),

  create: async (dto, locale) => {
    const res = await createAddressAction(dto, locale);
    if (res.ok) {
      set((s) => ({
        // a new default unsets others client-side too
        addresses: res.data.isDefault
          ? [...s.addresses.map((a) => ({ ...a, isDefault: false })), res.data]
          : [...s.addresses, res.data],
      }));
    }
    return res;
  },

  update: async (id, dto, locale) => {
    const res = await updateAddressAction(id, dto, locale);
    if (res.ok) {
      set((s) => ({
        addresses: s.addresses.map((a) =>
          a.id === id
            ? res.data
            : res.data.isDefault
              ? { ...a, isDefault: false }
              : a,
        ),
      }));
    }
    return res;
  },

  remove: async (id, locale) => {
    const res = await deleteAddressAction(id, locale);
    if (res.ok) {
      set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) }));
    }
    return res;
  },

  setDefault: async (id, locale) => {
    const res = await setDefaultAddressAction(id, locale);
    if (res.ok) {
      set((s) => ({
        addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      }));
    }
    return res;
  },
}));

/** Convenience selector — the current default address, or first available. */
export function selectDefaultAddress(addresses: Address[]): Address | undefined {
  return addresses.find((a) => a.isDefault) ?? addresses[0];
}
