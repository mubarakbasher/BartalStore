'use client';
import { useLayoutEffect } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { localeDir } from '@/lib/i18n/config';

/**
 * Updates <html lang> + <html dir> on the client to match the active URL locale.
 * Root layout defaults to ar/rtl; this swaps to en/ltr when navigating into /en/*.
 */
export function LocaleSetter({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);
  return null;
}
