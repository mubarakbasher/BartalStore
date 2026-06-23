import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '@/lib/api/queries';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmStatusPill } from '@/components/primitives/AdmStatusPill';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmThumb } from '@/components/primitives/AdmThumb';
import { PriceTag } from '@/components/primitives/PriceTag';
import { fmtSDG } from '@/design/tokens';

const RevenueChart = lazy(() => import('./RevenueChart'));
const OrdersByStatusChart = lazy(() => import('./OrdersByStatusChart'));

const CHART_PLACEHOLDER = (
  <div className="h-[240px] bg-sand dark:bg-d-raised rounded-bartal animate-pulse" />
);

export function DashboardPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.dashboard);
  const { data, isLoading, error } = useDashboard();

  if (error) {
    return <AdmEmptyState title={dict.common.error} body={String(error)} />;
  }
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 bg-white dark:bg-d-surface border border-line dark:border-d-line rounded-bartal-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdmStatCard
          label={dict.dashboard.revenueToday}
          value={`${fmtSDG(data.revenue_today, locale)} ${dict.dashboard.sdg}`}
          accent="amber"
        />
        <AdmStatCard
          label={dict.dashboard.ordersToday}
          value={fmtSDG(data.orders_today, locale)}
        />
        <AdmStatCard
          label={dict.dashboard.pendingPayments}
          value={fmtSDG(data.pending_payments, locale)}
          accent={data.pending_payments > 0 ? 'amber' : 'navy'}
        />
        <AdmStatCard
          label={dict.dashboard.lowStock}
          value={fmtSDG(data.low_stock_count, locale)}
          accent={data.low_stock_count > 0 ? 'danger' : 'ok'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <AdmCard className="xl:col-span-2">
          <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
            {dict.dashboard.revenueChart}
          </div>
          <Suspense fallback={CHART_PLACEHOLDER}>
            <RevenueChart data={data.daily_revenue} />
          </Suspense>
        </AdmCard>
        <AdmCard>
          <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
            {dict.dashboard.statusChart}
          </div>
          <Suspense fallback={CHART_PLACEHOLDER}>
            <OrdersByStatusChart data={data.orders_by_status} />
          </Suspense>
        </AdmCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdmCard padded={false}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-line dark:border-d-line">
            <div className="text-h3 font-semibold text-ink dark:text-d-text">
              {dict.dashboard.recentOrders}
            </div>
            <Link to="/orders" className="text-small text-amber font-semibold">
              {dict.dashboard.viewAll}
            </Link>
          </div>
          {data.recent_orders.length === 0 ? (
            <div className="p-5 text-small text-ink-mute dark:text-d-textMute">
              {dict.dashboard.emptyOrders}
            </div>
          ) : (
            <ul className="divide-y divide-line dark:divide-d-line">
              {data.recent_orders.slice(0, 6).map((o) => (
                <li key={o.id} className="px-5 py-3 flex items-center gap-3">
                  <Link
                    to={`/orders/${o.id}`}
                    className="font-mono text-small text-navy dark:text-d-text font-semibold hover:underline"
                  >
                    {o.order_number}
                  </Link>
                  <div className="flex-1 min-w-0 text-small text-ink dark:text-d-text truncate">
                    {o.customer_name}
                  </div>
                  <PriceTag amount={Number(o.total)} locale={locale} />
                  <AdmStatusPill status={o.status} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </AdmCard>

        <AdmCard padded={false}>
          <div className="px-5 py-3 border-b border-line dark:border-d-line">
            <div className="text-h3 font-semibold text-ink dark:text-d-text">
              {dict.dashboard.topProducts}
            </div>
          </div>
          {data.top_products.length === 0 ? (
            <div className="p-5 text-small text-ink-mute dark:text-d-textMute">
              {dict.dashboard.emptyTop}
            </div>
          ) : (
            <ul className="divide-y divide-line dark:divide-d-line">
              {data.top_products.slice(0, 6).map((p) => (
                <li key={p.product_id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-bartal shrink-0 overflow-hidden">
                    <AdmThumb
                      url={p.image_url}
                      alt={locale === 'ar' ? p.name_ar : p.name_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-small font-semibold text-ink dark:text-d-text truncate">
                      {locale === 'ar' ? p.name_ar : p.name_en}
                    </div>
                    <div className="text-micro text-ink-mute dark:text-d-textMute font-mono">
                      {p.slug}
                    </div>
                  </div>
                  <div className="text-small font-mono font-semibold text-navy dark:text-d-text">
                    {fmtSDG(p.units_sold, locale)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdmCard>
      </div>
    </div>
  );
}
