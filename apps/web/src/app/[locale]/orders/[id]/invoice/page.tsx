import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { getOrder } from '@/lib/orders/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { Order } from '@bartal/shared';
import { InvoicePrintContent } from './InvoicePrintContent';

interface PageProps {
  params: { locale: string; id: string };
}

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const orderId = decodeURIComponent(params.id);

  let order: Order | null = null;
  try {
    order = await getOrder(orderId, locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return <InvoicePrintContent locale={locale} dict={dict} order={order} />;
}
