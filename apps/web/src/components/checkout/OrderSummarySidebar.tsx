'use client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useCart } from '@/lib/state/cart-store';
import { useOrderTotal } from '@/lib/state/use-order-total';
import { ProductPlaceholder, hueForProduct } from '@/components/ProductPlaceholder';
import { fmtSDG } from '@/design/tokens';

interface OrderSummarySidebarProps {
  locale: Locale;
  dict: Dictionary;
}

export function OrderSummarySidebar({ locale, dict }: OrderSummarySidebarProps) {
  const items = useCart((s) => s.items);
  const totalQuantity = useCart((s) => s.totalQuantity());
  const { subtotal, deliveryFee, total, freeDelivery, activeZone, hydrated } =
    useOrderTotal(locale);
  const unit = locale === 'ar' ? 'ج.س' : 'SDG';

  if (!hydrated) {
    return <aside aria-hidden className="w-full lg:w-[360px]" />;
  }

  return (
    <aside className="w-full lg:w-[360px]">
      <div className="bg-white border border-line rounded-bartal-lg p-5 sticky top-32">
        <div className="text-h3 font-semibold text-ink mb-4">
          {dict.web.checkout.summary.title}
        </div>

        {items.length > 0 ? (
          <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pe-1">
            {items.map((line) => {
              const name = locale === 'ar' ? line.name_ar : line.name_en;
              return (
                <div key={line.product_id} className="flex items-center gap-3">
                  <div className="shrink-0 w-12 h-12 bg-sand rounded-bartal overflow-hidden border border-line">
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
                  <div className="flex-1 min-w-0">
                    <div className="text-small font-semibold text-ink truncate">{name}</div>
                    <div className="text-micro text-ink-mute font-mono normal-case tracking-normal">
                      ×{line.quantity}
                    </div>
                  </div>
                  <div className="text-small font-bold text-ink tabular-nums shrink-0">
                    {fmtSDG(line.unit_price * line.quantity, locale)}
                    <span className="ms-1 text-micro font-medium opacity-70">{unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-sand border border-line rounded-bartal p-3 mb-4 text-small text-ink-mute leading-relaxed">
            {dict.web.cart.empty}
          </div>
        )}

        {activeZone && (
          <div className="mb-3 bg-sand border border-line rounded-bartal p-3">
            <div className="text-micro font-semibold text-ink-mute uppercase tracking-wider mb-1">
              {dict.web.cart.delivery.to}
            </div>
            <div className="text-small font-semibold text-ink">
              {locale === 'ar' ? activeZone.name_ar : activeZone.name_en}
            </div>
            <div className="text-micro text-ink-mute mt-0.5 normal-case tracking-normal">
              {tt(dict.web.cart.delivery.estimated, {
                days: `${activeZone.estimated_days_min}–${activeZone.estimated_days_max}`,
              })}
            </div>
          </div>
        )}

        <Row
          label={dict.web.checkout.summary.subtotal}
          value={fmtSDG(subtotal, locale)}
          unit={unit}
        />
        <Row
          label={dict.web.checkout.summary.deliveryFee}
          value={freeDelivery ? dict.web.cart.delivery.free : fmtSDG(deliveryFee, locale)}
          unit={freeDelivery ? '' : unit}
          valueClass={freeDelivery ? 'text-ok font-bold' : ''}
        />

        {activeZone?.free_above_sdg &&
          deliveryFee > 0 &&
          subtotal < activeZone.free_above_sdg && (
            <div className="mt-3 mb-1 text-micro text-amber bg-amber-tint rounded-bartal p-2.5 leading-relaxed normal-case tracking-normal">
              {locale === 'ar'
                ? `أضف ${fmtSDG(activeZone.free_above_sdg - subtotal, locale)} ج.س للحصول على توصيل مجاني`
                : `Add ${fmtSDG(activeZone.free_above_sdg - subtotal, 'en')} SDG more for free delivery`}
            </div>
          )}

        <div className="border-t border-line my-3" />
        <Row
          label={dict.web.checkout.summary.total}
          value={fmtSDG(total, locale)}
          unit={unit}
          big
        />

        {items.length > 0 && (
          <div className="mt-4 text-micro text-ink-mute normal-case tracking-normal">
            {tt(dict.web.checkout.summary.itemsCount, {
              quantity: totalQuantity,
              types: items.length,
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  unit,
  big,
  valueClass = '',
}: {
  label: string;
  value: string;
  unit: string;
  big?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <div className={big ? 'text-body font-bold text-ink' : 'text-small text-ink-mute'}>
        {label}
      </div>
      <div
        className={`tabular-nums ${
          big ? 'text-h2 font-bold text-ink' : 'text-small text-ink'
        } ${valueClass}`}
      >
        {value}
        {unit && <span className="text-micro font-medium opacity-70 ms-1">{unit}</span>}
      </div>
    </div>
  );
}
