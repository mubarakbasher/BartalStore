import { NavLink, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { AdmCard } from '@/components/primitives/AdmCard';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import { GeneralTab } from './tabs/GeneralTab';
import { BankingTab } from './tabs/BankingTab';
import { CheckoutTab } from './tabs/CheckoutTab';
import { TaxTab } from './tabs/TaxTab';
import { LocalesTab } from './tabs/LocalesTab';
import { TeamTab } from './tabs/TeamTab';
import { LegalTab } from './tabs/LegalTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';

type TabId =
  | 'general'
  | 'banking'
  | 'checkout'
  | 'tax'
  | 'locales'
  | 'team'
  | 'legal'
  | 'integrations';

const TABS: Array<{ id: TabId; active: boolean }> = [
  { id: 'general', active: true },
  { id: 'banking', active: true },
  { id: 'checkout', active: true },
  { id: 'tax', active: true },
  { id: 'locales', active: true },
  { id: 'team', active: true },
  { id: 'legal', active: true },
  { id: 'integrations', active: true },
];

export function SettingsPage() {
  const params = useParams<{ tab?: string }>();
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.settings.title);
  const activeTab = (params.tab as TabId | undefined) ?? 'general';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
      <AdmCard padded={false}>
        <nav className="p-2">
          {TABS.map((t) => (
            <NavLink
              key={t.id}
              to={t.id === 'general' ? '/settings' : `/settings/${t.id}`}
              end
              className={() => {
                const on = t.id === activeTab;
                return clsx(
                  'flex items-center justify-between gap-2 px-3 py-2.5 rounded-bartal text-small font-medium border-s-[3px] transition-colors',
                  on
                    ? 'bg-amber-tint text-amber border-s-amber font-bold'
                    : 'text-ink dark:text-d-text border-s-transparent hover:bg-sand dark:hover:bg-d-raised',
                  !t.active && 'opacity-60',
                );
              }}
              aria-disabled={!t.active}
              onClick={(e) => {
                if (!t.active) e.preventDefault();
              }}
            >
              <span>{dict.settings.tabs[t.id]}</span>
              {!t.active && (
                <span className="text-micro text-ink-mute dark:text-d-textMute">
                  {dict.settings.comingSoon}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </AdmCard>

      <div>
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'banking' && <BankingTab />}
        {activeTab === 'checkout' && <CheckoutTab />}
        {activeTab === 'tax' && <TaxTab />}
        {activeTab === 'locales' && <LocalesTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'legal' && <LegalTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
      </div>
    </div>
  );
}
