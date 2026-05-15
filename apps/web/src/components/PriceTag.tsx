import type { Locale } from '@/lib/i18n/config';
import { fmtSDG } from '@/design/tokens';

interface PriceTagProps {
  amount: number;
  locale: Locale;
  size?: number;
  color?: string;
  strong?: boolean;
  compare?: number | null;
  unitClassName?: string;
}

/**
 * Formatted SDG amount with locale-aware numerals (Arabic-Indic ٠-٩ for ar).
 * Mirrors docs/design/bartal/project/tokens.jsx PriceTag.
 */
export function PriceTag({
  amount,
  locale,
  size = 16,
  color = '#0B1930',
  strong = true,
  compare,
  unitClassName = '',
}: PriceTagProps) {
  const formatted = fmtSDG(amount, locale);
  const unit = locale === 'ar' ? 'ج.س' : 'SDG';
  return (
    <span
      className={locale === 'ar' ? 'font-cairo' : 'font-poppins'}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 4,
        color,
        direction: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      <span style={{ fontSize: size, fontWeight: strong ? 700 : 500 }}>{formatted}</span>
      <span
        className={unitClassName}
        style={{ fontSize: size * 0.65, fontWeight: 500, opacity: 0.7 }}
      >
        {unit}
      </span>
      {compare != null && compare > amount && (
        <span
          style={{
            fontSize: size * 0.75,
            fontWeight: 400,
            opacity: 0.5,
            textDecoration: 'line-through',
            marginInlineStart: 6,
          }}
        >
          {fmtSDG(compare, locale)}
        </span>
      )}
    </span>
  );
}
