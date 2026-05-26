import { create } from 'zustand';

export interface AdminAuthUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  language: 'ar' | 'en';
  is_verified: boolean;
}

interface AuthState {
  user: AdminAuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (s: { user: AdminAuthUser; accessToken: string; refreshToken: string }) => void;
  setTokens: (t: { accessToken: string; refreshToken: string }) => void;
  clear: () => void;
}

/**
 * Admin tokens live ONLY in memory per CLAUDE.md §4. On hard reload the
 * operator re-logs in. No localStorage, no cookies. The 401-interceptor
 * uses the in-memory refresh token to recover from short-term token expiry
 * without losing the active tab's session.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setSession: ({ user, accessToken, refreshToken }) =>
    set({ user, accessToken, refreshToken }),
  setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
  clear: () => set({ user: null, accessToken: null, refreshToken: null }),
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken;
}
