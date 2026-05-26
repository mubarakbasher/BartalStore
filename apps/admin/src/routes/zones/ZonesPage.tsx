import { useEffect, useState } from 'react';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { pushToast } from '@/components/primitives/AdmToaster';
import { useDeliveryZones } from '@/lib/api/queries';
import { useUpdateZoneFee } from '@/lib/api/mutations';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { AdminZoneRow } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';

interface RowState {
  fee: string;
  free_above: string;
  eta_min: string;
  eta_max: string;
}

function toRow(z: AdminZoneRow): RowState {
  return {
    fee: String(z.fee_sdg),
    free_above: z.free_above_sdg === null ? '' : String(z.free_above_sdg),
    eta_min: String(z.estimated_days_min),
    eta_max: String(z.estimated_days_max),
  };
}

export function ZonesPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.zones.title);
  const { data, isLoading, error } = useDeliveryZones();
  const update = useUpdateZoneFee();
  const [edits, setEdits] = useState<Record<string, RowState>>({});

  useEffect(() => {
    if (!data) return;
    const next: Record<string, RowState> = {};
    for (const z of data) next[z.zone] = toRow(z);
    setEdits(next);
  }, [data]);

  if (error) return <AdmEmptyState title={dict.common.error} body={String(error)} />;
  if (isLoading || !data) {
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  const submitRow = async (zone: AdminZoneRow) => {
    const state = edits[zone.zone];
    if (!state) return;
    const fee = Number(state.fee);
    const freeAbove = state.free_above.trim() ? Number(state.free_above) : null;
    const min = Number(state.eta_min);
    const max = Number(state.eta_max);
    if ([fee, min, max].some((n) => !Number.isFinite(n) || n < 0)) {
      pushToast('error', dict.zones.error);
      return;
    }
    if (freeAbove !== null && (!Number.isFinite(freeAbove) || freeAbove < 0)) {
      pushToast('error', dict.zones.error);
      return;
    }
    if (min > max) {
      pushToast('error', dict.zones.error);
      return;
    }
    try {
      await update.mutateAsync({
        zone: zone.zone,
        body: {
          fee,
          free_above: freeAbove,
          estimated_days_min: min,
          estimated_days_max: max,
        },
      });
      pushToast('success', dict.zones.saved);
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.zones.error);
      }
    }
  };

  return (
    <AdmCard padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead className="bg-sand dark:bg-d-raised">
            <tr>
              {(['zone', 'fee', 'freeAbove', 'etaMin', 'etaMax', 'actions'] as const).map((k) => (
                <th
                  key={k}
                  className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute px-4 py-2.5 text-start font-semibold"
                >
                  {dict.zones.columns[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-d-line">
            {data.map((zone) => {
              const state = edits[zone.zone] ?? toRow(zone);
              return (
                <tr key={zone.zone}>
                  <td className="px-4 py-3 align-middle">
                    <div className="text-small font-semibold text-ink dark:text-d-text">
                      {locale === 'ar' ? zone.name_ar : zone.name_en}
                    </div>
                    <div className="text-micro text-ink-mute dark:text-d-textMute font-mono">
                      {zone.zone}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <AdmInput
                      className="w-32"
                      inputMode="decimal"
                      value={state.fee}
                      onChange={(e) =>
                        setEdits((m) => ({ ...m, [zone.zone]: { ...state, fee: e.target.value } }))
                      }
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <AdmInput
                      className="w-32"
                      inputMode="decimal"
                      value={state.free_above}
                      placeholder={dict.common.none}
                      onChange={(e) =>
                        setEdits((m) => ({
                          ...m,
                          [zone.zone]: { ...state, free_above: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <AdmInput
                      className="w-24"
                      inputMode="numeric"
                      value={state.eta_min}
                      onChange={(e) =>
                        setEdits((m) => ({
                          ...m,
                          [zone.zone]: { ...state, eta_min: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <AdmInput
                      className="w-24"
                      inputMode="numeric"
                      value={state.eta_max}
                      onChange={(e) =>
                        setEdits((m) => ({
                          ...m,
                          [zone.zone]: { ...state, eta_max: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <AdmButton
                      size="sm"
                      onClick={() => submitRow(zone)}
                      disabled={update.isPending}
                    >
                      {update.isPending ? dict.zones.saving : dict.zones.save}
                    </AdmButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdmCard>
  );
}
