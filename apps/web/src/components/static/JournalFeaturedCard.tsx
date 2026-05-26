import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function JournalFeaturedCard({ locale, dict }: Props) {
  const t = dict.web.journal;
  const f = t.featured;
  return (
    <article className="grid lg:grid-cols-[1.2fr_1fr] gap-8 mb-14 items-stretch">
      <div className="rounded-bartal-lg overflow-hidden relative min-h-[360px]">
        <ProductPlaceholder label={f.title} hue={f.hue as PlaceholderHue} />
        <div className="absolute bottom-4 start-4 px-3 py-1.5 bg-amber text-white rounded-full text-[11px] font-bold tracking-wider uppercase">
          ★ {f.categoryLabel}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-[11px] text-ink-mute tracking-[2px] uppercase font-semibold mb-3">
          {f.categoryLabel} · {f.read} {t.readSuffix}
        </div>
        <h2
          className="text-ink font-bold leading-tight mb-3.5 text-balance"
          style={{ fontSize: 32, letterSpacing: locale === 'ar' ? 0 : -0.8 }}
        >
          {f.title}
        </h2>
        <p className="text-ink-mute leading-relaxed mb-5" style={{ fontSize: 15 }}>
          {f.excerpt}
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber/30 text-amber flex items-center justify-center font-bold text-[12px]">
            {f.authorInitials}
          </div>
          <div className="text-[13px]">
            <div className="text-ink font-semibold">{f.author}</div>
            <div className="text-ink-mute text-[11px]">{f.date}</div>
          </div>
          <button
            type="button"
            className="ms-auto flex items-center gap-1.5 text-amber font-bold text-[13px] hover:underline"
          >
            {t.readMore}
            <span className={locale === 'ar' ? 'rotate-180' : ''} aria-hidden>
              →
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
