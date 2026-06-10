import 'server-only';
import { apiClient, ApiClientError } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { NotAuthenticatedError } from '../api/action-result';
import { mapWishlist } from '../api/mappers';
import type { ApiResponse, ApiSuccess, WishlistItem } from '@bartal/shared';
import type { WishlistItemView } from '../api/types';
import type { Locale } from '../i18n/config';

export async function listWishlist(locale: Locale = 'ar'): Promise<WishlistItem[]> {
  const token = readAccessToken();
  if (!token) throw new NotAuthenticatedError();
  const res = await apiClient.get<ApiResponse<WishlistItemView[]>>('wishlist', {
    headers: { 'Accept-Language': locale, Authorization: `Bearer ${token}` },
  });
  if (!res.data.success) throw new ApiClientError(res.data, locale);
  return (res.data as ApiSuccess<WishlistItemView[]>).data.map(mapWishlist);
}
