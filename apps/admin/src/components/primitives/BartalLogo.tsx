import type { AdminLocale } from '@/lib/state/prefs-store';

interface BartalLogoProps {
  locale?: AdminLocale;
  size?: number;
  variant?: 'light' | 'dark';
}

const NAVY = '#1B3A6B';
const AMBER = '#D4860B';

export function BartalLogo({ locale = 'en', size = 28, variant = 'light' }: BartalLogoProps) {
  const accent = variant === 'dark' ? '#F3EFE6' : NAVY;
  return (
    <div className="inline-flex items-center gap-2" aria-label="Bartal">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M16 0 L19 13 L32 16 L19 19 L16 32 L13 19 L0 16 L13 13 Z"
          fill={accent}
        />
        <circle cx="16" cy="16" r="3.5" fill={AMBER} />
      </svg>
      <span
        className="font-bold leading-none"
        style={{ fontSize: size * 0.75, color: accent, letterSpacing: -0.5 }}
      >
        {locale === 'ar' ? 'برتال' : 'Bartal'}
      </span>
    </div>
  );
}
