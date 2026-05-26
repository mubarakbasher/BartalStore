import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary, tt } from '@/lib/i18n/dictionary';
import { OrdersShell } from '@/components/orders/OrdersShell';
import { WriteReviewContent } from './WriteReviewContent';

interface PageProps {
  params: { locale: string; id: string };
}

export default function WriteReviewPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const orderId = decodeURIComponent(params.id);
  const breadcrumb = tt(dict.web.orders.breadcrumbReview, { number: orderId });
  return (
    <OrdersShell breadcrumb={breadcrumb}>
      <WriteReviewContent locale={locale} dict={dict} orderId={orderId} />
    </OrdersShell>
  );
}
