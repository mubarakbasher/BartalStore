import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useAdminSettings } from '@/lib/api/queries';
import { useUpdateSettings } from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/AdmToaster';
import { ApiClientError } from '@/lib/api/client';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { SettingToggle } from './SettingToggle';

interface Integration {
  key: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  initial: string;
}

const INTEGRATIONS: Integration[] = [
  { key: 'whatsapp', name_en: 'WhatsApp Business', name_ar: 'واتساب للأعمال', desc_en: 'Customer support & order updates', desc_ar: 'دعم العملاء وتحديثات الطلبات', initial: 'W' },
  { key: 'sms', name_en: 'SMS Gateway', name_ar: 'بوابة الرسائل', desc_en: "Africa's Talking SMS", desc_ar: "Africa's Talking للرسائل", initial: 'S' },
  { key: 'email', name_en: 'Email (SendGrid)', name_ar: 'البريد الإلكتروني', desc_en: 'Transactional email delivery', desc_ar: 'إرسال بريد المعاملات', initial: 'E' },
  { key: 'ga4', name_en: 'Google Analytics 4', name_ar: 'تحليلات غوغل 4', desc_en: 'Web analytics & event tracking', desc_ar: 'تحليلات الويب وتتبع الأحداث', initial: 'G' },
  { key: 'meta_pixel', name_en: 'Meta Pixel', name_ar: 'بكسل ميتا', desc_en: 'Facebook/Instagram ad tracking', desc_ar: 'تتبع إعلانات فيسبوك/إنستغرام', initial: 'M' },
  { key: 'slack', name_en: 'Slack', name_ar: 'سلاك', desc_en: 'Order & alert notifications', desc_ar: 'إشعارات الطلبات والتنبيهات', initial: 'K' },
  { key: 'public_api', name_en: 'Public API', name_ar: 'واجهة برمجية عامة', desc_en: 'Third-party developer access', desc_ar: 'وصول المطورين الخارجيين', initial: 'A' },
];

const SETTING_KEY = (slug: string) => `integration.${slug}.enabled`;
const ALL_KEYS = INTEGRATIONS.map((i) => SETTING_KEY(i.key));

export function IntegrationsTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data: server, isLoading } = useAdminSettings();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!server) return;
    const next: Record<string, string> = {};
    for (const k of ALL_KEYS) next[k] = server[k] ?? 'false';
    setDraft(next);
  }, [server]);

  const dirty = server ? ALL_KEYS.some((k) => (draft[k] ?? '') !== (server[k] ?? '')) : false;

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
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  return (
    <div className="space-y-4">
      <AdmCard padded={false}>
        <ul className="divide-y divide-line dark:divide-d-line">
          {INTEGRATIONS.map((int) => {
            const key = SETTING_KEY(int.key);
            const enabled = draft[key] === 'true';
            return (
              <li key={int.key} className="px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-bartal bg-sand dark:bg-d-raised grid place-items-center text-h3 font-bold text-navy dark:text-d-text shrink-0">
                  {int.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-small font-semibold text-ink dark:text-d-text">
                    {locale === 'ar' ? int.name_ar : int.name_en}
                  </div>
                  <div className="text-micro text-ink-mute dark:text-d-textMute">
                    {locale === 'ar' ? int.desc_ar : int.desc_en}
                  </div>
                </div>
                <span
                  className={clsx(
                    'text-micro font-semibold',
                    enabled ? 'text-ok' : 'text-ink-mute dark:text-d-textMute',
                  )}
                >
                  {enabled
                    ? locale === 'ar' ? 'متصل' : 'Connected'
                    : locale === 'ar' ? 'غير متصل' : 'Not connected'}
                </span>
                <SettingToggle
                  checked={enabled}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, [key]: v ? 'true' : 'false' }))
                  }
                  label=""
                />
                <AdmButton
                  size="sm"
                  variant="ghost"
                  disabled
                  title={locale === 'ar' ? 'قريباً مع ربط المزود' : 'Coming with provider integration'}
                >
                  {locale === 'ar' ? 'إعداد' : 'Configure'}
                </AdmButton>
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
