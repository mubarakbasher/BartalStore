import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmTextarea } from '@/components/primitives/AdmTextarea';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { useAdminSettings } from '@/lib/api/queries';
import { useUpdateSettings } from '@/lib/api/mutations';
import { pushToast } from '@/components/primitives/toast-bus';
import { ApiClientError } from '@/lib/api/client';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { LEGAL_PAGES, type LegalSlug } from '../tabs/LegalTab';

const LABEL: Record<LegalSlug, { ar: string; en: string }> = {
  terms: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  refund: { ar: 'سياسة الاسترداد', en: 'Refund Policy' },
  shipping: { ar: 'سياسة الشحن', en: 'Shipping Policy' },
  about: { ar: 'من نحن', en: 'About' },
  contact: { ar: 'تواصل معنا', en: 'Contact' },
};

export function LegalEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const validSlug = LEGAL_PAGES.includes(slug as LegalSlug) ? (slug as LegalSlug) : null;
  const pageLabel = validSlug ? (locale === 'ar' ? LABEL[validSlug].ar : LABEL[validSlug].en) : '';
  useTopbarTitle(`${dict.settings.title} · ${pageLabel}`);

  const { data: server, isLoading } = useAdminSettings();
  const update = useUpdateSettings();

  const bodyArKey = `legal.${slug}.body_ar`;
  const bodyEnKey = `legal.${slug}.body_en`;
  const statusKey = `legal.${slug}.status`;
  const allKeys = useMemo(
    () => [bodyArKey, bodyEnKey, statusKey],
    [bodyArKey, bodyEnKey, statusKey],
  );

  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!server) return;
    const next: Record<string, string> = {};
    for (const k of allKeys) next[k] = server[k] ?? '';
    setDraft(next);
  }, [server, allKeys]);

  const dirty = server ? allKeys.some((k) => (draft[k] ?? '') !== (server[k] ?? '')) : false;

  const submit = async () => {
    if (!server) return;
    const changed: Record<string, string> = {};
    for (const k of allKeys) {
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

  if (!validSlug) {
    return (
      <AdmCard>
        <div className="text-small text-danger">
          {locale === 'ar' ? 'صفحة غير معروفة.' : 'Unknown legal page.'}
        </div>
        <Link to="/settings/legal" className="text-amber text-small font-semibold mt-2 inline-block">
          ← {locale === 'ar' ? 'عودة' : 'Back'}
        </Link>
      </AdmCard>
    );
  }

  if (isLoading || !server) {
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          to="/settings/legal"
          className="text-small text-amber font-semibold hover:underline"
        >
          ← {locale === 'ar' ? 'الصفحات القانونية' : 'Legal pages'}
        </Link>
        <span className="text-small text-ink-mute dark:text-d-textMute">/</span>
        <span className="text-small font-semibold text-ink dark:text-d-text">{pageLabel}</span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-1">
            {locale === 'ar' ? 'الحالة' : 'Status'}
          </label>
          <AdmSelect
            value={draft[statusKey] ?? 'DRAFT'}
            onChange={(e) => setDraft((d) => ({ ...d, [statusKey]: e.target.value }))}
          >
            <option value="DRAFT">{locale === 'ar' ? 'مسودة' : 'Draft'}</option>
            <option value="PUBLISHED">{locale === 'ar' ? 'منشور' : 'Published'}</option>
          </AdmSelect>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdmCard>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-2">
            العربية · AR
          </label>
          <AdmTextarea
            dir="rtl"
            rows={20}
            value={draft[bodyArKey] ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, [bodyArKey]: e.target.value }))}
            style={{ fontFamily: 'Cairo, system-ui' }}
          />
        </AdmCard>
        <AdmCard>
          <label className="block text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-2">
            English · EN
          </label>
          <AdmTextarea
            rows={20}
            value={draft[bodyEnKey] ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, [bodyEnKey]: e.target.value }))}
          />
        </AdmCard>
      </div>

      <div>
        <AdmButton onClick={submit} disabled={!dirty || update.isPending}>
          {update.isPending ? dict.settings.saving : dict.settings.save}
        </AdmButton>
      </div>
    </div>
  );
}
