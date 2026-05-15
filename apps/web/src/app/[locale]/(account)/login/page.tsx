import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AuthCard } from '@/components/AuthCard';

interface PageProps {
  params: { locale: string };
}

export default function LoginPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <AuthCard
      locale={locale}
      title={dict.web.auth.loginTitle}
      subtitle={dict.web.auth.loginSubtitle}
      fields={[
        { name: 'phone', label: dict.web.auth.phone, type: 'tel', placeholder: '+249 9XX XXX XXX' },
        { name: 'password', label: dict.web.auth.password, type: 'password' },
      ]}
      submitLabel={dict.web.auth.submit}
      footer={
        <>
          <Link
            href={`/${locale}/forgot-password`}
            className="text-small text-amber hover:text-amber-soft font-semibold"
          >
            {dict.web.auth.forgot}
          </Link>
          <div className="mt-4 text-small text-ink-mute">
            {dict.web.auth.noAccount}{' '}
            <Link
              href={`/${locale}/register`}
              className="text-navy font-semibold hover:text-amber"
            >
              {dict.web.auth.registerTitle}
            </Link>
          </div>
        </>
      }
      comingSoonNotice={dict.web.auth.comingSoon}
    />
  );
}
