import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { ApiResponse, ApiSuccess } from '@bartal/shared';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Generic fetcher that:
 * - sets `Accept-Language` from the caller's locale
 * - throws on { success: false } with the bilingual error envelope
 * - returns `data` unwrapped from the `{ success: true, data }` envelope
 */
export async function apiGet<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  locale: 'ar' | 'en' = 'ar',
): Promise<T> {
  try {
    const res = await apiClient.get<ApiResponse<T>>(path, {
      params,
      headers: { 'Accept-Language': locale },
    });
    if (!res.data.success) {
      throw new ApiClientError(res.data, locale);
    }
    return (res.data as ApiSuccess<T>).data;
  } catch (err) {
    if (err instanceof ApiClientError) throw err;
    if (err instanceof AxiosError && err.response?.data?.success === false) {
      throw new ApiClientError(err.response.data, locale);
    }
    throw err;
  }
}

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly message_en: string;
  readonly message_ar: string;

  constructor(envelope: { error?: Record<string, unknown> }, locale: 'ar' | 'en') {
    const err = envelope.error ?? {};
    const message =
      locale === 'ar' ? String(err.message_ar ?? 'حدث خطأ ما.') : String(err.message_en ?? 'Something went wrong.');
    super(message);
    this.code = String(err.code ?? 'UNKNOWN');
    this.status = Number(err.status ?? 500);
    this.message_en = String(err.message_en ?? 'Something went wrong.');
    this.message_ar = String(err.message_ar ?? 'حدث خطأ ما.');
  }
}
