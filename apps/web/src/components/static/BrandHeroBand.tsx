import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { MotifBg } from '@/components/MotifBg';
import { BARTAL } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function BrandHeroBand({ locale: _locale, dict }: Props) {
  const t = dict.web.brand;
  const b = t.brandData;
  return (
    <section className="bg-navy-ink text-white py-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none">
        <MotifBg color={BARTAL.amberSoft} opacity={0.6} style={{ width: '100%', height: '100%' }}>
          <div className="w-full h-full" />
        </MotifBg>
      </div>
      <div className="max-w-[1100px] mx-auto px-10 relative grid lg:grid-cols-[120px_1fr_auto] gap-6 items-center">
        <div className="w-[120px] h-[120px] rounded-bartal-lg bg-white text-navy-ink flex items-center justify-center font-bold" style={{ fontSize: 42, letterSpacing: -1 }}>
          {b.nameInitial}
        </div>
        <div>
          <div className="text-[11px] text-amber-soft tracking-[2px] uppercase font-bold mb-2">
            {t.verifiedPill} · ★ {b.rating}
          </div>
          <div className="font-bold leading-none mb-2" style={{ fontSize: 44, letterSpacing: _locale === 'ar' ? 0 : -1.5 }}>
            {b.name}
          </div>
          <div className="text-[16px] text-white/80 mb-1">{b.tagline}</div>
          <div className="text-[13px] text-white/60 flex gap-3.5 flex-wrap">
            <span>{t.locationPrefix} {b.country}</span>
            <span>· {b.products} {t.productsLabel}</span>
            <span>· {b.followers} {t.followersLabel}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="bg-amber text-white rounded-bartal px-5 py-3 text-[13px] font-bold hover:opacity-90 transition-opacity"
          >
            {t.follow}
          </button>
          <button
            type="button"
            className="bg-transparent text-white border border-white/40 rounded-bartal px-5 py-2.5 text-[13px] font-semibold hover:bg-white/10 transition-colors"
          >
            {t.share}
          </button>
        </div>
      </div>
    </section>
  );
}
