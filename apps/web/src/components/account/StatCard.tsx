interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-white border border-line rounded-bartal px-4 py-3.5">
      <div className="text-[10px] font-semibold text-ink-mute uppercase tracking-wider">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <div className="text-[22px] font-bold text-ink tabular-nums">{value}</div>
        {unit && <div className="text-[11px] text-ink-mute font-medium">{unit}</div>}
      </div>
    </div>
  );
}
