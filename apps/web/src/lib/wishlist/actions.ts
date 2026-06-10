'use server';

import { revalidatePath } from 'next/cache';
import { apiPost, apiDelete } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { actionFail, type ActionResult } from '../api/action-result';
import { mapWishlist } from '../api/mappers';
import type { WishlistItemView } from '../api/types';
import type { WishlistItem } from '@bartal/shared';
import type { Locale } from '../i18n/config';

const noAuth = {
  ok: false as const,
  error: {
    code: 'NOT_AUTHENTICATED',
    status: 401,
    message_en: 'Please sign in to continue.',
    message_ar: 'يرجى تسجيل الدخول للمتابعة.',
  },
};

export async function addToWishlistAction(
  productId: string,
  locale: Locale = 'ar',
): Promise<ActionResult<WishlistItem>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const item = await apiPost<WishlistItemView, Record<string, never>>(
      `wishlist/${productId}`,
      {},
      { locale, accessToken: token },
    );
    revalidatePath(`/${locale}/wishlist`);
    return { ok: true, data: mapWishlist(item) };
  } catch (err) {
    return actionFail(err);
  }
}

export async function removeFromWishlistAction(
  productId: string,
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const data = await apiDelete<{ success: true }>(`wishlist/${productId}`, {
      locale,
      accessToken: token,
    });
    revalidatePath(`/${locale}/wishlist`);
    return { ok: true, data };
  } catch (err) {
    return actionFail(err);
  }
}
