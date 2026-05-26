import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { OrdersShell } from '@/components/orders/OrdersShell';
import { ReceiptUploadContent } from './ReceiptUploadContent';

interface PageProps {
  params: { locale: string; id: string };
}

export default function ReceiptUploadPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const orderId = decodeURIComponent(params.id);
  return (
    <OrdersShell breadcrumb={dict.web.orders.breadcrumbReceipt}>
      <ReceiptUploadContent locale={locale} dict={dict} orderId={orderId} />
    </OrdersShell>
  );
}
