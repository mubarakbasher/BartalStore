'use client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useCart } from '@/lib/state/cart-store';
import { ProductPlaceholder, hueForProduct } from '@/components/ProductPlaceholder';
import { fmtSDG } from '@/design/tokens';

interface ReviewItemsListProps {
  locale: Locale;
  dict: Dictionary;
}

export function ReviewItemsList({ locale, dict }: ReviewItemsListProps) {
  const items = useCart((s) => s.items);
  const unit = locale === 'ar' ? 'ج.س' : 'SDG';
  const skuPrefix = dict.web.checkout.review.items.skuPrefix;
  const qtyPrefix = dict.web.checkout.review.items.qtyPrefix;

  if (items.length === 0) {
    return (
      <div className="text-small text-ink-mute leading-relaxed">
        {dict.web.checkout.review.items.empty}
      </div>
    );
  }

  return (
    <div>
      {items.map((line, i) => {
        const name = locale === 'ar' ? line.name_ar : line.name_en;
        const sku = `${skuPrefix}${line.slug.toUpperCase()}`;
        const lineTotal = line.unit_price * line.quantity;
        const isLast = i === items.length - 1;
        return (
          <div
            key={line.product_id}
            className={`grid grid-cols-[48px_1fr_auto_auto] items-center gap-3.5 py-2.5 ${
              isLast ? '' : 'border-b border-line'
            }`}
          >
            <div className="w-12 h-12 rounded-bartal overflow-hidden bg-sand border border-line">
              {line.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.image_url}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProductPlaceholder
                  label={line.name_en}
                  hue={hueForProduct(line.slug)}
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-small font-semibold text-ink truncate">
                {name}
              </div>
              <div
                className="text-micro text-ink-mute mt-0.5 font-mono normal-case tracking-normal truncate"
                dir="ltr"
              >
                {sku}
              </div>
            </div>
            <div className="text-micro text-ink-mute font-mono normal-case tracking-normal">
              {qtyPrefix}
              {line.quantity}
            </div>
            <div className="text-small font-bold text-ink tabular-nums text-end min-w-[90px]">
              {fmtSDG(lineTotal, locale)}
              <span className="ms-1 text-micro font-medium opacity-70">{unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
