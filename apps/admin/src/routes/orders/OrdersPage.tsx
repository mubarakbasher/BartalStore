import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import type { DeliveryZone, OrderStatus } from '@bartal/shared';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmStatusPill } from '@/components/primitives/AdmStatusPill';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { AdmTabs, type AdmTabItem } from '@/components/primitives/AdmTabs';
import { PriceTag } from '@/components/primitives/PriceTag';
import { useAdminOrders } from '@/lib/api/queries';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { AdminOrderListItem } from '@/lib/api/types';

type TabKey =
  | 'all'
  | 'RECEIPT_UPLOADED'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

const TAB_TO_STATUS: Record<TabKey, OrderStatus | undefined> = {
  all: undefined,
  RECEIPT_UPLOADED: 'RECEIPT_UPLOADED' as OrderStatus,
  AWAITING_PAYMENT: 'AWAITING_PAYMENT' as OrderStatus,
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED' as OrderStatus,
  PROCESSING: 'PROCESSING' as OrderStatus,
  SHIPPED: 'SHIPPED' as OrderStatus,
  DELIVERED: 'DELIVERED' as OrderStatus,
  CANCELLED: 'CANCELLED' as OrderStatus,
};

const ZONES: DeliveryZone[] = ['ZONE_A', 'ZONE_B', 'ZONE_C', 'ZONE_D'] as DeliveryZone[];

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(handle);
  }, [value, ms]);
  return debounced;
}

export function OrdersPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.orders.title);

  const [search, setSearch] = useSearchParams();

  const tab = (search.get('tab') as TabKey | null) ?? 'all';
  const page = Math.max(1, Number(search.get('page') ?? '1') || 1);
  const zone = search.get('zone') ?? '';
  const q = search.get('q') ?? '';
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

  const params = useMemo(
    () => ({
      page,
      limit: 25,
      status: TAB_TO_STATUS[tab],
      zone: zone || undefined,
      q: q || undefined,
    }),
    [page, tab, zone, q],
  );
  const { data, isLoading, isError, refetch } = useAdminOrders(params);

  const tabs: AdmTabItem<TabKey>[] = [
    { id: 'all', label: dict.orders.tabs.all },
    { id: 'RECEIPT_UPLOADED', label: dict.orders.tabs.needsReview },
    { id: 'AWAITING_PAYMENT', label: dict.orders.tabs.pending },
    { id: 'PAYMENT_CONFIRMED', label: dict.orders.tabs.confirmed },
    { id: 'PROCESSING', label: locale === 'ar' ? 'قيد التحضير' : 'Processing' },
    { id: 'SHIPPED', label: dict.orders.tabs.shipped },
    { id: 'DELIVERED', label: dict.orders.tabs.delivered },
    { id: 'CANCELLED', label: dict.orders.tabs.cancelled },
  ];

  const columns = useMemo<ColumnDef<AdminOrderListItem>[]>(
    () => [
      {
        header: dict.orders.columns.orderNumber,
        accessorKey: 'order_number',
        cell: ({ row }) => (
          <Link
            to={`/orders/${row.original.id}`}
            className="font-mono text-small font-semibold text-navy dark:text-d-text hover:underline"
          >
            {row.original.order_number}
          </Link>
        ),
      },
      {
        header: dict.orders.columns.customer,
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="text-small font-semibold text-ink dark:text-d-text truncate">
              {row.original.user.name}
            </div>
            <div className="text-micro text-ink-mute dark:text-d-textMute font-mono" dir="ltr">
              {row.original.user.phone}
            </div>
          </div>
        ),
      },
      {
        header: dict.orders.columns.placed,
        accessorKey: 'created_at',
        cell: ({ getValue }) => {
          const iso = getValue<string>();
          return (
            <span className="text-small text-ink dark:text-d-text">
              {new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
              })}
            </span>
          );
        },
      },
      {
        header: dict.orders.columns.total,
        accessorKey: 'total',
        cell: ({ getValue }) => <PriceTag amount={Number(getValue<number>())} locale={locale} />,
      },
      {
        header: dict.orders.columns.payment,
        accessorKey: 'payment_method',
        cell: ({ getValue }) => {
          const method = getValue<'BANK_TRANSFER' | 'CASH_ON_DELIVERY'>();
          return (
            <span className="text-small text-ink dark:text-d-text">
              {dict.orders.paymentMethods[method]}
            </span>
          );
        },
      },
      {
        header: dict.orders.columns.status,
        accessorKey: 'status',
        cell: ({ getValue }) => <AdmStatusPill status={getValue<OrderStatus>()} locale={locale} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Link
            to={`/orders/${row.original.id}`}
            className="text-small font-semibold text-amber hover:underline"
          >
            {dict.orders.view}
          </Link>
        ),
      },
    ],
    [dict, locale],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4">
      <AdmTabs
        items={tabs}
        active={tab}
        onChange={(id) => {
          const next = new URLSearchParams(search);
          next.set('tab', id);
          next.set('page', '1');
          setSearch(next, { replace: true });
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <AdmInput
          placeholder={dict.orders.searchPlaceholder}
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          className="max-w-xs"
        />
        <AdmSelect
          value={zone}
          onChange={(e) => {
            const next = new URLSearchParams(search);
            if (e.target.value) next.set('zone', e.target.value);
            else next.delete('zone');
            next.set('page', '1');
            setSearch(next, { replace: true });
          }}
        >
          <option value="">{dict.orders.zoneAll}</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z.replace('_', ' ')}
            </option>
          ))}
        </AdmSelect>
      </div>

      <AdmCard padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-sand dark:bg-d-raised">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((h) => (
                    <th
                      key={h.id}
                      className="text-micro uppercase tracking-wider text-ink-mute dark:text-d-textMute px-4 py-2.5 text-start font-semibold"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-line dark:divide-d-line">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-small text-ink-mute dark:text-d-textMute">
                    {dict.common.loading}
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length}>
                    <AdmEmptyState
                      title={locale === 'ar' ? 'تعذّر تحميل الطلبات' : "Couldn't load orders"}
                      body={locale === 'ar' ? 'يرجى المحاولة مرة أخرى.' : 'Please try again.'}
                      action={
                        <AdmButton size="sm" variant="ghost" onClick={() => refetch()}>
                          {dict.common.retry}
                        </AdmButton>
                      }
                    />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <AdmEmptyState title={dict.orders.empty} />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-sand/50 dark:hover:bg-d-raised/40">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
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
