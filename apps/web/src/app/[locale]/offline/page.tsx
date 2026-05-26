import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebSystemState } from '@/components/static/WebSystemState';

interface PageProps {
  params: { locale: string };
}

export default function OfflinePage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return <WebSystemState kind="offline" locale={locale} dict={dict} />;
}

export function generateMetadata({ params }: PageProps) {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.web.systemState.variants.offline.title,
    description: dict.web.systemState.variants.offline.body,
  };
}
