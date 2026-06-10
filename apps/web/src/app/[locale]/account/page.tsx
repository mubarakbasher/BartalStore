import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebAccountLayout } from '@/components/account/WebAccountLayout';
import { getProfile } from '@/lib/account/server';
import { getOrders } from '@/lib/orders/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { Order, UserProfile } from '@bartal/shared';
import { AccountDashboardContent } from './AccountDashboardContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function AccountPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  let profile: UserProfile | null = null;
  let orders: Order[] = [];
  try {
    [profile, orders] = await Promise.all([getProfile(locale), getOrders(locale)]);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return (
    <WebAccountLayout locale={locale} dict={dict} active="dashboard">
      <AccountDashboardContent locale={locale} dict={dict} profile={profile} orders={orders} />
    </WebAccountLayout>
  );
}
