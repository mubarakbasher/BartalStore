import { Link } from 'react-router-dom';
import { BartalLogo } from '@/components/primitives/BartalLogo';
import { AdmButton } from '@/components/primitives/AdmButton';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

export function NotFoundPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-d-bg gap-5 p-6 text-center">
      <BartalLogo size={32} />
      <div className="text-display font-bold text-navy dark:text-d-text">404</div>
      <div className="text-h2 font-semibold text-ink dark:text-d-text">{dict.shell.notFound}</div>
      <p className="text-small text-ink-mute dark:text-d-textMute max-w-sm">
        {dict.shell.notFoundBody}
      </p>
      <Link to="/">
        <AdmButton variant="primary">{dict.shell.backToDashboard}</AdmButton>
      </Link>
    </div>
  );
}
