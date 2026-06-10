import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebStaticShell } from '@/components/static/WebStaticShell';
import { SummaryBox } from '@/components/static/SummaryBox';
import { TableOfContents } from '@/components/static/TableOfContents';
import { StaticSection } from '@/components/static/StaticSection';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const p = dict.web.privacy;

  return (
    <WebStaticShell
      eyebrow={p.eyebrow}
      title={p.title}
      subtitle={p.subtitle}
    >
      <div className="space-y-9">
        <SummaryBox eyebrow={p.summary.eyebrow} body={p.summary.body} />

        <TableOfContents
          heading={p.tocHeading}
          entries={p.sections.map((s) => ({ id: s.id, label: s.title }))}
        />

        <div className="space-y-10 pt-3">
          {p.sections.map((s) => (
            <StaticSection key={s.id} id={s.id} title={s.title} body={s.body} />
          ))}
        </div>
      </div>
    </WebStaticShell>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: `${dict.web.privacy.eyebrow} · ${dict.web.privacy.title}`,
    description: dict.web.privacy.summary.body,
  };
}
