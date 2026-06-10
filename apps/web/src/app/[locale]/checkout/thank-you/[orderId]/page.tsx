import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { getOrder } from '@/lib/orders/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { Order } from '@bartal/shared';
import { ThankYouContent } from './ThankYouContent';

interface PageProps {
  params: { locale: string; orderId: string };
}

export const dynamic = 'force-dynamic';

export default async function ThankYouPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const orderId = decodeURIComponent(params.orderId);

  let order: Order | null = null;
  try {
    order = await getOrder(orderId, locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return <ThankYouContent locale={locale} dict={dict} orderId={orderId} order={order} />;
}
