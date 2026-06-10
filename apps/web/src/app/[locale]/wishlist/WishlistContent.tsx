'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useCart } from '@/lib/state/cart-store';
import { removeFromWishlistAction } from '@/lib/wishlist/actions';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import type { WishlistItem } from '@bartal/shared';

interface Props {
  locale: Locale;
  dict: Dictionary;
  initialItems: WishlistItem[];
}

export function WishlistContent({ locale, dict, initialItems }: Props) {
  const isAr = locale === 'ar';
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [, startTransition] = useTransition();
  const addToCart = useCart((s) => s.add);
  const t = dict.web.wishlist;

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId)); // optimistic
    startTransition(async () => {
      const res = await removeFromWishlistAction(productId, locale);
      if (!res.ok) {
        // revert on failure
        setItems(initialItems);
      }
    });
  };

  const handleAdd = (item: WishlistItem) => {
    addToCart(
      {
        id: item.productId,
        slug: item.slug,
        name_ar: item.name_ar,
        name_en: item.name_en,
        price: item.price,
        images: item.imageUrl ? [{ url: item.imageUrl }] : [],
        stock: 99,
      } as never,
      1,
    );
  };

  const handleAddAll = () => {
    items.forEach((it) => handleAdd(it));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-h1 font-bold text-ink mb-1">{t.title}</h1>
          <div className="text-small text-ink-mute">
            {tt(t.countSaved, {
              count: isAr ? items.length.toLocaleString('ar-EG') : items.length,
            })}
          </div>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleAddAll}
            className="text-small text-amber font-bold hover:underline"
          >
            {t.addAllToCart}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-line rounded-bartal p-8 text-center">
          <div className="text-h2 font-bold text-ink mb-1.5">{t.emptyTitle}</div>
          <div className="text-small text-ink-mute mb-4">{t.emptyHint}</div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center bg-amber text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:opacity-90"
          >
            {t.browseProducts}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {items.map((item) => (
            <WishlistCard
              key={item.productId}
              item={item}
              locale={locale}
              dict={dict}
              onAddToCart={handleAdd}
              onRemove={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
