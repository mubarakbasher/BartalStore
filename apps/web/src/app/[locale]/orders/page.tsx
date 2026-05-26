import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { OrdersShell } from '@/components/orders/OrdersShell';
import { OrdersHistoryContent } from './OrdersHistoryContent';

interface PageProps {
  params: { locale: string };
}

export default function OrdersPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return (
    <OrdersShell breadcrumb={dict.web.orders.breadcrumbHistory}>
      <OrdersHistoryContent locale={locale} dict={dict} />
    </OrdersShell>
  );
}
