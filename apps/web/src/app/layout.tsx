import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cairo, poppins, jetbrainsMono } from './fonts';
import './globals.css';
import { Providers } from './providers';
import { isLocale, defaultLocale, localeDir, type Locale } from '@/lib/i18n/config';
import {
  SITE_NAME,
  SITE_URL,
  bilingualAlternates,
  ogLocale,
  siteDescription,
  siteTitle,
} from '@/lib/seo/site';

function detectLocale(): Locale {
  const h = headers();
  const pathname = h.get('x-bartal-pathname') ?? '';
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : defaultLocale;
}

export function generateMetadata(): Metadata {
  const locale = detectLocale();
  const title = siteTitle(locale);
  const description = siteDescription(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${locale === 'ar' ? 'برتال' : 'Bartal'}` },
    description,
    applicationName: SITE_NAME,
    alternates: bilingualAlternates('/'),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      url: bilingualAlternates('/').canonical,
      title,
      description,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
    robots: { index: true, follow: true },
    icons: { icon: '/favicon.ico' },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = detectLocale();
  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      className={`${cairo.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
