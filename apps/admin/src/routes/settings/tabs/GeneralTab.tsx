import { useEffect, useState } from 'react';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmTextarea } from '@/components/primitives/AdmTextarea';
import { pushToast } from '@/components/primitives/toast-bus';
import { useAdminSettings } from '@/lib/api/queries';
import { useUpdateSettings } from '@/lib/api/mutations';
import { ApiClientError } from '@/lib/api/client';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

const GENERAL_FIELDS = [
  { key: 'ui.store_name_ar', labelKey: 'storeNameAr', dir: 'rtl', type: 'text' },
  { key: 'ui.store_name_en', labelKey: 'storeNameEn', dir: 'ltr', type: 'text' },
  { key: 'support.phone', labelKey: 'supportPhone', dir: 'ltr', type: 'tel' },
  { key: 'support.whatsapp', labelKey: 'whatsappNumber', dir: 'ltr', type: 'tel' },
  { key: 'support.email', labelKey: 'supportEmail', dir: 'ltr', type: 'email' },
  { key: 'business.address', labelKey: 'businessAddress', dir: 'auto', type: 'textarea' },
] as const;

export function GeneralTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data: server, isLoading } = useAdminSettings();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!server) return;
    const next: Record<string, string> = {};
    for (const field of GENERAL_FIELDS) {
      next[field.key] = server[field.key] ?? '';
    }
    setDraft(next);
  }, [server]);

  const dirty = server
    ? GENERAL_FIELDS.some((f) => (draft[f.key] ?? '') !== (server[f.key] ?? ''))
    : false;

  const submit = async () => {
    if (!server) return;
    const changed: Record<string, string> = {};
    for (const f of GENERAL_FIELDS) {
      const next = draft[f.key] ?? '';
      if (next !== (server[f.key] ?? '')) changed[f.key] = next;
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
    <AdmCard>
      <div className="space-y-4">
        {GENERAL_FIELDS.map((f) => {
          const label = dict.settings.general[f.labelKey];
          const value = draft[f.key] ?? '';
          const update = (v: string) => setDraft((d) => ({ ...d, [f.key]: v }));
          return (
            <div key={f.key}>
              <label
                htmlFor={f.key}
                className="block text-small font-semibold text-ink dark:text-d-text mb-1.5"
              >
                {label}
              </label>
              {f.type === 'textarea' ? (
                <AdmTextarea
                  id={f.key}
                  value={value}
                  onChange={(e) => update(e.target.value)}
                />
              ) : (
                <AdmInput
                  id={f.key}
                  type={f.type}
                  dir={f.dir}
                  value={value}
                  onChange={(e) => update(e.target.value)}
                />
              )}
              <div className="text-micro text-ink-mute dark:text-d-textMute mt-1 font-mono">
                {f.key}
              </div>
            </div>
          );
        })}
        <div className="pt-2">
          <AdmButton onClick={submit} disabled={!dirty || update.isPending}>
            {update.isPending ? dict.settings.saving : dict.settings.save}
          </AdmButton>
        </div>
      </div>
    </AdmCard>
  );
}
