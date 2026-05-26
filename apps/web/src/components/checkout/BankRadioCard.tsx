'use client';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { BankIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';
import { CopyableRow } from './CopyableRow';

export interface BankInfo {
  id: string;
  name_ar: string;
  name_en: string;
  account: string;
  swift: string;
  iban: string;
}

interface BankRadioCardProps {
  bank: BankInfo;
  selected: boolean;
  onSelect: () => void;
  amountLatin: string;
  reference: string;
  locale: Locale;
  dict: Dictionary;
}

export function BankRadioCard({
  bank,
  selected,
  onSelect,
  amountLatin,
  reference,
  locale,
  dict,
}: BankRadioCardProps) {
  const name = locale === 'ar' ? bank.name_ar : bank.name_en;
  const fields = dict.web.checkout.bank.fields;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`bg-white rounded-bartal p-4 cursor-pointer transition-colors ${
        selected ? 'border-2 border-amber' : 'border border-line hover:border-amber/40'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
            selected ? 'border-2 border-amber' : 'border-2 border-line'
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-amber" />}
        </div>
        <div className="w-11 h-11 rounded-bartal bg-sand flex items-center justify-center shrink-0">
          <BankIcon size={20} color={BARTAL.navy} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-small font-bold text-ink truncate">{name}</div>
          <div
            className="text-micro text-ink-mute mt-0.5 font-mono normal-case tracking-normal"
            dir="ltr"
          >
            {bank.account}
          </div>
        </div>
        {selected && (
          <span className="px-2.5 py-1 rounded-full bg-amber-tint text-amber text-[11px] font-bold tracking-wide shrink-0">
            {dict.web.checkout.bank.recommended}
          </span>
        )}
      </div>

      {selected && (
        <div
          className="mt-3.5 p-3.5 bg-sand rounded-bartal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] font-bold text-ink-mute uppercase tracking-wider mb-2.5">
            {dict.web.checkout.bank.copyHeader}
          </div>
          <CopyableRow
            label={fields.accountName}
            value={dict.web.checkout.bank.accountHolder}
            dict={dict}
          />
          <CopyableRow label={fields.accountNumber} value={bank.account} dict={dict} />
          <CopyableRow label={fields.swift} value={bank.swift} dict={dict} />
          <CopyableRow
            label={fields.amount}
            value={`${amountLatin} SDG`}
            dict={dict}
          />
          <CopyableRow label={fields.reference} value={reference} isLast dict={dict} />
        </div>
      )}
    </div>
  );
}
