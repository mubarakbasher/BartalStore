'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AuthUser } from '../api/types';
import { logoutAction } from './actions';
import type { Locale } from '../i18n/config';

const USER_COOKIE = 'bartal_user';
const CHANNEL = 'bartal-auth';

function readUserCookie(): AuthUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${USER_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.slice(USER_COOKIE.length + 1))) as AuthUser;
  } catch {
    return null;
  }
}

export interface UseAuthResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  logout: (locale?: Locale) => Promise<void>;
  refreshFromCookie: () => void;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const refreshFromCookie = useCallback(() => {
    setUser(readUserCookie());
  }, []);

  useEffect(() => {
    setUser(readUserCookie());
    setIsHydrated(true);
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    channel.onmessage = () => setUser(readUserCookie());
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const logout = useCallback(async (locale: Locale = 'ar') => {
    await logoutAction(locale);
    setUser(null);
    channelRef.current?.postMessage({ type: 'logout' });
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isHydrated,
    logout,
    refreshFromCookie,
  };
}

export function notifyAuthChange(): void {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
  const channel = new BroadcastChannel(CHANNEL);
  channel.postMessage({ type: 'login' });
  channel.close();
}
