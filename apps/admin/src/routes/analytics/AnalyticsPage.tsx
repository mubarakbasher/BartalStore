import { lazy, Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  useAdminAnalyticsSales,
  useAdminTopProducts,
} from '@/lib/api/queries';
import type { SalesBreakdown } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmThumb } from '@/components/primitives/AdmThumb';
import { fmtSDG } from '@/design/tokens';

const AnalyticsSalesChart = lazy(() => import('./AnalyticsSalesChart'));

const CHART_PLACEHOLDER = (
  <div className="h-[280px] bg-sand dark:bg-d-raised rounded-bartal animate-pulse" />
);

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function AnalyticsPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.analytics);
  const [params, setParams] = useSearchParams();
  const range = (Number(params.get('range') ?? 30) as Range) || 30;
  const breakdown = (params.get('breakdown') ?? 'none') as SalesBreakdown;

  const { from, to } = useMemo(
    () => ({ from: isoDaysAgo(range), to: new Date().toISOString().slice(0, 10) }),
    [range],
  );

  const sales = useAdminAnalyticsSales({ from, to, breakdown });
  const top = useAdminTopProducts(10);

  const kpis = useMemo(() => {
    const days = sales.data?.days ?? [];
    const revenue = days.reduce((sum, d) => sum + d.revenue, 0);
    const orders = days.reduce((sum, d) => sum + d.order_count, 0);
    const aov = orders > 0 ? Math.round(revenue / orders) : 0;
    return { revenue, orders, aov };
  }, [sales.data]);

  if (sales.error)
    return <AdmEmptyState title="Error" body={String(sales.error)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute">
          {locale === 'ar' ? 'الفترة' : 'Range'}
        </div>
        {RANGES.map((r) => {
          const active = range === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params);
                next.set('range', String(r));
                setParams(next);
              }}
              className={clsx(
                'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
                active
                  ? 'bg-navy text-white border-navy'
                  : 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised',
              )}
            >
              {locale === 'ar' ? `${r} يوم` : `${r} days`}
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => {
            const next = new URLSearchParams(params);
            next.set('breakdown', breakdown === 'zone' ? 'none' : 'zone');
            setParams(next);
          }}
          className={clsx(
            'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
            breakdown === 'zone'
              ? 'bg-amber text-white border-amber'
              : 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised',
          )}
        >
          {locale === 'ar' ? 'تقسيم حسب المنطقة' : 'Breakdown by zone'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdmStatCard
          label={locale === 'ar' ? 'الإيرادات' : 'Revenue'}
          value={sales.isLoading ? '—' : `${fmtSDG(kpis.revenue, locale)} SDG`}
          accent="amber"
        />
        <AdmStatCard
          label={locale === 'ar' ? 'الطلبات' : 'Orders'}
          value={sales.isLoading ? '—' : String(kpis.orders)}
        />
        <AdmStatCard
          label={locale === 'ar' ? 'متوسط قيمة الطلب' : 'Average order value'}
          value={sales.isLoading ? '—' : `${fmtSDG(kpis.aov, locale)} SDG`}
        />
      </div>

      <AdmCard>
        <div className="flex items-center justify-between mb-3">
          <div className="text-h3 font-semibold text-ink dark:text-d-text">
            {locale === 'ar' ? `الإيرادات · آخر ${range} يوم` : `Revenue · last ${range} days`}
          </div>
          {breakdown === 'zone' && (
            <div className="text-micro text-amber font-semibold">
              {locale === 'ar' ? 'مقسّم حسب المنطقة' : 'Stacked by zone'}
            </div>
          )}
        </div>
        {sales.isLoading || !sales.data ? (
          CHART_PLACEHOLDER
        ) : (
          <Suspense fallback={CHART_PLACEHOLDER}>
            <AnalyticsSalesChart data={sales.data} />
          </Suspense>
        )}
      </AdmCard>

      <AdmCard padded={false}>
        <div className="px-5 py-3 border-b border-line dark:border-d-line">
          <div className="text-h3 font-semibold text-ink dark:text-d-text">
            {locale === 'ar' ? 'الأكثر مبيعاً · آخر 30 يوم' : 'Top sellers · last 30 days'}
          </div>
        </div>
        {top.isLoading || !top.data ? (
          <div className="p-5 text-small text-ink-mute dark:text-d-textMute">
            {locale === 'ar' ? 'جارٍ التحميل…' : 'Loading…'}
          </div>
        ) : top.data.products.length === 0 ? (
          <AdmEmptyState
            title={locale === 'ar' ? 'لا مبيعات بعد' : 'No sales yet'}
            body={locale === 'ar' ? 'لم تُسجَّل مبيعات.' : 'No sales recorded.'}
          />
        ) : (
          <ul className="divide-y divide-line dark:divide-d-line">
            {top.data.products.map((p) => (
              <li key={p.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-bartal shrink-0 overflow-hidden">
                  <AdmThumb
                    url={p.image_url}
                    alt={locale === 'ar' ? p.name_ar ?? '' : p.name_en ?? ''}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-small font-semibold text-ink dark:text-d-text truncate">
                    {locale === 'ar' ? p.name_ar ?? '' : p.name_en ?? ''}
                  </div>
                  <div className="text-micro text-ink-mute dark:text-d-textMute">
                    {fmtSDG(p.units_sold, locale)} {locale === 'ar' ? 'وحدة' : 'units'}
                  </div>
                </div>
                <div className="text-small font-mono font-semibold text-navy dark:text-d-text">
                  {fmtSDG(p.revenue, locale)} SDG
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdmCard>
    </div>
  );
}
