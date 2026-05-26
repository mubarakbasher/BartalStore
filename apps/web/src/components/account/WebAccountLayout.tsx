'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary';
import { useAccount } from '@/lib/state/account-store';
import { useAuth } from '@/lib/auth/state';
import { GridIcon, UserIcon, TruckIcon, BagIcon, BankIcon, SearchIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

export type AccountNavKey =
  | 'dashboard'
  | 'profile'
  | 'addresses'
  | 'orders'
  | 'security'
  | 'preferences';

interface WebAccountLayoutProps {
  locale: Locale;
  dict: Dictionary;
  active: AccountNavKey;
  children: ReactNode;
}

const ICONS: Record<AccountNavKey, typeof GridIcon> = {
  dashboard: GridIcon,
  profile: UserIcon,
  addresses: TruckIcon,
  orders: BagIcon,
  security: BankIcon,
  preferences: SearchIcon,
};

const HREFS: Record<AccountNavKey, string> = {
  dashboard: '/account',
  profile: '/account/profile',
  addresses: '/account/addresses',
  orders: '/orders',
  security: '/account/security',
  preferences: '/account/preferences',
};

export function WebAccountLayout({ locale, dict, active, children }: WebAccountLayoutProps) {
  const t = dict.web.account;
  const user = useAccount((s) => s.user);
  const auth = useAuth();
  const router = useRouter();
  const liveUser = auth.user;
  const displayName = liveUser?.name ?? `${user.firstName} ${user.lastName}`;
  const displayPhone = liveUser?.phone ?? user.phone;
  const initials = liveUser
    ? liveUser.name
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
  const nav: AccountNavKey[] = [
    'dashboard',
    'profile',
    'addresses',
    'orders',
    'security',
    'preferences',
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-6">
      <div className="text-micro text-ink-mute mb-1 normal-case tracking-normal">
        {t.breadcrumb.home}
        {' / '}
        <span className="text-amber">{t.breadcrumb.account}</span>
      </div>
      <h1 className="text-h1 font-bold text-ink mb-4">{t.pageHeading}</h1>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6 items-start">
        <aside className="bg-white border border-line rounded-bartal overflow-hidden self-start">
          <div className="p-4 border-b border-line flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber text-white flex items-center justify-center font-bold text-small">
              {initials || 'MO'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-small font-bold text-ink truncate">{displayName}</div>
              <div className="text-[11px] text-ink-mute font-mono mt-0.5" dir="ltr">
                {displayPhone}
              </div>
            </div>
          </div>
          <nav>
            {nav.map((key, i) => {
              const Icon = ICONS[key];
              const on = key === active;
              return (
                <Link
                  key={key}
                  href={`/${locale}${HREFS[key]}`}
                  className={`flex items-center gap-2.5 px-4 py-3 text-small transition-colors ${
                    i < nav.length - 1 ? 'border-b border-line' : ''
                  } ${
                    on
                      ? 'bg-amber-tint text-amber font-bold border-s-[3px] border-s-amber'
                      : 'text-ink font-medium hover:bg-sand border-s-[3px] border-s-transparent'
                  }`}
                >
                  <Icon size={15} color={on ? BARTAL.amber : BARTAL.textMute} />
                  <span className="flex-1">{t.nav[key]}</span>
                </Link>
              );
            })}
            {liveUser && (
              <button
                type="button"
                onClick={async () => {
                  await auth.logout(locale);
                  router.replace(`/${locale}/login`);
                  router.refresh();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-small font-medium text-danger border-t border-line hover:bg-sand border-s-[3px] border-s-transparent text-start"
              >
                <span className="w-[15px] h-[15px] inline-flex" aria-hidden>
                  ⎋
                </span>
                <span className="flex-1">{t.logout}</span>
              </button>
            )}
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
