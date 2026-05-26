import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmTabs, type AdmTabItem } from '@/components/primitives/AdmTabs';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { PriceTag } from '@/components/primitives/PriceTag';
import { useAdminCategories, useAdminProducts, type AdminProductsParams } from '@/lib/api/queries';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { AdminProductListItem } from '@/lib/api/types';

type TabKey = NonNullable<AdminProductsParams['status']>;

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(handle);
  }, [value, ms]);
  return debounced;
}

export function ProductsPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.products.title);
  const [search, setSearch] = useSearchParams();

  const tab = (search.get('tab') as TabKey | null) ?? 'all';
  const page = Math.max(1, Number(search.get('page') ?? '1') || 1);
  const category = search.get('category') ?? '';
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

  const params: AdminProductsParams = useMemo(
    () => ({
      page,
      limit: 25,
      status: tab,
      category: category || undefined,
      q: q || undefined,
    }),
    [page, tab, category, q],
  );
  const { data, isLoading } = useAdminProducts(params);
  const { data: categories = [] } = useAdminCategories();

  const counts = data?.counts;
  const tabs: AdmTabItem<TabKey>[] = [
    { id: 'all', label: dict.products.tabs.all, count: counts?.all },
    { id: 'active', label: dict.products.tabs.active, count: counts?.active },
    { id: 'inactive', label: dict.products.tabs.inactive, count: counts?.inactive },
    { id: 'out_of_stock', label: dict.products.tabs.out_of_stock, count: counts?.out_of_stock },
    { id: 'featured', label: dict.products.tabs.featured, count: counts?.featured },
  ];

  const columns = useMemo<ColumnDef<AdminProductListItem>[]>(
    () => [
      {
        header: dict.products.columns.product,
        cell: ({ row }) => (
          <Link to={`/products/${row.original.id}/edit`} className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-bartal bg-sand dark:bg-d-raised shrink-0 overflow-hidden">
              {row.original.primary_image_url && (
                <img
                  src={row.original.primary_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-small font-semibold text-ink dark:text-d-text truncate">
                {locale === 'ar' ? row.original.name_ar : row.original.name_en}
              </div>
              <div className="text-micro text-ink-mute dark:text-d-textMute font-mono truncate">
                {row.original.slug}
              </div>
            </div>
          </Link>
        ),
      },
      {
        header: dict.products.columns.category,
        cell: ({ row }) => (
          <span className="text-small text-ink dark:text-d-text">
            {locale === 'ar' ? row.original.category.name_ar : row.original.category.name_en}
          </span>
        ),
      },
      {
        header: dict.products.columns.price,
        cell: ({ row }) => <PriceTag amount={row.original.price} locale={locale} />,
      },
      {
        header: dict.products.columns.stock,
        cell: ({ row }) => {
          const stock = row.original.stock;
          const low = row.original.low_stock_threshold;
          const color =
            stock <= 0
              ? 'text-danger'
              : stock <= low
                ? 'text-amber'
                : 'text-ok';
          return (
            <span className={`text-small font-mono font-semibold ${color}`}>
              {stock}
            </span>
          );
        },
      },
      {
        header: dict.products.columns.status,
        cell: ({ row }) => {
          const p = row.original;
          const label = !p.is_active
            ? dict.products.statusInactive
            : p.stock <= 0
              ? dict.products.statusOos
              : p.is_featured
                ? dict.products.featured
                : dict.products.statusActive;
          const style = !p.is_active
            ? 'bg-line text-ink-mute'
            : p.stock <= 0
              ? 'bg-danger/15 text-danger'
              : p.is_featured
                ? 'bg-amber-tint text-amber'
                : 'bg-ok/15 text-ok';
          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-micro font-semibold ${style}`}>
              {label}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Link
            to={`/products/${row.original.id}/edit`}
            className="text-small font-semibold text-amber hover:underline"
          >
            {dict.products.edit}
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
      <div className="flex items-center justify-between gap-3 flex-wrap">
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
        <Link to="/products/new">
          <AdmButton variant="primary">{dict.products.newProduct}</AdmButton>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <AdmInput
          placeholder={dict.products.searchPlaceholder}
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          className="max-w-sm"
        />
        <AdmSelect
          value={category}
          onChange={(e) => {
            const next = new URLSearchParams(search);
            if (e.target.value) next.set('category', e.target.value);
            else next.delete('category');
            next.set('page', '1');
            setSearch(next, { replace: true });
          }}
        >
          <option value="">{dict.products.categoryAll}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {locale === 'ar' ? c.name_ar : c.name_en}
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
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <AdmEmptyState title={dict.products.empty} />
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
