'use client';
import type { Locale } from '@/lib/i18n/config';
import { PriceTag } from '@/components/PriceTag';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useDeliveryZones } from '@/lib/api/queries';
import { useCheckout } from '@/lib/state/checkout-store';

interface ZoneRadioGridProps {
  locale: Locale;
}

export function ZoneRadioGrid({ locale }: ZoneRadioGridProps) {
  const zones = useDeliveryZones(locale);
  const selectedIdx = useCheckout((s) => s.selectedZoneIdx);
  const setZoneIdx = useCheckout((s) => s.setZoneIdx);
  const isAr = locale === 'ar';

  if (zones.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} height={68} />
        ))}
      </div>
    );
  }

  if (!zones.data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {zones.data.map((z, i) => {
        const on = i === selectedIdx;
        const eta = isAr
          ? `${z.estimated_days_min}–${z.estimated_days_max} يوم`
          : `${z.estimated_days_min}–${z.estimated_days_max} days`;
        return (
          <button
            type="button"
            key={z.zone}
            onClick={() => setZoneIdx(i)}
            className={`bg-white rounded-bartal p-3.5 flex items-center justify-between gap-3 text-start transition-colors ${
              on ? 'border-2 border-amber' : 'border border-line hover:border-amber/40'
            }`}
          >
            <div className="min-w-0">
              <div className="text-small font-bold text-ink truncate">
                {isAr ? z.name_ar : z.name_en}
              </div>
              <div className="text-micro text-ink-mute mt-0.5 normal-case tracking-normal">
                {eta}
              </div>
            </div>
            <PriceTag amount={z.fee_sdg} locale={locale} size={14} />
          </button>
        );
      })}
    </div>
  );
}
