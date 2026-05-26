/** Icon set used across the website. Minimal stroke-based glyphs. */
type IconProps = { size?: number; color?: string; className?: string };

const base = (size = 18, color = 'currentColor') => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const SearchIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const BagIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const UserIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

export const HeartIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M12 21s-7-4.5-9.5-9C1 9 3 5 6.5 5c2 0 3.5 1 5.5 3.5C14 6 15.5 5 17.5 5 21 5 23 9 21.5 12 19 16.5 12 21 12 21Z" />
  </svg>
);

export const ArrowRightIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

export const CheckIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const MinusIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const PlusIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const StarIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className} fill={color === 'transparent' ? 'none' : color}>
    <path d="M12 3l2.7 5.7 6.3.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.3-.9L12 3Z" />
  </svg>
);

export const TruckIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M3 7h11v10H3z" />
    <path d="M14 10h4l3 3v4h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const WhatsappIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M3 21l2-6a8 8 0 1 1 4 4l-6 2Z" />
    <path d="M9 10c.5 2 2 3.5 4 4l1.3-1.5c.5-.5 1.2-.6 1.8-.2l1.4.9c.6.4.8 1.2.4 1.8-.7 1.1-1.9 1.7-3.2 1.5-3-.4-5.6-3-6-6 -.2-1.3.4-2.5 1.5-3.2.6-.4 1.4-.2 1.8.4l.9 1.4c.4.6.3 1.3-.2 1.8L9 10Z" />
  </svg>
);

export const GridIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const BankIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M3 10h18" />
    <path d="M5 10v8" />
    <path d="M9 10v8" />
    <path d="M15 10v8" />
    <path d="M19 10v8" />
    <path d="M3 21h18" />
    <path d="M12 3 3 8h18Z" />
  </svg>
);

export const CopyIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const CameraIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

export const DownloadIcon = ({ size, color, className }: IconProps) => (
  <svg {...base(size, color)} className={className}>
    <path d="M12 4v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);
