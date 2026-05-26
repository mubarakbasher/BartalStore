import type { Language, OtpPurpose } from '@bartal/shared';

const TEMPLATES = {
  REGISTER: {
    AR: (code: string) => `رمز التحقق من حسابك في برتال: ${code}. صالح لمدة ١٠ دقائق.`,
    EN: (code: string) => `Your Bartal verification code: ${code}. Valid for 10 minutes.`,
  },
  LOGIN: {
    AR: (code: string) => `رمز تسجيل الدخول إلى برتال: ${code}. صالح لمدة ١٠ دقائق.`,
    EN: (code: string) => `Your Bartal login code: ${code}. Valid for 10 minutes.`,
  },
  PASSWORD_RESET: {
    AR: (code: string) => `رمز إعادة تعيين كلمة المرور في برتال: ${code}. صالح لمدة ١٠ دقائق.`,
    EN: (code: string) => `Your Bartal password-reset code: ${code}. Valid for 10 minutes.`,
  },
};

export function otpSmsMessage(purpose: OtpPurpose, language: Language, code: string): string {
  const lang: Language = language === 'EN' ? 'EN' : 'AR';
  const template = TEMPLATES[purpose] ?? TEMPLATES.REGISTER;
  return template[lang](code);
}
