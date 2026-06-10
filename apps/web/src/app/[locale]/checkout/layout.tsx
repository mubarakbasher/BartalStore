import type { ReactNode } from 'react';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { listAddresses } from '@/lib/addresses/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import { HydrateAddresses } from '@/components/account/HydrateAddresses';
import type { Address } from '@bartal/shared';

interface LayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default async function CheckoutLayout({ children, params }: LayoutProps) {
  const locale = (isLocale(params.locale) ? params.locale : 'ar') as Locale;

  let addresses: Address[] = [];
  try {
    addresses = await listAddresses(locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return (
    <>
      <HydrateAddresses items={addresses} />
      {children}
    </>
  );
}
