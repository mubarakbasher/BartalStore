import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { MotifBg } from '@/components/MotifBg';
import { BartalLogo, LogoMark } from '@/components/BartalLogo';
import { PriceTag } from '@/components/PriceTag';
import {
  ProductPlaceholder,
  type PlaceholderHue,
} from '@/components/ProductPlaceholder';
import { BARTAL } from '@/design/tokens';

interface PageProps {
  params: { locale: string };
}

const PALETTE: { name: string; hex: string; role: string; darkChip?: boolean }[] = [
  { name: 'Navy',       hex: BARTAL.navy,      role: 'Primary',         darkChip: true  },
  { name: 'Navy Deep',  hex: BARTAL.navyDeep,  role: 'Pressed',         darkChip: true  },
  { name: 'Navy Ink',   hex: BARTAL.navyInk,   role: 'Type · dark bg',  darkChip: true  },
  { name: 'Amber',      hex: BARTAL.amber,     role: 'Accent'  },
  { name: 'Amber Soft', hex: BARTAL.amberSoft, role: 'Highlight' },
  { name: 'Amber Tint', hex: BARTAL.amberTint, role: 'Wash'  },
  { name: 'Sand',       hex: BARTAL.sand,      role: 'App bg' },
  { name: 'Paper',      hex: BARTAL.paper,     role: 'Card bg' },
  { name: 'Line',       hex: BARTAL.line,      role: 'Hairline' },
];

const STATUS = [
  { name: 'Success', hex: BARTAL.success },
  { name: 'Danger',  hex: BARTAL.danger  },
  { name: 'Info',    hex: BARTAL.info    },
];

const DARK_STACK = [
  { name: 'd_bg',      hex: BARTAL.d_bg },
  { name: 'd_surface', hex: BARTAL.d_surface },
  { name: 'd_raised',  hex: BARTAL.d_raised },
  { name: 'd_line',    hex: BARTAL.d_line },
];

const STATUS_PILLS: { lbl: string; bgClass: string; textClass: string }[] = [
  { lbl: 'Bank transfer', bgClass: 'bg-amber-tint',      textClass: 'text-amber'   },
  { lbl: 'COD',           bgClass: 'bg-amber/15',        textClass: 'text-amber'   },
  { lbl: 'Verified',      bgClass: 'bg-ok/15',           textClass: 'text-ok'      },
  { lbl: 'Rejected',      bgClass: 'bg-danger/15',       textClass: 'text-danger'  },
  { lbl: 'Pending',       bgClass: 'bg-info/15',         textClass: 'text-info'    },
];

const HUES: PlaceholderHue[] = ['warm', 'amber', 'rose', 'navy', 'green', 'night'];

const RADII = [
  { lbl: 'xs',   px: 6   },
  { lbl: 'sm',   px: 8   },
  { lbl: 'md',   px: 10  },
  { lbl: 'lg',   px: 12  },
  { lbl: 'xl',   px: 14  },
  { lbl: 'pill', px: 999 },
];

const SURFACES = [
  { lbl: 'Mobile', sub: 'AR + EN · light + dark · 3 variations · iOS + Android', count: '42 screens' },
  { lbl: 'Web',    sub: 'Next.js 14 · [locale]/ segment · SSR · custom i18n',    count: '34 pages'  },
  { lbl: 'Admin',  sub: 'React + Vite · EN-only · operations team',              count: '24 pages'  },
  { lbl: 'Brand',  sub: 'Logo, wordmark, motifs, photography placeholders',      count: 'this tile' },
];

export default function DesignSystemPage({ params }: PageProps) {
  // Internal reference only — not exposed in production.
  if (process.env.NODE_ENV === 'production') notFound();
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return (
    <div className="bg-paper min-h-screen px-6 py-8 pb-20" dir="ltr">
      <div className="bg-navy-ink text-white text-micro font-semibold py-2 px-4 rounded-bartal max-w-[1240px] mx-auto mb-5 flex items-center justify-center gap-2 normal-case tracking-normal">
        <span className="bg-amber text-navy-ink rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide">INTERNAL</span>
        <span>Design-system reference · not exposed to customers in production</span>
      </div>
      <div className="max-w-[1240px] mx-auto mb-7">
        <div className="text-[11px] font-bold text-amber uppercase tracking-[2px] mb-2">
          Bartal · design system at a glance
        </div>
        <h1
          className="text-ink font-bold leading-[1.15] mb-2.5"
          style={{ fontSize: 28, letterSpacing: -0.5 }}
        >
          The brand tokens, type system, and component grammar behind every screen.
        </h1>
        <p className="text-small text-ink-mute max-w-[720px] leading-relaxed">
          Navy + amber on warm sand. Cairo for Arabic, Poppins for Latin,
          JetBrains Mono for numerics. Geometric 8-fold star motifs from
          Sudanese architectural tradition. Everything below is what the mobile,
          web, and admin surfaces are built from.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        {/* LOGO + MOTIF */}
        <Card padded={false} className="overflow-hidden relative" minHeight={280}>
          <div className="absolute inset-0 bg-navy-ink" />
          <MotifBg
            color={BARTAL.amberSoft}
            opacity={0.6}
            className="absolute inset-0"
            style={{ opacity: 0.22 }}
          >
            <div className="w-full h-full" />
          </MotifBg>
          <div className="relative p-7 text-white h-full flex flex-col justify-between min-h-[280px]">
            <div>
              <SectionLabel light>Logo lockup</SectionLabel>
              <div className="flex items-center gap-9 mt-3.5">
                <BartalLogo color="#ffffff" accent={BARTAL.amber} size={44} locale="ar" />
                <BartalLogo color="#ffffff" accent={BARTAL.amber} size={44} locale="en" />
              </div>
            </div>
            <div className="flex items-end gap-6 flex-wrap">
              <div>
                <SectionLabel light>Mark</SectionLabel>
                <div className="flex items-center gap-3.5 mt-2">
                  <LogoMark color="#ffffff" accent={BARTAL.amber} size={48} />
                  <LogoMark color="#ffffff" accent={BARTAL.amber} size={32} />
                  <LogoMark color="#ffffff" accent={BARTAL.amber} size={20} />
                </div>
              </div>
              <div className="flex-1" />
              <p className="text-[11px] leading-relaxed max-w-[220px] text-white/60">
                <em
                  className="not-italic font-bold"
                  style={{ color: BARTAL.amberSoft }}
                >
                  برتال (bartal)
                </em>{' '}
                — Arabic for <em className="italic">portal</em>. The 8-pointed
                star is rendered as a doorway with an amber sun at the centre.
              </p>
            </div>
          </div>
        </Card>

        {/* TYPE */}
        <Card>
          <SectionLabel>Typography</SectionLabel>
          <div className="mt-3 mb-3.5">
            <MicroLabel>Cairo · Arabic</MicroLabel>
            <div
              className="font-cairo font-bold text-ink"
              style={{ fontSize: 32, lineHeight: 1.1 }}
              dir="rtl"
            >
              بوابتك للتسوق
            </div>
            <div className="font-cairo text-ink-mute mt-0.5" dir="rtl" style={{ fontSize: 14 }}>
              نص توضيحي بحجم متوسط
            </div>
          </div>
          <div className="mb-3.5">
            <MicroLabel>Poppins · Latin</MicroLabel>
            <div
              className="font-poppins font-bold text-ink"
              style={{ fontSize: 32, lineHeight: 1.1, letterSpacing: -0.7 }}
            >
              Your gateway
            </div>
            <div className="font-poppins text-ink-mute mt-0.5" style={{ fontSize: 14 }}>
              Medium body copy at 14px
            </div>
          </div>
          <div>
            <MicroLabel>JetBrains Mono · Numerics</MicroLabel>
            <div className="font-mono font-bold text-amber" style={{ fontSize: 22 }}>
              185,000 SDG
            </div>
          </div>
        </Card>

        {/* PALETTE — brand */}
        <Card>
          <SectionLabel>Palette · brand</SectionLabel>
          <div className="grid grid-cols-3 gap-2.5 mt-3">
            {PALETTE.map((c) => (
              <div
                key={c.name}
                className="rounded-bartal overflow-hidden border border-line"
              >
                <div className="h-14" style={{ background: c.hex }} />
                <div className="p-2 bg-white">
                  <div className="text-[11px] font-bold text-ink">{c.name}</div>
                  <div className="text-[9px] text-ink-mute font-mono normal-case tracking-normal mt-px">
                    {c.hex.toUpperCase()}
                  </div>
                  <div className="text-[9px] text-ink-mute mt-px">{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* PALETTE — status + dark */}
        <Card>
          <SectionLabel>Status · Dark mode</SectionLabel>
          <div className="flex gap-2.5 mt-3 mb-4">
            {STATUS.map((c) => (
              <div
                key={c.name}
                className="flex-1 rounded-bartal overflow-hidden border border-line"
              >
                <div className="h-10" style={{ background: c.hex }} />
                <div className="px-2.5 py-1.5">
                  <div className="text-[11px] font-bold text-ink">{c.name}</div>
                  <div className="text-[9px] text-ink-mute font-mono normal-case tracking-normal">
                    {c.hex.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <MicroLabel>Dark surface stack</MicroLabel>
          <div className="flex rounded-bartal overflow-hidden mt-1.5">
            {DARK_STACK.map((d) => (
              <div
                key={d.name}
                className="flex-1 px-2 py-2.5 text-[9px] text-white font-mono normal-case tracking-normal"
                style={{ background: d.hex }}
              >
                {d.hex.toUpperCase()}
              </div>
            ))}
          </div>
        </Card>

        {/* BUTTONS */}
        <Card>
          <SectionLabel>Buttons</SectionLabel>
          <div className="flex flex-wrap gap-2.5 mt-3 mb-3.5">
            <button
              type="button"
              className="bg-navy text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-navy-deep"
            >
              Primary
            </button>
            <button
              type="button"
              className="bg-amber text-white rounded-bartal px-5 py-2.5 text-small font-bold hover:bg-amber-hover"
            >
              Accent
            </button>
            <button
              type="button"
              className="bg-transparent text-navy border-[1.5px] border-navy rounded-bartal px-5 py-2 text-small font-bold hover:bg-navy/5"
            >
              Secondary
            </button>
            <button
              type="button"
              className="bg-transparent text-ink-mute px-4 py-2.5 text-small font-semibold hover:text-ink"
            >
              Ghost
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_PILLS.map((p) => (
              <span
                key={p.lbl}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold normal-case tracking-normal ${p.bgClass} ${p.textClass}`}
              >
                {p.lbl}
              </span>
            ))}
          </div>
        </Card>

        {/* PRICE & NUMERALS */}
        <Card>
          <SectionLabel>Price tag · numerals</SectionLabel>
          <div className="grid grid-cols-2 gap-3.5 mt-3">
            <div>
              <MicroLabel>Latin</MicroLabel>
              <PriceTag amount={185000} locale="en" size={20} color={BARTAL.amber} compare={220000} />
            </div>
            <div>
              <MicroLabel>Eastern Arabic</MicroLabel>
              <PriceTag amount={185000} locale="ar" size={20} color={BARTAL.amber} compare={220000} />
            </div>
            <div>
              <MicroLabel>Small</MicroLabel>
              <PriceTag amount={42000} locale="en" size={13} />
            </div>
            <div>
              <MicroLabel>Plain</MicroLabel>
              <PriceTag amount={620000} locale="en" size={16} strong={false} />
            </div>
          </div>
        </Card>

        {/* PLACEHOLDER HUES */}
        <Card>
          <SectionLabel>Product imagery · placeholder hues</SectionLabel>
          <div className="grid grid-cols-3 gap-2.5 mt-3">
            {HUES.map((h) => (
              <div
                key={h}
                className="rounded-bartal overflow-hidden"
                style={{ aspectRatio: '1.2 / 1' }}
              >
                <ProductPlaceholder label={h} hue={h} />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-ink-mute leading-relaxed mt-3">
            Subtly-striped boxes hint at product category before real photography lands.
            Hue maps to product: <strong className="text-ink">amber</strong> for fragrance,{' '}
            <strong className="text-ink">navy</strong> for electronics,{' '}
            <strong className="text-ink">rose</strong> for women&apos;s, etc.
          </p>
        </Card>

        {/* MOTIF + RADII */}
        <Card>
          <SectionLabel>Motif · radii · spacing</SectionLabel>
          <div className="flex gap-3.5 items-center mt-3 mb-4">
            <div className="w-20 h-20 rounded-bartal bg-navy relative overflow-hidden">
              <MotifBg
                color={BARTAL.amberSoft}
                opacity={0.6}
                className="absolute inset-0"
                style={{ opacity: 0.4 }}
              >
                <div className="w-full h-full" />
              </MotifBg>
            </div>
            <p className="text-[11px] text-ink-mute leading-relaxed flex-1">
              <strong className="text-ink">8-pointed star</strong> from traditional Sudanese geometry —
              used as low-opacity background on hero, receipts, brand strips.
              Never as a foreground glyph.
            </p>
          </div>
          <MicroLabel>Radius scale</MicroLabel>
          <div className="flex gap-2 items-end mt-1.5">
            {RADII.map((r) => (
              <div key={r.lbl} className="flex-1">
                <div
                  className="h-10 bg-amber-tint border border-amber/30"
                  style={{ borderRadius: r.px }}
                />
                <div className="text-[9px] text-ink-mute mt-1 text-center font-mono normal-case tracking-normal">
                  {r.lbl} · {r.px}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Surface map */}
      <div className="max-w-[1240px] mx-auto mt-6">
        <Card>
          <SectionLabel>Surface map</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3">
            {SURFACES.map((s) => (
              <div
                key={s.lbl}
                className="bg-paper border border-line rounded-bartal p-3.5"
              >
                <div className="text-[11px] text-amber font-bold uppercase tracking-wider mb-1.5">
                  {s.lbl}
                </div>
                <div
                  className="font-mono text-ink font-bold mb-1.5 normal-case tracking-normal"
                  style={{ fontSize: 18 }}
                >
                  {s.count}
                </div>
                <p className="text-[11px] text-ink-mute leading-relaxed">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="max-w-[1240px] mx-auto mt-6 text-micro text-ink-mute font-mono normal-case tracking-normal">
        rendered at /{locale}/design-system · bartal.sd
      </div>
    </div>
  );
}

function Card({
  children,
  className = '',
  padded = true,
  minHeight,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  minHeight?: number;
}) {
  return (
    <div
      className={`bg-white border border-line rounded-bartal-lg ${padded ? 'p-5' : ''} ${className}`}
      style={minHeight ? { minHeight } : undefined}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`text-[10px] font-bold uppercase tracking-[2px] ${light ? 'text-amber-soft' : 'text-amber'}`}
    >
      {children}
    </div>
  );
}

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] text-ink-mute mb-1.5 uppercase tracking-wider font-semibold">
      {children}
    </div>
  );
}

export function generateMetadata({ params }: PageProps) {
  if (!isLocale(params.locale)) return {};
  return {
    title: 'Design system · Bartal (internal)',
    description: 'Internal brand-token reference. Not for customers.',
    robots: { index: false, follow: false },
  };
}
