'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { StatusPill } from '@/components/orders/StatusPill';
import { PriceTag } from '@/components/PriceTag';
import type { DemoOrderStatus, Order } from '@bartal/shared';

interface Props {
  locale: Locale;
  dict: Dictionary;
  orders: Order[];
}

type Filter = 'all' | 'processing' | 'shipping' | 'completed';

const FILTER_MATCH: Record<Filter, (s: DemoOrderStatus) => boolean> = {
  all: () => true,
  processing: (s) => s === 'placed' || s === 'review' || s === 'verified' || s === 'preparing',
  shipping: (s) => s === 'shipped',
  completed: (s) => s === 'delivered' || s === 'cancelled',
};

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function OrdersHistoryContent({ locale, dict, orders }: Props) {
  const isAr = locale === 'ar';
  const [filter, setFilter] = useState<Filter>('all');
  const t = dict.web.orders.history;

  const filtered = useMemo(
    () => orders.filter((o) => FILTER_MATCH[filter](o.status)),
    [orders, filter],
  );

  const filters: Array<{ key: Filter; label: string }> = [
    { key: 'all', label: t.filters.all },
    { key: 'processing', label: t.filters.processing },
    { key: 'shipping', label: t.filters.shipping },
    { key: 'completed', label: t.filters.completed },
  ];

  return (
    <div>
      <h1 className="text-h1 font-bold text-ink mb-4">{t.title}</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => {
          const on = f.key === filter;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2 rounded-full text-small font-semibold transition-colors ${
                on
                  ? 'bg-navy text-white'
                  : 'bg-transparent border border-line text-ink hover:bg-sand'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-line rounded-bartal p-8 text-center">
          <div className="text-h2 font-semibold text-ink mb-1.5">{t.empty}</div>
          <div className="text-small text-ink-mute mb-4">{t.emptyHint}</div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center bg-amber text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:opacity-90"
          >
            {t.shopNow}
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-bartal overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.6fr_1fr_1.1fr_0.6fr] px-4 py-3 bg-sand border-b border-line text-micro text-ink-mute">
            <div>{t.columns.number}</div>
            <div>{t.columns.date}</div>
            <div>{t.columns.items}</div>
            <div>{t.columns.total}</div>
            <div>{t.columns.status}</div>
            <div />
          </div>
          {filtered.map((o, i) => (
            <Link
              key={o.id}
              href={`/${locale}/orders/${o.id}`}
              className={`grid grid-cols-2 md:grid-cols-[1.4fr_1fr_0.6fr_1fr_1.1fr_0.6fr] gap-2 md:gap-0 px-4 py-3.5 items-center hover:bg-sand transition-colors ${
                i > 0 ? 'border-t border-line' : ''
              }`}
            >
              <div className="text-small font-bold text-ink font-mono">{o.number}</div>
              <div className="text-small text-ink-mute">{formatDate(o.placedAt, locale)}</div>
              <div className="text-small text-ink">
                {isAr ? o.items.length.toLocaleString('ar-EG') : o.items.length}
              </div>
              <div>
                <PriceTag amount={o.total} locale={locale} size={14} />
              </div>
              <div>
                <StatusPill status={o.status} dict={dict} />
              </div>
              <div className="text-small text-amber font-bold text-end">
                {t.detailsLink} →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
