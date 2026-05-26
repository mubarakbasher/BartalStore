import type { Dictionary } from '@/lib/i18n/dictionary';

interface Props {
  dict: Dictionary;
}

export function TrustMetricsCard({ dict }: Props) {
  const t = dict.web.brand.metrics;
  return (
    <aside className="bg-white border border-line rounded-bartal-lg p-5">
      <div className="text-[11px] text-ink-mute tracking-wider uppercase font-bold mb-3.5">
        {t.trustedSince}
      </div>
      <div className="text-amber font-bold font-mono mb-3.5" style={{ fontSize: 36 }}>
        {t.year}
      </div>
      <div className="h-px bg-line mb-3.5" />
      {t.rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between py-2 text-[13px]"
        >
          <span className="text-ink-mute">{row.label}</span>
          <span className="text-ink font-bold">{row.value}</span>
        </div>
      ))}
    </aside>
  );
}
