import 'server-only';
import { apiClient, ApiClientError } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { NotAuthenticatedError } from '../api/action-result';
import { mapAddress } from '../api/mappers';
import type { ApiResponse, ApiSuccess, Address } from '@bartal/shared';
import type { ApiAddress } from '../api/types';
import type { Locale } from '../i18n/config';

export async function listAddresses(locale: Locale = 'ar'): Promise<Address[]> {
  const token = readAccessToken();
  if (!token) throw new NotAuthenticatedError();
  const res = await apiClient.get<ApiResponse<ApiAddress[]>>('users/me/addresses', {
    headers: { 'Accept-Language': locale, Authorization: `Bearer ${token}` },
  });
  if (!res.data.success) throw new ApiClientError(res.data, locale);
  return (res.data as ApiSuccess<ApiAddress[]>).data.map(mapAddress);
}
