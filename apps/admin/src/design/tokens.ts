/**
 * Bartal design tokens — mirrored from `packages/shared/src/design/tokens.ts`.
 * Inlined to keep Vite's static analysis happy across the workspace boundary
 * (the shared package is CommonJS; mixed re-exports break tree-shaking).
 * Per CLAUDE.md §5, each surface re-translates the same tokens.
 */
export const BARTAL = {
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
  d_bg: '#0B1930',
  d_surface: '#132744',
  d_raised: '#1B3358',
  d_line: '#254270',
  d_text: '#F3EFE6',
  d_textMute: '#9FB1CE',
} as const;

export type Locale = 'ar' | 'en';

export function fmtSDG(amount: number, locale: Locale = 'en'): string {
  const latin = new Intl.NumberFormat('en-US').format(amount);
  if (locale === 'ar') {
    const map = '٠١٢٣٤٥٦٧٨٩';
    return latin.replace(/\d/g, (d) => map[+d]);
  }
  return latin;
}
