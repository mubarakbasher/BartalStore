import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { TableOfContents } from '@/components/static/TableOfContents';
import { StaticSection } from '@/components/static/StaticSection';

interface PageProps {
  params: { locale: string };
}

export default function TermsPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.web.terms;
  const written = t.sections.filter((s) => s.hasBody);

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-12 grid lg:grid-cols-[240px_1fr] gap-7 items-start">
      <TableOfContents
        heading={t.tocHeading}
        variant="sticky"
        entries={t.sections.map((s) => ({ id: s.id, label: s.title }))}
      />

      <div className="min-w-0">
        <h1
          className="text-ink font-bold mb-1.5"
          style={{ fontSize: 28, lineHeight: 1.2 }}
        >
          {t.title}
        </h1>
        <p className="text-small text-ink-mute mb-7">{t.lastUpdated}</p>

        <div className="space-y-7">
          {written.map((s) => (
            <StaticSection
              key={s.id}
              id={s.id}
              title={s.title}
              body={t.placeholderBody}
            />
          ))}
        </div>

        <p className="mt-7 text-small text-ink-mute italic">{t.continued}</p>
      </div>
    </div>
  );
}

export function generateMetadata({ params }: PageProps) {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.web.terms.title,
    description: dict.web.terms.lastUpdated,
  };
}
