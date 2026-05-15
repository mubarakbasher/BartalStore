import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { LoginRequired } from '@/components/LoginRequired';

interface PageProps {
  params: { locale: string };
}

export default function WishlistPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return <LoginRequired locale={locale} dict={dict} pageTitle={dict.web.account.wishlist} />;
}
