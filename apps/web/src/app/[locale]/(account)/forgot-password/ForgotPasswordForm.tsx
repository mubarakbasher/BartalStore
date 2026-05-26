'use client';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import type { Locale } from '@/lib/i18n/config';
import { forgotPasswordAction } from '@/lib/auth/actions';

interface Props {
  locale: Locale;
  dict: ReturnType<typeof import('@/lib/i18n/dictionary').getDictionary>;
}

export function ForgotPasswordForm({ locale, dict }: Props) {
  const router = useRouter();
  return (
    <AuthCard
      locale={locale}
      title={dict.web.auth.forgot}
      subtitle={
        locale === 'ar'
          ? 'أدخل رقم هاتفك وسنرسل لك رمزاً عبر SMS.'
          : 'Enter your phone number and we will send a code by SMS.'
      }
      fields={[
        {
          name: 'phone',
          label: dict.web.auth.phone,
          type: 'tel',
          placeholder: '+249 9XX XXX XXX',
          autoComplete: 'tel',
          required: true,
        },
      ]}
      submitLabel={locale === 'ar' ? 'إرسال الرمز' : 'Send code'}
      onSubmit={async ({ values }) => {
        const phone = (values.phone ?? '').replace(/\s+/g, '').trim();
        const result = await forgotPasswordAction({ phone }, locale);
        if (!result.ok) {
          throw new Error(locale === 'ar' ? result.error.message_ar : result.error.message_en);
        }
        router.replace(
          `/${locale}/verify-otp?phone=${encodeURIComponent(phone)}&purpose=RESET`,
        );
      }}
    />
  );
}
