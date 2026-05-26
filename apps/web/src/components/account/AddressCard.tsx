'use client';
import type { Address } from '@bartal/shared';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface AddressCardProps {
  address: Address;
  locale: Locale;
  dict: Dictionary;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function AddressCard({ address, locale, dict, onSetDefault, onRemove }: AddressCardProps) {
  const isAr = locale === 'ar';
  const t = dict.web.account.addressesSection;
  const labelKey = address.label as keyof typeof t.labels;
  const labelText = t.labels[labelKey] ?? address.labelText ?? t.labels.other;
  const line = isAr ? address.line_ar : address.line_en;
  const city = isAr ? address.city_ar : address.city_en;
  const landmark = isAr ? address.landmark_ar : address.landmark_en;
  const isDefault = !!address.isDefault;

  return (
    <article
      className={`bg-white rounded-bartal p-4 ${
        isDefault ? 'border-2 border-amber' : 'border border-line'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isDefault ? 'bg-amber-tint text-amber' : 'bg-sand text-ink-mute'
            }`}
          >
            {labelText}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sand text-ink-mute px-2 py-0.5 rounded-full">
            {t.zonePrefix} {address.zone}
          </span>
          {isDefault && (
            <span className="text-[10px] font-bold text-amber">{t.defaultPill}</span>
          )}
        </div>
      </div>
      <div className="text-small font-bold text-ink">{address.name}</div>
      <div className="text-[11px] text-ink-mute font-mono mt-0.5" dir="ltr">
        {address.phone}
      </div>
      <div className="text-small text-ink mt-2 leading-relaxed">
        {line}
        <br />
        <span className="text-ink-mute">{city}</span>
      </div>
      <div className="mt-2 px-2.5 py-1.5 bg-sand rounded-bartal text-small text-amber font-semibold">
        ◉ {landmark}
      </div>

      <div className="flex gap-2 mt-3">
        {!isDefault && onSetDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="flex-1 bg-transparent text-navy border border-line rounded-bartal py-2 text-[12px] font-bold hover:bg-sand transition-colors"
          >
            {t.setDefault}
          </button>
        )}
        <button
          type="button"
          disabled
          title={dict.web.checkout.address.comingSoonHint}
          className="flex-1 bg-transparent text-navy border border-line rounded-bartal py-2 text-[12px] font-bold opacity-60 cursor-not-allowed"
        >
          {t.edit}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(address.id)}
            className="bg-transparent text-danger border border-danger/30 rounded-bartal px-3 py-2 text-[12px] font-bold hover:bg-danger/5 transition-colors"
            aria-label={t.remove}
          >
            ×
          </button>
        )}
      </div>
    </article>
  );
}
