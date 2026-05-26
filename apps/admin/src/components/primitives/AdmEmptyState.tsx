import type { ReactNode } from 'react';

interface AdmEmptyStateProps {
  title: string;
  body?: string;
  action?: ReactNode;
}

export function AdmEmptyState({ title, body, action }: AdmEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-d-surface border border-line dark:border-d-line rounded-bartal-lg p-12 text-center">
      <div className="text-h2 text-ink dark:text-d-text mb-2">{title}</div>
      {body && (
        <div className="text-small text-ink-mute dark:text-d-textMute leading-relaxed">{body}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
