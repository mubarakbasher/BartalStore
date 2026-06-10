import { useEffect, useState } from 'react';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useAdminSettings } from '@/lib/api/queries';
import { useUpdateSettings } from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/toast-bus';
import { ApiClientError } from '@/lib/api/client';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { SettingToggle } from './SettingToggle';

const KEYS = [
  'tax.vat_rate',
  'tax.display_mode',
  'tax.registration_number',
  'tax.reporting_period',
  'tax.charge_on_shipping',
  'tax.show_on_invoices',
] as const;

export function TaxTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data: server, isLoading } = useAdminSettings();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!server) return;
    const next: Record<string, string> = {};
    for (const k of KEYS) next[k] = server[k] ?? '';
    setDraft(next);
  }, [server]);

  const dirty = server ? KEYS.some((k) => (draft[k] ?? '') !== (server[k] ?? '')) : false;

  const submit = async () => {
    if (!server) return;
    const changed: Record<string, string> = {};
    for (const k of KEYS) {
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
      <div className="bg-amber-tint border border-amber/30 text-ink dark:text-d-text rounded-bartal px-4 py-3 text-small">
        {locale === 'ar'
          ? 'هذه القيم تُحفظ كإعدادات فقط — السلة لا تُطبّق ضريبة القيمة المضافة في هذا الإصدار.'
          : 'These values are stored as configuration only — the cart does not yet apply VAT. Wire-up lands in a follow-up.'}
      </div>

      <AdmCard>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
                {locale === 'ar' ? 'نسبة ضريبة القيمة المضافة (%)' : 'Standard VAT rate (%)'}
              </label>
              <AdmInput
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={draft['tax.vat_rate'] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, 'tax.vat_rate': e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
                {locale === 'ar' ? 'عرض الأسعار' : 'Display prices'}
              </label>
              <AdmSelect
                value={draft['tax.display_mode'] ?? 'excluding'}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, 'tax.display_mode': e.target.value }))
                }
              >
                <option value="excluding">
                  {locale === 'ar' ? 'بدون ضريبة' : 'Excluding VAT'}
                </option>
                <option value="including">
                  {locale === 'ar' ? 'شاملة الضريبة' : 'Including VAT'}
                </option>
              </AdmSelect>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
                {locale === 'ar' ? 'رقم التسجيل الضريبي' : 'Tax registration #'}
              </label>
              <AdmInput
                value={draft['tax.registration_number'] ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, 'tax.registration_number': e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
                {locale === 'ar' ? 'فترة الإقرار الضريبي' : 'Reporting period'}
              </label>
              <AdmSelect
                value={draft['tax.reporting_period'] ?? 'monthly'}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, 'tax.reporting_period': e.target.value }))
                }
              >
                <option value="monthly">{locale === 'ar' ? 'شهري' : 'Monthly'}</option>
                <option value="quarterly">{locale === 'ar' ? 'ربع سنوي' : 'Quarterly'}</option>
              </AdmSelect>
            </div>
          </div>

          <div className="divide-y divide-line dark:divide-d-line pt-2">
            <SettingToggle
              checked={draft['tax.charge_on_shipping'] === 'true'}
              onChange={(v) =>
                setDraft((d) => ({ ...d, 'tax.charge_on_shipping': v ? 'true' : 'false' }))
              }
              label={locale === 'ar' ? 'تطبيق الضريبة على الشحن' : 'Charge VAT on shipping'}
            />
            <SettingToggle
              checked={draft['tax.show_on_invoices'] === 'true'}
              onChange={(v) =>
                setDraft((d) => ({ ...d, 'tax.show_on_invoices': v ? 'true' : 'false' }))
              }
              label={locale === 'ar' ? 'عرض الضريبة على الفواتير' : 'Show VAT on invoices'}
            />
          </div>
        </div>
      </AdmCard>

      <div>
        <AdmButton onClick={submit} disabled={!dirty || update.isPending}>
          {update.isPending ? dict.settings.saving : dict.settings.save}
        </AdmButton>
      </div>
    </div>
  );
}
