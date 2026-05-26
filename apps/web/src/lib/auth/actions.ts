'use server';

import { ApiClientError } from '../api/client';
import {
  forgotPassword as apiForgotPassword,
  login as apiLogin,
  logout as apiLogout,
  registerUser as apiRegister,
  resendOtp as apiResendOtp,
  resetPassword as apiResetPassword,
  verifyOtp as apiVerifyOtp,
} from '../api/auth';
import type {
  AuthSuccess,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  RegisterResult,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from '../api/types';
import type { Locale } from '../i18n/config';
import {
  clearAuthCookies,
  readAccessToken,
  setAuthCookies,
} from './cookies';

export interface ActionError {
  code: string;
  status: number;
  message_en: string;
  message_ar: string;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

function fail(err: unknown): { ok: false; error: ActionError } {
  if (err instanceof ApiClientError) {
    return {
      ok: false,
      error: {
        code: err.code,
        status: err.status,
        message_en: err.message_en,
        message_ar: err.message_ar,
      },
    };
  }
  return {
    ok: false,
    error: {
      code: 'UNKNOWN',
      status: 500,
      message_en: 'Something went wrong. Please try again.',
      message_ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },
  };
}

export async function loginAction(
  dto: LoginDto,
  locale: Locale = 'ar',
): Promise<ActionResult<AuthSuccess>> {
  try {
    const data = await apiLogin(dto, locale);
    setAuthCookies(data);
    return { ok: true, data };
  } catch (err) {
    return fail(err);
  }
}

export async function registerAction(
  dto: RegisterDto,
  locale: Locale = 'ar',
): Promise<ActionResult<RegisterResult>> {
  try {
    const data = await apiRegister(dto, locale);
    return { ok: true, data };
  } catch (err) {
    return fail(err);
  }
}

export async function verifyOtpAction(
  dto: VerifyOtpDto,
  locale: Locale = 'ar',
): Promise<ActionResult<AuthSuccess>> {
  try {
    const data = await apiVerifyOtp(dto, locale);
    if (dto.purpose !== 'RESET') {
      setAuthCookies(data);
    }
    return { ok: true, data };
  } catch (err) {
    return fail(err);
  }
}

export async function resendOtpAction(
  dto: ResendOtpDto,
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  try {
    const data = await apiResendOtp(dto, locale);
    return { ok: true, data };
  } catch (err) {
    return fail(err);
  }
}

export async function forgotPasswordAction(
  dto: ForgotPasswordDto,
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  try {
    const data = await apiForgotPassword(dto, locale);
    return { ok: true, data };
  } catch (err) {
    return fail(err);
  }
}

export async function resetPasswordAction(
  dto: ResetPasswordDto,
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  try {
    const data = await apiResetPassword(dto, locale);
    return { ok: true, data };
  } catch (err) {
    return fail(err);
  }
}

export async function logoutAction(
  locale: Locale = 'ar',
): Promise<ActionResult<{ success: true }>> {
  const token = readAccessToken();
  try {
    if (token) await apiLogout(token, locale);
  } catch {
    // logout is best-effort; we still clear cookies.
  }
  clearAuthCookies();
  return { ok: true, data: { success: true } };
}
