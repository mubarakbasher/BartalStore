import type { DemoOrderStatus } from '@bartal/shared';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';

interface TimelineEntry {
  status: DemoOrderStatus;
  at?: string;
}

interface OrderTimelineProps {
  steps: TimelineEntry[];
  dict: Dictionary;
  locale: Locale;
  currentStatus: DemoOrderStatus;
}

function formatTime(iso: string | undefined, locale: Locale): string {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function OrderTimeline({ steps, dict, locale, currentStatus }: OrderTimelineProps) {
  const t = dict.web.orders.detail;
  const labels = t.timelineSteps;
  const pendingMark = t.timelineSteps.pending;

  return (
    <ol className="space-y-3">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isCurrent = step.status === currentStatus;
        const done = !!step.at && !isCurrent;
        const labelKey = step.status as keyof typeof labels;
        const labelObj = labels[labelKey];
        const label = typeof labelObj === 'object' ? labelObj.label : pendingMark;
        return (
          <li
            key={`${step.status}-${i}`}
            className="relative flex items-start gap-3 pb-2 last:pb-0"
          >
            {!isLast && (
              <span
                aria-hidden
                className={`absolute top-5 bottom-0 w-0.5 ${done ? 'bg-ok' : 'bg-line'}`}
                style={{ insetInlineStart: 9 }}
              />
            )}
            <div
              className={`w-5 h-5 rounded-full shrink-0 ${
                isCurrent
                  ? 'bg-amber ring-4 ring-amber-tint'
                  : done
                    ? 'bg-ok'
                    : 'bg-line'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div
                className={`text-small text-ink ${isCurrent ? 'font-bold' : 'font-medium'}`}
              >
                {label}
              </div>
              <div className="text-[11px] text-ink-mute mt-0.5 normal-case tracking-normal">
                {step.at ? formatTime(step.at, locale) : pendingMark}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
