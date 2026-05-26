'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppButton } from '@/components/AppButton';
import { BartalLogo } from '@/components/BartalLogo';
import type { Locale } from '@/lib/i18n/config';
import { resendOtpAction, verifyOtpAction } from '@/lib/auth/actions';
import { notifyAuthChange } from '@/lib/auth/state';
import { syncCartAction } from '@/lib/cart/sync';
import { useCart } from '@/lib/state/cart-store';
import type { OtpPurpose } from '@/lib/api/types';

interface Props {
  locale: Locale;
  phone: string;
  purpose: OtpPurpose;
}

const DIGIT_COUNT = 6;
const RESEND_SECONDS = 60;

export function OtpForm({ locale, phone, purpose }: Props) {
  const router = useRouter();
  const cart = useCart();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const code = digits.join('');

  const submit = async (overrideCode?: string) => {
    setError(null);
    setIsPending(true);
    const value = overrideCode ?? code;
    try {
      const result = await verifyOtpAction({ phone, code: value, purpose }, locale);
      if (!result.ok) {
        setError(locale === 'ar' ? result.error.message_ar : result.error.message_en);
        return;
      }
      if (purpose === 'RESET') {
        router.replace(
          `/${locale}/reset-password?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(value)}`,
        );
        return;
      }
      // REGISTER + LOGIN: cookies are set; sync cart and head to /account.
      const localItems = cart.items.map((it) => ({
        product_id: it.product_id,
        quantity: it.quantity,
      }));
      const sync = await syncCartAction({ items: localItems, locale });
      if (sync) cart.hydrateFromServer(sync.view.items);
      notifyAuthChange();
      router.replace(`/${locale}/account`);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, '');
    if (clean.length > 1) {
      // paste handling — distribute across boxes from current index
      const chars = clean.slice(0, DIGIT_COUNT - index).split('');
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          next[index + i] = c;
        });
        return next;
      });
      const lastIndex = Math.min(index + chars.length, DIGIT_COUNT - 1);
      inputsRef.current[lastIndex]?.focus();
      if (index + chars.length >= DIGIT_COUNT) {
        const merged = [...digits];
        chars.forEach((c, i) => {
          merged[index + i] = c;
        });
        if (merged.every((d) => d.length === 1)) {
          void submit(merged.join(''));
        }
      }
      return;
    }
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < DIGIT_COUNT - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const resend = async () => {
    setError(null);
    setInfo(null);
    const result = await resendOtpAction({ phone, purpose }, locale);
    if (!result.ok) {
      setError(locale === 'ar' ? result.error.message_ar : result.error.message_en);
      return;
    }
    setInfo(locale === 'ar' ? 'تم إرسال رمز جديد.' : 'A new code has been sent.');
    setSecondsLeft(RESEND_SECONDS);
  };

  const title =
    purpose === 'REGISTER'
      ? locale === 'ar' ? 'تأكيد رقم الهاتف' : 'Verify your phone'
      : purpose === 'RESET'
        ? locale === 'ar' ? 'رمز إعادة تعيين كلمة المرور' : 'Reset password code'
        : locale === 'ar' ? 'تأكيد تسجيل الدخول' : 'Confirm sign-in';
  const subtitle =
    locale === 'ar'
      ? `أرسلنا رمزاً مكوناً من ٦ أرقام إلى ${phone}.`
      : `We sent a 6-digit code to ${phone}.`;

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="flex justify-center mb-6">
        <BartalLogo locale={locale} size={28} />
      </div>
      <div className="bg-white border border-line rounded-bartal-lg p-7 shadow-card">
        <h1 className="text-h1 font-bold text-ink mb-1">{title}</h1>
        <p className="text-small text-ink-mute mb-6 leading-relaxed normal-case tracking-normal">
          {subtitle}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.length === DIGIT_COUNT) void submit();
          }}
          className="space-y-5"
        >
          <div className="flex justify-center gap-2" dir="ltr">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={i === 0 ? DIGIT_COUNT : 1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-13 text-center text-h2 font-mono font-bold bg-sand border border-line rounded-bartal focus:outline-none focus:border-amber focus:bg-white transition-colors"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="bg-danger/10 border border-danger/30 text-danger px-3 py-2.5 rounded-bartal text-small leading-relaxed normal-case tracking-normal"
            >
              {error}
            </div>
          )}
          {info && !error && (
            <div className="bg-amber-tint border border-amber/40 text-amber px-3 py-2.5 rounded-bartal text-small leading-relaxed normal-case tracking-normal">
              {info}
            </div>
          )}

          <AppButton
            type="submit"
            fullWidth
            variant="primary"
            disabled={isPending || code.length < DIGIT_COUNT}
          >
            {isPending
              ? locale === 'ar' ? 'جارٍ التحقق…' : 'Verifying…'
              : locale === 'ar' ? 'تأكيد' : 'Verify'}
          </AppButton>
        </form>

        <div className="mt-6 text-center text-small text-ink-mute">
          {secondsLeft > 0 ? (
            <span>
              {locale === 'ar' ? `إعادة الإرسال بعد ${secondsLeft} ثانية` : `Resend in ${secondsLeft}s`}
            </span>
          ) : (
            <button
              type="button"
              onClick={resend}
              className="text-amber hover:text-amber-soft font-semibold"
            >
              {locale === 'ar' ? 'إعادة إرسال الرمز' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
