'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebSystemState } from '@/components/static/WebSystemState';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: ErrorProps) {
  const pathname = usePathname() ?? '';
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const locale: Locale = isLocale(seg) ? seg : defaultLocale;
  const dict = getDictionary(locale);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('LocaleError boundary caught:', error);
  }, [error]);

  return <WebSystemState kind="500" locale={locale} dict={dict} onRetry={reset} />;
}
