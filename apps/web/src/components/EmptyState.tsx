import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  hint?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, hint, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="w-16 h-16 rounded-full bg-amber-tint flex items-center justify-center text-amber">
        {icon ?? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12h8" />
          </svg>
        )}
      </div>
      <div className="text-h2 text-ink">{title}</div>
      {hint && <div className="text-body text-ink-mute max-w-md">{hint}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  hint?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ title, hint, onRetry, retryLabel = 'Retry' }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 17h.01" />
        </svg>
      </div>
      <div className="text-h2 text-ink">{title}</div>
      {hint && <div className="text-body text-ink-mute max-w-md">{hint}</div>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-5 h-11 bg-navy text-white rounded-bartal font-semibold hover:bg-navy-deep"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
