import type { Locale } from '../i18n/config';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bartal.sd';
export const SITE_NAME = 'Bartal · بَرتال';

export function ogLocale(locale: Locale): 'ar_SD' | 'en_US' {
  return locale === 'ar' ? 'ar_SD' : 'en_US';
}

export function siteTitle(locale: Locale): string {
  return locale === 'ar' ? 'برتال — تسوّق السودان' : 'Bartal — Shop Sudan';
}

export function siteDescription(locale: Locale): string {
  return locale === 'ar'
    ? 'برتال: متجر السودان الأول — توصيل سريع في الخرطوم، تحويل بنكي محلي، دعم الواتساب.'
    : 'Bartal: Sudan’s online marketplace — fast delivery across Khartoum, local bank transfer, WhatsApp support.';
}

export function localizedHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}/${locale}${clean === '/' ? '' : clean}`;
}

export function bilingualAlternates(path: string): {
  canonical: string;
  languages: Record<string, string>;
} {
  return {
    canonical: localizedHref('ar', path),
    languages: {
      'ar-SD': localizedHref('ar', path),
      en: localizedHref('en', path),
      'x-default': localizedHref('ar', path),
    },
  };
}
