import type { Dictionary } from '@/lib/i18n/dictionary';

interface CheckoutStepperProps {
  current: 1 | 2 | 3;
  dict: Dictionary;
}

export function CheckoutStepper({ current, dict }: CheckoutStepperProps) {
  const steps = [
    dict.web.checkout.step1,
    dict.web.checkout.step2,
    dict.web.checkout.step3,
  ];
  return (
    <ol className="flex items-center gap-2 mb-6 flex-wrap">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isPast = stepNum < current;
        return (
          <li key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-micro font-bold ${
                isActive
                  ? 'bg-amber text-white'
                  : isPast
                    ? 'bg-amber-tint text-amber'
                    : 'bg-line text-ink-mute'
              }`}
            >
              {stepNum}
            </div>
            <span
              className={`text-small font-semibold ${
                isActive ? 'text-ink' : 'text-ink-mute'
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-line mx-2" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
