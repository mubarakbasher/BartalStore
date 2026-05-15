import type { Locale } from '@/lib/i18n/config';

interface BartalLogoProps {
  locale?: Locale;
  size?: number;
  color?: string;
  accent?: string;
  compact?: boolean;
}

/**
 * Bartal wordmark — 8-pointed star (portal/برتال metaphor) with amber center,
 * paired with the brand name in Cairo (AR) or Poppins (EN).
 * Matches docs/design/bartal/project/tokens.jsx BartalLogo/LogoMark.
 */
export function BartalLogo({
  locale = 'ar',
  size = 24,
  color = '#1B3A6B',
  accent = '#D4860B',
  compact = false,
}: BartalLogoProps) {
  const wordmark = locale === 'ar' ? 'برتال' : 'bartal';
  return (
    <div className="inline-flex items-center gap-2.5">
      <LogoMark size={size} color={color} accent={accent} />
      {!compact && (
        <span
          className={locale === 'ar' ? 'font-cairo' : 'font-poppins'}
          style={{
            fontWeight: 700,
            fontSize: size * 0.85,
            color,
            letterSpacing: locale === 'ar' ? 0 : -0.5,
            lineHeight: 1,
          }}
        >
          {wordmark}
        </span>
      )}
    </div>
  );
}

export function LogoMark({
  size = 28,
  color = '#1B3A6B',
  accent = '#D4860B',
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path
        d="M16 2 L20 12 L30 12 L22 18 L26 28 L16 22 L6 28 L10 18 L2 12 L12 12 Z"
        fill={color}
      />
      <circle cx="16" cy="17" r="3.2" fill={accent} />
    </svg>
  );
}
