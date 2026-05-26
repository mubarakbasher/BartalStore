import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { BartalLogo } from '@/components/primitives/BartalLogo';
import { useTopbarStore } from '@/lib/state/topbar-store';
import type { AdminDictionary } from '@/lib/i18n/dictionary';

interface NavItem {
  to: string;
  label: keyof AdminDictionary['nav'];
  end?: boolean;
}

const ACTIVE_ITEMS: NavItem[] = [
  { to: '/', label: 'dashboard', end: true },
  { to: '/orders', label: 'orders' },
  { to: '/refunds', label: 'refunds' },
  { to: '/reviews', label: 'reviews' },
  { to: '/products', label: 'products' },
  { to: '/categories', label: 'categories' },
  { to: '/promos', label: 'promos' },
  { to: '/banners', label: 'banners' },
  { to: '/customers', label: 'customers' },
  { to: '/inventory-log', label: 'inventoryLog' },
  { to: '/abandoned-carts', label: 'abandonedCarts' },
  { to: '/shipping-labels', label: 'shippingLabels' },
  { to: '/analytics', label: 'analytics' },
  { to: '/templates', label: 'templates' },
  { to: '/zones', label: 'zones' },
  { to: '/staff', label: 'staff' },
  { to: '/settings', label: 'settings' },
];

const COMING_SOON: Array<keyof AdminDictionary['nav']> = [];

interface SidebarProps {
  dict: AdminDictionary;
}

export function Sidebar({ dict }: SidebarProps) {
  const setTopbar = useTopbarStore((s) => s.set);
  return (
    <aside className="bg-navy-deep text-sand flex flex-col w-[220px] shrink-0 min-h-screen">
      <div className="px-4 py-5 border-b border-navy-ink/40">
        <BartalLogo size={28} variant="dark" />
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1">
        {ACTIVE_ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={() => setTopbar(dict.nav[it.label])}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2 px-3 py-2.5 rounded-bartal text-small font-medium transition-colors border-s-[3px]',
                isActive
                  ? 'bg-navy-ink/60 text-white border-s-amber font-bold'
                  : 'border-s-transparent text-sand/80 hover:text-white hover:bg-navy-ink/40',
              )
            }
          >
            <span className="flex-1">{dict.nav[it.label]}</span>
          </NavLink>
        ))}
        <div className="mt-4 px-3 py-2 text-micro uppercase tracking-wider text-sand/40">
          {dict.nav.comingSoon}
        </div>
        {COMING_SOON.map((label) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-2.5 rounded-bartal text-small text-sand/40 cursor-not-allowed border-s-[3px] border-s-transparent"
            aria-disabled="true"
          >
            <span className="flex-1">{dict.nav[label]}</span>
            <span className="text-micro bg-navy-ink/40 px-1.5 py-0.5 rounded-full">
              {dict.nav.comingSoon}
            </span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
