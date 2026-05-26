import { Link, useParams } from 'react-router-dom';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmStatusPill } from '@/components/primitives/AdmStatusPill';
import { PriceTag } from '@/components/primitives/PriceTag';
import { useAdminCustomer } from '@/lib/api/queries';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.nav.customers, id);
  const { data: customer, isLoading, error } = useAdminCustomer(id);

  if (isLoading || !customer) {
    if (error) return <AdmEmptyState title={dict.common.error} body={String(error)} />;
    return <div className="text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>;
  }

  const initials = customer.name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-4">
      <Link
        to="/customers"
        className="inline-block text-small font-semibold text-ink-mute dark:text-d-textMute hover:text-ink"
      >
        {dict.customers.backToList}
      </Link>

      <AdmCard>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber text-white font-bold text-h2 flex items-center justify-center">
            {initials || 'C'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-h1 font-bold text-ink dark:text-d-text">{customer.name}</div>
            <div className="text-small text-ink-mute dark:text-d-textMute font-mono" dir="ltr">
              {customer.phone}
            </div>
            {customer.email && (
              <div className="text-small text-ink-mute dark:text-d-textMute">{customer.email}</div>
            )}
          </div>
          <div className="text-end">
            <div className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute">
              {dict.customers.totalSpent}
            </div>
            <PriceTag amount={Number(customer.total_spent)} locale={locale} size={20} />
            <div className="text-micro text-ink-mute dark:text-d-textMute mt-1">
              {dict.customers.memberSince}{' '}
              {new Date(customer.created_at).toLocaleDateString(
                locale === 'ar' ? 'ar-EG' : 'en-GB',
                { day: '2-digit', month: 'short', year: 'numeric' },
              )}
            </div>
          </div>
        </div>
      </AdmCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdmCard padded={false}>
          <div className="px-5 py-3 border-b border-line dark:border-d-line text-h3 font-semibold text-ink dark:text-d-text">
            {dict.customers.addresses}
          </div>
          {customer.addresses.length === 0 ? (
            <div className="p-5 text-small text-ink-mute dark:text-d-textMute">
              {dict.customers.noAddresses}
            </div>
          ) : (
            <ul className="divide-y divide-line dark:divide-d-line">
              {customer.addresses.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="text-small font-semibold text-ink dark:text-d-text">
                      {a.label}
                    </div>
                    {a.is_default && (
                      <span className="text-micro font-mono uppercase text-amber bg-amber-tint px-1.5 py-0.5 rounded-full">
                        default
                      </span>
                    )}
                  </div>
                  <div className="text-small text-ink dark:text-d-text mt-0.5">{a.full_name}</div>
                  <div className="text-small text-ink-mute dark:text-d-textMute">
                    {a.district} · {a.zone.replace('_', ' ')}
                  </div>
                  <div className="text-small text-ink-mute dark:text-d-textMute">{a.landmark}</div>
                </li>
              ))}
            </ul>
          )}
        </AdmCard>

        <AdmCard padded={false}>
          <div className="px-5 py-3 border-b border-line dark:border-d-line text-h3 font-semibold text-ink dark:text-d-text">
            {dict.customers.recentOrders} ({customer.order_count})
          </div>
          {customer.recent_orders.length === 0 ? (
            <div className="p-5 text-small text-ink-mute dark:text-d-textMute">
              {dict.customers.noOrders}
            </div>
          ) : (
            <ul className="divide-y divide-line dark:divide-d-line">
              {customer.recent_orders.map((o) => (
                <li key={o.id} className="px-5 py-3 flex items-center gap-3">
                  <Link
                    to={`/orders/${o.id}`}
                    className="font-mono text-small font-semibold text-navy dark:text-d-text hover:underline"
                  >
                    {o.order_number}
                  </Link>
                  <div className="text-micro text-ink-mute dark:text-d-textMute flex-1">
                    {new Date(o.created_at).toLocaleDateString(
                      locale === 'ar' ? 'ar-EG' : 'en-GB',
                      { day: '2-digit', month: 'short', year: '2-digit' },
                    )}
                  </div>
                  <PriceTag amount={Number(o.total)} locale={locale} />
                  <AdmStatusPill status={o.status} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </AdmCard>
      </div>
    </div>
  );
}
