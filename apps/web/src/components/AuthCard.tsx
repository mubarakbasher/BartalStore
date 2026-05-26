'use client';
import { useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { AppButton } from './AppButton';
import { BartalLogo } from './BartalLogo';

export interface AuthCardFieldDef {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'password' | 'email';
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export interface AuthCardSubmitArgs {
  values: Record<string, string>;
}

interface AuthCardProps {
  locale: Locale;
  title: string;
  subtitle?: string;
  fields: AuthCardFieldDef[];
  submitLabel: string;
  footer?: ReactNode;
  onSubmit: (args: AuthCardSubmitArgs) => Promise<void>;
}

export function AuthCard({
  locale,
  title,
  subtitle,
  fields,
  submitLabel,
  footer,
  onSubmit,
}: AuthCardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="flex justify-center mb-6">
        <BartalLogo locale={locale} size={28} />
      </div>
      <div className="bg-white border border-line rounded-bartal-lg p-7 shadow-card">
        <h1 className="text-h1 font-bold text-ink mb-1">{title}</h1>
        {subtitle && (
          <p className="text-small text-ink-mute mb-6 leading-relaxed normal-case tracking-normal">
            {subtitle}
          </p>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setIsPending(true);
            try {
              await onSubmit({ values });
            } catch (err) {
              const message =
                err instanceof Error
                  ? err.message
                  : locale === 'ar'
                    ? 'حدث خطأ. يرجى المحاولة مرة أخرى.'
                    : 'Something went wrong. Please try again.';
              setError(message);
            } finally {
              setIsPending(false);
            }
          }}
          className="space-y-4"
        >
          {fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-small font-semibold text-ink mb-1.5">
                {f.label}
                {f.required && <span className="text-amber ms-1">*</span>}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                required={f.required}
                dir={f.type === 'tel' || f.type === 'email' ? 'ltr' : undefined}
                value={values[f.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className="w-full h-11 px-3 bg-sand border border-line rounded-bartal text-body text-ink placeholder:text-ink-mute focus:outline-none focus:border-amber focus:bg-white transition-colors"
              />
            </div>
          ))}

          {error && (
            <div
              role="alert"
              className="bg-danger/10 border border-danger/30 text-danger px-3 py-2.5 rounded-bartal text-small leading-relaxed normal-case tracking-normal"
            >
              {error}
            </div>
          )}

          <AppButton type="submit" fullWidth variant="primary" disabled={isPending}>
            {isPending ? (locale === 'ar' ? 'جارٍ المعالجة…' : 'Working…') : submitLabel}
          </AppButton>
        </form>

        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </div>
  );
}
