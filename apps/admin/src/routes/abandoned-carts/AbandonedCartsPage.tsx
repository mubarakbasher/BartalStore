import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAdminAbandonedCarts } from '@/lib/api/queries';
import { useSendAbandonedCartSms } from '@/lib/api/mutations';
import type { AbandonedCartRow, AbandonedCartStage } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmStatCard } from '@/components/primitives/AdmStatCard';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { PriceTag } from '@/components/primitives/PriceTag';
import { pushToast } from '@/components/primitives/AdmToaster';
import { fmtSDG } from '@/design/tokens';

const STAGE_TABS: Array<{ key: AbandonedCartStage | 'ALL'; label_en: string; label_ar: string }> =
  [
    { key: 'ALL', label_en: 'All stages', label_ar: 'كل المراحل' },
    { key: 'cart', label_en: 'Cart', label_ar: 'السلة' },
    { key: 'address', label_en: 'Address', label_ar: 'العنوان' },
    { key: 'payment', label_en: 'Payment', label_ar: 'الدفع' },
  ];

const STAGE_STYLE: Record<AbandonedCartStage, string> = {
  cart: 'bg-line text-ink-mute',
  address: 'bg-info/15 text-info',
  payment: 'bg-amber-tint text-amber',
};

const RECOVERY_STYLE: Record<AbandonedCartRow['recovery_score'], string> = {
  hot: 'text-ok',
  warm: 'text-amber',
  cold: 'text-ink-mute',
};

function recoveryDot(score: AbandonedCartRow['recovery_score']) {
  const map = { hot: 'bg-ok', warm: 'bg-amber', cold: 'bg-ink-mute/40' } as const;
  return <span className={clsx('inline-block w-2 h-2 rounded-full', map[score])} />;
}

function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function whatsAppDeepLink(phone: string, name: string, locale: 'ar' | 'en'): string {
  const cleaned = phone.replace(/\D/g, '');
  const greeting =
    locale === 'ar'
      ? `مرحباً ${name}، لاحظنا أنك تركت بعض المنتجات في سلتك على برتال. هل نساعدك في إتمام الطلب؟`
      : `Hi ${name}, we noticed you left some items in your Bartal cart. Can we help you complete the order?`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(greeting)}`;
}

export function AbandonedCartsPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.abandonedCarts);
  const [params, setParams] = useSearchParams();
  const stageParam = params.get('stage');
  const stage =
    stageParam && ['cart', 'address', 'payment'].includes(stageParam)
      ? (stageParam as AbandonedCartStage)
      : undefined;

  const { data, isLoading, error } = useAdminAbandonedCarts({
    stage,
    min_age_hours: 1,
    limit: 100,
  });
  const sendSms = useSendAbandonedCartSms();

  const onSendSms = (userId: string, customerName: string) => {
    sendSms.mutate(userId, {
      onSuccess: () =>
        pushToast(
          'success',
          locale === 'ar'
            ? `تم إرسال SMS إلى ${customerName}`
            : `SMS sent to ${customerName}`,
        ),
      onError: (err: unknown) => {
        const apiErr = (err as { response?: { data?: { error?: { code?: string; message_en?: string; message_ar?: string } } } })
          .response?.data?.error;
        if (apiErr?.code === 'RATE_LIMITED') {
          pushToast(
            'info',
            locale === 'ar'
              ? 'تم إرسال تذكير لهذا العميل خلال آخر ٢٤ ساعة.'
              : 'Already sent today.',
          );
          return;
        }
        pushToast(
          'error',
          (apiErr && (locale === 'ar' ? apiErr.message_ar : apiErr.message_en)) ??
            (err as Error).message ??
            'Error',
        );
      },
    });
  };

  if (error) return <AdmEmptyState title="Error" body={String(error)} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdmStatCard
          label={locale === 'ar' ? 'سلات نشطة' : 'Active carts'}
          value={isLoading ? '—' : String(data?.summary.active_carts ?? 0)}
        />
        <AdmStatCard
          label={locale === 'ar' ? 'قيمة قابلة للاسترداد' : 'Recoverable value'}
          value={
            isLoading
              ? '—'
              : `${fmtSDG(data?.summary.recoverable_value_sdg ?? 0, locale)} SDG`
          }
          accent="ok"
        />
        <AdmStatCard
          label={locale === 'ar' ? 'منتجات في السلات' : 'Items in carts'}
          value={isLoading ? '—' : String(data?.summary.items_in_carts ?? 0)}
        />
      </div>

      <AdmCard padded={false}>
        <div className="px-4 py-3 border-b border-line dark:border-d-line flex items-center gap-2">
          {STAGE_TABS.map((tab) => {
            const active =
              tab.key === 'ALL' ? !stage : stage === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  if (tab.key === 'ALL') next.delete('stage');
                  else next.set('stage', tab.key);
                  setParams(next);
                }}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
                  active
                    ? 'bg-navy text-white border-navy'
                    : 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised',
                )}
              >
                {locale === 'ar' ? tab.label_ar : tab.label_en}
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
            title={locale === 'ar' ? 'لا توجد سلات متروكة' : 'No abandoned carts'}
            body={
              locale === 'ar'
                ? 'كل المتسوّقين أكملوا الطلب — أحسنت!'
                : 'All shoppers checked out — nice work!'
            }
          />
        )}

        {!isLoading && (data?.items.length ?? 0) > 0 && (
          <table className="w-full text-small">
            <thead className="text-micro uppercase text-ink-mute dark:text-d-textMute">
              <tr className="border-b border-line dark:border-d-line">
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'العميل' : 'Customer'}
                </th>
                <th className="text-end px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'منتجات' : 'Items'}
                </th>
                <th className="text-end px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'القيمة' : 'Value'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'العمر' : 'Age'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'المرحلة' : 'Stage'}
                </th>
                <th className="text-start px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'احتمال الاسترداد' : 'Recovery'}
                </th>
                <th className="text-end px-4 py-2 font-semibold">
                  {locale === 'ar' ? 'إجراء' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody>
              {data!.items.map((c) => (
                <tr key={c.user_id} className="border-b border-line dark:border-d-line">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-tint text-amber font-bold text-micro grid place-items-center">
                        {initials(c.user_name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-ink dark:text-d-text truncate">
                          {c.user_name}
                        </div>
                        <div className="font-mono text-micro text-ink-mute dark:text-d-textMute truncate">
                          {c.user_phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end font-mono">{c.items_count}</td>
                  <td className="px-4 py-3 text-end">
                    <PriceTag amount={c.cart_value} locale={locale} />
                  </td>
                  <td className="px-4 py-3 text-small text-ink-mute dark:text-d-textMute">
                    {c.age_hours < 24
                      ? `${c.age_hours.toFixed(1)}h`
                      : `${Math.round(c.age_hours / 24)}d`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold',
                        STAGE_STYLE[c.stage],
                      )}
                    >
                      {c.stage}
                    </span>
                  </td>
                  <td className={clsx('px-4 py-3 font-semibold flex items-center gap-2', RECOVERY_STYLE[c.recovery_score])}>
                    {recoveryDot(c.recovery_score)}
                    {c.recovery_score === 'hot'
                      ? locale === 'ar' ? 'ساخن' : 'Hot'
                      : c.recovery_score === 'warm'
                        ? locale === 'ar' ? 'دافئ' : 'Warm'
                        : locale === 'ar' ? 'بارد' : 'Cold'}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={whatsAppDeepLink(c.user_phone, c.user_name, locale)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="px-2.5 py-1 rounded-bartal bg-ok/15 text-ok text-micro font-semibold border border-ok/30 hover:bg-ok/25"
                      >
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => onSendSms(c.user_id, c.user_name)}
                        disabled={sendSms.isPending}
                        className="px-2.5 py-1 rounded-bartal bg-info/15 text-info text-micro font-semibold border border-info/30 hover:bg-info/25 disabled:opacity-60"
                      >
                        SMS
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdmCard>
    </div>
  );
}
