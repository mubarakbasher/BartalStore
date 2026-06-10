import 'server-only';
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers';
import type { AuthSuccess, AuthUser, TokenPair } from '../api/types';

export const ACCESS_COOKIE = 'bartal_access';
export const REFRESH_COOKIE = 'bartal_refresh';
export const USER_COOKIE = 'bartal_user';

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;
const USER_MAX_AGE = REFRESH_MAX_AGE;

const isProd = process.env.NODE_ENV === 'production';

function commonFlags() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
  };
}

export function setAuthCookies(payload: AuthSuccess): void {
  const jar = (cookies() as unknown as UnsafeUnwrappedCookies);
  jar.set(ACCESS_COOKIE, payload.accessToken, { ...commonFlags(), maxAge: ACCESS_MAX_AGE });
  jar.set(REFRESH_COOKIE, payload.refreshToken, { ...commonFlags(), maxAge: REFRESH_MAX_AGE });
  jar.set(USER_COOKIE, JSON.stringify(payload.user), {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: USER_MAX_AGE,
  });
}

export function setTokenCookiesOnly(tokens: TokenPair): void {
  const jar = (cookies() as unknown as UnsafeUnwrappedCookies);
  jar.set(ACCESS_COOKIE, tokens.accessToken, { ...commonFlags(), maxAge: ACCESS_MAX_AGE });
  jar.set(REFRESH_COOKIE, tokens.refreshToken, { ...commonFlags(), maxAge: REFRESH_MAX_AGE });
}

export function clearAuthCookies(): void {
  const jar = (cookies() as unknown as UnsafeUnwrappedCookies);
  jar.set(ACCESS_COOKIE, '', { ...commonFlags(), maxAge: 0 });
  jar.set(REFRESH_COOKIE, '', { ...commonFlags(), maxAge: 0 });
  jar.set(USER_COOKIE, '', {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function readAccessToken(): string | null {
  return (cookies() as unknown as UnsafeUnwrappedCookies).get(ACCESS_COOKIE)?.value ?? null;
}

export function readRefreshToken(): string | null {
  return (cookies() as unknown as UnsafeUnwrappedCookies).get(REFRESH_COOKIE)?.value ?? null;
}

export function readServerUser(): AuthUser | null {
  const raw = (cookies() as unknown as UnsafeUnwrappedCookies).get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
