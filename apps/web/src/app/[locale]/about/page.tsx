import { notFound } from 'next/navigation';
import { useId } from 'react';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { WebStaticShell } from '@/components/static/WebStaticShell';
import { BARTAL } from '@/design/tokens';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const ACCENT_BG: Record<'amber' | 'navy' | 'green', string> = {
  amber: 'bg-amber',
  navy: 'bg-navy',
  green: 'bg-ok',
};

export default async function AboutPage(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const a = dict.web.about;
  const isAr = locale === 'ar';

  return (
    <WebStaticShell eyebrow={a.eyebrow} title={a.title} subtitle={a.subtitle}>
      <BrandStrip
        logoText={a.brandStrip.logoText}
        tagline={a.brandStrip.tagline}
        isAr={isAr}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-12">
        {a.stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-line rounded-bartal p-4"
          >
            <div
              className="text-amber font-mono"
              style={{ fontSize: 28, fontWeight: 700 }}
            >
              {s.value}
            </div>
            <div className="text-micro text-ink-mute mt-1 normal-case tracking-normal">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2
          className="text-ink font-bold mb-5"
          style={{ fontSize: 22, lineHeight: 1.3 }}
        >
          {a.values.title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {a.values.items.map((v) => (
            <div
              key={v.title}
              className="bg-white border border-line rounded-bartal p-5"
            >
              <div className="text-[32px] leading-none mb-2.5">{v.glyph}</div>
              <div className="text-ink font-bold mb-2" style={{ fontSize: 16 }}>
                {v.title}
              </div>
              <p className="text-small text-ink-mute leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2
          className="text-ink font-bold mb-5"
          style={{ fontSize: 22, lineHeight: 1.3 }}
        >
          {a.team.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {a.team.members.map((m) => (
            <div
              key={m.initial}
              className="bg-white border border-line rounded-bartal p-5 text-center"
            >
              <div
                className={`w-[72px] h-[72px] rounded-full mx-auto mb-3 flex items-center justify-center text-white font-poppins font-bold ${ACCENT_BG[m.accent]}`}
                style={{ fontSize: 24 }}
              >
                {m.initial}
              </div>
              <div
                className="text-ink font-bold mb-1"
                style={{ fontSize: 15 }}
              >
                {m.name}
              </div>
              <div className="text-micro text-ink-mute normal-case tracking-normal">
                {m.role}
              </div>
            </div>
          ))}
        </div>
      </section>
    </WebStaticShell>
  );
}

function BrandStrip({
  logoText,
  tagline,
  isAr,
}: {
  logoText: string;
  tagline: string;
  isAr: boolean;
}) {
  const patternId = `about-motif-${useId().replace(/:/g, '')}`;
  return (
    <div
      className="rounded-bartal-lg overflow-hidden bg-navy-ink relative flex items-center justify-center mb-11"
      style={{ height: 200 }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.25 }}
        aria-hidden
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
          >
            <g stroke={BARTAL.amberSoft} strokeWidth="0.9" fill="none">
              <path d="M45 6 L54 25 L73 18 L66 37 L84 45 L66 53 L73 72 L54 65 L45 84 L36 65 L17 72 L24 53 L6 45 L24 37 L17 18 L36 25 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className="relative text-center px-4">
        <div
          className={`text-white font-bold ${isAr ? 'font-cairo' : 'font-poppins'}`}
          style={{ fontSize: 48, letterSpacing: isAr ? 0 : -1.5, lineHeight: 1 }}
        >
          {logoText}
        </div>
        <div
          className="text-amber-soft uppercase font-semibold mt-1.5"
          style={{ fontSize: 12, letterSpacing: 3 }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: `${dict.web.about.eyebrow} · ${dict.web.about.title}`,
    description: dict.web.about.subtitle,
  };
}
