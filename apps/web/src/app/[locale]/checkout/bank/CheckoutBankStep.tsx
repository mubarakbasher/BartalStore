'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useCheckout } from '@/lib/state/checkout-store';
import { BANKS, PREVIEW_ORDER_REFERENCE } from '@/lib/state/checkout-banks';
import { useOrderTotal } from '@/lib/state/use-order-total';
import { BankRadioCard } from '@/components/checkout/BankRadioCard';
import { AfterTransferNotice } from '@/components/checkout/AfterTransferNotice';
import { fmtSDG } from '@/design/tokens';

interface CheckoutBankStepProps {
  locale: Locale;
  dict: Dictionary;
}

export function CheckoutBankStep({ locale, dict }: CheckoutBankStepProps) {
  const selectedBankId = useCheckout((s) => s.selectedBankId);
  const setBankId = useCheckout((s) => s.setBankId);
  const { total } = useOrderTotal(locale);

  return (
    <div className="space-y-5">
      <section>
        <div className="text-h2 font-bold text-ink mb-1.5">
          {dict.web.checkout.bank.title}
        </div>
        <p className="text-small text-ink-mute leading-relaxed mb-4">
          {dict.web.checkout.bank.subtitle}
        </p>

        <div className="flex flex-col gap-2.5">
          {BANKS.map((b) => (
            <BankRadioCard
              key={b.id}
              bank={b}
              selected={b.id === selectedBankId}
              onSelect={() => setBankId(b.id)}
              amountLatin={fmtSDG(total, 'en')}
              reference={PREVIEW_ORDER_REFERENCE}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>
      </section>

      <AfterTransferNotice dict={dict} />

      <div className="pt-1 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link
          href={`/${locale}/checkout/address`}
          className="inline-flex items-center justify-center h-11 px-4 text-small font-semibold text-navy hover:bg-sand rounded-bartal"
        >
          ← {dict.web.checkout.bank.backToAddress}
        </Link>
        <Link
          href={`/${locale}/checkout/review`}
          className="inline-flex w-full sm:w-auto items-center justify-center h-12 px-8 bg-navy text-white rounded-bartal font-bold hover:bg-navy-deep transition-colors"
        >
          {dict.web.checkout.bank.continueToReview}
        </Link>
      </div>
    </div>
  );
}
