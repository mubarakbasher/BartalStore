import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebAccountLayout } from '@/components/account/WebAccountLayout';
import { HydrateAddresses } from '@/components/account/HydrateAddresses';
import { listAddresses } from '@/lib/addresses/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { Address } from '@bartal/shared';
import { AccountAddressesContent } from './AccountAddressesContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AccountAddressesPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  let addresses: Address[] = [];
  try {
    addresses = await listAddresses(locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return (
    <WebAccountLayout locale={locale} dict={dict} active="addresses">
      <HydrateAddresses items={addresses} />
      <AccountAddressesContent locale={locale} dict={dict} initialAddresses={addresses} />
    </WebAccountLayout>
  );
}
