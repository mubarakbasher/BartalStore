'use client';
import type { WishlistItem } from '@bartal/shared';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { PriceTag } from '@/components/PriceTag';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';
import { BARTAL } from '@/design/tokens';

interface WishlistCardProps {
  item: WishlistItem;
  locale: Locale;
  dict: Dictionary;
  onAddToCart: (item: WishlistItem) => void;
  onRemove: (productId: string) => void;
}

export function WishlistCard({ item, locale, dict, onAddToCart, onRemove }: WishlistCardProps) {
  const isAr = locale === 'ar';
  const name = isAr ? item.name_ar : item.name_en;
  return (
    <article className="bg-white border border-line rounded-bartal overflow-hidden relative flex flex-col">
      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        className="absolute top-2 end-2 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-amber text-[18px] hover:bg-amber-tint transition-colors"
        aria-label={dict.web.wishlist.remove}
      >
        ♥
      </button>
      <div className="h-40">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <ProductPlaceholder label={item.name_en} hue={item.hue as PlaceholderHue} />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="text-[11px] text-ink-mute uppercase tracking-wider">{item.brand}</div>
        <div className="text-small font-semibold text-ink line-clamp-1">{name}</div>
        <PriceTag amount={item.price} locale={locale} size={14} color={BARTAL.amber} />
        {item.priceDropped && (
          <span className="self-start px-2 py-0.5 rounded-full bg-danger/15 text-danger text-[11px] font-bold">
            {dict.web.wishlist.priceDropped}
          </span>
        )}
        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="mt-2 w-full bg-navy text-white rounded-bartal py-2 text-small font-bold hover:bg-navy-deep transition-colors"
        >
          {dict.web.wishlist.addToCart}
        </button>
      </div>
    </article>
  );
}
