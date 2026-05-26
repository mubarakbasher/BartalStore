import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { useAdminTemplates } from '@/lib/api/queries';
import type { AdminTemplateRow } from '@/lib/api/types';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';

type Channel = 'sms' | 'email' | 'whatsapp';

const CATEGORY_LABEL: Record<string, { ar: string; en: string }> = {
  order: { ar: 'الطلبات', en: 'Order' },
  payment: { ar: 'المدفوعات', en: 'Payment' },
  shipping: { ar: 'الشحن', en: 'Shipping' },
  marketing: { ar: 'تسويق', en: 'Marketing' },
};

function highlightPlaceholders(body: string): Array<{ text: string; placeholder: boolean }> {
  const parts: Array<{ text: string; placeholder: boolean }> = [];
  const regex = /\{\{[a-z_]+\}\}/g;
  let last = 0;
  for (const m of body.matchAll(regex)) {
    if (m.index! > last) parts.push({ text: body.slice(last, m.index), placeholder: false });
    parts.push({ text: m[0], placeholder: true });
    last = m.index! + m[0].length;
  }
  if (last < body.length) parts.push({ text: body.slice(last), placeholder: false });
  return parts;
}

export function TemplatesPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.templates);
  const { data, isLoading, error } = useAdminTemplates();
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [channel, setChannel] = useState<Channel>('sms');

  const active: AdminTemplateRow | null = useMemo(() => {
    if (!data) return null;
    const found = data.templates.find((t) => t.event === activeEvent);
    return found ?? data.templates[0] ?? null;
  }, [data, activeEvent]);

  if (error) return <AdmEmptyState title="Error" body={String(error)} />;

  return (
    <div className="grid grid-cols-[280px_1fr] gap-4 h-full">
      <AdmCard padded={false} className="overflow-auto">
        <div className="px-4 py-3 border-b border-line dark:border-d-line text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute">
          {isLoading
            ? '…'
            : `${data?.templates.length ?? 0} ${locale === 'ar' ? 'قالب' : 'templates'}`}
        </div>
        <ul>
          {data?.templates.map((t) => {
            const on = active?.event === t.event;
            return (
              <li key={t.event}>
                <button
                  type="button"
                  onClick={() => setActiveEvent(t.event)}
                  className={clsx(
                    'w-full text-start px-4 py-2.5 flex flex-col gap-0.5 border-s-[3px] transition-colors',
                    on
                      ? 'bg-amber-tint border-s-amber'
                      : 'border-s-transparent hover:bg-sand dark:hover:bg-d-raised',
                  )}
                >
                  <span className="text-small font-semibold text-ink dark:text-d-text">
                    {locale === 'ar' ? t.name_ar : t.name_en}
                  </span>
                  <span className="text-micro text-ink-mute dark:text-d-textMute">
                    {CATEGORY_LABEL[t.category]?.[locale] ?? t.category}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </AdmCard>

      <div className="flex flex-col gap-4 overflow-auto">
        {!active && isLoading && (
          <div className="text-small text-ink-mute dark:text-d-textMute p-4">
            {locale === 'ar' ? 'جارٍ التحميل…' : 'Loading…'}
          </div>
        )}

        {active && (
          <>
            <AdmCard>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-h3 font-semibold text-ink dark:text-d-text">
                    {locale === 'ar' ? active.name_ar : active.name_en}
                  </div>
                  <div className="text-small text-ink-mute dark:text-d-textMute">
                    {locale === 'ar' ? 'القناة' : 'Channel'}: SMS
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['sms', 'email', 'whatsapp'] as Channel[]).map((c) => {
                    const enabled = c === 'sms';
                    const on = channel === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        disabled={!enabled}
                        title={
                          enabled
                            ? undefined
                            : locale === 'ar'
                              ? 'سيُفعَّل في 3b-3'
                              : 'Coming in 3b-3'
                        }
                        onClick={() => enabled && setChannel(c)}
                        className={clsx(
                          'px-3 py-1.5 rounded-full text-micro font-semibold border transition-colors',
                          on
                            ? 'bg-navy text-white border-navy'
                            : enabled
                              ? 'bg-transparent text-ink dark:text-d-text border-line dark:border-d-line hover:bg-sand dark:hover:bg-d-raised'
                              : 'bg-transparent text-ink-mute dark:text-d-textMute border-line dark:border-d-line opacity-50 cursor-not-allowed',
                        )}
                      >
                        {c.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {active.variables.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute">
                    {locale === 'ar' ? 'المتغيرات' : 'Variables'}:
                  </span>
                  {active.variables.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded-bartal bg-amber-tint text-amber font-mono text-micro font-semibold"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}
            </AdmCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdmCard>
                <div className="text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-2">
                  العربية · AR
                </div>
                <p
                  dir="rtl"
                  className="text-small leading-relaxed text-ink dark:text-d-text whitespace-pre-wrap"
                  style={{ fontFamily: 'Cairo, system-ui' }}
                >
                  {highlightPlaceholders(active.ar).map((p, i) =>
                    p.placeholder ? (
                      <span
                        key={i}
                        className="bg-amber-tint text-amber font-mono font-semibold px-1 rounded"
                      >
                        {p.text}
                      </span>
                    ) : (
                      <span key={i}>{p.text}</span>
                    ),
                  )}
                </p>
              </AdmCard>

              <AdmCard>
                <div className="text-micro uppercase tracking-wider font-semibold text-ink-mute dark:text-d-textMute mb-2">
                  English · EN
                </div>
                <p className="text-small leading-relaxed text-ink dark:text-d-text whitespace-pre-wrap">
                  {highlightPlaceholders(active.en).map((p, i) =>
                    p.placeholder ? (
                      <span
                        key={i}
                        className="bg-amber-tint text-amber font-mono font-semibold px-1 rounded"
                      >
                        {p.text}
                      </span>
                    ) : (
                      <span key={i}>{p.text}</span>
                    ),
                  )}
                </p>
              </AdmCard>
            </div>

            <div className="text-micro text-ink-mute dark:text-d-textMute italic px-1">
              {locale === 'ar'
                ? 'هذه القوالب للقراءة فقط في هذا الإصدار. أي تعديلات تتم في الكود.'
                : 'These templates are read-only in this slice. Edit them in code to ship changes.'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
