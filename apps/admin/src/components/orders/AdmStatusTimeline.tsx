import type { OrderStatus } from '@bartal/shared';
import { AdmStatusPill } from '@/components/primitives/AdmStatusPill';
import type { AdminLocale } from '@/lib/state/prefs-store';

interface TimelineEntry {
  id: string;
  status: OrderStatus;
  note: string | null;
  changed_at: string;
}

interface AdmStatusTimelineProps {
  entries: TimelineEntry[];
  locale: AdminLocale;
}

export function AdmStatusTimeline({ entries, locale }: AdmStatusTimelineProps) {
  if (entries.length === 0) {
    return <div className="text-small text-ink-mute dark:text-d-textMute">—</div>;
  }
  return (
    <ol className="space-y-3">
      {entries.map((e, idx) => (
        <li key={e.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center pt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                idx === 0 ? 'bg-amber' : 'bg-line dark:bg-d-line'
              }`}
            />
            {idx < entries.length - 1 && (
              <span className="w-px flex-1 bg-line dark:bg-d-line min-h-[28px] mt-1" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <AdmStatusPill status={e.status} locale={locale} />
              <span className="text-micro text-ink-mute dark:text-d-textMute font-mono" dir="ltr">
                {new Date(e.changed_at).toLocaleString(
                  locale === 'ar' ? 'ar-EG' : 'en-GB',
                  { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' },
                )}
              </span>
            </div>
            {e.note && (
              <div className="text-small text-ink dark:text-d-text mt-0.5">{e.note}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
