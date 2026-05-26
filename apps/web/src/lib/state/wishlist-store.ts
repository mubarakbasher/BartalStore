'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '@bartal/shared';

const DEMO_WISHLIST: WishlistItem[] = [
  {
    productId: 'p-oud',
    slug: 'royal-oud',
    name_ar: 'دهن العود الملكي',
    name_en: 'Royal Oud Perfume Oil',
    brand: 'Ajmal',
    hue: 'amber',
    imageUrl: null,
    price: 42_000,
    addedAt: '2026-04-12T08:14:00Z',
  },
  {
    productId: 'p-headphones',
    slug: 'wireless-pro-headphones',
    name_ar: 'سماعات لاسلكية برو',
    name_en: 'Wireless Pro Headphones',
    brand: 'Anker',
    hue: 'navy',
    imageUrl: null,
    price: 185_000,
    addedAt: '2026-04-15T19:42:00Z',
    priceDropped: true,
  },
  {
    productId: 'p-silk-shawl',
    slug: 'silk-shawl',
    name_ar: 'شال حريري',
    name_en: 'Silk Embroidered Shawl',
    brand: 'Al-Khartoum Looms',
    hue: 'rose',
    imageUrl: null,
    price: 80_000,
    addedAt: '2026-04-19T13:01:00Z',
  },
  {
    productId: 'p-amber-bakhoor',
    slug: 'amber-bakhoor',
    name_ar: 'بخور العنبر',
    name_en: 'Amber Bakhoor Sticks',
    brand: 'Al Haramain',
    hue: 'amber',
    imageUrl: null,
    price: 38_000,
    addedAt: '2026-04-22T07:18:00Z',
  },
];

interface WishlistState {
  items: WishlistItem[];
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: DEMO_WISHLIST,
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((it) => it.productId !== productId) })),
      has: (productId) => get().items.some((it) => it.productId === productId),
      clear: () => set({ items: [] }),
    }),
    { name: 'bartal-wishlist', version: 1 },
  ),
);
