'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useCart } from '@/lib/state/cart-store';
import { useDeliveryZones } from '@/lib/api/queries';
import { ProductPlaceholder, hueForProduct } from './ProductPlaceholder';
import { PriceTag } from './PriceTag';
import { EmptyState } from './EmptyState';
import { MinusIcon, PlusIcon } from './Icons';
import { fmtSDG } from '@/design/tokens';

interface CartViewProps {
  locale: Locale;
  dict: Dictionary;
}

export function CartView({ locale, dict }: CartViewProps) {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const zones = useDeliveryZones(locale);
  const [zoneIdx, setZoneIdx] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return <div className="max-w-[1100px] mx-auto px-6 py-16" />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="bg-white border border-line rounded-bartal-lg">
          <EmptyState
            title={dict.web.cart.empty}
            hint={dict.web.cart.emptyHint}
            action={
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center h-11 px-5 bg-amber text-white rounded-bartal font-semibold hover:bg-[#B57208]"
              >
                {dict.web.cart.continueShopping}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const activeZone = zones.data?.[zoneIdx];
  const deliveryFee =
    activeZone && activeZone.free_above_sdg !== null && subtotal >= activeZone.free_above_sdg
      ? 0
      : activeZone?.fee_sdg ?? 0;
  const total = subtotal + deliveryFee;
  const freeDelivery = activeZone && deliveryFee === 0 && subtotal > 0;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-6">
      <div>
        <h1 className="text-h1 font-bold text-ink mb-4">{dict.web.cart.title}</h1>
        <div className="bg-white border border-line rounded-bartal-lg divide-y divide-line">
          {items.map((line) => {
            const name = locale === 'ar' ? line.name_ar : line.name_en;
            return (
              <div key={line.product_id} className="flex gap-4 p-4">
                <Link
                  href={`/${locale}/products/${line.slug}`}
                  className="shrink-0 w-20 h-20 bg-sand rounded-bartal overflow-hidden border border-line"
                >
                  {line.image_url ? (
                    <img src={line.image_url} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <ProductPlaceholder label={line.name_en} hue={hueForProduct(line.slug)} />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/products/${line.slug}`}
                    className="text-small font-semibold text-ink hover:text-navy line-clamp-2"
                  >
                    {name}
                  </Link>
                  <div className="mt-1">
                    <PriceTag
                      amount={line.unit_price}
                      locale={locale}
                      size={13}
                      color="#D4860B"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center bg-sand rounded-bartal">
                      <button
                        onClick={() => setQuantity(line.product_id, line.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-ink hover:bg-amber-tint rounded-s-bartal"
                        aria-label="−"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span className="px-3 text-small font-bold tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(line.product_id, line.quantity + 1)}
                        disabled={line.quantity >= line.stock}
                        className="w-8 h-8 flex items-center justify-center text-ink hover:bg-amber-tint rounded-e-bartal disabled:opacity-40"
                        aria-label="+"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(line.product_id)}
                      className="text-micro text-danger font-semibold hover:underline"
                    >
                      {locale === 'ar' ? 'حذف' : 'Remove'}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <PriceTag
                    amount={line.unit_price * line.quantity}
                    locale={locale}
                    size={15}
                    color="#0B1930"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <aside>
        <div className="bg-white border border-line rounded-bartal-lg p-5 sticky top-32">
          <div className="text-h3 font-semibold text-ink mb-4">
            {locale === 'ar' ? 'ملخص الطلب' : 'Order summary'}
          </div>

          {/* Delivery zone picker */}
          {zones.data && (
            <div className="mb-4">
              <div className="text-micro font-semibold text-ink mb-2 uppercase tracking-wider">
                {dict.web.cart.delivery.to}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {zones.data.map((z, i) => {
                  const on = i === zoneIdx;
                  return (
                    <button
                      key={z.zone}
                      onClick={() => setZoneIdx(i)}
                      className={`px-3 h-8 text-micro font-semibold rounded-full transition-colors normal-case tracking-normal ${
                        on
                          ? 'bg-amber text-white'
                          : 'bg-sand text-ink-mute hover:text-ink'
                      }`}
                    >
                      {locale === 'ar' ? z.name_ar : z.name_en}
                    </button>
                  );
                })}
              </div>
              {activeZone && (
                <div className="text-micro text-ink-mute mt-2 normal-case tracking-normal">
                  {locale === 'ar'
                    ? `الوصول المتوقع ${activeZone.estimated_days_min}–${activeZone.estimated_days_max} أيام`
                    : `Arrives in ${activeZone.estimated_days_min}–${activeZone.estimated_days_max} days`}
                </div>
              )}
            </div>
          )}

          <Row label={dict.web.cart.subtotal} value={fmtSDG(subtotal, locale)} unit={locale === 'ar' ? 'ج.س' : 'SDG'} />
          <Row
            label={dict.web.cart.deliveryFee}
            value={freeDelivery ? dict.web.cart.delivery.free : fmtSDG(deliveryFee, locale)}
            unit={freeDelivery ? '' : locale === 'ar' ? 'ج.س' : 'SDG'}
            valueClass={freeDelivery ? 'text-ok font-bold' : ''}
          />

          {activeZone?.free_above_sdg && deliveryFee > 0 && subtotal < activeZone.free_above_sdg && (
            <div className="mt-3 mb-1 text-micro text-amber bg-amber-tint rounded-bartal p-2.5 leading-relaxed normal-case tracking-normal">
              {locale === 'ar'
                ? `أضف ${fmtSDG(activeZone.free_above_sdg - subtotal, locale)} ج.س للحصول على توصيل مجاني`
                : `Add ${fmtSDG(activeZone.free_above_sdg - subtotal, 'en')} SDG more for free delivery`}
            </div>
          )}

          <div className="border-t border-line my-3" />
          <Row
            label={dict.web.cart.total}
            value={fmtSDG(total, locale)}
            unit={locale === 'ar' ? 'ج.س' : 'SDG'}
            big
          />

          <Link
            href={`/${locale}/checkout`}
            className="mt-5 inline-flex w-full items-center justify-center h-12 bg-amber text-white rounded-bartal font-bold hover:bg-[#B57208]"
          >
            {dict.web.cart.checkout}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="mt-2 inline-flex w-full items-center justify-center h-11 text-small font-semibold text-navy hover:bg-sand rounded-bartal"
          >
            {dict.web.cart.continueShopping}
          </Link>

          {/* Payment methods note */}
          <div className="mt-5 pt-5 border-t border-line">
            <div className="text-micro font-semibold text-ink mb-2 uppercase tracking-wider">
              {locale === 'ar' ? 'طرق الدفع' : 'Payment'}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-small text-ink-mute normal-case tracking-normal">
                <div className="w-2 h-2 rounded-full bg-amber" />
                <span>{locale === 'ar' ? 'تحويل بنكي' : 'Bank transfer'}</span>
              </div>
              <div className="flex items-center gap-2 text-small text-ink-mute normal-case tracking-normal">
                <div className="w-2 h-2 rounded-full bg-navy" />
                <span>{locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on delivery'}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
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
      <div className={`${big ? 'text-body font-bold text-ink' : 'text-small text-ink-mute'}`}>
        {label}
      </div>
      <div className={`tabular-nums ${big ? 'text-h2 font-bold text-ink' : 'text-small text-ink'} ${valueClass}`}>
        {value}
        {unit && <span className="text-micro font-medium opacity-70 ms-1">{unit}</span>}
      </div>
    </div>
  );
}
