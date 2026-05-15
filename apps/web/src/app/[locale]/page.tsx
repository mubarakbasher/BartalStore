import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionary';
import { apiGet } from '@/lib/api/client';
import type { CategoryNode, Product } from '@/lib/api/types';
import { Hero } from '@/components/Hero';
import { FeaturedGrid } from '@/components/FeaturedGrid';
import { CategoryTiles } from '@/components/CategoryTiles';

interface PageProps {
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

async function fetchHome(locale: Locale) {
  try {
    const [products, categories] = await Promise.all([
      apiGet<{ data: Product[] }>('products', { limit: 8 }, locale).catch(() => null),
      apiGet<CategoryNode[]>('categories', {}, locale).catch(() => null),
    ]);
    // apiGet for paginated /products returns the unwrapped envelope's `data`,
    // which the interceptor hoists to an array.
    const productsArr = Array.isArray(products) ? (products as unknown as Product[]) : [];
    return {
      products: productsArr,
      categories: categories ?? [],
    };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function HomePage({ params }: PageProps) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const { products, categories } = await fetchHome(locale);
  const featured = products.filter((p) => p.is_featured).slice(0, 4);
  const fallback = featured.length >= 4 ? featured : products.slice(0, 4);

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-8 space-y-10">
      <Hero locale={locale} dict={dict} />
      <CategoryTiles locale={locale} dict={dict} categories={categories} />
      <FeaturedGrid
        title={dict.web.sections.featured}
        seeAllLabel={dict.web.sections.seeAll}
        href={`/${locale}/products`}
        products={fallback}
        locale={locale}
      />
      <FeaturedGrid
        title={dict.web.sections.newArrivals}
        seeAllLabel={dict.web.sections.seeAll}
        href={`/${locale}/products?sort=newest`}
        products={products.slice(0, 4)}
        locale={locale}
      />
      <TrustStrip locale={locale} />
    </div>
  );
}

function TrustStrip({ locale }: { locale: Locale }) {
  const items = [
    {
      ar: ['توصيل سريع', 'الخرطوم وأطرافها'],
      en: ['Fast delivery', 'Across all Khartoum zones'],
      icon: '🚚',
    },
    {
      ar: ['دفع آمن', 'تحويل بنكي محلي أو COD'],
      en: ['Safe payment', 'Local bank transfer or COD'],
      icon: '🔒',
    },
    {
      ar: ['دعم بالواتساب', 'متاح كل يوم من ٩ص–٩م'],
      en: ['WhatsApp support', 'Daily from 9am to 9pm'],
      icon: '💬',
    },
    {
      ar: ['ضمان الإرجاع', 'حتى ٧ أيام من التسليم'],
      en: ['Easy returns', 'Within 7 days of delivery'],
      icon: '↺',
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-line">
      {items.map((it, i) => {
        const [title, body] = it[locale];
        return (
          <div key={i} className="flex items-start gap-3 px-2">
            <div className="text-2xl shrink-0" aria-hidden>{it.icon}</div>
            <div>
              <div className="text-small font-bold text-ink">{title}</div>
              <div className="text-micro text-ink-mute mt-0.5 leading-relaxed normal-case tracking-normal">
                {body}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
