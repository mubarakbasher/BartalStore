import 'server-only';
import { apiClient, ApiClientError } from '../api/client';
import { readAccessToken } from '../auth/cookies';
import { NotAuthenticatedError } from '../api/action-result';
import { mapOrder } from '../api/mappers';
import type { ApiResponse, ApiSuccess } from '@bartal/shared';
import type { OrderView } from '../api/types';
import type { Order } from '@bartal/shared';
import type { Locale } from '../i18n/config';

/**
 * Authenticated GET that injects the httpOnly access-token cookie. Kept local
 * (not the shared apiGet) because reads need the server-side bearer token.
 */
async function authedGet<T>(path: string, locale: Locale): Promise<T> {
  const token = readAccessToken();
  if (!token) throw new NotAuthenticatedError();
  const res = await apiClient.get<ApiResponse<T>>(path, {
    headers: { 'Accept-Language': locale, Authorization: `Bearer ${token}` },
  });
  if (!res.data.success) throw new ApiClientError(res.data, locale);
  return (res.data as ApiSuccess<T>).data;
}

export async function getOrders(locale: Locale = 'ar'): Promise<Order[]> {
  // GET /orders is paginated: data = { items: OrderView[], meta }.
  const data = await authedGet<{ items: OrderView[] }>('orders?page=1&limit=50', locale);
  return (data.items ?? []).map(mapOrder);
}

export async function getOrder(id: string, locale: Locale = 'ar'): Promise<Order | null> {
  try {
    const data = await authedGet<OrderView>(`orders/${id}`, locale);
    return mapOrder(data);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) return null;
    throw err;
  }
}

/** Raw (unmapped) order view — used where the receipt/print layout needs API fields. */
export async function getOrderRaw(id: string, locale: Locale = 'ar'): Promise<OrderView | null> {
  try {
    return await authedGet<OrderView>(`orders/${id}`, locale);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) return null;
    throw err;
  }
}
