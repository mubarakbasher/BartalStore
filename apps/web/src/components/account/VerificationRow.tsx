import type { VerificationState } from '@bartal/shared';

interface VerificationRowProps {
  label: string;
  via: string;
  state: VerificationState;
  verifyLabel: string;
}

export function VerificationRow({ label, via, state, verifyLabel }: VerificationRowProps) {
  const isOn = state === 'verified';
  return (
    <div className="bg-white border border-line rounded-bartal p-3 flex items-center gap-2.5">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
          isOn ? 'bg-ok text-white' : 'bg-sand text-ink-mute'
        }`}
      >
        {isOn ? '✓' : '!'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-small font-semibold text-ink truncate">{label}</div>
        <div className="text-[11px] text-ink-mute mt-0.5 truncate">{via}</div>
      </div>
      {!isOn && (
        <button
          type="button"
          className="text-[11px] text-amber font-bold hover:underline shrink-0"
        >
          {verifyLabel}
        </button>
      )}
    </div>
  );
}
