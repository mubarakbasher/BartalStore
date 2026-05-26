'use client';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useCheckout } from '@/lib/state/checkout-store';

interface TermsAgreementRowProps {
  locale: Locale;
  dict: Dictionary;
}

export function TermsAgreementRow({ locale, dict }: TermsAgreementRowProps) {
  const agreed = useCheckout((s) => s.agreedToTerms);
  const setAgreed = useCheckout((s) => s.setAgreedToTerms);

  return (
    <label className="flex items-start gap-2.5 bg-sand border border-line rounded-bartal p-3.5 cursor-pointer">
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="mt-0.5 accent-amber w-4 h-4 shrink-0"
      />
      <span className="text-micro text-ink-mute leading-relaxed normal-case tracking-normal">
        {dict.web.checkout.review.terms.body}{' '}
        <Link
          href={`/${locale}/terms`}
          className="text-amber font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {dict.web.checkout.review.terms.learnMore}
        </Link>
      </span>
    </label>
  );
}
