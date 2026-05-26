import { useCallback } from 'react';
import { useAuthStore, type AdminAuthUser } from './store';
import { login as apiLogin, logout as apiLogout, type LoginPayload } from './api';
import { ApiClientError } from '../api/client';

export interface UseAuthResult {
  user: AdminAuthUser | null;
  isAuthenticated: boolean;
  login: (dto: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setSession = useAuthStore((s) => s.setSession);
  const clear = useAuthStore((s) => s.clear);

  const login = useCallback(
    async (dto: LoginPayload) => {
      const result = await apiLogin(dto);
      if (result.user.role !== 'ADMIN') {
        throw new ApiClientError(
          {
            error: {
              code: 'NOT_ADMIN',
              status: 403,
              message_en: 'This account is not an admin.',
              message_ar: 'هذا الحساب ليس مسؤولاً.',
            },
          },
          'en',
        );
      }
      setSession({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    if (accessToken) {
      await apiLogout(accessToken);
    }
    clear();
  }, [accessToken, clear]);

  return {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };
}
