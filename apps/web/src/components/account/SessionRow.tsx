interface SessionRowProps {
  device: string;
  loc: string;
  when: string;
  current?: boolean;
  thisDeviceLabel: string;
  signOutLabel: string;
  bordered?: boolean;
}

export function SessionRow({
  device,
  loc,
  when,
  current,
  thisDeviceLabel,
  signOutLabel,
  bordered = true,
}: SessionRowProps) {
  const glyph = device.startsWith('iPhone') || device.startsWith('Samsung') ? '◫' : '▭';
  return (
    <div
      className={`px-4 py-3.5 flex items-center gap-3.5 ${
        bordered ? 'border-b border-line last:border-b-0' : ''
      }`}
    >
      <div className="w-10 h-10 rounded-bartal bg-sand text-navy flex items-center justify-center text-[18px] font-extrabold shrink-0">
        {glyph}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-small font-bold text-ink">{device}</span>
          {current && (
            <span className="px-2 py-0.5 rounded-full bg-ok/20 text-ok text-[10px] font-bold">
              {thisDeviceLabel}
            </span>
          )}
        </div>
        <div className="text-[11px] text-ink-mute mt-0.5">
          {loc} · {when}
        </div>
      </div>
      {!current && (
        <button
          type="button"
          className="bg-transparent text-danger border border-danger/30 rounded-bartal px-3 py-1.5 text-[12px] font-bold hover:bg-danger/5 transition-colors"
        >
          {signOutLabel}
        </button>
      )}
    </div>
  );
}
