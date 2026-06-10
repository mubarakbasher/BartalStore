import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebAccountLayout } from '@/components/account/WebAccountLayout';
import { AccountPreferencesContent } from './AccountPreferencesContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountPreferencesPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <WebAccountLayout locale={locale} dict={dict} active="preferences">
      <AccountPreferencesContent locale={locale} dict={dict} />
    </WebAccountLayout>
  );
}
