'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import type { Order } from '@bartal/shared';
import { StatusPill } from '@/components/orders/StatusPill';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { PriceTag } from '@/components/PriceTag';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';
import { BARTAL, fmtSDG } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
  order: Order | null;
}

function formatDateTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function OrderDetailContent({ locale, dict, order }: Props) {
  const isAr = locale === 'ar';
  const t = dict.web.orders.detail;

  if (!order) {
    return (
      <div className="bg-white border border-line rounded-bartal p-8 text-center">
        <div className="text-h2 font-bold text-ink mb-2">{dict.web.orders.history.empty}</div>
        <Link
          href={`/${locale}/orders`}
          className="inline-flex items-center justify-center bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
        >
          {dict.web.orders.history.title}
        </Link>
      </div>
    );
  }

  const city = isAr ? order.shippingAddress.city_ar : order.shippingAddress.city_en;
  const isCancelled = order.status === 'cancelled';
  const canUploadReceipt =
    order.payment.method === 'bank_transfer' && !order.payment.receipt && !isCancelled;
  const canReview = order.status === 'delivered';

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <div className="text-h1 font-bold text-ink">{dict.web.orders.history.title.split(' ')[0]}</div>
          <span className="text-h1 font-mono text-ink">{order.number}</span>
          <StatusPill status={order.status} dict={dict} />
        </div>
        <div className="text-small text-ink-mute">
          {tt(t.placedAt, { date: formatDateTime(order.placedAt, locale) })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
        <div className="space-y-4 min-w-0">
          <div className="bg-white border border-line rounded-bartal p-4">
            <h2 className="text-h3 font-semibold text-ink mb-4">{t.statusCard}</h2>
            <OrderTimeline
              steps={order.timeline}
              dict={dict}
              locale={locale}
              currentStatus={order.status}
            />
          </div>

          <div className="bg-white border border-line rounded-bartal p-4">
            <h2 className="text-h3 font-semibold text-ink mb-3.5">
              {tt(t.itemsTitle, {
                count: isAr ? order.items.length.toLocaleString('ar-EG') : order.items.length,
              })}
            </h2>
            {order.items.map((item, i) => (
              <div
                key={item.productId}
                className={`flex gap-3.5 pb-3.5 ${
                  i < order.items.length - 1 ? 'border-b border-line mb-3.5' : ''
                }`}
              >
                <div className="w-16 h-16 rounded-bartal overflow-hidden shrink-0 border border-line">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={isAr ? item.name_ar : item.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProductPlaceholder
                      label={item.name_en}
                      hue={item.hue as PlaceholderHue}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-ink-mute uppercase tracking-wider">
                    {item.brand}
                  </div>
                  <div className="text-small text-ink font-semibold">
                    {isAr ? item.name_ar : item.name_en}
                  </div>
                  <div className="text-[11px] text-ink-mute mt-1">
                    {tt(t.qtyLabel, {
                      n: isAr ? item.quantity.toLocaleString('ar-EG') : item.quantity,
                    })}
                  </div>
                </div>
                <PriceTag
                  amount={item.unitPrice * item.quantity}
                  locale={locale}
                  size={14}
                  color={BARTAL.amber}
                />
              </div>
            ))}
          </div>

          <div className="bg-white border border-line rounded-bartal p-4">
            <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
              <h2 className="text-h3 font-semibold text-ink">{t.receipt.title}</h2>
              {order.payment.receipt ? (
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    order.payment.receipt.status === 'approved'
                      ? 'bg-ok/15 text-ok'
                      : order.payment.receipt.status === 'rejected'
                        ? 'bg-danger/15 text-danger'
                        : 'bg-amber-tint text-amber'
                  }`}
                >
                  {order.payment.receipt.status === 'approved'
                    ? t.receipt.approved
                    : order.payment.receipt.status === 'rejected'
                      ? t.receipt.rejected
                      : t.receipt.pending}
                </span>
              ) : null}
            </div>
            {order.payment.receipt ? (
              <div className="flex gap-3.5">
                <div className="w-[100px] h-[130px] rounded-bartal overflow-hidden shrink-0 border border-line">
                  <ProductPlaceholder label="receipt" hue="warm" />
                </div>
                <div className="flex-1 text-small text-ink-mute leading-relaxed space-y-1.5">
                  <div>
                    {t.receipt.bank}:{' '}
                    <strong className="text-ink">
                      {isAr ? order.payment.receipt.bank_ar : order.payment.receipt.bank_en}
                    </strong>
                  </div>
                  <div>
                    {t.receipt.amount}:{' '}
                    <strong className="text-ink font-mono tabular-nums">
                      {fmtSDG(order.payment.receipt.amount, locale)} {isAr ? 'ج.س' : 'SDG'}
                    </strong>
                  </div>
                  <div>
                    {t.receipt.reference}:{' '}
                    <strong className="text-ink font-mono">
                      {order.payment.receipt.reference}
                    </strong>
                  </div>
                  <div>
                    {t.receipt.uploadedAt}:{' '}
                    <strong className="text-ink">
                      {formatDate(order.payment.receipt.uploadedAt, locale)}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-sand border border-line rounded-bartal p-5 text-center">
                <div className="text-small text-ink-mute mb-3">{t.receipt.notUploaded}</div>
                {canUploadReceipt && (
                  <Link
                    href={`/${locale}/orders/${order.id}/receipt-upload`}
                    className="inline-flex items-center justify-center bg-amber text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:opacity-90"
                  >
                    {t.receipt.upload}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:max-w-[360px]">
          <div className="bg-white border border-line rounded-bartal p-4">
            <h3 className="text-h3 font-semibold text-ink mb-3">{t.summaryTitle}</h3>
            <div className="space-y-1.5 text-small">
              <div className="flex justify-between text-ink-mute py-1">
                <span>{t.summarySubtotal}</span>
                <PriceTag amount={order.subtotal} locale={locale} size={13} strong={false} />
              </div>
              <div className="flex justify-between text-ink-mute py-1">
                <span>{tt(t.summaryDelivery, { city })}</span>
                <PriceTag amount={order.deliveryFee} locale={locale} size={13} strong={false} />
              </div>
              <div className="border-t border-line my-2" />
              <div className="flex items-center justify-between">
                <span className="text-h3 font-bold text-ink">{t.summaryTotal}</span>
                <PriceTag amount={order.total} locale={locale} size={18} color={BARTAL.amber} />
              </div>
              <div className="text-[11px] text-ink-mute mt-2 normal-case tracking-normal">
                {order.payment.method === 'bank_transfer'
                  ? tt(t.paymentMethodBank, {
                      bank: order.payment.receipt
                        ? isAr
                          ? order.payment.receipt.bank_ar
                          : order.payment.receipt.bank_en
                        : '—',
                    })
                  : t.paymentMethodCod}
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-bartal p-4">
            <div className="text-[11px] text-ink-mute mb-1.5 uppercase tracking-wider font-semibold">
              {t.addressTitle}
            </div>
            <div className="text-small text-ink font-semibold">{order.shippingAddress.name}</div>
            <div className="text-small text-ink-mute mt-1 leading-relaxed">
              {isAr ? order.shippingAddress.line_ar : order.shippingAddress.line_en}
              <br />
              {isAr ? order.shippingAddress.landmark_ar : order.shippingAddress.landmark_en}
              <br />
              {city}
              <br />
              <span className="font-mono text-ink-mute" dir="ltr">
                {order.shippingAddress.phone}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {canReview && (
              <Link
                href={`/${locale}/orders/${order.id}/review`}
                className="inline-flex items-center justify-center bg-amber text-white rounded-bartal py-2.5 text-small font-bold hover:opacity-90"
              >
                {t.writeReview}
              </Link>
            )}
            <Link
              href={`/${locale}/orders/${order.id}/invoice`}
              className="inline-flex items-center justify-center bg-navy text-white rounded-bartal py-2.5 text-small font-bold hover:bg-navy-deep"
            >
              {t.invoiceLink}
            </Link>
            <button
              type="button"
              className="bg-transparent text-ink border border-line rounded-bartal py-2.5 text-small font-semibold hover:bg-sand"
            >
              {t.reorder}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
