'use client';
import { useQuery } from '@tanstack/react-query';
import type { PaginationMeta } from '@bartal/shared';
import { apiGet } from './client';
import type { CategoryNode, DeliveryZoneInfo, Product } from './types';
import type { Locale } from '../i18n/config';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  in_stock?: boolean;
}

interface ApiPaginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export function useProducts(params: ListProductsParams = {}, locale: Locale = 'ar') {
  return useQuery({
    queryKey: ['products', params, locale],
    queryFn: async () => {
      // The API hoists `data` + `meta` to the envelope; apiGet unwraps `data`.
      // We re-shape using the full envelope here via direct call to keep meta.
      const res = await fetch(
        new URL(
          `products?${new URLSearchParams(
            Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
              if (v !== undefined && v !== null && v !== '') acc[k] = String(v);
              return acc;
            }, {}),
          )}`,
          (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api') + '/',
        ),
        { headers: { 'Accept-Language': locale } },
      );
      if (!res.ok && res.status !== 200) {
        // Try to read the bilingual error
        const body = (await res.json().catch(() => null)) as { error?: { message_en?: string } } | null;
        throw new Error(body?.error?.message_en ?? `HTTP ${res.status}`);
      }
      const json = (await res.json()) as { success: boolean; data: Product[]; meta: PaginationMeta };
      return { data: json.data, meta: json.meta } as ApiPaginated<Product>;
    },
    staleTime: 30_000,
  });
}

export function useProduct(id: string | undefined, locale: Locale = 'ar') {
  return useQuery({
    queryKey: ['product', id, locale],
    queryFn: () => apiGet<Product>(`products/${id}`, {}, locale),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useCategories(locale: Locale = 'ar') {
  return useQuery({
    queryKey: ['categories', locale],
    queryFn: () => apiGet<CategoryNode[]>('categories', {}, locale),
    staleTime: 5 * 60_000,
  });
}

export function useDeliveryZones(locale: Locale = 'ar') {
  return useQuery({
    queryKey: ['delivery-zones', locale],
    queryFn: () => apiGet<DeliveryZoneInfo[]>('delivery/zones', {}, locale),
    staleTime: 5 * 60_000,
  });
}
