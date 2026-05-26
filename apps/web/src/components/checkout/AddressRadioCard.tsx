'use client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { CheckoutAddress } from '@/lib/state/checkout-store';

interface AddressRadioCardProps {
  address: CheckoutAddress;
  selected: boolean;
  onSelect: () => void;
  dict: Dictionary;
  locale: Locale;
}

export function AddressRadioCard({
  address,
  selected,
  onSelect,
  dict,
  locale,
}: AddressRadioCardProps) {
  const isAr = locale === 'ar';
  const labels = dict.web.account.addressesSection.labels;
  const labelKey = address.label as keyof typeof labels;
  const labelText = labels[labelKey] ?? address.labelText ?? labels.other;
  const line = isAr ? address.line_ar : address.line_en;
  const city = isAr ? address.city_ar : address.city_en;
  const landmark = isAr ? address.landmark_ar : address.landmark_en;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`w-full text-start bg-white rounded-bartal p-4 cursor-pointer transition-colors ${
        selected ? 'border-2 border-amber' : 'border border-line hover:border-amber/40'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              selected ? 'border-2 border-amber' : 'border-2 border-line'
            }`}
          >
            {selected && <div className="w-2.5 h-2.5 rounded-full bg-amber" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-small font-bold text-ink">{address.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                  selected ? 'bg-amber-tint text-amber' : 'bg-sand text-ink-mute'
                }`}
              >
                {labelText}
              </span>
            </div>
            <div
              className="text-micro text-ink-mute font-mono normal-case tracking-normal mb-1.5"
              dir="ltr"
            >
              {address.phone}
            </div>
            <div className="text-small text-ink leading-relaxed">
              {line} — <span className="text-ink-mute">{city}</span>
            </div>
            <div className="mt-1.5 text-micro text-amber font-semibold">◉ {landmark}</div>
          </div>
        </div>
        <div className="flex gap-2 text-micro font-semibold shrink-0">
          <button
            type="button"
            disabled
            title={dict.web.checkout.address.comingSoonHint}
            onClick={(e) => e.stopPropagation()}
            className="text-navy hover:underline cursor-not-allowed opacity-60"
          >
            {dict.web.checkout.address.edit}
          </button>
          <span className="text-line" aria-hidden>
            |
          </span>
          <button
            type="button"
            disabled
            title={dict.web.checkout.address.comingSoonHint}
            onClick={(e) => e.stopPropagation()}
            className="text-danger hover:underline cursor-not-allowed opacity-60"
          >
            {dict.web.checkout.address.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
