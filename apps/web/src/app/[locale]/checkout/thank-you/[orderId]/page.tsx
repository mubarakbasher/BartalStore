import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { ThankYouContent } from './ThankYouContent';

interface PageProps {
  params: { locale: string; orderId: string };
}

export default function ThankYouPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <ThankYouContent
      locale={locale}
      dict={dict}
      orderId={decodeURIComponent(params.orderId)}
    />
  );
}
