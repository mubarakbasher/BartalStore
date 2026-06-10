'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useCheckout } from '@/lib/state/checkout-store';
import { AddressRadioCard } from '@/components/checkout/AddressRadioCard';
import { AddressFormPanel } from '@/components/account/AddressFormPanel';
import { ZoneRadioGrid } from '@/components/checkout/ZoneRadioGrid';
import { LandmarkNotice } from '@/components/checkout/LandmarkNotice';
import { PlusIcon } from '@/components/Icons';

interface CheckoutAddressStepProps {
  locale: Locale;
  dict: Dictionary;
}

export function CheckoutAddressStep({ locale, dict }: CheckoutAddressStepProps) {
  const isAr = locale === 'ar';
  const addresses = useCheckout((s) => s.addresses);
  const selectedAddressId = useCheckout((s) => s.selectedAddressId);
  const setAddressId = useCheckout((s) => s.setAddressId);
  const [showForm, setShowForm] = useState(false);

  // Auto-select the default (or first) address so the radio reflects a choice
  // and the review step always resolves an address.
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setAddressId(def.id);
    }
  }, [selectedAddressId, addresses, setAddressId]);

  const hasAddresses = addresses.length > 0;

  return (
    <div className="space-y-6">
      <section>
        <div className="text-h2 font-bold text-ink mb-3.5">
          {dict.web.checkout.address.title}
        </div>
        <div className="flex flex-col gap-2.5">
          {addresses.map((a) => (
            <AddressRadioCard
              key={a.id}
              address={a}
              selected={a.id === selectedAddressId}
              onSelect={() => setAddressId(a.id)}
              dict={dict}
              locale={locale}
            />
          ))}

          {!hasAddresses && !showForm && (
            <div className="bg-sand border border-line rounded-bartal p-4 text-small text-ink-mute">
              {isAr
                ? 'لا توجد عناوين محفوظة بعد — أضف عنوان التوصيل للمتابعة.'
                : 'No saved addresses yet — add a delivery address to continue.'}
            </div>
          )}

          {showForm ? (
            <AddressFormPanel
              locale={locale}
              dict={dict}
              onClose={() => setShowForm(false)}
              onCreated={(addr) => setAddressId(addr.id)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-transparent border border-dashed border-line rounded-bartal py-4 px-4 text-small font-bold text-navy flex items-center justify-center gap-1.5 hover:border-amber/50 hover:bg-sand transition-colors"
            >
              <PlusIcon size={16} />
              {dict.web.checkout.address.addNew}
            </button>
          )}
        </div>
      </section>

      <section>
        <div className="text-small font-bold text-ink mb-2.5">
          {dict.web.checkout.address.zoneSection}
        </div>
        <ZoneRadioGrid locale={locale} />
      </section>

      <LandmarkNotice dict={dict} />

      <div className="pt-2">
        {hasAddresses ? (
          <Link
            href={`/${locale}/checkout/bank`}
            className="inline-flex w-full items-center justify-center h-12 bg-navy text-white rounded-bartal font-bold hover:bg-navy-deep transition-colors"
          >
            {dict.web.checkout.address.continueToPayment}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center h-12 bg-line text-ink-mute rounded-bartal font-bold cursor-not-allowed"
          >
            {dict.web.checkout.address.continueToPayment}
          </button>
        )}
      </div>
    </div>
  );
}
