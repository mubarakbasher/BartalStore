'use server';

import { revalidatePath } from 'next/cache';
import { apiPut, apiPost } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { actionFail, type ActionResult } from '../api/action-result';
import { mapProfile } from '../api/mappers';
import type { ChangePasswordDto, UpdateProfileDto, UserProfileView } from '../api/types';
import type { UserProfile } from '@bartal/shared';
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

export async function updateProfileAction(
  dto: UpdateProfileDto,
  locale: Locale = 'ar',
): Promise<ActionResult<UserProfile>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const updated = await apiPut<UserProfileView, UpdateProfileDto>('users/me', dto, {
      locale,
      accessToken: token,
    });
    revalidatePath(`/${locale}/account`);
    return { ok: true, data: mapProfile(updated) };
  } catch (err) {
    return actionFail(err);
  }
}

export async function changePasswordAction(
  dto: ChangePasswordDto,
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  const token = readAccessToken();
  if (!token) return noAuth;
  try {
    const data = await apiPost<{ success: true }, ChangePasswordDto>(
      'users/me/change-password',
      dto,
      { locale, accessToken: token },
    );
    return { ok: true, data };
  } catch (err) {
    return actionFail(err);
  }
}
