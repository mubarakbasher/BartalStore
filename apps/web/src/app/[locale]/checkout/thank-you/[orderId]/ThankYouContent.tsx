'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import type { Order } from '@bartal/shared';
import { useCheckout } from '@/lib/state/checkout-store';
import { findBankById, BANKS } from '@/lib/state/checkout-banks';
import { ThankYouHero } from '@/components/checkout/ThankYouHero';
import { BankInstructionsCard } from '@/components/checkout/BankInstructionsCard';
import { ReceiptDropzone } from '@/components/checkout/ReceiptDropzone';
import { OrderStatusTimeline } from '@/components/checkout/OrderStatusTimeline';
import {
  ProductPlaceholder,
  hueForProduct,
} from '@/components/ProductPlaceholder';
import { PriceTag } from '@/components/PriceTag';
import { DownloadIcon } from '@/components/Icons';
import { fmtSDG } from '@/design/tokens';

interface ThankYouContentProps {
  locale: Locale;
  dict: Dictionary;
  orderId: string;
  order: Order | null;
}

export function ThankYouContent({ locale, dict, order }: ThankYouContentProps) {
  const isAr = locale === 'ar';
  const selectedBankId = useCheckout((s) => s.selectedBankId);
  const t = dict.web.checkout.thankYou;

  // No fabricated fallback: if the order couldn't be loaded (stale link,
  // foreign id), say so instead of rendering demo data as a real receipt.
  if (!order) {
    const f = t.loadFailed;
    const waNumber = dict.web.contact.channels.whatsapp.value.replace(/[\s+]/g, '');
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16">
        <div className="bg-white border border-line rounded-bartal-lg p-8 text-center">
          <h1 className="text-h2 font-bold text-ink">{f.title}</h1>
          <p className="text-small text-ink-mute leading-relaxed mt-3">{f.body}</p>
          <div className="flex flex-col gap-2 mt-6">
            <Link
              href={`/${locale}/orders`}
              className="inline-flex items-center justify-center h-11 bg-navy text-white rounded-bartal font-bold hover:bg-navy-deep transition-colors text-small"
            >
              {f.goToOrders}
            </Link>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-11 bg-transparent border border-line text-ink rounded-bartal font-semibold hover:bg-sand transition-colors text-small"
            >
              {f.contactSupport}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const items = order.items.map((it) => ({
    product_id: it.productId,
    slug: it.slug,
    name_ar: it.name_ar,
    name_en: it.name_en,
    unit_price: it.unitPrice,
    image_url: it.imageUrl,
    quantity: it.quantity,
  }));
  const subtotal = order.subtotal;
  const deliveryFee = order.deliveryFee;
  const total = order.total;
  const reference = order.number;
  const address = order.shippingAddress;
  const bank = findBankById(selectedBankId) ?? BANKS[0];
  const firstName = address ? address.name.split(' ')[0] ?? address.name : '';
  const unit = isAr ? 'ج.س' : 'SDG';

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <ThankYouHero
        customerFirstName={firstName}
        orderId={reference}
        locale={locale}
        dict={dict}
      />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 mt-5 items-start">
        {/* LEFT — bank instructions + receipt + items summary */}
        <div className="space-y-4 min-w-0">
          <BankInstructionsCard
            bank={bank}
            total={total}
            reference={reference}
            locale={locale}
            dict={dict}
          />
          <ReceiptDropzone dict={dict} />

          {/* Items summary card */}
          <div className="bg-white border border-line rounded-bartal-lg p-5">
            <h3 className="text-h3 font-semibold text-ink mb-3.5">
              {t.summary.title}
            </h3>

            {items.length === 0 ? (
              <div className="text-small text-ink-mute leading-relaxed">
                {dict.web.cart.empty}
              </div>
            ) : (
              <div>
                {items.map((line, i) => {
                  const name = isAr ? line.name_ar : line.name_en;
                  const isLast = i === items.length - 1;
                  return (
                    <div
                      key={line.product_id}
                      className={`flex items-center gap-3.5 pb-3.5 ${
                        isLast ? '' : 'border-b border-line mb-3.5'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-bartal overflow-hidden bg-sand border border-line shrink-0">
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
                        <div className="text-small font-semibold text-ink truncate">
                          {name}
                        </div>
                        <div className="text-micro text-ink-mute mt-0.5 normal-case tracking-normal">
                          {tt(t.summary.qtyLabel, { n: line.quantity })}
                        </div>
                      </div>
                      <PriceTag
                        amount={line.unit_price * line.quantity}
                        locale={locale}
                        size={14}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-3 mt-1 border-t border-line space-y-1">
              <SumRow
                label={t.summary.subtotal}
                value={fmtSDG(subtotal, locale)}
                unit={unit}
              />
              <SumRow
                label={t.summary.deliveryFee}
                value={fmtSDG(deliveryFee, locale)}
                unit={unit}
              />
              <div className="border-t border-line my-2" />
              <SumRow
                label={t.summary.total}
                value={fmtSDG(total, locale)}
                unit={unit}
                big
                amber
              />
            </div>
          </div>
        </div>

        {/* RIGHT — timeline + delivery + actions */}
        <aside className="space-y-4 lg:w-full lg:max-w-[360px]">
          <div className="bg-white border border-line rounded-bartal-lg p-5">
            <h3 className="text-h3 font-semibold text-ink mb-3.5">
              {t.timeline.title}
            </h3>
            <OrderStatusTimeline
              steps={t.timeline.steps.map((s, i) => ({
                label: s.label,
                eta: s.eta,
                current: i === 0,
              }))}
            />
          </div>

          <div className="bg-white border border-line rounded-bartal-lg p-5">
            <h3 className="text-h3 font-semibold text-ink mb-2.5">
              {t.delivery.title}
            </h3>
            {address && (
              <>
                <div className="text-small font-semibold text-ink">
                  {address.name}
                </div>
                <div className="text-small text-ink-mute mt-1 leading-relaxed">
                  {isAr ? address.line_ar : address.line_en} —{' '}
                  {isAr ? address.city_ar : address.city_en}
                </div>
                <div className="text-micro text-amber font-semibold mt-1.5">
                  ◉ {isAr ? address.landmark_ar : address.landmark_en}
                </div>
                <div className="text-micro text-ink-mute mt-2 normal-case tracking-normal">
                  {t.delivery.phoneLabel}{' '}
                  <span className="font-mono" dir="ltr">
                    {address.phone}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`/${locale}/orders`}
              className="inline-flex items-center justify-center h-11 bg-navy text-white rounded-bartal font-bold hover:bg-navy-deep transition-colors text-small"
            >
              {t.actions.track}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center h-11 bg-transparent border border-line text-ink rounded-bartal font-semibold hover:bg-sand transition-colors text-small"
            >
              {t.actions.continueShopping}
            </Link>
            <button
              type="button"
              disabled
              title={t.actions.comingSoon}
              className="inline-flex items-center justify-center gap-1.5 h-10 bg-transparent text-ink-mute font-medium text-small cursor-not-allowed opacity-60"
            >
              <DownloadIcon size={14} />
              {t.actions.downloadInvoice}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SumRow({
  label,
  value,
  unit,
  big,
  amber,
}: {
  label: string;
  value: string;
  unit: string;
  big?: boolean;
  amber?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-0.5">
      <div
        className={
          big ? 'text-h3 font-bold text-ink' : 'text-small text-ink-mute'
        }
      >
        {label}
      </div>
      <div
        className={`tabular-nums ${
          big
            ? `${amber ? 'text-amber' : 'text-ink'} font-bold`
            : 'text-small text-ink'
        }`}
        style={big ? { fontSize: 18 } : undefined}
      >
        {value}
        <span className="text-micro font-medium opacity-70 ms-1">{unit}</span>
      </div>
    </div>
  );
}
