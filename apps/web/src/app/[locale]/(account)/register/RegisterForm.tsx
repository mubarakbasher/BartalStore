'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/AuthCard';
import type { Locale } from '@/lib/i18n/config';
import { registerAction } from '@/lib/auth/actions';

interface Props {
  locale: Locale;
  dict: ReturnType<typeof import('@/lib/i18n/dictionary').getDictionary>;
}

export function RegisterForm({ locale, dict }: Props) {
  const router = useRouter();

  return (
    <AuthCard
      locale={locale}
      title={dict.web.auth.registerTitle}
      subtitle={dict.web.auth.registerSubtitle}
      fields={[
        {
          name: 'name',
          label: dict.web.auth.fullName,
          type: 'text',
          autoComplete: 'name',
          required: true,
        },
        {
          name: 'phone',
          label: dict.web.auth.phone,
          type: 'tel',
          placeholder: '+249 9XX XXX XXX',
          autoComplete: 'tel',
          required: true,
        },
        {
          name: 'password',
          label: dict.web.auth.password,
          type: 'password',
          autoComplete: 'new-password',
          required: true,
        },
      ]}
      submitLabel={dict.web.auth.submit}
      footer={
        <div className="text-small text-ink-mute">
          {dict.web.auth.haveAccount}{' '}
          <Link href={`/${locale}/login`} className="text-navy font-semibold hover:text-amber">
            {dict.web.auth.loginTitle}
          </Link>
        </div>
      }
      onSubmit={async ({ values }) => {
        const name = (values.name ?? '').trim();
        const phone = (values.phone ?? '').replace(/\s+/g, '').trim();
        const password = values.password ?? '';
        if (password.length < 8) {
          throw new Error(
            locale === 'ar'
              ? 'كلمة المرور يجب ألا تقل عن ٨ أحرف.'
              : 'Password must be at least 8 characters.',
          );
        }
        const result = await registerAction({ name, phone, password }, locale);
        if (!result.ok) {
          throw new Error(locale === 'ar' ? result.error.message_ar : result.error.message_en);
        }
        router.replace(
          `/${locale}/verify-otp?phone=${encodeURIComponent(phone)}&purpose=REGISTER`,
        );
      }}
    />
  );
}
