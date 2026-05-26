'use client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ToggleRow } from '@/components/account/ToggleRow';
import { usePreferences, type ThemePreference } from '@/lib/state/preferences-store';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function AccountPreferencesContent({ locale, dict }: Props) {
  const t = dict.web.account.preferencesSection;
  const theme = usePreferences((s) => s.theme);
  const setTheme = usePreferences((s) => s.setTheme);
  const notifications = usePreferences((s) => s.notifications);
  const toggleNotification = usePreferences((s) => s.toggleNotification);

  const themeOptions: Array<{ key: ThemePreference; label: string; soon?: boolean }> = [
    { key: 'light', label: t.theme.light },
    { key: 'dark', label: t.theme.dark, soon: true },
    { key: 'system', label: t.theme.system, soon: true },
  ];

  return (
    <div className="space-y-3.5">
      <div className="bg-white border border-line rounded-bartal p-4">
        <div className="text-[15px] font-bold text-ink mb-1">{t.language.title}</div>
        <div className="text-small text-ink-mute leading-relaxed mb-3.5">{t.language.body}</div>
        <LanguageToggle locale={locale} />
      </div>

      <div className="bg-white border border-line rounded-bartal p-4">
        <div className="text-[15px] font-bold text-ink mb-1">{t.theme.title}</div>
        <div className="text-small text-ink-mute leading-relaxed mb-3.5">{t.theme.body}</div>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {themeOptions.map((opt) => {
            const on = theme === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTheme(opt.key)}
                className={`text-start rounded-bartal p-3 transition-colors ${
                  on
                    ? 'border-2 border-amber bg-amber-tint'
                    : 'border border-line bg-sand hover:border-amber/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      on ? 'border-amber' : 'border-line'
                    }`}
                  >
                    {on && <div className="w-2 h-2 rounded-full bg-amber" />}
                  </div>
                  <span className="text-small font-semibold text-ink">{opt.label}</span>
                </div>
                {opt.soon && (
                  <div className="mt-1.5 text-[11px] text-ink-mute">{t.theme.soon}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-line rounded-bartal overflow-hidden">
        <div className="p-4 border-b border-line text-[15px] font-bold text-ink">
          {t.notifications.title}
        </div>
        <div className="px-4">
          <ToggleRow
            label={t.notifications.orderUpdates}
            sub={t.notifications.orderUpdatesSub}
            on={notifications.orderUpdates}
            onToggle={() => toggleNotification('orderUpdates')}
          />
          <ToggleRow
            label={t.notifications.promotions}
            sub={t.notifications.promotionsSub}
            on={notifications.promotions}
            onToggle={() => toggleNotification('promotions')}
          />
          <ToggleRow
            label={t.notifications.whatsapp}
            sub={t.notifications.whatsappSub}
            on={notifications.whatsapp}
            onToggle={() => toggleNotification('whatsapp')}
          />
        </div>
        <div className="p-4 border-t border-line text-[11px] text-ink-mute">
          {t.savedHint}
        </div>
      </div>
    </div>
  );
}
