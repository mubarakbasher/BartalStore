/**
 * Bartal design tokens — translated from docs/design/bartal/project/tokens.jsx.
 * Source of truth for colors, typography, motif, and locale-aware utilities.
 * Shared across web, admin, and (translated) mobile surfaces.
 */
export const BARTAL = {
  // Light palette
  navy: '#1B3A6B',
  navyDeep: '#122647',
  navyInk: '#0B1930',
  amber: '#D4860B',
  amberSoft: '#F2B544',
  amberTint: '#FDF4E2',
  sand: '#F7F3EC',
  paper: '#FBFAF7',
  surface: '#FFFFFF',
  line: '#E8E2D5',
  text: '#1A1A1A',
  textMute: '#6B6356',
  success: '#2E7D32',
  danger: '#C62828',
  info: '#3A6DB0',

  // Dark palette
  d_bg: '#0B1930',
  d_surface: '#132744',
  d_raised: '#1B3358',
  d_line: '#254270',
  d_text: '#F3EFE6',
  d_textMute: '#9FB1CE',
} as const;

export type Locale = 'ar' | 'en';

/** Format an SDG amount with locale-appropriate numerals. */
export function fmtSDG(amount: number, locale: Locale = 'en'): string {
  const latin = new Intl.NumberFormat('en-US').format(amount);
  if (locale === 'ar') {
    const map = '٠١٢٣٤٥٦٧٨٩';
    return latin.replace(/\d/g, (d) => map[+d]);
  }
  return latin;
}

/** Placeholder hue palettes (matches design tokens.jsx ProductPlaceholder). */
export const PLACEHOLDER_PALETTES = {
  warm: ['#F2E3C4', '#E8D3A8', '#D4B982'],
  navy: ['#D7DDE8', '#B7C4D8', '#8FA3C2'],
  amber: ['#FBEACB', '#F2D79E', '#E5B867'],
  rose: ['#F0DAD2', '#DDBCB0', '#C5998C'],
  green: ['#D9E3D4', '#BACBB0', '#95AF87'],
  night: ['#1B3358', '#254270', '#0B1930'],
} as const;

export type PlaceholderHue = keyof typeof PLACEHOLDER_PALETTES;
