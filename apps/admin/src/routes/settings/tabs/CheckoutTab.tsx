import { useEffect, useState } from 'react';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useAdminSettings } from '@/lib/api/queries';
import { useUpdateSettings } from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/toast-bus';
import { ApiClientError } from '@/lib/api/client';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { SettingToggle } from './SettingToggle';

const KEYS = {
  guest: 'checkout.guest_enabled',
  otp: 'checkout.require_otp',
  email: 'checkout.require_email',
  saveCards: 'checkout.save_cards',
  abandoned: 'checkout.abandoned_cart_enabled',
  payBank: 'payment.bank_transfer.enabled',
  payCod: 'payment.cash_on_delivery.enabled',
  payMbok: 'payment.mbok.enabled',
  payCard: 'payment.card.enabled',
  order: 'payment.methods_order',
} as const;

const TOGGLE_KEYS = [
  KEYS.guest,
  KEYS.otp,
  KEYS.email,
  KEYS.saveCards,
  KEYS.abandoned,
  KEYS.payBank,
  KEYS.payCod,
  KEYS.payMbok,
  KEYS.payCard,
] as const;

const ALL_KEYS = [...TOGGLE_KEYS, KEYS.order];

const PAYMENT_METHODS_META: Record<
  string,
  { key: keyof typeof KEYS; label_en: string; label_ar: string }
> = {
  bank_transfer: { key: 'payBank', label_en: 'Bank transfer', label_ar: 'تحويل بنكي' },
  cash_on_delivery: { key: 'payCod', label_en: 'Cash on delivery', label_ar: 'الدفع عند الاستلام' },
  mbok: { key: 'payMbok', label_en: 'mBOK wallet', label_ar: 'محفظة mBOK' },
  card: { key: 'payCard', label_en: 'Visa / MasterCard', label_ar: 'فيزا / ماستركارد' },
};

export function CheckoutTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data: server, isLoading } = useAdminSettings();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!server) return;
    const next: Record<string, string> = {};
    for (const k of ALL_KEYS) next[k] = server[k] ?? '';
    setDraft(next);
  }, [server]);

  const dirty = server ? ALL_KEYS.some((k) => (draft[k] ?? '') !== (server[k] ?? '')) : false;

  const setBool = (key: string, val: boolean) =>
    setDraft((d) => ({ ...d, [key]: val ? 'true' : 'false' }));

  const moveMethod = (slug: string, direction: 'up' | 'down') => {
    const order = (draft[KEYS.order] ?? '').split(',').filter(Boolean);
    const i = order.indexOf(slug);
    if (i === -1) return;
    const j = direction === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft((d) => ({ ...d, [KEYS.order]: next.join(',') }));
  };

  const submit = async () => {
    if (!server) return;
    const changed: Record<string, string> = {};
    for (const k of ALL_KEYS) {
      const next = draft[k] ?? '';
      if (next !== (server[k] ?? '')) changed[k] = next;
    }
    if (Object.keys(changed).length === 0) return;
    try {
      await update.mutateAsync({ settings: changed });
      pushToast('success', dict.settings.savedToast);
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  if (isLoading || !server) {
    return (
      <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>
    );
  }

  const order = (draft[KEYS.order] ?? '').split(',').filter(Boolean);

  return (
    <div className="space-y-4">
      <AdmCard>
        <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
          {locale === 'ar' ? 'خيارات الدفع' : 'Checkout options'}
        </div>
        <div className="divide-y divide-line dark:divide-d-line">
          <SettingToggle
            checked={draft[KEYS.guest] === 'true'}
            onChange={(v) => setBool(KEYS.guest, v)}
            label={locale === 'ar' ? 'الدفع كضيف' : 'Guest checkout'}
            description={
              locale === 'ar'
                ? 'يسمح للعميل بإتمام الطلب دون إنشاء حساب.'
                : 'Allow customers to check out without creating an account.'
            }
          />
          <SettingToggle
            checked={draft[KEYS.otp] === 'true'}
            onChange={(v) => setBool(KEYS.otp, v)}
            label={locale === 'ar' ? 'طلب OTP عبر الرسائل' : 'Require phone OTP'}
          />
          <SettingToggle
            checked={draft[KEYS.email] === 'true'}
            onChange={(v) => setBool(KEYS.email, v)}
            label={locale === 'ar' ? 'طلب البريد الإلكتروني' : 'Require email address'}
          />
          <SettingToggle
            checked={draft[KEYS.saveCards] === 'true'}
            onChange={(v) => setBool(KEYS.saveCards, v)}
            disabled
            label={locale === 'ar' ? 'حفظ البطاقات' : 'Save payment cards'}
            description={
              locale === 'ar' ? 'غير متاح في السودان حالياً.' : 'Not available in Sudan yet.'
            }
          />
          <SettingToggle
            checked={draft[KEYS.abandoned] === 'true'}
            onChange={(v) => setBool(KEYS.abandoned, v)}
            label={locale === 'ar' ? 'استرداد السلات المتروكة' : 'Abandoned cart recovery'}
          />
        </div>
      </AdmCard>

      <AdmCard>
        <div className="text-h3 font-semibold text-ink dark:text-d-text mb-2">
          {locale === 'ar' ? 'طرق الدفع' : 'Payment methods'}
        </div>
        <div className="text-small text-ink-mute dark:text-d-textMute mb-3">
          {locale === 'ar'
            ? 'الترتيب يحدد تسلسل ظهور الطرق في الدفع.'
            : 'Order controls the sequence shown to customers at checkout.'}
        </div>
        <ul className="divide-y divide-line dark:divide-d-line">
          {order.map((slug, idx) => {
            const meta = PAYMENT_METHODS_META[slug];
            if (!meta) return null;
            const settingKey = KEYS[meta.key];
            const enabled = draft[settingKey] === 'true';
            return (
              <li key={slug} className="py-2.5 flex items-center gap-3">
                <span className="font-mono text-micro text-ink-mute dark:text-d-textMute w-6">
                  {idx + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveMethod(slug, 'up')}
                    disabled={idx === 0}
                    className="w-6 h-6 inline-flex items-center justify-center rounded border border-line dark:border-d-line text-micro hover:bg-sand dark:hover:bg-d-raised disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMethod(slug, 'down')}
                    disabled={idx === order.length - 1}
                    className="w-6 h-6 inline-flex items-center justify-center rounded border border-line dark:border-d-line text-micro hover:bg-sand dark:hover:bg-d-raised disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex-1 text-small font-semibold text-ink dark:text-d-text">
                  {locale === 'ar' ? meta.label_ar : meta.label_en}
                </div>
                <SettingToggle
                  checked={enabled}
                  onChange={(v) => setBool(settingKey, v)}
                  label=""
                />
              </li>
            );
          })}
        </ul>
      </AdmCard>

      <div>
        <AdmButton onClick={submit} disabled={!dirty || update.isPending}>
          {update.isPending ? dict.settings.saving : dict.settings.save}
        </AdmButton>
      </div>
    </div>
  );
}
