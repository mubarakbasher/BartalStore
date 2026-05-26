import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bartal · بَرتال — Sudan online marketplace';
export const size = { width: 1200, height: 630 } as const;
export const contentType = 'image/png';

const NAVY = '#1B3A6B';
const AMBER = '#D4860B';
const SAND = '#F7F3EC';

export default function OgImage() {
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
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 999,
              background: AMBER,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
              fontWeight: 800,
              color: NAVY,
            }}
          >
            ✦
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: -1, color: SAND }}>
              Bartal
            </div>
            <div style={{ fontSize: 36, fontWeight: 600, color: AMBER, marginTop: -8 }}>
              بَرتال
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 56, lineHeight: 1.1, fontWeight: 700, color: SAND }}>
            Sudan’s online marketplace.
          </div>
          <div style={{ fontSize: 32, color: SAND, opacity: 0.85 }}>
            Fast delivery across Khartoum · Local bank transfer · WhatsApp support
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
