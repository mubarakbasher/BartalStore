import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAdminPromos } from '@/lib/api/queries';
import { useDeletePromo } from '@/lib/api/mutations';
import type { AdminPromoRow, PromoFilter, PromoStatus } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { pushToast } from '@/components/primitives/AdmToaster';
import { PromoFormDialog } from './PromoFormDialog';

const TABS: Array<{ key: PromoFilter; label_en: string; label_ar: string }> = [
  { key: 'all', label_en: 'All', label_ar: 'الكل' },
  { key: 'active', label_en: 'Active', label_ar: 'نشط' },
  { key: 'scheduled', label_en: 'Scheduled', label_ar: 'مجدول' },
  { key: 'expired', label_en: 'Expired', label_ar: 'منتهٍ' },
  { key: 'inactive', label_en: 'Inactive', label_ar: 'معطّل' },
];

const STATUS_STYLE: Record<PromoStatus, string> = {
  active: 'text-ok',
  scheduled: 'text-amber',
  expired: 'text-ink-mute',
  inactive: 'text-danger',
};

function statusLabel(s: PromoStatus, locale: 'ar' | 'en'): string {
  const map: Record<PromoStatus, { ar: string; en: string }> = {
    active: { ar: 'نشط', en: 'Active' },
    scheduled: { ar: 'مجدول', en: 'Scheduled' },
    expired: { ar: 'منتهٍ', en: 'Expired' },
    inactive: { ar: 'معطّل', en: 'Inactive' },
  };
  return map[s][locale];
}

function typeLabel(t: AdminPromoRow['type'], locale: 'ar' | 'en'): string {
  if (t === 'PERCENTAGE') return locale === 'ar' ? 'نسبة' : 'Percentage';
  if (t === 'FIXED_AMOUNT') return locale === 'ar' ? 'مبلغ ثابت' : 'Fixed amount';
  return locale === 'ar' ? 'شحن مجاني' : 'Free shipping';
}

function formatValue(p: AdminPromoRow): string {
  if (p.type === 'PERCENTAGE') return `${p.value}%`;
  if (p.type === 'FIXED_AMOUNT') return `${p.value.toLocaleString()} SDG`;
  return '—';
}

export function PromosPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.promos);
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.key === (params.get('tab') ?? 'all'))?.key ?? 'all') as PromoFilter;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPromoRow | null>(null);

  const { data, isLoading, error } = useAdminPromos({ status: tab, limit: 100 });
  const del = useDeletePromo();

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (p: AdminPromoRow) => {
    setEditing(p);
    setDialogOpen(true);
  };
  const handleDelete = (p: AdminPromoRow) => {
    if (!confirm(locale === 'ar' ? `إلغاء الرمز ${p.code}؟` : `Deactivate code ${p.code}?`)) return;
    del.mutate(p.id, {
      onSuccess: () =>
        pushToast('success', locale === 'ar' ? `تم إلغاء ${p.code}` : `${p.code} deactivated`),
      onError: (err) => pushToast('error', (err as Error).message),
    });
  };

  if (error) return <AdmEmptyState title="Error" body={String(error)} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-h2 font-bold text-ink dark:text-d-text">
            {locale === 'ar' ? 'رموز الخصم' : 'Promo codes'}
          </div>
          <div className="text-small text-ink-mute dark:text-d-textMute">
            {isLoading
              ? '…'
              : locale === 'ar'
                ? `${data?.counts.active ?? 0} نشط · ${data?.counts.all ?? 0} الإجمالي`
                : `${data?.counts.active ?? 0} active · ${data?.counts.all ?? 0} total`}
          </div>
        </div>
        <AdmButton variant="primary" onClick={openCreate}>
          {locale === 'ar' ? '+ رمز جديد' : '+ New promo code'}
        </AdmButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdmStatCard
          label={locale === 'ar' ? 'نشط' : 'Active'}
          value={isLoading ? '—' : String(data?.counts.active ?? 0)}
          accent="ok"
        />
        <AdmStatCard
          label={locale === 'ar' ? 'مجدول' : 'Scheduled'}
          value={isLoading ? '—' : String(data?.counts.scheduled ?? 0)}
          accent="amber"
        />
        <AdmStatCard
          label={locale === 'ar' ? 'منتهٍ' : 'Expired'}
          value={isLoading ? '—' : String(data?.counts.expired ?? 0)}
        />
        <AdmStatCard
          label={locale === 'ar' ? 'معطّل' : 'Inactive'}
          value={isLoading ? '—' : String(data?.counts.inactive ?? 0)}
          accent="danger"
        />
      </div>

      <AdmCard padded={false}>
        <div className="px-4 py-3 border-b border-line dark:border-d-line flex items-center gap-2">
          {TABS.map((t) => {
            const on = tab === t.key;
            const count = data?.counts[t.key as keyof typeof data.counts];
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('tab', t.key);
                  setParams(next);
                }}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
                  on
                    ? 'bg-navy text-white border-navy'
                    : 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised',
                )}
              >
                {locale === 'ar' ? t.label_ar : t.label_en}
                {count !== undefined && <span className="ms-1.5 opacity-60">{count}</span>}
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
            title={locale === 'ar' ? 'لا رموز' : 'No promos'}
            body={locale === 'ar' ? 'أنشئ أول رمز خصم.' : 'Create your first promo code.'}
          />
        )}

        {!isLoading && (data?.items.length ?? 0) > 0 && (
          <table className="w-full text-small">
            <thead className="text-micro uppercase text-ink-mute dark:text-d-textMute">
              <tr className="border-b border-line dark:border-d-line">
                <th className="text-start px-4 py-2 font-semibold">{locale === 'ar' ? 'الرمز' : 'Code'}</th>
                <th className="text-start px-4 py-2 font-semibold">{locale === 'ar' ? 'الوصف' : 'Description'}</th>
                <th className="text-start px-4 py-2 font-semibold">{locale === 'ar' ? 'النوع' : 'Type'}</th>
                <th className="text-end px-4 py-2 font-semibold">{locale === 'ar' ? 'القيمة' : 'Value'}</th>
                <th className="text-start px-4 py-2 font-semibold">{locale === 'ar' ? 'الاستخدامات' : 'Uses'}</th>
                <th className="text-start px-4 py-2 font-semibold">{locale === 'ar' ? 'ينتهي' : 'Expires'}</th>
                <th className="text-start px-4 py-2 font-semibold">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="text-end px-4 py-2 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {data!.items.map((p) => (
                <tr key={p.id} className="border-b border-line dark:border-d-line">
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-amber-tint text-amber font-mono font-bold text-micro">
                      {p.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink dark:text-d-text max-w-xs truncate">
                    {locale === 'ar' ? p.description_ar : p.description_en}
                  </td>
                  <td className="px-4 py-3 text-ink-mute dark:text-d-textMute">
                    {typeLabel(p.type, locale)}
                  </td>
                  <td className="px-4 py-3 text-end font-mono font-semibold text-ink dark:text-d-text">
                    {formatValue(p)}
                  </td>
                  <td className="px-4 py-3 font-mono text-micro text-ink-mute dark:text-d-textMute">
                    {p.current_uses}
                    {p.max_uses !== null ? ` / ${p.max_uses}` : ' / ∞'}
                  </td>
                  <td className="px-4 py-3 text-small text-ink-mute dark:text-d-textMute">
                    {p.expires_at ? p.expires_at.slice(0, 10) : '—'}
                  </td>
                  <td className={clsx('px-4 py-3 font-semibold', STATUS_STYLE[p.status])}>
                    ● {statusLabel(p.status, locale)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="inline-flex gap-1.5">
                      <AdmButton size="sm" variant="ghost" onClick={() => openEdit(p)}>
                        {locale === 'ar' ? 'تعديل' : 'Edit'}
                      </AdmButton>
                      {p.is_active && (
                        <AdmButton size="sm" variant="danger" onClick={() => handleDelete(p)}>
                          {locale === 'ar' ? 'إلغاء' : 'Delete'}
                        </AdmButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdmCard>

      <PromoFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        locale={locale}
        editing={editing}
      />
    </div>
  );
}
