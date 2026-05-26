'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { useCart } from '@/lib/state/cart-store';
import { useCheckout } from '@/lib/state/checkout-store';
import {
  findBankById,
  PREVIEW_ORDER_REFERENCE,
} from '@/lib/state/checkout-banks';
import { ReviewEditCard } from '@/components/checkout/ReviewEditCard';
import { ReviewItemsList } from '@/components/checkout/ReviewItemsList';
import { TermsAgreementRow } from '@/components/checkout/TermsAgreementRow';
import { BankIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface CheckoutReviewStepProps {
  locale: Locale;
  dict: Dictionary;
}

export function CheckoutReviewStep({ locale, dict }: CheckoutReviewStepProps) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const items = useCart((s) => s.items);
  const addresses = useCheckout((s) => s.addresses);
  const selectedAddressId = useCheckout((s) => s.selectedAddressId);
  const selectedBankId = useCheckout((s) => s.selectedBankId);
  const agreedToTerms = useCheckout((s) => s.agreedToTerms);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const address =
    addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
  const bank = findBankById(selectedBankId) ?? findBankById('faisal');
  const itemCount = hydrated ? items.length : 0;
  const canPlace = hydrated && agreedToTerms && itemCount > 0;

  const review = dict.web.checkout.review;

  const onPlaceOrder = () => {
    router.push(`/${locale}/checkout/thank-you/${PREVIEW_ORDER_REFERENCE}`);
  };

  return (
    <div className="space-y-3.5">
      <div className="text-h2 font-bold text-ink mb-1">{review.title}</div>

      {/* Card 1 — Ship to */}
      <ReviewEditCard
        title={review.cards.shipTo}
        editLabel={review.editTargets.address}
        editHref={`/${locale}/checkout/address`}
        dict={dict}
      >
        <div className="text-small font-semibold text-ink">{address.name}</div>
        <div
          className="text-micro text-ink-mute mt-0.5 font-mono normal-case tracking-normal"
          dir="ltr"
        >
          {address.phone}
        </div>
        <div className="text-small text-ink mt-1.5 leading-relaxed">
          {isAr ? address.line_ar : address.line_en} —{' '}
          <span className="text-ink-mute">
            {isAr ? address.city_ar : address.city_en}
          </span>
        </div>
        <div className="mt-1 text-micro text-amber font-semibold">
          ◉ {isAr ? address.landmark_ar : address.landmark_en}
        </div>
      </ReviewEditCard>

      {/* Card 2 — Payment */}
      <ReviewEditCard
        title={review.cards.payment}
        editLabel={review.editTargets.payment}
        editHref={`/${locale}/checkout/bank`}
        dict={dict}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-bartal bg-sand flex items-center justify-center shrink-0">
            <BankIcon size={18} color={BARTAL.navy} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-small font-bold text-ink truncate">
              {tt(review.payment.bankTransfer, {
                bank: isAr ? bank!.name_ar : bank!.name_en,
              })}
            </div>
            <div
              className="text-micro text-ink-mute mt-0.5 font-mono normal-case tracking-normal"
              dir="ltr"
            >
              ****{bank!.account.slice(-4)}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-tint text-amber text-[11px] font-bold tracking-wide shrink-0">
            {review.payment.uploadAfterPlacing}
          </span>
        </div>
      </ReviewEditCard>

      {/* Card 3 — Items */}
      <ReviewEditCard
        title={tt(review.cards.items, { count: itemCount })}
        editLabel={review.editTargets.cart}
        editHref={`/${locale}/cart`}
        dict={dict}
      >
        <ReviewItemsList locale={locale} dict={dict} />
      </ReviewEditCard>

      <TermsAgreementRow locale={locale} dict={dict} />

      <div className="pt-1 space-y-2.5">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={!canPlace}
          className="w-full inline-flex items-center justify-center h-12 px-6 bg-navy text-white rounded-bartal font-bold hover:bg-navy-deep transition-colors disabled:bg-line disabled:text-ink-mute disabled:cursor-not-allowed"
        >
          {review.placeOrder}
        </button>
        <div className="flex justify-center">
          <Link
            href={`/${locale}/checkout/bank`}
            className="inline-flex items-center justify-center h-11 px-4 text-small font-semibold text-navy hover:bg-sand rounded-bartal"
          >
            ← {review.backToBank}
          </Link>
        </div>
      </div>
    </div>
  );
}
