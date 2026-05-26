import type { ReactNode } from 'react';
import clsx from 'clsx';
import { AdmCard } from './AdmCard';

interface AdmStatCardProps {
  label: string;
  value: string;
  hint?: ReactNode;
  trend?: { value: number; positive: boolean };
  accent?: 'navy' | 'amber' | 'danger' | 'ok';
}

const accentClass = {
  navy: 'text-navy dark:text-d-text',
  amber: 'text-amber',
  danger: 'text-danger',
  ok: 'text-ok',
};

export function AdmStatCard({ label, value, hint, trend, accent = 'navy' }: AdmStatCardProps) {
  return (
    <AdmCard>
      <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute">
        {label}
      </div>
      <div className={clsx('text-display font-bold mt-1 font-mono', accentClass[accent])}>{value}</div>
      <div className="text-small text-ink-mute dark:text-d-textMute mt-1 flex items-center gap-2">
        {trend && (
          <span
            className={clsx(
              'font-semibold',
              trend.positive ? 'text-ok' : 'text-danger',
            )}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
        {hint}
      </div>
    </AdmCard>
  );
}
