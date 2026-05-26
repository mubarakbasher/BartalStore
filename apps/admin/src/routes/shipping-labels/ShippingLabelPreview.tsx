import type { ShippingLabelRow } from '@/lib/api/types';
import { BartalLogo } from '@/components/primitives/BartalLogo';
import { fmtSDG } from '@/design/tokens';

interface Props {
  label: ShippingLabelRow;
  locale: 'ar' | 'en';
}

const ZONE_FROM_DB: Record<string, string> = {
  ZONE_A: 'A',
  ZONE_B: 'B',
  ZONE_C: 'C',
  ZONE_D: 'D',
};

function FakeBarcode() {
  const bars = Array.from({ length: 60 }).map((_, i) => ({
    x: i * 3.3,
    w: [1, 2, 1, 3, 1, 2, 2, 1, 3, 1][i % 10],
  }));
  return (
    <svg viewBox="0 0 200 30" width="100%" height="30" aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={30} fill="#000" />
      ))}
    </svg>
  );
}

export function ShippingLabelPreview({ label, locale }: Props) {
  const trackingDisplay =
    label.tracking_number ?? label.order_number.replace(/^BRT-/, 'BTL-');
  const zoneShort = ZONE_FROM_DB[label.address.zone] ?? label.address.zone;
  const addressLine = [label.address.street, label.address.landmark]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      className="ship-label bg-white text-ink rounded shadow-card relative overflow-hidden"
      style={{ aspectRatio: '4/6', padding: 18, fontFamily: 'Poppins, system-ui' }}
    >
      <div className="flex items-center border-b-2 border-black pb-2 mb-3">
        <BartalLogo size={18} variant="light" />
        <div className="ms-auto text-end">
          <div className="text-[9px] uppercase tracking-[1px] text-ink-mute">
            {locale === 'ar' ? 'الطلب' : 'Order'}
          </div>
          <div className="font-mono text-[11px] font-bold">{trackingDisplay}</div>
        </div>
      </div>

      <div className="text-[8px] uppercase tracking-[1px] text-ink-mute mb-1">FROM</div>
      <div className="text-[10px] leading-snug mb-3">
        Bartal Fulfillment · Khartoum<br />
        Industrial area, gate 12 · +249 90 000 0000
      </div>

      <div className="text-[8px] uppercase tracking-[1px] text-ink-mute mb-1">SHIP TO</div>
      <div className="text-[13px] font-bold mb-0.5">{label.address.full_name}</div>
      <div className="text-[11px] leading-snug mb-1">
        {addressLine}
        <br />
        {label.address.district}, Sudan
      </div>
      <div className="font-mono text-[11px] font-semibold">{label.address.phone}</div>

      <div className="mt-2.5 inline-flex bg-black text-white font-bold text-[11px] tracking-[1px] py-1 px-2.5 rounded">
        ZONE {zoneShort} · {label.address.district.toUpperCase()}
      </div>

      <div className="absolute start-4 end-4 bottom-3">
        {label.is_cod && (
          <div
            className="text-center font-bold text-[13px] tracking-[1px] py-1.5 px-2.5 mb-2 text-white"
            style={{ background: '#D4860B' }}
          >
            COD · COLLECT {fmtSDG(label.total, 'en')} SDG
          </div>
        )}
        <FakeBarcode />
        <div className="text-center font-mono text-[10px] mt-1">*{trackingDisplay}*</div>
      </div>
    </div>
  );
}
