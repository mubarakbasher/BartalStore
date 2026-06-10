import 'server-only';
import { apiClient, ApiClientError } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { NotAuthenticatedError } from '../api/action-result';
import { mapProfile } from '../api/mappers';
import type { ApiResponse, ApiSuccess, UserProfile } from '@bartal/shared';
import type { UserProfileView } from '../api/types';
import type { Locale } from '../i18n/config';

export async function getProfile(locale: Locale = 'ar'): Promise<UserProfile> {
  const token = readAccessToken();
  if (!token) throw new NotAuthenticatedError();
  const res = await apiClient.get<ApiResponse<UserProfileView>>('users/me', {
    headers: { 'Accept-Language': locale, Authorization: `Bearer ${token}` },
  });
  if (!res.data.success) throw new ApiClientError(res.data, locale);
  return mapProfile((res.data as ApiSuccess<UserProfileView>).data);
}
