import { apiPost } from './client';
import type {
  AuthSuccess,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  RegisterResult,
  ResendOtpDto,
  ResetPasswordDto,
  TokenPair,
  VerifyOtpDto,
} from './types';
import type { Locale } from '../i18n/config';

export function registerUser(dto: RegisterDto, locale: Locale = 'ar') {
  return apiPost<RegisterResult, RegisterDto>('auth/register', dto, { locale });
}

export function login(dto: LoginDto, locale: Locale = 'ar') {
  return apiPost<AuthSuccess, LoginDto>('auth/login', dto, { locale });
}

export function verifyOtp(dto: VerifyOtpDto, locale: Locale = 'ar') {
  return apiPost<AuthSuccess, VerifyOtpDto>('auth/verify-otp', dto, { locale });
}

export function resendOtp(dto: ResendOtpDto, locale: Locale = 'ar') {
  return apiPost<{ success: true }, ResendOtpDto>('auth/resend-otp', dto, { locale });
}

export function forgotPassword(dto: ForgotPasswordDto, locale: Locale = 'ar') {
  return apiPost<{ success: true }, ForgotPasswordDto>('auth/forgot-password', dto, { locale });
}

export function resetPassword(dto: ResetPasswordDto, locale: Locale = 'ar') {
  return apiPost<{ success: true }, ResetPasswordDto>('auth/reset-password', dto, { locale });
}

export function refreshTokens(refreshToken: string, locale: Locale = 'ar') {
  return apiPost<TokenPair, { refreshToken: string }>(
    'auth/refresh',
    { refreshToken },
    { locale },
  );
}

export function logout(accessToken: string, locale: Locale = 'ar') {
  return apiPost<{ success: true }, Record<string, never>>(
    'auth/logout',
    {},
    { locale, accessToken },
  );
}
