import type { ReactNode, CSSProperties } from 'react';
import { useId } from 'react';

interface MotifBgProps {
  color?: string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Repeating Sudanese-geometry motif as a background layer.
 * Ports docs/design/bartal/project/tokens.jsx MotifBg.
 * Children render on top of the pattern in a stacking context.
 */
export function MotifBg({
  color = '#1B3A6B',
  opacity = 0.06,
  className,
  style,
  children,
}: MotifBgProps) {
  const id = `motif-${useId().replace(/:/g, '')}`;
  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden
      >
        <defs>
          <pattern id={id} x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <g stroke={color} strokeWidth="1" fill="none" opacity={opacity}>
              <path d="M32 6 L38 19 L51 13 L45 26 L58 32 L45 38 L51 51 L38 45 L32 58 L26 45 L13 51 L19 38 L6 32 L19 26 L13 13 L26 19 Z" />
              <path d="M32 19 L45 32 L32 45 L19 32 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
