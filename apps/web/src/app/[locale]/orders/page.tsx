import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { OrdersShell } from '@/components/orders/OrdersShell';
import { getOrders } from '@/lib/orders/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { Order } from '@bartal/shared';
import { OrdersHistoryContent } from './OrdersHistoryContent';

interface PageProps {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  let orders: Order[] = [];
  try {
    orders = await getOrders(locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return (
    <OrdersShell breadcrumb={dict.web.orders.breadcrumbHistory}>
      <OrdersHistoryContent locale={locale} dict={dict} orders={orders} />
    </OrdersShell>
  );
}
