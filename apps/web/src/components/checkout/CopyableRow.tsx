'use client';
import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface CopyableRowProps {
  label: string;
  value: string;
  isLast?: boolean;
  dict: Dictionary;
}

export function CopyableRow({ label, value, isLast, dict }: CopyableRowProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Silent — clipboard may be unavailable (insecure context / unsupported browser).
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 py-1.5 ${
        isLast ? '' : 'border-b border-dashed border-line'
      }`}
    >
      <span className="text-micro text-ink-mute shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-small font-bold text-ink font-mono truncate normal-case tracking-normal"
          dir="ltr"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-micro text-amber font-semibold shrink-0 hover:underline normal-case tracking-normal"
        >
          {copied ? dict.web.checkout.bank.copied : dict.web.checkout.bank.copy}
        </button>
      </div>
    </div>
  );
}
