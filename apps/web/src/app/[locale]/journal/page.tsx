import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebStaticShell } from '@/components/static/WebStaticShell';
import { JournalContent } from './JournalContent';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function JournalPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.web.journal;
  return (
    <WebStaticShell eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
      <JournalContent locale={locale} dict={dict} />
    </WebStaticShell>
  );
}
