'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../api/types';

export interface CartLine {
  product_id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  unit_price: number;
  image_url: string | null;
  hue?: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartLine[];
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
}

function lineFromProduct(product: Product, quantity: number): CartLine {
  return {
    product_id: product.id,
    slug: product.slug,
    name_ar: product.name_ar,
    name_en: product.name_en,
    unit_price: Number(product.price),
    image_url: product.images?.[0]?.url ?? null,
    quantity: Math.max(1, Math.min(quantity, product.stock || 99)),
    stock: product.stock,
  };
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((it) => it.product_id === product.id);
          if (existing) {
            const next = Math.min(existing.quantity + quantity, product.stock || existing.quantity + quantity);
            return {
              items: state.items.map((it) =>
                it.product_id === product.id ? { ...it, quantity: next } : it,
              ),
            };
          }
          return { items: [...state.items, lineFromProduct(product, quantity)] };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((it) =>
              it.product_id === productId
                ? { ...it, quantity: Math.max(0, Math.min(quantity, it.stock || quantity)) }
                : it,
            )
            .filter((it) => it.quantity > 0),
        })),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((it) => it.product_id !== productId) })),
      clear: () => set({ items: [] }),
      totalQuantity: () => get().items.reduce((acc, it) => acc + it.quantity, 0),
      subtotal: () => get().items.reduce((acc, it) => acc + it.unit_price * it.quantity, 0),
    }),
    {
      name: 'bartal-cart',
      version: 1,
    },
  ),
);
