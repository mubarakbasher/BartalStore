import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { apiBaseUrl } from '@/lib/api/base-url';
import type { Product } from '@/lib/api/types';
import type { PaginationMeta } from '@bartal/shared';
import { ProductCard } from '@/components/ProductCard';
import { SearchIcon } from '@/components/Icons';
import { BARTAL } from '@/design/tokens';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export const dynamic = 'force-dynamic';

async function search(locale: Locale, q: string) {
  if (!q.trim()) return { products: [], meta: null };
  const url = new URL('products/search', apiBaseUrl() + '/');
  url.searchParams.set('q', q);
  url.searchParams.set('limit', '24');
  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': locale },
      cache: 'no-store',
    });
    const json = (await res.json()) as { success: boolean; data: Product[]; meta: PaginationMeta };
    return json.success ? { products: json.data, meta: json.meta } : { products: [], meta: null };
  } catch {
    return { products: [], meta: null };
  }
}

export default async function SearchPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const q = (searchParams.q ?? '').trim();
  const { products, meta } = await search(locale, q);

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-8">
      <h1 className="text-h1 font-bold text-ink mb-4">
        {locale === 'ar' ? 'البحث' : 'Search'}
      </h1>

      <form
        action={`/${locale}/search`}
        className="bg-white border border-line rounded-bartal-lg p-2 flex items-center gap-2 max-w-xl mb-8"
      >
        <SearchIcon size={18} color={BARTAL.textMute} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={dict.web.search.placeholder}
          className="flex-1 h-10 bg-transparent text-body text-ink placeholder:text-ink-mute focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 px-4 bg-amber text-white rounded-bartal font-semibold text-small hover:bg-amber-hover"
        >
          {locale === 'ar' ? 'بحث' : 'Search'}
        </button>
      </form>

      {q && (
        <div className="text-small text-ink-mute mb-5">
          {meta ? `${meta.total} ${locale === 'ar' ? 'نتيجة لـ' : 'results for'}` : ''}{' '}
          <span className="text-ink font-semibold">&ldquo;{q}&rdquo;</span>
        </div>
      )}

      {q && products.length === 0 ? (
        <div className="bg-white border border-line rounded-bartal-lg p-16 text-center">
          <div className="text-h2 text-ink mb-2">{dict.web.search.noResults}</div>
          <div className="text-small text-ink-mute">
            {locale === 'ar' ? 'جرب كلمة مختلفة.' : 'Try a different keyword.'}
          </div>
        </div>
      ) : !q ? (
        <div className="text-small text-ink-mute">
          {locale === 'ar' ? 'أدخل كلمة بحث للبدء.' : 'Enter a keyword to start.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
