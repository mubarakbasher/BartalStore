import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cairo, poppins, jetbrainsMono } from './fonts';
import './globals.css';
import { Providers } from './providers';
import { isLocale, defaultLocale, localeDir, type Locale } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Bartal · بَرتال',
  description: 'Bartal — Your gateway to shopping in Sudan. Fast delivery across Khartoum.',
};

function detectLocale(): Locale {
  // Middleware (src/middleware.ts) injects x-bartal-pathname for every request.
  const h = headers();
  const pathname = h.get('x-bartal-pathname') ?? '';
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : defaultLocale;
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
