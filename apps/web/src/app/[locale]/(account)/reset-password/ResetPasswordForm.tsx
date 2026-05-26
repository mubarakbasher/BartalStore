'use client';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import type { Locale } from '@/lib/i18n/config';
import { resetPasswordAction } from '@/lib/auth/actions';

interface Props {
  locale: Locale;
  phone: string;
  code: string;
  dict: ReturnType<typeof import('@/lib/i18n/dictionary').getDictionary>;
}

export function ResetPasswordForm({ locale, phone, code, dict }: Props) {
  const router = useRouter();
  return (
    <AuthCard
      locale={locale}
      title={locale === 'ar' ? 'كلمة مرور جديدة' : 'Set a new password'}
      subtitle={
        locale === 'ar'
          ? 'اختر كلمة مرور قوية لا تستخدمها في أي مكان آخر.'
          : 'Choose a strong password you do not use anywhere else.'
      }
      fields={[
        {
          name: 'newPassword',
          label: dict.web.auth.password,
          type: 'password',
          autoComplete: 'new-password',
          required: true,
        },
        {
          name: 'confirmPassword',
          label: dict.web.auth.confirmPassword,
          type: 'password',
          autoComplete: 'new-password',
          required: true,
        },
      ]}
      submitLabel={locale === 'ar' ? 'تحديث كلمة المرور' : 'Update password'}
      onSubmit={async ({ values }) => {
        const newPassword = values.newPassword ?? '';
        const confirm = values.confirmPassword ?? '';
        if (newPassword.length < 8) {
          throw new Error(
            locale === 'ar'
              ? 'كلمة المرور يجب ألا تقل عن ٨ أحرف.'
              : 'Password must be at least 8 characters.',
          );
        }
        if (newPassword !== confirm) {
          throw new Error(
            locale === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.',
          );
        }
        const result = await resetPasswordAction({ phone, code, newPassword }, locale);
        if (!result.ok) {
          throw new Error(locale === 'ar' ? result.error.message_ar : result.error.message_en);
        }
        router.replace(`/${locale}/login`);
      }}
    />
  );
}
