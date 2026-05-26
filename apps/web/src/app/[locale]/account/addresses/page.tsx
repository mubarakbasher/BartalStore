import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebAccountLayout } from '@/components/account/WebAccountLayout';
import { AccountAddressesContent } from './AccountAddressesContent';

interface PageProps {
  params: { locale: string };
}

export default function AccountAddressesPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <WebAccountLayout locale={locale} dict={dict} active="addresses">
      <AccountAddressesContent locale={locale} dict={dict} />
    </WebAccountLayout>
  );
}
