'use client';
import Link from 'next/link';
import { useAccount } from '@/lib/state/account-store';
import { useOrders } from '@/lib/state/orders-store';
import { StatCard } from '@/components/account/StatCard';
import { StatusPill } from '@/components/orders/StatusPill';
import { BagIcon } from '@/components/Icons';
import { BARTAL, fmtSDG } from '@/design/tokens';
import { tt } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function formatMonthYear(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

function abbreviateSpend(amount: number, locale: Locale): string {
  if (amount >= 1_000_000) {
    const value = amount / 1_000_000;
    const trimmed = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
    return locale === 'ar' ? `${trimmed} مليون` : `${trimmed}M`;
  }
  if (amount >= 1_000) {
    const value = amount / 1_000;
    const trimmed = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
    return locale === 'ar' ? `${trimmed} ألف` : `${trimmed}K`;
  }
  return fmtSDG(amount, locale);
}

export function AccountDashboardContent({ locale, dict }: Props) {
  const isAr = locale === 'ar';
  const user = useAccount((s) => s.user);
  const orders = useOrders((s) => s.orders);
  const t = dict.web.account.dashboard;

  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status),
  ).length;
  const reviewOrder = orders.find((o) => o.status === 'review' || o.status === 'verified');
  const recent = orders.slice(0, 4);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-h1 font-bold text-ink">
          {tt(t.greeting, { name: user.firstName })}
        </div>
        <div className="text-small text-ink-mute mt-1">
          {tt(t.memberSince, {
            since: formatMonthYear(user.memberSince, locale),
            count: isAr ? user.ordersCount.toLocaleString('ar-EG') : user.ordersCount,
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t.stats.totalSpent}
          value={abbreviateSpend(user.lifetimeSpend, locale)}
          unit={t.stats.sdgUnit}
        />
        <StatCard
          label={t.stats.activeOrders}
          value={isAr ? activeOrders.toLocaleString('ar-EG') : String(activeOrders)}
        />
        <StatCard
          label={t.stats.loyaltyPoints}
          value={isAr ? user.loyaltyPoints.toLocaleString('ar-EG') : String(user.loyaltyPoints)}
          unit={t.stats.pointsUnit}
        />
      </div>

      {reviewOrder && (
        <div className="bg-amber-tint border border-amber rounded-bartal p-3.5 flex items-center gap-3">
          <div className="text-[22px]" aria-hidden>⚠️</div>
          <div className="flex-1 min-w-0">
            <div className="text-small font-bold text-ink">
              {tt(t.alert.title, { orderNumber: reviewOrder.number })}
            </div>
            <div className="text-[11px] text-ink mt-0.5">{t.alert.body}</div>
          </div>
          <Link
            href={`/${locale}/orders/${reviewOrder.id}`}
            className="text-small text-amber font-bold hover:underline shrink-0"
          >
            {dict.web.orders.detail.track}
          </Link>
        </div>
      )}

      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="px-4 py-3.5 border-b border-line flex items-center justify-between">
          <div className="text-small font-bold text-ink">{t.recentTitle}</div>
          <Link href={`/${locale}/orders`} className="text-small text-amber font-semibold hover:underline">
            {t.viewAll}
          </Link>
        </div>
        {recent.map((o, i) => (
          <Link
            key={o.id}
            href={`/${locale}/orders/${o.id}`}
            className={`px-4 py-3.5 grid grid-cols-[auto_1fr_auto_auto] gap-3.5 items-center hover:bg-sand transition-colors ${
              i === 0 ? '' : 'border-t border-line'
            }`}
          >
            <div className="w-10 h-10 rounded-bartal bg-sand flex items-center justify-center">
              <BagIcon size={18} color={BARTAL.amber} />
            </div>
            <div className="min-w-0">
              <div className="text-small font-bold text-ink font-mono">{o.number}</div>
              <div className="text-[11px] text-ink-mute mt-0.5">
                {formatDate(o.placedAt, locale)} ·{' '}
                {tt(t.itemsCount, { count: isAr ? o.items.length.toLocaleString('ar-EG') : o.items.length })}
              </div>
            </div>
            <StatusPill status={o.status} dict={dict} />
            <div className="text-end">
              <div className="text-small font-bold text-ink font-mono tabular-nums">
                {fmtSDG(o.total, locale)}{' '}
                <span className="text-[10px] text-ink-mute font-medium">
                  {t.stats.sdgUnit}
                </span>
              </div>
              <div className="text-[11px] text-amber font-semibold mt-0.5">
                {t.detailsLink}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
