'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useCheckout } from '@/lib/state/checkout-store';
import { AddressRadioCard } from '@/components/checkout/AddressRadioCard';
import { ZoneRadioGrid } from '@/components/checkout/ZoneRadioGrid';
import { LandmarkNotice } from '@/components/checkout/LandmarkNotice';
import { PlusIcon } from '@/components/Icons';

interface CheckoutAddressStepProps {
  locale: Locale;
  dict: Dictionary;
}

export function CheckoutAddressStep({ locale, dict }: CheckoutAddressStepProps) {
  const addresses = useCheckout((s) => s.addresses);
  const selectedAddressId = useCheckout((s) => s.selectedAddressId);
  const setAddressId = useCheckout((s) => s.setAddressId);

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

          <button
            type="button"
            disabled
            title={dict.web.checkout.address.comingSoonHint}
            className="bg-transparent border border-dashed border-line rounded-bartal py-4 px-4 text-small font-bold text-navy flex items-center justify-center gap-1.5 cursor-not-allowed opacity-70"
          >
            <PlusIcon size={16} />
            {dict.web.checkout.address.addNew}
          </button>
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
        <Link
          href={`/${locale}/checkout/bank`}
          className="inline-flex w-full items-center justify-center h-12 bg-navy text-white rounded-bartal font-bold hover:bg-navy-deep transition-colors"
        >
          {dict.web.checkout.address.continueToPayment}
        </Link>
      </div>
    </div>
  );
}
