'use client';
import { useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { AppButton } from './AppButton';
import { BartalLogo } from './BartalLogo';

interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'password' | 'email';
  placeholder?: string;
}

interface AuthCardProps {
  locale: Locale;
  title: string;
  subtitle?: string;
  fields: FieldDef[];
  submitLabel: string;
  footer?: ReactNode;
  comingSoonNotice?: string;
}

export function AuthCard({
  locale,
  title,
  subtitle,
  fields,
  submitLabel,
  footer,
  comingSoonNotice,
}: AuthCardProps) {
  const [showNotice, setShowNotice] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="flex justify-center mb-6">
        <BartalLogo locale={locale} size={28} />
      </div>
      <div className="bg-white border border-line rounded-bartal-lg p-7 shadow-card">
        <h1 className="text-h1 font-bold text-ink mb-1">{title}</h1>
        {subtitle && <p className="text-small text-ink-mute mb-6 leading-relaxed normal-case tracking-normal">{subtitle}</p>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowNotice(true);
          }}
          className="space-y-4"
        >
          {fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-small font-semibold text-ink mb-1.5">
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                dir={f.type === 'tel' ? 'ltr' : undefined}
                value={values[f.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                className="w-full h-11 px-3 bg-sand border border-line rounded-bartal text-body text-ink placeholder:text-ink-mute focus:outline-none focus:border-amber focus:bg-white transition-colors"
              />
            </div>
          ))}

          {showNotice && comingSoonNotice && (
            <div className="bg-amber-tint border border-amber/40 text-amber px-3 py-2.5 rounded-bartal text-small leading-relaxed normal-case tracking-normal">
              {comingSoonNotice}
            </div>
          )}

          <AppButton type="submit" fullWidth variant="primary">
            {submitLabel}
          </AppButton>
        </form>

        {footer && <div className="mt-6 text-center">{footer}</div>}
      </div>
    </div>
  );
}
