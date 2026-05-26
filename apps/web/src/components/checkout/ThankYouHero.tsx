'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { tt } from '@/lib/i18n/dictionary';
import { MotifBg } from '@/components/MotifBg';
import { CheckIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface ThankYouHeroProps {
  customerFirstName: string;
  orderId: string;
  locale: Locale;
  dict: Dictionary;
}

function formatNow(locale: Locale): string {
  const now = new Date();
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(now);
}

export function ThankYouHero({
  customerFirstName,
  orderId,
  locale,
  dict,
}: ThankYouHeroProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  useEffect(() => {
    setFormattedDate(formatNow(locale));
  }, [locale]);

  const h = dict.web.checkout.thankYou.hero;

  return (
    <div className="bg-white border border-line rounded-bartal-lg overflow-hidden">
      <MotifBg color={BARTAL.amber} opacity={0.05} className="w-full">
        <div className="p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div
            className="w-20 h-20 rounded-full bg-ok flex items-center justify-center shrink-0 shadow-elevated"
            aria-hidden
          >
            <CheckIcon size={40} color="#fff" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-micro font-semibold text-amber normal-case tracking-normal mb-1.5">
              {tt(h.greeting, { name: customerFirstName })}
            </div>
            <h1 className="text-ink font-bold leading-tight" style={{ fontSize: 30 }}>
              {h.headline}
            </h1>
            <p className="text-body text-ink-mute mt-2 leading-relaxed max-w-[600px]">
              {h.body}
            </p>
          </div>

          <div className="text-start md:text-end shrink-0">
            <div className="text-micro text-ink-mute normal-case tracking-normal">
              {h.orderNumberLabel}
            </div>
            <div
              className="font-mono text-ink font-bold mt-1 normal-case tracking-normal"
              style={{ fontSize: 18 }}
              dir="ltr"
            >
              {orderId}
            </div>
            <div className="text-small text-ink-mute mt-1 normal-case tracking-normal">
              {formattedDate || ' '}
            </div>
          </div>
        </div>
      </MotifBg>
    </div>
  );
}
