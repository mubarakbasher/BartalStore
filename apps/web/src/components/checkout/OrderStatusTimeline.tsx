export interface TimelineStep {
  label: string;
  eta: string;
  current?: boolean;
  done?: boolean;
}

interface OrderStatusTimelineProps {
  steps: TimelineStep[];
}

export function OrderStatusTimeline({ steps }: OrderStatusTimelineProps) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        const num = i + 1;
        return (
          <li key={s.label} className="relative flex items-start gap-3 pb-3 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-6 bottom-0 w-0.5 bg-line"
                style={{ insetInlineStart: 11 }}
              />
            )}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                s.current
                  ? 'bg-amber text-white'
                  : s.done
                    ? 'bg-amber-tint text-amber border-2 border-amber'
                    : 'bg-sand text-ink-mute border-2 border-line'
              }`}
            >
              {num}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-small text-ink ${
                  s.current ? 'font-bold' : 'font-medium'
                }`}
              >
                {s.label}
              </div>
              <div className="text-micro text-ink-mute mt-0.5 normal-case tracking-normal">
                {s.eta}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
