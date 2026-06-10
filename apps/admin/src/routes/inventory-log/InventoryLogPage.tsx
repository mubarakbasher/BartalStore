import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAdminInventoryMovements } from '@/lib/api/queries';
import type { InventoryMovementRow, InventoryMovementType } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { fmtSDG } from '@/design/tokens';

const TYPE_TABS: Array<{ key: InventoryMovementType | 'ALL'; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'SALE', label: 'Sale' },
  { key: 'RESTOCK', label: 'Restock' },
  { key: 'RETURN', label: 'Return' },
  { key: 'ADJUST', label: 'Adjust' },
];

const TYPE_STYLE: Record<InventoryMovementType, string> = {
  SALE: 'bg-info/15 text-info',
  RESTOCK: 'bg-ok/15 text-ok',
  RETURN: 'bg-amber-tint text-amber',
  ADJUST: 'bg-danger/15 text-danger',
};

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function InventoryLogPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.inventoryLog);
  const [params, setParams] = useSearchParams();
  const type = (params.get('type') ?? 'ALL') as InventoryMovementType | 'ALL';
  const page = Math.max(1, Number(params.get('page') ?? 1));

  const { data, isLoading, error } = useAdminInventoryMovements({
    type: type === 'ALL' ? undefined : type,
    page,
    limit: 50,
  });

  const groups = useMemo(() => {
    if (!data) return [] as Array<{ day: string; rows: InventoryMovementRow[] }>;
    const map = new Map<string, InventoryMovementRow[]>();
    for (const r of data.items) {
      const d = dayKey(r.created_at);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(r);
    }
    return Array.from(map.entries()).map(([day, rows]) => ({ day, rows }));
  }, [data]);

  if (error) return <AdmEmptyState title="Error" body={String(error)} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdmStatCard
          label={locale === 'ar' ? 'حركات اليوم' : 'Movements today'}
          value={isLoading ? '—' : String(data?.kpis.today_count ?? 0)}
        />
        <AdmStatCard
          label={locale === 'ar' ? 'صافي التغيير' : 'Net change (units)'}
          value={
            isLoading
              ? '—'
              : `${(data?.kpis.net_change_today ?? 0) > 0 ? '+' : ''}${
                  data?.kpis.net_change_today ?? 0
                }`
          }
          accent={
            (data?.kpis.net_change_today ?? 0) >= 0 ? 'ok' : 'danger'
          }
        />
        <AdmStatCard
          label={locale === 'ar' ? 'مخزون منخفض' : 'Low stock SKUs'}
          value={isLoading ? '—' : String(data?.kpis.low_stock_count ?? 0)}
          accent={(data?.kpis.low_stock_count ?? 0) > 0 ? 'danger' : 'ok'}
        />
        <AdmStatCard
          label={locale === 'ar' ? 'طلبات شراء معلقة' : 'Pending POs'}
          value={isLoading ? '—' : String(data?.kpis.pending_pos ?? 0)}
          hint={locale === 'ar' ? 'قريباً' : 'Coming soon'}
        />
      </div>

      <AdmCard padded={false}>
        <div className="px-4 py-3 border-b border-line dark:border-d-line flex items-center gap-2">
          {TYPE_TABS.map((tab) => {
            const active = type === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  if (tab.key === 'ALL') next.delete('type');
                  else next.set('type', tab.key);
                  next.delete('page');
                  setParams(next);
                }}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
                  active
                    ? 'bg-navy text-white border-navy'
                    : 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="p-6 text-small text-ink-mute dark:text-d-textMute">
            {locale === 'ar' ? 'جارٍ التحميل…' : 'Loading…'}
          </div>
        )}

        {!isLoading && groups.length === 0 && (
          <AdmEmptyState
            title={locale === 'ar' ? 'لا حركات' : 'No movements'}
            body={locale === 'ar' ? 'لم تُسجَّل أي حركات بعد.' : 'No movements have been recorded yet.'}
          />
        )}

        {groups.map((g) => (
          <div key={g.day}>
            <div className="px-4 py-2 text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute bg-sand/60 dark:bg-d-bg border-b border-line dark:border-d-line">
              {g.day}
            </div>
            <table className="w-full text-small">
              <thead className="text-micro uppercase text-ink-mute dark:text-d-textMute">
                <tr>
                  <th className="text-start px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'الوقت' : 'Time'}
                  </th>
                  <th className="text-start px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'المنتج' : 'Product'}
                  </th>
                  <th className="text-start px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'النوع' : 'Type'}
                  </th>
                  <th className="text-end px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'الكمية' : 'Qty'}
                  </th>
                  <th className="text-start px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'مرجع' : 'Reference'}
                  </th>
                  <th className="text-start px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'بواسطة' : 'User'}
                  </th>
                  <th className="text-end px-4 py-2 font-semibold">
                    {locale === 'ar' ? 'بعد الحركة' : 'On hand'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.id} className="border-t border-line dark:border-d-line">
                    <td className="px-4 py-2 font-mono text-micro text-ink-mute dark:text-d-textMute">
                      {r.created_at.slice(11, 16)}
                    </td>
                    <td className="px-4 py-2">
                      {r.sku && (
                        <div className="font-mono text-micro text-ink-mute dark:text-d-textMute">
                          {r.sku}
                        </div>
                      )}
                      <div className="font-semibold text-ink dark:text-d-text">
                        {locale === 'ar' ? r.product_name_ar : r.product_name_en}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={clsx(
                          'inline-flex items-center px-2 py-0.5 rounded text-micro font-bold',
                          TYPE_STYLE[r.type],
                        )}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td
                      className={clsx(
                        'px-4 py-2 text-end font-mono font-bold',
                        r.quantity > 0 ? 'text-ok' : 'text-danger',
                      )}
                    >
                      {r.quantity > 0 ? '+' : ''}
                      {r.quantity}
                    </td>
                    <td className="px-4 py-2 font-mono text-micro text-info">
                      {r.reference ?? '—'}
                    </td>
                    <td className="px-4 py-2 text-small text-ink dark:text-d-text">
                      {r.actor_name ?? (locale === 'ar' ? 'النظام' : 'system')}
                    </td>
                    <td className="px-4 py-2 text-end font-mono font-semibold text-ink dark:text-d-text">
                      {r.stock_after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {!isLoading && data && data.total > data.limit && (
          <div className="px-4 py-3 border-t border-line dark:border-d-line flex items-center justify-between text-small text-ink-mute dark:text-d-textMute">
            <div>
              {locale === 'ar'
                ? `إظهار ${data.items.length} من ${fmtSDG(data.total, locale)}`
                : `Showing ${data.items.length} of ${fmtSDG(data.total, locale)} movements`}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('page', String(page - 1));
                  setParams(next);
                }}
                className="px-3 py-1.5 border border-line dark:border-d-line rounded-bartal disabled:opacity-40"
              >
                {locale === 'ar' ? 'السابق' : 'Prev'}
              </button>
              <button
                type="button"
                disabled={page * data.limit >= data.total}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('page', String(page + 1));
                  setParams(next);
                }}
                className="px-3 py-1.5 border border-line dark:border-d-line rounded-bartal disabled:opacity-40"
              >
                {locale === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </AdmCard>
    </div>
  );
}
