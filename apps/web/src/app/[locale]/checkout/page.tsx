import { notFound, redirect } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';

interface PageProps {
  params: { locale: string };
}

/**
 * The old single-page checkout preview is retired. The real flow is the
 * multi-step `address → bank → review` wizard; send any hit on `/checkout`
 * (including stale bookmarks) straight to step 1.
 */
export default function CheckoutPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  redirect(`/${locale}/checkout/address`);
}
