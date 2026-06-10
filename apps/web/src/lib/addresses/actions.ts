'use server';

import { revalidatePath } from 'next/cache';
import { apiPost, apiPut, apiDelete } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { actionFail, type ActionResult } from '../api/action-result';
import { mapAddress } from '../api/mappers';
import type { ApiAddress, CreateAddressDto } from '../api/types';
import type { Address } from '@bartal/shared';
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

function revalidate(locale: Locale) {
  revalidatePath(`/${locale}/account/addresses`);
  revalidatePath(`/${locale}/checkout/address`);
}

export async function createAddressAction(
  dto: CreateAddressDto,
  locale: Locale = 'ar',
): Promise<ActionResult<Address>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const created = await apiPost<ApiAddress, CreateAddressDto>('users/me/addresses', dto, {
      locale,
      accessToken: token,
    });
    revalidate(locale);
    return { ok: true, data: mapAddress(created) };
  } catch (err) {
    return actionFail(err);
  }
}

export async function updateAddressAction(
  id: string,
  dto: Partial<CreateAddressDto>,
  locale: Locale = 'ar',
): Promise<ActionResult<Address>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const updated = await apiPut<ApiAddress, Partial<CreateAddressDto>>(
      `users/me/addresses/${id}`,
      dto,
      { locale, accessToken: token },
    );
    revalidate(locale);
    return { ok: true, data: mapAddress(updated) };
  } catch (err) {
    return actionFail(err);
  }
}

export async function deleteAddressAction(
  id: string,
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const data = await apiDelete<{ success: true }>(`users/me/addresses/${id}`, {
      locale,
      accessToken: token,
    });
    revalidate(locale);
    return { ok: true, data };
  } catch (err) {
    return actionFail(err);
  }
}

export async function setDefaultAddressAction(
  id: string,
  locale: Locale = 'ar',
): Promise<ActionResult<Address>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const updated = await apiPut<ApiAddress, Record<string, never>>(
      `users/me/addresses/${id}/default`,
      {},
      { locale, accessToken: token },
    );
    revalidate(locale);
    return { ok: true, data: mapAddress(updated) };
  } catch (err) {
    return actionFail(err);
  }
}
