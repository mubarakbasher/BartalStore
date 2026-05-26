'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { BankInfo } from './BankRadioCard';
import { PriceTag } from '@/components/PriceTag';
import { BARTAL, fmtSDG } from '@/design/tokens';

interface BankInstructionsCardProps {
  bank: BankInfo;
  total: number;
  reference: string;
  locale: Locale;
  dict: Dictionary;
}

interface CopyRowProps {
  label: string;
  display: React.ReactNode;
  copyValue: string;
  dict: Dictionary;
  isLast?: boolean;
  monoDisplay?: boolean;
  amber?: boolean;
}

function CopyRow({ label, display, copyValue, dict, isLast, monoDisplay, amber }: CopyRowProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 py-2.5 ${
        isLast ? '' : 'border-b border-dashed border-line'
      }`}
    >
      <span className="text-small text-ink-mute shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`text-small font-bold truncate normal-case tracking-normal ${
            amber ? 'text-amber' : 'text-ink'
          } ${monoDisplay ? 'font-mono' : ''}`}
          dir="ltr"
        >
          {display}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-micro text-amber font-semibold shrink-0 hover:underline normal-case tracking-normal"
          aria-label={dict.web.checkout.bank.copy}
        >
          {copied ? dict.web.checkout.bank.copied : dict.web.checkout.bank.copy}
        </button>
      </div>
    </div>
  );
}

export function BankInstructionsCard({
  bank,
  total,
  reference,
  locale,
  dict,
}: BankInstructionsCardProps) {
  const t = dict.web.checkout.thankYou.bank;
  const isAr = locale === 'ar';
  const bankName = isAr ? bank.name_ar : bank.name_en;
  const amountLatin = `${fmtSDG(total, 'en')} SDG`;
  const amountDisplay = (
    <PriceTag amount={total} locale={locale} size={14} color={BARTAL.amber} />
  );

  return (
    <div className="bg-amber-tint border-2 border-amber/60 rounded-bartal-lg p-5">
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-micro text-amber font-semibold normal-case tracking-normal">
            {t.stepLabel}
          </div>
          <h2 className="text-h2 font-bold text-navy-ink mt-0.5">{t.title}</h2>
        </div>
        <span className="bg-white border border-amber text-amber text-micro font-semibold rounded-full px-3 py-1 normal-case tracking-normal">
          {t.validPill}
        </span>
      </div>

      <div className="bg-white rounded-bartal px-4 py-1">
        <CopyRow
          label={t.fields.bank}
          display={bankName}
          copyValue={isAr ? bank.name_ar : bank.name_en}
          dict={dict}
        />
        <CopyRow
          label={t.fields.accountName}
          display={t.accountHolder}
          copyValue={t.accountHolder}
          dict={dict}
        />
        <CopyRow
          label={t.fields.accountNumber}
          display={bank.account}
          copyValue={bank.account}
          dict={dict}
          monoDisplay
        />
        <CopyRow
          label={t.fields.iban}
          display={bank.iban}
          copyValue={bank.iban}
          dict={dict}
          monoDisplay
        />
        <CopyRow
          label={t.fields.amount}
          display={amountDisplay}
          copyValue={amountLatin}
          dict={dict}
          amber
        />
        <CopyRow
          label={t.fields.reference}
          display={reference}
          copyValue={reference}
          dict={dict}
          monoDisplay
          isLast
        />
      </div>

      <div className="mt-3 px-3.5 py-2.5 bg-white/60 border border-amber rounded-bartal text-small text-navy-ink leading-relaxed">
        <strong>{t.importantPrefix} </strong>
        {t.importantBody}
      </div>
    </div>
  );
}
