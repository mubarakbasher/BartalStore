import { useAdminSettings } from '@/lib/api/queries';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmButton } from '@/components/primitives/AdmButton';

interface LangCard {
  code: string;
  name_en: string;
  name_ar: string;
  dir: 'rtl' | 'ltr';
  completion: number;
}

const LANGS: LangCard[] = [
  { code: 'AR', name_en: 'Arabic', name_ar: 'العربية', dir: 'rtl', completion: 100 },
  { code: 'EN', name_en: 'English', name_ar: 'الإنجليزية', dir: 'ltr', completion: 100 },
];

export function LocalesTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data: server } = useAdminSettings();
  const primary = (server?.['locale.primary'] ?? 'ar').toLowerCase();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-small text-ink-mute dark:text-d-textMute">
          {locale === 'ar'
            ? 'إدارة الترجمات تُضاف لاحقاً. يمكنك حالياً عرض اللغات المتاحة فقط.'
            : 'Translation management lands in a future slice. For now you can only view the active languages.'}
        </div>
        <AdmButton
          variant="ghost"
          disabled
          title={dict.settings.comingSoon}
        >
          {locale === 'ar' ? '+ إضافة لغة' : '+ Add language'}
        </AdmButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LANGS.map((l) => {
          const isPrimary = l.code.toLowerCase() === primary;
          return (
            <AdmCard key={l.code} className={isPrimary ? 'bg-amber-tint/50' : undefined}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-h3 font-bold text-ink dark:text-d-text">{l.code}</div>
                  <div className="text-small text-ink-mute dark:text-d-textMute">
                    {locale === 'ar' ? l.name_ar : l.name_en} · {l.dir.toUpperCase()}
                  </div>
                </div>
                {isPrimary && (
                  <span className="px-2 py-0.5 rounded-full bg-amber text-white text-micro font-semibold">
                    {locale === 'ar' ? 'أساسية' : 'Primary'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-line dark:bg-d-raised overflow-hidden">
                  <div
                    className="h-full bg-ok"
                    style={{ width: `${l.completion}%` }}
                  />
                </div>
                <span className="text-small font-mono font-semibold text-ink dark:text-d-text">
                  {l.completion}%
                </span>
                <span className="text-micro text-ok font-semibold">● LIVE</span>
              </div>
            </AdmCard>
          );
        })}
      </div>
    </div>
  );
}
