import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary, tt } from '@/lib/i18n/dictionary';
import { FaqSearchAccordion } from './FaqSearchAccordion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const f = dict.web.faq;

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-12">
      <h1
        className="text-ink font-bold mb-1.5"
        style={{ fontSize: 28, lineHeight: 1.2 }}
      >
        {f.title}
      </h1>
      <p className="text-small text-ink-mute mb-7 max-w-[680px]">
        {f.subtitle}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7 max-w-[800px]">
        {f.categories.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-line rounded-bartal p-4"
          >
            <div className="text-small font-bold text-ink mb-1">{c.name}</div>
            <div className="text-micro text-ink-mute normal-case tracking-normal">
              {tt(f.articlesLabel, { count: c.count })}
            </div>
          </div>
        ))}
      </div>

      <FaqSearchAccordion dict={dict} />
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.web.faq.title,
    description: dict.web.faq.subtitle,
  };
}
