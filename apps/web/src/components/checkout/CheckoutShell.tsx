import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { CheckoutStepper } from './CheckoutStepper';
import { OrderSummarySidebar } from './OrderSummarySidebar';

interface CheckoutShellProps {
  step: 1 | 2 | 3;
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}

export function CheckoutShell({ step, locale, dict, children }: CheckoutShellProps) {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <h1 className="text-h1 font-bold text-ink mb-2">{dict.web.checkout.title}</h1>
      <CheckoutStepper current={step} dict={dict} />
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="min-w-0">{children}</div>
        <OrderSummarySidebar locale={locale} dict={dict} />
      </div>
    </div>
  );
}
