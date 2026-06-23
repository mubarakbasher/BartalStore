import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAdminRefunds } from '@/lib/api/queries';
import { useApproveRefund, useRejectRefund } from '@/lib/api/mutations';
import type { RefundFilter, AdminRefundRow } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { PriceTag } from '@/components/primitives/PriceTag';
import { pushToast } from '@/components/primitives/toast-bus';
import { RefundCreateDialog } from './RefundCreateDialog';

const TABS: Array<{ key: RefundFilter; label_en: string; label_ar: string }> = [
  { key: 'all', label_en: 'All', label_ar: 'الكل' },
  { key: 'pending', label_en: 'Pending', label_ar: 'قيد الانتظار' },
  { key: 'approved', label_en: 'Approved', label_ar: 'تمت الموافقة' },
  { key: 'rejected', label_en: 'Rejected', label_ar: 'مرفوض' },
];

const STATUS_STYLE: Record<AdminRefundRow['status'], string> = {
  PENDING: 'bg-amber-tint text-amber',
  APPROVED: 'bg-ok/15 text-ok',
  REJECTED: 'bg-danger/15 text-danger',
};

function ageString(iso: string, locale: 'ar' | 'en'): string {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = ms / (60 * 60 * 1000);
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = Math.round(hours / 24);
  return `${days}${locale === 'ar' ? 'ي' : 'd'}`;
}

export function RefundsPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.refunds);
  const [params, setParams] = useSearchParams();
  const tabRaw = params.get('tab') ?? 'pending';
  const tab: RefundFilter = (TABS.find((t) => t.key === tabRaw)?.key ?? 'pending') as RefundFilter;
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useAdminRefunds({ status: tab, page, limit: 50 });
  const approve = useApproveRefund();
  const reject = useRejectRefund();

  const onApprove = (r: AdminRefundRow) => {
    setPendingId(r.id);
    approve.mutate(r.id, {
      onSuccess: () =>
        pushToast(
          'success',
          locale === 'ar'
            ? `تمت الموافقة على الاسترداد ${r.refund_number}`
            : `Refund ${r.refund_number} approved`,
        ),
      onError: (err) => pushToast('error', (err as Error).message),
      onSettled: () => setPendingId(null),
    });
  };

  const onReject = (r: AdminRefundRow) => {
    if (rejectingId !== r.id) {
      setRejectingId(r.id);
      setRejectReason('');
      return;
    }
    if (rejectReason.trim().length < 3) {
      pushToast('error', locale === 'ar' ? 'اكتب سبباً (٣ أحرف على الأقل)' : 'Reason ≥ 3 chars');
      return;
    }
    setPendingId(r.id);
    reject.mutate(
      { id: r.id, body: { reason: rejectReason.trim() } },
      {
        onSuccess: () => {
          pushToast(
            'success',
            locale === 'ar'
              ? `تم رفض الاسترداد ${r.refund_number}`
              : `Refund ${r.refund_number} rejected`,
          );
          setRejectingId(null);
          setRejectReason('');
        },
        onError: (err) => pushToast('error', (err as Error).message),
        onSettled: () => setPendingId(null),
      },
    );
  };

  if (error)
    return (
      <AdmEmptyState
        title={locale === 'ar' ? 'تعذّر تحميل الاستردادات' : "Couldn't load refunds"}
        body={locale === 'ar' ? 'يرجى المحاولة مرة أخرى.' : 'Please try again.'}
        action={
          <AdmButton size="sm" variant="ghost" onClick={() => refetch()}>
            {dict.common.retry}
          </AdmButton>
        }
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-h2 font-bold text-ink dark:text-d-text">
            {locale === 'ar' ? 'المرتجعات والاستردادات' : 'Refunds & returns'}
          </div>
          <div className="text-small text-ink-mute dark:text-d-textMute">
            {isLoading
              ? '…'
              : locale === 'ar'
                ? `${data?.counts.pending ?? 0} قيد الانتظار · ${data?.counts.approved ?? 0} تمت الموافقة`
                : `${data?.counts.pending ?? 0} pending · ${data?.counts.approved ?? 0} approved`}
          </div>
        </div>
        <AdmButton variant="primary" onClick={() => setDialogOpen(true)}>
          {locale === 'ar' ? '+ استرداد جديد' : '+ New refund'}
        </AdmButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdmStatCard
          label={locale === 'ar' ? 'قيد الانتظار' : 'Pending'}
          value={isLoading ? '—' : String(data?.counts.pending ?? 0)}
          accent="amber"
        />
        <AdmStatCard
          label={locale === 'ar' ? 'تمت الموافقة' : 'Approved'}
          value={isLoading ? '—' : String(data?.counts.approved ?? 0)}
          accent="ok"
        />
        <AdmStatCard
          label={locale === 'ar' ? 'مرفوضة' : 'Rejected'}
          value={isLoading ? '—' : String(data?.counts.rejected ?? 0)}
          accent="danger"
        />
      </div>

      <AdmCard padded={false}>
        <div className="px-4 py-3 border-b border-line dark:border-d-line flex items-center gap-2">
          {TABS.map((t) => {
            const on = tab === t.key;
            const count =
              t.key === 'all'
                ? data?.counts.all
                : data?.counts[t.key as 'pending' | 'approved' | 'rejected'];
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('tab', t.key);
                  next.delete('page');
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
                {count !== undefined && (
                  <span className="ms-1.5 opacity-60">{count}</span>
                )}
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
            title={locale === 'ar' ? 'لا استردادات' : 'No refunds'}
            body={
              locale === 'ar'
                ? 'لم تُسجَّل أي استردادات بهذا التصفية.'
                : 'No refunds match this filter.'
            }
          />
        )}

        {!isLoading && (data?.items.length ?? 0) > 0 && (
          <table className="w-full text-small">
            <thead className="text-micro uppercase text-ink-mute dark:text-d-textMute">
              <tr className="border-b border-line dark:border-d-line">
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'الاسترداد' : 'Refund'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'الطلب' : 'Order'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'العميل' : 'Customer'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'السبب' : 'Reason'}
                </th>
                <th className="text-end px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'المبلغ' : 'Amount'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'العمر' : 'Age'}
                </th>
                <th className="text-end px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'إجراء' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody>
              {data!.items.map((r) => {
                const ageHours =
                  (Date.now() - new Date(r.created_at).getTime()) / (60 * 60 * 1000);
                const urgent = r.status === 'PENDING' && ageHours < 24;
                return (
                  <tr
                    key={r.id}
                    className={clsx(
                      'border-b border-line dark:border-d-line',
                      urgent && 'bg-danger/5',
                    )}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-ink dark:text-d-text">
                      {r.refund_number}
                    </td>
                    <td className="px-4 py-3 font-mono text-amber font-semibold">
                      {r.order_number}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink dark:text-d-text">
                        {r.customer_name}
                      </div>
                      <div className="font-mono text-micro text-ink-mute dark:text-d-textMute">
                        {r.customer_phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-small text-ink-mute dark:text-d-textMute max-w-xs truncate">
                      {r.reason}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <PriceTag amount={r.amount} locale={locale} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold',
                          STATUS_STYLE[r.status],
                        )}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-small text-ink-mute dark:text-d-textMute">
                      {urgent && <span className="text-danger">● </span>}
                      {ageString(r.created_at, locale)}
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'PENDING' ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          {rejectingId === r.id ? (
                            <>
                              <input
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder={locale === 'ar' ? 'السبب' : 'reason'}
                                className="h-8 px-2 text-micro border border-line dark:border-d-line rounded-bartal bg-white dark:bg-d-bg w-32"
                              />
                              <AdmButton
                                size="sm"
                                variant="danger"
                                onClick={() => onReject(r)}
                                disabled={pendingId === r.id}
                              >
                                {pendingId === r.id
                                  ? locale === 'ar'
                                    ? 'جارٍ الرفض…'
                                    : 'Rejecting…'
                                  : 'OK'}
                              </AdmButton>
                              <button
                                type="button"
                                onClick={() => setRejectingId(null)}
                                className="text-micro text-ink-mute hover:text-ink dark:text-d-textMute"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <AdmButton
                                size="sm"
                                variant="primary"
                                onClick={() => onApprove(r)}
                                disabled={pendingId === r.id}
                              >
                                {pendingId === r.id
                                  ? locale === 'ar'
                                    ? 'جارٍ الموافقة…'
                                    : 'Approving…'
                                  : locale === 'ar'
                                    ? 'موافقة'
                                    : 'Approve'}
                              </AdmButton>
                              <AdmButton
                                size="sm"
                                variant="ghost"
                                onClick={() => onReject(r)}
                                disabled={pendingId === r.id}
                              >
                                {locale === 'ar' ? 'رفض' : 'Deny'}
                              </AdmButton>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-end text-micro text-ink-mute dark:text-d-textMute">
                          {r.decided_at &&
                            new Date(r.decided_at).toISOString().slice(0, 10)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </AdmCard>

      <RefundCreateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        locale={locale}
      />
    </div>
  );
}
