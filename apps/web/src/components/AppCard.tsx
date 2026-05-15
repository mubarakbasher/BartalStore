import { type ReactNode } from 'react';
import clsx from 'clsx';

interface AppCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const padClass = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function AppCard({ children, className, padding = 'md', hoverable }: AppCardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-line rounded-bartal overflow-hidden',
        hoverable && 'transition-shadow duration-200 hover:shadow-card',
        padClass[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
