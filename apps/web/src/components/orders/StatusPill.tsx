import type { DemoOrderStatus } from '@bartal/shared';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface StatusPillProps {
  status: DemoOrderStatus;
  dict: Dictionary;
}

const COLORS: Record<DemoOrderStatus, string> = {
  placed:     'bg-info/10 text-info',
  review:     'bg-amber-tint text-amber',
  verified:   'bg-ok/15 text-ok',
  preparing:  'bg-info/10 text-info',
  shipped:    'bg-navy/10 text-navy',
  delivered:  'bg-ok/15 text-ok',
  cancelled:  'bg-danger/15 text-danger',
};

export function StatusPill({ status, dict }: StatusPillProps) {
  const label = dict.web.orders.statusPills[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${COLORS[status]}`}
    >
      ● {label}
    </span>
  );
}
