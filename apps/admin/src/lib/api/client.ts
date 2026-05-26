import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiSuccess } from '@bartal/shared';
import { getAccessToken, getRefreshToken, useAuthStore } from '../auth/store';
import { usePrefsStore } from '../state/prefs-store';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  const locale = usePrefsStore.getState().locale;
  config.headers = config.headers ?? {};
  config.headers['Accept-Language'] = locale;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface RetriableRequest extends AxiosRequestConfig {
  _retried?: boolean;
}

let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

async function tryRefresh(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: refresh });
      const body = res.data as { success: boolean; data?: { accessToken: string; refreshToken: string } };
      if (!body.success || !body.data) return null;
      useAuthStore.getState().setTokens(body.data);
      return body.data;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequest | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !original.url?.includes('/auth/')
    ) {
      original._retried = true;
      const tokens = await tryRefresh();
      if (tokens) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient.request(original);
      }
      useAuthStore.getState().clear();
    }
    return Promise.reject(error);
  },
);

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly message_en: string;
  readonly message_ar: string;

  constructor(envelope: { error?: Record<string, unknown> }, locale: 'ar' | 'en') {
    const err = envelope.error ?? {};
    const message =
      locale === 'ar'
        ? String(err.message_ar ?? 'حدث خطأ ما.')
        : String(err.message_en ?? 'Something went wrong.');
    super(message);
    this.code = String(err.code ?? 'UNKNOWN');
    this.status = Number(err.status ?? 500);
    this.message_en = String(err.message_en ?? 'Something went wrong.');
    this.message_ar = String(err.message_ar ?? 'حدث خطأ ما.');
  }
}

function currentLocale(): 'ar' | 'en' {
  return usePrefsStore.getState().locale;
}

function unwrap<T>(body: ApiResponse<T>): T {
  if (!body.success) throw new ApiClientError(body, currentLocale());
  return (body as ApiSuccess<T>).data;
}

function rethrow(err: unknown): never {
  if (err instanceof ApiClientError) throw err;
  if (err instanceof AxiosError && err.response?.data?.success === false) {
    throw new ApiClientError(err.response.data, currentLocale());
  }
  if (err instanceof AxiosError) {
    throw new ApiClientError(
      {
        error: {
          code: 'NETWORK',
          status: err.response?.status ?? 0,
          message_en: err.message,
          message_ar: 'تعذّر الاتصال بالخادم.',
        },
      },
      currentLocale(),
    );
  }
  throw err;
}

export async function apiGet<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
  try {
    const res = await apiClient.get<ApiResponse<T>>(path, { params });
    return unwrap(res.data);
  } catch (err) {
    rethrow(err);
  }
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
  try {
    const res = await apiClient.post<ApiResponse<T>>(path, body);
    return unwrap(res.data);
  } catch (err) {
    rethrow(err);
  }
}

export async function apiPut<T, B = unknown>(path: string, body: B): Promise<T> {
  try {
    const res = await apiClient.put<ApiResponse<T>>(path, body);
    return unwrap(res.data);
  } catch (err) {
    rethrow(err);
  }
}

export async function apiDelete<T>(path: string): Promise<T> {
  try {
    const res = await apiClient.delete<ApiResponse<T>>(path);
    return unwrap(res.data);
  } catch (err) {
    rethrow(err);
  }
}
