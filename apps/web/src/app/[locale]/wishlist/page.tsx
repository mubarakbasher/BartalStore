import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { OrdersShell } from '@/components/orders/OrdersShell';
import { listWishlist } from '@/lib/wishlist/server';
import { NotAuthenticatedError } from '@/lib/api/action-result';
import type { WishlistItem } from '@bartal/shared';
import { WishlistContent } from './WishlistContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export default async function WishlistPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  let initialItems: WishlistItem[] = [];
  try {
    initialItems = await listWishlist(locale);
  } catch (err) {
    if (!(err instanceof NotAuthenticatedError)) throw err;
  }

  return (
    <OrdersShell breadcrumb={dict.web.wishlist.breadcrumb}>
      <WishlistContent locale={locale} dict={dict} initialItems={initialItems} />
    </OrdersShell>
  );
}
