import type { Config } from 'tailwindcss';
import rtl from 'tailwindcss-rtl';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B3A6B',
          deep: '#122647',
          ink: '#0B1930',
        },
        amber: {
          DEFAULT: '#D4860B',
          soft: '#F2B544',
          tint: '#FDF4E2',
          hover: '#B57208',
          active: '#9A6206',
        },
        sand: '#F7F3EC',
        paper: '#FBFAF7',
        ink: {
          DEFAULT: '#1A1A1A',
          mute: '#6B6356',
        },
        line: '#E8E2D5',
        ok: '#2E7D32',
        danger: '#C62828',
        info: '#3A6DB0',
        // Dark mode
        'd-bg': '#0B1930',
        'd-surface': '#132744',
        'd-raised': '#1B3358',
        'd-line': '#254270',
        'd-text': '#F3EFE6',
        'd-textMute': '#9FB1CE',
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['17px', { lineHeight: '1.35', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        small: ['13px', { lineHeight: '1.45', fontWeight: '400' }],
        micro: ['11px', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.5px' }],
      },
      borderRadius: {
        bartal: '12px',
        'bartal-lg': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 25, 48, 0.04), 0 4px 12px rgba(11, 25, 48, 0.04)',
        elevated: '0 4px 24px rgba(11, 25, 48, 0.08)',
      },
    },
  },
  plugins: [rtl],
};
export default config;
