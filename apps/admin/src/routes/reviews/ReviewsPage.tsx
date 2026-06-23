import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmTabs } from '@/components/primitives/AdmTabs';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmButton } from '@/components/primitives/AdmButton';
import { pushToast } from '@/components/primitives/toast-bus';
import { useAdminReviewKpis, useAdminReviews } from '@/lib/api/queries';
import {
  useApproveReview,
  useRejectReview,
  useResetReviewToPending,
} from '@/lib/api/mutations';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type {
  AdminReviewFilter,
  AdminReviewItem,
} from '@/lib/api/types';

const FILTERS = ['pending', 'flagged', 'approved', 'rejected'] as const;

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber" aria-label={`${n} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? 'text-amber' : 'text-line dark:text-d-line'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewsPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.reviews.title);

  const [filter, setFilter] = useState<AdminReviewFilter>('pending');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectingFor, setRejectingFor] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminReviews({ status: filter, limit: 50 });
  const { data: kpis } = useAdminReviewKpis();
  const approve = useApproveReview();
  const reject = useRejectReview();
  const reset = useResetReviewToPending();

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const selected = useMemo<AdminReviewItem | null>(
    () => items.find((r) => r.id === selectedId) ?? items[0] ?? null,
    [items, selectedId],
  );

  const tabItems = FILTERS.map((id) => ({
    id,
    label: dict.reviews.tabs[id],
    count: id === 'pending' ? kpis?.pending : id === 'flagged' ? kpis?.flagged : undefined,
  }));

  function handleApprove(id: string) {
    approve.mutate(id, {
      onSuccess: () => pushToast('success', dict.reviews.approvedToast),
      onError: () => pushToast('error', dict.common.error),
    });
  }

  function handleReject(id: string, reason: string) {
    reject.mutate(
      { id, body: { reason } },
      {
        onSuccess: () => {
          pushToast('success', dict.reviews.rejectedToast);
          setRejectingFor(null);
        },
        onError: () => pushToast('error', dict.common.error),
      },
    );
  }

  function handleReset(id: string) {
    reset.mutate(id, {
      onSuccess: () => pushToast('success', dict.reviews.resetToast),
      onError: () => pushToast('error', dict.common.error),
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <AdmStatCard
          label={dict.reviews.kpi.pending}
          value={kpis ? String(kpis.pending) : '—'}
          hint={dict.reviews.kpi.pendingSub.replace('{n}', String(kpis?.pending ?? 0))}
          accent="amber"
        />
        <AdmStatCard
          label={dict.reviews.kpi.flagged}
          value={kpis ? String(kpis.flagged) : '—'}
          hint={dict.reviews.kpi.flaggedSub}
          accent="danger"
        />
        <AdmStatCard
          label={dict.reviews.kpi.avgRating}
          value={kpis?.avgRating30d !== null && kpis?.avgRating30d !== undefined
            ? kpis.avgRating30d.toFixed(1)
            : '—'}
          hint={dict.reviews.kpi.avgRatingSub}
          accent="ok"
        />
        <AdmStatCard
          label={dict.reviews.kpi.verified}
          value={kpis?.verifiedBuyerPct !== null && kpis?.verifiedBuyerPct !== undefined
            ? `${kpis.verifiedBuyerPct}%`
            : '—'}
          hint={dict.reviews.kpi.verifiedSub}
          accent="navy"
        />
        <AdmStatCard
          label={dict.reviews.kpi.avgResponse}
          value={kpis?.avgResponseHours !== null && kpis?.avgResponseHours !== undefined
            ? `${kpis.avgResponseHours}h`
            : '—'}
          hint={dict.reviews.kpi.avgResponseSub}
          accent="ok"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <AdmCard padded={false} className="flex flex-col min-h-[60vh]">
          <AdmTabs
            items={tabItems}
            active={filter}
            onChange={(id) => {
              setFilter(id);
              setSelectedId(null);
            }}
          />
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-small text-ink-mute dark:text-d-textMute">
                {dict.common.loading}
              </div>
            ) : isError ? (
              <AdmEmptyState
                title={locale === 'ar' ? 'تعذّر تحميل المراجعات' : "Couldn't load reviews"}
                body={locale === 'ar' ? 'يرجى المحاولة مرة أخرى.' : 'Please try again.'}
                action={
                  <AdmButton size="sm" variant="ghost" onClick={() => refetch()}>
                    {dict.common.retry}
                  </AdmButton>
                }
              />
            ) : items.length === 0 ? (
              <AdmEmptyState title={dict.reviews.listEmpty} />
            ) : (
              items.map((r) => {
                const on = (selected?.id ?? items[0]?.id) === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={clsx(
                      'w-full text-start px-4 py-3 border-b border-line dark:border-d-line block',
                      on ? 'bg-amber/10' : 'hover:bg-sand/40 dark:hover:bg-d-raised/40',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Stars n={r.rating} />
                      {r.flagged_reason && (
                        <span className="text-micro font-bold text-danger uppercase tracking-wider">
                          {dict.reviews.flaggedPill}
                        </span>
                      )}
                    </div>
                    <div className="text-small font-semibold text-ink dark:text-d-text line-clamp-1">
                      {r.user.name}
                    </div>
                    <div className="text-micro text-ink-mute dark:text-d-textMute mb-1">
                      {locale === 'ar' ? r.product.name_ar : r.product.name_en}
                    </div>
                    {r.comment && (
                      <div className="text-small text-ink-mute dark:text-d-textMute line-clamp-2">
                        {r.comment}
                      </div>
                    )}
                    <div className="text-micro text-ink-mute dark:text-d-textMute mt-1.5 flex gap-2">
                      <span>
                        {new Date(r.created_at).toLocaleDateString(
                          locale === 'ar' ? 'ar-EG' : 'en-GB',
                          { day: '2-digit', month: 'short' },
                        )}
                      </span>
                      <span>·</span>
                      <span>
                        {r.is_verified_purchase
                          ? dict.reviews.verifiedPill
                          : dict.reviews.guestPill}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </AdmCard>

        <AdmCard className="min-h-[60vh]">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-small text-ink-mute dark:text-d-textMute">
              {dict.reviews.selectReviewHint}
            </div>
          ) : (
            <div className="space-y-4">
              {selected.flagged_reason && selected.moderation_status === 'PENDING' && (
                <div className="bg-danger/10 border border-danger/30 text-danger text-small rounded-bartal px-4 py-3">
                  {dict.reviews.autoFlagBanner.replace('{reason}', selected.flagged_reason)}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <Stars n={selected.rating} />
                <div className="text-micro text-ink-mute dark:text-d-textMute">
                  {new Date(selected.created_at).toLocaleString(
                    locale === 'ar' ? 'ar-EG' : 'en-GB',
                    { dateStyle: 'medium', timeStyle: 'short' },
                  )}
                </div>
              </div>

              {selected.comment && (
                <p className="text-body text-ink dark:text-d-text leading-relaxed whitespace-pre-wrap">
                  {selected.comment}
                </p>
              )}

              <div className="rounded-bartal bg-sand dark:bg-d-raised border border-line dark:border-d-line p-4">
                <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute font-bold mb-3">
                  {dict.reviews.internalContext}
                </div>
                <div className="grid grid-cols-2 gap-3 text-small">
                  <div>
                    <div className="text-ink-mute dark:text-d-textMute">{dict.reviews.productLabel}</div>
                    <div className="text-ink dark:text-d-text font-semibold">
                      {locale === 'ar' ? selected.product.name_ar : selected.product.name_en}
                    </div>
                    {selected.product.sku && (
                      <div className="text-micro font-mono text-ink-mute">{selected.product.sku}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-ink-mute dark:text-d-textMute">{dict.reviews.customerLabel}</div>
                    <div className="text-ink dark:text-d-text font-semibold">{selected.user.name}</div>
                    <div className="text-micro font-mono text-ink-mute" dir="ltr">
                      {selected.user.phone}
                    </div>
                  </div>
                </div>
              </div>

              {selected.moderation_status === 'PENDING' ? (
                rejectingFor === selected.id ? (
                  <div className="rounded-bartal border border-line dark:border-d-line p-4 space-y-3">
                    <div className="text-small font-semibold text-ink dark:text-d-text">
                      {dict.reviews.rejectHeading}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(
                        ['offTopic', 'spam', 'personalInfo', 'abusive', 'lowQuality', 'fake', 'duplicate'] as const
                      ).map((k) => {
                        const label = dict.reviews.rejectReasons[k];
                        return (
                          <button
                            key={k}
                            type="button"
                            disabled={reject.isPending}
                            onClick={() => handleReject(selected.id, label)}
                            className="px-3 py-1.5 rounded-full border border-line dark:border-d-line text-small text-ink dark:text-d-text hover:bg-sand dark:hover:bg-d-raised disabled:opacity-50"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-end">
                      <AdmButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejectingFor(null)}
                      >
                        {dict.reviews.cancel}
                      </AdmButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <AdmButton
                      onClick={() => handleApprove(selected.id)}
                      disabled={approve.isPending}
                      className="flex-1 !bg-ok hover:!bg-ok"
                    >
                      {dict.reviews.approveBtn}
                    </AdmButton>
                    <AdmButton
                      variant="ghost"
                      onClick={() => setRejectingFor(selected.id)}
                      className="!border-danger !text-danger"
                    >
                      {dict.reviews.rejectBtn}
                    </AdmButton>
                  </div>
                )
              ) : (
                <div
                  className={clsx(
                    'rounded-bartal px-4 py-3 text-small font-semibold flex items-center gap-3',
                    selected.moderation_status === 'APPROVED'
                      ? 'bg-ok/10 text-ok'
                      : 'bg-danger/10 text-danger',
                  )}
                >
                  <span>
                    {selected.moderation_status === 'APPROVED'
                      ? dict.reviews.resolvedApproved
                      : dict.reviews.resolvedRejected}
                  </span>
                  {selected.rejection_reason && (
                    <span className="text-micro font-normal opacity-80">
                      ({selected.rejection_reason})
                    </span>
                  )}
                  <AdmButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReset(selected.id)}
                    disabled={reset.isPending}
                    className="ms-auto"
                  >
                    {dict.reviews.moveBackToPending}
                  </AdmButton>
                </div>
              )}
            </div>
          )}
        </AdmCard>
      </div>
    </div>
  );
}
