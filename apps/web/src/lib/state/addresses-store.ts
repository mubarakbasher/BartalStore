'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address } from '@bartal/shared';

const DEMO_ADDRESSES: Address[] = [
  {
    id: 'home',
    label: 'home',
    name: 'Mohammed Osman Ahmed',
    phone: '+249 91 234 5678',
    line_ar: 'الرياض، بلوك ٣٢، منزل ١٤',
    line_en: 'Al-Riyadh, block 32, house 14',
    city_ar: 'الخرطوم',
    city_en: 'Khartoum',
    zone: 'B',
    landmark_ar: 'بجانب مسجد النور',
    landmark_en: 'Next to Al-Nur Mosque',
    isDefault: true,
  },
  {
    id: 'work',
    label: 'work',
    name: 'Mohammed Osman Ahmed',
    phone: '+249 91 234 5678',
    line_ar: 'العمارات، شارع ٦١، برج النيل',
    line_en: 'Amarat, Street 61, Nile Tower',
    city_ar: 'الخرطوم',
    city_en: 'Khartoum',
    zone: 'A',
    landmark_ar: 'مقابل صيدلية الشفاء',
    landmark_en: 'Opposite Al-Shifa Pharmacy',
  },
  {
    id: 'parents',
    label: 'parents',
    name: 'Osman Ahmed',
    phone: '+249 92 876 5432',
    line_ar: 'بحري، الشعبية، بلوك ١٤',
    line_en: 'Bahri, Shabiyya, block 14',
    city_ar: 'الخرطوم بحري',
    city_en: 'Khartoum North',
    zone: 'C',
    landmark_ar: 'خلف مدرسة الخرطوم بحري الثانوية',
    landmark_en: 'Behind Bahri Secondary School',
  },
];

interface AddressesState {
  addresses: Address[];
  add: (address: Omit<Address, 'id'> & { id?: string }) => string;
  update: (id: string, patch: Partial<Address>) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

let demoIdCounter = 1;

export const useAddresses = create<AddressesState>()(
  persist(
    (set) => ({
      addresses: DEMO_ADDRESSES,
      add: (address) => {
        const id = address.id ?? `addr-${Date.now()}-${demoIdCounter++}`;
        set((state) => ({
          addresses: [...state.addresses, { ...address, id } as Address],
        }));
        return id;
      },
      update: (id, patch) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          ),
        })),
      remove: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setDefault: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),
    }),
    { name: 'bartal-addresses', version: 1 },
  ),
);

/** Convenience selector — the current default address, or first available. */
export function selectDefaultAddress(addresses: Address[]): Address | undefined {
  return addresses.find((a) => a.isDefault) ?? addresses[0];
}
