import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAdminShippingLabels } from '@/lib/api/queries';
import { useMarkLabelsPrinted } from '@/lib/api/mutations';
import type { ShippingLabelFilter, ShippingLabelRow } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { pushToast } from '@/components/primitives/AdmToaster';
import { ShippingLabelPreview } from './ShippingLabelPreview';
import { fmtSDG } from '@/design/tokens';
import './print-styles.css';

const FILTERS: Array<{ key: ShippingLabelFilter; label_en: string; label_ar: string }> = [
  { key: 'ready', label_en: 'Ready', label_ar: 'جاهز' },
  { key: 'printed', label_en: 'Printed', label_ar: 'تم الطباعة' },
  { key: 'all', label_en: 'All', label_ar: 'الكل' },
];

const ZONE_SHORT: Record<string, string> = {
  ZONE_A: 'A',
  ZONE_B: 'B',
  ZONE_C: 'C',
  ZONE_D: 'D',
};

export function ShippingLabelsPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.shippingLabels);
  const [params, setParams] = useSearchParams();
  const status = (FILTERS.find((f) => f.key === params.get('status'))?.key ?? 'ready') as ShippingLabelFilter;
  const [selected, setSelected] = useState<string[]>([]);

  const { data, isLoading, error } = useAdminShippingLabels({ status });
  const markPrinted = useMarkLabelsPrinted();

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onPrint = () => {
    if (selected.length === 0) return;
    // Mark printed first (background), then fire window.print() — server
    // round-trip is independent of the browser print dialog.
    markPrinted.mutate(
      { order_ids: selected },
      {
        onSuccess: (res) => {
          pushToast(
            'success',
            locale === 'ar'
              ? `تم تسجيل ${res.count} بطاقة كمطبوعة`
              : `${res.count} labels marked printed`,
          );
        },
        onError: (err) => pushToast('error', (err as Error).message),
      },
    );
    queueMicrotask(() => window.print());
  };

  const selectedRows: ShippingLabelRow[] =
    data?.items.filter((l) => selected.includes(l.id)) ?? [];

  if (error) return <AdmEmptyState title="Error" body={String(error)} />;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left list — hidden in print */}
      <aside
        className="w-[460px] shrink-0 border-e border-line dark:border-d-line bg-white dark:bg-d-surface overflow-auto print:hidden"
      >
        <div className="px-4 py-3 border-b border-line dark:border-d-line flex items-center gap-2">
          <div className="text-small text-ink-mute dark:text-d-textMute flex-1">
            {isLoading
              ? '…'
              : locale === 'ar'
                ? `${selected.length} محدد · ${data?.items.length ?? 0} ${status === 'ready' ? 'جاهز' : status === 'printed' ? 'مطبوع' : 'بالمجموع'}`
                : `${selected.length} selected · ${data?.items.length ?? 0} ${status}`}
          </div>
        </div>
        <div className="px-4 py-2 border-b border-line dark:border-d-line flex items-center gap-2">
          {FILTERS.map((f) => {
            const on = status === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('status', f.key);
                  setParams(next);
                  setSelected([]);
                }}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
                  on
                    ? 'bg-navy text-white border-navy'
                    : 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised',
                )}
              >
                {locale === 'ar' ? f.label_ar : f.label_en}
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="p-6 text-small text-ink-mute dark:text-d-textMute">
            {locale === 'ar' ? 'جارٍ التحميل…' : 'Loading…'}
          </div>
        )}

        {!isLoading && (data?.items.length ?? 0) === 0 && (
          <AdmEmptyState
            title={locale === 'ar' ? 'لا توجد طلبات' : 'No orders'}
            body={
              locale === 'ar'
                ? 'لا توجد طلبات لطباعة بطاقاتها.'
                : 'No orders are ready to print labels.'
            }
          />
        )}

        <ul>
          {data?.items.map((l) => {
            const on = selected.includes(l.id);
            const printed = !!l.label_printed_at;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => toggle(l.id)}
                  className={clsx(
                    'w-full text-start px-4 py-3 border-b border-line dark:border-d-line flex items-start gap-3 transition-colors',
                    on
                      ? 'bg-amber-tint dark:bg-amber/10'
                      : 'hover:bg-sand dark:hover:bg-d-raised',
                  )}
                >
                  <span
                    className={clsx(
                      'w-[18px] h-[18px] mt-0.5 shrink-0 rounded border-2 flex items-center justify-center',
                      on ? 'bg-amber border-amber' : 'border-line dark:border-d-line',
                    )}
                  >
                    {on && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-micro font-bold text-ink dark:text-d-text">
                        #{l.tracking_number ?? l.order_number.replace(/^BRT-/, 'BTL-')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-navy/10 text-navy dark:bg-navy/30">
                        ZONE {ZONE_SHORT[l.address.zone] ?? l.address.zone}
                      </span>
                      {l.is_cod && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-tint text-amber">
                          COD
                        </span>
                      )}
                      <span
                        className={clsx(
                          'ms-auto text-[10px] font-semibold',
                          printed ? 'text-ok' : 'text-ink-mute dark:text-d-textMute',
                        )}
                      >
                        {printed
                          ? locale === 'ar' ? 'مطبوع' : 'Printed'
                          : locale === 'ar' ? 'جاهز' : 'Ready'}
                      </span>
                    </span>
                    <span className="block text-small font-semibold text-ink dark:text-d-text">
                      {l.address.full_name}
                    </span>
                    <span className="block text-micro text-ink-mute dark:text-d-textMute leading-relaxed">
                      {[l.address.street, l.address.landmark].filter(Boolean).join(' · ')} · {l.address.district}
                    </span>
                    <span className="block text-micro text-ink-mute dark:text-d-textMute mt-1 flex gap-2">
                      <span>{l.items_count} {locale === 'ar' ? 'منتج' : 'items'}</span>
                      <span>·</span>
                      <span className="text-amber font-semibold font-mono">
                        {fmtSDG(l.total, locale)} SDG
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Right preview */}
      <main className="flex-1 overflow-auto bg-sand/50 dark:bg-d-bg p-6">
        <div className="flex items-center gap-3 mb-5 print:hidden">
          <div className="text-small font-bold text-ink dark:text-d-text flex-1">
            {locale === 'ar'
              ? `معاينة · بطاقات ٤×٦ بوصة · ${selected.length} ورقة`
              : `Preview · 4×6" thermal labels · ${selected.length} sheet${selected.length === 1 ? '' : 's'}`}
          </div>
          <AdmButton
            size="sm"
            variant="ghost"
            disabled
            title={
              locale === 'ar'
                ? 'استخدم طباعة المتصفح ← حفظ بصيغة PDF'
                : 'Use browser print → Save as PDF'
            }
          >
            {locale === 'ar' ? 'تحميل PDF' : 'Download PDF'}
          </AdmButton>
          <AdmButton
            size="sm"
            variant="primary"
            onClick={onPrint}
            disabled={selected.length === 0 || markPrinted.isPending}
          >
            {locale === 'ar'
              ? `طباعة ${selected.length} بطاقة`
              : `Print ${selected.length} label${selected.length === 1 ? '' : 's'}`}
          </AdmButton>
        </div>

        <div className="ship-print-area">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:block">
            {selectedRows.map((l) => (
              <ShippingLabelPreview key={l.id} label={l} locale={locale} />
            ))}
            {selected.length === 0 && (
              <div className="col-span-full text-center py-12 text-small text-ink-mute dark:text-d-textMute print:hidden">
                {locale === 'ar'
                  ? 'اختر طلبات من القائمة لعرض البطاقات.'
                  : 'Select orders on the left to preview labels.'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
