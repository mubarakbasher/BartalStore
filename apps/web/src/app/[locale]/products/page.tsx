import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary, tt } from '@/lib/i18n/dictionary';
import { apiGet } from '@/lib/api/client';
import type { CategoryNode, Product } from '@/lib/api/types';
import type { PaginationMeta } from '@bartal/shared';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SortChips } from '@/components/SortChips';
import { bilingualAlternates } from '@/lib/seo/site';

interface ProductsSearchParams {
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: string;
}

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ProductsSearchParams>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: ProductsPageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const base = locale === 'ar' ? 'جميع المنتجات' : 'All products';
  const title = searchParams.category ? `${base} · ${searchParams.category}` : base;
  const description =
    locale === 'ar'
      ? 'تسوّق آلاف المنتجات بأسعار مميزة وتوصيل سريع في الخرطوم.'
      : 'Shop thousands of products at great prices with fast delivery across Khartoum.';
  return {
    title,
    description,
    alternates: bilingualAlternates(searchParams.category ? `/products?category=${searchParams.category}` : '/products'),
  };
}

async function fetchPage(locale: Locale, params: ProductsSearchParams) {
  const page = Number(params.page ?? '1') || 1;
  const url = new URL(
    'products',
    (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api') + '/',
  );
  const query: Record<string, string> = { limit: '24', page: String(page) };
  if (params.category) query.category = params.category;
  if (params.sort) query.sort = params.sort;
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': locale },
      cache: 'no-store',
    });
    const json = (await res.json()) as { success: boolean; data: Product[]; meta: PaginationMeta };
    if (!json.success) return { products: [], meta: null };
    return { products: json.data, meta: json.meta };
  } catch {
    return { products: [], meta: null };
  }
}

async function fetchCategories(locale: Locale): Promise<CategoryNode[]> {
  try {
    return await apiGet<CategoryNode[]>('categories', {}, locale);
  } catch {
    return [];
  }
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const [{ products, meta }, categories] = await Promise.all([
    fetchPage(locale, searchParams),
    fetchCategories(locale),
  ]);

  const activeCategory = categories.find((c) => c.slug === searchParams.category);
  const title = activeCategory
    ? locale === 'ar'
      ? activeCategory.name_ar
      : activeCategory.name_en
    : locale === 'ar'
      ? 'جميع المنتجات'
      : 'All products';

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-micro text-ink-mute flex items-center gap-2 mb-2 normal-case tracking-normal">
        <Link href={`/${locale}`} className="hover:text-ink">
          {dict.web.nav.home}
        </Link>
        <span>{locale === 'ar' ? '◂' : '▸'}</span>
        <span className="text-ink font-semibold">{title}</span>
      </nav>

      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-h1 text-ink font-bold">{title}</h1>
          <div className="text-small text-ink-mute mt-1">
            {tt(dict.web.filters.productsCount, { count: meta?.total ?? products.length })}
          </div>
        </div>
        <SortChips dict={dict} active={searchParams.sort} />
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden lg:block">
          <CategoryFilter
            locale={locale}
            dict={dict}
            categories={categories}
            active={searchParams.category}
          />
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="bg-white border border-line rounded-bartal-lg p-16 text-center">
              <div className="text-h2 text-ink mb-2">{dict.web.search.noResults}</div>
              <div className="text-small text-ink-mute">
                {locale === 'ar'
                  ? 'جرّب تغيير الفلاتر أو إعادة الترتيب.'
                  : 'Try changing the filters or sort order.'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <Pagination locale={locale} meta={meta} searchParams={searchParams} />
          )}
        </div>
      </div>
    </div>
  );
}

function Pagination({
  locale,
  meta,
  searchParams,
}: {
  locale: Locale;
  meta: PaginationMeta;
  searchParams: ProductsSearchParams;
}) {
  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.sort) params.set('sort', searchParams.sort);
    params.set('page', String(p));
    return `/${locale}/products?${params.toString()}`;
  };
  return (
    <nav className="mt-8 flex justify-center gap-1.5">
      {pages.map((p) => {
        const on = p === meta.page;
        return (
          <Link
            key={p}
            href={buildHref(p)}
            className={`min-w-[36px] h-9 px-3 rounded-bartal text-small font-semibold flex items-center justify-center transition-colors ${
              on ? 'bg-amber text-white' : 'bg-white border border-line text-ink hover:bg-sand'
            }`}
          >
            {p}
          </Link>
        );
      })}
    </nav>
  );
}
