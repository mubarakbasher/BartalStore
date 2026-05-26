import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary, tt } from '@/lib/i18n/dictionary';
import { OrdersShell } from '@/components/orders/OrdersShell';
import { OrderDetailContent } from './OrderDetailContent';

interface PageProps {
  params: { locale: string; id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const orderId = decodeURIComponent(params.id);
  const breadcrumb = tt(dict.web.orders.breadcrumbDetail, { number: orderId });
  return (
    <OrdersShell breadcrumb={breadcrumb}>
      <OrderDetailContent locale={locale} dict={dict} orderId={orderId} />
    </OrdersShell>
  );
}
