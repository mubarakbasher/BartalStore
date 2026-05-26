'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useOrders } from '@/lib/state/orders-store';
import { BartalLogo } from '@/components/BartalLogo';
import { PriceTag } from '@/components/PriceTag';
import { DownloadIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
  orderId: string;
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function InvoicePrintContent({ locale, dict, orderId }: Props) {
  const isAr = locale === 'ar';
  const order = useOrders((s) => s.orders.find((o) => o.id === orderId || o.number === orderId));
  const t = dict.web.orders.invoice;

  if (!order) {
    return (
      <div className="min-h-screen bg-line/40 flex items-center justify-center p-6">
        <div className="bg-white border border-line rounded-bartal p-8 text-center max-w-md">
          <div className="text-h2 font-bold text-ink mb-2">{dict.web.orders.history.empty}</div>
          <Link
            href={`/${locale}/orders`}
            className="inline-flex items-center justify-center bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
          >
            {dict.web.orders.history.title}
          </Link>
        </div>
      </div>
    );
  }

  const city = isAr ? order.shippingAddress.city_ar : order.shippingAddress.city_en;
  const verified =
    order.payment.method === 'bank_transfer' && order.payment.receipt?.status === 'approved';

  const onPrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-line/40 py-6 ${isAr ? 'font-cairo' : 'font-poppins'}`}
    >
      <div className="max-w-[820px] mx-auto px-6 mb-3.5 flex items-center gap-2.5 print:hidden">
        <Link
          href={`/${locale}/orders/${order.id}`}
          className="text-small text-navy font-semibold hover:underline"
        >
          ← {t.backToOrder}
        </Link>
        <div className="flex-1 text-small text-navy font-semibold text-center">
          {t.toolbarTitle}
        </div>
        <button
          type="button"
          onClick={onPrint}
          className="bg-navy text-white rounded-bartal px-4 py-2 text-[12px] font-bold flex items-center gap-1.5 hover:bg-navy-deep"
        >
          ⎙ {t.print}
        </button>
        <button
          type="button"
          disabled
          title={dict.web.checkout.thankYou.actions.comingSoon}
          className="bg-white text-navy border border-navy rounded-bartal px-4 py-2 text-[12px] font-bold flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <DownloadIcon size={13} /> {t.downloadPdf}
        </button>
      </div>

      {/* Page 1 — Invoice */}
      <div className="w-[820px] max-w-full mx-auto mb-6 bg-white text-ink shadow-elevated px-12 py-10 relative min-h-[1080px] print:shadow-none print:mb-0 print:break-after-page">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center"
        >
          <svg width="380" height="380" viewBox="0 0 32 32">
            <path
              d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z"
              fill={BARTAL.navy}
            />
          </svg>
        </div>

        <div className="relative">
          <div className="flex items-start justify-between mb-7">
            <div>
              <BartalLogo locale={locale} size={28} />
              <div className="text-[11px] text-ink-mute mt-2 leading-relaxed">
                {t.sellerLines[0]}
                <br />
                {t.sellerLines[1]}
                <br />
                {t.taxId}{' '}
                <span className="font-mono">{t.taxIdValue}</span>
              </div>
            </div>
            <div className="text-end">
              <div className="text-[28px] font-bold text-navy tracking-wider mb-1.5">
                {t.heading}
              </div>
              <div className="text-[11px] text-ink-mute leading-relaxed">
                <div>
                  <span className="inline-block min-w-[90px] text-ink-mute">{t.number}</span>
                  <span className="font-mono font-bold text-ink">{order.number}</span>
                </div>
                <div>
                  <span className="inline-block min-w-[90px] text-ink-mute">{t.date}</span>
                  {formatDate(order.placedAt, locale)}
                </div>
                <div>
                  <span className="inline-block min-w-[90px] text-ink-mute">{t.due}</span>
                  {formatDate(addDays(order.placedAt, 1), locale)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 p-5 bg-paper rounded-bartal border border-line">
            <div>
              <div className="text-[10px] uppercase text-ink-mute tracking-wider mb-1.5 font-semibold">
                {t.billTo}
              </div>
              <div className="text-small font-bold mb-1">{order.shippingAddress.name}</div>
              <div className="text-[11px] text-ink-mute leading-relaxed">
                {isAr ? order.shippingAddress.line_ar : order.shippingAddress.line_en}
                <br />
                {isAr ? order.shippingAddress.landmark_ar : order.shippingAddress.landmark_en}
                <br />
                <span className="font-mono" dir="ltr">{order.shippingAddress.phone}</span>
                <br />
                m.osman@example.sd
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-ink-mute tracking-wider mb-1.5 font-semibold">
                {t.paymentBlock}
              </div>
              <div className="text-small font-bold mb-1">
                {order.payment.method === 'bank_transfer'
                  ? tt(dict.web.orders.detail.paymentMethodBank, {
                      bank: order.payment.receipt
                        ? isAr
                          ? order.payment.receipt.bank_ar
                          : order.payment.receipt.bank_en
                        : '—',
                    })
                  : dict.web.orders.detail.paymentMethodCod}
              </div>
              <div className="text-[11px] text-ink-mute leading-relaxed">
                {order.payment.method === 'bank_transfer' && (
                  <>
                    {t.bankLineBank}{' '}
                    <span className="font-mono">0012-345-678-9000</span>
                    <br />
                    {t.bankLineRef}{' '}
                    <span className="font-mono font-bold text-ink">{order.number}</span>
                    <br />
                  </>
                )}
                <span
                  className={`inline-block px-2 py-0.5 rounded mt-1 font-semibold ${
                    verified ? 'bg-ok/15 text-ok' : 'bg-amber-tint text-amber'
                  }`}
                >
                  {verified ? t.verified : t.pendingPayment}
                </span>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-3 py-2.5 text-start text-[11px] font-semibold uppercase tracking-wide">
                  {t.colItem}
                </th>
                <th className="px-3 py-2.5 text-start text-[11px] font-semibold uppercase tracking-wide w-[110px]">
                  {t.colSku}
                </th>
                <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide w-[50px]">
                  {t.colQty}
                </th>
                <th className="px-3 py-2.5 text-end text-[11px] font-semibold uppercase tracking-wide w-[110px]">
                  {t.colPrice}
                </th>
                <th className="px-3 py-2.5 text-end text-[11px] font-semibold uppercase tracking-wide w-[130px]">
                  {t.colTotal}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.productId} className="border-b border-line">
                  <td className="px-3 py-3.5 text-small font-medium">
                    {isAr ? it.name_ar : it.name_en}
                  </td>
                  <td className="px-3 py-3.5 text-[11px] text-ink-mute font-mono">{it.sku}</td>
                  <td className="px-3 py-3.5 text-center text-small">{it.quantity}</td>
                  <td className="px-3 py-3.5 text-end">
                    <PriceTag amount={it.unitPrice} locale={locale} size={12} strong={false} />
                  </td>
                  <td className="px-3 py-3.5 text-end font-semibold">
                    <PriceTag amount={it.unitPrice * it.quantity} locale={locale} size={12} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-[320px]">
              {[
                { l: t.subtotal, v: order.subtotal },
                { l: tt(t.delivery, { city }), v: order.deliveryFee },
                { l: t.vat, v: 0 },
              ].map((r) => (
                <div key={r.l} className="flex justify-between py-1.5 text-[12px] text-ink-mute">
                  <div>{r.l}</div>
                  <PriceTag amount={r.v} locale={locale} size={12} strong={false} />
                </div>
              ))}
              <div className="flex justify-between py-3 border-t-2 border-navy mt-1.5">
                <div className="text-small font-bold text-navy">{t.totalDue}</div>
                <PriceTag amount={order.total} locale={locale} size={16} color={BARTAL.amber} />
              </div>
            </div>
          </div>

          <div className="border-t border-line pt-4 mt-4 flex justify-between gap-6">
            <div className="flex-1">
              <div className="text-[10px] uppercase text-ink-mute tracking-wider mb-1.5 font-semibold">
                {t.notesTitle}
              </div>
              <div className="text-[11px] text-ink-mute leading-relaxed">{t.notesBody}</div>
            </div>
            <div className="w-[76px] h-[76px] bg-ink shrink-0" aria-label="QR code placeholder" />
          </div>
        </div>
      </div>

      {/* Page 2 — Packing slip */}
      <div className="w-[820px] max-w-full mx-auto bg-white text-ink shadow-elevated px-12 py-9 min-h-[720px] print:shadow-none">
        <div className="border-b-2 border-dashed border-line pb-3 mb-5 flex justify-between items-end">
          <div>
            <div className="text-[22px] font-bold text-navy tracking-wider">{t.packingHeading}</div>
            <div className="text-[11px] text-ink-mute mt-1">{t.packingSub}</div>
          </div>
          <div className="text-end">
            <div className="text-[11px] text-ink-mute">{dict.web.orders.history.columns.number}</div>
            <div className="font-mono font-bold text-[16px]">{order.number}</div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_200px] gap-4 mb-6">
          <div className="p-3.5 border border-line rounded-md">
            <div className="text-[9px] uppercase text-ink-mute tracking-wider mb-1.5 font-bold">
              {t.shipFrom}
            </div>
            <div className="text-[12px] font-semibold">{t.shipFromName}</div>
            <div className="text-[11px] text-ink-mute mt-1 leading-relaxed">
              {t.shipFromLine}
            </div>
          </div>
          <div className="p-3.5 border-2 border-navy rounded-md bg-paper">
            <div className="text-[9px] uppercase text-navy tracking-wider mb-1.5 font-bold">
              {t.shipTo}
            </div>
            <div className="text-small font-bold">{order.shippingAddress.name}</div>
            <div className="text-[11px] text-ink-mute mt-1 leading-relaxed">
              {isAr ? order.shippingAddress.line_ar : order.shippingAddress.line_en}
              <br />
              {isAr ? order.shippingAddress.landmark_ar : order.shippingAddress.landmark_en}
              <br />
              {city}
              <br />
              <span className="font-mono font-bold text-ink" dir="ltr">
                {order.shippingAddress.phone}
              </span>
            </div>
          </div>
          <div className="p-3.5 border border-line rounded-md text-center">
            <div className="text-[9px] uppercase text-ink-mute tracking-wider mb-2 font-bold">
              {t.tracking}
            </div>
            <svg viewBox="0 0 100 30" width="160" height="48" className="mx-auto block">
              {[2,1,3,1,2,2,1,4,1,2,3,1,2,1,3,2,1,2,4,1,2,1,3,1,2,2,1,3].map((w, i, arr) => {
                const x = arr.slice(0, i).reduce((a, b) => a + b, 0);
                return i % 2 === 0 ? (
                  <rect key={i} x={x} y="0" width={w} height="30" fill={BARTAL.text} />
                ) : null;
              })}
            </svg>
            <div className="text-[10px] font-mono mt-1.5 text-ink">{order.number}</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-[11px] uppercase text-ink-mute tracking-wider mb-2 font-bold">
            {t.checklistTitle}
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sand">
                <th className="px-3 py-2 text-start text-[11px] font-semibold w-12">
                  {t.checklistColumns.check}
                </th>
                <th className="px-3 py-2 text-start text-[11px] font-semibold">
                  {t.checklistColumns.item}
                </th>
                <th className="px-3 py-2 text-start text-[11px] font-semibold w-[110px]">
                  {t.checklistColumns.sku}
                </th>
                <th className="px-3 py-2 text-start text-[11px] font-semibold w-[80px]">
                  {t.checklistColumns.bin}
                </th>
                <th className="px-3 py-2 text-end text-[11px] font-semibold w-[60px]">
                  {t.checklistColumns.qty}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.productId} className="border-b border-line">
                  <td className="px-3 py-3 text-start">
                    <span className="inline-block w-4 h-4 border border-ink rounded-sm" />
                  </td>
                  <td className="px-3 py-3 text-small">
                    {isAr ? it.name_ar : it.name_en}
                  </td>
                  <td className="px-3 py-3 text-[11px] font-mono">{it.sku}</td>
                  <td className="px-3 py-3 text-[11px] font-mono">{t.checklistBin}</td>
                  <td className="px-3 py-3 text-end text-small font-semibold">{it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-line">
          {[t.preparedBy, t.checkedBy, t.delivered].map((label) => (
            <div key={label} className="text-center">
              <div className="border-b border-ink h-9" />
              <div className="text-[10px] text-ink-mute uppercase tracking-wider mt-1.5 font-semibold">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
