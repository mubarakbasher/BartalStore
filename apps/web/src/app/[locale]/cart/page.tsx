import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { CartView } from '@/components/CartView';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CartPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return <CartView locale={locale} dict={dict} />;
}
