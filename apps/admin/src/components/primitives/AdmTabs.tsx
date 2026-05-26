import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface AdmTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface AdmTabsProps<T extends string> {
  items: AdmTabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  children?: ReactNode;
}

export function AdmTabs<T extends string>({ items, active, onChange }: AdmTabsProps<T>) {
  return (
    <div className="flex items-center gap-1 border-b border-line dark:border-d-line overflow-x-auto">
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            disabled={it.disabled}
            onClick={() => onChange(it.id)}
            className={clsx(
              'px-3 py-2 text-small font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors',
              on
                ? 'border-amber text-amber'
                : 'border-transparent text-ink-mute dark:text-d-textMute hover:text-ink dark:hover:text-d-text',
              it.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {it.label}
            {typeof it.count === 'number' && (
              <span
                className={clsx(
                  'ms-2 inline-flex items-center justify-center text-micro font-mono px-1.5 py-0.5 rounded-full',
                  on ? 'bg-amber text-white' : 'bg-line text-ink-mute',
                )}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
