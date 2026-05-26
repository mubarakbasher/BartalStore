'use client';
import { usePathname } from 'next/navigation';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebSystemState } from '@/components/static/WebSystemState';

export default function NotFound() {
  const pathname = usePathname() ?? '';
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const locale: Locale = isLocale(seg) ? seg : defaultLocale;
  const dict = getDictionary(locale);
  return <WebSystemState kind="404" locale={locale} dict={dict} />;
}
