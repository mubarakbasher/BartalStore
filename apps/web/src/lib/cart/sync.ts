'use server';

import { ApiClientError, apiGet, apiPost } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import type { CartItemView, CartView } from '../api/types';
import type { Locale } from '../i18n/config';

export interface CartSyncConflict {
  product_id: string;
  code: string;
  message_en: string;
  message_ar: string;
}

export interface CartSyncResult {
  view: CartView;
  conflicts: CartSyncConflict[];
}

export interface CartSyncInput {
  items: Array<{ product_id: string; quantity: number }>;
  locale?: Locale;
}

async function fetchCartView(token: string, locale: Locale): Promise<CartView> {
  const data = await apiGet<{ items: CartItemView[]; subtotal: number; total_quantity: number }>(
    'cart',
    {},
    locale,
  );
  return {
    items: data.items ?? [],
    subtotal: Number(data.subtotal ?? 0),
    total_quantity: Number(data.total_quantity ?? 0),
  };
}

export async function syncCartAction(input: CartSyncInput): Promise<CartSyncResult | null> {
  const token = readAccessToken();
  if (!token) return null;
  const locale = input.locale ?? 'ar';
  const conflicts: CartSyncConflict[] = [];

  for (const line of input.items) {
    if (!line.product_id || line.quantity <= 0) continue;
    try {
      await apiPost<unknown, { product_id: string; quantity: number }>(
        'cart/items',
        { product_id: line.product_id, quantity: line.quantity },
        { locale, accessToken: token },
      );
    } catch (err) {
      if (err instanceof ApiClientError) {
        conflicts.push({
          product_id: line.product_id,
          code: err.code,
          message_en: err.message_en,
          message_ar: err.message_ar,
        });
      } else {
        conflicts.push({
          product_id: line.product_id,
          code: 'NETWORK',
          message_en: 'Could not sync this item.',
          message_ar: 'تعذّر مزامنة هذا المنتج.',
        });
      }
    }
  }

  // GET cart always reflects current server state, even if no items were sent.
  try {
    const view = await fetchCartView(token, locale);
    return { view, conflicts };
  } catch {
    return { view: { items: [], subtotal: 0, total_quantity: 0 }, conflicts };
  }
}
