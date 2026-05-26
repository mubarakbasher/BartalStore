import { AdmCard } from '@/components/primitives/AdmCard';
import { useAdminSettings } from '@/lib/api/queries';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

interface BankInfo {
  key: string;
  label: string;
  account: string | null;
  iban: string | null;
}

const PREFIXES = [
  { prefix: 'bank.fib', label: 'Faisal Islamic Bank' },
  { prefix: 'bank.onb', label: 'Omdurman National Bank' },
  { prefix: 'bank.bok', label: 'Bank of Khartoum' },
];

export function BankingTab() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  const { data, isLoading } = useAdminSettings();

  if (isLoading || !data) {
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  const rows: BankInfo[] = PREFIXES.map((b) => ({
    key: b.prefix,
    label: b.label,
    account: data[`${b.prefix}.account_number`] ?? null,
    iban: data[`${b.prefix}.iban`] ?? null,
  }));

  return (
    <AdmCard>
      <div className="text-h3 font-semibold text-ink dark:text-d-text mb-1">
        {dict.settings.banking.heading}
      </div>
      <div className="text-small text-ink-mute dark:text-d-textMute mb-4">
        {dict.settings.banking.readOnly}
      </div>
      <ul className="divide-y divide-line dark:divide-d-line">
        {rows.map((b) => (
          <li key={b.key} className="py-3">
            <div className="text-small font-semibold text-ink dark:text-d-text">{b.label}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5 text-small">
              <div>
                <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute">
                  Account #
                </div>
                <div className="font-mono text-ink dark:text-d-text" dir="ltr">
                  {b.account ?? dict.common.none}
                </div>
              </div>
              <div>
                <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute">
                  IBAN
                </div>
                <div className="font-mono text-ink dark:text-d-text" dir="ltr">
                  {b.iban ?? dict.common.none}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AdmCard>
  );
}
