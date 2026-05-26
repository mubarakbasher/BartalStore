import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { InvoicePrintContent } from './InvoicePrintContent';

interface PageProps {
  params: { locale: string; id: string };
}

export default function InvoicePage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const orderId = decodeURIComponent(params.id);
  return <InvoicePrintContent locale={locale} dict={dict} orderId={orderId} />;
}
