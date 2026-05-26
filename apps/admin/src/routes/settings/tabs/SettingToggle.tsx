import clsx from 'clsx';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
  description?: string;
}

/**
 * Tiny shared component for the boolean-string settings rows used across
 * Checkout / Tax / Integrations tabs. AppSetting values are stored as the
 * strings "true" | "false"; this component bridges the JS boolean.
 */
export function SettingToggle({ checked, onChange, disabled, label, description }: Props) {
  return (
    <label
      className={clsx(
        'flex items-start gap-3 cursor-pointer py-2',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
          checked
            ? 'bg-ok border-ok'
            : 'bg-line border-line dark:bg-d-raised dark:border-d-line',
        )}
      >
        <span
          className={clsx(
            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
      <span className="flex-1 min-w-0">
        <span className="block text-small font-semibold text-ink dark:text-d-text">
          {label}
        </span>
        {description && (
          <span className="block text-micro text-ink-mute dark:text-d-textMute mt-0.5">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
