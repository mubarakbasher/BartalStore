import { fmtSDG } from '@/design/tokens';
import type { AdminLocale } from '@/lib/state/prefs-store';

interface PriceTagProps {
  amount: number;
  locale?: AdminLocale;
  size?: number;
  className?: string;
}

export function PriceTag({ amount, locale = 'en', size = 14, className }: PriceTagProps) {
  return (
    <span
      className={`inline-flex items-baseline gap-1 font-mono font-semibold text-ink dark:text-d-text ${className ?? ''}`}
      style={{ fontSize: size }}
      dir="ltr"
    >
      <span>{fmtSDG(amount, locale)}</span>
      <span className="text-micro font-mono text-ink-mute dark:text-d-textMute">SDG</span>
    </span>
  );
}
