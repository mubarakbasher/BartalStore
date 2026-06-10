import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { AppCard } from './AppCard';

interface LoginRequiredProps {
  locale: Locale;
  dict: Dictionary;
  pageTitle: string;
}

export function LoginRequired({ locale, dict, pageTitle }: LoginRequiredProps) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-h1 font-bold text-ink mb-6">{pageTitle}</h1>
      <AppCard padding="lg" className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-tint text-amber flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <div className="text-h2 font-bold text-ink mb-1">{dict.web.account.loginRequired}</div>
        <p className="text-body text-ink-mute mb-5 max-w-md mx-auto leading-relaxed normal-case tracking-normal">
          {dict.web.account.loginRequiredHint}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center justify-center h-11 px-5 bg-amber text-white rounded-bartal font-semibold hover:bg-amber-hover"
          >
            {dict.web.auth.loginTitle}
          </Link>
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center justify-center h-11 px-5 border border-line text-ink rounded-bartal font-semibold hover:bg-sand"
          >
            {dict.web.auth.registerTitle}
          </Link>
        </div>
      </AppCard>
    </div>
  );
}
