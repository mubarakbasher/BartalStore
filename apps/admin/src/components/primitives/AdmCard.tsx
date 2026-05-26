import type { ReactNode } from 'react';
import clsx from 'clsx';

interface AdmCardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function AdmCard({ children, className, padded = true }: AdmCardProps) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-d-surface border border-line dark:border-d-line rounded-bartal-lg shadow-card',
        padded && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
