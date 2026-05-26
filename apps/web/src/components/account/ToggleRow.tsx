'use client';
interface ToggleRowProps {
  label: string;
  sub?: string;
  on: boolean;
  onToggle: () => void;
  /** Optional secondary action label (e.g. "Manage"). */
  action?: { label: string; onClick: () => void };
  /** "Enabled / Off" status pill rendered between the body and the action. */
  statusPill?: { label: string; on: boolean };
  bordered?: boolean;
}

export function ToggleRow({
  label,
  sub,
  on,
  onToggle,
  action,
  statusPill,
  bordered = true,
}: ToggleRowProps) {
  return (
    <div
      className={`flex items-center gap-3 py-3 ${
        bordered ? 'border-b border-line last:border-b-0' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-small font-semibold text-ink">{label}</div>
        {sub && <div className="text-small text-ink-mute mt-0.5">{sub}</div>}
      </div>
      {statusPill && (
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            statusPill.on ? 'bg-ok/10 text-ok' : 'bg-sand text-ink-mute'
          }`}
        >
          {statusPill.label}
        </span>
      )}
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="text-amber font-bold text-small hover:underline"
        >
          {action.label}
        </button>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            on ? 'bg-amber' : 'bg-line'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              on ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'
            }`}
          />
        </button>
      )}
    </div>
  );
}
