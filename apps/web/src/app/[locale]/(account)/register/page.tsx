import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AuthCard } from '@/components/AuthCard';

interface PageProps {
  params: { locale: string };
}

export default function RegisterPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <AuthCard
      locale={locale}
      title={dict.web.auth.registerTitle}
      subtitle={dict.web.auth.registerSubtitle}
      fields={[
        { name: 'name', label: dict.web.auth.fullName, type: 'text' },
        { name: 'phone', label: dict.web.auth.phone, type: 'tel', placeholder: '+249 9XX XXX XXX' },
        { name: 'password', label: dict.web.auth.password, type: 'password' },
      ]}
      submitLabel={dict.web.auth.submit}
      footer={
        <div className="text-small text-ink-mute">
          {dict.web.auth.haveAccount}{' '}
          <Link
            href={`/${locale}/login`}
            className="text-navy font-semibold hover:text-amber"
          >
            {dict.web.auth.loginTitle}
          </Link>
        </div>
      }
      comingSoonNotice={dict.web.auth.comingSoon}
    />
  );
}
