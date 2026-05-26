import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmInput } from '@/components/primitives/AdmInput';
import { BartalLogo } from '@/components/primitives/BartalLogo';
import { useAuth } from '@/lib/auth/useAuth';
import { ApiClientError } from '@/lib/api/client';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

const schema = z.object({
  phone: z.string().regex(/^\+?249\d{9}$/, 'INVALID_PHONE'),
  password: z.string().min(8, 'SHORT_PASSWORD'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const locale = usePrefsStore((s) => s.locale);
  const setLocale = usePrefsStore((s) => s.setLocale);
  const dict = getDictionary(locale);
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(
    search.get('error') === 'NOT_ADMIN' ? dict.login.notAdmin : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const phone = values.phone.startsWith('+') ? values.phone : `+${values.phone}`;
      await login({ phone, password: values.password });
      const next = search.get('next');
      navigate(next && next.startsWith('/') ? next : '/', { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(locale === 'ar' ? err.message_ar : err.message_en);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError(dict.common.error);
      }
    }
  };

  const phoneErr = errors.phone?.message;
  const passErr = errors.password?.message;

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <aside className="hidden lg:flex flex-1 bg-gradient-to-br from-navy to-navy-deep text-sand relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="star" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path
                  d="M60 0 L72 48 L120 60 L72 72 L60 120 L48 72 L0 60 L48 48 Z"
                  fill="#F2B544"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#star)" />
          </svg>
        </div>
        <div className="relative z-10">
          <BartalLogo size={36} variant="dark" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="text-display font-bold leading-tight mb-3">
            {locale === 'ar' ? 'إدارة برتال.' : 'Bartal admin.'}
          </div>
          <div className="text-body opacity-80 leading-relaxed">
            {locale === 'ar'
              ? 'لوحة تشغيل المتجر — راجع الإيصالات، أكّد الطلبات، وأدر الشحنات.'
              : 'Your operator console — review receipts, confirm orders, manage shipments.'}
          </div>
        </div>
        <div className="relative z-10 text-micro opacity-60">© Bartal · Khartoum</div>
      </aside>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-paper dark:bg-d-bg relative">
        <button
          type="button"
          onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          className="absolute top-4 end-4 px-2.5 py-1.5 rounded-bartal text-small font-semibold text-ink dark:text-d-text hover:bg-sand dark:hover:bg-d-raised"
        >
          {locale === 'ar' ? 'EN' : 'AR'}
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white dark:bg-d-surface border border-line dark:border-d-line rounded-bartal-lg p-7 shadow-card"
        >
          <div className="flex lg:hidden justify-center mb-4">
            <BartalLogo size={28} />
          </div>
          <h1 className="text-h1 font-bold text-ink dark:text-d-text mb-1">{dict.login.title}</h1>
          <p className="text-small text-ink-mute dark:text-d-textMute mb-6 leading-relaxed">
            {dict.login.subtitle}
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.login.phone}
              </label>
              <AdmInput
                id="phone"
                type="tel"
                dir="ltr"
                placeholder="+249912000001"
                autoComplete="tel"
                invalid={Boolean(phoneErr)}
                {...register('phone')}
              />
              {phoneErr && (
                <div className="text-small text-danger mt-1.5">{dict.login.invalidPhone}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.login.password}
              </label>
              <AdmInput
                id="password"
                type="password"
                autoComplete="current-password"
                invalid={Boolean(passErr)}
                {...register('password')}
              />
              {passErr && (
                <div className="text-small text-danger mt-1.5">{dict.login.shortPassword}</div>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                className="bg-danger/10 border border-danger/30 text-danger px-3 py-2.5 rounded-bartal text-small leading-relaxed"
              >
                {serverError}
              </div>
            )}

            <AdmButton type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? dict.login.submitting : dict.login.submit}
            </AdmButton>
          </div>
        </form>
      </div>
    </div>
  );
}
