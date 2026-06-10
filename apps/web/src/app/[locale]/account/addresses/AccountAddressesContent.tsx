'use client';
import { useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useAddresses } from '@/lib/state/addresses-store';
import { AddressCard } from '@/components/account/AddressCard';
import { AddressFormPanel } from '@/components/account/AddressFormPanel';
import { PlusIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';
import type { Address } from '@bartal/shared';

interface Props {
  locale: Locale;
  dict: Dictionary;
  initialAddresses: Address[];
}

export function AccountAddressesContent({ locale, dict, initialAddresses }: Props) {
  const isAr = locale === 'ar';
  // Read from the store (hydrated by <HydrateAddresses>); fall back to SSR props
  // on the very first render before hydration runs.
  const stored = useAddresses((s) => s.addresses);
  const hydrated = useAddresses((s) => s.hydrated);
  const setDefault = useAddresses((s) => s.setDefault);
  const remove = useAddresses((s) => s.remove);
  const addresses = hydrated ? stored : initialAddresses;
  const t = dict.web.account.addressesSection;

  const [showForm, setShowForm] = useState(false);
  const [, startTransition] = useTransition();

  const hasDefault = addresses.some((a) => a.isDefault);
  const countCopy = hasDefault
    ? tt(t.countWithDefault, {
        count: isAr ? addresses.length.toLocaleString('ar-EG') : addresses.length,
      })
    : tt(t.countNoDefault, {
        count: isAr ? addresses.length.toLocaleString('ar-EG') : addresses.length,
      });

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[18px] font-bold text-ink">{t.heading}</div>
          <div className="text-[12px] text-ink-mute mt-0.5">{countCopy}</div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-navy text-white rounded-bartal px-4 py-2.5 text-small font-bold flex items-center gap-1.5 hover:bg-navy-deep transition-colors"
        >
          <PlusIcon size={14} color={BARTAL.surface} />
          {t.addButton}
        </button>
      </div>

      {showForm && (
        <AddressFormPanel
          locale={locale}
          dict={dict}
          onClose={() => setShowForm(false)}
        />
      )}

      {addresses.length === 0 ? (
        <div className="bg-white border border-line rounded-bartal p-8 text-center">
          <div className="text-[16px] font-bold text-ink mb-1.5">{t.emptyTitle}</div>
          <div className="text-small text-ink-mute">{t.emptyHint}</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              locale={locale}
              dict={dict}
              onSetDefault={(id) => startTransition(() => void setDefault(id, locale))}
              onRemove={
                addresses.length > 1
                  ? (id) => startTransition(() => void remove(id, locale))
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
