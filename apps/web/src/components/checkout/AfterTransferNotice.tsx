import type { Dictionary } from '@/lib/i18n/dictionary';

interface AfterTransferNoticeProps {
  dict: Dictionary;
}

export function AfterTransferNotice({ dict }: AfterTransferNoticeProps) {
  const steps = dict.web.checkout.bank.afterSteps;
  return (
    <div className="bg-sand border border-line rounded-bartal p-3.5">
      <div className="text-small font-bold text-ink mb-2">
        {dict.web.checkout.bank.afterTitle}
      </div>
      <ol className="ps-5 text-micro text-ink-mute leading-relaxed normal-case tracking-normal list-decimal space-y-1">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
