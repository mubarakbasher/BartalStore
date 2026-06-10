import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { ArrowRightIcon, ArrowLeftIcon } from './Icons';
import { ProductPlaceholder } from './ProductPlaceholder';

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Homepage hero — large editorial card with motif backdrop on the left + two
 * category teasers on the right. Matches docs/design/bartal/project/web-admin.jsx
 * WebOverview's hero block.
 */
export function Hero({ locale, dict }: HeroProps) {
  const t = dict.web.hero;
  const Arrow = locale === 'ar' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Big hero card */}
      <div className="relative overflow-hidden rounded-bartal-lg text-white p-8 md:p-10 min-h-[260px] flex items-end bg-navy-ink">
        {/* Motif pattern overlay */}
        <svg
          aria-hidden
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.2 }}
        >
          <defs>
            <pattern id="hero-motif" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
              <g stroke="#F2B544" strokeWidth="0.8" fill="none">
                <path d="M28 4 L33 18 L47 14 L42 26 L54 32 L42 38 L47 50 L33 46 L28 60 L23 46 L9 50 L14 38 L2 32 L14 26 L9 14 L23 18 Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-motif)" />
        </svg>
        <div className="relative z-10 max-w-md">
          <div className="text-micro uppercase tracking-[0.18em] text-amber-soft mb-3">{t.eyebrow}</div>
          <h1 className="text-display leading-tight font-bold mb-3">{t.title}</h1>
          <p className="text-small text-white/70 mb-6 max-w-sm leading-relaxed normal-case tracking-normal">
            {t.body}
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 bg-amber hover:bg-amber-hover active:bg-amber-active text-white px-5 h-11 rounded-bartal font-semibold transition-colors"
          >
            <span>{t.cta}</span>
            <Arrow size={14} />
          </Link>
        </div>
      </div>

      {/* Two category teasers stacked */}
      <div className="grid grid-rows-2 gap-5">
        <CategoryTeaser
          title={locale === 'ar' ? 'إلكترونيات' : 'Electronics'}
          eyebrow={locale === 'ar' ? 'خصم حتى ٢٥٪' : 'Up to 25% off'}
          hue="navy"
          href={`/${locale}/categories/electronics`}
        />
        <CategoryTeaser
          title={locale === 'ar' ? 'عطور وبخور' : 'Fragrance & Bakhoor'}
          eyebrow={locale === 'ar' ? 'وصل حديثاً' : 'New arrivals'}
          hue="amber"
          href={`/${locale}/categories/beauty`}
        />
      </div>
    </div>
  );
}

function CategoryTeaser({
  title,
  eyebrow,
  hue,
  href,
}: {
  title: string;
  eyebrow: string;
  hue: 'navy' | 'amber';
  href: string;
}) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden rounded-bartal-lg group min-h-[120px]"
    >
      <ProductPlaceholder label={title} hue={hue} />
      <div
        className="absolute inset-0 flex flex-col justify-center px-6 text-white"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,25,48,0.78) 0%, rgba(11,25,48,0.25) 60%, transparent 100%)',
        }}
      >
        <div className="text-micro text-amber-soft mb-1 normal-case tracking-wider">
          {eyebrow}
        </div>
        <div className="text-h2 font-bold">{title}</div>
      </div>
    </Link>
  );
}
