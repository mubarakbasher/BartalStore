import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAdminBanners } from '@/lib/api/queries';
import { useMoveBanner, useDeleteBanner } from '@/lib/api/mutations';
import type { AdminBannerRow, BannerFilter } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { pushToast } from '@/components/primitives/AdmToaster';
import { BannerFormDialog } from './BannerFormDialog';

const TABS: Array<{ key: BannerFilter; label_en: string; label_ar: string }> = [
  { key: 'all', label_en: 'All', label_ar: 'الكل' },
  { key: 'live', label_en: 'Live', label_ar: 'منشور' },
  { key: 'draft', label_en: 'Draft', label_ar: 'مسودة' },
];

export function BannersPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.banners);
  const [params, setParams] = useSearchParams();
  const status = (TABS.find((t) => t.key === params.get('status'))?.key ?? 'all') as BannerFilter;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBannerRow | null>(null);

  const { data, isLoading, error } = useAdminBanners({ status });
  const move = useMoveBanner();
  const del = useDeleteBanner();

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (b: AdminBannerRow) => {
    setEditing(b);
    setDialogOpen(true);
  };
  const handleMove = (b: AdminBannerRow, direction: 'up' | 'down') => {
    move.mutate(
      { id: b.id, body: { direction } },
      {
        onError: (err: unknown) => {
          const apiErr = (err as { response?: { data?: { error?: { code?: string } } } }).response
            ?.data?.error;
          if (apiErr?.code === 'BANNER_AT_EDGE') return;
          pushToast('error', (err as Error).message);
        },
      },
    );
  };
  const handleDelete = (b: AdminBannerRow) => {
    if (!confirm(locale === 'ar' ? 'حذف هذا البانر؟' : 'Delete this banner?')) return;
    del.mutate(b.id, {
      onSuccess: () => pushToast('success', locale === 'ar' ? 'تم الحذف' : 'Deleted'),
      onError: (err) => pushToast('error', (err as Error).message),
    });
  };

  if (error) return <AdmEmptyState title="Error" body={String(error)} />;

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-h2 font-bold text-ink dark:text-d-text">
            {locale === 'ar' ? 'البانرات' : 'Homepage banners'}
          </div>
          <div className="text-small text-ink-mute dark:text-d-textMute">
            {locale === 'ar'
              ? 'استخدم الأسهم لإعادة الترتيب. البانرات بحالة منشور تظهر في الموقع.'
              : 'Use arrows to reorder. Live banners appear on the website.'}
          </div>
        </div>
        <AdmButton variant="primary" onClick={openCreate}>
          {locale === 'ar' ? '+ إضافة بانر' : '+ Add banner'}
        </AdmButton>
      </div>

      <AdmCard padded={false}>
        <div className="px-4 py-3 border-b border-line dark:border-d-line flex items-center gap-2">
          {TABS.map((t) => {
            const on = status === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('status', t.key);
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
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="p-6 text-small text-ink-mute dark:text-d-textMute">
            {locale === 'ar' ? 'جارٍ التحميل…' : 'Loading…'}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <AdmEmptyState
            title={locale === 'ar' ? 'لا بانرات' : 'No banners'}
            body={locale === 'ar' ? 'أضف أول بانر للصفحة الرئيسية.' : 'Add your first homepage banner.'}
          />
        )}

        <ul className="divide-y divide-line dark:divide-d-line">
          {items.map((b, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === items.length - 1;
            return (
              <li key={b.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(b, 'up')}
                    disabled={isFirst || move.isPending}
                    aria-label="Move up"
                    className="w-7 h-7 inline-flex items-center justify-center rounded-bartal border border-line dark:border-d-line text-small hover:bg-sand dark:hover:bg-d-raised disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(b, 'down')}
                    disabled={isLast || move.isPending}
                    aria-label="Move down"
                    className="w-7 h-7 inline-flex items-center justify-center rounded-bartal border border-line dark:border-d-line text-small hover:bg-sand dark:hover:bg-d-raised disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ↓
                  </button>
                </div>
                <div className="w-[120px] h-[60px] border border-line dark:border-d-line rounded-bartal overflow-hidden bg-sand dark:bg-d-raised shrink-0">
                  {b.image_url && !b.image_url.startsWith('pending://') ? (
                    <img
                      src={b.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-micro text-ink-mute dark:text-d-textMute">
                      —
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-micro text-ink-mute dark:text-d-textMute">
                      #{b.position}
                    </span>
                    <span
                      className={clsx(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold',
                        b.status === 'LIVE'
                          ? 'bg-ok/15 text-ok'
                          : 'bg-line text-ink-mute dark:bg-d-raised dark:text-d-textMute',
                      )}
                    >
                      ● {b.status}
                    </span>
                    {b.click_count > 0 && (
                      <span className="text-micro text-ink-mute dark:text-d-textMute font-mono">
                        {b.click_count.toLocaleString()} {locale === 'ar' ? 'نقرات' : 'clicks'}
                      </span>
                    )}
                  </div>
                  <div className="text-small font-semibold text-ink dark:text-d-text truncate">
                    {b.title_en}
                  </div>
                  <div
                    dir="rtl"
                    className="text-small text-ink dark:text-d-text truncate"
                    style={{ fontFamily: 'Cairo, system-ui' }}
                  >
                    {b.title_ar}
                  </div>
                  {b.cta_url && (
                    <div className="text-micro text-amber font-mono truncate">{b.cta_url}</div>
                  )}
                </div>
                <div className="inline-flex gap-1.5">
                  <AdmButton size="sm" variant="ghost" onClick={() => openEdit(b)}>
                    {locale === 'ar' ? 'تعديل' : 'Edit'}
                  </AdmButton>
                  <AdmButton size="sm" variant="danger" onClick={() => handleDelete(b)}>
                    ×
                  </AdmButton>
                </div>
              </li>
            );
          })}
        </ul>
      </AdmCard>

      <BannerFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        locale={locale}
        editing={editing}
      />
    </div>
  );
}
