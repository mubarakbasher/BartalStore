import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebAccountLayout } from '@/components/account/WebAccountLayout';
import { AccountSecurityContent } from './AccountSecurityContent';

interface PageProps {
  params: { locale: string };
}

export default function AccountSecurityPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <WebAccountLayout locale={locale} dict={dict} active="security">
      <AccountSecurityContent locale={locale} dict={dict} />
    </WebAccountLayout>
  );
}
