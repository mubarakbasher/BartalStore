import { useNavigate } from 'react-router-dom';
import { useTopbarStore } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { useAuth } from '@/lib/auth/useAuth';
import type { AdminDictionary } from '@/lib/i18n/dictionary';

interface TopbarProps {
  dict: AdminDictionary;
}

export function Topbar({ dict }: TopbarProps) {
  const title = useTopbarStore((s) => s.title);
  const subtitle = useTopbarStore((s) => s.subtitle);
  const locale = usePrefsStore((s) => s.locale);
  const setLocale = usePrefsStore((s) => s.setLocale);
  const theme = usePrefsStore((s) => s.theme);
  const toggleTheme = usePrefsStore((s) => s.toggleTheme);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name ?? '')
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="bg-white dark:bg-d-surface border-b border-line dark:border-d-line px-6 py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-h2 font-bold text-ink dark:text-d-text truncate">{title}</h1>
        {subtitle && (
          <div className="text-small text-ink-mute dark:text-d-textMute truncate">{subtitle}</div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
        className="px-2.5 py-1.5 rounded-bartal text-small font-semibold text-ink dark:text-d-text hover:bg-sand dark:hover:bg-d-raised"
        aria-label={dict.topbar.locale}
      >
        {locale === 'ar' ? 'EN' : 'AR'}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="px-2.5 py-1.5 rounded-bartal text-small font-semibold text-ink dark:text-d-text hover:bg-sand dark:hover:bg-d-raised"
        aria-label={dict.topbar.theme}
      >
        {theme === 'dark' ? '☀︎' : '☾'}
      </button>

      <div className="h-6 w-px bg-line dark:bg-d-line" aria-hidden />

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-amber text-white flex items-center justify-center font-bold text-small">
          {initials || 'A'}
        </div>
        <div className="hidden md:block leading-tight">
          <div className="text-small font-semibold text-ink dark:text-d-text">
            {user?.name ?? '—'}
          </div>
          <div className="text-micro text-ink-mute dark:text-d-textMute font-mono" dir="ltr">
            {user?.phone ?? ''}
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate('/login', { replace: true });
          }}
          className="text-small text-danger font-semibold hover:underline"
        >
          {dict.nav.logout}
        </button>
      </div>
    </header>
  );
}
