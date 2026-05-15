import { z } from 'zod';
import { SUDAN_PHONE_REGEX } from '../constants/phone';
import { OtpPurpose } from '../enums';

const sudanPhone = z.string().regex(SUDAN_PHONE_REGEX, {
  message: 'Phone must be in the format +249XXXXXXXXX',
});

const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const registerSchema = z.object({
  phone: sudanPhone,
  name: z.string().trim().min(2).max(80),
  password: strongPassword,
  email: z.string().email().optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
  phone: sudanPhone,
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
  purpose: z.nativeEnum(OtpPurpose),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  phone: sudanPhone,
  purpose: z.nativeEnum(OtpPurpose),
});
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;

export const loginSchema = z.object({
  phone: sudanPhone,
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

export const forgotPasswordSchema = z.object({
  phone: sudanPhone,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  phone: sudanPhone,
  code: z.string().regex(/^\d{6}$/),
  newPassword: strongPassword,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
