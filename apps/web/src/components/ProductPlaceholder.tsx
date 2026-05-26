import { PLACEHOLDER_PALETTES, type PlaceholderHue } from '@/design/tokens';

export type { PlaceholderHue };

interface ProductPlaceholderProps {
  label?: string;
  hue?: PlaceholderHue;
  className?: string;
}

/**
 * Striped placeholder swatch used for product imagery before real photos exist.
 * Picks a hue from the design system (warm / navy / amber / rose / green / night).
 * Mirrors docs/design/bartal/project/tokens.jsx ProductPlaceholder.
 */
export function ProductPlaceholder({
  label = 'product',
  hue = 'warm',
  className = '',
}: ProductPlaceholderProps) {
  const p = PLACEHOLDER_PALETTES[hue];
  const id = `ph-${hue}-${label.replace(/\W/g, '').slice(0, 12)}`;
  return (
    <div className={`relative w-full h-full overflow-hidden rounded-[inherit] ${className}`}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden
      >
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="12" fill={p[0]} />
            <rect x="6" width="6" height="12" fill={p[1]} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={p[0]} />
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: p[2],
          textTransform: 'uppercase',
          letterSpacing: 1,
          padding: 8,
          textAlign: 'center',
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** Picks a stable hue for a given product based on its slug/id. */
export function hueForProduct(key: string): PlaceholderHue {
  const hues: PlaceholderHue[] = ['warm', 'navy', 'amber', 'rose', 'green', 'night'];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return hues[Math.abs(hash) % hues.length];
}
