import axios from 'axios';
import type { ApiResponse, ApiSuccess } from '@bartal/shared';
import { ApiClientError } from '../api/client';
import type { AdminAuthUser } from './store';
import { usePrefsStore } from '../state/prefs-store';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface LoginResult {
  user: AdminAuthUser;
  accessToken: string;
  refreshToken: string;
}

function locale(): 'ar' | 'en' {
  return usePrefsStore.getState().locale;
}

function unwrap<T>(body: ApiResponse<T>): T {
  if (!body.success) throw new ApiClientError(body, locale());
  return (body as ApiSuccess<T>).data;
}

export async function login(dto: LoginPayload): Promise<LoginResult> {
  try {
    const res = await axios.post<ApiResponse<LoginResult>>(`${baseURL}/auth/login`, dto, {
      headers: { 'Accept-Language': locale(), 'Content-Type': 'application/json' },
    });
    return unwrap(res.data);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.success === false) {
      throw new ApiClientError(err.response.data, locale());
    }
    throw err;
  }
}

export async function logout(accessToken: string): Promise<void> {
  try {
    await axios.post(`${baseURL}/auth/logout`, {}, {
      headers: {
        'Accept-Language': locale(),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    // logout is best-effort
  }
}
