import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { CheckoutShell } from '@/components/checkout/CheckoutShell';
import { CheckoutBankStep } from './CheckoutBankStep';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutBankPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <CheckoutShell step={2} locale={locale} dict={dict}>
      <CheckoutBankStep locale={locale} dict={dict} />
    </CheckoutShell>
  );
}
