import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OfflineBanner } from '@/components/OfflineBanner';
import { LocaleSetter } from '@/components/LocaleSetter';
import {
  SITE_NAME,
  bilingualAlternates,
  ogLocale,
  siteDescription,
  siteTitle,
} from '@/lib/seo/site';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const title = siteTitle(locale);
  const description = siteDescription(locale);
  return {
    title: { default: title, template: `%s — ${locale === 'ar' ? 'برتال' : 'Bartal'}` },
    description,
    alternates: bilingualAlternates('/'),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      title,
      description,
      url: bilingualAlternates('/').canonical,
    },
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <LocaleSetter locale={locale} />
      <OfflineBanner locale={locale} />
      <div className="print:hidden">
        <Header locale={locale} dict={dict} />
      </div>
      <main className="min-h-[60vh]">{children}</main>
      <div className="print:hidden">
        <Footer locale={locale} dict={dict} />
      </div>
    </>
  );
}
