'use client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useAddresses } from '@/lib/state/addresses-store';
import { AddressCard } from '@/components/account/AddressCard';
import { PlusIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function AccountAddressesContent({ locale, dict }: Props) {
  const isAr = locale === 'ar';
  const addresses = useAddresses((s) => s.addresses);
  const setDefault = useAddresses((s) => s.setDefault);
  const remove = useAddresses((s) => s.remove);
  const t = dict.web.account.addressesSection;

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
          className="bg-navy text-white rounded-bartal px-4 py-2.5 text-small font-bold flex items-center gap-1.5 hover:bg-navy-deep transition-colors"
        >
          <PlusIcon size={14} color={BARTAL.surface} />
          {t.addButton}
        </button>
      </div>

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
              onSetDefault={setDefault}
              onRemove={addresses.length > 1 ? remove : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
