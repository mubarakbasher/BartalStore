import { useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';

interface AdmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeLabel?: string;
}

const SIZE: Record<NonNullable<AdmDialogProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export function AdmDialog({ open, onClose, title, children, size = 'md', closeLabel = 'Close' }: AdmDialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => ref.current?.focus());
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-ink/60"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={clsx(
          'w-full bg-white dark:bg-d-surface border border-line dark:border-d-line rounded-bartal-lg shadow-elevated max-h-[90vh] flex flex-col',
          SIZE[size],
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line dark:border-d-line">
          <h2 className="text-h2 font-bold text-ink dark:text-d-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="text-ink-mute dark:text-d-textMute hover:text-ink dark:hover:text-d-text rounded-full w-8 h-8 flex items-center justify-center hover:bg-sand dark:hover:bg-d-raised"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
