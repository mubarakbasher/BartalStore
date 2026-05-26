import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { BrandHeroBand } from '@/components/static/BrandHeroBand';
import { TrustMetricsCard } from '@/components/static/TrustMetricsCard';
import { BrandContent } from './BrandContent';

interface PageProps {
  params: { locale: string };
}

export default function BrandPage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = dict.web.brand;
  return (
    <div>
      <div className="max-w-[1100px] mx-auto px-6 pt-5 text-micro text-ink-mute normal-case tracking-normal flex items-center gap-1.5">
        <span>{t.breadcrumb.home}</span>
        <span aria-hidden>›</span>
        <span>{t.breadcrumb.brands}</span>
        <span aria-hidden>›</span>
        <span className="text-ink font-semibold">{t.brandData.name}</span>
      </div>

      <div className="mt-4">
        <BrandHeroBand locale={locale} dict={dict} />
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-9 grid lg:grid-cols-[2fr_1fr] gap-9">
        <div>
          <div className="text-[11px] text-amber tracking-[2px] uppercase font-bold mb-2.5">
            {t.about.eyebrow}
          </div>
          <h2
            className="text-ink font-bold leading-snug mb-3.5"
            style={{ fontSize: 24, letterSpacing: locale === 'ar' ? 0 : -0.5 }}
          >
            {t.about.title}
          </h2>
          <p className="text-ink-mute leading-relaxed" style={{ fontSize: 15 }}>
            {t.about.body}
          </p>
        </div>
        <TrustMetricsCard dict={dict} />
      </div>

      <BrandContent locale={locale} dict={dict} />
    </div>
  );
}
