import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { useAdminCustomers } from '@/lib/api/queries';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(handle);
  }, [value, ms]);
  return debounced;
}

export function CustomersPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.customers.title);
  const [search, setSearch] = useSearchParams();
  const q = search.get('q') ?? '';
  const page = Math.max(1, Number(search.get('page') ?? '1') || 1);
  const [qInput, setQInput] = useState(q);
  useEffect(() => setQInput(q), [q]);
  const debouncedQ = useDebounced(qInput, 400);

  useEffect(() => {
    if (debouncedQ === q) return;
    const next = new URLSearchParams(search);
    if (debouncedQ) next.set('q', debouncedQ);
    else next.delete('q');
    next.set('page', '1');
    setSearch(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const { data, isLoading } = useAdminCustomers({ q: q || undefined, page, limit: 25 });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4">
      <AdmInput
        placeholder={dict.customers.searchPlaceholder}
        value={qInput}
        onChange={(e) => setQInput(e.target.value)}
        className="max-w-sm"
      />

      <AdmCard padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-sand dark:bg-d-raised">
              <tr>
                {(['name', 'phone', 'email', 'orders', 'lastOrder', 'actions'] as const).map((k) => (
                  <th
                    key={k}
                    className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute px-4 py-2.5 text-start font-semibold"
                  >
                    {dict.customers.columns[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-d-line">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-small text-ink-mute dark:text-d-textMute">
                    {dict.common.loading}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <AdmEmptyState title={dict.customers.empty} />
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id} className="hover:bg-sand/50 dark:hover:bg-d-raised/40">
                    <td className="px-4 py-3 align-middle">
                      <div className="text-small font-semibold text-ink dark:text-d-text">
                        {c.name}
                      </div>
                      <div className="text-micro text-ink-mute dark:text-d-textMute">
                        {c.is_verified ? dict.customers.verified : dict.customers.notVerified}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-small font-mono" dir="ltr">
                      {c.phone}
                    </td>
                    <td className="px-4 py-3 align-middle text-small text-ink-mute dark:text-d-textMute">
                      {c.email ?? dict.common.none}
                    </td>
                    <td className="px-4 py-3 align-middle text-small font-mono font-semibold text-navy dark:text-d-text">
                      {c.order_count}
                    </td>
                    <td className="px-4 py-3 align-middle text-small text-ink-mute dark:text-d-textMute">
                      {c.last_order_at
                        ? new Date(c.last_order_at).toLocaleDateString(
                            locale === 'ar' ? 'ar-EG' : 'en-GB',
                            { day: '2-digit', month: 'short', year: '2-digit' },
                          )
                        : dict.common.none}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <Link
                        to={`/customers/${c.id}`}
                        className="text-small font-semibold text-amber hover:underline"
                      >
                        {dict.customers.view}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-end gap-2 border-t border-line dark:border-d-line">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => {
                const next = new URLSearchParams(search);
                next.set('page', String(Math.max(1, page - 1)));
                setSearch(next, { replace: true });
              }}
              className="text-small font-semibold text-ink-mute dark:text-d-textMute disabled:opacity-40"
            >
              ←
            </button>
            <span className="text-small font-mono text-ink dark:text-d-text">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => {
                const next = new URLSearchParams(search);
                next.set('page', String(Math.min(totalPages, page + 1)));
                setSearch(next, { replace: true });
              }}
              className="text-small font-semibold text-ink-mute dark:text-d-textMute disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
      </AdmCard>
    </div>
  );
}
