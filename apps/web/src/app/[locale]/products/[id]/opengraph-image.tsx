import { ImageResponse } from 'next/og';
import { apiGet } from '@/lib/api/client';
import type { Product } from '@/lib/api/types';
import { isLocale, type Locale } from '@/lib/i18n/config';

export const runtime = 'edge';
export const alt = 'Bartal product';
export const size = { width: 1200, height: 630 } as const;
export const contentType = 'image/png';

const NAVY = '#1B3A6B';
const AMBER = '#D4860B';
const SAND = '#F7F3EC';

interface RouteParams {
  params: { locale: string; id: string };
}

export default async function PdpOgImage({ params }: RouteParams) {
  const locale: Locale = isLocale(params.locale) ? (params.locale as Locale) : 'ar';
  let product: Product | null = null;
  try {
    product = await apiGet<Product>(`products/${params.id}`, {}, locale);
  } catch {
    product = null;
  }
  const name = product
    ? locale === 'ar' ? product.name_ar : product.name_en
    : locale === 'ar' ? 'منتج برتال' : 'Bartal product';
  const description = product
    ? (locale === 'ar' ? product.description_ar : product.description_en).slice(0, 140)
    : '';
  const price = product ? Number(product.price).toLocaleString('en-US') : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${NAVY} 0%, #122647 100%)`,
          color: SAND,
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: AMBER,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 800,
              color: NAVY,
            }}
          >
            ✦
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, color: SAND }}>Bartal</div>
        </div>

        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 700,
              color: SAND,
              maxWidth: 980,
            }}
          >
            {name}
          </div>
          {description && (
            <div style={{ fontSize: 28, color: SAND, opacity: 0.8, maxWidth: 980 }}>{description}</div>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 24 }}>
          {price && (
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: AMBER,
                background: 'rgba(212, 134, 11, 0.12)',
                padding: '12px 24px',
                borderRadius: 16,
              }}
            >
              {price} SDG
            </div>
          )}
          <div style={{ fontSize: 24, color: SAND, opacity: 0.7 }}>bartal.sd</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
